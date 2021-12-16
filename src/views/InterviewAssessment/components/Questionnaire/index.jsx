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
import styles from "../style";
import { useTranslation } from "react-i18next";
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

export function QuesHandle({
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
      border: "4px solid #FFA723",
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

function Track({ source, target, getTrackProps, overall, disabled }) {
  // your own track component
  return (
    <div
      style={{
        position: "absolute",
        height: 10,
        zIndex: 1,
        marginTop: 15,
        backgroundColor: "#FFA723",
        borderRadius: 5,
        cursor: overall || disabled ? "" : "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  );
}

const Questionnaire = (props) => {
  const { classes, disabled, interviewWeightage } = props;
  const { t } = useTranslation("interviewAssessment");
  const [questions, setQuestions] = React.useState(null);
  const [overallScore, setOverallScore] = React.useState(0);
  const [weightedScore, setWeightedScore] = React.useState(0);
  const [checked, setChecked] = React.useState(true);

  useEffect(() => {
    if (props.interviewQstns) {
      setQuestions(props.interviewQstns);
    }
  }, [props.interviewQstns]);

  useEffect(() => {
    if (props.questScore) {
      setOverallScore(props.questScore);
      const weightedScore = Math.round(
        props.questScore * (interviewWeightage / 100)
      );
      setWeightedScore(weightedScore);
    } else {
      setOverallScore(0);
      setWeightedScore(0);
    }
  }, [props.questScore]);

  React.useEffect(() => {
    setChecked(!props.disableQuestAssessment);
  }, [props.disableQuestAssessment]);

  const handleChange = (value, index) => {
    let newState = [...questions];
    if (newState[index]) {
      newState[index].score = value;
    }

    const total = newState.reduce((a, b) => {
      const score = b.score;
      return a + score;
    }, 0);
    const overallScore = Math.round((total / (newState.length * 100)) * 100);
    const weightedScore = Math.round(overallScore * (interviewWeightage / 100));
    setQuestions(newState);
    props.setQuestionnaire(newState, overallScore);
    setOverallScore(overallScore);
    setWeightedScore(weightedScore);
  };

  const handleOverallScoreChange = (value) => {
    setOverallScore(value);
    props.setOverallScore("quest", value);
  };

  const handleDisable = (event) => {
    let value = event.target.checked;
    if (!value) {
      if(questions&&questions.length>0)
      {
      let newState = [...questions];
      newState.map((ques) => (ques.score = 0));
      setQuestions(newState);
      }
      setWeightedScore(0);
      setOverallScore(0);
      //props.setQuestionnaire(newState, 0, true);
    }
    props.setOverallScore("quest", 0, !value);
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
                {t("intrwQuestionnaire")}
              </Typography>
            </Box>
            <Box className={classes.weightWrap}>
              <Typography
                className={classes.iconTextGradient}
                key={interviewWeightage}
              >
                {checked && interviewWeightage}
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
                    color: "#FFA723",
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
                {/* <LinearProgress
                  variant="determinate"
                  value={overallScore}
                  classes={{
                    root: classes.barRoot,
                    colorPrimary: classes.trackColorPrimary,
                    barColorPrimary: classes.barColorGreen
                  }}
                /> */}

                <Slider
                  disabled={true}
                  rootStyle={sliderStyle}
                  domain={[0, 100]}
                  step={10}
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
                            disabled={disabled}
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
                            overall={true}
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
                    className={classes.cirProgYellow}
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
              {questions &&
                questions.map((item, index) => (
                  <Grid item xs={12} md={12} lg={12}>
                    <Grid container spacing={0}>
                      <Grid
                        item
                        xs={12}
                        md={8}
                        lg={8}
                        className={classes.columnBox}
                      >
                        <Typography
                          style={{
                            color: "#505050",
                            fontSize: "16px",
                            fontWeight: "500",
                            lineHeight: "30px",
                          }}
                        >
                          {item.question}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={4}
                        lg={4}
                        className={classes.columnBox}
                      >
                        <Slider
                          disabled={!checked || disabled}
                          rootStyle={sliderStyle}
                          domain={[0, 100]}
                          step={10}
                          mode={2}
                          values={[item.score]}
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
                                  <QuesHandle
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

export default withStyles(styles)(Questionnaire);
