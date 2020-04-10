import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './home/home';
import Login from './login/login';
import Register from './register/register';
import Logout from './logout/logout';
import Navbar from './navbar/navbar';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    componentWillMount() {
      if (localStorage.getItem("session")){
        const session = localStorage.getItem("session");
        this.setState({session: session});
      }
    }

    render() {
    return(
        <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Home} />
          <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
          </div>
        </div>
      </Router>
    );
    }
}

export default App;