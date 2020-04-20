import React, { Component } from 'react';
import './home.scss';

import Post from '../post/post';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 

         };
    }
    
    componentWillMount() {
    }

    render() {
    return(
    <div>
        <Post />
        Hello
    </div>
    );
    }
}

export default Home;