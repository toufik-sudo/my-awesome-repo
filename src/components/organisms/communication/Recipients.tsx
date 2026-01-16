import React from 'react';

import RecipientsListHeaderElement from 'components/molecules/communication/RecipientsListHeaderElement';
import RecipientsList from './RecipientsList';
import { useUserLists } from 'hooks/communication/useUserLists';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Organism component used to render recipients list
 *
 * @constructor
 */
const Recipients = ({ setEmailUserListId, emailUserListId, isProcessing }) => {
  const { hasNoUserLists, isLoading, setSortingFilter, sortingFilter, userLists } = useUserLists();
  const { tableSm, table, tableScrollable } = tableStyle;

  return (
    <div className={`${table} ${tableScrollable}`}>
      <div className={`${coreStyle.pl4} ${tableSm}`}>
        <RecipientsListHeaderElement {...{ setSortingFilter, sortingFilter, isLoading, isProcessing }} />
        <RecipientsList {...{ userLists, isLoading, hasNoUserLists, setEmailUserListId, emailUserListId }} />
      </div>
    </div>
  );
};

export default Recipients;
