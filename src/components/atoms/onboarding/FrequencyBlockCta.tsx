import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { createPlatform } from 'store/actions/boardingActions';
import style from 'assets/style/components/Subscription.module.scss';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';

/**
 * Atom component used to render cta for frequency block
 *
 * @constructor
 *
 * @see FrequencyBlockCtaStory
 */
const FrequencyBlockCta = ({ frequencyId }) => {
  const history = useHistory();
  const platformId = usePlatformIdSelection();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePlatform = () => {
    setIsLoading(true);
    createPlatform(platformId, history, frequencyId).finally(() => setIsLoading(false));
  };

  return (
    <div className={style.frequencyButtonWrapper}>
      <ButtonFormatted
        onClick={handleCreatePlatform}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
        type={BUTTON_MAIN_TYPE.PRIMARY}
        buttonText="form.submit.choose"
        isLoading={isLoading}
      />
    </div>
  );
};

export default FrequencyBlockCta;
