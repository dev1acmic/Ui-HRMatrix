export default theme => ({
  root: {
    padding: 0
  },
  MainWrapper: { padding: "20px" },
  SubWrapper: {
    borderRadius: "5px",
    backgroundColor: "#fff",
    webkitBoxShadow: "0px 0px 5px #9E9E9E",
    mozBoxShadow: "0px 0px 5px #9E9E9E",
    boxShadow: "0px 0px 5px #9E9E9E",
    flex: 1,
    display: "flex"
  },
  SubWrapperOutline: {
    borderRadius: "5px",
    backgroundColor: "#fff",
    webkitBoxShadow: "0px 0px 5px #9E9E9E",
    mozBoxShadow: "0px 0px 5px #9E9E9E",
    boxShadow: "0px 0px 5px #9E9E9E",
    padding: "20px"
  },
  proWrap: {
    background:
      "linear-gradient(90.01deg, #60CE8C 1.57%, #48BDAF 96.56%), #48BDAF",
    padding: "20px",
    justifyContent: "center",
    alignItems: "center",
    flex: "inherit",
    borderRadius: "5px 0 0 5px",
    maxWidth: "200px"
  },
  avatarImg: {
    width: "100px",
    height: "100px",
    border: "3px solid #fff",
    margin: "0 auto"
  },
  summaryBoxCol: {
    display: "flex",
    flexBasis: "auto",
    padding: "20px",
    flexDirection: "row",
    alignItems: "center",
    borderRight: "1px solid #DCE6F2"
  },
  proDetails: { padding: "20px 40px" },
  proName: { fontWeight: "100", fontSize: "36px" },
  cntryName: { position: "relative", paddingLeft: "24px", top: "5px" },
  flag: { position: "absolute", left: 0, width: "20px", top: "-2px" },
  mTitle: { fontSize: "14px", fontWeight: 100, lineHeight: 1 },
  sTitle: {
    fontSize: "19px",
    fontWeight: 100,
    lineHeight: 1,
    marginBottom: "35px",
    marginTop: "3px"
  },
  noBmargin: { marginBottom: "0!important" },
  titleWrap: {
    display: "flex",
    padding: "0 0 15px 0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  tIcon: {
    color: "#44BAA0",
    border: "2px solid #44BAA0 ",
    borderRadius: "50px",
    width: "30px",
    height: "30px",
    padding: "3px"
  },
  tTitle: {
    color: "#505050",
    fontSize: "18px",
    marginLeft: "8px",
    textTransform: "uppercase",
    fontWeight: "bold"
  },
  borderBox: { border: "1px solid #BEBEBE", borderRadius: "5px" },
  columnBox: {
    padding: "20px !important",
    display: "flex",
    alignItems: "center"
  },
  circleProgWrap: {
    height: 80,
    width: 80,
    position: "relative",
    left: "50%",
    transform: "translate(-50%)"
  },
  circleProgVal: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    width: 80,
    height: 80,
    borderRadius: "50%",
    border: "10px solid #e8e8e8",
    lineHeight: "60px",
    fontSize: "18px",
    textAlign: "center",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
  },
  cirProgRed: {
    color: "#ff725f",
    width: "80px!important",
    height: "80px!important"
  },
  cirProgBlue: {
    color: "#38B5ED",
    width: "80px!important",
    height: "80px!important"
  },
  cirProgYellow: {
    color: "#FFA723",
    width: "80px!important",
    height: "80px!important"
  },
  cirProgPurple: {
    color: "#894CBD",
    width: "80px!important",
    height: "80px!important"
  },
  weightWrap: {
    padding: "10px",
    border: "1px solid #d2d2d2",
    borderRadius: "5px",
    textAlign: "center"
  },
  weightTxt: { color: "#3f3c3c" },
  iconTextGradient: {
    background: "linear-gradient(90deg, #30ec7b 17.24%, #4abead 100%)",
    WebkitBackgroundClip: "text!important",
    textFillColor: "transparent",
    fontSize: "36px",
    lineHeight: "40px"
  },
  weightTxt: { fontSize: "14px", fontWeight: "100" },
  behButton: {
    margin: "5px",
    fontSize: "10px",
    backgroundColor: "#C4C4C4",
    color: "#000"
  },
  activButton: { backgroundColor: "#894CBD", color: "#fff" },
  scoreBox: {
    display: "inline-block",
    width: "20%",
    padding: "20px",
    textAlign: "center"
  },
  circleProgWrapLg: {
    height: 100,
    width: 100,
    position: "relative",
    left: "50%",
    transform: "translate(-50%)"
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
    fontSize: "20px",
    textAlign: "center",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
  },
  cirProgRedLg: {
    color: "#ff725f",
    width: "100px!important",
    height: "100px!important"
  },
  cirProgBlueLg: {
    color: "#38B5ED",
    width: "100px!important",
    height: "100px!important"
  },
  cirProgYellowLg: {
    color: "#FFA723",
    width: "100px!important",
    height: "100px!important"
  },
  cirProgPurpleLg: {
    color: "#894CBD",
    width: "100px!important",
    height: "100px!important"
  },
  circleProgWrapXlg: {
    height: 140,
    width: 140,
    position: "relative",
    left: "50%",
    transform: "translate(-50%)"
  },
  circleProgValXlg: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    width: 140,
    height: 140,
    borderRadius: "50%",
    border: "16px solid #e8e8e8",
    lineHeight: "120px",
    fontSize: "20px",
    textAlign: "center",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
  },
  cirProgGreenLg: {
    color: "#69D193",
    width: "140px!important",
    height: "140px!important",
    position: "relative",
    zIndex: 2
  },
  cover: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: "rgba(229, 229, 229, 0.6)",
    zIndex: 22
  }
});
