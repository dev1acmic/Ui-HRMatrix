export default theme => ({
  root: {
    paddingTop: 20,
    [theme.breakpoints.down('sm')]: {
      padding: 20
    }
  },
  contentWrap: {
    backgroundColor: '#fff',
    paddingBottom: 20
  },
  stepperRoot: {
    borderRadius: 32,
    height: 62,
    position: 'relative',
    margin: '20px 0 40px 0',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden'
  },
  tabBg: {
    backgroundColor: '#DEEFF8',
    boxShadow: 'none',
    borderRadius: '5px 5px 0 0'
  },
  tabItem: {
    color: '#4A4A4A',
    padding: '10px 30px'
  },
  indicator: {
    backgroundColor: theme.palette.primary.main
  },
  tabContainer: {
    backgroundColor: 'white'
  },

  button: {
    marginRight: theme.spacing(1)
  },
  completed: {
    display: 'inline-block'
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  buttonBar: {
    borderTop: '1px solid #DFE3E8',
    padding: '25px 0 !important',
    marginTop: 30,
    margin: '20px 0px -20px 0px'
  }
});
