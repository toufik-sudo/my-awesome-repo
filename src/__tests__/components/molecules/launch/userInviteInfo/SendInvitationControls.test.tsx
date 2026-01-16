import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import SendInvitationsControls from 'components/molecules/launch/userInviteInfo/SendInvitationsControls';

describe('SendInvitationsControls', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <SendInvitationsControls setNextStep={jest.fn()} setResultStep={jest.fn()} />
      </ProvidersWrapper>
    );
  });

  test('sets next step correctly', () => {
    const setNextStepMock = jest.fn();

    render(
      <ProvidersWrapper>
        <SendInvitationsControls submitUserInviteFieldList={setNextStepMock} setResultStep={jest.fn()} />
      </ProvidersWrapper>
    );
    fireEvent.click(screen.getByText('Yes'));

    expect(setNextStepMock.mock.calls.length).toEqual(1);
  });

  test('sets next step correctly', () => {
    const setResultStepMock = jest.fn();

    render(
      <ProvidersWrapper>
        <SendInvitationsControls submitUserInviteFieldList={jest.fn()} setResultStep={setResultStepMock} />
      </ProvidersWrapper>
    );
    fireEvent.click(screen.getByText('No'));

    expect(setResultStepMock.mock.calls.length).toEqual(0);
  });
});
