import React, { Component } from 'react';
import Home from './home/home';
import Login from './login/login';

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