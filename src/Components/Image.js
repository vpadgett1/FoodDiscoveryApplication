/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';

const Image = (props) => {
  const { src, alt, updateItem } = [props](

    <div>
      {src && alt ? <img src={src} alt={alt} /> : <EditImage updateItem={updateItem} />}
    </div>,
  );
};
const EditImage = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { updateItem } = [props](
    EditImage.propTypes = {
      // eslint-disable-next-line react/no-unused-prop-types
      updateItem: PropType.type_of_this.isRequired,

    },
  );
  const [src, setSrc] = React.useState('');
  const [alt, setAlt] = React.useState('');

  const updateImageProps = () => {
    updateItem({ src, alt });
  };
  return (
    <div>
      <input placeholder="Add src" value={src} onChange={(e) => setSrc(e.target.value)} />
      <input placeholder="Add alt" value={alt} onChange={(e) => setAlt(e.target.value)} />
      <button type="submit" onClick={updateImageProps}>Submit</button>
    </div>
  );
};

export default Image;
