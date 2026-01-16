import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { BlobProvider } from '@react-pdf/renderer';

import { UserContext } from 'components/App';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import GenericLaunchErrorMessageField from 'components/molecules/launch/launchValidation/GenericLaunchErrorMessageField';
import { ChallengeTC } from 'components/molecules/pdf/ChallengeTC';
import { LoyaltyTC } from 'components/molecules/pdf/LoyaltyTC';
import { SponsorshipTC } from 'components/molecules/pdf/SponsorshipTC';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { LAUNCH_EDIT_ROUTE } from 'constants/routes';
import { CHALLENGE, FREEMIUM, LOYALTY, SPONSORSHIP } from 'constants/wall/launch';
import { createProgramSubmitAction } from 'store/actions/formActions';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import { DynamicTCDocument } from '../pdf/DynamicTCDocument';
import { StaticTCDocument } from '../pdf/StaticTCDocument';

/**
 * Molecule component used to Final Step buttons
 *
 * @constructor
 */
const FinalStepButtons = () => {
  const { section, buttonSection } = style;
  const history = useHistory();
  const launchStoreData = useSelector((store: IStore) => store.launchReducer);
  const userData = useContext(UserContext);
  const dispatch = useDispatch();
  const [launchError, setLaunchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { value: selectedLanguage } = useSelector((state: IStore) => state.languageReducer.selectedLanguage);

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 1);
  });

  let document;
  if (launchStoreData) {
    switch (launchStoreData.type) {
      case CHALLENGE:
        document = <ChallengeTC launchData={launchStoreData} userData={userData} />;
        break;
      case LOYALTY:
        document = <LoyaltyTC launchData={launchStoreData} userData={userData} />;
        break;
      case SPONSORSHIP:
        document = <SponsorshipTC launchData={launchStoreData} userData={userData} />;
        break;
      case FREEMIUM:
        document = <StaticTCDocument language={selectedLanguage} />;
        break;
      default:
        document = (
          <DynamicTCDocument launchData={launchStoreData} userData={userData} programType={launchStoreData.type} />
        );
    }
  }

  return (
    <div className={`${section} ${buttonSection}`}>
      <GenericLaunchErrorMessageField error={launchError} />
      {(ready && (
        <BlobProvider document={document}>
          {({ blob }) => {
            return (
              <ButtonFormatted
                isLoading={loading}
                onClick={() => createProgramSubmitAction(launchStoreData, dispatch, setLaunchError, setLoading, blob)}
                type={BUTTON_MAIN_TYPE.PRIMARY}
                buttonText={!launchStoreData.isModify? "launchProgram.btn.launch" : "editProgram.btn.edit"}
              />
            );
          }}
        </BlobProvider>
      )) || (
        <ButtonFormatted
          isLoading={loading}
          onClick={() => createProgramSubmitAction(launchStoreData, dispatch, setLaunchError, setLoading)}
          type={BUTTON_MAIN_TYPE.PRIMARY}
          buttonText={!launchStoreData.isModify? "launchProgram.btn.launch" : "editProgram.btn.edit"}
        />
      )}

      {!launchStoreData.isModify && <ButtonFormatted
        onClick={() => history.push(LAUNCH_EDIT_ROUTE)}
        type={BUTTON_MAIN_TYPE.PRIMARY}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
        buttonText="launchProgram.btn.edit"
      />}
    </div>
  );
};

export default FinalStepButtons;
