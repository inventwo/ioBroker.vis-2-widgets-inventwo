// import React from 'react';

import WidgetDemoApp from '@iobroker/vis-2-widgets-react-dev/widgetDemoApp';
import { i18n as I18n } from '@iobroker/adapter-react-v5';

// import DemoWidget from './DemoWidget';
import InventwoWidgetUniversal from './InventwoWidgetUniversal';
import InventwoWidgetSlider from './InventwoWidgetSlider';
// import InventwoWidgetTable from './InventwoWidgetTable';
import translations from './translations';

class App extends WidgetDemoApp {
    constructor(props) {
        super(props);

        // init translations
        I18n.extendTranslations(translations);
    }

    renderWidget() {
        return <div>
            <InventwoWidgetUniversal
                socket={this.socket}
                style={{
                    width: 110,
                    height: 110,
                }}
            />
            <InventwoWidgetSlider
                socket={this.socket}
                style={{
                    width: 110,
                    height: 110,
                }}
            />
        </div>;
    }
}

export default App;
