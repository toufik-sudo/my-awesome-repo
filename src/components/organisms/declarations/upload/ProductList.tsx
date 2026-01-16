import React from 'react';

import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Renders the list of beneficiary's declarations
 *
 * @param hasMore
 * @param loadMore
 * @param scrollRef
 * @param isLoading
 * @param declarations
 * @constructor
 */
export const ProductList = ({ hasMore, loadMore, scrollRef, isLoading, products }) => {
  const { textCenter, mt2, withBoldFont, mt3, textMl, withDefaultColor } = coreStyle;
  const { tableSimpleHeader, tableSimpleRow, tableSimpleCell, tableSimpleSmallCell } = tableStyle;

  return (
    <div className={mt3}>
      <div className={`${tableSimpleHeader} ${withDefaultColor}`}>
        <div className={tableSimpleRow}>
          <DynamicFormattedMessage
            tag={HTML_TAGS.P}
            className={`${withBoldFont} ${textMl} ${tableSimpleSmallCell}`}
            id="wall.userDeclarations.products.header.id"
          />
          <DynamicFormattedMessage
            className={`${withBoldFont} ${textMl} ${tableSimpleCell}`}
            tag={HTML_TAGS.P}
            id="wall.userDeclarations.products.header.product"
          />
        </div>
      </div>
      <GenericInfiniteScroll
        {...{
          hasMore,
          loadMore,
          scrollRef,
          isLoading
        }}
      >
        <div>
          {products.map(({ id, name }) => {
            return (
              <div className={tableSimpleRow} key={id}>
                <span className={tableSimpleSmallCell}> {id} </span>
                <span className={tableSimpleCell}>{name}</span>
              </div>
            );
          })}
          {!isLoading && !products.length && (
            <DynamicFormattedMessage
              className={`${textCenter} ${mt2}`}
              tag={HTML_TAGS.P}
              id="wall.userDeclarations.products.list.none"
            />
          )}
        </div>
      </GenericInfiniteScroll>
    </div>
  );
};
