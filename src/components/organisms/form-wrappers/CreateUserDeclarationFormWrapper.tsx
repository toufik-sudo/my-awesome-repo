import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

import useCreateUserDeclaration from 'hooks/declarations/useCreateUserDeclaration';
import useActiveProgramUsersLoader from 'hooks/wall/useActiveProgramUsersLoader';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import GenericFormBuilder from './GenericFormBuilder';
import ProgramSelector from 'components/molecules/wall/ProgramSelector';
import UserSelector from 'components/molecules/wall/UserAsyncSelector';
import CreateUserDeclarationFormAdditional from 'components/molecules/forms/CreateUserDeclarationFormAdditional';
import Loading from 'components/atoms/ui/Loading';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import Button from 'components/atoms/ui/Button';
import { LOADER_TYPE } from 'constants/general';
import { BENEFICIARY_FIELD } from 'constants/formDefinitions/genericFields';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserBeneficiary } from 'services/security/accessServices';
import { Link } from 'react-router-dom';
import {WALL_BENEFICIARY_DECLARATIONS_ROUTE, WALL_ROUTE} from 'constants/routes';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';

import styles from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/WallUserDeclarationsBlock.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import bootstrap from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import LinkBack from "../../atoms/ui/LinkBack";

export const CreateDeclarationContext = React.createContext(null);

/**
 * Component used to display user declaration form
 * @param programs
 * @constructor
 */
const CreateUserDeclarationFormWrapper = ({ programs = [] }) => {
  const history = useHistory();
  const {
    selectedProgramId,
    selectedPlatform: { role },
    selectedProgramIndex,
    programs: platformPrograms
  } = useWallSelection();
  const isBeneficiary = isUserBeneficiary(role);

  if (
    isBeneficiary &&
    platformPrograms[selectedProgramIndex] &&
    !platformPrograms[selectedProgramIndex].resultsDeclarationForm
  ) {
    history.push(WALL_BENEFICIARY_DECLARATIONS_ROUTE);
  }

  const {
    selectedProgram,
    onProgramChange,
    declarationFields,
    onBeneficiaryChange: onUserChange,
    errors,
    reloadKey,
    onValidate,
    programData
  } = useCreateUserDeclaration(isBeneficiary);

  useEffect(() => {
    if (isBeneficiary) onProgramChange({ id: selectedProgramId });
  }, [isBeneficiary, selectedProgramId]);

  const programId = selectedProgram && selectedProgram.value;
  const { loadUsers } = useActiveProgramUsersLoader(programId);
  const { colorSidebar, colorTitle } = useSelectedProgramDesign();
  let formContent = null;

  if (!declarationFields.loading) {
    formContent = (
      <GeneralBlock className={isBeneficiary ? componentStyle.createDeclarationCustomWrapper : ''}>
        {isBeneficiary && (
          <div
            className={`${tableStyle.tableHeaderResponsiveMobile} ${coreStyle.py1} ${bootstrap['text-white']} ${tableStyle.tablePage}`}
            style={{ backgroundColor: colorSidebar }}
          >
            <LinkBack
                className={`${tableStyle.tableHeaderElem} ${tableStyle.linkBackFloatLeft}`}
                to={WALL_ROUTE}
                messageId="wall.userDeclarations.back.to.wall"
            />
            <Link to={WALL_BENEFICIARY_DECLARATIONS_ROUTE}>
              <DynamicFormattedMessage
                tag={Button}
                variant={BUTTON_MAIN_VARIANT.INVERTED}
                id="wall.userDeclarations.block.mine"
                customStyle={{
                  color: colorTitle,
                  borderColor: colorTitle
                }}
              />
            </Link>
          </div>
        )}
        <div className={componentStyle.userDeclarationForm}>
          <CreateDeclarationContext.Provider value={programData}>
            <GenericFormBuilder
              formAction={onValidate}
              formDeclaration={declarationFields.formFields}
              formSlot={form => (
                <CreateUserDeclarationFormAdditional form={form} canValidate={!!declarationFields.formFields.length} />
              )}
            />
          </CreateDeclarationContext.Provider>
        </div>
      </GeneralBlock>
    );
  }

  return (
    <div className={`${styles.wrapperCenter} ${componentStyle.addDeclaration}`} key={reloadKey}>
      {!isBeneficiary && (
        <>
          <ProgramSelector {...{ selectedProgram, programs, onProgramChange, error: errors.programError }} />
          <UserSelector
            {...{ field: BENEFICIARY_FIELD, onUserChange, loadUsers, error: errors.beneficiaryError }}
            key={`beneficiary_${programId}`}
          />
        </>
      )}
      {!!declarationFields.formFields.length && formContent}
      {declarationFields.loading && <Loading type={LOADER_TYPE.DROPZONE} />}
    </div>
  );
};

export default CreateUserDeclarationFormWrapper;

