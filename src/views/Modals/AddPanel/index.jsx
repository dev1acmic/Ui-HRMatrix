import React, { useState, useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";

// Material helpers
import { withStyles } from "@material-ui/core";
import classNames from "classnames";
// Material components
//import { Add, Edit, Delete } from "@material-ui/icons";
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
  CircularProgress,
  Chip,
} from "@material-ui/core";

// Component styles
import styles from "../styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";
import userschema from "./schema_user";
import ReactTags from "react-tag-autocomplete";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import { addUser } from "services/admin/action";
// validate.validators.array = (arrayItems, itemConstraints) => {
//   const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
//     const error = validate(item, itemConstraints);
//     if (error) errors[index] = { error: error };
//     return errors;
//   }, {});

//   return arrayItemErrors.length === 0 ? null : arrayItemErrors;
// };

const AddPanel = (props) => {
  const { classes, organizationId, user } = props;
  const { t } = useTranslation("common");
  let { panelMembers } = props;

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
    suggestions: panelMembers.map((t) => ({
      id: t.id,
      name: t.fname + " " + t.lname,
    })),
  };
  let [values, setValues] = useState(panel.values);
  let [newuser, setNewuser] = useState(panel.newuser);
  const [loading, setLoading] = useState(false);
  const [, setValid] = useState(false);
  const [errors, setErrors] = useState(panel.errors);
  const [suggestions, setSuggestions] = useState(panel.suggestions);
  const [option, setOption] = useState(false);
  const [optionBtn, setOptionBtn] = useState(true);

  function handleFieldChange(field, value) {
    setValues({ ...values, [field]: value });
  }

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

  useEffect(() => {
    if (user) {
      // setNewuser(props.newuser);

      panelMembers = Object.assign(panelMembers, user);
      console.log(panelMembers);
      handleAddition(user[0]);
    }
  }, [user]);

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

      //  return () => clearTimeout(timer);
    }
  }

  function validateUserForm() {
    let errors = validate(newuser, userschema);

    setErrors(errors || {});
    let valid = errors ? false : true;
    setValid(valid);
    return valid;
  }

  function handleUserFieldChange(field, value) {
    setNewuser({ ...newuser, [field]: value });
  }

  function validateForm() {
    let errors = validate(values, schema);
    // if (!errors && (!values.users || values.users.length === 0)) {
    //   if (!errors) {
    //     errors = {};
    //   }
    //   errors.users = ["Panel members is required"];
    // }
    setErrors(errors || {});
    let valid = errors ? false : true;
    setValid(valid);
    return valid;
  }

  function handleSubmit() {
    if (validateForm()) {
      // setLoading(true);
      let data = values;
      props.savePanelMembers(data);
    }
  }

  function handleDelete(i) {
    const user = values.users[i];
    let tag = {};
    tag.id = user.id;
    tag.name = user.fname + " " + user.lname;

    const users = values.users.slice(0);
    users.splice(i, 1);
    setValues({ ...values, users: users });

    //suggestions = suggestions.concat(user);
    setSuggestions(suggestions.concat(tag));
  }

  const handleAddition = (tag) => {
    const uname = panelMembers.find((u) => u.id === tag.id);
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
  // let [values, setValues] = useState(initialFirmState.values);
  useEffect(() => {
    if (props.item) {
      setValues(props.item);
      if (props.item.users && props.item.users.length > 0) {
        const tags = suggestions.filter(function (val) {
          return props.item.users.findIndex((c) => c.id === val.id) === -1;
        });
        setSuggestions(tags);
      }
    }
  }, []);

  return (
    <Box
      width={{ xs: "90%", sm: "90%", md: "600px" }}
      className={classes.modalWrap}
    >
      <AppBar position="static" color="default" align="center">
        <Toolbar className={classes.modalHeadWrap}>
          <Typography className={classes.modalHead} variant="h6">
            {t("addNewIntrwPanel")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Divider className={classes.modalHeadHr} />

      <Box className={classes.modalContent}>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12}>
            <InputLabel className={classes.inputLabel}>
              {t("panelname")}
            </InputLabel>
            <TextField
              id="outlined-bare"
              className={classes.textField}
              error={getMsg(errors.name, t)}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 85 }}
              placeholder={t("interviewPanel")}
              onChange={(event) =>
                handleFieldChange("name", event.target.value)
              }
              value={values.name || ""}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          spacing={3}
          className={classes.formContainer}
          style={{ paddingTop: 0, marginTop: -20 }}
        >
          <Grid
            item
            xs={12}
            //className={classes.threeColEqual}
            style={{ marginTop: 8 }}
          >
            <InputLabel
              style={{ marginBottom: 8 }}
              className={classes.inputLabel}
            >
              {t("interviewers")}
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
              //handleValidate={this.handleValidate}
              //handleFocus={this.handleFocus}
              //handleBlur={this.handleBlur}
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
          {optionBtn ? (
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
          ) : null}
          {option ? (
            <Grid container item spacing={3} className={classes.formContainer}>
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
                  placeholder={t("email")}
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
          ) : null}
        </Grid>
        <Grid item xs={12} className={classes.modalFooter}>
          <Button
            onClick={props.onCancel}
            variant="contained"
            className={classes.modalBtnSecondary}
          >
            {t("cancel")}
          </Button>{" "}
          &nbsp;
          <Button
            onClick={handleSubmit}
            variant="contained"
            //color="secondary"
            className={classes.modalBtnPrimary}
          >
            {t("save")}
          </Button>
        </Grid>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = {
  addUser,
};

const mapStateToProps = (state) => ({
  user: state.admin && state.admin.newuser,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddPanel))
);
