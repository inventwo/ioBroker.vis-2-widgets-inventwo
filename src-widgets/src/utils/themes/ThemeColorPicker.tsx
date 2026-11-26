/**
 * Dependency-free, touch-friendly color picker for the theme customizer (wall tablets): saturation/brightness area,
 * hue slider, optional opacity slider and a text field for hex or any CSS color.
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, InputBase } from '@mui/material';

import type { ThemeTokens } from './themeTokens';

/** A color with channels 0-255 and alpha 0-1 */
export interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

/** Internal color model: hue 0-360, saturation/value/alpha 0-1 */
interface Hsva {
    h: number;
    s: number;
    v: number;
    a: number;
}

export interface ThemeColorPickerProps {
    /** Current CSS color: rgb()/rgba()/#hex/hsl()/named; anything unparsable (e.g. gradients, '') starts at the fallback */
    value: string;
    /** Called continuously while dragging / typing a valid value */
    onChange: (color: string) => void;
    /** Called once when the user releases a pointer (end of a drag) or confirms the hex input */
    onCommit: (color: string) => void;
    /** Show an alpha slider (default true) */
    alpha?: boolean;
    /** Theme tokens used for styling the picker itself (text, textMuted, track, thumb, surfaceVariant, radiusSmall) */
    tokens: ThemeTokens;
}

const FALLBACK: RgbaColor = { r: 255, g: 255, b: 255, a: 1 };
const THUMB_SIZE = 28;
const TRACK_HEIGHT = 16;
const AREA_HEIGHT = 160;
const MAX_RADIUS = 16;
const CHECKERBOARD = 'repeating-conic-gradient(#c8c8c8 0% 25%, #ffffff 0% 50%) 0 0 / 12px 12px';
const HUE_GRADIENT =
    'linear-gradient(to right, #f00 0%, #ff0 16.67%, #0f0 33.33%, #0ff 50%, #00f 66.67%, #f0f 83.33%, #f00 100%)';

// ---------------------------------------------------------------------------------------------------------------------
// Color math
// ---------------------------------------------------------------------------------------------------------------------

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

function hsvaToRgba({ h, s, v, a }: Hsva): RgbaColor {
    const f = (n: number): number => {
        const k = (n + h / 60) % 6;
        return (v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255;
    };
    return { r: f(5), g: f(3), b: f(1), a };
}

function rgbaToHsv({ r, g, b, a }: RgbaColor): Hsva {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const d = max - Math.min(rn, gn, bn);
    let h = 0;
    if (d !== 0) {
        if (max === rn) {
            h = ((gn - bn) / d) % 6;
        } else if (max === gn) {
            h = (bn - rn) / d + 2;
        } else {
            h = (rn - gn) / d + 4;
        }
        h *= 60;
        if (h < 0) {
            h += 360;
        }
    }
    return { h, s: max === 0 ? 0 : d / max, v: max, a };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    const k = (n: number): number => (n + h / 30) % 12;
    const amount = s * Math.min(l, 1 - l);
    const f = (n: number): number => (l - amount * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))) * 255;
    return { r: f(0), g: f(8), b: f(4) };
}

/** Converts a parsed color to HSVA; keeps hue (and saturation for black) of `previous` where the color has none */
function toHsva(color: RgbaColor, previous?: Hsva): Hsva {
    const hsva = rgbaToHsv(color);
    if (previous) {
        if (hsva.v === 0) {
            return { ...hsva, h: previous.h, s: previous.s };
        }
        if (hsva.s === 0) {
            return { ...hsva, h: previous.h };
        }
    }
    return hsva;
}

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?%?$/i;

/** Parses a number with optional `%`; returns the value and whether it was a percentage */
function parseNumber(text: string): { value: number; percent: boolean } | null {
    if (!NUMBER_PATTERN.test(text)) {
        return null;
    }
    const percent = text.endsWith('%');
    const value = parseFloat(percent ? text.slice(0, -1) : text);
    return Number.isFinite(value) ? { value, percent } : null;
}

/** Splits the arguments of rgb()/hsl() in comma syntax (`1, 2, 3, 0.5`) or space syntax (`1 2 3 / 50%`) */
function splitArgs(inner: string): string[] | null {
    const parts = inner
        .trim()
        .split(/\s*,\s*|\s*\/\s*|\s+/)
        .filter(part => part !== '');
    return parts.length === 3 || parts.length === 4 ? parts : null;
}

