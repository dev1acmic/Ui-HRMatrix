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
    padding: 20,
    color: "#fff",
    borderRadius: "5px 0 0 5px",
    textAlign: "center"
  },
  candidateAvatar: {
    margin: "0 auto",
    height: 85,
    width: 85,
    border: "3px solid #fff"
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
    textAlign: "center",
    lineHeight: "26px"
  },
  candidateLocation: {
    display: "flex",
    whiteSpace: "nowrap",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    fontSize: 12,
    color: "#fff"
  },
  candidateFlag: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    border: "1px solid #fff",
    marginRight: 5
  },
  topBarCol2: { padding: 20 },
  topBarCol1Head: {
    fontSize: 12,
    color: palette.primary.main,
    fontWeight: 500,
    marginTop: 15,
    lineHeight: "18px"
  },
  topBarCol1SubHead: {
    fontSize: 20,
    fontWeight: 300
  },
  topBarCol3: {
    padding: 20,
    backgroundColor: "#EBF2FB"
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
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
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
    fontSize: 24,
    color: palette.secondary.main,
    textAlign: "center",
    marginBottom: -15,
    marginTop: 15
  }
});
