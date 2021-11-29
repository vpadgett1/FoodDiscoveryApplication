/* eslint-disable react/no-unused-prop-types */
import '../App.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Heart from '../assets/Heart.png';
import Comment from '../assets/Comment.png';
import Arrow from '../assets/Arrow.png';

// this line will become const Post = (props) => { once there are props
const Post = (props) => {
  // set state
  // const [state, setState] = useState(value);
  const [showCreateComment, setShowCreateComment] = useState(false);
  const [liked,
    // setLiked
  ] = useState(false);

  const [additionalComments, setAdditionalComments] = useState([]);

  // deconstruct props - uncomment the below
  // once the props are used
  const {
    AuthorID,
    postText,
    postTitle,
    postLikes,
    profilePic,
    postComments,
    postID,
    currentUserID,
    currentUserProfilePic,
    currentUserName,
    AuthorName,
  } = props;

  const postComment = (event) => {
    event.preventDefault();

    // get all the info needed
    const input = document.getElementById(`${postID}createComment`).value;
    console.log(input);

    fetch(`/createComment?AuthorID=${currentUserID}&postText=${input}&post_id=${postID}`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        // display the comment
        const newComment = {
          AuthorID: currentUserID,
          CommentorProfilePic: currentUserProfilePic,
          CommentorName: currentUserName,
          postText: input,
        };

        setAdditionalComments([newComment, ...additionalComments]);

        // hide the create comment section
        setShowCreateComment(false);
      })
      .catch((error) => console.log(error));
  };

  function renderCreateComment() {
    if (!showCreateComment) {
      return (<></>);
    }
    return (
      <div className="comment">
        <div className="commentProfileInfo">
          <img src={currentUserProfilePic} alt="profile" />
          <div>{currentUserName}</div>
        </div>
        <form onSubmit={postComment} className="createCommentForm">
          <input type="text" placeholder="Enter your comment" id={`${postID}createComment`} />
          <button type="submit"><img src={Arrow} alt="arrow" /></button>
        </form>
      </div>

    );
  }

  // Render the comments on a post
  function renderComments() {
    if (postComments && postComments.length === 0 && additionalComments.length === 0) {
      return (
        <div className="comment">
          No comments
        </div>
      );
    }

    return (
      <>
        {additionalComments && additionalComments.map((x) => (
          <div className="comment">
            <div className="commentProfileInfo">
              <img src={x.CommentorProfilePic} alt="profile" />
              <div>
                <Link
                  to="/userprofile"
                  state={{ userId: x.AuthorID }}
                >
                  {x.CommentorName}
                </Link>
              </div>
            </div>
            <div>
              {x.postText}
            </div>
          </div>
        ))}
        {postComments && postComments.map((x) => (
          <div className="comment">
            <div className="commentProfileInfo">
              <img src={x.CommentorProfilePic} alt="profile" />
              <div>
                <Link
                  to="/userprofile"
                  state={{ userId: x.AuthorID }}
                >
                  {x.CommentorName}
                </Link>
              </div>
            </div>
            <div>
              {x.postText}
            </div>
          </div>
        ))}
      </>
    );
  }

  const onClickComment = () => {
    setShowCreateComment(!showCreateComment);
  };

  return (
    <div className="post">
      <div className="post-user-info">
        <img src={profilePic} alt="profile" />
        <div>
          <Link
            to="/userprofile"
            state={{ userId: AuthorID }}
          >
            {AuthorName}
          </Link>
        </div>
      </div>
      <div className="postTitle">
        {postTitle}
      </div>
      <div className="postText">
        {postText}
      </div>
      <div className="postLikes">
        <img src={Heart} alt="heart" className={liked ? 'clicked' : 'unclicked'} />
        <div>{postLikes}</div>
        <button type="button" onClick={onClickComment}><img src={Comment} alt="add comment" className={showCreateComment ? 'clicked' : 'unclicked'} /></button>
      </div>
      <div className="postDivider" />
      {renderCreateComment()}
      {renderComments()}
    </div>
  );
};

Post.propTypes = {
  postID: PropTypes.number.isRequired,
  currentUserID: PropTypes.string.isRequired,
  currentUserProfilePic: PropTypes.string.isRequired,
  currentUserName: PropTypes.string.isRequired,
  AuthorID: PropTypes.string.isRequired,
  postText: PropTypes.string.isRequired,
  postTitle: PropTypes.string.isRequired,
  postLikes: PropTypes.number.isRequired,
  profilePic: PropTypes.string.isRequired,
  AuthorName: PropTypes.string.isRequired,
  postComments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    postText: PropTypes.string.isRequired,
    RestaurantName: PropTypes.string.isRequired,
    postID: PropTypes.number.isRequired,
  })).isRequired,
};

export default Post;
