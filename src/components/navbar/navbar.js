import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from "prop-types";

import { logout } from '../classes/callAPI';


class Navbar extends React.Component {

    render() {
      const { user } = this.props.auth

      const notLoggedLink = (
        <>
          <li className="auth">
            <Link to="/login">
              Login
            </Link>
          </li>
          <li className="auth">
            <Link to="/register">
              Register
            </Link>
          </li>
        </>
      )

      const loggedLink = (
        <>
          <li className="auth">
            <Link to="/profile">
              {user.username}
            </Link>
          </li>
          <li className="auth">
            <Link to="/logout" onClick={this.props.logout}>
              Logout
            </Link>
          </li>
        </>
      )

    return(
      <div className="Navigation">
        <ul>
          <li>
            <Link to="../">
              Home
            </Link>
          </li>
          { this.props.auth.isAuthenticated ? loggedLink : notLoggedLink }
        </ul>
      </div>
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