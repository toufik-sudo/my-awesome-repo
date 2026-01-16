import React, { memo } from 'react';

import ButtonSubmitForm from 'components/atoms/ui/ButtonSubmitForm';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import buttonStyle from 'assets/style/common/Button.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render user declaration form
 *
 * @constructor
 */
const CreateUserDeclarationFormAdditional = ({ form, canValidate }) => {
  const { colorTitle } = useSelectedProgramDesign();

  return (
    <div className={coreStyle.btnCenter}>
      {canValidate && (
        <ButtonSubmitForm
          isSubmitting={form.isSubmitting}
          buttonText="wall.userDeclaration.validation.accept"
          className={buttonStyle.primaryinverted}
          loading={form.isSubmitting}
          customStyle={{ borderColor: colorTitle, color: colorTitle }}
        />
      )}
    </div>
  );
};

export default memo(CreateUserDeclarationFormAdditional);