function parseAlpha(text: string | undefined): number | null {
    if (text === undefined) {
        return 1;
    }
    const num = parseNumber(text);
    if (!num) {
        return null;
    }
    return clamp(num.percent ? num.value / 100 : num.value);
}

function parseHex(hex: string): RgbaColor | null {
    if (!/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) {
        return null;
    }
    let digits = hex.slice(1);
    if (digits.length <= 4) {
        digits = digits
            .split('')
            .map(c => c + c)
            .join('');
    }
    const channel = (i: number): number => parseInt(digits.slice(i * 2, i * 2 + 2), 16);
    return { r: channel(0), g: channel(1), b: channel(2), a: digits.length === 8 ? channel(3) / 255 : 1 };
}

function parseRgbFunction(inner: string): RgbaColor | null {
    const parts = splitArgs(inner);
    if (!parts) {
        return null;
    }
    const channels = parts.slice(0, 3).map(part => {
        const num = parseNumber(part);
        return num ? clamp(num.percent ? num.value * 2.55 : num.value, 0, 255) : null;
    });
    const a = parseAlpha(parts[3]);
    if (channels.some(c => c === null) || a === null) {
        return null;
    }
    return { r: channels[0] as number, g: channels[1] as number, b: channels[2] as number, a };
}

function parseHue(text: string): number | null {
    const match = /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(deg|turn|rad|grad)?$/i.exec(text);
    if (!match) {
        return null;
    }
    let hue = parseFloat(match[1]);
    switch ((match[2] || 'deg').toLowerCase()) {
        case 'turn':
            hue *= 360;
            break;
        case 'rad':
            hue = (hue * 180) / Math.PI;
            break;
        case 'grad':
            hue *= 0.9;
            break;
        default:
            break;
    }
    return Number.isFinite(hue) ? ((hue % 360) + 360) % 360 : null;
}

function parseHslFunction(inner: string): RgbaColor | null {
    const parts = splitArgs(inner);
    if (!parts) {
        return null;
    }
    const h = parseHue(parts[0]);
    const s = parseNumber(parts[1]);
    const l = parseNumber(parts[2]);
    const a = parseAlpha(parts[3]);
    if (h === null || !s || !l || a === null) {
        return null;
    }
    return { ...hslToRgb(h, clamp(s.value / 100), clamp(l.value / 100)), a };
}

let namedColorContext: CanvasRenderingContext2D | null | undefined;

/** Resolves a named color (e.g. `tomato`) with the canvas fillStyle trick; null outside a browser or if unknown */
function resolveNamedColor(name: string): string | null {
    if (typeof document === 'undefined' || !/^[a-z]+$/i.test(name)) {
        return null;
    }
    if (namedColorContext === undefined) {
        try {
            namedColorContext = document.createElement('canvas').getContext('2d');
        } catch {
            namedColorContext = null;
        }
    }
    const ctx = namedColorContext;
    if (!ctx) {
        return null;
    }
    // An invalid value leaves fillStyle unchanged, so two different sentinels reveal it
    ctx.fillStyle = '#010203';
    ctx.fillStyle = name;
    const first = String(ctx.fillStyle);
    ctx.fillStyle = '#040506';
    ctx.fillStyle = name;
    const second = String(ctx.fillStyle);
    return first === second ? first : null;
}

function parseColorSyntax(color: string): RgbaColor | null {
    if (color.startsWith('#')) {
        return parseHex(color);
    }
    const fn = /^(rgba?|hsla?)\((.*)\)$/i.exec(color);
    if (fn) {
        return fn[1].toLowerCase().startsWith('rgb') ? parseRgbFunction(fn[2]) : parseHslFunction(fn[2]);
    }
    return null;
}

/**
 * Parses a CSS color: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()`/`rgba()` and `hsl()`/`hsla()` in comma or
 * space syntax, and named colors (in a browser). Returns null for everything else, e.g. gradients or ''.
 */
export function parseCssColor(value: string): RgbaColor | null {
    if (typeof value !== 'string') {
        return null;
    }
    const color = value.trim().replace(/\s+/g, ' ');
    if (!color) {
        return null;
    }
    const parsed = parseColorSyntax(color);
    if (parsed) {
        return parsed;
    }
    if (color.toLowerCase() === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0 };
    }
    const resolved = resolveNamedColor(color);
    return resolved ? parseColorSyntax(resolved) : null;
}

