import React, { Component } from 'react';
import { functions } from '../classes/Functions';
import Navbar from '../navbar/navbar';


class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }


    componentWillMount() {
      if (localStorage.getItem("session") != null){
        localStorage.removeItem("session");
      }
    }

    render() {
    return (functions.BackToLanding());
    }
}

export default Logout;