import React from "react";
import {
  Container,
  Grid,
  Box,
  withStyles,
  Typography,
  CircularProgress,
  Button,
  Checkbox,
} from "@material-ui/core";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import { AssessmentType } from "util/enum";
import { useTranslation } from "react-i18next";

import classNames from "classnames";

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

export function Handle({ handle: { id, value, percent }, getHandleProps }) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: "absolute",
        marginLeft: -5,
        marginTop: 10,
        zIndex: 2,
        width: 20,
        height: 20,
        textAlign: "center",
        // cursor: "pointer",
        // borderRadius: "50%",
        // backgroundColor: "#fff",
        // color: "#333",
        // border: "4px solid #894CBD"
      }}
      {...getHandleProps(id)}
    >
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

function Track({ source, target, getTrackProps }) {
  // your own track component
  return (
    <div
      style={{
        position: "absolute",
        height: 10,
        zIndex: 1,
        marginTop: 15,
        backgroundColor: "#894CBD",
        borderRadius: 5,
        //cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  );
}

const Behaviour = (props) => {
  const { classes, disabled, behaviouralWeightage } = props;
  const { t } = useTranslation(["interviewAssessment", "enum"]);
  const [overallScore, setOverallScore] = React.useState(0);
  const [weightedScore, setWeightedScore] = React.useState(0);
  const [state, setState] = React.useState([]);
  const [checked, setChecked] = React.useState(true);

  const handleOverallScoreChange = (value) => {
    setOverallScore(value);
    props.setOverallScore("behaviour", value);
  };
  const assessmentTypes = AssessmentType();

  React.useEffect(() => {
    setChecked(!props.disableBehaviourAssessment);
  }, [props.disableBehaviourAssessment]);

  React.useEffect(() => {
    if (props.behaviouralAssessment) {
      const behaviour = props.behaviouralAssessment;
      let newState = { ...state };
      newState["time"] = behaviour.timeManagement || 0;
      newState["communication"] = behaviour.communication || 0;
      newState["collaboration"] = behaviour.collaboration || 0;
      newState["thinking"] = behaviour.criticalThinking || 0;
      newState["leadership"] = behaviour.leadership || 0;
      setState(newState);
      setOverallScore(behaviour.overallBehaviouralScore);
      const weightedScore = Math.round(
        behaviour.overallBehaviouralScore * (behaviouralWeightage / 100)
      );
      setWeightedScore(weightedScore);
    } else {
      let newState = { ...state };
      newState["time"] =  0;
      newState["communication"] =  0;
      newState["collaboration"] =  0;
      newState["thinking"] =  0;
      newState["leadership"] =  0;
      setState(newState);
      setOverallScore(0);
      setWeightedScore(0);
    }
  }, [props.behaviouralAssessment]);

  const loadButtons = (param) => {
    return Object.keys(assessmentTypes).map((index) => (
      <Button
        disabled={disabled}
        style={
          state && state[param] === parseInt(index)
            ? { color: "#fff", backgroundColor: "#894CBD" }
            : null
        }
        variant="contained"
        className={classNames(
          classes.behButton,
          state && state[param] === parseInt(index) ? classes.activButton : null
        )}
        size="small"
        onClick={() => {
          handleSelect(param, parseInt(index));
        }}
      >
        {t(`${assessmentTypes[parseInt(index)].type}`)}
      </Button>
    ));
  };

  const handleSelect = (param, type) => {
    if (checked) {
      let newState = { ...state };
      newState[param] = type;

      const total = Object.values(newState).reduce((a, b) => {
        return parseInt(a) + parseInt(b);
      });

      const overallScore = Math.round(
        (total / (Object.keys(newState).length * 4)) * 100
      );
      props.setBehaviour(newState, overallScore);
      setOverallScore(overallScore);
      const weightedScore = Math.round(
        overallScore * (behaviouralWeightage / 100)
      );
      setWeightedScore(weightedScore);
      setState(newState);
    }
  };

  const handleDisable = (event) => {
    let value = event.target.checked;
    if (!value) {
      let newState = { ...state };
      newState["time"] = 0;
      newState["communication"] = 0;
      newState["collaboration"] = 0;
      newState["thinking"] = 0;
      newState["leadership"] = 0;
      setState(newState);
      setWeightedScore(0);
      setOverallScore(0);
      //props.setBehaviour(newState, 0, true);
    }
    props.setOverallScore("behaviour", 0, !value);
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
                {t("common:behavioural")}
              </Typography>
            </Box>
            <Box className={classes.weightWrap}>
              <Typography
                className={classes.iconTextGradient}
                key={behaviouralWeightage}
              >
                {checked && behaviouralWeightage}
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
                    color: "#894CBD",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    lineHeight: "30px",
                  }}
                >
                  {t("questionnaire.overall")}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4} lg={4} className={classes.columnBox}>
                <Slider
                  disabled={true}
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
                    className={classes.cirProgPurple}
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
                      {t("behaviour.timeManagement")}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={6}
                    className={classes.columnBox}
                  >
                    {loadButtons("time")}
                  </Grid>
                </Grid>
              </Grid>

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
                      {t("behaviour.criticalThinking")}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={6}
                    className={classes.columnBox}
                  >
                    {loadButtons("thinking")}
                  </Grid>
                </Grid>
              </Grid>

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
                      {t("behaviour.communication")}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={6}
                    className={classes.columnBox}
                  >
                    {loadButtons("communication")}
                  </Grid>
                </Grid>
              </Grid>

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
                      {t("behaviour.leadership")}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={6}
                    className={classes.columnBox}
                  >
                    {loadButtons("leadership")}
                  </Grid>
                </Grid>
              </Grid>

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
                      {t("behaviour.collaboration")}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={6}
                    className={classes.columnBox}
                  >
                    {loadButtons("collaboration")}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default withStyles(styles)(Behaviour);
