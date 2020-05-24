import React, { Component } from 'react'
import {Link} from 'react-router-dom';

import './followerscreen.scss';

const FollowerScreen = (props) => {
    const { title, list, owner, exitScreen, removeFromFollowers, removeFromFollowing } = props;

    const stayHere = (event) => {
        event.stopPropagation();
    }

    return (
        <div className="overlay" onClick={(e) => exitScreen(e)}>
            <div className="followers" onClick={(e) => stayHere(e)}>
                <div className="title">{title}</div>
                <div className="list">{ list.map((follower, key) => {
                    return (
                        <React.Fragment key={key}>
                            <li><span onClick={(e) => exitScreen(e)}><Link to={location => `/${follower.username}`}>{follower.username}</Link></span> {owner && <span><a href="#" onClick={() => {title == "Followers" ? removeFromFollowers(follower.userId) : removeFromFollowing(follower.userID)}}>Remove following</a></span>}</li>
                        </React.Fragment>
                        )
                    })
                    }
                </div>
            </div>
        </div>
    )
}

export default FollowerScreen;