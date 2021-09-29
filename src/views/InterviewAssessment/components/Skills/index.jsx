import React, { useEffect } from "react";
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
      border: "4px solid #FF605F",
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
        backgroundColor: "#FF605F",
        borderRadius: 5,
        cursor: !disabled && "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  );
}
const Skills = (props) => {
  const { classes, skillWeightage, disabled } = props;
  const { t } = useTranslation("interviewAssessment");
  const [skills, setSkills] = React.useState(null);
  const [overallScore, setOverallScore] = React.useState(0);
  const [weightedScore, setWeightedScore] = React.useState(0);
  const [checked, setChecked] = React.useState(true);
  const [override, setOverride] = React.useState(false);

  useEffect(() => {
    if (props.skills) {
      setSkills(props.skills);
    }
    else
    {
      setSkills(null);
    }
  }, [props.skills]);

  useEffect(() => {
    setChecked(!props.disableSkillAssessment);
  }, [props.disableSkillAssessment]);

  useEffect(() => {
    if (props.skillScore) {
      setOverallScore(props.skillScore);
      const weightedScore = Math.round(
        props.skillScore * (skillWeightage / 100)
      );
      setWeightedScore(weightedScore);
    } else {
      setOverallScore(0);
      setWeightedScore(0);
    }
  }, [props.skillScore]);

  const handleChange = (value, index) => {
    let newState = [...skills];
    if (newState[index]) {
      newState[index].score = value;
    }

    const total = newState.reduce((a, b) => {
      const score = b.score;
      return a + score;
    }, 0);
    const avgScore = (total / (newState.length * 100)) * 100;
    const overallScore = Math.round(avgScore);
    const weightedScore = Math.round(avgScore * (skillWeightage / 100));
    setSkills(newState);
    props.setSkillScore(newState, overallScore);
    setOverallScore(overallScore);
    setWeightedScore(weightedScore);
  };

  const handleOverallScoreChange = (value) => {
    props.setOverallScore("skill", value);
    const weightedScore = Math.round(value * (skillWeightage / 100));
    setWeightedScore(weightedScore);
    setOverallScore(value);
  };
  const handleDisable = (event) => {
    let value = event.target.checked;
    if (!value) {
      let newState = [...skills];
      newState.map((skill) => (skill.score = 0));
      setSkills(newState);
      setWeightedScore(0);
      setOverallScore(0);
      //props.setSkillScore(newState, 0);
    }
    props.setOverallScore("skill", 0, !value);
    setChecked(event.target.checked);
  };
  const handleOverride = (event) => {
    let newState = [...skills];
    newState.map((skill) => (skill.score = 0));
    setSkills(newState);
    setOverride(event.target.checked);
    props.setSkillScore(newState, 0, true);
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
                {t("common:skillscompetency")}
              </Typography>
            </Box>
            <Box className={classes.weightWrap}>
              <Typography
                className={classes.iconTextGradient}
                key={skillWeightage}
              >
                {checked && skillWeightage}
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
                    color: "#FF605F",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    lineHeight: "30px",
                  }}
                >
                  {t("skills.overallSkillsLevel")}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4} lg={4} className={classes.columnBox}>
                <Grid container spacing={0}>
                  <Grid item xs={12} md={12} lg={12}>
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
                  <Grid item xs={12} md={12} lg={12}>
                    <Typography
                      component="p"
                      variant="inherit"
                      color="inherit"
                      m={0}
                      style={{
                        borderBottom: "0",
                        fontFamily: "Roboto",
                        fontSize: "12px",
                        marginTop: "10px",
                      }}
                    >
                      <Checkbox
                        disabled={!checked || disabled}
                        checked={override}
                        onChange={handleOverride}
                        inputProps={{ "aria-label": "Checkbox A" }}
                        style={{ padding: 0 }}
                      />
                      {t("skills.overrideSkillsScore")}
                    </Typography>
                  </Grid>
                </Grid>
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
                    className={classes.cirProgRed}
                    variant="static"
                    value={weightedScore}
                    color="red"
                    thickness={5}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={0}
              style={{ borderTop: "1px solid #BEBEBE" }}
            >
              {skills &&
                skills.map((skill, index) => (
                  <Grid item xs={12} md={6} lg={6}>
                    <Grid container spacing={0}>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        lg={4}
                        className={classes.columnBox}
                      >
                        <Typography
                          style={{
                            color: "#505050",
                            fontSize: "16px",
                            fontWeight: "bold",
                            lineHeight: "30px",
                          }}
                        >
                          {skill.name}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                        className={classes.columnBox}
                      >
                        <Slider
                          disabled={!checked || disabled || override}
                          rootStyle={sliderStyle}
                          domain={[0, 100]}
                          step={1}
                          mode={2}
                          values={[skill.score]}
                          onSlideEnd={(event) => handleChange(event[0], index)}
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
                                    disabled={!checked || disabled || override}
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
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default withStyles(styles)(Skills);
