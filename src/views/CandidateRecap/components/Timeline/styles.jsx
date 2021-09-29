import palette from 'theme/palette';

export default theme => ({
  root: {},
  tableRow: {
    height: '64px'
  },
  treeWrap: {
    borderLeft: '2px solid #6B7073',
    flexWrap: 'nowrap',
    paddingBottom: 15,
    marginLeft: 65,
    padding: '50px 0',
    marginTop: 20,
    position: 'relative',
    '&::before': {
      content: '"⦿"',
      position: 'absolute',
      marginLeft: -13,
      top: 0,
      marginTop: -22,
      fontSize: 24,
      lineHeight: '24px',
      color: palette.secondary.main
    },
    '&::after': {
      content: '"⦿"',
      marginLeft: -13,
      position: 'absolute',
      fontSize: 24,
      lineHeight: '24px',
      color: palette.secondary.main,
      bottom: 0,
      marginBottom: -20
    }
  },
  treeL: {
    paddingLeft: 10,
    flex: 1,
    position: 'relative',
    minHeight: 50,
    paddingBottom: 50,
    '&::before': {
      content: '"•"',
      position: 'absolute',
      left: 0,
      marginLeft: -9,
      top: 8,
      fontSize: 44,
      lineHeight: '20px',
      WebkitTextStroke: '1px #fff',
      textStroke: '1px #fff'
    }
  },
  treeLyear: {
    position: 'absolute',
    marginLeft: -75,
    background: '#FFFFFF',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: '3px',
    padding: '3px 5px',
    marginTop: 5,
    borderLeft: '4px solid #894CBD',
    width: 50,
    fontSize: 12,
    fontWeight: 600,
    textAlign: 'center'
  },
  treeItemWrap: {
    borderLeft: '2px solid #ccc',
    padding: '0px 8px',
    marginLeft: 35,
    paddingTop: 4
  },
  treeItemHead: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#506883',
    fontWeight: 600,
    lineHeight: '16px'
  },
  treeItemDesc: {
    fontSize: 11,
    color: '#506883',
    fontWeight: 400,
    lineHeight: '12px'
  },
  treeItemSub: {
    marginBottom: 10
  },
  treeIcon: {
    position: 'absolute',
    marginLeft: -40,
    transform: 'scale(1.1)',
    color: 'red'
  }
});
