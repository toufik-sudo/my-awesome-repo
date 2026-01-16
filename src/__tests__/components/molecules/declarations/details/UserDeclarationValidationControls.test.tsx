import React from 'react';
import { shallow, ShallowWrapper, mount } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import UserDeclarationValidationControls from 'components/molecules/wall/declarations/details/UserDeclarationValidationControls';
import { USER_DECLARATION_STATUS } from 'constants/api/declarations';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { emptyFn } from 'utils/general';

const finalValidationStatuses = [
  [USER_DECLARATION_STATUS.POINTS_ALLOCATED],
  [USER_DECLARATION_STATUS.VALIDATED],
  [USER_DECLARATION_STATUS.DECLINED],
  [USER_DECLARATION_STATUS.DELETED]
];

describe('UserDeclarationValidationControls', () => {
  const baseProps = { reloadDeclaration: jest.fn(), intl: {} };

  test('renders without crashing', () => {
    const pendingDeclarationProps = {
      ...baseProps,
      declaration: { status: USER_DECLARATION_STATUS.PENDING }
    };
    const wrapper = mount(
      <ProvidersWrapper>
        <UserDeclarationValidationControls {...pendingDeclarationProps} />
      </ProvidersWrapper>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(DynamicFormattedMessage)).toHaveLength(2);
  });

  test.each(finalValidationStatuses)('renders a single disabled button with status text for %p', currentStatus => {
    const declarationProps = {
      ...baseProps,
      declaration: { status: currentStatus }
    };
    const wrapper = mount(
      <ProvidersWrapper>
        <UserDeclarationValidationControls {...declarationProps} />
      </ProvidersWrapper>
    );

    expect(wrapper).toMatchSnapshot();
    const button = wrapper.find(DynamicFormattedMessage);
    expect(button).toHaveLength(1);
    expect(button.prop('onClick')).toBe(emptyFn);
  });
});
