import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import MediaBlock from 'components/molecules/wall/postBlock/media/MediaBlock';
import MediaImage from 'components/atoms/wall/MediaImage';
import MediaFile from 'components/atoms/wall/MediaFile';
import { FILE, VIDEO } from 'constants/files';

describe('MediaBlock', () => {
  const defaultProps = {
    media: {},
    showModal: false,
    setShowModal: jest.fn()
  };

  test('renders with image preview for video without crashing', () => {
    const wrapper: ShallowWrapper<{}> = shallow(<MediaBlock {...defaultProps} mediaType={VIDEO} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MediaImage)).toHaveLength(0);
  });

  test('renders with file preview without crashing', () => {
    const props = {
      media: {},
      mediaType: FILE,
      showModal: false,
      setShowModal: jest.fn()
    };
    const wrapper: ShallowWrapper<{}> = shallow(<MediaBlock {...defaultProps} mediaType={FILE} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MediaImage)).toHaveLength(0);
    expect(wrapper.find(MediaFile)).toHaveLength(1);
  });
});
