import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ContentsPageEditor from 'components/atoms/launch/contents/ContentPageEditor';

describe('Contents editor page', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ContentsPageEditor editorState={''} handleEditorChange={''} wysiwigLength={''} form={''} />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
