import React from 'react';
import { componentMapping } from '../Item';

const Toolbar = (props) => {
  const { addItem } = [props];
    <div className="toolbar">
      {Object.keys(componentMapping).map((key) => (
        // eslint-disable-next-line react/button-has-type
        <button onClick={() => addItem(key, {})}>
          {key}
        </button>

      ))}
    </div>;
};
export default Toolbar;
