// import sideBg1 from "../../../assets/images/tab-1-bg.png";
// import sideBg2 from "../../../assets/images/tab-2-bg.png";
// import sideBg3 from "../../../assets/images/tab-3-bg.png";
export default (theme) => ({
  root: { paddingTop: 20, paddingBottom: 20 },
  formLabel: {
    paddingBottom: 8,
    color: "#1044AB",
    display: "block",
  },
  gridBg1: {
    [theme.breakpoints.up("md")]: {
      // backgroundImage: "url(" + sideBg1 + ")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top right",
      backgroundSize: "25%",
    },
  },
  gridBg2: {
    [theme.breakpoints.up("md")]: {
      // backgroundImage: "url(" + sideBg2 + ")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top 30px right",
      backgroundSize: "17%",
    },
  },
  gridBg3: {
    [theme.breakpoints.up("md")]: {
      // backgroundImage: "url(" + sideBg3 + ")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top 8px right",
      backgroundSize: "15%",
    },
  },
  inputLabel: {
    color: "#1044AB",
  },
  group: {
    float: "left",
    flexDirection: "row",
  },
  formContainer: {
    marginTop: 5,
  },
  formControl: {
    display: "flex",
    justifyContent: "space-between",
  },
  label: {
    width: "100%",
    justifyContent: "space-between",
    border: "1px solid #ccc",
    paddingLeft: 10,
    borderRadius: 5,
    marginLeft: 0,
  },
  labelSelected: {
    border: "2px solid " + theme.palette.primary.main,
  },
  inlineBtn: {
    background: "linear-gradient(90deg, #60CE8C 17.24%, #48BDAF 100%), #2196F3",
    borderRadius: 4,
    "&:hover": {
      background: "#60CE8C",
    },
  },
  subItem: {
    alignItems: "flex-end",
    display: "grid",
    paddingTop: "0px!important",
  },
  addRemove: {
    borderRight: "1px solid transparent!important;",
    width: 30,
    textAlign: "center",
  },
  grpButton: {
    borderRadius: "5px 5px 5px 5px!important",
    width: 30,
    padding: "9px 0",
  },
  dividerVer: {
    position: "absolute",
    width: 1,
    height: "80%",
    right: 0,
    top: 15,
  },

  button: {
    marginRight: 10,
    "&:last-child": {
      marginRight: 0,
    },
  },
  reviewPaperRoot: {
    // padding: "2px 4px",
    alignItems: "center",
    padding: 20,
    marginBottom: 10,
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  paperTwoCol: {
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  reviewIcon: {
    width: 40,
    height: 40,
    margin: 10,
  },
  reviewTitle: {
    fontWeight: 300,
    marginBottom: 0,
    color: "#505050",
    fontSize: 18,
  },
  reviewItemWrap: {
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: 5,
    margin: "10px 10px 20px 10px",
  },
  gridCol: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "20%",
      flexBasis: "20%",
    },

    position: "relative",
  },
  titleIcon: {
    marginBottom: -2,
  },
  tagsWrap: {
    padding: "5px 10px",
    border: "1px solid rgba(0, 0, 0, .23)",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    // "& div": {
    //   width: "100%",
    // },
  },
  tagsWrapErr: {
    padding: "5px 10px",
    border: "1px solid red",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
  },
  tagsInput: {
    paddingLeft: 5,
    fontSize: 14,
    borderColor: "transparent",
    "&::placeholder": {
      color: "blue",
      fontSize: 10,
    },
    "& input": {
      backgroundColor: "white",
      border: "none",
      outline: "none",
      padding: "9px 5px 9px 0",
      minWidth: 245,
      width: 220,
      fontSize: 16,
      color: "rgb(102, 120, 138);",
    },
    "& input::placeholder": {
      fontSize: 16,
      color: "#ccc",
    },
  },
  selectedTag: {
    marginRight: 5,
    margin: 2,
    color: "black",
    "& svg": {
      color: theme.palette.text.secondary,
    },
  },
  selectedTagWrap: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
  },
  dropDown: {
    border: "1px solid #ccc",
    position: "absolute",
    backgroundColor: "white",
    zIndex: 10000,
    display: "block!important",
    minWidth: 150,
    "& li": {
      listStyle: "none",
      padding: "5px 10px",
    },
  },
  activeSugg: {
    backgroundColor: "#f1f1f1",
  },
  suggestion: {
    backgroundColor: "red",
  },
  searchInput: {
    borderColor: "transparent",
  },
  tableReview: {
    width: "100%",
    "& th:first-child": {
      paddingLeft: 25,
    },
    "& td:first-child": {
      paddingLeft: 25,
    },
    "& th": {
      backgroundColor: "white",
      color: theme.palette.secondary.main,
    },
  },
  tableHead: {
    fontSize: 12,
    borderBottomWidth: 2,
  },
  formHeader: {
    color: "#1044AB",
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
    display: "inline-block",
  },
  leftCol: {
    paddingRight: 8,
    marginTop: 10,
    [theme.breakpoints.down("xs")]: {
      paddingRight: 0,
    },
  },
  rightCol: {
    paddingLeft: 8,
    marginTop: 10,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
  },
  fiveCol: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "15%",
      alignItems: "flex-end",
      display: "grid",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "20%",
      flexBasis: "20%",
      alignItems: "flex-end",
      display: "grid",
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "50%",
      flexBasis: "50%",
      alignItems: "flex-end",
      display: "grid",
    },
  },
  threeCol: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "60%",
      flexBasis: "60%",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "45%",
      flexBasis: "45%",
    },
  },
  threeColEqual: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "22.22%",
      flexBasis: "22.22%",
    },
  },
  radioItem: {
    marginRight: 50,
  },
  dropdownStyle: {
    backgroundColor: "red",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  subHead: {
    fontWeight: 600,
    color: "#1044AB",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
    margin: "50px 0 20px 0",
    width: "100%",
  },
  eduTitle: {
    borderLeft: "1px solid" + theme.palette.secondary.main,
    borderBottom: "1px solid" + theme.palette.secondary.main,
    marginLeft: 35,
    padding: "5px 10px",
    width: "75%",
    fontSize: 14,
    fontWeight: 400,
  },
  eduTitleR: {
    textAlign: "right",
    width: "50%",
  },
  eduTitleL: {
    width: "50%",
  },
  eduDesc: {
    borderRight: "1px solid" + theme.palette.secondary.main,
    marginLeft: 35,
    textAlign: "right",
    padding: "5px 10px",
    width: "75%",
    fontSize: 12,
    fontWeight: 300,
  },
  radioButtonIconErr: {
    color: "red",
  },
  buttonBar: {
    padding: "24px!important",
  },
  pageTitle: {
    fontWeight: 300,
    fontSize: 26,
    color: theme.palette.secondary.main,
  },
  reviewCol: { position: "relative" },

  RecreviewLabel: {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: "16px",
    whiteSpace: "nowrap",
  },
  RecreviewTitle: {
    fontWeight: 300,
    marginBottom: 0,
    color: "#505050",
    fontSize: 16,
    lineHeight: "22px",
  },
  snackRoot: {
    fontSize: 14,
    lineHeight: "25px",
  },
  snackRootError: {
    backgroundColor: "#d32f2f",
  },
  snackRootWarning: {
    backgroundColor: "#ff530d",
  },
  snackRootSuccess: {
    backgroundColor: "#43a047",
  },
  snackRootInfo: {
    backgroundColor: theme.palette.primary.main,
  },
  snackAction: {
    backgroundColor: "transparent",
  },
  snackMsg: {
    backgroundColor: "transparent",
    width: "calc(100% - 100px)",
    "& span": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        marginRight: 25,
        marginLeft: 20,
        transform: "scale(1.5)",
      },
    },
  },
  avatarBig: {
    height: 60,
    width: 60,
    border: "1px solid #757575",
    marginTop: 10,
  },
  avatarIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    // background: "#fff",
    borderRadius: "50%",
    border: "1px solid #fff",
    padding: 3,
    color: "#fff",
    background: theme.palette.primary.main,
    transform: "scale(1.1)",
    cursor: "pointer",
  },
  uploadBtn: {
    marginTop: 15,
    backgroundColor: "#ccc",
    padding: "4px 15px 2px 15px",
  },
  viewUpload: {
    display: "flex",
    alignItems: "center",
    lineHeight: "32px",
    fontSize: 12,
    "& svg": {
      height: 20,
      width: 20,
      color: "#888",
    },
  },
  fieldError: {
    color: theme.palette.danger.main,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
    fontFamily: "Montserrat",
  },
  avatarHelp: {
    lineHeight: "14px",
    marginTop: 5,
    fontSize: 11,
  },
  scoreBox: { textAlign: "center" },
  circleProgWrapLg: {
    height: 100,
    width: 100,
    position: "relative",
    left: "50%",
    transform: "translate(-50%)",
  },
  circleProgValLg: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    width: 100,
    height: 100,
    borderRadius: "50%",
    border: "12px solid #e8e8e8",
    lineHeight: "80px",
    fontSize: "15px",
    textAlign: "center",
  },
  circleProgWrapXlg: {
    height: 60,
    width: 60,
    position: "relative",
    left: "50%",
    transform: "translate(-50%)",
  },
  circleProgValXlg: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "7px solid #e8e8e8",
    lineHeight: "50px",
    fontSize: "15px",
    textAlign: "center",
  },
  cirProgGreenLg: {
    color: "#69D193",
    width: "60px!important",
    height: "60px!important",
  },  
  gridButton: {
    cursor:"pointer",
    padding: 4,
    '& svg': {
      height: 20,
      width: 20
    }
  }
});
