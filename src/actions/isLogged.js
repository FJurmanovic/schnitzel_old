import { connect } from 'react-redux';

// Add this function:
function mapStateToProps(state) {
    return {
      isLogged: state.isLogged
    };
  }

  export default connect(mapStateToProps)(isLogged);