import React, { useEffect } from "react";
import {
  Container,
  Box,
  withStyles,
  Typography,
  CircularProgress,
  Grid,
} from "@material-ui/core";

import { BeenhereOutlined } from "@material-ui/icons";
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
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "#fff",
        color: "#333",
        border: "4px solid #38B5ED",
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
        backgroundColor: "#2196f3",
        borderRadius: 5,
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  );
}

const Score = (props) => {
  const { classes, scores, disabled } = props;
  const { t } = useTranslation("interviewAssessment");
  const [totalScore, setTotalScore] = React.useState(0);
  const [newScore, setNewScore] = React.useState(0);

  useEffect(() => {
    setTotalScore(props.totalScore);
  }, [props.totalScore]);

  const handleScoreChange = (value) => {
    if (value > totalScore) {
      setNewScore(value);
      props.setOverallScore("total", value);
    }
  };

  return (
    <Container className={classes.root} style={{ paddingBottom: 0 }}>
      <Box className={classes.MainWrapper}>
        <Box className={classes.SubWrapperOutline}>
          <Box className={classes.titleWrap}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <BeenhereOutlined className={classes.tIcon} />
              <Typography variant="h2" className={classes.tTitle}>
                {t("score.overallScore")}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.borderBox}>
            <Box className={classes.scoreBox}>
              <Box className={classes.circleProgWrapLg}>
                <span className={classes.circleProgValLg}>
                  {scores.skillScore || 0}%
                </span>
                <CircularProgress
                  className={classes.cirProgRedLg}
                  variant="static"
                  value={scores.skillScore || 0}
                  color="red"
                  thickness={5}
                />
              </Box>
              <Typography
                style={{
                  color: "#FF6C5F",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginTop: "15px",
                }}
              >
                {t("score.skillCompetency")}
              </Typography>
            </Box>

            <Box className={classes.scoreBox}>
              <Box className={classes.circleProgWrapLg}>
                <span className={classes.circleProgValLg}>
                  {scores.domainScore || 0}%
                </span>
                <CircularProgress
                  className={classes.cirProgBlueLg}
                  variant="static"
                  value={scores.domainScore || 0}
                  color="red"
                  thickness={5}
                />
              </Box>
              <Typography
                style={{
                  color: "#38B5ED",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginTop: "15px",
                }}
              >
                {t("domain.domainCompetency")}
              </Typography>
            </Box>

            <Box className={classes.scoreBox}>
              <Box className={classes.circleProgWrapLg}>
                <span className={classes.circleProgValLg}>
                  {scores.questScore || 0}%
                </span>
                <CircularProgress
                  className={classes.cirProgYellowLg}
                  variant="static"
                  value={scores.questScore || 0}
                  color="red"
                  thickness={5}
                />
              </Box>
              <Typography
                style={{
                  color: "#FFA723",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginTop: "15px",
                }}
              >
                {t("score.interviewQuestion")}
              </Typography>
            </Box>

            <Box className={classes.scoreBox}>
              <Box className={classes.circleProgWrapLg}>
                <span className={classes.circleProgValLg}>
                  {scores.behaviourScore || 0}%
                </span>
                <CircularProgress
                  className={classes.cirProgPurpleLg}
                  variant="static"
                  value={scores.behaviourScore || 0}
                  color="red"
                  thickness={5}
                />
              </Box>
              <Typography
                style={{
                  color: "#894CBD",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginTop: "15px",
                }}
              >
                {t("common:behavioural")}
              </Typography>
            </Box>

            <Box
              className={classes.scoreBox}
              style={{ borderLeft: "1px solid #BEBEBE" }}
            >
              {/* <Box style={{ marginBottom: 20 }}>
                <Slider
                  disabled={disabled}
                  rootStyle={sliderStyle}
                  domain={[0, 100]}
                  step={1}
                  mode={2}
                  values={[totalScore]}
                  onSlideEnd={event => handleScoreChange(event[0])}
                >
                  <Rail>
                    {(
                      { getRailProps } // adding the rail props sets up events on the rail
                    ) => <div style={railStyle} {...getRailProps()} />}
                  </Rail>
                  <Handles>
                    {({ handles, getHandleProps }) => (
                      <div className="slider-handles">
                        {handles.map(handle => (
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
                            disabled={disabled}
                          />
                        ))}
                      </div>
                    )}
                  </Tracks>
                </Slider>
              </Box>
              <Box className={classes.circleProgWrapXlg}>
                <span className={classes.circleProgValXlg}>
                  {newScore || totalScore}%
                </span>
                <CircularProgress
                  className={classes.cirProgGreenLg}
                  color="red"
                  thickness={5}
                  value={totalScore}
                  variant="static"
                />
                <CircularProgress
                  className={classes.cirProgGreenLg}
                  style={{
                    color: "#2e81ff",
                    position: "absolute",
                    left: "0",
                    zIndex: "1",
                    right: "0",
                    top: "0",
                    bottom: "0"
                  }}
                  thickness={5}
                  value={newScore}
                  variant="static"
                />
              </Box> */}

              <Box className={classes.circleProgWrapXlg}>
                <span className={classes.circleProgValXlg}>
                  {totalScore || 0}%
                </span>
                <CircularProgress
                  className={classes.cirProgGreenLg}
                  color="red"
                  thickness={5}
                  value={totalScore || 0}
                  variant="static"
                />
              </Box>
              <Typography
                style={{
                  color: "#69D193",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginTop: "15px",
                }}
              >
                {t("score.overallScore")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default withStyles(styles)(Score);
