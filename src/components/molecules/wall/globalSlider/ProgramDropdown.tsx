import React, { useMemo } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import { setSelectedProgram, setIsProgramSelectionLocked } from 'store/actions/wallActions';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { DEFAULT_ALL_PROGRAMS } from 'constants/wall/programButtons';
import { PLATFORM_SELECTION_DELAY } from 'constants/general';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { IProgram } from 'interfaces/components/wall/IWallPrograms';

import style from 'sass-boilerplate/stylesheets/components/wall/ProgramsSlider.module.scss';

interface ProgramDropdownProps {
  globalClass?: string;
  programs: IProgram[];
}

/**
 * Dropdown component for selecting programs
 */
const ProgramDropdown: React.FC<ProgramDropdownProps> = ({ globalClass = '', programs }) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { selectedProgramIndex, isProgramSelectionLocked } = useWallSelection();
  const { colorMainButtonsBackground, colorMainButtonText, colorSidebar } = useSelectedProgramDesign();

  const options = useMemo(
    () =>
      programs.map((program, index) => ({
        value: index,
        label:
          program.name === DEFAULT_ALL_PROGRAMS
            ? formatMessage({ id: `wall.${DEFAULT_ALL_PROGRAMS}` })
            : program.name,
        id: program.id
      })),
    [programs, formatMessage]
  );

  const selectedOption = useMemo(
    () => options.find(opt => opt.value === selectedProgramIndex) || null,
    [options, selectedProgramIndex]
  );

  const handleChange = (option: { value: number; label: string } | null) => {
    if (!option || isProgramSelectionLocked) return;

    setSelectedProgram(option.value, programs, dispatch);
    setTimeout(() => dispatch(setIsProgramSelectionLocked(false)), PLATFORM_SELECTION_DELAY);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minWidth: '200px',
      maxWidth: '280px',
      borderRadius: '12px',
      border: `2px solid ${state.isFocused ? colorSidebar || '#3e216b' : '#e2e8f0'}`,
      backgroundColor: colorMainButtonsBackground || '#ffffff',
      boxShadow: state.isFocused ? `0 0 0 3px ${colorSidebar || '#3e216b'}20` : '0 2px 4px rgba(0, 0, 0, 0.06)',
      cursor: 'pointer',
      padding: '4px 8px',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: colorSidebar || '#3e216b',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: colorMainButtonText || '#3e216b',
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
      color: colorMainButtonText || '#3e216b',
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
      color: colorMainButtonText || '#3e216b',
      padding: '4px',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      '&:hover': {
        color: colorMainButtonText || '#3e216b'
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
        placeholder="Select Program"
        classNamePrefix="program-select"
      />
    </div>
  );
};

export default ProgramDropdown;
