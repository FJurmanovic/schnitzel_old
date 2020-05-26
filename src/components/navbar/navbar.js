import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from "prop-types";

import { getRandomInt } from '../classes/Functions';

import { logout } from '../classes/callAPI';

const Logo = (props) => {
  const logos = ["chicken", "hamburger", "beef", "salad"];
  return(
    <img src={`api/logos/${logos[getRandomInt(0,3)]}.svg`} className="logo"></img>
  )
}


class Navbar extends React.Component {
    detailsClose() {
      let profile = document.getElementById("profile");
      profile.removeAttribute("open");
    }

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
          <details className="header-dropdown" id="profile">
            <summary className="btn btn-default px-7 header-button">{user.username}</summary>
            <ul className="header-dropdown-menu dropdown-menu-dark">
              <Link to="/profile" className="dropdown-item" onClick={() => this.detailsClose()}>View Profile</Link>
              <Link to="/profile/edit" className="dropdown-item" onClick={() => this.detailsClose()}>Edit Profile</Link>
              <li className="dropdown-divider"/>
              <Link to="/logout" className="dropdown-item" onClick={() => this.detailsClose()}>Logout</Link>
            </ul>
          </details>
        </div>
      )

    return(
      <header className="header border-bottom border-black p-5 f4">
          <div className="header-item--full">
            <Link to="../../" className="header-link">
              <Logo />
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