import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import BaseBlockElement from 'components/molecules/launch/block/BaseBlockElement';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

describe('BaseElement', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <BaseBlockElement
        bodySection={<DynamicFormattedMessage id={'launchProgram.rewards.type.correlated'} tag={HTML_TAGS.P} />}
        titleSection={<DynamicFormattedMessage id={'launchProgram.rewards.type.correlated'} tag={HTML_TAGS.P} />}
        icon={false}
      />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
