import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ListSubheader,
    MenuItem,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import { I18n } from '@iobroker/gui-components';
import type { RxWidgetInfo, RxWidgetInfoCustomComponentProperties } from '@iobroker/types-vis-2';

import {
    type DesignData,
    type DesignGroup,
    type DesignSpec,
    buildApplyPatch,
    extractDesign,
    getDesignGroups,
    sanitizeDesign,
} from './designFields';
import {
    type DesignPreset,
    createPreset,
    importPresetFile,
    MAX_IMPORT_FILE_SIZE,
    loadPresets,
    nameKey,
    serializePresets,
    updatePresets,
    errorText,
} from './presetStore';
import { BuiltinChip } from './BuiltinChip';
import { captureWidgetThumbnail } from './thumbnail';
import { getThemeMapping } from '../themes/themeMaps';

const I18N_PREFIX = 'vis_2_widgets_inventwo_';
const t = (key: string, ...args: (string | number)[]): string => I18n.t(`${I18N_PREFIX}${key}`, ...args);

/** Key of the quick copy/paste buffer in the browser, one per widget type */
const clipboardKey = (widget: string): string => `inventwo.designClipboard.${widget}`;

/**
 * Value of a preset in the dropdown. Built-in and own presets are kept apart, because an own preset saved before a
 * built-in preset of the same name was shipped is still listed (and can be deleted).
 */
const presetKey = (preset: Pick<DesignPreset, 'name' | 'builtin'>): string =>
    `${preset.builtin ? 'builtin' : 'user'}:${preset.name}`;

interface DesignPresetFieldProps {
    getWidgetInfo: () => RxWidgetInfo;
    spec: DesignSpec;
    data: Record<string, unknown>;
    onDataChange: (newData: Record<string, unknown>) => void;
    fieldProps: RxWidgetInfoCustomComponentProperties;
}

interface DesignPresetFieldState {
    presets: DesignPreset[];
    /** `presetKey` of the selected preset */
    selected: string;
    status: { kind: 'ok' | 'error'; text: string } | null;
    busy: boolean;
    dialog: 'save' | 'delete' | null;
    name: string;
}

/** Checkerboard behind thumbnails, so transparent parts are visible in the light and the dark theme */
const thumbnailBackground = (theme: Theme): Record<string, unknown> => ({
    borderRadius: 0.5,
    overflow: 'hidden',
    background: `repeating-conic-gradient(${theme.palette.action.selected} 0% 25%, transparent 0% 50%) 50% / 12px 12px`,
});

/**
 * A group of icon buttons in the action row. Groups are separated by a thin line on their left side; each group is
 * moved 1px to the left and the row clips its overflow, so a group at the start of a (wrapped) line shows no line.
 */
const buttonGroup: SxProps<Theme> = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.25,
    ml: '-1px',
    px: 0.5,
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 6,
        bottom: 6,
        borderLeft: 1,
        borderColor: 'divider',
    },
};

/** Small icon button with the label as tooltip; the span keeps the tooltip working while the button is disabled */
function iconButton(
    title: string,
    icon: React.JSX.Element,
    onClick: () => void,
    disabled: boolean,
    color: 'default' | 'primary' = 'default',
): React.JSX.Element {
    return (
        <Tooltip
            title={title}
            disableInteractive
        >
            <span>
                <IconButton
                    size="small"
                    color={color}
                    disabled={disabled}
                    onClick={onClick}
                    aria-label={title}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );
}

