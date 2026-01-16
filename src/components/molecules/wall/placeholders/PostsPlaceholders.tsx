import React from 'react';
import ContentLoader from 'react-content-loader';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Molecule component used to render a 10 content placeholder
 *
 * @constructor
 */
const PostsPlaceholders = () => {
  const result = [];
  for (let i = 0; i < 10; i++) {
    result.push(
      <ContentLoader
        className={componentStyle.postPlaceholder}
        speed={3}
        key={i}
        viewBox="0 0 850 300"
        backgroundColor="#f3f3f3"
        foregroundColor="#78bb7bcf"
      >
        <rect x="15" y="58" rx="3" ry="3" width="328" height="7" />
        <rect x="862" y="8" rx="0" ry="0" width="24" height="22" />
        <rect x="12" y="93" rx="0" ry="0" width="261" height="158" />
        <rect x="21" y="152" rx="0" ry="0" width="13" height="7" />
        <rect x="13" y="276" rx="0" ry="0" width="68" height="8" />
        <rect x="100" y="276" rx="0" ry="0" width="68" height="8" />
        <rect x="185" y="276" rx="0" ry="0" width="68" height="8" />
        <rect x="350" y="95" rx="3" ry="3" width="479" height="7" />
        <rect x="350" y="114" rx="3" ry="3" width="479" height="7" />
        <rect x="351" y="130" rx="3" ry="3" width="479" height="7" />
        <rect x="351" y="149" rx="3" ry="3" width="479" height="7" />
        <rect x="353" y="166" rx="3" ry="3" width="479" height="7" />
        <rect x="353" y="185" rx="3" ry="3" width="479" height="7" />
        <rect x="354" y="201" rx="3" ry="3" width="479" height="7" />
        <rect x="354" y="220" rx="3" ry="3" width="479" height="7" />
      </ContentLoader>
    );
  }

  return <div>{result}</div>;
};

export default PostsPlaceholders;
