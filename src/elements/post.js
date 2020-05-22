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
    const { post, iter, userdata, formatDate, addPoint, authUser, from } = props;

    return(
        <React.Fragment key={iter}>
            <>
                <div className="card col-9 my-4">
                    {post.hasPhoto && <div><Image cloudName="dj7ju136o" className="card-img-top"  publicId={`post/${post.id}/${post.id}${post.photoExt}`} /></div>}
                    {(userdata.id == post.userId || authUser == post.userId) && <div className="px-4 mb-n5 mt-3"><a href="">Delete post</a> | <Link to={location => `/post/edit/${post.id}`}>Edit post</Link> </div>}
                    <div className="card-body">
                        <h3>{post.title}</h3>
                        <div className="f5">{post.description}</div>
                        {post.type == "recipe" &&
                        <>
                            <div className="f5">{post.ingredients.map((ingredient, j) => {
                                return <React.Fragment key={j}>
                                <span>{ingredient.name}</span><span>{ingredient.value}</span><span>{ingredient.unit}</span>
                                </React.Fragment>
                                })}
                            </div>
                            <div className="f5">{post.directions}</div>
                        </>
                        }
                        <div className="f5">Author: <span></span>
                            {post.username == "DeletedUser" 
                            ? <span>DeletedUser</span>
                            : <Link className="f5" to={location => `/${post.username}`}>{post.username}</Link>
                            }
                        </div>
                        <div className="f5">Posted on: {formatDate(post.createdAt)}</div>
                        <div className="f5">Points: {post.points.length} <button className="btn-icon f5" onClick={(e) => addPoint(e, iter)}>{!post.isPointed ? <div className="gg-chevron-up"></div> : <div className="gg-chevron-up text-blue"></div>}</button></div>
                        <div className="card-footer"><OpenButton from={from} id={post.id} /></div>
                    </div>
                </div>
            </>
        </React.Fragment>
    )
}
