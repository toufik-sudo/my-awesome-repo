import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Atom component used to render navigation top element
 *
 * @param url
 * @param icon
 * @constructor
 *
 * @see TopNavigationElementStory
 */
const TopNavigationElement = ({ url, icon }) => <Link to={url}>{icon}</Link>;

export default TopNavigationElement;
