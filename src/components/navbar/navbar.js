import React, { PropTypes } from 'react';
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux';


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }



    componentWillMount() {
      this.setState({
        session: localStorage.getItem("session"),
      })
    }

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
            <Link to="/logout">
              Logout
            </Link>
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
        { this.props.isLogged ? loggedLink : notLoggedLink }
      </ul>
    );
    }
}

Navbar.propTypes = {
  //isLogged: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isLogged: state.isLogged
  };
}

export default connect(mapStateToProps)(Navbar);