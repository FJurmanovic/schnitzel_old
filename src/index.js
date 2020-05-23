import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './components/App';

import store from './components/store';

//Provides redux store to everything under App
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
, document.getElementById('app'));