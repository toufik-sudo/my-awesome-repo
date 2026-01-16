import React from 'react';
import qs from 'qs';
import { useHistory } from 'react-router';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, IMAGES_ALT } from 'constants/general';
import { getClassTextPost } from 'services/WallServices';
import { isUserBeneficiary } from 'services/security/accessServices';
import { DASHBOARD_ROUTE, WALL_BENEFICIARY_POINTS_ROUTE } from 'constants/routes';
import { useWallSelection } from 'hooks/wall/useWallSelection';

import logoNoText from 'assets/images/logo/logo-no-text.png';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Atom component used to show posts's author details
 *
 * @param post
 * @param color
 * @constructor
 */
const PostAuthorDetails = ({ post, color }) => {
  const history = useHistory();
  const {
    withPrimaryColor,
    withSecondaryColor,
    withFontMedium,
    withGrayAccentColor,
    with15,
    height15,
    pointer
  } = coreStyle;
  const { createdBy, type, programs, title, isAutomatic } = post;
  const { postPublicText } = getClassTextPost(type, withSecondaryColor, withPrimaryColor);
  const programName = programs && programs[0] ? programs[0].name : null;
  const programId = programs && programs[0] ? programs[0].id : null;
  const {
    selectedPlatform: { role, id }
  } = useWallSelection();
  const redirectRoute = isUserBeneficiary(role) ? WALL_BENEFICIARY_POINTS_ROUTE : DASHBOARD_ROUTE;
  const redirectQuery = qs.stringify(
    {
      programId,
      programName: programName,
      platformId: id
    },
    { skipNulls: true }
  );

  if (isAutomatic) {
    return (
      <div className={`${componentStyle.postAuthorDetail} ${withFontMedium}`}>
        <img src={logoNoText} className={`${height15} ${with15}`} alt={IMAGES_ALT.LOGO} />
        <DynamicFormattedMessage className={withGrayAccentColor} tag={HTML_TAGS.SPAN} id="wall.posts.authorPublished" />
        <span style={{ color: color }}>{title}</span>
      </div>
    );
  }

  return (
    <div className={`${componentStyle.postAuthorDetail} ${withFontMedium}`}>
      <span style={{ color }}>{createdBy.firstName + ' ' + createdBy.lastName}</span>
      <DynamicFormattedMessage
        className={withGrayAccentColor}
        tag={HTML_TAGS.SPAN}
        id={`wall.posts.${postPublicText}`}
      />
      <span style={{ color }}>{title}</span>
      {programs && (
        <>
          <DynamicFormattedMessage className={withGrayAccentColor} tag={HTML_TAGS.SPAN} id="wall.posts.on" />
          <span style={{ color }} className={pointer} onClick={() => history.push(`${redirectRoute}?${redirectQuery}`)}>
            {programName}
          </span>
        </>
      )}
    </div>
  );
};

export default PostAuthorDetails;
