import React, { useMemo } from 'react';

import UserDeclarationDetailRow from 'components/molecules/wall/declarations/details/UserDeclarationDetailsRow';
import { buildDeclarationFields, extractDeclarationDataForField } from 'services/UserDeclarationServices';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render user declaration detail form
 * @param fieldsToDisplay
 * @param declaration
 * @constructor
 */
const UserDeclarationDetailForm = ({ fieldsToDisplay, declaration }) => {
  console.log("declaration")
  console.log(declaration)
  const fieldsMapping = useMemo<any>(() => buildDeclarationFields(fieldsToDisplay,declaration.program.type,declaration.program.measurementName), [fieldsToDisplay]);
  const keyPrefix = 'wall.userDeclarations.detail.label.';
  const labelValues = {
    programType: declaration.program && declaration.program.type
  };
  console.log("fieldsMapping")
  console.log(fieldsMapping)
  
  const parsedAdditionalComments = useMemo(() => {
    if (declaration.additionalComments) {
      try {
        return JSON.parse(declaration.additionalComments);
      } catch (error) {
        console.error('Error parsing additionalComments:', error);
        return null;
      }
    }
    return null;
  }, [declaration.additionalComments]);

  return (
    <div className={coreStyle.my3}>
      {fieldsMapping.map(field => (
        <UserDeclarationDetailRow
          key={`userDeclarationField_${declaration.id}_${field.label}`}
          {...field}
          label={`${keyPrefix}${field.label}`}
          value={extractDeclarationDataForField(declaration, field.label,parsedAdditionalComments)}
          labelValues={labelValues}
          disabled={true}
        />
      ))}
      {declaration.proofFile && (
        <UserDeclarationDetailRow
          type={HTML_TAGS.ANCHOR}
          label={`${keyPrefix}proof`}
          labelValues={labelValues}
          value={declaration.proofFile.originalFilename}
          link={declaration.proofFile.publicPath}
        />
      )}
    </div>
  );
};

export default UserDeclarationDetailForm;
