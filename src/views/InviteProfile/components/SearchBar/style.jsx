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
      color: "#000",
      '& svg': {
        width: 22,
        height: 22
      }
    },
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: '8px 40px 8px 15px',
      transition: theme.transitions.create('width'),
      width: '100%',
      border: '1px solid transparent',
      fontSize: 12,
      color: 'black',
      [theme.breakpoints.up('sm')]: {
        width: 0,
        '&:focus': {
          width: 100,
          borderRadius: 22,
          backgroundColor: '#efefef',
          border: '1px solid #efefef'
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
  