export default (theme) => ({
  root: {
    padding: 32,
  },
  trackBoxWrap: {
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)",
    borderLeft: "20px solid #B5B2B2",
    borderRadius: 5,
    backgroundColor: "#fff",
    minHeight: 50,
    overflow: "hidden",
    margin: "20px 0",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  trackBoxOne: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    display: "flex",
    maxWidth: 180,
    flexShrink: 0,
    justifyContent: "center",
    flexDirection: "column",
  },
  companyName: {
    fontWeight: 300,
    color: "#828282",
    textAlign: "center",
    lineHeight: "18px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  trackBoxTwo: {
    backgroundColor: "#F6F8FA",
    padding: "40px 20px",
    flex: 1,
    maxWidth: "initial",
  },
  trackBoxThree: {
    backgroundColor: "#fff",
    maxWidth: 348,
    flexShrink: 0,
  },
  trackBoxId: {
    fontWeight: 300,
    fontSize: 30,
    lineHeight: "35px",
    color: "#3188C8",
  },
  trackBoxDetailsWrap: {},
  trackBoxDetailsLeft: {
    borderLeft: "6px solid #565555",
    borderRadius: 5,
    paddingLeft: 10,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "initial",
  },
  trackBoxDetailsRight: {
    display: "flex",
    alignItems: "center",
    maxWidth: 300,
  },
  trackBoxDetailsDesig: {
    fontWeight: 600,
    fontSize: 15,
    color: "#545454",
  },
  trackBoxDetailsData: {
    fontSize: 14,
    color: "#545454",
  },
  counterBoxWrap: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  counterBoxItem: {
    maxWidth: 65,
    alignItems: "center",
    width: "100%",
    border: "1px solid #bcbcbc",
    height: 65,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 5,
    color: "#787878",
    backgroundColor: "#fff",
  },
  counterBoxTitle: {
    fontSize: 11,
    color: "#787878",
  },
  counterBoxCounter: {
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "roboto",
    color: "#787878",
  },
  avatarBoxWrap: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  avatarBoxTop: {
    flexGrow: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: "20px 45px 5px 45px",
    position: "relative",
  },
  avatarBoxBottom: {
    flexGrow: 2,
    padding: "10px 30px",
    borderTop: "1px solid #E3E6EA",
    height: 50,
    justifyContent: "space-around",
    alignItems: "center",
    display: "flex",
  },
  avatarImg: {
    margin: 12,
    width: 65,
    height: 65,
    border: "3px solid #dadada",
    borderRadius: "50%",
    "& img": {
      border: "1px solid #fff",
      borderRadius: "50%",
    },
  },
  avatarScroll: {
    overflowY: "hidden",
    overflowX: "auto",
    display: "flex",
  },
  avatarArrowBtnLeft: {
    position: "absolute",
    left: 5,
    top: 45,
    padding: 0,
  },
  avatarArrowBtnRight: {
    position: "absolute",
    right: 5,
    top: 45,
    padding: 0,
  },
  avatarArrowBtnIcon: {
    height: 35,
    width: 35,
    color: "#ccc",
  },
  trackBarWrap: {
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)",
    borderRadius: 5,
    backgroundColor: "#fff",
    minHeight: 50,
    overflow: "hidden",
    margin: "20px 0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
  trackBarLeft: {
    display: "flex",
    //flexBasis: 'calc(100% - 345px)',
    alignItems: "center",
    display: "flex",
  },
  trackBarRight: {
    display: "flex",
    //maxWidth: 345,
    justifyContent: "flex-end",
    alignItems: "center",
    display: "flex",
    //width: '100%',
    paddingRight: 20,
  },
  trackBarIcon: {
    border: "1px solid " + theme.palette.primary.main,
    padding: 2,
    transform: "scale(1.5)",
    borderRadius: "50%",
    background: "transparent",
    alignSelf: "center",
    marginLeft: 20,
    color: theme.palette.primary.main,
  },
  trackBarTitle: {
    color: theme.palette.primary.main,
    textTransform: "uppercase",
    fontSize: 18,
    paddingLeft: 15,
    whiteSpace: "nowrap",
  },
  trackBarLegend: {
    height: 11,
    width: 30,
    borderRadius: 6,
    background: "#B5B2B2",
    display: "inline-block",
    marginRight: 2,
  },
  legendWrap: {
    display: "flex",
    flexWrap: "wrap",
    marginLeft: 40,
  },
  legendItem: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    padding: "2px 10px 2px 0",
  },
  legendText: {
    fontSize: 12,
    lineHeight: "15px",
    whiteSpace: "nowrap",
  },
  searchWrap: {
    border: "1px solid #ccc",
    height: 30,
    borderRadius: 3,
    background: "#fff",
    display: "flex",
    position: "relative",
  },
  inlineSelect: {
    fontSize: 12,
    paddingLeft: 10,
    "& div:focus": {
      backgroundColor: "transparent",
    },
  },
  inlineSelectDrpdwn: {
    "& li": {
      fontSize: 12,
      minHeight: 32,
    },
  },
  searchBtn: {
    background: theme.palette.primary.main,
    borderRadius: 0,
    padding: "0 5px",
    color: "#fff",
    position: "absolute",
    right: -1,
    top: -1,
    bottom: -1,
    borderRadius: "0 3px 3px 0",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  searchInput: {
    paddingRight: 35,
    padding: "5px 0",
    fontSize: 14,
  },
  avatarName: {
    textAlign: "center",
    marginTop: -13,
    fontSize: 11,
    whiteSpace: "nowrap",
    maxWidth: 85,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  summaryBoxWrap: {
    display: "flex",
    flexDirection: "row",
  },
  summaryBoxLeft: {
    display: "flex",
    flex: 1,
    maxWidth: "initial",
    flexWrap: "nowrap",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)",
    minHeight: "50px",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    background: "#fff",
    marginRight: 20,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  summaryBoxRight: {
    display: "flex",
    minWidth: 185,
    flexShrink: 0,
    background: "linear-gradient(180deg, #FF725F 0%, #B61600 100%)",
    borderRadius: 10,
    flexDirection: "column",
    padding: 20,
    width: "20%",
    maxWidth: 210,
    justifyContent: "center",
  },
  summaryBoxCol: {
    display: "flex",
    flexBasis: "25%",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  col1: {
    background: "linear-gradient(180deg, #75D49B 0%, #48BDAF 100%)",
    borderRadius: "10px 0 0 10px",
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: 235,
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
      borderRadius: "10px 10px 0 0",
    },
  },
  col2: {},
  col3: {},
  col4: {},
  iconHead: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
  },
  iconLeft: {
    transform: "scale(1.6)",
    marginRight: 20,
    marginLeft: 8,
  },
  iconText: {
    fontWeight: 300,
    lineHeight: "16px",
    color: "#fff",
  },
  iconNumber: {
    fontWeight: 300,
    fontSize: 72,
    lineHeight: "60px",
    marginTop: 22,
    color: "#fff",
  },
  roundIcon: {
    padding: 7,
    height: 50,
    width: 50,
    background: "#F8F9FA",
    borderRadius: "50%",
    marginRight: 10,
  },
  iconTextGradient: {
    background: "linear-gradient(90deg, #66ccf9 17.24%, #007db5 100%)",
    WebkitBackgroundClip: "text!important",
    textFillColor: "transparent",
    fontSize: 36,
    lineHeight: "40px",
  },
  iconTextNormal: {
    color: "#888",
    fontWeight: 400,
    fontSize: 18,
  },
  analyticsWrap: {
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)",
    borderRadius: 5,
    backgroundColor: "#fff",
    minHeight: 50,
    overflow: "hidden",
    margin: "20px 0",
    display: "flex",
    flexDirection: "column",
  },
  analyticsHeadWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "15px 0",
  },
  chartWrap: {
    borderTop: "1px solid #ccc",
    display: "flex",
  },
  chartLeft: {
    flexBasis: "50%",
    width: "50%",
    borderRight: "1px solid #ccc",
    padding: 20,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
  chartRight: {
    width: "50%",
    flexBasis: "50%",
    padding: 20,
    textAlign: "center",
  },
  titleWrap: {
    textAlign: "left",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: "18px",
    position: "relative",
    "& svg": {
      transform: "scale(.9)",
      alignSelf: "center",
      background: "transparent",
      marginRight: "5px",
      color: "#5a5a5a",
    },
    "& h2": {
      fontSize: 16,
      fontWeight: 600,
      color: "#5a5a5a",
    },
  },
  counter: {
    position: "absolute",
    right: -10,
    top: -11,
    border: "1px solid #C4C4C4",
    padding: "2px 8px",
    borderRadius: 5,
    color: theme.palette.secondary.main,
    fontSize: 20,
    fontFamily: "roboto",
    "& p": {
      color: "#8c8c8c",
      lineHeight: "12px",
      fontSize: "11px",
    },
  },

  dateInput: {
    "& input": {
      padding: "7px 2px 4px 8px",
      fontSize: 12,
      maxWidth: 60,
    },
    "& div:first-child": {
      paddingRight: 5,
    },
  },
  paginationWrap: {
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#fff",
    borderRadius: 10,
    color: "rgba(0, 0, 0, 0.54)",
    "& .MuiSelect-select": {
      fontSize: 12,
    },
    "& .MuiToolbar-root": {
      height: "45px!important",
      minHeight: "45px!important",
    },
  },
  selectWrap: {
    position: "absolute",
    right: 0,
    top: "-40px",
    background: "#fff",
    padding: "10px 13px",
    width: "270px",
    borderRadius: "10px 10px 0 0",
  },
});
