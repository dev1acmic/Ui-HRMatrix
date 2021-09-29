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
    padding: "2px 4px",
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
      minWidth: 170,
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
  buttonBar: {
    padding: "24px!important",
  },
  pageTitle: {
    fontWeight: 300,
    fontSize: 26,
    color: theme.palette.secondary.main,
  },
  checkBoxIconErr: {
    color: "red!importsnt",
  },
});
