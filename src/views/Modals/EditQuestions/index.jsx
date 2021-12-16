import React, { Component } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import { Delete } from "@material-ui/icons";
import {
  Toolbar,
  Typography,
  Box,
  AppBar,
  Divider,
  Grid,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Select,
  OutlinedInput,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

// Component styles
import styles from "../styles";
import { AnswerType } from "util/enum";
import MessageBox from "util/messageBox";
import validate from "validate.js";
import schema from "./schema";

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
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "#fff",
        color: "#333",
        border: "2px solid #2C98F0",
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
        cursor: "pointer",
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
      answerType: "0",
      jobscreeningchoices: [
        {
          choice: "",
          score: 0,
        },
      ],
      errors: {},
    };
  }

  componentDidMount() {
    if (this.props.screeningItem) {
      const {
        idx,
        question,
        answerType,
        jobscreeningchoices,
      } = this.props.screeningItem;
      if (idx || idx === 0) {
        this.setState({
          idx,
          question,
          answerType,
          jobscreeningchoices,
          hideAddBtn: answerType === 3 ? true : false,
        });
      }
    }
  }

  handleAddScreeningQuest = () => {
    const item = {
      choice: "",
      score: 0,
    };
    this.setState({
      jobscreeningchoices: [...this.state.jobscreeningchoices, item],
    });
  };

  handleChangeScreeningQuest = (e) => {
    const newState = { ...this.state };
    const { name, value } = e.target;
    if (name === "answerType") {
      if (value === 3) {
        newState.jobscreeningchoices = [
          {
            choice: this.props.t("common:yes"),
            score: 0,
          },
          {
            choice: this.props.t("common:no"),
            score: 0,
          },
        ];
        newState.hideAddBtn = true;
      } else {
        newState.jobscreeningchoices = [
          {
            choice: "",
            score: 0,
          },
        ];
        newState.hideAddBtn = false;
      }
    }
    newState[name] = value;
    this.setState(newState);
  };

  handleChangeChoice = (idx) => (e) => {
    const newState = { ...this.state };
    const { name, value } = e.target;

    const jobscreeningchoices = [...this.state.jobscreeningchoices];
    jobscreeningchoices[idx] = { ...jobscreeningchoices[idx], [name]: value };
    newState.jobscreeningchoices = jobscreeningchoices;

    this.setState(newState);
  };

  handleChangeScore = (idx) => (e) => {
    const newState = { ...this.state };
    const value = e[0];
    const jobscreeningchoices = [...this.state.jobscreeningchoices];
    if (this.state.answerType === 3) {
      jobscreeningchoices.map((item) => {
        item.score = 0;
        return item;
      });
    }
    jobscreeningchoices[idx] = { ...jobscreeningchoices[idx], score: value };
    newState.jobscreeningchoices = jobscreeningchoices;
    this.setState(newState);
  };

  handleRemoveChoice = () => {
    const idx = this.state.deletedId;
    const jobscreeningchoices = [...this.state.jobscreeningchoices];
    const id = jobscreeningchoices[idx].id;
    if (id > 0) {
      this.props.deleteChoice(id);
    }

    if (jobscreeningchoices.length === 1) {
      this.setState({
        jobscreeningchoices: [
          {
            choice: "",
            score: 0,
          },
        ],
        showDelPopup: false,
      });
    } else {
      jobscreeningchoices.splice(idx, 1);
      this.setState({
        jobscreeningchoices,
        showDelPopup: false,
      });
    }
  };

  handleCancelChoice = () => {
    this.setState({ showDelPopup: false });
  };

  handleDeleteChoice = (idx) => () => {
    this.setState({ showDelPopup: true, deletedId: idx });
  };

  validateForm = async () => {
    const { question, answerType, jobscreeningchoices } = this.state;

    const newState = { ...this.state };
    const errors = validate({ question, answerType }, schema) || {};
    if (
      !jobscreeningchoices ||
      jobscreeningchoices.length === 0 ||
      jobscreeningchoices[0].choice === ""
    ) {
      errors.screeningQuest = [this.props.t("common:errMsg.addAnswerChoices")];
    } else if (errors && errors.screeningQuest) {
      delete errors.screeningQuest;
    }
    newState.errors = errors || {};
    newState.isValid = errors && Object.keys(errors).length > 0 ? false : true;

    this.setState(newState);
    return newState.isValid;
  };

  handleSubmit = () => {
    this.validateForm().then((isValid) => {
      if (isValid) {
        const { idx, question, answerType, jobscreeningchoices } = this.state;
        if (jobscreeningchoices.length <= 1) {
          this.setState({
            showError: true,
            msgError: this.props.t("common:errMsg.addMoreChoices"),
          });
        } else {
          const totalScore = jobscreeningchoices
            .map((c) => c.score)
            .reduce((a, b) => a + b);
          if (totalScore < 100 || totalScore > 100) {
            let msg = "";
            if (this.state.answerType === 1 || this.state.answerType === 2) {
              msg = this.props.t("common:errMsg.distributePoints");
            } else {
              msg = this.props.t("common:errMsg.rightAnsPoints");
            }
            this.setState({
              showError: true,
              msgError: msg,
            });
          } else {
            let data = { question, answerType, jobscreeningchoices };
            if (idx || idx === 0) {
              data.idx = idx;
            }
            this.props.savePreScreeningQstns(data);
          }
        }
      }
    });
  };

  handleClose = () => {
    this.setState({ showError: false });
  };

  render() {
    const { classes, t } = this.props;
    const { errors } = this.state;
    return (
      <PerfectScrollbar style={{ zIndex: 1000 }}>
        <Box
          width={{ xs: "90%", sm: "90%", md: "600px" }}
          className={classes.modalWrap}
        >
          <AppBar position="static" color="default" align="center">
            <Toolbar className={classes.modalHeadWrap}>
              <Typography className={classes.modalHead} variant="h6">
                {t("common:addScreeningQ")}
              </Typography>
            </Toolbar>
          </AppBar>
          <Divider className={classes.modalHeadHr} />

          <Box className={classes.modalContent}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InputLabel className={classes.inputLabel}>
                  {t("question")}
                </InputLabel>
                <TextField
                  error={getMsg(errors.question, t)}
                  name="question"
                  id="outlined-bare"
                  margin="dense"
                  variant="outlined"
                  multiline
                  rowsMax="4"
                  rows="3"
                  className={classes.textField}
                  //margin="dense"
                  //variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxLength: 250 }}
                  placeholder={t("competency.rateexpertise")}
                  value={this.state.question}
                  onChange={(e) => this.handleChangeScreeningQuest(e)}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <InputLabel className={classes.formLabel}>
                  {t("competency.answertype")}
                </InputLabel>
                <Select
                  error={getMsg(errors.answerType, t)}
                  fullWidth
                  margin="dense"
                  input={
                    <OutlinedInput
                      labelWidth="0"
                      name="age"
                      id="outlined-age-simple"
                    />
                  }
                  name="answerType"
                  value={this.state.answerType}
                  onChange={(e) => this.handleChangeScreeningQuest(e)}
                >
                  <MenuItem value="0"> {t("common:select")}</MenuItem>
                  {AnswerType.getKeyValuePairs().map((item) => {
                    return (
                      <MenuItem value={item.value}>
                        {" "}
                        {t(`${item.name}`)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <PerfectScrollbar>
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
                        {this.state.jobscreeningchoices.map((item, idx) => (
                          <TableRow hover>
                            <TableCell>
                              {this.state.answerType === 3 ? (
                                <InputLabel className={classes.inputLabel}>
                                  {item.choice}
                                </InputLabel>
                              ) : (
                                <TextField
                                  error={getMsg(errors.screeningQuest, t)}
                                  name="choice"
                                  id="outlined-bare"
                                  className={classes.textField}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  value={item.choice}
                                  inputProps={{
                                    "aria-label": "bare",
                                    maxLength: 200,
                                  }}
                                  placeholder=""
                                  onChange={this.handleChangeChoice(idx)}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Slider
                                name="score"
                                rootStyle={sliderStyle}
                                domain={[0, 100]}
                                step={10}
                                mode={2}
                                values={[item.score]}
                                onChange={this.handleChangeScore(idx)}
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
                            {this.state.answerType !== 3 && (
                              <TableCell align="center">
                                <IconButton
                                  small
                                  onClick={this.handleDeleteChoice(idx)}
                                  disabled={
                                    item.choice !== "" || item.score !== 0
                                      ? false
                                      : true
                                  }
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </PerfectScrollbar>
                </Paper>
                <br />
                {!this.state.hideAddBtn && (
                  <Button
                    mt={10}
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={this.handleAddScreeningQuest}
                  >
                    {t("competency.addChoice")}
                  </Button>
                )}
                <Grid item xs={12} className={classes.modalFooter}>
                  <Button
                    variant="contained"
                    className={classes.modalBtnSecondary}
                    onClick={this.props.onCancel}
                  >
                    {t("common:cancel")}
                  </Button>{" "}
                  &nbsp;
                  <Button
                    variant="contained"
                    //color="secondary"
                    className={classes.modalBtnPrimary}
                    onClick={this.handleSubmit}
                  >
                    {t("common:submit")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="confirmation-dialog-title"
          open={this.state.showDelPopup}
        >
          <DialogTitle id="confirmation-dialog-title">
            {t("common:errMsg.deleteChoice")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("common:errMsg.deleteChoiceAlert")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancelChoice} color="primary">
              {t("cancel")}
            </Button>
            <Button onClick={this.handleRemoveChoice} color="primary">
              {t("common:ok")}
            </Button>
          </DialogActions>
        </Dialog>
        <MessageBox
          open={this.state.showError}
          variant="error"
          onClose={this.handleClose}
          message={this.state.msgError}
        />
      </PerfectScrollbar>
    );
  }
}

export default withStyles(styles)(
  withTranslation(["jobPost", "common", "enum"])(EditQuestions)
);
