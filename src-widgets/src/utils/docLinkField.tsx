import React from 'react';
import { I18n } from '@iobroker/adapter-react-v5';

const GITHUB_BASE = 'https://github.com/inventwo/ioBroker.vis-2-widgets-inventwo/blob/main/';
const GENERAL_DOCS_URL = `${GITHUB_BASE}docs/en/index.md`;
const I18N_PREFIX = 'vis_2_widgets_inventwo_';

const linkStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#8faa3a',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
};

const separatorStyle: React.CSSProperties = {
    color: '#555',
    userSelect: 'none',
};

/**
 * Returns a `type: 'custom'` visAttrs field that renders two documentation links:
 * - a link to the general adapter documentation
 * - a link to the specific widget documentation page
 *
 * The field label ("documentation") is resolved via the i18n prefix by the vis-2 framework.
 *
 * @param widgetDocsPath  Relative path inside the repo, e.g. 'docs/en/widgets/slider-widget.md'
 */
export function createDocsLinkField(widgetDocsPath: string): Record<string, unknown> {
    const widgetDocsUrl = `${GITHUB_BASE}${widgetDocsPath}`;

    return {
        name: 'docs_link',
        type: 'custom',
        label: 'documentation',
        noBinding: true,
        // The component function is called by the vis-2 editor as:
        // component(field, data, onDataChange, socket, widgetID, view, project) => JSX
        component: () =>
            React.createElement(
                'div',
                {
                    style: {
                        display: 'flex',
                        gap: 10,
                        alignItems: 'center',
                        padding: '2px 0',
                        flexWrap: 'wrap' as const,
                    },
                },
                React.createElement(
                    'a',
                    {
                        href: GENERAL_DOCS_URL,
                        target: '_blank',
                        rel: 'noreferrer',
                        style: linkStyle,
                        title: I18n.t(`${I18N_PREFIX}docs_general`),
                    },
                    `📖 ${I18n.t(`${I18N_PREFIX}docs_general`)}`,
                ),
                React.createElement('span', { style: separatorStyle }, '|'),
                React.createElement(
                    'a',
                    {
                        href: widgetDocsUrl,
                        target: '_blank',
                        rel: 'noreferrer',
                        style: linkStyle,
                        title: I18n.t(`${I18N_PREFIX}docs_widget`),
                    },
                    `📄 ${I18n.t(`${I18N_PREFIX}docs_widget`)}`,
                ),
            ),
    };
}
