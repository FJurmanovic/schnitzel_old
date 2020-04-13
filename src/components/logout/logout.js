import React, { Component } from 'react';
import { functions } from '../classes/Functions';
import {LOG_OUT} from '../../actions/';
import {connect} from 'react-redux';


class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }


    componentWillMount() {
      if (localStorage.getItem("session") != null){
        localStorage.removeItem("session");
        this.props.dispatch({ type: LOG_OUT });
      }
    }

    render() {
    return (functions.BackToLanding());
    }
}

function mapStateToProps(state) {
  return {
    isLogged: state.isLogged
  };
}

export default connect(mapStateToProps)(Logout);