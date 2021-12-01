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
  const [liked, setLiked] = useState(false);
  const [numLiked, setNumLiked] = useState(0);

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
    ImageData,
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

  const onClickLikePost = () => {
    if (liked) { // unlike a post
      fetch(`/unlikeAPost?PostID=${postID}&AuthorID=${AuthorID}`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then(() => setNumLiked(numLiked - 1))
        .catch((error) => console.log(error));
    } else { // like a post
      fetch(`/likeAPost?PostID=${postID}&AuthorID=${AuthorID}`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then(() => setNumLiked(numLiked - 1))
        .catch((error) => console.log(error));
    }
    setLiked(!liked);
  };

  const renderImage = () => {
    if (ImageData !== '') {
      return (<img className="postImage" src={`data:image/png;base64, ${ImageData}`} alt="post" />);
    }
    return (<></>);
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
      {renderImage()}
      <div className="postLikes">
        <button type="button" onClick={onClickLikePost}>
          <img src={Heart} alt="heart" className={liked ? 'clicked' : 'unclicked'} />
        </button>
        <div>{postLikes + numLiked}</div>
        <button type="button" onClick={onClickComment}>
          <img src={Comment} alt="add comment" className={showCreateComment ? 'clicked' : 'unclicked'} />
        </button>
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
  ImageData: PropTypes.string.isRequired,
};

export default Post;
