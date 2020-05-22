import React, { Component } from 'react'

import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { logout } from '../classes/callAPI';

class Logout extends Component {
    componentDidMount() {
        this.props.logout();
        this.props.history.push('./')
    }

    render() {
        return (
            <div>
                You are being logged out...
            </div>
        )
    }
}

Logout.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    err: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
  });
  
  export default connect(
    mapStateToProps,
    { logout }
  )(Logout);
  