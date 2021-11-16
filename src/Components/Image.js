import React from 'react';

const Image = (props) => {
  const {
    src, alt,
  } = [props];
    <div>
      <img src={src} alt={alt} />
    </div>;
};
// eslint-disable-next-line no-unused-vars
const componentMapping = {
  // eslint-disable-next-line react/jsx-props-no-spreading
  img: (content) => <Image {...content} />,
};
export default Image;
