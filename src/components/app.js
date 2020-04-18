import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

import setAuthToken from '../utils/setAuthToken';
import { setCurrentUser, logout } from './classes/callAPI';
import store from './store';

import Home from './home/home';
import Login from './login/login';
import Register from './register/register';
import Profile from './profile/profile';
import Navbar from './navbar/navbar';
import EditProfile from './profile/edit';

import { userData } from './classes/callAPI';

import './app.scss';

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  
  userData(token).then(resp => {
    store.dispatch(setCurrentUser(resp.data));
  })

  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    store.dispatch(logout());
    window.location.href = "./login";
  }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {
    const { user } = this.props.auth

    return(
    
        <Router>
        <div className="App">
          <Navbar/>
          <div className="container">
            <Route exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Home} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/profile/edit" component={EditProfile} />
          </div>
        </div>
      </Router>
    );
    }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(App);