const makeFederation = require('@iobroker/vis-2-widgets-react-dev/modulefederation.config');

module.exports = makeFederation(
    'vis2Inventwo', // internal name of package - must be unique and identical with io-package.json=>common.visWidgets.vis2demoWidget
    {
        // './DemoWidget': './src/DemoWidget', // List of all widgets in this package
        './InventwoWidgetUniversal': './src/InventwoWidgetUniversal',
        './InventwoWidgetSlider': './src/InventwoWidgetSlider',
        './InventwoWidgetColorPicker': './src/InventwoWidgetColorPicker',
        './translations': './src/translations',
    },
);
