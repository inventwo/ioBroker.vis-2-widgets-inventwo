import { MAX_THUMBNAIL_LENGTH } from './presetStore';

/** Gives up when rendering takes longer, so saving a preset is never blocked */
const TIMEOUT_MS = 3000;
/** Small widgets are rendered at most this much larger than on screen */
const MAX_UPSCALE = 2;

/**
 * Elements vis-2 puts into a widget element in the edit mode (selection overlay, name label, resize handles). They
 * are not part of the widget's look and are left out of the picture.
 */
const EDITOR_SELECTORS = [
    '.vis-editmode-overlay',
    '.vis-editmode-marks',
    '.vis-editmode-widget-name',
    '.vis-editmode-resizer',
];

const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TEMPLATE', 'IFRAME']);

function isEditorElement(element: Element): boolean {
    return EDITOR_SELECTORS.some(selector => element.matches(selector));
}

function styleText(element: Element): string {
    const computed = window.getComputedStyle(element);
    const parts: string[] = [];
    for (let i = 0; i < computed.length; i++) {
        const name = computed[i];
        const value = computed.getPropertyValue(name);
        if (value !== '') {
            parts.push(`${name}:${value}`);
        }
    }
    return parts.join(';');
}

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => (typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('read')));
        reader.onerror = () => reject(reader.error ?? new Error('read'));
        reader.readAsDataURL(blob);
    });
}

/** Loads same-origin resources as data URLs, as an SVG image may not load anything from outside */
class ResourceInliner {
    private readonly cache = new Map<string, Promise<string | undefined>>();

    load(url: string): Promise<string | undefined> {
        let absolute: URL;
        try {
            absolute = new URL(url, document.baseURI);
        } catch {
            return Promise.resolve(undefined);
        }
        if (absolute.protocol === 'data:') {
            return Promise.resolve(url);
        }
        if (absolute.origin !== window.location.origin) {
            return Promise.resolve(undefined);
        }
        const key = absolute.href;
        let result = this.cache.get(key);
        if (!result) {
            result = fetch(key, { credentials: 'same-origin' })
                .then(response => (response.ok ? response.blob() : Promise.reject(new Error(`${response.status}`))))
                .then(blobToDataUrl)
                .catch(() => undefined);
            this.cache.set(key, result);
        }
        return result;
    }

