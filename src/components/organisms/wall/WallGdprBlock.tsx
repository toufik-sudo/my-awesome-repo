import React from 'react';

import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import DeleteAccountModal from 'components/organisms/modals/DeleteAccountModal';
import useDeleteAccountModal from 'hooks/wall/useDeleteAccountModal';
import useUserDataDownload from 'hooks/user/useUserDataDownload';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { emptyFn } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
// import { isUserBeneficiary } from 'services/security/accessServices';
// import { useWallSelection } from 'hooks/wall/useWallSelection';

/**
 * Organism component used to render GDPR block
 *
 * @constructor
 */
const WallGdprBlock = () => {
  const { withGrayColor, mr15, mb15, mLargeMb1, mMediumMb1, displayNone } = coreStyle;
  const { setShowModal, showModal, onDelete } = useDeleteAccountModal();
  const { linkRef, download, isLoading } = useUserDataDownload();
  const messageId = 'wall.gdpr.';
  // const {
  //   selectedPlatform: { role }
  // } = useWallSelection();
  // const isBeneficiary = isUserBeneficiary(role);

  return (
    <>
      <div
        className={`${coreStyle['flex-space-between']} ${coreStyle['flex-align-items-center']} ${coreStyle['flex-wrap']} ${withGrayColor} ${mb15}`}
      >
        <DynamicFormattedMessage className={mLargeMb1} id={`${messageId}personal.data`} tag={HTML_TAGS.SPAN} />
        <div>
          {/*<ButtonFormatted*/}
          {/*  type={BUTTON_MAIN_TYPE.PRIMARY}*/}
          {/*  variant={BUTTON_MAIN_VARIANT.INVERTED}*/}
          {/*  className={`${mr15} ${mMediumMb1} `}*/}
          {/*  buttonText={`${messageId}cta.view`}*/}
          {/*/>*/}
          <ButtonFormatted
            type={BUTTON_MAIN_TYPE.PRIMARY}
            buttonText={`${messageId}cta.download`}
            isLoading={isLoading}
            onClick={isLoading ? emptyFn : download}
          />
          <a className={displayNone} ref={linkRef} download />
        </div>
      </div>

      {/*{!isBeneficiary && (*/}
      {/*  <div*/}
      {/*    className={`${coreStyle['flex-space-between']} ${coreStyle['flex-align-items-center']} ${coreStyle['flex-wrap']} ${withGrayColor} ${mb15}`}*/}
      {/*  >*/}
      {/*    <DynamicFormattedMessage className={mLargeMb1} id={`${messageId}company.data`} tag={HTML_TAGS.SPAN} />*/}
      {/*    <div>*/}
      {/*      <ButtonFormatted*/}
      {/*        type={BUTTON_MAIN_TYPE.PRIMARY}*/}
      {/*        variant={BUTTON_MAIN_VARIANT.INVERTED}*/}
      {/*        className={`${mr15} ${mMediumMb1} `}*/}
      {/*        buttonText={`${messageId}cta.view`}*/}
      {/*      />*/}

      {/*      /!*use isLoading props from button in order to make the loading effect when the user click on download*!/*/}
      {/*      <ButtonFormatted*/}
      {/*        type={BUTTON_MAIN_TYPE.PRIMARY}*/}
      {/*        isLoading={false}*/}
      {/*        buttonText={`${messageId}cta.download`}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      <div
        className={`${coreStyle['flex-space-between']} ${coreStyle['flex-align-items-center']} ${coreStyle['flex-wrap']} ${withGrayColor} ${mb15}`}
      >
        <DynamicFormattedMessage
          className={`${mr15} ${mMediumMb1} `}
          id={`${messageId}delete.account`}
          tag={HTML_TAGS.SPAN}
        />
        <div>
          <ButtonFormatted
            type={BUTTON_MAIN_TYPE.DANGER}
            onClick={() => setShowModal(true)}
            buttonText={`${messageId}cta.validate`}
          />
        </div>
      </div>

      <DeleteAccountModal {...{ setShowModal, showModal, onDelete }} />
    </>
  );
};

export default WallGdprBlock;
