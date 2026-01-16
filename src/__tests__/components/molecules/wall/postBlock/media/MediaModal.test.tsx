import React from 'react';
import { mount } from 'enzyme';

import MediaModal from 'components/molecules/wall/postBlock/media/MediaModal';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { VIDEO, IMAGE } from 'constants/files';

describe('MediaModal', () => {
  test('renders video without crashing when open', () => {
    const props = {
      setShowModal: jest.fn(),
      media: {},
      mediaType: VIDEO,
      showModal: true
    };
    const wrapper = mount(
      <ProvidersWrapper>
        <MediaModal {...props} />
      </ProvidersWrapper>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('video')).toHaveLength(1);
  });

  test('renders image without crashing when open', () => {
    const props = {
      setShowModal: jest.fn(),
      media: {},
      mediaType: IMAGE,
      showModal: true
    };
    const wrapper = mount(
      <ProvidersWrapper>
        <MediaModal {...props} />
      </ProvidersWrapper>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img')).toHaveLength(1);
  });
});
