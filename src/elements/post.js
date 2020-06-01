import React from 'react'
import {Link} from 'react-router-dom'

import {Image} from 'cloudinary-react';

import {removePost} from '../components/classes/callAPI';

const OpenButton = (props) => {
    if (props.from == "home") {   
        return <Link to={location => `/post/${props.id}`}>{props.children}</Link>
    } else if (props.from == "profile") {
        return <Link to={location => `/post/${props.id}/1`}>{props.children}</Link>
    } else if (props.from == "explore") {
        return <Link to={location => `/post/${props.id}/2`}>{props.children}</Link>
    }
}

export const Post = (props) => {
    const { post, iter, userdata, formatDate, addPoint, authUser, from } = props;

    return(
        <React.Fragment key={iter}>
            <>
                <div className="card col-9 my-6">
                    {post.hasPhoto && <div className="card-image"><OpenButton from={from} id={post.id}><Image cloudName="dj7ju136o" className="card-img-top"  publicId={`post/${post.id}/${post.id}${post.photoExt}`} /></OpenButton></div>}
                    
                    <div className="f5 pr-5 mb-n3 mt-3 top-card">
                    {(userdata.id == post.userId || authUser == post.userId) &&<span className="float-right"><a href="./" onClick={() => removePost(post.id)}>Delete post</a> | <Link to={location => `/post/edit/${post.id}`}>Edit post</Link></span>}
                         <span className="author mr-2">Author: <span></span>
                            {post.username == "DeletedUser" 
                            ? <span>DeletedUser</span>
                            : <Link className="f5" to={location => `/${post.username}`}>{post.username}</Link>
                            }
                        </span>
                    <span className="f5 mx-2 date">Posted on: {formatDate(post.createdAt)}</span>
                    </div>
                    <div className="card-body">
                        <h3>{post.title}</h3>
                        <div className="f5 description">{post.description}</div>
                        {post.type == "recipe" &&
                        <>
                            <div className="f5 ingredients">{post.ingredients.map((ingredient, j) => {
                                return <React.Fragment key={j}>
                                    {j < 2 && <div className="ingredient"><span className="ingredient-name">{ingredient.name}</span><span className="ingredient-amount">{ingredient.amount}</span><span className="ingredient-unit">{ingredient.unit}</span></div>}
                                </React.Fragment>
                                })}
                                {post.ingredients.length > 3 && <div className="ingredient">...</div>}
                            </div>
                            <div className="f5 directions">{post.directions}</div>
                        </>
                        }
                        <div className="f5">Points: {post.points.length} <button className="btn-icon ml-n2" onClick={(e) => addPoint(e, iter)}>{!post.isPointed ? <div className="gg-chevron-up"></div> : <div className="gg-chevron-up text-blue"></div>}</button> <OpenButton from={from} id={post.id}><span className="mx-5">Comments: {post.comments}</span></OpenButton></div>
                    </div>

                    <OpenButton from={from} id={post.id}><div className="card-footer">View recipe</div></OpenButton>
                </div>
            </>
        </React.Fragment>
    )
}