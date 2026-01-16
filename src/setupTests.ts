import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'raf/polyfill';

configure({ adapter: new Adapter() });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const matchMedia: any = () => {
  return {
    matches: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addListener() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    removeListener() {}
  };
};

window.matchMedia = window.matchMedia || matchMedia;
