import React from 'react'
import {Link} from 'react-router-dom'

import {Image} from 'cloudinary-react';

const OpenButton = (props) => {
    if (props.from == "home") {   
        return <Link to={location => `/post/${props.id}`}>More</Link>
    } else if (props.from == "profile") {
        return <Link to={location => `/post/${props.id}/1`}>More</Link>
    }
}

export const Post = (props) => {
    const { post, key, userdata, formatDate, addPoint, authUser, from } = props;

    return(
        <React.Fragment key={key}>
            <>
                <div className="post">
                    {(userdata.id == post.userId || authUser == post.userId) && <div><a href="">Delete post</a> | <Link to={location => `/post/edit/${post.id}`}>Edit post</Link> </div>}
                    {post.hasPhoto && <div><Image cloudName="dj7ju136o"  publicId={`post/${post.id}/${post.id}${post.photoExt}`} /></div>}
                    <h3>{post.title}</h3>
                    <div>{post.description}</div>
                    {post.type == "recipe" &&
                    <>
                        <div>{post.ingredients.map((ingredient, j) => {
                            return <React.Fragment key={j}>
                            <span>{ingredient.name}</span><span>{ingredient.value}</span><span>{ingredient.unit}</span>
                            </React.Fragment>
                            })}
                        </div>
                        <div>{post.directions}</div>
                    </>
                    }
                    <div>Author: <span></span>
                        {post.username == "DeletedUser" 
                        ? <span>DeletedUser</span>
                        : <Link to={location => `/${post.username}`}>{post.username}</Link>
                        }
                    </div>
                    <div>Posted on: {formatDate(post.createdAt)}</div>
                    <div>Points: {post.points.length} <button className="btn-icon" onClick={(e) => addPoint(e, key)}><div className="gg-arrow-up p--3"></div></button></div>
                    <div><OpenButton from={from} id={post.id} /></div>
                    <hr />
                </div>
            </>
        </React.Fragment>
    )
}
