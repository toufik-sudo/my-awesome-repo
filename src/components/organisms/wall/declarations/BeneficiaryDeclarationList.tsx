import React from 'react';

import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
import BeneficiaryUserDeclarationRow from 'components/organisms/wall/declarations/BeneficiaryUserDeclarationRow';
import UserDeclarationHeader from 'components/molecules/wall/declarations/UserDeclarationHeader';
import { BENEFICIARY_DECLARATION_HEADERS, BENEFICIARY_DECLARATION_HEADERS_SPONSORSHIP } from 'constants/wall/users';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import useProgramDetails from 'hooks/programs/useProgramDetails';
import { PROGRAM_TYPES, SPONSORSHIP } from 'constants/wall/launch';

/**
 * Renders the list of beneficiary's declarations
 *
 * @param hasMore
 * @param loadMore
 * @param scrollRef
 * @param isLoading
 * @param declarations
 * @param listCriteria
 * @param onSort
 * @constructor
 */
export const BeneficiaryDeclarationList = ({
  hasMore,
  loadMore,
  scrollRef,
  isLoading,
  declarations,
  listCriteria,
  onSort,
  selectedProgramId
}) => {
  const { textCenter, withDangerColor, mt2 } = coreStyle;
  const { tableXl, tableScrollable } = tableStyle;


  const programDetail = useProgramDetails(selectedProgramId);

  // Determine the correct headers based on program details
  const headers = programDetail?.programDetails.type === PROGRAM_TYPES[SPONSORSHIP]
    ? BENEFICIARY_DECLARATION_HEADERS_SPONSORSHIP
    : BENEFICIARY_DECLARATION_HEADERS;

  

  return (
    <GenericInfiniteScroll
      {...{
        hasMore,
        loadMore,
        scrollRef,
        isLoading,
        height: coreStyle.h90vh
      }}
    >
      <div className={`${tableScrollable}`}>
        <div className={tableXl}>
          <UserDeclarationHeader
            {...{ isLoading, sortState: listCriteria, onSort, headers }}
          />
          <div>
            {declarations.map((declaration, index) => {
              return <BeneficiaryUserDeclarationRow key={index} index={index} {...declaration} selectedProgramType={programDetail?.programDetails.type} />;
            })}
            {!isLoading && !declarations.length && (
              <DynamicFormattedMessage
                className={`${textCenter} ${withDangerColor} ${mt2}`}
                tag={HTML_TAGS.P}
                id="declarations.list.none"
              />
            )}
          </div>
        </div>
      </div>
    </GenericInfiniteScroll>
  );
};
