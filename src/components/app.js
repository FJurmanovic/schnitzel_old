import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

import setAuthToken from '../utils/setAuthToken';
import { setCurrentUser, logout } from './classes/callAPI';
import store from './store';

import Home from './home/home';
import Login from './login/login';
import Register from './register/register';
import Profile from './profile/profile';
import EditProfile from './profile/edit';
import Navbar from './navbar/navbar';
import NoPage from './nopage/nopage';

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

function AppRouter(){
  return(
    <Router>
      <div className="App">
        <Navbar/>
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Home} />
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route path="/profile/edit" component={EditProfile} />
            <Route component={NoPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {
    const { user } = this.props.auth

    return(
      <AppRouter />
    );
    }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(App);