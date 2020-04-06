import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    componentWillMount() {
    }

    render() {
        const notLoggedLink = (
            <ul>
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
    return(
    <div>{notLoggedLink}</div>
    );
    }
}

export default Navbar;