import React from 'react';

import style from 'assets/style/components/Sections/VideoSection.module.scss';
import { VIDEO_SECTION } from 'constants/routes';
import videoSource from 'assets/video/video.mp4';
import { useVideoSectionPlayback } from 'hooks/landing/useVideoSectionPlayback';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render video section
 *
 * @param currentActiveSection
 * @constructor
 */
const VideoSection = ({ currentActiveSection }) => {
  const { section, contentCentered, mLargeMinHauto } = coreStyle;
  const { videoElement } = useVideoSectionPlayback(currentActiveSection);

  return (
    <section className={`${section} ${contentCentered} ${mLargeMinHauto}`} id={VIDEO_SECTION}>
      <video controls={false} playsInline muted loop autoPlay={false} ref={videoElement} className={style.video}>
        <source src={videoSource} />
      </video>
    </section>
  );
};

export default VideoSection;
