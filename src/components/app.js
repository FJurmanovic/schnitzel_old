import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useSelector, useDispatch, connect } from 'react-redux';

import Home from './home/home';
import Login from './login/login';
import Register from './register/register';
import Logout from './logout/logout';
import Navbar from './navbar/navbar';

import { userData } from './classes/callAPI';

import {SIGN_IN} from '../actions/';

function State() {
  const isLogged = useSelector(state => state.isLogged)
  //const dispatch = useDispatch();
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    componentWillMount() {
      if (localStorage.getItem("session")){
        userData(localStorage.getItem("session")).then(res => {this.setState({username: res.data.username})})

        this.setState({
          session: localStorage.getItem("session")
        });
        this.props.dispatch({ type: SIGN_IN });
      }
    }

    render() {
    return(
        <Router>
        <div className="App">
          <Navbar/>
          <div>{this.props.isLogged ? <div>User {this.state.username} is logged</div> : <div>User is not logged</div> }</div>
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

function mapStateToProps(state) {
  return {
    isLogged: state.isLogged
  };
}

export default connect(mapStateToProps)(App);