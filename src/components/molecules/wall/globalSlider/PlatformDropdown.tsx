import React, { useMemo } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import { setActivePlatform, setIsProgramSelectionLocked } from 'store/actions/wallActions';
import { PLATFORM_SELECTION_DELAY } from 'constants/general';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { IPlatform } from 'interfaces/components/wall/IWallPrograms';

import style from 'sass-boilerplate/stylesheets/components/wall/ProgramsSlider.module.scss';

interface PlatformDropdownProps {
  globalClass?: string;
  platforms: IPlatform[];
  isProgramSelectionLocked?: boolean;
  selectedPlatform: { index: number; name: string; id: number };
  onChange?: (index: number) => void;
}

/**
 * Dropdown component for selecting platforms
 */
const PlatformDropdown: React.FC<PlatformDropdownProps> = ({
  globalClass = '',
  platforms,
  isProgramSelectionLocked = false,
  selectedPlatform,
  onChange
}) => {
  const dispatch = useDispatch();
  const { colorMainButtons, colorSidebar } = useSelectedProgramDesign();

  const options = useMemo(
    () =>
      platforms.map((platform, index) => ({
        value: index,
        label: platform.name,
        id: platform.id
      })),
    [platforms]
  );

  const selectedOption = useMemo(
    () => options.find(opt => opt.value === selectedPlatform.index) || null,
    [options, selectedPlatform.index]
  );

  const handleChange = (option: { value: number; label: string } | null) => {
    if (!option || isProgramSelectionLocked) return;

    if (onChange) {
      onChange(option.value);
      return;
    }

    dispatch(setActivePlatform(option.value));
    setTimeout(() => dispatch(setIsProgramSelectionLocked(false)), PLATFORM_SELECTION_DELAY);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minWidth: '200px',
      maxWidth: '280px',
      borderRadius: '12px',
      border: `2px solid ${state.isFocused ? colorMainButtons || '#3e216b' : '#e2e8f0'}`,
      backgroundColor: '#ffffff',
      boxShadow: state.isFocused ? `0 0 0 3px ${colorMainButtons || '#3e216b'}20` : '0 2px 4px rgba(0, 0, 0, 0.06)',
      cursor: 'pointer',
      padding: '4px 8px',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: colorMainButtons || '#3e216b',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: colorMainButtons || '#3e216b',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '0.01em'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#94a3b8',
      fontSize: '14px',
      fontWeight: 500
    }),
    input: (provided: any) => ({
      ...provided,
      color: colorMainButtons || '#3e216b',
      fontSize: '14px'
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      marginTop: '8px'
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: '8px',
      maxHeight: '280px'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? colorSidebar || '#3e216b' 
        : state.isFocused 
          ? `${colorSidebar || '#3e216b'}15` 
          : 'transparent',
      color: state.isSelected ? '#ffffff' : '#334155',
      cursor: 'pointer',
      padding: '10px 14px',
      fontSize: '14px',
      fontWeight: state.isSelected ? 600 : 500,
      borderRadius: '8px',
      marginBottom: '4px',
      transition: 'all 0.15s ease',
      '&:hover': {
        backgroundColor: state.isSelected 
          ? colorSidebar || '#3e216b' 
          : `${colorSidebar || '#3e216b'}15`
      },
      '&:last-child': {
        marginBottom: 0
      }
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: colorMainButtons || '#3e216b',
      padding: '4px',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      '&:hover': {
        color: colorMainButtons || '#3e216b'
      }
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: '#94a3b8',
      padding: '4px',
      '&:hover': {
        color: '#ef4444'
      }
    }),
    noOptionsMessage: (provided: any) => ({
      ...provided,
      color: '#94a3b8',
      fontSize: '14px',
      padding: '16px'
    })
  };

  return (
    <div className={`${style.programSliderContainer} ${globalClass}`}>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        styles={customStyles}
        isSearchable={true}
        isDisabled={isProgramSelectionLocked}
        placeholder="Select Platform"
        classNamePrefix="platform-select"
      />
    </div>
  );
};

export default PlatformDropdown;
