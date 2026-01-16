import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import ButtonBack from 'components/atoms/ui/ButtonBack';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import Button from 'components/atoms/ui/Button';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import ButtonDelete from 'components/atoms/ui/ButtonDelete';
import ButtonSwitch from 'components/atoms/ui/ButtonSwitch';
import ButtonClose from 'components/atoms/ui/ButtonClose';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import { buttonsOptions, getInverted, getSampleAction, getText } from 'services/StoriesServices';
import { BUTTON_TYPES } from 'constants/stories';
import { emptyFn } from 'utils/general';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';
import ButtonDownload from 'components/atoms/ui/ButtonDownload';

const ButtonStory = storiesOf('Atoms/Ui/Button', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(BUTTON_TYPES.DEFAULT, () => (
    <Button type={buttonsOptions()} variant={getInverted()} onClick={getSampleAction()}>
      {getText()}
    </Button>
  ))
  .add(BUTTON_TYPES.DELETE, () => <ButtonDelete onclick={emptyFn} />)
  .add(BUTTON_TYPES.BACK, () => <ButtonBack onClick={getSampleAction()} />)
  .add(BUTTON_TYPES.FORMATTED, () => (
    <ProvidersWrapper>
      <ButtonFormatted
        type={buttonsOptions()}
        onClick={getSampleAction()}
        variant={BUTTON_MAIN_VARIANT.NORMAL}
        buttonText={getText()}
      />
    </ProvidersWrapper>
  ))
  .add(BUTTON_TYPES.SWITCH, () => {
    const [isChecked, setChecked] = useState(false);

    return <ButtonSwitch isChecked={isChecked} setIsChecked={() => setChecked(!isChecked)} />;
  })
  .add(BUTTON_TYPES.CLOSE, () => <ButtonClose closeModal={emptyFn} />)
  .add(BUTTON_TYPES.SUBMIT_FORM, () => (
    <ProvidersWrapper>
      <SubmitFormButton
        type={buttonsOptions()}
        className=""
        buttonText={getText()}
        isSubmitting={false}
        loading={boolean('Is loading', false)}
        nextStepDisabled={false}
      />
    </ProvidersWrapper>
  ))
  .add(BUTTON_TYPES.DOWNLOAD, () => (
    <ProvidersWrapper>
      <ButtonDownload type=".csv" />
    </ProvidersWrapper>
  ));

export default ButtonStory;
