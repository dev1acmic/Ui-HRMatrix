export default theme => ({
  searchBarWrapper: {
    marginLeft: 'auto',
    marginRight: 2,
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    right: 0,
    padding: 5,
    color: 'white',
    '& svg': {
      width: 28,
      height: 28
    }
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: '12px 40px 10px 15px',
    transition: theme.transitions.create('width'),
    width: '100%',
    border: '1px solid transparent',
    fontSize: 12,
    color: 'white',
    "&::-webkit-search-cancel-button": {
      transform: "scale(1.5)",
      position: "absolute",
      right: 35
    },
    [theme.breakpoints.up("sm")]: {
      width: 0,
      '&:focus': {
        width: 150,
        borderRadius: 22,
        backgroundColor: '#969696',
        border: '1px solid #969696'
      }
    },
    [theme.breakpoints.down('xs')]: {
      width: 0,
      '&:focus': {
        width: '100%',
        borderRadius: 22,
        backgroundColor: '#969696',
        border: '1px solid #969696'
      }
    }
  }
});
