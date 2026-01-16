export const customStyles = {
  control: provided => ({
    ...provided,
    borderRadius: 0,
    backgroundColor: '#fff',
    boxShadow: 'none',
    border: 'none',
    marginBottom: '15px',
    cursor: 'pointer'
  }),
  indicatorsContainer: () => ({
    display: 'none'
  }),
  menu: provided => ({
    ...provided,
    margin: 0,
    backgroundColor: '#fff',
    borderRadius: 0,
    boxShadow: '0.1rem 0.6rem 0.8rem 0.1rem rgba(0, 0, 0, 0.12)'
  }),
  menuList: provided => ({
    ...provided,
    padding: 0
  }),
  option: (provided, state) => ({
    ...provided,
    color: '#999',
    padding: '5px',
    backgroundColor: state.isSelected ? '#ddd' : '#fff',
    '&:hover': {
      backgroundColor: '#ddd',
      color: '#3e216b',
      cursor: 'pointer'
    }
  })
};