function download(fileName: string, text: string): void {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function safeFileName(name: string): string {
    return name.replace(/[^\w\- ]+/g, '_').trim() || 'preset';
}

/**
 * Attribute field with the design presets of a widget type. Fast Refresh is switched off for `src/utils` in
 * `vite.config.ts`, because vis-2 loads the widget set via module federation without the refresh preamble.
 */
class DesignPresetField extends React.Component<DesignPresetFieldProps, DesignPresetFieldState> {
    private readonly info: RxWidgetInfo;
    private readonly groups: DesignGroup[];
    private readonly fileInput = React.createRef<HTMLInputElement>();
    private mounted = false;

    constructor(props: DesignPresetFieldProps) {
        super(props);
        this.info = props.getWidgetInfo();
        this.groups = getDesignGroups(this.info, props.spec);
        this.state = { presets: [], selected: '', status: null, busy: false, dialog: null, name: '' };
    }

    componentDidMount(): void {
        this.mounted = true;
        void this.reload();
    }

    componentWillUnmount(): void {
        this.mounted = false;
    }

    private get widget(): string {
        return this.info.id;
    }

    private get socket(): RxWidgetInfoCustomComponentProperties['context']['socket'] {
        return this.props.fieldProps.context.socket;
    }

    private get single(): boolean {
        const selected = this.props.fieldProps.selectedWidgets;
        return !Array.isArray(selected) || selected.length === 1;
    }

    /** ID of the widget a thumbnail is taken from; only when exactly one widget is selected */
    private get selectedWidgetId(): string | undefined {
        const { selectedWidgets, selectedWidget } = this.props.fieldProps;
        if (Array.isArray(selectedWidgets)) {
            return selectedWidgets.length === 1 ? String(selectedWidgets[0]) : undefined;
        }
        return selectedWidget ? String(selectedWidget) : undefined;
    }

    /**
     * True if a selected widget is of another type. The editor shows the group for a mixed selection too (same group
     * name in every widget), but the design attributes of this type must not be written into other widget types.
     */
    private get mixedTypes(): boolean {
        const { selectedWidgets, selectedView, context } = this.props.fieldProps;
        const widgets = context.views[selectedView]?.widgets;
        return (
            Array.isArray(selectedWidgets) &&
            !!widgets &&
            selectedWidgets.some(id => !!widgets[id] && widgets[id].tpl !== this.widget)
        );
    }

    private get selectedPreset(): DesignPreset | undefined {
        return this.state.presets.find(p => presetKey(p) === this.state.selected);
    }

    private get userPresets(): DesignPreset[] {
        return this.state.presets.filter(p => !p.builtin);
    }

    private setStatus(kind: 'ok' | 'error', text: string): void {
        if (this.mounted) {
            this.setState({ status: { kind, text } });
        }
    }

    /**
     * Loads the built-in and own presets; `select` picks an own preset by name, otherwise the current selection is
     * kept if possible. If the own presets cannot be read, the built-in ones are listed with the error message.
     */
    private async reload(select?: string): Promise<void> {
        const { presets, error } = await loadPresets(this.socket, this.widget, this.groups);
        if (!this.mounted) {
            return;
        }
        if (error) {
            this.setStatus('error', `${t('design_preset_error_load')}: ${errorText(error)}`);
        }
        this.setState(state => {
            const wanted = select === undefined ? state.selected : presetKey({ name: select });
            return {
                presets,
                selected: presets.some(p => presetKey(p) === wanted) ? wanted : presets[0] ? presetKey(presets[0]) : '',
            };
        });
    }

    /** True if the name is reserved by a built-in preset of this widget type (trimmed, case-insensitive) */
    private isReservedName(name: string): boolean {
        const key = nameKey(name);
        return this.state.presets.some(p => p.builtin && nameKey(p.name) === key);
    }

    private async run(action: () => Promise<string>): Promise<void> {
        this.setState({ busy: true });
        try {
            this.setStatus('ok', await action());
        } catch (e) {
            this.setStatus('error', `${t('design_preset_error_storage')}: ${errorText(e)}`);
        } finally {
            if (this.mounted) {
                this.setState({ busy: false });
            }
        }
    }

    private currentDesign(): DesignData {
        return extractDesign(this.info, this.props.spec, this.props.data, this.props.fieldProps.context.views);
    }

    /**
     * Fields the theme controls in the selected widgets that are coupled to a theme. A preset only brings the form
     * into such widgets: colors, corners, border, shadow and font stay with the theme (and own values stay own).
     */
    private themeControlledFields(setup: DesignData = {}): Set<string> {
        const { selectedWidgets, selectedView, context } = this.props.fieldProps;
        const widgets = context.views[selectedView]?.widgets;
        const ids = Array.isArray(selectedWidgets) ? selectedWidgets.map(String) : [this.selectedWidgetId];
        const dataList: Record<string, any>[] = [];
        ids.forEach(id => {
            const widget = id && widgets ? widgets[id as keyof typeof widgets] : undefined;
            if (widget?.tpl === this.widget && widget.data) {
                dataList.push(widget.data as Record<string, any>);
            }
        });
        if (!dataList.length && this.props.data) {
            dataList.push(this.props.data);
        }
        const fields = new Set<string>();
        dataList
            .filter(data => !!data.designTheme)
            // the mapping of the Universal widget depends on mode and number of states, which a setup may change
            .forEach(data =>
                Object.keys(getThemeMapping(this.widget, { ...data, ...setup })).forEach(field => fields.add(field)),
            );
        return fields;
    }

    /**
     * Writes the design (and the basic setup of a built-in preset) into the selected widgets; returns true if
     * theme-controlled fields were left out
     */
    private apply(design: DesignData, setup: DesignData = {}): boolean {
        const themed = this.themeControlledFields(setup);
        const values: DesignData = {};
        let skipped = false;
        Object.entries(design).forEach(([key, value]) => {
            if (themed.has(key)) {
                skipped = true;
            } else {
                values[key] = value;
            }
        });
        this.props.onDataChange({ ...buildApplyPatch(this.groups, values), ...setup });
        return skipped;
    }

    private onCopy = (): void => {
        window.localStorage.setItem(clipboardKey(this.widget), JSON.stringify(this.currentDesign()));
        this.setStatus('ok', t('design_preset_copied'));
    };

    private onPaste = (): void => {
        let raw: unknown = null;
        try {
            raw = JSON.parse(window.localStorage.getItem(clipboardKey(this.widget)) || 'null');
        } catch {
            raw = null;
        }
        const design = sanitizeDesign(this.groups, raw);
        if (!Object.keys(design).length) {
            this.setStatus('error', t('design_preset_clipboard_empty'));
            return;
        }
        const themed = this.apply(design);
        this.setStatus('ok', t(themed ? 'design_preset_pasted_themed' : 'design_preset_pasted'));
    };

    private onApply = (): void => {
        const preset = this.selectedPreset;
        if (preset) {
            const setup = preset.setup ?? {};
            const themed = this.apply(preset.design, setup);
            let text = t(themed ? 'design_preset_applied_themed' : 'design_preset_applied', preset.name);
            if (Object.keys(setup).length) {
                text = `${text}. ${t('design_preset_applied_setup')}`;
            }
            this.setStatus('ok', text);
        }
    };

    private onSave = (): void => {
        // The dialog stays open with an error message while the name is empty or reserved by a built-in preset
        if (!this.state.name.trim() || this.isReservedName(this.state.name)) {
            return;
        }
        const name = this.state.name;
        const design = this.currentDesign();
        const widgetId = this.selectedWidgetId;
        this.setState({ dialog: null });
        void this.run(async () => {
            const thumbnail = widgetId ? await captureWidgetThumbnail(widgetId) : undefined;
            const preset = createPreset(name, this.widget, this.props.spec.version, design, thumbnail);
            await updatePresets(this.socket, this.widget, [preset]);
            await this.reload(preset.name);
            return t('design_preset_saved', preset.name);
        });
    };

    private onDelete = (): void => {
        const preset = this.selectedPreset;
        this.setState({ dialog: null });
        if (!preset || preset.builtin) {
            return;
        }
        void this.run(async () => {
            await updatePresets(this.socket, this.widget, [], [preset.name]);
            await this.reload();
            return t('design_preset_deleted', preset.name);
        });
    };

    private onImportFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) {
            return;
        }
        void this.run(async () => {
            if (file.size > MAX_IMPORT_FILE_SIZE) {
                throw new Error(t('design_preset_error_import'));
            }
            const result = await importPresetFile(this.socket, await file.text(), [
                { widget: this.widget, groups: this.groups },
            ]);
            if (!result) {
                throw new Error(t('design_preset_error_import'));
            }
            const imported = result[0]?.presets ?? [];
            if (!imported.length) {
                return t('design_preset_imported_none');
            }
            await this.reload(imported[0].name);
            return t('design_preset_imported', imported.length);
        });
    };

    render(): React.JSX.Element {
        const { presets, selected, status, busy, dialog, name } = this.state;
        const selectedPreset = this.selectedPreset;
        const userPresets = this.userPresets;
        const builtinPresets = presets.filter(p => p.builtin);
        const nameReserved = this.isReservedName(name);
        const nameExists = !nameReserved && userPresets.some(p => p.name === name.trim());
        const noSelection = busy || !selectedPreset;
        const mixedTypes = this.mixedTypes;

        const renderItem = (p: DesignPreset): React.JSX.Element => (
            <MenuItem
                key={presetKey(p)}
                value={presetKey(p)}
                sx={{ gap: 1, minHeight: 40 }}
            >
                <Box sx={[thumbnailBackground, { width: 48, height: 32, flexShrink: 0 }]}>
                    {p.thumbnail ? (
                        <Box
                            component="img"
                            src={p.thumbnail}
                            alt=""
                            sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                        />
                    ) : null}
                </Box>
                <Typography
                    variant="body2"
                    noWrap
                >
                    {p.name}
                </Typography>
            </MenuItem>
        );
        // Section headers only when there are built-in presets; MUI's Select skips ListSubheader when selecting
        const sectionHeader = (key: string, label: string): React.JSX.Element => (
            <ListSubheader
                key={key}
                sx={{ lineHeight: '32px' }}
            >
                {label}
            </ListSubheader>
        );
        const menuItems: React.JSX.Element[] = builtinPresets.length
            ? [
                  sectionHeader('builtin', t('design_preset_section_builtin')),
                  ...builtinPresets.map(renderItem),
                  ...(userPresets.length
                      ? [sectionHeader('user', t('design_preset_section_user')), ...userPresets.map(renderItem)]
                      : []),
              ]
            : userPresets.map(renderItem);

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, width: '100%', minWidth: 0, py: 0.5 }}>
                <TextField
                    select
                    size="small"
                    variant="standard"
                    fullWidth
                    label={t('design_preset_select')}
                    value={selectedPreset ? selected : ''}
                    onChange={e => this.setState({ selected: e.target.value })}
                    disabled={busy || !presets.length}
                    helperText={presets.length ? undefined : t('design_preset_none')}
                    slotProps={{
                        select: {
                            renderValue: () => (
                                <Box
                                    component="span"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}
                                >
                                    <Box
                                        component="span"
                                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        {selectedPreset?.name}
                                    </Box>
                                    {selectedPreset?.builtin ? <BuiltinChip /> : null}
                                </Box>
                            ),
                        },
                    }}
                >
                    {menuItems}
                </TextField>

                {selectedPreset?.thumbnail ? (
                    <Box sx={{ position: 'relative', alignSelf: 'flex-start' }}>
                        <Box sx={[thumbnailBackground, { maxWidth: 140, p: 0.5, border: 1, borderColor: 'divider' }]}>
                            <Box
                                component="img"
                                src={selectedPreset.thumbnail}
                                alt={selectedPreset.name}
                                sx={{ display: 'block', maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }}
                            />
                        </Box>
                        {selectedPreset.builtin ? (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'background.paper',
                                    borderRadius: 4,
                                }}
                            >
                                <BuiltinChip />
                            </Box>
                        ) : null}
                    </Box>
                ) : null}

                {/* One row in groups: preset actions | quick copy | files. A group wraps as a whole if space is short;
                    the negative margin lines up the first button with the dropdown (see `buttonGroup`) */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        rowGap: 0.25,
                        overflow: 'hidden',
                        ml: '-3px',
                    }}
                >
                    <Box sx={buttonGroup}>
                        {iconButton(
                            t('design_preset_apply'),
                            <DoneIcon fontSize="small" />,
                            this.onApply,
                            noSelection || mixedTypes,
                            'primary',
                        )}
                        {iconButton(
                            t('design_preset_save'),
                            <SaveIcon fontSize="small" />,
                            // A built-in preset cannot be overwritten, so its name is not suggested
                            () =>
                                this.setState({
                                    name: selectedPreset && !selectedPreset.builtin ? selectedPreset.name : '',
                                    dialog: 'save',
                                }),
                            busy || !this.single,
                        )}
                        {iconButton(
                            selectedPreset?.builtin ? t('design_preset_builtin_readonly') : t('design_preset_delete'),
                            <DeleteIcon fontSize="small" />,
                            () => this.setState({ dialog: 'delete' }),
                            noSelection || !!selectedPreset?.builtin,
                        )}
                    </Box>
                    <Box sx={buttonGroup}>
                        {iconButton(
                            t('design_preset_copy'),
                            <ContentCopyIcon fontSize="small" />,
                            this.onCopy,
                            busy || !this.single,
                        )}
                        {iconButton(
                            t('design_preset_paste'),
                            <ContentPasteIcon fontSize="small" />,
                            this.onPaste,
                            busy || mixedTypes,
                        )}
                    </Box>
                    <Box sx={buttonGroup}>
                        {iconButton(
                            t('design_preset_import'),
                            <FileUploadIcon fontSize="small" />,
                            () => this.fileInput.current?.click(),
                            busy,
                        )}
                        {iconButton(
                            t('design_preset_export'),
                            <FileDownloadIcon fontSize="small" />,
                            () =>
                                selectedPreset &&
                                download(
                                    `${safeFileName(selectedPreset.name)}.json`,
                                    serializePresets([selectedPreset]),
                                ),
                            noSelection,
                        )}
                        {iconButton(
                            t('design_preset_export_all'),
                            <DownloadForOfflineIcon fontSize="small" />,
                            // Only the own presets: the built-in ones ship with the adapter anyway
                            () => download('inventwo-design-presets.json', serializePresets(userPresets)),
                            busy || !userPresets.length,
                        )}
                    </Box>
                    <input
                        ref={this.fileInput}
                        type="file"
                        accept="application/json,.json"
                        style={{ display: 'none' }}
                        onChange={this.onImportFile}
                    />
                </Box>

                {mixedTypes ? (
                    <Typography
                        variant="caption"
                        color="warning.main"
                    >
                        {t('design_preset_mixed_types')}
                    </Typography>
                ) : null}

                {status ? (
                    <Typography
                        variant="caption"
                        color={status.kind === 'error' ? 'error' : 'success.main'}
                    >
                        {status.text}
                    </Typography>
                ) : null}

                <Dialog
                    open={dialog === 'save'}
                    onClose={() => this.setState({ dialog: null })}
                    fullWidth
                    maxWidth="xs"
                >
                    <DialogTitle>{t('design_preset_save_title')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            fullWidth
                            variant="standard"
                            label={t('design_preset_name')}
                            value={name}
                            onChange={e => this.setState({ name: e.target.value })}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    this.onSave();
                                }
                            }}
                            error={nameReserved}
                            helperText={
                                nameReserved
                                    ? t('design_preset_name_reserved')
                                    : nameExists
                                      ? t('design_preset_overwrite')
                                      : ' '
                            }
                            slotProps={{
                                htmlInput: { maxLength: 100 },
                                formHelperText: {
                                    sx: { color: nameExists && !nameReserved ? 'warning.main' : undefined },
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ dialog: null })}>{t('design_preset_cancel')}</Button>
                        <Button
                            variant="contained"
                            disabled={!name.trim() || nameReserved}
                            onClick={this.onSave}
                        >
                            {t('design_preset_save_button')}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={dialog === 'delete'}
                    onClose={() => this.setState({ dialog: null })}
                    maxWidth="xs"
                >
                    <DialogTitle>{t('design_preset_delete')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t('design_preset_delete_confirm', selectedPreset?.name ?? '')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ dialog: null })}>{t('design_preset_cancel')}</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={this.onDelete}
                        >
                            {t('design_preset_delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
}

/**
 * Returns a `type: 'custom'` visAttrs field with the design presets of a widget type: copy/paste, save under a name,
 * apply, delete, export and import. Only the attributes of `spec` are ever read or written.
 *
 * @param getWidgetInfo  Returns the widget info; called lazily because the field is part of that info
 * @param spec           Design attributes of the widget type
 */
export function createDesignPresetField(getWidgetInfo: () => RxWidgetInfo, spec: DesignSpec): Record<string, unknown> {
    let widgetType: string | undefined;
    return {
        name: 'designPresets',
        type: 'custom',
        label: 'design_presets',
        noBinding: true,
        component: (
            _field: unknown,
            data: Record<string, unknown>,
            onDataChange: (newData: Record<string, unknown>) => void,
            props: RxWidgetInfoCustomComponentProperties,
        ) => (
            // The editor renders this field at the same place for every widget type, so without the key React would
            // keep the instance (and its widget type, groups and presets) when a widget of another type is selected
            <DesignPresetField
                key={(widgetType ??= getWidgetInfo().id)}
                getWidgetInfo={getWidgetInfo}
                spec={spec}
                data={data}
                onDataChange={onDataChange}
                fieldProps={props}
            />
        ),
    };
}
