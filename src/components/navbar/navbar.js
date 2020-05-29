import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from "prop-types";

import { getRandomInt } from '../classes/Functions';

import { logout } from '../classes/callAPI';

const Logo = (props) => {
  const logos = ["chicken", "hamburger", "beef", "salad"];
  return(
    <img src={`/api/logos/${logos[getRandomInt(0,3)]}.svg`} className="logo"></img>
  )
}


class Navbar extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        changeLogo: false
      }
    }

    detailsClose() {
      let profile = document.getElementById("profile");
      profile.removeAttribute("open");
    }

    changeLogo() {
      this.setState({
        changeLogo: true
      })
    }

    render() {
      const { user } = this.props.auth

      const notLoggedLink = (
        <>
          <div className="header-item">
            <Link to="/login" className="header-link py-5px" onClick={() => this.changeLogo()}>
              Login
            </Link>
          </div>
          <div className="header-item">
            <Link to="/register" className="header-link py-5px" onClick={() => this.changeLogo()}>
              Register
            </Link>
          </div>
        </>
      )

      const loggedLink = (
        <>
          <div className="header-item mr-5">
              <Link to="/explore" className="btn btn-white btn-rounder explore-btn" onClick={() => this.changeLogo()}>Explore</Link>
          </div>
          <div className="header-item">
            <details className="header-dropdown" id="profile">
              <summary className="btn btn-default px-7 header-button">{user.username}</summary>
              <ul className="header-dropdown-menu dropdown-menu-dark">
                <Link to="/profile" className="dropdown-item" onClick={() => {this.detailsClose(); this.changeLogo()}}>View Profile</Link>
                <Link to="/profile/edit" className="dropdown-item" onClick={() => {this.detailsClose(); this.changeLogo()}}>Edit Profile</Link>
                <li className="dropdown-divider"/>
                <Link to="/logout" className="dropdown-item" onClick={() => {this.detailsClose(); this.changeLogo()}}>Logout</Link>
              </ul>
            </details>
          </div>
        </>
      )

    return(
      <header className="header border-bottom border-black p-5 f4">
          <div className={this.props.auth.isAuthenticated ? "header-item--full" : "header-item--full"}>
            <Link to="../../" className="" onClick={() => this.changeLogo()}>
              <Logo change={this.state.changeLogo} />
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