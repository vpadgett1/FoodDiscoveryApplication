/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

// an array of objects to show each textarea or post on a page (
// eslint-disable-next-line no-unused-vars
const item = {
  authorID: 'some-id',
  postText: 'text',
  postTitle: 'Title',
  postLikes: 'postLikes',
  userID: 'userID',
  postComments: 'postComments',
  type: 'some-type',
  content: 'some-content',
};
export const componentMapping = {
  // eslint-disable-next-line react/jsx-no-undef
  img: (content, updateItem) => <Image {...content} updateItem={updateItem} />,
};
const Item = (props) => {
  const {
    type, content, updateItem,
  } = [props];

  // ref for DOM elements
  const textBox = React.useRef();

  React.useEffect(() => {
    if (!type) {
      textBox.current.focus();
    }
  });

  return (
    <div>
      {!type ? (
        <textarea
          ref={textBox}
          value={content}
          onChange={(e) => updateItem(e.target.value)}
        />
      // eslint-disable-next-line no-undef
      ) : componentMapping[type](content, updateItem)}
    </div>
  );
};
// eslint-disable-next-line no-unused-vars
const imageItem = {
  type: 'img',
  id: 'some-id',
  content: {
    src: 'image-src',
    alt: 'image-alt',
  },
};

export default Item;
