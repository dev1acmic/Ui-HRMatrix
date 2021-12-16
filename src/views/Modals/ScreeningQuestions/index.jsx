import React, { Component } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
  CheckBoxOutlined,
  CheckBoxOutlineBlankOutlined,
} from "@material-ui/icons";
import {
  Toolbar,
  Typography,
  Box,
  AppBar,
  Divider,
  Grid,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import { AnswerType } from "util/enum";

// Component styles
import styles from "../styles";
import { withTranslation } from "react-i18next";

const sliderStyle = {
  position: "relative",
  width: "100%",
  height: 30,
};

const railStyle = {
  position: "absolute",
  width: "100%",
  height: 5,
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
        width: 15,
        height: 15,
      }}
      {...getHandleProps(id)}
    >
      <div style={{ fontFamily: "Roboto", fontSize: 11, marginTop: -15 }}>
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
        height: 5,
        zIndex: 1,
        marginTop: 15,
        backgroundColor: "#96CCF8",
        borderRadius: 5,
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  );
}

class EditQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedChoice: [],
      showErr: false,
    };
  }
  componentDidMount() {
    if (this.props.screeningItem) {
      const {
        id,
        question,
        answerType,
        jobscreeningchoices,
        selectedChoice,
      } = this.props.screeningItem;

      this.setState({
        id,
        question,
        answerType,
        jobscreeningchoices,
        selectedChoice,
        loading: false,
      });
    }
  }
  convertToArray = () => {
    const selected = this.state.selectedChoice;
    const choices =
      typeof selected != "undefined" && selected instanceof Array
        ? selected
        : [selected];
    return choices;
  };

  isChecked = (id) => {
    const choices = this.convertToArray();
    return (
      choices.length > 0 && choices.findIndex((c) => parseInt(c) === id) !== -1
    );
  };

  getAnswerTypeLang = (type, t) => {
    if (type === "Single Answer") {
      return t("competency.singleanswer");
    } else if (type === "Multiple Answer") {
      return t("competency.multipleanswer");
    } else {
      return t("competency.yesNo");
    }
  };

  render() {
    const { classes, t } = this.props;
    return (
      <PerfectScrollbar style={{ zIndex: 1000 }}>
        <Box
          width={{ xs: "90%", sm: "90%", md: "600px" }}
          className={classes.modalWrap}
        >
          <AppBar position="static" color="default" align="center">
            <Toolbar className={classes.modalHeadWrap}>
              <Typography className={classes.modalHead} variant="h6">
                {t("screeningQaRes")} -{" "}
                <b style={{ color: "#2685ff" }}>{this.props.applicantName}</b>
              </Typography>
            </Toolbar>
          </AppBar>
          <Divider className={classes.modalHeadHr} />

          <Box className={classes.modalContent}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={9} md={9}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <InputLabel className={classes.inputLabel}>
                          {t("competency.question")}
                        </InputLabel>
                        <Typography>{this.state.question}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <InputLabel className={classes.inputLabel}>
                          {t("competency.answertype")}
                        </InputLabel>
                        <Typography>
                          {this.getAnswerTypeLang(
                            AnswerType.getNameByValue(this.state.answerType),
                            t
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={3} md={3}>
                    <Typography>
                      <Box className={classes.weightWrap}>
                        <Typography className={classes.iconTextGradient}>
                          {this.props.screeningWeightage}
                        </Typography>
                        <Typography variant="h4" className={classes.weightTxt}>
                          {t("weightage")}
                        </Typography>
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Paper>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHead}>
                          {t("competency.answerChoices")}
                        </TableCell>
                        <TableCell width="250" className={classes.tableHead}>
                          {t("competency.score")}
                        </TableCell>
                        <TableCell width="75" className={classes.tableHead} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.jobscreeningchoices &&
                        this.state.jobscreeningchoices.map((item, idx) => (
                          <TableRow hover>
                            <TableCell>
                              <Typography>{item.choice}</Typography>
                            </TableCell>
                            <TableCell>
                              <Slider
                                rootStyle={sliderStyle}
                                domain={[0, 100]}
                                step={10}
                                mode={2}
                                values={[item.score]}
                              >
                                <Rail>
                                  {(
                                    { getRailProps } // adding the rail props sets up events on the rail
                                  ) => (
                                    <div
                                      style={railStyle}
                                      {...getRailProps()}
                                    />
                                  )}
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
                            </TableCell>
                            <TableCell align="center">
                              {this.isChecked(item.id) ? (
                                <CheckBoxOutlined
                                  style={{ color: "#47bcaf" }}
                                />
                              ) : (
                                <CheckBoxOutlineBlankOutlined
                                  style={{ color: "#47bcaf" }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Paper>

                <Grid item xs={12} className={classes.modalFooter}>
                  <Button
                    onClick={this.props.onCancel}
                    variant="contained"
                    className={classes.modalBtnSecondary}
                  >
                    {t("common:close")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </PerfectScrollbar>
    );
  }
}

export default withStyles(styles)(withTranslation("jobPost")(EditQuestions));
