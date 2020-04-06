import React, { Component } from 'react';

import Home from './home/home';
import Login from './login/login';
import Register from './register/register';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    componentWillMount() {
    }

    render() {
    return(
        <div>
            <Login />
        </div>
    );
    }
}

export default App;