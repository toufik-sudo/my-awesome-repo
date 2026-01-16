import React from 'react';
import { shallow } from 'enzyme';

import SortSwitch from 'components/atoms/ui/SortSwitch';
import { SORT_DIRECTION } from 'constants/api/sorting';

describe('SortSwitch', () => {
  test('renders correctly, without crashing', () => {
    const props = {
      sortBy: 'test',
      onSort: jest.fn(),
      currentSorting: { sortBy: 'test', sortDirection: SORT_DIRECTION.ASC },
      activeClass: 'active'
    };

    const wrapper = shallow(<SortSwitch {...props} />);

    const sortComponent = wrapper.find('div');
    expect(sortComponent).toHaveLength(2);
    const sortIcons = sortComponent.at(1);
    expect(sortIcons.children()).toHaveLength(2);
    expect(sortIcons.childAt(0).hasClass(props.activeClass)).toBeTruthy();
    expect(sortIcons.childAt(1).hasClass(props.activeClass)).toBeFalsy();

    expect(wrapper).toMatchSnapshot();
  });

  test('renders without crashing and triggers ascending sorting on click', () => {
    const props = {
      sortBy: 'test',
      onSort: jest.fn(),
      currentSorting: { sortBy: 'another', sortDirection: SORT_DIRECTION.ASC },
      activeClass: 'active'
    };

    const wrapper = shallow(<SortSwitch {...props} />);

    const sortComponent = wrapper.find('div');
    sortComponent.at(0).simulate('click');

    expect(props.onSort).toHaveBeenCalledWith({ sortBy: props.sortBy, sortDirection: SORT_DIRECTION.ASC });
  });

  test('renders without crashing and triggers descending sorting on click', () => {
    const props = {
      sortBy: 'test',
      onSort: jest.fn(),
      currentSorting: { sortBy: 'test', sortDirection: SORT_DIRECTION.ASC },
      activeClass: 'active'
    };

    const wrapper = shallow(<SortSwitch {...props} />);

    wrapper
      .find('div')
      .at(0)
      .simulate('click');
    expect(props.onSort).toHaveBeenCalledWith({ sortBy: props.sortBy, sortDirection: SORT_DIRECTION.DESC });
  });
});
