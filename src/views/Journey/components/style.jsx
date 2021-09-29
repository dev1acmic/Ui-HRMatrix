export default theme => ({
  root: {
    paddingBottom: 20
  },
  tableHead: {},
  tableHeadBorder: {
    backgroundColor: '#FBFBFB',
    borderRight: '1px solid #DCE6F2',
    borderTop: '1px solid #DCE6F2'
  },
  tableHeadBorderL: {
    backgroundColor: '#FBFBFB',
    borderRight: '1px solid #DCE6F2',
    borderTop: '1px solid #DCE6F2',
    borderLeft: '1px solid #DCE6F2'
  },
  tableHeadSkills: {
    backgroundColor: '#E6F6FC',
    borderLeft: '1px solid #DCE6F2',
    borderRight: '1px solid #DCE6F2'
  },
  tableHeadScreen: {
    backgroundColor: '#DEF8E8',
    borderRight: '1px solid #DCE6F2'
  },
  tableHeadTL1: {
    borderRadius: '4px 0 0 0'
  },
  tableHeadTR1: {
    borderRadius: '0 4px 0  0'
  },
  tableHeadTL2: {
    borderRadius: '0 0 0 4px'
  },
  tableHeadTR2: {
    borderRadius: '0 0 4px 0'
  },
  tableHeadTL12: {
    borderRadius: '4px 0 0 4px'
  },
  tableHeadTR12: {
    borderRadius: '0 4px 4px 0'
  },
  tableBody: {
    color: '#7A767B',
    fontSize: 12,
    fontWeight: 600,
    position: 'relative',
    height: 135
  },
  tableBodyBorder: {
    backgroundColor: '#FBFBFB',
    borderRight: '1px solid #DCE6F2',
    color: '#7A767B',
    fontSize: 12,
    fontWeight: 600
  },
  tableBodyBorderL: {
    backgroundColor: '#FBFBFB',
    borderRight: '1px solid #DCE6F2',
    borderLeft: '1px solid #DCE6F2',
    color: '#7A767B',
    fontSize: 12,
    fontWeight: 600
  },
  tableBodyScore: {
    backgroundColor: '#FBFBFB',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 600,
    position: 'relative'
  },
  tableBodyScoreMiddle: {
    borderLeft: '0.5px solid rgba(0, 0, 0, 0.1)',
    borderRight: '0.5px solid rgba(0, 0, 0, 0.1)'
  },
  boxNmbr: {
    background:
      'linear-gradient(90.01deg, #2F80ED 1.57%, #56CCF2 96.56%), #338ECB',
    borderRadius: 2,
    height: 24,
    width: 24,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 600
  },
  tableRow: {
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)'
  },
  borderRow: {
    backgroundColor: 'transparent',
    height: 10,
    padding: '0!important'
  },
  barRoot: {
    height: 6,
    borderRadius: 5
  },
  barColorRed: {
    backgroundColor: '#ff725f'
  },
  barColorYellow: {
    backgroundColor: '#ffd037'
  },
  barColorGreen: {
    backgroundColor: '#75d49b'
  },
  trackColorPrimary: {
    backgroundColor: '#e8e8e8'
  },
  gridButton: {
    padding: 4,
    '& svg': {
      height: 20,
      width: 20
    }
  },
  arrowWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    '& svg': {
      height: 20,
      width: 20,
      marginLeft: 3
    }
  },
  varianceVal: {
    position: 'absolute',
    left: '2px',
    bottom: -12,
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '.9em'
  },
  arrowGreen: {
    color: '#75d49b',
    transform: ' rotate(-180deg)'
  },
  arrowRed: {
    color: '#ff725f'
  },
  textRotate: {
    transform: 'rotate(-165deg)',
    writingMode: 'vertical-lr',
    maxHeight: 80,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  circleProgWrap: {
    height: 56,
    width: 56,
    padding: 3,
    position: 'relative',
    left: '50%',
    transform: 'translate(-50%)',
    boxShadow: '0 0 5px 2px #e6e6e6',
    borderRadius: '50%',
    background: '#fff'
  },
  circleProgVal: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    width: 50,
    height: 50,
    borderRadius: '50%',
    border: '5px solid #e8e8e8',
    lineHeight: '40px',
    fontSize: '11px',
    textAlign: 'center',
    fontWeight: 600
  },
  cirProgRed: {
    color: '#ff725f'
  },
  cirProgYellow: {
    color: '#ffd037'
  },
  cirProgGreen: {
    color: '#75d49b'
  },
  circleProgWrapBig: {
    width: 60,
    height: 60
  },
  circleProgValBig: {
    width: 55,
    height: 55,
    lineHeight: '55px',
    padding: '2.7'
  },
  connectingLine: {
    height: 3,
    background: '#ccc',
    position: 'absolute',
    width: '100%',
    top: '48%',
    zIndex: 0,
    marginLeft: -6
  },
  connectingLineStart: {
    width: '50%',
    right: 0
  },
  connectingLineEnd: {
    borderRadius: '0 5px 5px 0'
  },
  connectingLineEndDot: {
    height: 10,
    width: 10,
    position: 'absolute',
    borderRadius: '50%',
    right: 0,
    marginTop: -3
  },
  ageName: {
    position: 'absolute',
    fontSize: 12,
    textAlign: 'center',
    zIndex: 1,
    bottom: 5,
    '& h5': {
      fontSize: 11,
      fontWeight: 400,
      color: 'rgba(91, 91, 91, 0.87)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: '0 10px'
    },
    '& h6': {
      fontSize: 10,
      fontWeight: 'normal',
      color: 'rgba(179, 179, 179, 0.87)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: '0 10px'
    }
  },
  ageNameFullwidth: {
    width: '200%',
    left: 0,
    marginLeft: 0
  },
  ageNameSmall: {
    width: '100%',
    marginLeft: -6
  },
  dateLabel: {
    position: 'absolute',
    width: '100%',
    top: 15,
    fontSize: 11,
    textAlign: 'center',
    marginLeft: -6,
    color: 'rgba(91, 91, 91, 0.87)'
  },
  skillMoreBtn: {
    background: '#42A5EF',
    borderRadius: '50%',
    padding: 2,
    color: '#fff',
    transform: 'scale(.9)'
  },
  screenMoreBtn: {
    background: '#75D49B',
    borderRadius: '50%',
    padding: 2,
    color: '#fff',
    transform: 'scale(.9)'
  },
  selectBox: {
    height: 25,
    width: '100%',
    fontSize: 12,
    fontWeight: 400,
    '&:focus $notchedOutline': {
      borderColor: 'green'
    },
    '&:hover $notchedOutline': {
      borderColor: theme.palette.primary.main
    },
    '& $notchedOutline': {
      borderColor: 'red'
    }
  },
  reviewItemWrap: {
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
    borderRadius: 5,
    margin: '30px 0px 10px 0px',
    backgroundColor: '#fff',
    borderBottom: '5px solid' + theme.palette.secondary.main,
    borderCollapse: 'initial',
    display: 'inline-table'
  },
  reviewIcon: {
    width: 25,
    height: 25,
    margin: 10
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '16px',
    whiteSpace: 'nowrap'
  },
  reviewTitle: {
    fontWeight: 300,
    marginBottom: 0,
    color: '#505050',
    fontSize: 16,
    lineHeight: '22px'
  },
  reviewCol: {
    position: 'relative',
    textAlign: 'center',
    verticalAlign: 'top'
  },
  dividerVer: {
    position: 'absolute',
    width: 1,
    height: '70%',
    right: 0,
    top: 20
  },
  formHeader: {
    color: '#1044AB',
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
    display: 'inline-block'
  },
  scroller: {
    width: '100%',
    height: 'auto',
    padding: '5px',
    margin: '-5px',
    width: 'calc(100% + 10px)'
  },
  highlighted: {
    '& td': {
      backgroundColor: '#fffea9',
      borderWidth: '1px 0 1px 0',
      borderTop: '1px solid #d4d384',
      borderBottom: '1px solid #d4d384',
      color: '#353535'
    }
  },
  avatarImg: {
    margin: 12,
    width: 65,
    height: 65,
    border: '3px solid #dadada',
    borderRadius: '50%',
    background: '#fff',
    '& img': {
      border: '1px solid #fff',
      borderRadius: '50%'
    }
  },
  avatarName: {
    textAlign: 'center',
    marginTop: -13,
    fontSize: 11,
    whiteSpace: 'nowrap',
    maxWidth: 85,
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  titleWrap: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  inlineSelect: {
    backgroundColor: '#fff',
    marginTop: -12,
    marginBottom: 7,
    borderRadius: 4,
    border: '1px solid #e6e6e6',
    '& div': {
      paddingLeft: 10,
      fontSize: 14,
      '&:focus': {
        backgroundColor: '#fff',
        borderRadius: 4
      }
    }
  },
  hireStatus: {
    display: 'flex',
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 500,
    '& svg': {
      height: 20,
      width: 20
    }
  }
});
