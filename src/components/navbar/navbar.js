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
          <div className="header-item">
            <Link to="/login" className="header-link">
              Login
            </Link>
          </div>
          <div className="header-item">
            <Link to="/register" className="header-link">
              Register
            </Link>
          </div>
        </>
      )

      const loggedLink = (
        <div className="header-item">
          <details className="header-dropdown">
            <summary className="btn btn-default px-7 header-button">{user.username}</summary>
            <ul className="header-dropdown-menu dropdown-menu-dark">
              <Link to="/profile" className="dropdown-item">View Profile</Link>
              <Link to="/profile/edit" className="dropdown-item">Edit Profile</Link>
              <li className="dropdown-divider"/>
              <Link to="/profile/edit" className="dropdown-item">Logout</Link>
            </ul>
          </details>
        </div>
      )

    return(
      <header className="header border-bottom border-black p-5 f4">
          <div className="header-item--full">
            <Link to="../../" className="header-link">
              Home
            </Link>
          </div>
          { this.props.auth.isAuthenticated ? loggedLink : notLoggedLink }
      </header>
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