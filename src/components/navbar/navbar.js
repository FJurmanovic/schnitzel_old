import React, { Component, useState } from 'react';
import { Link, withRouter } from 'react-router-dom'

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    componentWillMount() {
      this.setState({session: localStorage.getItem("session")})
      
    }

    isLogged(){
      const notLoggedLink = (
        <ul>
          <li>
            <Link to="./">
              Home
            </Link>
          </li>
          <li>
            <Link to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register">
              Register
            </Link>
          </li>
        </ul>
      )

      const loggedLink = (
        <ul>
          <li>
            <Link to="./">
              Home
            </Link>
          </li>
          <li>
            <Link to="/logout">
              Logout
            </Link>
          </li>
        </ul>
      )

      if(this.state.session){
        return loggedLink;
      }else{
        return notLoggedLink;
      }
    }

    render() {

    return(
      <div>
      { this.isLogged() }
      </div>
    );
    }
}

export default Navbar;