import React, { useEffect, useState } from "react";
import classNames from "classnames";

// Material helpers
import { withStyles } from "@material-ui/core";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// Material components
import {
  Toolbar,
  Typography,
  Box,
  AppBar,
  Divider,
  Grid,
  InputLabel,
  TextField,
  Button,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import { InterviewMode } from "util/enum";
import ReactTags from "react-tag-autocomplete";
import validate from "validate.js";
import userschema from "../AddPanel/schema_user";
import MessageBox from "util/messageBox";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import {
  getInterviewersByPanel,
  getInterviewersByApplicantId,
  saveApplicantInterviewers,
  deleteApplicantInterviewers,
} from "services/jobApplication/action";
import { addUser } from "services/admin/action";
// Component styles
import styles from "../styles";

const AssignInterviewer = (props) => {
  const {
    classes,
    organizationId,
    applicantId,
    applicantName,
    jobpostId,
    totalLevels,
  } = props;

  const panel = {
    newuser: {
      fname: "",
      lname: "",
      username: "",
    },
    values: {
      name: "",
      users: [],
      //users: []
    },
    errors: {
      users: null,
    },
    isValid: false,
    loading: false,
    submitError: null,
    suggestions:
      props.interviewers &&
      props.interviewers.map((t) => ({
        id: t.id,
        name: t.fname + " " + t.lname,
      })),
  };
  const { t } = useTranslation(["common", "enum"]);
  const [state, setState] = useState(null);
  let [values, setValues] = useState(panel.values);
  let [newuser, setNewuser] = useState(panel.newuser);
  const [suggestions, setSuggestions] = useState(panel.suggestions);
  const [errors, setErrors] = useState(panel.errors);
  const [option, setOption] = useState(false);
  const [optionBtn, setOptionBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (props.interviewDetails) {
      const interviewDetails = props.interviewDetails;
      setState({
        ...state,
        level: interviewDetails.level,
        mode: interviewDetails.mode,
        panelId: interviewDetails.panelId,
        panelName:
          (interviewDetails.interviewpanel &&
            interviewDetails.interviewpanel.name) ||
          "",
      });
      props.getInterviewersByPanel(interviewDetails.panelId);
      props.getInterviewersByApplicantId(applicantId, interviewDetails.level);
    }
  }, [props.interviewDetails]);

  useEffect(() => {
    if (props.panelMembers && props.panelMembers.length > 0) {
      const users = props.panelMembers.map((t) => ({
        id: t.userId,
        fname: t.user.fname,
        lname: t.user.lname,
      }));

      setValues({ ...values, users });
      const tags = suggestions.filter(function (val) {
        return users.findIndex((c) => c.id === val.id) === -1;
      });
      setSuggestions(tags);
    }
  }, [props.panelMembers]);

  useEffect(() => {
    if (props.applicantInterviewers && props.applicantInterviewers.length > 0) {
      const users = props.applicantInterviewers.map((t) => ({
        id: t.userId,
        fname: t.user.fname,
        lname: t.user.lname,
        applicantinterviewerId: t.id,
      }));

      setValues({ ...values, users });
      const tags = suggestions.filter(function (val) {
        return users.findIndex((c) => c.id === val.id) === -1;
      });
      setSuggestions(tags);
    }
  }, [props.applicantInterviewers]);

  useEffect(() => {
    if (props.user) {
      const newUser = props.user[0];
      const users = [].concat(values.users, newUser);
      setValues({ ...values, users });
      setSuggestions(suggestions.filter((c) => c.id !== newUser.id));
    }
  }, [props.user]);

  function optionView() {
    setNewuser({});
    setOption(true);
    setOptionBtn(false);
  }

  function buildPassword() {
    let a = "",
      b = "abcdefghijklmnopqrstuvwxyz1234567890",
      c = 10;
    for (let ma = 0; ma < c; ma++) {
      a += b[Math.floor(Math.random() * b.length)];
    }
    return a;
  }

  function buttonView() {
    if (validateUserForm()) {
      if (!newuser.id) {
        newuser.password = buildPassword();
      }
      newuser.organizationId = organizationId;
      newuser.roleId = 4;
      newuser.status = 1;
      props.addUser(newuser).then((res) => {
        if (res) {
          setLoading(false);
          setOption(false);
          setOptionBtn(true);
        }
        setLoading(false);
      });
    }
  }

  function validateUserForm() {
    let errors = validate(newuser, userschema);

    setErrors(errors || {});
    let valid = errors ? false : true;
    return valid;
  }

  function handleUserFieldChange(field, value) {
    setNewuser({ ...newuser, [field]: value });
  }

  function validateForm() {
    let errors = {};
    let valid = true;
    if (!values.users || values.users.length === 0) {
      valid = false;
      errors.users = ["Interviewers is required"];
    }
    setErrors(errors || {});
    return valid;
  }

  function handleSubmit() {
    if (validateForm()) {
      setLoading(true);
      let data = values;
      data.level = state.level;
      data.applicantId = applicantId;
      data.panelId = state.panelId;
      data.jobpostId = jobpostId;
      //console.log(data);
      props.saveApplicantInterviewers(data).then(() => {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          props.onCancel();
        }, 1000);
      });
    }
  }

  function handleDelete(i) {
    const user = values.users[i];
    let tag = {};
    tag.id = user.id;
    tag.name = user.fname + " " + user.lname;

    const users = values.users.slice(0);
    users.splice(i, 1);
    if (user.applicantinterviewerId) {
      props.deleteApplicantInterviewers(user.applicantinterviewerId);
    }
    setValues({ ...values, users: users });

    //suggestions = suggestions.concat(user);
    setSuggestions(suggestions.concat(tag));
  }

  const handleAddition = (tag) => {
    const uname = props.interviewers.find((u) => u.id === tag.id);
    tag = {};
    tag.id = uname.id;
    tag.fname = uname.fname;
    tag.lname = uname.lname;
    const users = [].concat(values.users, tag);
    setValues({ ...values, users });
    setSuggestions(suggestions.filter((c) => c.id !== tag.id));
  };

  const Tag = (props) => {
    return (
      <Chip
        label={props.tag.fname + " " + props.tag.lname}
        onDelete={props.onDelete}
        className={props.classNames.selectedTagName}
        color="primary"
        variant="outlined"
      />
    );
  };

  return (
    <Box
      width={{ xs: "90%", sm: "90%", md: "600px" }}
      style={{ maxHeight: "90vh" }}
      className={classes.modalWrap}
    >
      <AppBar position="static" color="default" align="center">
        <Toolbar className={classes.modalHeadWrap}>
          <Typography className={classes.modalHead} variant="h6">
            {t("assignInterviewer")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Divider className={classes.modalHeadHr} />

      <Box className={classes.modalContent}>
        <Grid
          container
          item
          spacing={3}
          className={classes.formContainer}
          style={{ paddingTop: 0, marginTop: 0 }}
        >
          {state && (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                background: "#f5f0f0",
                padding: "20px",
                borderBottom: "4px solid #e4e4e4",
                borderRadius: "5px",
              }}
            >
              <Grid container spacing={0}>
                <Grid item xs={12} sm={3} md={3}>
                  <Typography variant="body1">{t("name")}</Typography>
                  <Typography variant="h5">{applicantName}</Typography>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <Typography variant="body1">{t("interviewlevel")}</Typography>
                  <Typography variant="h5">
                    {state.level}/{totalLevels}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <Typography variant="body1">
                    {t("typeofinterview")}
                  </Typography>
                  <Typography variant="h5">
                    {state.mode
                      ? t(
                          `${InterviewMode.getNameByValue(
                            parseInt(state.mode)
                          )}`
                        )
                      : "--"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <Typography variant="body1">{t("panelname")}</Typography>
                  <Typography variant="h5">{state.panelName}</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            //className={classes.threeColEqual}
            style={{ marginTop: 8 }}
          >
            <InputLabel className={classes.inputLabel}>
              {t("existingInterviewers")}
            </InputLabel>
            <ReactTags
              tags={values.users}
              suggestions={suggestions}
              inputProps={{ "aria-label": "bare" }}
              margin="dense"
              variant="outlined"
              fullWidth
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              autofocus={false}
              allowNew={false}
              placeholder={t("typenamehienter")}
              tagComponent={Tag}
              allowBackspace={false}
              inputAttributes={{ maxLength: 50 }}
              autoresize={false}
              classNames={{
                root: errors.users ? classes.tagsWrapErr : classes.tagsWrap,
                searchInput: classes.tagsInput,
                search: classes.searchInput,
                selectedTagName: classes.selectedTag,
                selected: classes.selectedTagWrap,
                suggestions: classes.dropDown,
                suggestionDisabled: classes.suggestion,
                suggestionActive: classes.activeSugg,
              }}
            />
          </Grid>
          {optionBtn && (
            <Grid
              container
              item
              spacing={3}
              className={classes.formContainer}
              style={{
                paddingTop: 0,
                marginTop: 0,
                justifyContent: "flex-end",
                paddingRight: 25,
              }}
            >
              <Button
                variant="contained"
                onClick={optionView}
                color="primary"
                className={classNames(classes.modalBtnInline)}
              >
                {t("addNewInterviewer")}
              </Button>
            </Grid>
          )}
          {option && (
            <Grid
              container
              item
              spacing={3}
              style={{ marginTop: -20 }}
              className={classes.formContainer}
            >
              <Grid item xs={4} className={classes.formContainer}>
                <InputLabel className={classes.inputLabel}>
                  {t("addNewInterviewer")}
                </InputLabel>
                <TextField
                  id="outlined-bare"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare" }}
                  placeholder={t("firstname")}
                  name="fname"
                  onChange={(event) =>
                    handleUserFieldChange("fname", event.target.value)
                  }
                  value={values.fname}
                  error={getMsg(errors.fname, t)}
                />
              </Grid>
              <Grid item xs={4} className={classes.subItem}>
                <TextField
                  id="outlined-bare"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare" }}
                  placeholder={t("lastname")}
                  name="lname"
                  onChange={(event) =>
                    handleUserFieldChange("lname", event.target.value)
                  }
                  value={values.lname}
                  error={getMsg(errors.lname, t)}
                />
              </Grid>
              <Grid item xs={4} className={classes.subItem}>
                <TextField
                  id="outlined-bare"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare" }}
                  placeholder="Email"
                  name="username"
                  onChange={(event) =>
                    handleUserFieldChange("username", event.target.value)
                  }
                  value={values.username}
                  error={getMsg(errors.username, t)}
                />
              </Grid>
              <Grid
                container
                item
                spacing={3}
                className={classes.formContainer}
                style={{
                  paddingTop: 0,
                  marginTop: 0,
                  justifyContent: "flex-end",
                  paddingRight: 25,
                }}
              >
                {loading ? (
                  <CircularProgress className={classes.progress} />
                ) : (
                  <Button
                    variant="contained"
                    onClick={buttonView}
                    color="primary"
                    className={classNames(classes.modalBtnInline)}
                  >
                    {t("submit")}
                  </Button>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} className={classes.modalFooter}>
          <Button
            onClick={props.onCancel}
            variant="contained"
            className={classes.modalBtnSecondary}
          >
            {t("cancel")}
          </Button>
          &nbsp;
          <Button
            onClick={handleSubmit}
            variant="contained"
            //color="secondary"
            className={classes.modalBtnPrimary}
          >
            {t("assign")}
          </Button>
        </Grid>
        <MessageBox
          open={success}
          variant="success"
          onClose={() => {
            setSuccess(false);
          }}
          message={t("succMsg.interviewerAssignedSuccessfully")}
        />
      </Box>
    </Box>
  );
};

const mapDispatchToProps = {
  addUser,
  getInterviewersByPanel,
  getInterviewersByApplicantId,
  saveApplicantInterviewers,
  deleteApplicantInterviewers,
};

const mapStateToProps = (state) => ({
  panelMembers: state.jobApplication && state.jobApplication.panelMembers,
  applicantInterviewers:
    state.jobApplication && state.jobApplication.applicantInterviewers,
  user: state.admin && state.admin.newuser,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AssignInterviewer))
);
