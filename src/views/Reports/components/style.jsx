export default (theme) => ({
  root: {
    paddingBottom: 20,
  },
  tableHead: {},
  tableHeadBorder: {
    backgroundColor: "#FBFBFB",
    borderRight: "1px solid #DCE6F2",
    borderTop: "1px solid #DCE6F2",
  },
  tableHeadBorderL: {
    backgroundColor: "#FBFBFB",
    borderRight: "1px solid #DCE6F2",
    borderTop: "1px solid #DCE6F2",
    borderLeft: "1px solid #DCE6F2",
  },
  tableHeadSkills: {
    backgroundColor: "#E6F6FC",
    borderLeft: "1px solid #DCE6F2",
    borderRight: "1px solid #DCE6F2",
  },
  tableHeadScreen: {
    backgroundColor: "#DEF8E8",
    borderRight: "1px solid #DCE6F2",
  },
  tableHeadTL1: {
    borderRadius: "4px 0 0 0",
  },
  tableHeadTR1: {
    borderRadius: "0 4px 0  0",
  },
  tableHeadTL2: {
    borderRadius: "0 0 0 4px",
  },
  tableHeadTR2: {
    borderRadius: "0 0 4px 0",
  },
  tableHeadTL12: {
    borderRadius: "4px 0 0 4px",
  },
  tableHeadTR12: {
    borderRadius: "0 4px 4px 0",
  },
  tableBody: {
    color: "#7A767B",
    fontSize: 12,
    fontWeight: 600,
  },
  tableBodyBorder: {
    backgroundColor: "#FBFBFB",
    borderRight: "1px solid #DCE6F2",
    color: "#7A767B",
    fontSize: 12,
    fontWeight: 600,
  },
  tableBodyBorderL: {
    backgroundColor: "#FBFBFB",
    borderRight: "1px solid #DCE6F2",
    borderLeft: "1px solid #DCE6F2",
    color: "#7A767B",
    fontSize: 12,
    fontWeight: 600,
  },
  tableBodyScore: {
    backgroundColor: "#FBFBFB",
    textAlign: "center",
    fontSize: 12,
    fontWeight: 600,
  },
  tableBodyScoreMiddle: {
    borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)",
    borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
  },
  boxNmbr: {
    background:
      "linear-gradient(90.01deg, #2F80ED 1.57%, #56CCF2 96.56%), #338ECB",
    borderRadius: 2,
    height: 24,
    width: 24,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 600,
  },
  tableRow: {
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)",
  },
  borderRow: {
    backgroundColor: "transparent",
    height: 4,
    padding: "0!important",
  },
  barRoot: {
    height: 6,
    borderRadius: 5,
  },
  barColorRed: {
    backgroundColor: "#ff725f",
  },
  barColorYellow: {
    backgroundColor: "#ffd037",
  },
  barColorGreen: {
    backgroundColor: "#75d49b",
  },
  trackColorPrimary: {
    backgroundColor: "#e8e8e8",
  },
  gridButton: {
    padding: 4,
    "& svg": {
      height: 20,
      width: 20,
    },
  },
  arrowWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    "& svg": {
      height: 20,
      width: 20,
      marginLeft: 3,
    },
  },
  varianceVal: {
    position: "absolute",
    left: "2px",
    bottom: -12,
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: ".9em",
  },
  arrowGreen: {
    color: "#75d49b",
    transform: " rotate(-180deg)",
  },
  arrowRed: {
    color: "#ff725f",
  },
  textRotate: {
    transform: "rotate(-165deg)",
    writingMode: "vertical-lr",
    maxHeight: 80,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  circleProgWrap: {
    height: 40,
    width: 40,
    position: "relative",
    left: "50%",
    transform: "translate(-50%)",
  },
  circleProgVal: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "5px solid #e8e8e8",
    lineHeight: "34px",
    fontSize: "11px",
  },
  cirProgRed: {
    color: "#ff725f",
  },
  cirProgYellow: {
    color: "#ffd037",
  },
  cirProgGreen: {
    color: "#75d49b",
  },
  skillMoreBtn: {
    background: "#42A5EF",
    borderRadius: "50%",
    padding: 2,
    color: "#fff",
    transform: "scale(.9)",
  },
  screenMoreBtn: {
    background: "#75D49B",
    borderRadius: "50%",
    padding: 2,
    color: "#fff",
    transform: "scale(.9)",
  },
  selectBox: {
    height: 25,
    width: "100%",
    fontSize: 12,
    fontWeight: 400,
    "&:focus $notchedOutline": {
      borderColor: "green",
    },
    "&:hover $notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "& $notchedOutline": {
      borderColor: "red",
    },
  },
  reviewItemWrap: {
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)",
    borderRadius: 5,
    margin: "30px 0px 10px 0px",
    backgroundColor: "#fff",
    borderBottom: "5px solid" + theme.palette.secondary.main,
    borderCollapse: "initial",
    display: "inline-table",
  },
  reviewIcon: {
    width: 25,
    height: 25,
    margin: 10,
  },
  reviewItem: {
    display: "flex",
    flexDirection: "column",
    minHeight: 82,
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 5,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: "16px",
  },
  reviewTitle: {
    fontWeight: 500,
    marginBottom: 0,
    color: "#2F80ED",
    fontSize: 28,
    lineHeight: "22px",
    whiteSpace: "nowrap",
  },
  reviewCol: {
    position: "relative",
    textAlign: "center",
    verticalAlign: "top",
  },
  dividerVer: {
    position: "absolute",
    width: 1,
    height: "70%",
    right: 0,
    top: 20,
  },
  formHeader: {
    color: "#2f80ed",
    fontWeight: 500,
    fontSize: 18,
    marginBottom: 20,
    display: "inline-block",
    "& svg": {
      padding: 2,
      borderRadius: "50%",
      border: "2px solid #2f80ed",
      marginBottom: -9,
      height: 30,
      width: 30,
    },
  },
  toggleButtonInnerWrap: {
    margin: "25px auto 0 auto",
    width: 363,
    height: 48,
    left: 533,
    background: "linear-gradient(90deg, #60CE8C 17.24%, #48BDAF 100%), #42A5EF",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
    borderRadius: 33,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Roboto",
  },
  toggleButtonInner: {
    width: "49%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    fontWeight: 500,
    fontSize: 14,
    color: "#fff",
    cursor: "pointer",
  },
  toggleButtonInnerSel: {
    background: " #FFFFFF",
    boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.05)",
    color: "#000",
    borderRadius: 33,
  },
  scroller: {
    width: "100%",
    height: "auto",
    padding: "5px",
    margin: "-5px",
    width: "calc(100% + 10px)",
  },
  highlighted: {
    "& td": {
      backgroundColor: "#fffea9",
      borderWidth: "1px 0 1px 0",
      borderTop: "1px solid #d4d384",
      borderBottom: "1px solid #d4d384",
      color: "#353535",
    },
  },
  filterWrap: {
    width: "62rem",
    padding: 20,
    margin: 0,
    borderColor: "transparent",
    "& .MuiFormControl-root": {
      marginRight: 10,
    },
    "& .MuiButton-root": {
      padding: 0,
      height: 40,
      boxShadow: "none",
      marginTop: "5px",
      // minWidth: 44
    },
    "& .MuiSelect-root": {
      backgroundColor: "#E9E9E9",
    },
  },
  subHead: {
    fontSize: 18,
    color: "#6A6A6A",
    paddingBottom: 5,
  },
  totalRow: {
    "& td": {
      color: "#000",
      fontSize: 14,
      fontWeight: "bold",
    },
  },
  multiSelect: {
    minWidth: 125,
    fontFamily: "Roboto",
    fontSize: 12,
    display: "inline-block",
    "& .dropdown-container": {
      marginRight: 10,
      backgroundColor: "#E9E9E9",
      color: "#000",
    },
  },
  excelIcon: {
    height: 20,
    width: 20,
    float: "right",
    marginRight: 24,
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    right: 24,
    zIndex: 1000,
    boxShadow: "0 0 5px rgba(0,0,0,.1)",
  }, 
  calendarText: {
    '& input': {
      cursor: 'pointer'
    }
  }
});
