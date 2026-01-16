/**
 * Atom component used to render Footer group depending on condition
 *
 * @param condition
 * @param wrapper
 * @param children
 * @constructor
 *
 */
const FooterGroupConditionalWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);
export default FooterGroupConditionalWrapper;