/** Formats a color as `rgb(r,g,b)`, or `rgba(r,g,b,a)` (alpha rounded to 2 decimals) if it is not opaque */
export function formatCssColor(c: RgbaColor): string {
    const r = Math.round(clamp(c.r, 0, 255));
    const g = Math.round(clamp(c.g, 0, 255));
    const b = Math.round(clamp(c.b, 0, 255));
    const a = Math.round(clamp(c.a) * 100) / 100;
    return a >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
}

/** `#rrggbb`, or `#rrggbbaa` if the color is not opaque */
function formatHex(c: RgbaColor): string {
    const hex = (n: number): string =>
        Math.round(clamp(n, 0, 255))
            .toString(16)
            .padStart(2, '0');
    const a = Math.round(clamp(c.a) * 255);
    return `#${hex(c.r)}${hex(c.g)}${hex(c.b)}${a < 255 ? hex(a) : ''}`;
}

// ---------------------------------------------------------------------------------------------------------------------
// Pointer and keyboard helpers
// ---------------------------------------------------------------------------------------------------------------------

interface DragHandlers {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerCancel: (e: React.PointerEvent<HTMLElement>) => void;
    onLostPointerCapture: (e: React.PointerEvent<HTMLElement>) => void;
}

/**
 * Pointer handlers for a 1D/2D drag control. `onMove` gets the position relative to `targetRef` (0-1 on both axes);
 * `onEnd` is called once when the pointer is released or the capture is lost.
 */
function usePointerDrag(
    targetRef: React.RefObject<HTMLElement | null>,
    onStart: () => void,
    onMove: (x: number, y: number) => void,
    onEnd: () => void,
): DragHandlers {
    const pointerIdRef = useRef<number | null>(null);
    const callbacksRef = useRef({ onStart, onMove, onEnd });
    useLayoutEffect(() => {
        callbacksRef.current = { onStart, onMove, onEnd };
    });

    const move = useCallback(
        (e: React.PointerEvent<HTMLElement>): void => {
            const rect = targetRef.current?.getBoundingClientRect();
            if (!rect || !rect.width || !rect.height) {
                return;
            }
            callbacksRef.current.onMove(
                clamp((e.clientX - rect.left) / rect.width),
                clamp((e.clientY - rect.top) / rect.height),
            );
        },
        [targetRef],
    );

    const end = useCallback((e: React.PointerEvent<HTMLElement>): void => {
        if (pointerIdRef.current !== e.pointerId) {
            return;
        }
        pointerIdRef.current = null;
        callbacksRef.current.onEnd();
    }, []);

    return {
        onPointerDown: useCallback(
            (e: React.PointerEvent<HTMLElement>): void => {
                if ((e.pointerType === 'mouse' && e.button !== 0) || pointerIdRef.current !== null) {
                    return;
                }
                e.preventDefault();
                e.currentTarget.focus({ preventScroll: true });
                try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                    // capture is only a convenience; dragging still works inside the element
                }
                pointerIdRef.current = e.pointerId;
                callbacksRef.current.onStart();
                move(e);
            },
            [move],
        ),
        onPointerMove: useCallback(
            (e: React.PointerEvent<HTMLElement>): void => {
                if (pointerIdRef.current === e.pointerId) {
                    move(e);
                }
            },
            [move],
        ),
        onPointerUp: useCallback(
            (e: React.PointerEvent<HTMLElement>): void => {
                if (pointerIdRef.current === e.pointerId) {
                    move(e);
                }
                end(e);
            },
            [move, end],
        ),
        onPointerCancel: end,
        onLostPointerCapture: end,
    };
}

