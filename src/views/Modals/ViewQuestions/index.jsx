import React, { Component } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
// Material helpers
import { withStyles, Checkbox, CircularProgress } from "@material-ui/core";

import {
  Toolbar,
  Typography,
  Box,
  AppBar,
  Divider,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";

// Component styles
import styles from "../styles";
import { withTranslation } from "react-i18next";

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
        //border: 0,
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

class ViewQuestions extends Component {
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

  validate = async () => {
    const choices = this.convertToArray();
    const isValid = choices.length > 0 ? true : false;
    if (!isValid) {
      this.setState({ showErr: true });
    }
    return isValid;
  };

  handleSubmit = () => {
    this.validate().then((isValid) => {
      if (isValid) {
        const choices = this.convertToArray();
        this.props.savePreScreeningChoices(this.state.id, choices);
      }
    });
  };

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

  handleChange = (event) => {
    let selectedChoice = [...this.state.selectedChoice];
    const value = parseInt(event.target.value);
    if (event.target.checked) {
      selectedChoice = selectedChoice.concat(value);
    } else {
      selectedChoice = selectedChoice.filter((c) => c !== value);
    }
    this.setState({
      ...this.state,
      selectedChoice: selectedChoice,
    });
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
                {t("common:viewScreeningQ")}
              </Typography>
            </Toolbar>
          </AppBar>
          <Divider className={classes.modalHeadHr} />
          {this.state.loading ? (
            <CircularProgress></CircularProgress>
          ) : (
            <Box className={classes.modalContent}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InputLabel className={classes.inputLabel}>
                    {t("question")}
                  </InputLabel>
                  <Typography variant="h6">{this.state.question}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Paper>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableHead}>
                            {t("common:options")}
                          </TableCell>

                          <TableCell className={classes.tableHead} />
                          <TableCell className={classes.tableHead} />
                          <TableCell className={classes.tableHead} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {this.state.answerType === 2 ? (
                            this.state.jobscreeningchoices.map((item, idx) => (
                              <TableCell>
                                <FormControl component="fieldset">
                                  <FormControlLabel
                                    value={item.id}
                                    control={
                                      <Checkbox
                                        color="primary"
                                        className={
                                          this.state.showErr &&
                                          classes.buttonIconErr
                                        }
                                        checked={this.isChecked(item.id)}
                                        disabled={
                                          !this.isChecked(item.id) &&
                                          this.props.isMatrix
                                        }
                                      />
                                    }
                                    label={item.choice}
                                    labelPlacement="end"
                                    onChange={(event) => {
                                      this.handleChange(event);
                                    }}
                                  />
                                </FormControl>
                              </TableCell>
                            ))
                          ) : (
                            <RadioGroup
                              aria-label="position"
                              name="position"
                              width="100%"
                              style={{ display: "block" }}
                              value={parseInt(this.state.selectedChoice)}
                              onChange={(event) => {
                                this.setState({
                                  ...this.state,
                                  selectedChoice: event.target.value,
                                });
                              }}
                            >
                              {this.state.jobscreeningchoices.map(
                                (item, idx) => (
                                  <TableCell>
                                    <FormControl component="fieldset">
                                      <FormControlLabel
                                        value={item.id}
                                        control={
                                          <Radio
                                            color="primary"
                                            className={
                                              this.state.showErr &&
                                              classes.buttonIconErr
                                            }
                                            checked={this.isChecked(item.id)}
                                            disabled={
                                              !this.isChecked(item.id) &&
                                              this.props.isMatrix
                                            }
                                          />
                                        }
                                        label={t(
                                          `common:${item.choice}`.toLowerCase()
                                        )}
                                        labelPlacement="end"
                                      />
                                    </FormControl>
                                  </TableCell>
                                )
                              )}
                            </RadioGroup>
                          )}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Paper>

                  <Grid item xs={12} className={classes.modalFooter}>
                    {this.props.isMatrix ? (
                      <Button
                        onClick={this.props.onCancel}
                        variant="contained"
                        className={classes.modalBtnSecondary}
                      >
                        {t("common:close")}
                      </Button>
                    ) : (
                      <div>
                        <Button
                          onClick={this.props.onCancel}
                          variant="contained"
                          className={classes.modalBtnSecondary}
                        >
                          {t("common:cancel")}
                        </Button>
                        &nbsp;
                        <Button
                          onClick={this.handleSubmit}
                          variant="contained"
                          //color="secondary"
                          className={classes.modalBtnPrimary}
                        >
                          {t("common:submit")}
                        </Button>
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </PerfectScrollbar>
    );
  }
}

export default withStyles(styles)(
  withTranslation(["jobPost", "common"])(ViewQuestions)
);
