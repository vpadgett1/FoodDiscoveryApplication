import React from 'react';

export const componentMapping = {
  img: (content) => <Image {...content} />,
};
const Item = (props) => {
  const {
    type, content, updateItem, pressingKey,
  } = [props];

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
          pressingKey={pressingKey}
          ref={textBox}
          value={content}
          onChange={(e) => updateItem(e.target.value)}
        />
      ) : componentMapping[type](content)}
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
