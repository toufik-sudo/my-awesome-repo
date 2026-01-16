import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import LinkGroupColumn from 'components/molecules/footer/LinkGroupColumn';
import LinksGroup from 'components/molecules/footer/LinksGroup';
import LinksSectionList from 'components/molecules/footer/LinksSectionList';
import LogoGroup from 'components/molecules/footer/LogoGroup';
import SocialLinkList from 'components/molecules/footer/SocialLinkList';
import { FOOTER_TYPES } from 'constants/stories';
import { FOOTER_URL_LINKS } from 'constants/footer';

const FooterStory = storiesOf('Molecules/Footer', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(FOOTER_TYPES.LINK_GROUP_COLUMN, () => (
    <ProvidersWrapper>
      <LinkGroupColumn list={FOOTER_URL_LINKS[0]} />
    </ProvidersWrapper>
  ))
  .add(FOOTER_TYPES.LINKS_GROUP, () => (
    <ProvidersWrapper>
      <LinksGroup />
    </ProvidersWrapper>
  ))
  .add(FOOTER_TYPES.LINKS_SECTION_PAGE, () => (
    <ProvidersWrapper>
      <LinksSectionList />
    </ProvidersWrapper>
  ))
  .add(FOOTER_TYPES.LOGO_GROUP, () => (
    <ProvidersWrapper>
      <LogoGroup />
    </ProvidersWrapper>
  ))
  .add(FOOTER_TYPES.SOCIAL_LINK_LIST, () => (
    <ProvidersWrapper>
      <SocialLinkList />
    </ProvidersWrapper>
  ));

export default FooterStory;
