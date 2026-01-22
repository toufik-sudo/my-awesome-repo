import React, { useMemo } from 'react';
import Select from 'react-select';
import { useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFilter } from '@fortawesome/free-solid-svg-icons';

import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { IPlatform, IProgram } from 'interfaces/components/wall/IWallPrograms';
import { TYPE_FILTER_OPTIONS } from 'constants/programs';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

interface ProgramsFiltersProps {
  superPlatforms: IPlatform[];
  platforms: IPlatform[];
  programs: IProgram[];
  selectedSuperPlatform: IPlatform | null;
  selectedPlatform: IPlatform | null;
  selectedProgram: IProgram | null;
  selectedProgramType: { value: number | undefined; label: string } | null;
  onSuperPlatformChange: (superPlatform: IPlatform | null) => void;
  onPlatformChange: (platform: IPlatform | null) => void;
  onProgramChange: (program: IProgram | null) => void;
  onProgramTypeChange: (type: { value: number | undefined; label: string } | null) => void;
  showSuperPlatformFilter: boolean;
}

const ProgramsFilters: React.FC<ProgramsFiltersProps> = ({
  superPlatforms,
  platforms,
  programs,
  selectedSuperPlatform,
  selectedPlatform,
  selectedProgram,
  selectedProgramType,
  onSuperPlatformChange,
  onPlatformChange,
  onProgramChange,
  onProgramTypeChange,
  showSuperPlatformFilter
}) => {
  const intl = useIntl();
  const { colorMainButtons, colorSidebar } = useSelectedProgramDesign();

  const superPlatformOptions = useMemo(
    () => superPlatforms.map(sp => ({ value: sp.id, label: sp.name, data: sp })),
    [superPlatforms]
  );

  const platformOptions = useMemo(
    () => platforms.map(p => ({ value: p.id, label: p.name, data: p })),
    [platforms]
  );

  const programOptions = useMemo(
    () => programs.map(prog => ({ value: prog.id, label: prog.name, data: prog })),
    [programs]
  );

  const programTypeOptions = useMemo(
    () => TYPE_FILTER_OPTIONS.map(opt => ({ 
      value: opt.value, 
      label: intl.formatMessage({ id: opt.label, defaultMessage: opt.label }),
      data: opt 
    })),
    [intl]
  );

  const selectedSuperPlatformOption = useMemo(
    () => superPlatformOptions.find(opt => opt.value === selectedSuperPlatform?.id) || null,
    [superPlatformOptions, selectedSuperPlatform]
  );

  const selectedPlatformOption = useMemo(
    () => platformOptions.find(opt => opt.value === selectedPlatform?.id) || null,
    [platformOptions, selectedPlatform]
  );

  const selectedProgramOption = useMemo(
    () => programOptions.find(opt => opt.value === selectedProgram?.id) || null,
    [programOptions, selectedProgram]
  );

  const selectedProgramTypeOption = useMemo(
    () => programTypeOptions.find(opt => opt.value === selectedProgramType?.value) || null,
    [programTypeOptions, selectedProgramType]
  );

  const hasActiveFilters = selectedSuperPlatform || selectedPlatform || selectedProgram || (selectedProgramType && selectedProgramType.value !== undefined);

  const clearAllFilters = () => {
    onSuperPlatformChange(null);
    onPlatformChange(null);
    onProgramChange(null);
    onProgramTypeChange(null);
  };

  const primaryColor = colorMainButtons || '#3e216b';
  const accentColor = colorSidebar || '#3e216b';

  const createCustomStyles = (accentOverride?: string) => {
    const accent = accentOverride || primaryColor;
    
    return {
      control: (provided: any, state: any) => ({
        ...provided,
        minWidth: '160px',
        maxWidth: '260px',
        borderRadius: '10px',
        border: `1.5px solid ${state.isFocused ? accent : '#e2e8f0'}`,
        backgroundColor: '#ffffff',
        boxShadow: state.isFocused ? `0 0 0 2px ${accent}15` : '0 1px 4px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        padding: '1px 4px',
        transition: 'all 0.2s ease',
        fontSize: '13px',
        '&:hover': {
          borderColor: accent,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: '#1e293b',
        fontSize: '13px',
        fontWeight: 500
      }),
      placeholder: (provided: any) => ({
        ...provided,
        color: '#94a3b8',
        fontSize: '13px',
        fontWeight: 400
      }),
      input: (provided: any) => ({
        ...provided,
        color: '#1e293b',
        fontSize: '13px'
      }),
      menu: (provided: any) => ({
        ...provided,
        borderRadius: '10px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        zIndex: 9999,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        marginTop: '4px'
      }),
      menuList: (provided: any) => ({
        ...provided,
        padding: '4px',
        maxHeight: '220px'
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected 
          ? accentColor 
          : state.isFocused 
            ? `${accentColor}12` 
            : 'transparent',
        color: state.isSelected ? '#ffffff' : '#334155',
        cursor: 'pointer',
        padding: '8px 10px',
        fontSize: '13px',
        fontWeight: state.isSelected ? 500 : 400,
        borderRadius: '6px',
        marginBottom: '2px',
        transition: 'all 0.15s ease',
        '&:hover': {
          backgroundColor: state.isSelected 
            ? accentColor 
            : `${accentColor}12`
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
        color: '#94a3b8',
        padding: '4px',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
        '&:hover': {
          color: accent
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
        fontSize: '13px',
        padding: '10px'
      })
    };
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: '12px',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9'
  };

  const filterItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '160px',
    flex: '1 1 180px',
    maxWidth: '260px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  };

  const filterHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  };

  const filterIconStyle: React.CSSProperties = {
    color: primaryColor,
    fontSize: '14px'
  };

  const clearButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: hasActiveFilters ? '#fef2f2' : '#f8fafc',
    border: hasActiveFilters ? '1px solid #fecaca' : '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 500,
    color: hasActiveFilters ? '#dc2626' : '#94a3b8',
    cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
    transition: 'all 0.2s ease',
    marginLeft: 'auto',
    alignSelf: 'flex-end'
  };

  return (
    <div style={filterContainerStyle}>
      <div style={filterHeaderStyle}>
        <FontAwesomeIcon icon={faFilter} style={filterIconStyle} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
          {intl.formatMessage({ id: 'label.filter', defaultMessage: 'Filters' })}
        </span>
      </div>

      {showSuperPlatformFilter && (
        <div style={filterItemStyle}>
          <label style={labelStyle}>
            {intl.formatMessage({ id: 'filter.superPlatform', defaultMessage: 'Super Platform' })}
          </label>
          <Select
            value={selectedSuperPlatformOption}
            onChange={(option) => onSuperPlatformChange(option?.data || null)}
            options={superPlatformOptions}
            styles={createCustomStyles('#6366f1')}
            isSearchable={true}
            isClearable={true}
            placeholder={intl.formatMessage({ id: 'filter.selectSuperPlatform', defaultMessage: 'All' })}
            classNamePrefix="filter-select"
            noOptionsMessage={() => intl.formatMessage({ id: 'filter.noOptions', defaultMessage: 'No options' })}
          />
        </div>
      )}

      <div style={filterItemStyle}>
        <label style={labelStyle}>
          {intl.formatMessage({ id: 'filter.platform', defaultMessage: 'Platform' })}
        </label>
        <Select
          value={selectedPlatformOption}
          onChange={(option) => onPlatformChange(option?.data || null)}
          options={platformOptions}
          styles={createCustomStyles('#8b5cf6')}
          isSearchable={true}
          isClearable={true}
          placeholder={intl.formatMessage({ id: 'filter.selectPlatform', defaultMessage: 'All' })}
          classNamePrefix="filter-select"
          noOptionsMessage={() => intl.formatMessage({ id: 'filter.noOptions', defaultMessage: 'No options' })}
        />
      </div>

      <div style={filterItemStyle}>
        <label style={labelStyle}>
          {intl.formatMessage({ id: 'filter.program', defaultMessage: 'Program' })}
        </label>
        <Select
          value={selectedProgramOption}
          onChange={(option) => onProgramChange(option?.data || null)}
          options={programOptions}
          styles={createCustomStyles(primaryColor)}
          isSearchable={true}
          isClearable={true}
          placeholder={intl.formatMessage({ id: 'filter.selectProgram', defaultMessage: 'All' })}
          classNamePrefix="filter-select"
          noOptionsMessage={() => intl.formatMessage({ id: 'filter.noOptions', defaultMessage: 'No options' })}
        />
      </div>

      <div style={filterItemStyle}>
        <label style={labelStyle}>
          {intl.formatMessage({ id: 'filter.programType', defaultMessage: 'Type' })}
        </label>
        <Select
          value={selectedProgramTypeOption}
          onChange={(option) => onProgramTypeChange(option?.data || null)}
          options={programTypeOptions}
          styles={createCustomStyles('#10b981')}
          isSearchable={false}
          isClearable={true}
          placeholder={intl.formatMessage({ id: 'filter.selectProgramType', defaultMessage: 'All' })}
          classNamePrefix="filter-select"
        />
      </div>

      <button 
        style={clearButtonStyle}
        onClick={clearAllFilters}
        disabled={!hasActiveFilters}
        title={intl.formatMessage({ id: 'filter.clearAll', defaultMessage: 'Clear all' })}
      >
        <FontAwesomeIcon icon={faTimes} style={{ fontSize: '10px' }} />
        {intl.formatMessage({ id: 'filter.clearAll', defaultMessage: 'Clear' })}
      </button>
    </div>
  );
};

export default ProgramsFilters;
