const makeFederation = require('@iobroker/vis-2-widgets-react-dev/modulefederation.config');

module.exports = makeFederation(
    'vis2Inventwo', // internal name of package - must be unique and identical with io-package.json=>common.visWidgets.vis2demoWidget
    {
        './InventwoWidgetUniversal': './src/InventwoWidgetUniversal',
        './InventwoWidgetSlider': './src/InventwoWidgetSlider',
        './InventwoWidgetSwitch': './src/InventwoWidgetSwitch',
        // './InventwoWidgetTable': './src/InventwoWidgetTable',
        './translations': './src/translations',
    },
);
