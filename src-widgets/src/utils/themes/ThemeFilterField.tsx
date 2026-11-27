import React from 'react';
import { Box, Checkbox, MenuItem, TextField, Typography } from '@mui/material';
import { I18n } from '@iobroker/gui-components';
import type { RxWidgetInfoAttributesField, RxWidgetInfoCustomComponentProperties } from '@iobroker/types-vis-2';

import { themeStore } from './themeStore';
import { ThemeSwatch } from './ThemeManager';

const I18N_PREFIX = 'vis_2_widgets_inventwo_';
const t = (key: string, ...args: (string | number)[]): string => I18n.t(`${I18N_PREFIX}${key}`, ...args);

type LooseRecord = Record<string, any>;

/** Comma-separated theme ids → list without empty entries */
export function parseThemeFilter(value: unknown): string[] {
    return typeof value === 'string'
        ? value
              .split(',')
              .map(id => id.trim())
              .filter(Boolean)
        : [];
}

interface ThemeFilterFieldProps {
    /** Name of the attribute that stores the comma-separated theme ids */
    attr: string;
    data: LooseRecord;
    onDataChange: (newData: LooseRecord) => void;
    fieldProps: RxWidgetInfoCustomComponentProperties;
}

interface ThemeFilterFieldState {
    /** Increased on every store change to re-render */
    revision: number;
}

/**
 * Multi selection of themes for the Theme Customizer. The value stays a comma-separated list of theme ids (as the
 * former text field), so existing widgets keep working; empty = all themes. Ids of deleted themes stay selected and
 * are shown as unknown, so they can be removed.
 */
class ThemeFilterField extends React.Component<ThemeFilterFieldProps, ThemeFilterFieldState> {
    private mounted = false;
    private unsubscribe: (() => void) | null = null;

    constructor(props: ThemeFilterFieldProps) {
        super(props);
        this.state = { revision: 0 };
    }

    componentDidMount(): void {
        this.mounted = true;
        this.unsubscribe = themeStore.subscribe(() => {
            if (this.mounted) {
                this.setState(state => ({ revision: state.revision + 1 }));
            }
        });
        themeStore.init(this.props.fieldProps.context.socket).catch(e => console.warn('[inventwo themes]', e));
    }

    componentWillUnmount(): void {
        this.mounted = false;
        this.unsubscribe?.();
        this.unsubscribe = null;
    }

    private onChange(value: string | string[]): void {
        const ids = (Array.isArray(value) ? value : value.split(',')).filter(Boolean);
        // keep the order of the theme list, unknown ids at the end
        const order = themeStore.getThemes().map(theme => theme.id);
        ids.sort((a, b) => {
            const ia = order.indexOf(a);
            const ib = order.indexOf(b);
            return (ia < 0 ? order.length : ia) - (ib < 0 ? order.length : ib);
        });
        this.props.onDataChange({ [this.props.attr]: ids.join(',') });
    }

    render(): React.JSX.Element {
        const themes = themeStore.getThemes();
        const selected = parseThemeFilter(this.props.data?.[this.props.attr]);
        const unknown = selected.filter(id => !themes.some(theme => theme.id === id));

        return (
            <TextField
                select
                size="small"
                variant="standard"
                fullWidth
                value={selected}
                // with `multiple` the value is an array, although typed as string
                onChange={e => this.onChange(e.target.value)}
                slotProps={{
                    select: {
                        multiple: true,
                        displayEmpty: true,
                        renderValue: () => (
                            <Box
                                component="span"
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}
                            >
                                {selected.length ? (
                                    <Box
                                        component="span"
                                        sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}
                                    >
                                        {selected.map(id => {
                                            const theme = themes.find(item => item.id === id);
                                            return theme ? (
                                                <ThemeSwatch
                                                    key={id}
                                                    tokens={theme.tokens}
                                                    size={14}
                                                />
                                            ) : null;
                                        })}
                                    </Box>
                                ) : null}
                                <Box
                                    component="span"
                                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                    {selected.length
                                        ? selected
                                              .map(id => themes.find(theme => theme.id === id)?.name ?? id)
                                              .join(', ')
                                        : t('theme_customizer_theme_filter_all')}
                                </Box>
                            </Box>
                        ),
                    },
                    htmlInput: { 'aria-label': t('theme_customizer_theme_filter') },
                }}
            >
                {themes.map(theme => (
                    <MenuItem
                        key={theme.id}
                        value={theme.id}
                        dense
                        sx={{ gap: 1 }}
                    >
                        <Checkbox
                            size="small"
                            checked={selected.includes(theme.id)}
                            sx={{ p: 0 }}
                        />
                        <ThemeSwatch
                            tokens={theme.tokens}
                            size={18}
                        />
                        <Typography
                            variant="body2"
                            noWrap
                        >
                            {theme.name}
                        </Typography>
                    </MenuItem>
                ))}
                {unknown.map(id => (
                    <MenuItem
                        key={`unknown-${id}`}
                        value={id}
                        dense
                        sx={{ gap: 1 }}
                    >
                        <Checkbox
                            size="small"
                            checked
                            sx={{ p: 0 }}
                        />
                        <Typography
                            variant="body2"
                            color="error"
                            noWrap
                        >
                            {t('design_theme_unknown', id)}
                        </Typography>
                    </MenuItem>
                ))}
            </TextField>
        );
    }
}

/**
 * Attribute field for a theme selection with several themes, stored as comma-separated theme ids.
 *
 * @param name   Name of the attribute
 * @param extra  Further field properties (label, tooltip, hidden …)
 */
export function createThemeFilterField(name: string, extra: Record<string, unknown> = {}): RxWidgetInfoAttributesField {
    const field: Record<string, unknown> = {
        name,
        type: 'custom',
        noBinding: true,
        ...extra,
        component: (
            _field: unknown,
            data: LooseRecord,
            onDataChange: (newData: LooseRecord) => void,
            props: RxWidgetInfoCustomComponentProperties,
        ) => (
            <ThemeFilterField
                attr={name}
                data={data}
                onDataChange={onDataChange}
                fieldProps={props}
            />
        ),
    };
    return field as unknown as RxWidgetInfoAttributesField;
}
