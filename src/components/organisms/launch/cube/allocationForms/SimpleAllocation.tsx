import React from 'react';

import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import AllocationTypeValidateCTA from 'components/atoms/launch/cube/AllocationTypeValdiateCTA';
import { SIMPLE_ALLOCATION_FORMS } from 'constants/formDefinitions/formDeclarations';
import { CUBE_SECTIONS, QUANTITY } from 'constants/wall/launch';
import { useSimpleAllocation } from 'hooks/launch/cube/allocation/useSimpleAllocation';
import { getSimpleAllocationFieldAvailability } from 'services/CubeServices';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';
import generalStyle from 'assets/style/components/wall/GeneralWallStructure.module.scss';

/**
 * Organism component used to render simple allocation component
 *
 * @param index
 * @param activeTypeForm
 * @constructor
 */
const SimpleAllocation = ({ index, activeTypeForm }) => {
  const {
    type,
    measurementTypeKey,
    allocationType,
    handleSimplifiedAllocation,
    allocationValue,
    error
  } = useSimpleAllocation(index);

  return (
    <div className={style.simpleAllocation}>
      <GenericFormBuilder
        formAction={values => handleSimplifiedAllocation(index, values)}
        formDeclaration={SIMPLE_ALLOCATION_FORMS(allocationValue)[measurementTypeKey || QUANTITY][type]}
        formSlot={form => {
          const simpleAllocationValidationAvailable = getSimpleAllocationFieldAvailability(form);
          const validationAvailable = simpleAllocationValidationAvailable && activeTypeForm !== null && !allocationType;
          if (validationAvailable) {
            return (
              <>
                {error && (
                  <DynamicFormattedMessage id={error} tag={HTML_TAGS.P} className={generalStyle.mandatoryText} />
                )}
                <AllocationTypeValidateCTA
                  {...{
                    targetName: CUBE_SECTIONS.ALLOCATION_TYPE,
                    targetValue: allocationType
                  }}
                />
              </>
            );
          }
        }}
      />
    </div>
  );
};

export default SimpleAllocation;
