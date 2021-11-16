import React from 'react';
import { componentMapping } from './Item';

// looping over each key in componentMapping and creates button for it
// to add a new item
const Toolbar = (props) => {
  const { addItem } = [props];
  return (
    <div className="toolbar">
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