/** Step of an arrow/page key (shift = 10x), or null if the key is no step key; `axis` tells which axis it moves */
function keyStep(e: React.KeyboardEvent): { step: number; axis: 'x' | 'y' } | null {
    const factor = e.shiftKey ? 10 : 1;
    switch (e.key) {
        case 'ArrowRight':
            return { step: factor, axis: 'x' };
        case 'ArrowLeft':
            return { step: -factor, axis: 'x' };
        case 'ArrowUp':
            return { step: factor, axis: 'y' };
        case 'ArrowDown':
            return { step: -factor, axis: 'y' };
        case 'PageUp':
            return { step: 10, axis: 'y' };
        case 'PageDown':
            return { step: -10, axis: 'y' };
        default:
            return null;
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Sub components
// ---------------------------------------------------------------------------------------------------------------------

const thumbSx = (background: string): Record<string, string | number> => ({
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: '50%',
    border: '3px solid #fff',
    boxSizing: 'border-box',
    boxShadow: '0 1px 4px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(0,0,0,0.12)',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    background,
});

interface ChannelSliderProps {
    /** Position 0-1 */
    position: number;
    label: string;
    valueNow: number;
    valueMax: number;
    valueText: string;
    trackBackground: string;
    thumbBackground: string;
    radius: number;
    focusColor: string;
    onStart: () => void;
    onInput: (position: number) => void;
    onEnd: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
    onKeyUp: (e: React.KeyboardEvent<HTMLElement>) => void;
}

/** Horizontal slider with a 28px thumb */
function ChannelSlider(props: ChannelSliderProps): React.JSX.Element {
    const trackRef = useRef<HTMLDivElement>(null);
    const handlers = usePointerDrag(trackRef, props.onStart, x => props.onInput(x), props.onEnd);

    return (
        <Box
            role="slider"
            tabIndex={0}
            aria-label={props.label}
            aria-valuemin={0}
            aria-valuemax={props.valueMax}
            aria-valuenow={props.valueNow}
            aria-valuetext={props.valueText}
            aria-orientation="horizontal"
            {...handlers}
            onKeyDown={props.onKeyDown}
            onKeyUp={props.onKeyUp}
            sx={{
                position: 'relative',
                height: THUMB_SIZE,
                cursor: 'pointer',
                touchAction: 'none',
                outline: 'none',
                borderRadius: `${Math.min(props.radius, THUMB_SIZE / 2)}px`,
                '&:focus-visible': { outline: `2px solid ${props.focusColor}`, outlineOffset: 2 },
            }}
        >
            {/* visible track over the full width */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
                    height: TRACK_HEIGHT,
                    borderRadius: `${Math.min(props.radius, TRACK_HEIGHT / 2)}px`,
                    background: props.trackBackground,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
                }}
            />
            {/* value range: inset by half a thumb so the thumb never leaves the track */}
            <Box
                ref={trackRef}
                sx={{ position: 'absolute', top: 0, bottom: 0, left: THUMB_SIZE / 2, right: THUMB_SIZE / 2 }}
            >
                <Box sx={{ ...thumbSx(props.thumbBackground), left: `${props.position * 100}%`, top: '50%' }} />
            </Box>
        </Box>
    );
}

// ---------------------------------------------------------------------------------------------------------------------
// Picker
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Touch-friendly color picker: saturation/brightness area, hue slider, optional opacity slider and a text field for
 * hex or any CSS color. Emits `rgb()`/`rgba()` strings.
 */
export default function ThemeColorPicker(props: ThemeColorPickerProps): React.JSX.Element {
    const { value, alpha = true, tokens } = props;

    const [hsva, setHsvaState] = useState<Hsva>(() => toHsva(parseCssColor(value) ?? FALLBACK));
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState('');

    const hsvaRef = useRef(hsva);
    const draggingRef = useRef(false);
    const lastEmittedRef = useRef<string | null>(null);
    const rafRef = useRef<number | null>(null);
    const keyDirtyRef = useRef(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const areaRef = useRef<HTMLDivElement>(null);
    const skipCommitRef = useRef(false);
    const editStartRef = useRef('');
    const editDirtyRef = useRef(false);
    const callbacksRef = useRef({ onChange: props.onChange, onCommit: props.onCommit });
    const { onChange, onCommit } = props;
    useLayoutEffect(() => {
        callbacksRef.current = { onChange, onCommit };
    }, [onChange, onCommit]);

    const setHsva = useCallback((next: Hsva): void => {
        hsvaRef.current = next;
        setHsvaState(next);
    }, []);

    // Sync from outside, but not while dragging and not for the echo of our own onChange
    useEffect(() => {
        if (draggingRef.current || value === lastEmittedRef.current) {
            return;
        }
        lastEmittedRef.current = null;
        setHsva(toHsva(parseCssColor(value) ?? FALLBACK, hsvaRef.current));
    }, [value, setHsva]);

    useEffect(
        () => () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        },
        [],
    );

    const emitChange = useCallback((): string => {
        const color = formatCssColor(hsvaToRgba(hsvaRef.current));
        lastEmittedRef.current = color;
        callbacksRef.current.onChange(color);
        return color;
    }, []);

    const scheduleChange = useCallback((): void => {
        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                emitChange();
            });
        }
    }, [emitChange]);

    const commit = useCallback((): void => {
        let color: string;
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            color = emitChange();
        } else {
            color = formatCssColor(hsvaToRgba(hsvaRef.current));
        }
        callbacksRef.current.onCommit(color);
    }, [emitChange]);

    const update = useCallback(
        (patch: Partial<Hsva>): void => {
            setHsva({ ...hsvaRef.current, ...patch });
            scheduleChange();
        },
        [setHsva, scheduleChange],
    );

    const onDragStart = useCallback((): void => {
        draggingRef.current = true;
    }, []);
    const onDragEnd = useCallback((): void => {
        draggingRef.current = false;
        commit();
    }, [commit]);

    const areaHandlers = usePointerDrag(areaRef, onDragStart, (x, y) => update({ s: x, v: 1 - y }), onDragEnd);

    /** Keyboard handling shared by all controls; `apply` maps a key step to a patch of the current color */
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLElement>,
        apply: (current: Hsva, step: number, axis: 'x' | 'y') => Partial<Hsva>,
    ): void => {
        const key = keyStep(e);
        if (!key) {
            return;
        }
        e.preventDefault();
        keyDirtyRef.current = true;
        update(apply(hsvaRef.current, key.step, key.axis));
    };
    const onAreaKeyDown = (e: React.KeyboardEvent<HTMLElement>): void =>
        handleKeyDown(e, (cur, step, axis) =>
            axis === 'x' ? { s: clamp(cur.s + step / 100) } : { v: clamp(cur.v + step / 100) },
        );
    const onHueKeyDown = (e: React.KeyboardEvent<HTMLElement>): void =>
        handleKeyDown(e, (cur, step) => ({ h: clamp(cur.h + step, 0, 360) }));
    const onAlphaKeyDown = (e: React.KeyboardEvent<HTMLElement>): void =>
        handleKeyDown(e, (cur, step) => ({ a: clamp(Math.round(cur.a * 100 + step) / 100) }));
    const onKeyUp = (e: React.KeyboardEvent<HTMLElement>): void => {
        if (keyDirtyRef.current && keyStep(e)) {
            keyDirtyRef.current = false;
            commit();
        }
    };

    // ----- text input -----
    const rgba = hsvaToRgba(hsva);
    const opaque = `rgb(${Math.round(rgba.r)},${Math.round(rgba.g)},${Math.round(rgba.b)})`;
    const current = formatCssColor(rgba);

    const onTextFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
        const hex = formatHex(hsvaToRgba(hsvaRef.current));
        editStartRef.current = formatCssColor(hsvaToRgba(hsvaRef.current));
        editDirtyRef.current = false;
        skipCommitRef.current = false;
        setText(hex);
        setEditing(true);
        const input = e.target;
        requestAnimationFrame(() => input.select());
    };

    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const next = e.target.value;
        setText(next);
        const parsed = parseCssColor(next);
        if (parsed) {
            setHsva(toHsva(parsed, hsvaRef.current));
            editDirtyRef.current = true;
            emitChange();
        }
    };

    const onTextBlur = (): void => {
        setEditing(false);
        if (skipCommitRef.current) {
            skipCommitRef.current = false;
            return;
        }
        const parsed = parseCssColor(text);
        if (!parsed) {
            // invalid: the field shows the current color again
            if (editDirtyRef.current) {
                commit();
            }
            return;
        }
        setHsva(toHsva(parsed, hsvaRef.current));
        const color = formatCssColor(parsed);
        if (editDirtyRef.current || color !== editStartRef.current) {
            lastEmittedRef.current = color;
            callbacksRef.current.onChange(color);
            callbacksRef.current.onCommit(color);
        }
    };

    const onTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            skipCommitRef.current = true;
            const start = parseCssColor(editStartRef.current);
            if (start && editDirtyRef.current) {
                setHsva(toHsva(start, hsvaRef.current));
                lastEmittedRef.current = editStartRef.current;
                callbacksRef.current.onChange(editStartRef.current);
            }
            inputRef.current?.blur();
        }
    };

    // ----- styling from tokens -----
    const textColor = String(tokens.text);
    const mutedColor = String(tokens.textMuted);
    const radius = Math.min(Math.max(Number(tokens.radiusSmall) || 0, 0), MAX_RADIUS);
    const hueColor = `hsl(${Math.round(hsva.h)}, 100%, 50%)`;
    const alphaPercent = Math.round(hsva.a * 100);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                width: '100%',
                minWidth: 240,
                boxSizing: 'border-box',
                color: textColor,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
            }}
        >
            <Box
                ref={areaRef}
                role="slider"
                tabIndex={0}
                aria-label="Saturation and brightness"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(hsva.s * 100)}
                aria-valuetext={`Saturation ${Math.round(hsva.s * 100)}%, brightness ${Math.round(hsva.v * 100)}%`}
                {...areaHandlers}
                onKeyDown={onAreaKeyDown}
                onKeyUp={onKeyUp}
                sx={{
                    position: 'relative',
                    height: AREA_HEIGHT,
                    borderRadius: `${radius}px`,
                    background: `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0)), ${hueColor}`,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
                    cursor: 'crosshair',
                    touchAction: 'none',
                    outline: 'none',
                    '&:focus-visible': { outline: `2px solid ${textColor}`, outlineOffset: 2 },
                }}
            >
                <Box
                    sx={{
                        ...thumbSx(opaque),
                        left: `${hsva.s * 100}%`,
                        top: `${(1 - hsva.v) * 100}%`,
                    }}
                />
            </Box>

            <ChannelSlider
                position={hsva.h / 360}
                label="Hue"
                valueNow={Math.round(hsva.h)}
                valueMax={360}
                valueText={`${Math.round(hsva.h)}°`}
                trackBackground={HUE_GRADIENT}
                thumbBackground={hueColor}
                radius={radius}
                focusColor={textColor}
                onStart={onDragStart}
                onInput={x => update({ h: x * 360 })}
                onEnd={onDragEnd}
                onKeyDown={onHueKeyDown}
                onKeyUp={onKeyUp}
            />

            {alpha ? (
                <ChannelSlider
                    position={hsva.a}
                    label="Opacity"
                    valueNow={alphaPercent}
                    valueMax={100}
                    valueText={`${alphaPercent}%`}
                    trackBackground={`linear-gradient(to right, rgba(${Math.round(rgba.r)},${Math.round(rgba.g)},${Math.round(rgba.b)},0), ${opaque}), ${CHECKERBOARD}`}
                    thumbBackground={`linear-gradient(${current}, ${current}), ${CHECKERBOARD}`}
                    radius={radius}
                    focusColor={textColor}
                    onStart={onDragStart}
                    onInput={x => update({ a: Math.round(x * 100) / 100 })}
                    onEnd={onDragEnd}
                    onKeyDown={onAlphaKeyDown}
                    onKeyUp={onKeyUp}
                />
            ) : null}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Box
                    aria-hidden
                    sx={{
                        flex: '0 0 auto',
                        width: 44,
                        height: 44,
                        borderRadius: `${radius}px`,
                        background: `linear-gradient(${current}, ${current}), ${CHECKERBOARD}`,
                        boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.15), 0 0 0 1px ${mutedColor}`,
                    }}
                />
                <InputBase
                    inputRef={inputRef}
                    value={editing ? text : formatHex(rgba)}
                    onFocus={onTextFocus}
                    onChange={onTextChange}
                    onBlur={onTextBlur}
                    onKeyDown={onTextKeyDown}
                    inputProps={{
                        'aria-label': 'Color value',
                        spellCheck: false,
                        autoCapitalize: 'off',
                        autoComplete: 'off',
                        autoCorrect: 'off',
                        maxLength: 60,
                    }}
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        height: 44,
                        px: 1.5,
                        borderRadius: `${radius}px`,
                        background: String(tokens.surfaceVariant),
                        color: textColor,
                        fontFamily: 'inherit',
                        fontSize: 15,
                        boxShadow: `inset 0 0 0 1px ${String(tokens.track)}`,
                        '&.Mui-focused': { boxShadow: `inset 0 0 0 2px ${String(tokens.thumb)}` },
                        '& input': { p: 0, userSelect: 'text', WebkitUserSelect: 'text' },
                    }}
                />
            </Box>
        </Box>
    );
}
