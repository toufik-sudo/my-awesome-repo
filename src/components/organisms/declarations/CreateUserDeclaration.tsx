import React, { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import CreateUserDeclarationFormWrapper from 'components/organisms/form-wrappers/CreateUserDeclarationFormWrapper';
import UploadUserDeclaration from 'components/organisms/declarations/upload/UploadUserDeclarations';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import LinkBack from 'components/atoms/ui/LinkBack';
import { USER_DECLARATIONS_ROUTE } from 'constants/routes';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isIndividualDeclaration, isDeclarationUpload } from 'services/UserDeclarationServices';
import { HTML_TAGS } from 'constants/general';
import { getUserAuthorizations, isAnyKindOfAdmin } from 'services/security/accessServices';
import { getOngoingProgramsWhereUserIsAdmin } from 'services/ProgramServices';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclarationDetail.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { FREEMIUM, PROGRAM_TYPES } from '../../../constants/wall/launch';

/**
 * Organism component used to render a User Declaration block
 * @param type
 * @constructor
 */
const CreateUserDeclaration = ({ type }) => {
  const { state } = useLocation();
  const history = useHistory();
  const {
    platforms,
    selectedPlatform: { role }
  } = useWallSelection();
  const userRights = getUserAuthorizations(role);
  const adminUser = isAnyKindOfAdmin(userRights);
  const programs = useMemo(() => adminUser && getOngoingProgramsWhereUserIsAdmin(platforms), [platforms, adminUser]);

  const { userDeclarationsDetail, userDeclarationsDetailWrapper, userDeclarationsDetailControls } = style;
  const { withPrimaryColor, withBoldFont } = coreStyle;

  if (!adminUser) {
    history.replace(USER_DECLARATIONS_ROUTE);

    return null;
  }

  return (
    <div className={userDeclarationsDetail}>
      <GeneralBlock className={coreStyle.mt5}>
        <div className={userDeclarationsDetailWrapper}>
          <LinkBack
            className={`${withPrimaryColor} ${coreStyle.textLeft}`}
            to={{
              pathname: USER_DECLARATIONS_ROUTE,
              state
            }}
            messageId="wall.userDeclarations.back.to.list"
          />
          <DynamicFormattedMessage
            className={`${userDeclarationsDetailControls} ${withPrimaryColor} ${withBoldFont}`}
            tag={HTML_TAGS.DIV}
            id={`wall.userDeclarations.add.new.result.${type}`}
          />

          {isIndividualDeclaration(type) && (
            <CreateUserDeclarationFormWrapper
              programs={programs.filter(program => program.programType !== PROGRAM_TYPES[FREEMIUM])}
            />
          )}

          {isDeclarationUpload(type) && <UploadUserDeclaration programs={programs} />}
        </div>
      </GeneralBlock>
    </div>
  );
};

export default CreateUserDeclaration;
