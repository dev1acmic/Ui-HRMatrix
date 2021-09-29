import React from "react";
import {
  Container,
  Grid,
  Box,
  withStyles,
  Typography,
  CircularProgress,
  Checkbox,
} from "@material-ui/core";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import { useTranslation } from "react-i18next";

import styles from "../style";
const sliderStyle = {
  position: "relative",
  width: "100%",
  height: 30,
};

const railStyle = {
  position: "absolute",
  width: "100%",
  height: 10,
  marginTop: 15,
  borderRadius: 5,
  backgroundColor: "#DED9D9",
};

export function Handle({
  handle: { id, value, percent },
  getHandleProps,
  disabled,
}) {
  let handleStyle = {
    left: `${percent}%`,
    position: "absolute",
    marginLeft: -5,
    marginTop: 10,
    zIndex: 2,
    width: 20,
    height: 20,
    textAlign: "center",
  };
  if (!disabled) {
    handleStyle = {
      ...handleStyle,
      cursor: "pointer",
      borderRadius: "50%",
      backgroundColor: "#fff",
      color: "#333",
      border: "4px solid #38B5ED",
    };
  }
  return (
    <div style={handleStyle} {...getHandleProps(id)}>
      <div
        style={{
          fontFamily: "Roboto",
          fontSize: 11,
          marginTop: -18,
          marginLeft: -4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Track({ source, target, getTrackProps, disabled }) {
  // your own track component
  return (
    <div
      style={{
        position: "absolute",
        height: 10,
        zIndex: 1,
        marginTop: 15,
        backgroundColor: "#38B5ED",
        borderRadius: 5,
        cursor: !disabled && "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  );
}
const Domain = (props) => {
  const { classes, disabled, domainWeightage } = props;
  const { t } = useTranslation("interviewAssessment");
  const [overallScore, setOverallScore] = React.useState(0);
  const [weightedScore, setWeightedScore] = React.useState(0);
  const [checked, setChecked] = React.useState(true);

  React.useEffect(() => {
    setOverallScore(props.domainScore || 0);
    const weightedScore = Math.round(
      (props.domainScore || 0) * ((domainWeightage || 1) / 100)
    );
    setWeightedScore(weightedScore);
  }, [props.domainScore]);

  React.useEffect(() => {
    setChecked(!props.disableDomainAssessment);
  }, [props.disableDomainAssessment]);

  const handleOverallScoreChange = (value) => {
    setOverallScore(value);
    const weightedScore = Math.round(
      (props.domainScore || 0) * ((domainWeightage || 1) / 100)
    );
    setWeightedScore(weightedScore);
    props.setOverallScore("domain", value);
  };

  const handleDisable = (event) => {
    let value = event.target.checked;
    if (!value) {
      setWeightedScore(0);
      setOverallScore(0);
    }
    props.setOverallScore("domain", 0, !value);
    setChecked(event.target.checked);
  };

  return (
    <Container className={classes.root} style={{ paddingBottom: 0 }}>
      <Box className={classes.MainWrapper}>
        <Box className={classes.SubWrapperOutline}>
          <Box className={classes.titleWrap}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                disabled={disabled}
                checked={checked}
                onChange={handleDisable}
                inputProps={{ "aria-label": "Checkbox A" }}
                style={{ padding: 0 }}
              />
              <Typography variant="h2" className={classes.tTitle}>
                {t("domain.domainCompetency")}
              </Typography>
            </Box>
            <Box className={classes.weightWrap}>
              <Typography
                className={classes.iconTextGradient}
                key={domainWeightage}
              >
                {checked && domainWeightage}
                {!checked && 0}
              </Typography>
              <Typography variant="h4" className={classes.weightTxt}>
                {t("behaviour.weightage")}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.borderBox} style={{ position: "relative" }}>
            {!checked && <div className={classes.cover}></div>}
            <Grid container spacing={0}>
              <Grid item xs={12} md={4} lg={4} className={classes.columnBox}>
                <Typography
                  style={{
                    color: "#38B5ED",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    lineHeight: "30px",
                  }}
                >
                  {t("domain.overallDomainKnowledge")}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4} lg={4} className={classes.columnBox}>
                <Slider
                  disabled={!checked || disabled}
                  rootStyle={sliderStyle}
                  domain={[0, 100]}
                  step={1}
                  mode={2}
                  values={[overallScore]}
                  onSlideEnd={(event) => handleOverallScoreChange(event[0])}
                >
                  <Rail>
                    {(
                      { getRailProps } // adding the rail props sets up events on the rail
                    ) => <div style={railStyle} {...getRailProps()} />}
                  </Rail>
                  <Handles>
                    {({ handles, getHandleProps }) => (
                      <div className="slider-handles">
                        {handles.map((handle) => (
                          <Handle
                            key={handle.id}
                            handle={handle}
                            getHandleProps={getHandleProps}
                            disabled={!checked || disabled}
                          />
                        ))}
                      </div>
                    )}
                  </Handles>
                  <Tracks right={false}>
                    {({ tracks, getTrackProps }) => (
                      <div className="slider-tracks">
                        {tracks.map(({ id, source, target }) => (
                          <Track
                            key={id}
                            source={source}
                            target={target}
                            getTrackProps={getTrackProps}
                            disabled={disabled}
                          />
                        ))}
                      </div>
                    )}
                  </Tracks>
                </Slider>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                lg={4}
                className={classes.columnBox}
                style={{ padding: "10px 20px!important" }}
              >
                <Box className={classes.circleProgWrap}>
                  <span className={classes.circleProgVal}>
                    {weightedScore}%
                  </span>
                  <CircularProgress
                    className={classes.cirProgBlue}
                    variant="static"
                    value={weightedScore}
                    color="red"
                    thickness={5}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default withStyles(styles)(Domain);
