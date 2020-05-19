import React from 'react'
import {Link} from 'react-router-dom'

import {Image} from 'cloudinary-react';

export const Post = (props) => {
    const { post, key, userdata, formatDate, addPoint, authUser } = props;

    return(
        <React.Fragment key={key}>
            <>
            {post.type == "post" &&
                <div className="post">
                    {(userdata.id == post.userId || authUser == post.userId) && <div><a href="">Delete post</a> | <Link to={location => `/post/edit/${post.id}`}>Edit post</Link></div>}
                    {post.hasPhoto && <div><Image cloudName="dj7ju136o"  publicId={`post/${post.id}/${post.id}${post.photoExt}`} /></div>}
                    <h3>{post.title}</h3>
                    <div>{post.description}</div>
                    <div>Author: <span></span>
                        {post.username == "DeletedUser" 
                        ? <span>DeletedUser</span>
                        : <Link to={location => `/${post.username}`}>{post.username}</Link>
                        }
                    </div>
                    <div>Posted on: {formatDate(post.createdAt)}</div>
                    <div>Points: {post.points.length} <button onClick={(e) => addPoint(e, key)}>^</button></div>
                    <div><Link to={location => `/post/${post.id}`}>More</Link></div>
                    <hr />
                </div>
            }
            </>

            <>
            {post.type == "recipe" &&
                <div className="post">
                    {(userdata.id == post.userId || authUser == post.userId) && <div><a href="">Delete post</a> | <Link to={location => `/post/edit/${post.id}`}>Edit post</Link></div>}
                    <h3>{post.title}</h3>
                    <div>{post.description}</div>
                    <div>{post.ingredients.map((ingredient, j) => {
                        return <React.Fragment key={j}>
                        <span>{ingredient.name}</span><span>{ingredient.value}</span><span>{ingredient.unit}</span>
                        </React.Fragment>
                        })}
                    </div>
                    <div>{post.directions}</div>
                    <div>Author: <span></span>
                        {post.username == "DeletedUser" 
                        ? <span>DeletedUser</span>
                        : <Link to={location => `/${post.username}`}>{post.username}</Link>
                        }
                    </div>
                    <div>Posted on: {formatDate(post.createdAt)}</div>
                    <div>Points: {post.points.length} <button onClick={(e) => this.addPoint(e, key)}>^</button></div>
                    <div><Link to={location => `/post/${post.id}`}>More</Link></div>
                    <hr />
                </div>
            }
            </>
        </React.Fragment>
    )
}
