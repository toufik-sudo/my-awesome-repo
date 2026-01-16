import React from 'react';
import { useLocation } from 'react-router-dom';

import UserDeclarationHeader from 'components/molecules/wall/declarations/UserDeclarationHeader';
import UserDeclarationRow from 'components/molecules/wall/declarations/UserDeclarationRow';
import useUserDeclarationsData from 'hooks/declarations/useUserDeclarationsData';
import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render users list in a Infinite Scroll component.
 */
const UserDeclarationsList = () => {
  const { state } = useLocation();
  const {
    userDeclarations,
    hasMore,
    handleLoadMore,
    isLoading,
    sort: sortState,
    onSort,
    scrollRef,
    isAdmin
  } = useUserDeclarationsData(state);
  const { h70vh: height } = coreStyle;

  return (
    <GenericInfiniteScroll
      {...{
        hasMore: !isLoading && hasMore,
        loadMore: page => handleLoadMore(page, sortState),
        scrollRef,
        height,
        className: coreStyle.withBackgroundDefault
      }}
    >
      <UserDeclarationHeader {...{ sortState, onSort }} />
      {userDeclarations.map(declaration => (
        <UserDeclarationRow key={declaration.id} {...{ declaration, listState: sortState, isAdmin }} />
      ))}
    </GenericInfiniteScroll>
  );
};

export default UserDeclarationsList;
