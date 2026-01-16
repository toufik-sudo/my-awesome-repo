import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import LinkBack from 'components/atoms/ui/LinkBack';
import GlobalSlider from 'components/molecules/wall/globalSlider/GlobalSlider';
import AddUserDeclarationModal from 'components/organisms/modals/AddUserDeclarationModal';
import { HTML_TAGS } from 'constants/general';
import { USER_DECLARATION_ADD_FORM_ROUTE, USER_DECLARATIONS_ROUTE, WALL_BENEFICIARY_CREATE_DECLARATION_ROUTE, WALL_ROUTE } from 'constants/routes';
import useUserDeclarationsMenuControls from 'hooks/declarations/useUserDeclarationsMenuControls';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { IStore } from 'interfaces/store/IStore';

import declarationStyle from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import bootstrap from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import sliderStyle from 'sass-boilerplate/stylesheets/components/wall/ProgramsSlider.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';
import  Button from 'components/atoms/ui/Button';

/**
 * Molecule component used to render table header
 * @constructor
 */
const UserDeclarationHeaderMenu = () => {
  const history = useHistory();
  const {
    isProgramSelectionLocked,
    onAddNew,
    selectedProgramId,
    programs,
    selectedProgramIndex
  } = useUserDeclarationsMenuControls();
  const { userDeclarationListHeader } = declarationStyle;
  const { ml1, mLargeMl0 } = coreStyle;
  const { tableHeaderElem, tableHeaderResponsiveMobile } = tableStyle;
  const { colorSidebar, colorTitle } = useSelectedProgramDesign();
  const { listSorting } = useSelector((store: IStore) => store.userDeclarationReducer);

  const [declarationForm, setDeclarationForm] = useState(true);
  const [excelFileImport, setExcelFileImport] = useState(true);

  useEffect(() => {
    if (programs[selectedProgramIndex]) {
      setDeclarationForm(programs[selectedProgramIndex].resultsDeclarationForm);
      setExcelFileImport(programs[selectedProgramIndex].uploadResultsFile);
    }
  }, [selectedProgramId]);

  const redirectToDeclarationForm = () => {
    history.push({
      pathname: USER_DECLARATION_ADD_FORM_ROUTE,
      state: listSorting
    });
    return;
  };

  return (
    <div
      className={`${userDeclarationListHeader} ${tableStyle.tableHeaderResponsiveMobile} ${coreStyle.py1} ${bootstrap['text-white']} ${tableStyle.tablePage}`}
      style={{ background: colorSidebar }}
    >
      <LinkBack
        className={`${tableStyle.tableHeaderElem}`}
        to={WALL_ROUTE}
        messageId="wall.userDeclarations.back.to.wall"
      />
      <div className={coreStyle.relative}>
        <GlobalSlider
          key={`${selectedProgramId}${isProgramSelectionLocked}`}
          className={`${sliderStyle.white} ${tableHeaderResponsiveMobile} ${tableHeaderElem}`}
          isOnUserDeclarations={true}
        />
      </div>
      <div
        className={`${coreStyle['flex-center-total']} ${tableStyle.tableHeaderElem}`}
        onClick={!excelFileImport && declarationForm ? redirectToDeclarationForm : onAddNew}
      >
        <DynamicFormattedMessage
              variant={BUTTON_MAIN_VARIANT.INVERTED}
              tag={Button}
              onClick={() => history.push(USER_DECLARATIONS_ROUTE)}
              id="wall.userDeclarations.declareResult"
              customStyle={{
                color: colorTitle,
                borderColor: colorTitle
              }}
            />
      </div>
      <AddUserDeclarationModal />
    </div>
  );
};

export default UserDeclarationHeaderMenu;
