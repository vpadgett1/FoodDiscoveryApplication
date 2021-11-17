import React from 'react';
import { componentMapping } from './Item';
import DiscoverPage from '../Pages/DiscoverPage';

// looping over each key in componentMapping and creates button for it
// to add a new item
const Toolbar = (props) => {
  const { addItem } = [props];
  return (
    <div className="toolbar">
      <button type="submit" onClick={createPost}>Create Post</button>
      {Object.keys(componentMapping).map((key) => (
        // eslint-disable-next-line react/button-has-type
        <button onClick={() => addItem(key, {})}>
          {key}
        </button>

      ))}
    </div>
  );
};
export default Toolbar;
