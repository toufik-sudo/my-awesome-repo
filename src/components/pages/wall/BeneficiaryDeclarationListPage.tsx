import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import ReactTooltip from 'react-tooltip';

import LinkBack from 'components/atoms/ui/LinkBack';
import AddUserDeclarationModal from 'components/organisms/modals/AddUserDeclarationModal';
import Button from 'components/atoms/ui/Button';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import GlobalSlider from 'components/molecules/wall/globalSlider/GlobalSlider';
import useUserDeclarationsMenuControls from 'hooks/declarations/useUserDeclarationsMenuControls';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserBeneficiary } from 'services/security/accessServices';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BeneficiaryDeclarationList } from 'components/organisms/wall/declarations/BeneficiaryDeclarationList';
import { useBeneficiaryDeclarationPage } from 'hooks/wall/beneficiary/useBeneficiaryDeclarationPage';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { WALL_ROUTE, WALL_BENEFICIARY_CREATE_DECLARATION_ROUTE } from 'constants/routes';
import { WALL_TYPE, LOADER_TYPE } from 'constants/general';
import Loading from 'components/atoms/ui/Loading';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';
import { TOOLTIP_FIELDS } from 'constants/tootltip';
import { useProgramDeclarationData } from 'hooks/wall/useProgramDeclarationData';

import buttonStyle from 'assets/style/common/Button.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import sliderStyle from 'sass-boilerplate/stylesheets/components/wall/ProgramsSlider.module.scss';
import declarationStyle from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';
import bootstrap from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 * Component used for rendering declarations made by current logged user
 * @constructor
 */
const BeneficiaryDeclarationListPage = () => {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const { isProgramSelectionLocked, selectedProgramId, loadingPlatforms } = useUserDeclarationsMenuControls();
  const { userDeclarationMenuProgramLabel } = declarationStyle;
  const {
    selectedPlatform: { role }
  } = useWallSelection();
  const {
    declarations,
    hasMore,
    isLoading,
    loadMore,
    scrollRef,
    listCriteria,
    onSort
  } = useBeneficiaryDeclarationPage();
  const { colorSidebar, colorTitle } = useSelectedProgramDesign();
  const { beneficiaryCanDeclare } = useProgramDeclarationData();

  if (loadingPlatforms) {
    return <Loading type={LOADER_TYPE.PAGE} />;
  }

  if (!isUserBeneficiary(role)) {
    history.push(WALL_ROUTE);
    return null;
  }

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <div className={`${tableStyle.table}  ${coreStyle.px3}`}>
        <div
          className={`${tableStyle.tableHeaderResponsiveMobile} ${coreStyle.py1} ${bootstrap['text-white']} ${tableStyle.tablePage} ${coreStyle.px6} ${coreStyle['flex-space-between']}`}
          style={{ backgroundColor: colorSidebar }}
        >
          <LinkBack
            className={tableStyle.tableHeaderElem}
            to={WALL_ROUTE}
            messageId="wall.userDeclarations.back.to.wall"
          />
          <GlobalSlider
            key={`${selectedProgramId}${isProgramSelectionLocked}`}
            className={` ${sliderStyle.programSliderContainer} ${sliderStyle.white} ${tableStyle.tableHeaderResponsiveMobile} ${tableStyle.tableHeaderElem}`}
            isOnUserDeclarations={true}
            programLabelClass={userDeclarationMenuProgramLabel}
          />
          {beneficiaryCanDeclare && (
            <DynamicFormattedMessage
              variant={BUTTON_MAIN_VARIANT.INVERTED}
              tag={Button}
              onClick={() => history.push(WALL_BENEFICIARY_CREATE_DECLARATION_ROUTE)}
              id="wall.userDeclarations.declareResult"
              customStyle={{
                color: colorTitle,
                borderColor: colorTitle
              }}
            />
          )}
          {!beneficiaryCanDeclare && (
            <div data-tip={formatMessage({ id: 'wall.userDeclarations.add.administratorUpload' })}>
              <DynamicFormattedMessage
                variant={BUTTON_MAIN_VARIANT.INVERTED}
                tag={Button}
                id="wall.userDeclarations.declareResult"
                customStyle={{
                  color: colorTitle,
                  borderColor: colorTitle
                }}
                disabled={true}
                className={`${buttonStyle.disabled}`}
              />
              <ReactTooltip place={TOOLTIP_FIELDS.PLACE_BOTTOM} effect={TOOLTIP_FIELDS.EFFECT_SOLID} />
            </div>
          )}
          <AddUserDeclarationModal />
        </div>
        <BeneficiaryDeclarationList
          {...{ hasMore, loadMore, scrollRef, isLoading, declarations, listCriteria, onSort, selectedProgramId }}
        />
      </div>
    </LeftSideLayout>
  );
};

export default BeneficiaryDeclarationListPage;
