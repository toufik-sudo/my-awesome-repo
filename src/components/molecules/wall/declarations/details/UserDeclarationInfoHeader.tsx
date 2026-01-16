import React from 'react';

import UserDeclarationInfo from 'components/atoms/declarations/UserDeclarationInfo';
import LinkBack from 'components/atoms/ui/LinkBack';
import { USER_DECLARATIONS_ROUTE, WALL_BENEFICIARY_DECLARATIONS_ROUTE } from 'constants/routes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to user declaration details header
 * @param declaration
 * @param state
 * @param isBeneficiary
 * @constructor
 */
const UserDeclarationInfoHeader = ({ declaration, state = undefined, isBeneficiary }) => (
  <>
    <LinkBack
      className={`${coreStyle.mLargeMt5} ${coreStyle.textLeft} ${coreStyle.withPrimaryColor}`}
      to={{
        pathname: isBeneficiary ? WALL_BENEFICIARY_DECLARATIONS_ROUTE : USER_DECLARATIONS_ROUTE,
        state
      }}
      messageId="wall.userDeclarations.back.to.list"
    />
    <UserDeclarationInfo {...{ id: declaration.id, program: declaration.program }} />
  </>
);

export default UserDeclarationInfoHeader;
