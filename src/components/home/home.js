import React, { Component } from 'react';
import './home.scss';

import Post from '../post/post';
import Posts from './posts';

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
        {localStorage.jwtToken
            ?   <>
                    <Post />
                    <hr />
                    <Posts />
                </>
            :   <h2>Hello</h2>
        }
        
        
    </div>
    );
    }
}

export default Home;