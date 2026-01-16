import React from 'react';
import { useIntl } from 'react-intl';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { CAN_NEXT_STEP } from 'constants/wall/launch';
import { HTML_TAGS } from 'constants/general';

import inputstyle from 'assets/style/common/Input.module.scss';
import style from 'sass-boilerplate/stylesheets/components/launch/SocialNetworks.module.scss';
import { validateUrl } from '../../../../services/FormServices';

/**
 * Molecule component used to render social network input
 * @param socialNetwork
 * @param setNetwork
 * @param index
 * @constructor
 */
const SocialNetworkInput = ({ socialNetwork, setNetwork, index }) => {
  const { inputHolder, disabled, formError, socialNetworksInput } = style;
  const placeholder = useIntl().formatMessage({ id: `launchProgram.contents.${index}.placeholder` });

  const onChange = ({ target: { value } }) => {
    setNetwork(
      {
        ...socialNetwork,
        value: value,
        hasError: false,
        [CAN_NEXT_STEP]: validateUrl(value)
      },
      index
    );
  };

  const onBlur = ({ target: { value } }) => {
    setNetwork(
      {
        ...socialNetwork,
        ...{
          value,
          hasError: !validateUrl(value),
          [CAN_NEXT_STEP]: true
        }
      },
      index
    );
  };

  return (
    <div className={inputHolder}>
      <div className={`${inputstyle.container}  ${socialNetworksInput} ${!socialNetwork.active ? disabled : ''}`}>
        <input
          className={style.defaultInputStyle}
          value={socialNetwork.value}
          disabled={!socialNetwork.active}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      </div>
      {socialNetwork.hasError && (
        <DynamicFormattedMessage className={formError} tag={HTML_TAGS.SPAN} id={'form.validation.invalid.url'} />
      )}
    </div>
  );
};

export default SocialNetworkInput;
