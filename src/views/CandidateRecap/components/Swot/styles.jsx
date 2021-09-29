import palette from 'theme/palette';

export default theme => ({
  swotWrap: {
    border: '1px solid #e4e4e4',
    borderTop: 'none',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    paddingTop: 40,
    borderRadius: '0 0 5px 5px'
  },
  swotCol1: {
    display: 'flex'
  },
  swotCol: {
    display: 'flex',
    padding: 10,
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%'
    }
  },
  swotItemWrap: {
    background: '#FFFFFF',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    marginTop: 20
  },
  swotItemColLeft: {
    flexBasis: '25%',
    backgroundColor: palette.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    borderRadius: '5px 0 0 5px',
    minHeight: 120,
    flexDirection: 'column',
    '& img': {
      height: 40,
      width: 40
    },
    '& p': {
      color: '#fff'
    }
  },
  swotItemColRight: {
    flexBasis: '75%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20
  },
  swotList: {
    margin: '30px 15px 30px 20px',
    '& li': {
      fontSize: 12,
      color: '#505050',
      //fontSize: 12,
      fontFamily: 'roboto',
      paddingBottom: 5
    }
  }
});
