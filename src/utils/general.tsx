import React from 'react';
import Cookies from 'js-cookie';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Programs.module.scss';
import {
  BASE_64_DECODER,
  FREE_PLAN_LABEL,
  KEY_NAMES,
  USER_COOKIE_FIELDS,
  USER_DETAILS_COOKIE,
  USER_STEP_COOKIE
} from 'constants/general';
import { ID, NAME } from 'constants/landing';
import { EMAIL_REGEXP } from 'constants/validation';
import { REDIRECT_MAPPING } from 'constants/routes';
import { ACCEPTED_USERS_LIST_TYPE, CHALLENGE, LOYALTY, SPONSORSHIP } from 'constants/wall/launch';
import { FR_VALUE } from 'constants/i18n';

export const emptyFn = () => null;
export const getObjectValue = (v: any) => v[Object.keys(v)[0]];
export const getObjectKey = (v: any) => Object.keys(v)[0];
export const getSeconds = () => new Date().getSeconds();
export const objectToArrayKey = (object, secondKey) => Object.keys(object).map(key => object[key][secondKey]);
export const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
export const handleAvailableExtension = () => (isMobile() ? [] : ACCEPTED_USERS_LIST_TYPE);
export const convertAsciiToString = value => String.fromCharCode(value + 65);
export const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value);
export const convertToFloatNumber = string => {
  // console.log('Input to convertToFloatNumber:', string);
  return parseFloat(string.replace(',', '.'));
};
export const isObject = (value: any): boolean => {
  const type = typeof value;

  return value != null && (type === 'object' || type === 'function');
};

export const hasNonNullValue = value => value !== undefined && value !== null;

export const getUserCookie = name => {
  const userCookie = Cookies.get(USER_DETAILS_COOKIE);

  if (userCookie) return JSON.parse(userCookie)[name];
};

export const toCamelCase = str => {
  return str
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};

/**
 * Method convert File type image to a base64 format
 *
 * @param file
 * @param callback
 */
export const convertToBase64 = (file, callback) => {
  try {
    const reader = new FileReader();
    reader.onloadend = e => {
      callback(e.target.result, e.target.error);
    };
    reader.readAsDataURL(file);
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Method converts base64 to blob
 *
 * @param str
 */
export const base64ImageToBlob = str => {
  const pos = str.indexOf(BASE_64_DECODER.NAME);
  const type = str.substring(BASE_64_DECODER.START_POS, pos);
  const b64 = str.substr(pos + BASE_64_DECODER.END_POS);
  const imageContent = atob(b64);
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);

  for (let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  return new Blob([buffer], { type });
};

export const checkIsFreePlanCookie = () => getUserCookie(USER_COOKIE_FIELDS.PLATFORM_TYPE_LABEL) === FREE_PLAN_LABEL;

export const hasFreePlan = platform => platform.platformType && platform.platformType.name === FREE_PLAN_LABEL;

/**
 * Returns true if the onboarding is finished
 */
export const isOnboardingFinished = () => {
  const userStepCookie = Cookies.get(USER_STEP_COOKIE);
  if (userStepCookie) return JSON.parse(Cookies.get(USER_STEP_COOKIE)) === REDIRECT_MAPPING.WALL_ROUTE_STEP;

  return getUserCookie(USER_COOKIE_FIELDS.STEP) === REDIRECT_MAPPING.WALL_ROUTE_STEP;
};

/**
 * @param setActiveSlide
 * @param position
 * @param pricingData
 */
export const changeProgramType = (setActiveSlide, position, pricingData) => {
  const userCookie = Cookies.get(USER_DETAILS_COOKIE);

  if (userCookie) {
    let userData = JSON.parse(userCookie);
    let platformTypeId = getUserCookie(USER_COOKIE_FIELDS.PLATFORM_TYPE_ID);

    pricingData[position].forEach(element => {
      if (element.className === ID && element.content !== platformTypeId) {
        platformTypeId = element.content;
        userData = { ...userData, platformTypeId: element.content };
      }
      if (element.className === NAME) {
        userData = { ...userData, platformTypeLabel: element.content };
      }
    });
    Cookies.set(USER_COOKIE_FIELDS.PLATFORM_TYPE_ID, platformTypeId);
    Cookies.set(USER_DETAILS_COOKIE, userData);
  }

  return setActiveSlide ? setActiveSlide(position) : emptyFn();
};

/**
 * Method verifies the key pressed and adds preventDefault
 * @param e
 */
export const disableSubmitOnEnter = e => {
  if (e.key === KEY_NAMES.ENTER) e.preventDefault();
};

/**
 * Method tests if the value given is email type
 * @param value
 */
export const hasValidEmailFormat = value => {
  return EMAIL_REGEXP.test(value);
};

/**
 * Method returns the calculated per cent value from a given value
 * @param percentFor
 * @param percentOf
 */
export const getPercentNumber = (percentFor, percentOf) => {
  return Math.floor((percentFor * 100) / percentOf);
};

/**
 * Method returns a int formatted with space separator for thousands
 * @param value
 */
export const numberWithSpaces = value => value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/**
 * Method returns a int formatted with space separator for thousands
 * @param value
 */
export const numberWithDots = value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Method returns the thumb of the custom scrollbar
 * @param props
 * @param style
 */
export const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    backgroundColor: `#3e216b`,
    borderRadius: '1rem',
    cursor: 'pointer'
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

export const renderHorizontalTrack = ({ style, ...props }) => {
  return <div className={componentStyle.sectionProgramsHorizontalTrack} style={{ ...style }} {...props} />;
};

/**
 * Returns the number formatted for the browser's current language
 * @param number
 */
export const formatNumberLocale = number => {
  const locale = FR_VALUE;
  const castedValue = Number(number);

  return castedValue ? castedValue.toLocaleString(locale) : null;
};

/**
 * Open a new blank window with the legal document from AWS
 *
 * @param event
 * @param url
 */
export const openTab = (event, url) => {
  event.preventDefault();
  window.open(url, '_blank');
  window.focus();
  return;
};

/**
 * Get default values for simple allocation reward
 *
 */
export const getRewardsDefaultValue = (programType, allocationType) => {
  switch (programType) {
    case CHALLENGE:
      return allocationType === 2 ? '50' : '5';
    case SPONSORSHIP:
      return '20';
    case LOYALTY:
      return allocationType === 2 ? '10' : '5';
  }
};
