import palette from "theme/palette";
export default theme => ({
  root: {
    backgroundColor: "#f3f3f3"
  },
  reviewItemWrap: {
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: 5,
    margin: "10px 10px 20px 10px"
  },
  colLeft: {
    borderRadius: "5px 0 0 0"
  },
  colRight: {
    borderRadius: "0 5px 0 0"
  },
  gridWrap: {
    background: "#FFFFFF",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    borderRadius: "5px",
    marginTop: 30,
    marginBottom: 30,
    "& $colLeft": {
      border: "1px solid #e4e4e4",
      padding: "20px 10px"
    },
    "& $colRight": {
      border: "1px solid #e4e4e4",
      borderLeft: "none"
    }
  },
  heading: {
    fontSize: 14,
    color: "#505050",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    marginBottom: 15,
    "& svg": {
      height: 25,
      width: 25,
      borderRadius: "50%",
      border: "2px solid " + palette.secondary.main,
      padding: 2,
      color: palette.secondary.main,
      marginRight: 5
    }
  },
  comparisonWrap: {
    padding: 20,
    borderBottom: "1px solid #e4e4e4",
    textAlign: "center"
  },
  chartWrap: {
    padding: "20px 20px 40px 20px",
    textAlign: "center",
    "& .$apexcharts-legend": {
      marginLeft: "15%",
      [theme.breakpoints.down("md")]: {
        marginLeft: "7%"
      }
    },
    "& #radialChart .$apexcharts-legend-series": {
      textAlign: "left",
      "& .$apexcharts-legend-marker": {
        display: "none"
      }
    }
  }
});
