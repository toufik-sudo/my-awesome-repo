import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
// import { scroller } from 'react-scroll/modules';
// import Cookies from 'js-cookie';

// import FooterSection from 'components/organisms/landing/FooterSection';
// import ContactSection from 'components/organisms/landing/ContactSection';
// import FeatureSection from 'components/organisms/landing/FeaturesSection';
// import LandingSection from 'components/organisms/landing/LandingSection';
// import ServicesSection from 'components/organisms/landing/ServicesSection';
// import WhyChooseUsSection from 'components/organisms/landing/WhyChooseUsSection';
// import LandingNavContainer from 'containers/LandingNavContainer';
// import HowItWorksSection from 'components/organisms/landing/HowItWorksSection';
// import VideoSection from 'components/organisms/landing/VideoSection';
// import PricingSection from 'components/organisms/landing/PricingSection';
// import ChangeZoneModal from 'components/organisms/modals/ChangeZoneModal';
// import { ZONE_SELECTION } from 'constants/general';
// import { CHANGE_ZONE_MODAL } from 'constants/modal';
// import { setModalState } from 'store/actions/modalActions';

/**
 * Home page template component used to render single page for (Landing, Services...)
 *
 * @constructor
 * NOTE: tested
 */
const HomePage = () => {
  // const dispatch = useDispatch();
  // const { state } = useLocation<any>();
  // const [currentActiveSection, setActive] = useState('');
  const history = useHistory();

  // useEffect(() => {
  //   // setTimeout(() => {
  //   //   const zoneCookie = Cookies.get(ZONE_SELECTION);

  //   //   if (!zoneCookie) {
  //   //     dispatch(setModalState(true, CHANGE_ZONE_MODAL));
  //   //     return;
  //   //   }
  //   // }, 100);

  //   // if (state && state.forcedActiveSection) {
  //   //   setTimeout(() => {
  //   //     scroller.scrollTo(state.forcedActiveSection, {
  //   //       smooth: true,
  //   //       offset: -50
  //   //     });
  //   //     setActive(state.forcedActiveSection);
  //   //     state.forcedActiveSection = null;
  //   //   }, 500);
  //   // }
  //   history.push("/login");
  //   // return;
  // }, [state]);

  history.push("/login");
  window.location.reload();
  

  // return (
  //   <>
  //     <LandingNavContainer {...{ setActive }} />
  //     <LandingSection />
  //     <ServicesSection />
  //     <WhyChooseUsSection />
  //     <FeatureSection />
  //     <HowItWorksSection />
  //     <VideoSection {...{ currentActiveSection }} />
  //     <PricingSection />
  //     <ContactSection />
  //     <FooterSection />
  //     <ChangeZoneModal />
  //   </>
  // );
};

export default HomePage;