    /** Replaces the `url(...)` parts of a CSS value; URLs that cannot be loaded are replaced by `none` */
    async inlineCssUrls(value: string): Promise<string> {
        const pattern = /url\((['"]?)(.*?)\1\)/g;
        const matches = [...value.matchAll(pattern)];
        if (!matches.length) {
            return value;
        }
        const loaded = await Promise.all(matches.map(m => this.load(m[2])));
        let index = 0;
        return value.replace(pattern, () => {
            const dataUrl = loaded[index++];
            return dataUrl ? `url("${dataUrl}")` : 'none';
        });
    }
}

interface CloneContext {
    inliner: ResourceInliner;
    pending: Promise<void>[];
}

const CSS_URL_PROPERTIES = [
    'background-image',
    'border-image-source',
    'mask-image',
    '-webkit-mask-image',
    'list-style-image',
];

function inlineStyleUrls(source: Element, clone: Element, context: CloneContext): void {
    const computed = window.getComputedStyle(source);
    CSS_URL_PROPERTIES.forEach(property => {
        const value = computed.getPropertyValue(property);
        if (value?.includes('url(')) {
            context.pending.push(
                context.inliner.inlineCssUrls(value).then(inlined => {
                    (clone as HTMLElement | SVGElement).style?.setProperty(property, inlined);
                }),
            );
        }
    });
}

function canvasToImage(canvas: HTMLCanvasElement): HTMLImageElement | null {
    try {
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        return img;
    } catch {
        // A canvas with pictures from other origins cannot be read
        return null;
    }
}

/** Deep copy of `source` with all computed styles written into `style` attributes */
function cloneWithStyles(source: Node, context: CloneContext): Node | null {
    if (source.nodeType === Node.TEXT_NODE) {
        return source.cloneNode(false);
    }
    if (source.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }
    const element = source as Element;
    if (SKIPPED_TAGS.has(element.tagName.toUpperCase()) || isEditorElement(element)) {
        return null;
    }

    let clone: Element;
    if (element instanceof HTMLCanvasElement) {
        const img = canvasToImage(element);
        if (!img) {
            return null;
        }
        clone = img;
    } else {
        clone = element.cloneNode(false) as Element;
    }
    // IDs are kept: shapes and shadows refer to their SVG clip paths and filters by ID (`clip-path: url(#…)`), and the
    // clone only lives in the separate document of the SVG picture, so they cannot clash with the editor page
    clone.setAttribute('style', styleText(element));
    inlineStyleUrls(element, clone, context);

    if (element instanceof HTMLImageElement) {
        const img = clone as HTMLImageElement;
        img.removeAttribute('srcset');
        img.removeAttribute('loading');
        const src = element.currentSrc || element.src;
        if (src) {
            context.pending.push(
                context.inliner.load(src).then(dataUrl => {
                    if (dataUrl) {
                        img.src = dataUrl;
                    } else {
                        img.removeAttribute('src');
                    }
                }),
            );
        }
    } else if (element instanceof SVGImageElement) {
        const href = element.href.baseVal;
        if (href) {
            context.pending.push(
                context.inliner.load(href).then(dataUrl => {
                    clone.setAttribute('href', dataUrl ?? '');
                    clone.removeAttribute('xlink:href');
                }),
            );
        }
    } else if (element instanceof HTMLInputElement) {
        if (element.type === 'checkbox' || element.type === 'radio') {
            if (element.checked) {
                clone.setAttribute('checked', '');
            } else {
                clone.removeAttribute('checked');
            }
        } else {
            clone.setAttribute('value', element.value);
        }
    } else if (element instanceof HTMLTextAreaElement) {
        clone.textContent = element.value;
        return clone;
    }

    if (!(element instanceof HTMLCanvasElement)) {
        element.childNodes.forEach(child => {
            const childClone = cloneWithStyles(child, context);
            if (childClone) {
                clone.appendChild(childClone);
            }
        });
    }
    return clone;
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Thumbnail image could not be loaded'));
        img.src = url;
    });
}

function findWidgetElement(widgetId: string): HTMLElement | null {
    return document.getElementById(widgetId) ?? document.getElementById(`rx_${widgetId}`);
}

/** Renders the cloned widget into an SVG picture and rasterizes it to a PNG data URL of at most `maxSize` pixels */
async function render(element: HTMLElement, maxSize: number): Promise<string | undefined> {
    const width = element.offsetWidth || element.getBoundingClientRect().width;
    const height = element.offsetHeight || element.getBoundingClientRect().height;
    if (!width || !height) {
        return undefined;
    }

    const context: CloneContext = { inliner: new ResourceInliner(), pending: [] };
    const clone = cloneWithStyles(element, context) as HTMLElement | null;
    if (!clone) {
        return undefined;
    }
    await Promise.all(context.pending);

    // The widget is placed absolutely in the view; in the picture it starts at the top left corner
    clone.style.position = 'relative';
    clone.style.left = '0';
    clone.style.top = '0';
    clone.style.right = 'auto';
    clone.style.bottom = 'auto';
    clone.style.margin = '0';
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;
    // offsetWidth/offsetHeight include padding and border
    clone.style.boxSizing = 'border-box';

    const scale = Math.min(maxSize / width, maxSize / height, MAX_UPSCALE);
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const xhtml = new XMLSerializer().serializeToString(clone);
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${targetWidth}" height="${targetHeight}" ` +
        `viewBox="0 0 ${width} ${height}"><foreignObject x="0" y="0" width="${width}" height="${height}">` +
        `${xhtml}</foreignObject></svg>`;

    const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return undefined;
    }
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL('image/png');
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
    return new Promise(resolve => {
        const timer = window.setTimeout(() => resolve(undefined), ms);
        promise.then(
            value => {
                window.clearTimeout(timer);
                resolve(value);
            },
            () => {
                window.clearTimeout(timer);
                resolve(undefined);
            },
        );
    });
}

/**
 * Renders the widget with the given ID from the editor page into a small PNG data URL (longest side at most
 * `maxSize`). Uses only browser APIs: the widget is cloned with its computed styles into an SVG `foreignObject`.
 * Fonts are not embedded, so text may be drawn with a fallback font. Never throws; returns `undefined` if the widget
 * cannot be found or rendered, if rendering takes too long, or if the picture is too large even at a smaller size.
 */
export async function captureWidgetThumbnail(widgetId: string, maxSize = 160): Promise<string | undefined> {
    try {
        const element = findWidgetElement(widgetId);
        if (!element) {
            return undefined;
        }
        for (const size of [maxSize, Math.round(maxSize * 0.6)]) {
            const dataUrl = await withTimeout(render(element, size), TIMEOUT_MS);
            if (!dataUrl?.startsWith('data:image/png')) {
                return undefined;
            }
            if (dataUrl.length <= MAX_THUMBNAIL_LENGTH) {
                return dataUrl;
            }
        }
    } catch {
        // A thumbnail is optional
    }
    return undefined;
}
