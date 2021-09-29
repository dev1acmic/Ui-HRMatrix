import palette from "theme/palette";

export default theme => ({
  root: {},
  tableRow: {
    height: "64px"
  },
  topBarWrap: {
    background: "#FFFFFF",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    borderRadius: 5
  },
  topBarCol1: {
    backgroundColor: palette.primary.main,
    padding: "0 30px",
    color: "#fff",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ccc"
  },
  headRight: {
    width: "100%",
    marginLeft: 10
  },
  candidateAvatar: {
    margin: "0 auto",
    height: 65,
    width: 65,
    border: "2px solid #fff"
  },
  flagAvatar: {
    height: 25,
    width: 25,
    border: "2px solid #fff"
  },
  candidateName: {
    fontWeight: 300,
    fontSize: 22,
    color: "#fff",
    width: "100%",
    lineHeight: "26px"
  },
  candidateLocation: {
    display: "flex",
    whiteSpace: "nowrap",
    width: "100%",
    fontSize: 12,
    color: "#fff",
    alignItems: "center"
  },
  candidateFlag: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    border: "1px solid #fff",
    marginRight: 5
  },
  topBarCol2: {
    backgroundColor: palette.primary.main,
    borderBottom: "1px solid #ccc"
  },
  topBarCol1Head: {
    fontSize: 10,
    fontWeight: 600,
    marginTop: 10,
    lineHeight: "18px",
    color: palette.primary.main
  },
  topBarCol1SubHead: {
    fontSize: 20,
    fontWeight: 300
  },
  topBarCol3: {
    padding: 20
  },
  col3Wrap: {
    justifyContent: "space-around"
  },
  gaugeWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
    "& $topBarCol1Head": {
      color: "white",
      textAlign: "center"
    }
  },
  topBarCol4: {
    display: "flex",
    "& $topBarCol1Head": {
      textAlign: "center"
    }
  },
  topButtonWrap: {
    padding: "15px 0",
    display: "flex",
    justifyContent: "flex-end"
  },
  btnGrp: {
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    "& button": {
      backgroundColor: "#fff",
      color: "#585858",
      textTransform: "capitalize"
    },
    "& svg": {
      transform: "scale(.8)",
      color: palette.secondary.main,
      marginRight: 5
    }
  },
  dialChartLegend: {
    fontWeight: 300,
    fontSize: 20,
    color: "#5fe9ff",
    textAlign: "center",
    marginBottom: -15,
    marginTop: 5
  },
  topBarColLeft: {
    padding: "5px 20px 20px 30px"
    //backgroundColor: "#EBF2FB"
  },
  heading: {
    fontSize: 16,
    color: "#505050",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    marginBottom: 20,
    "& svg": {
      height: 25,
      width: 25,
      borderRadius: "50%",
      border: "2px solid " + palette.secondary.main,
      padding: 2,
      color: palette.secondary.main,
      marginRight: 5
    }
  }
});
