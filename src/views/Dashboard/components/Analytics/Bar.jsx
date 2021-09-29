import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

const purple =
  "linear-gradient(90.02deg, #FE66F8 5.7%, #A642F6 92.15%), linear-gradient(90.02deg, #68D2FF 5.7%, #0560EC 92.15%)";
const blue =
  "linear-gradient(90.03deg, #68D2FF 5.7%, #0560EC 92.15%), linear-gradient(90.03deg, #FE66F8 5.7%, #A642F6 92.15%)";
const orange = "linear-gradient(90.01deg, #FAB753 6.5%, #FF725F 90.74%)";
const red =
  "linear-gradient(90deg, #FF8888 7.25%, #FB7897 89.25%), linear-gradient(90deg, #FF88D3 7.25%, #FF2CC6 89.25%);";

const useStyles = makeStyles((theme) => ({
  barWrap: {
    display: "flex",
    flexDirection: "column",
    height: "85%",
    width: "calc(100% - 95px)",
    justifyContent: "center",
    [theme.breakpoints.down("xl")]: {
      minHeight: 275,
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: 150,
    },
  },
  bar: {
    height: 25,
    display: "flex",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "0px 13px 13px 0px",
    [theme.breakpoints.down("sm")]: {
      height: 20,
    },
    width: 0,
    transition: "width 100ms ease-in-out",
    transitionDelay: "2s",
  },
  barLegend: {
    fontFamily: "roboto",
    fontSize: 12,
    paddingLeft: "10px",
    position: "absolute",
    top: -10,
    textAlign: "left",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("sm")]: {
      lineHeight: "14px",
      top: -2,
    },
    "& strong": {
      display: "block",
      fontSize: 22,
      fontWeight: 300,
      color: "#7D7E76",
      [theme.breakpoints.down("sm")]: {
        fontSize: 18,
      },
    },
  },
  barWrapOuter: {
    width: " 100%",
    position: "relative",
    marginBottom: 30,
    [theme.breakpoints.down("sm")]: {
      marginBottom: 20,
    },
  },
  barPurple: {
    background: purple,
  },
  barBlue: {
    background: blue,
  },
  barOrange: {
    background: orange,
  },
  barRed: {
    background: red,
  },
}));
const Bar = (props) => {
  const { t } = useTranslation("dashboard");
  const classes = useStyles();
  const { summary } = props;
  const sourcing = 50;
  const review = 0;
  const interview = 0;
  const finalization = 0;
  return (
    <div className={classes.barWrap}>
      <Box className={classes.barWrapOuter}>
        <Box className={classes.barWrapInner}>
          <span
            className={classNames(classes.bar, classes.barPurple)}
            style={{
              width:
                summary.profileSourcing && summary.profileSourcing.perc + "%",
            }}
          >
            <span
              className={classes.barLegend}
              style={{
                color: "#a642f6",
                left:
                  summary.profileSourcing && summary.profileSourcing.perc + "%",
              }}
            >
              {t("analytics.bar.profileSourcing")}
              <strong>
                {summary.profileSourcing && summary.profileSourcing.days}{" "}
                {t("analytics.bar.days")}
              </strong>
            </span>
          </span>
        </Box>
      </Box>
      <Box className={classes.barWrapOuter}>
        <span
          className={classNames(classes.bar, classes.barBlue)}
          style={{
            width: summary.profileReview && summary.profileReview.perc + "%",
          }}
        >
          <span
            className={classes.barLegend}
            style={{
              color: "#0560EC",
              left: summary.profileReview && summary.profileReview.perc + "%",
            }}
          >
            {t("analytics.bar.profileReview")}
            <strong>
              {summary.profileReview && summary.profileReview.days}{" "}
              {t("analytics.bar.days")}
            </strong>
          </span>
        </span>
      </Box>
      <Box className={classes.barWrapOuter}>
        <Box className={classes.barWrapInner}>
          <span
            className={classNames(classes.bar, classes.barOrange)}
            style={{
              width:
                summary.applicantInterview &&
                summary.applicantInterview.perc + "%",
            }}
          >
            <span
              className={classes.barLegend}
              style={{
                color: "#FF725F",
                left:
                  summary.applicantInterview &&
                  summary.applicantInterview.perc + "%",
              }}
            >
              {t("analytics.bar.interview")}
              <strong>
                {summary.applicantInterview && summary.applicantInterview.days}{" "}
                {t("analytics.bar.days")}
              </strong>
            </span>
          </span>
        </Box>
      </Box>
      <Box className={classes.barWrapOuter}>
        <Box className={classes.barWrapInner}>
          <span
            className={classNames(classes.bar, classes.barRed)}
            style={{
              width:
                summary.applicantSelected &&
                summary.applicantSelected.perc + "%",
            }}
          >
            <span
              className={classes.barLegend}
              style={{
                color: "#FB7897",
                left:
                  summary.applicantSelected &&
                  summary.applicantSelected.perc + "%",
              }}
            >
              {t("analytics.bar.finalization")}
              <strong>
                {summary.applicantSelected && summary.applicantSelected.days}{" "}
                {t("analytics.bar.days")}
              </strong>
            </span>
          </span>
        </Box>
      </Box>
    </div>
  );
};

export default Bar;
