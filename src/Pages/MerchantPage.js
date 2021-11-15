import '../App.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
// import PropTypes from 'prop-types';

// this line will become const MerchantPage = (props) => { once there are props
const MerchantPage = () => {
  // set state
  const [currentSub, setCurrentSub] = useState('General');

  const navigate = useNavigate();
  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  useEffect(() => {

  }, []);

  function selectSubcategory(choice) {
    switch (choice) {
      case 'General':
        setCurrentSub('General');
        break;
      case 'YourPosts':
        setCurrentSub('YourPosts');
        break;
      case 'CostumerPosts':
        setCurrentSub('CostumerPosts');
        break;
      default:
        setCurrentSub('General');
        break;
    }
  }

  const logout = async () => {
    console.log('Logout');

    // post to backend to log out usre

    // go bck to main page
    navigate('/');
  };

  function renderLeftSide() {
    return (
      <>
        <button type="button" id="GeneralBtn" onClick={() => selectSubcategory('General')}>General</button>
        <button type="button" id="YourPostsBtn" onClick={() => selectSubcategory('YourPosts')}>Your Posts</button>
        <button type="button" id="CostumerPostsBtn" onClick={() => selectSubcategory('CostumerPosts')}>Costumer Posts</button>
        <button type="button" id="LogoutBtn" onClick={logout}>Logout</button>
      </>
    );
  }

  function renderGeneral() {
    return (
      <>
        <div>General</div>
        <div>Restaurant Name: </div>
        <div>Restaurant Yelp ID:</div>
      </>
    );
  }

  const onClickCreateNewPost = () => {
    setCurrentSub('NewPost');
  };

  function renderYourPosts() {
    return (
      <>
        <div>Your Posts</div>
        <button type="button" onClick={onClickCreateNewPost}>New Post</button>
      </>
    );
  }

  function renderCostumerPosts() {
    return (
      <>
        <div>Costumer Posts</div>
      </>
    );
  }

  const createNewPost = (event) => {
    event.preventDefault();
    setCurrentSub('YourPosts');
  };

  const backButtonPress = () => {
    setCurrentSub('YourPosts');
  };

  function renderCreatePost() {
    return (
      <>
        <button type="button" onClick={backButtonPress}>Back</button>
        <div>Create Post</div>
        <form onSubmit={createNewPost}>
          <input type="text" placeholder="Enter Title" />
          <input type="text" placeholder="Enter Body" />
          <button type="submit">Publish</button>
        </form>
      </>
    );
  }

  function renderBody() {
    switch (currentSub) {
      case 'General':
        return renderGeneral();
      case 'YourPosts':
        return renderYourPosts();
      case 'CostumerPosts':
        return renderCostumerPosts();
      case 'NewPost':
        return renderCreatePost();
      default:
        return renderGeneral();
    }
  }

  // TODO: Render component
  return (
    <>
      <div>Merchant Page</div>
      {renderLeftSide()}
      {renderBody()}
    </>
  );
};

// TODO: PropTypes
MerchantPage.propTypes = {

};

export default MerchantPage;
