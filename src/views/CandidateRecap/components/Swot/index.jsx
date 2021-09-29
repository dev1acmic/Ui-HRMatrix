import React, { useEffect } from "react";

// Material helpers
import { withStyles, CircularProgress } from "@material-ui/core";
import strength from "../../../../../src/assets/images/weight-lifting.png";
import weakness from "../../../../../src/assets/images/negative-vote.png";
import opportunity from "../../../../../src/assets/images/lamp.png";
import threat from "../../../../../src/assets/images/warning.png";

import { getSwotAnalysis } from "util/swotUtil";

// Material components
import { Grid, Box, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

// Component styles
import styles from "./styles";

const Swot = (props) => {
  const { classes, applicant, isPrint } = props;
  const { t } = useTranslation("common");
  const [swotAnalysis, setSwotAnalysis] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (applicant) {
      getSwotAnalysis(applicant, t).then((result) => {
        setSwotAnalysis(result);
        setLoading(false);
      });
    }
  }, [applicant]);

  if (loading) {
    return (
      <div
        style={{
          height: 300,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          marginBottom: 30,
        }}
      >
        <CircularProgress style={{ height: 30, width: 30 }} />
      </div>
    );
  }

  return (
    <Grid
      container
      xs={12}
      className={classes.swotWrap}
      style={isPrint && { border: "none", boxShadow: "none" }}
    >
      {swotAnalysis && (
        <React.Fragment>
          <Grid
            item
            className={classes.swotCol}
            xs={12}
            sm={isPrint ? 12 : 6}
            style={isPrint && { marginTop: -50, padding: "0 20px 0 15px" }}
          >
            <Box className={classes.swotItemWrap}>
              <Box className={classes.swotItemColLeft}>
                <img alt="Strengths" src={strength} />
                <Typography>{t("strengths")}</Typography>
              </Box>
              <Box className={classes.swotItemColRight}>
                <ul className={classes.swotList}>
                  {swotAnalysis.strength &&
                    swotAnalysis.strength.map((item) => <li>{item}</li>)}
                </ul>
              </Box>
            </Box>
            <Box className={classes.swotItemWrap}>
              <Box
                className={classes.swotItemColLeft}
                style={{ backgroundColor: "#75D49B" }}
              >
                <img alt="Opportunities" src={opportunity} />
                <Typography>{t("opportunities")}</Typography>
              </Box>
              <Box className={classes.swotItemColRight}>
                <ul className={classes.swotList}>
                  {swotAnalysis.opportunity &&
                    swotAnalysis.opportunity.map((item) => <li>{item}</li>)}
                </ul>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            className={classes.swotCol}
            xs={12}
            sm={isPrint ? 12 : 6}
            style={isPrint && { marginTop: 0, padding: "0 20px 0 15px" }}
          >
            <Box className={classes.swotItemWrap}>
              <Box
                className={classes.swotItemColLeft}
                style={{ backgroundColor: "#F9C51D" }}
              >
                <img alt="Weaknesses" src={weakness} />
                <Typography>{t("weaknessess")}</Typography>
              </Box>
              <Box className={classes.swotItemColRight}>
                <ul className={classes.swotList}>
                  {swotAnalysis.weakness &&
                    swotAnalysis.weakness.map((item) => <li>{item}</li>)}
                </ul>
              </Box>
            </Box>
            <Box className={classes.swotItemWrap}>
              <Box
                className={classes.swotItemColLeft}
                style={{ backgroundColor: "#FF725F" }}
              >
                <img alt="Threats" src={threat} />
                <Typography>{t("threats")}</Typography>
              </Box>
              <Box className={classes.swotItemColRight}>
                <ul className={classes.swotList}>
                  {swotAnalysis.threat &&
                    swotAnalysis.threat.map((item) => <li>{item}</li>)}
                </ul>
              </Box>
            </Box>
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
};

export default withStyles(styles)(Swot);
