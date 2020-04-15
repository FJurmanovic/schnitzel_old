import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from "prop-types";

import { logout } from '../classes/callAPI';



class Navbar extends React.Component {

    render() {

      const notLoggedLink = (
        <>
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
        </>
      )

      const loggedLink = (
        <>
          <li>
      <a href="#" onClick={this.props.logout}>Logout</a>
          </li>
        </>
      )

    return(
      <ul>
        <li>
          <Link to="./">
            Home
          </Link>
        </li>
        { this.props.auth.isAuthenticated ? loggedLink : notLoggedLink }
      </ul>
    );
    }
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);