export const customStyles = {
  option: () => ({
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    padding: '8px 12px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  }),
  control: () => ({
    minWidth: 90,
    maxWidth: 110,
    display: 'flex',
    flexDirection: 'column' as const,
    alignContent: 'space-around',
    alignItems: 'flex-start',
    padding: '2px 4px',
    fontSize: '0.85rem'
  }),
  menu: (provided: any) => ({
    ...provided,
    minWidth: 100,
    zIndex: 100,
    background: 'linear-gradient(135deg, rgba(30, 30, 45, 0.98), rgba(20, 20, 35, 0.99))',
    backdropFilter: 'blur(12px)',
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    overflow: 'hidden'
  }),
  menuList: () => ({
    color: '#ffffff',
    padding: '4px 0'
  }),
  singleValue: () => ({ 
    transition: 'opacity 300ms', 
    width: '100%',
    fontSize: '0.85rem'
  }),
  valueContainer: () => ({
    display: 'flex',
    alignItems: 'flex-start',
    padding: '0 4px'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    padding: '2px',
    '& svg': {
      width: 14,
      height: 14
    }
  })
};

export const onboardingCustomStyles = {
  ...customStyles,
  dropdownIndicator: (provided: any) => ({ 
    ...provided, 
    color: '#fff !important', 
    padding: '2px',
    '& svg': { 
      fill: '#fff',
      width: 14,
      height: 14
    } 
  })
};
