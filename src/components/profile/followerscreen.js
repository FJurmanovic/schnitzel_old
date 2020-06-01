import React, { Component } from 'react'
import {Link} from 'react-router-dom';

const FollowerScreen = (props) => {
    const { title, list, owner, exitScreen, removeFromFollowers, removeFromFollowing } = props;

    const stayHere = (event) => {
        event.stopPropagation();
    }

    return (
        <div className="overlay" onClick={(e) => exitScreen(e)}>
            <div className="followers" onClick={(e) => stayHere(e)}>
                <div className="flwrs">
                    <div className="title">{title}</div>
                    <div className="list">{ list.map((follower, key) => {
                        return (
                            <React.Fragment key={key}>
                                <span onClick={(e) => exitScreen(e)}><li className="flw-li mx-3 my-2"><span><Link to={location => `/${follower.username}`}>{follower.username}</Link></span> {owner && <span><a href="#" className="float-right f5" onClick={() => {title == "Followers" ? removeFromFollowers(follower.userId) : removeFromFollowing(follower.userID)}}>Remove following</a></span>}</li></span>
                            </React.Fragment>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FollowerScreen;