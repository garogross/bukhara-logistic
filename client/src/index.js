import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';

import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from "react-redux";
import {store} from "./redux/store";

import "./styles/_style.scss"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>
);

