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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";

// Component styles
import styles from "../styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import {
  addPremiumAgency,
  attachPremiumAgency,
  addUserToExistingPremiumAgency,
  upgradeAgency,
  getOrgUsers,
} from "services/admin/action";

import { getAgencySuggestions } from "services/employer/action";
import { checkUser } from "services/admin/action";

import modalIcon from "assets/images/modal_ico_1.png";
import { Roles } from "util/enum";
import Autosuggest from "react-autosuggest";

const AddPremiumAgency = (props) => {
  const { classes, orgId, userId } = props;
  const initialUserState = {
    values: {
      organizationId: 0,
      companyName: "",
      addrLine1: "",
      addrLine2: "",
      city: "",
      state: " ",
      zip: "",
      contactNo1: "",
      contactNo2: "",
      fname: "",
      lname: "",
      username: "",
      status: 0,
      isPremium: 1,
      prevStatus: 0,
      showSuccess: false,
      successMsg: "",
    },

    errors: {
      companyName: null,
      addrLine1: null,
      addrLine2: null,
      city: null,
      state: null,
      zip: null,
      contactNo1: null,
      contactNo2: null,
      fname: null,
      lname: null,
      username: null,
    },
    isValid: false,
    loading: false,
    submitError: null,
  };
  const { t } = useTranslation("common");
  let [values, setValues] = useState(initialUserState.values);
  const [prevStatus, setprevStatus] = useState(null);
  const [errors, setErrors] = useState(initialUserState.errors);
  const [isEditing, setEditing] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showExistPopup, setShowExistPopup] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [selected, setSelected] = useState(null);

  const onChange = (event, { newValue, method }) => {
    handleFieldChange("companyName", newValue);
    props.getAgencySuggestions(newValue).then(async (res) => {
      if (res.data && res.data.length > 0) {
        setAgencies(res.data);
        setShowMsg(false);
      } else {
        setShowMsg(true);
      }
    });
  };
  const inputProps = {
    placeholder: t("companyname"),
    value: values["companyName"],
    onChange: onChange,
  };
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");

    return agencies.filter((c) => regex.test(c.name));
  }

  function getSuggestionValue(suggestion) {
    setSelected(suggestion.id);
    props.getOrgUsers(suggestion.id).then((res) => {
      const adminUser =
        res && res.filter((c) => c.roles[0].id === Roles.AgencyAdmin);
      const newState = { ...values };
      newState.organizationId = suggestion.id;
      newState.isPremium = suggestion.isPremium;
      newState.companyName = suggestion.name;
      newState.userId = adminUser && adminUser[0].id;
      newState.username = adminUser && adminUser[0].username;
      newState.fname = adminUser && adminUser[0].fname;
      newState.lname = adminUser && adminUser[0].lname;
      setValues(newState);
    });
    setShowAddUser(true);
    return suggestion.name;
  }

  function renderSuggestion(suggestion) {
    return <span>{suggestion.name}</span>;
  }

  useEffect(() => {
    //get user item from props
    if (props.location && props.location.data) {
      setEditing(true);
      let data = props.location.data;
      let org = data.organization;
      if (org) {
        data.orgId = org.id;
        data.companyName = org.name;
      }
      let user = data.user;
      if (user) {
        data.userId = user.id;
        data.fname = user.fname;
        data.lname = user.lname;
        data.username = user.username;
      }

      setValues(data);
      setprevStatus(data.status);
    }
  }, []);

  function handleFieldChange(field, value) {
    setValues({ ...values, [field]: value });
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

  function validateForm() {
    setShowPopup(false);
    let errors = validate(values, schema);
    setErrors(errors || {});
    let valid = errors ? false : true;
    return valid;
  }
  const handleSubmit = async () => {
    if (validateForm()) {
      if (!values.userId) {
        values.password = buildPassword();
      }
      values.empOrgId = orgId;
      values.status = 1;
      if (selected > 0) {
        if (values.isPremium === 1) {
          values.status = 3;
          setShowPopup(true);
        } else {
          values.status = 1;
          props
            .upgradeAgency({ id: values.organizationId, isPremium: 1 })
            .then((status) => {
              setShowPopup(true);
            });
        }
      } else {
        await props.addPremiumAgency(values).then((status) => {
          if (status) {
            setShowPopup(true);
          }
          // else if (status === "Email address already exists.") {}
          else {
            const res = props.checkUser(values.username, orgId);
            if (res) {
              // setShowExistPopup(true);
            }
          }
        });
      }
    }
  };

  const handleCancel = () => {
    setShowExistPopup(false);
  };

  const handleAttach = () => {
    props.attachPremiumAgency(orgId, values.username).then((status) => {
      if (status) {
        //add to existing list
      }
    });
    setShowExistPopup(false);
  };

  function handleConfirmation() {
    setShowPopup(false);
    props.onCancel();
    // props.history.push({
    //   pathname: "/rc/manage-agency",
    // });
  }

  function getMessage(id, status) {
    if (status === prevStatus) {
      if (id > 0) {
        return "The agency information is updated successfully.";
      }
      if (id === undefined || id === 0) {
        return "The agency has been successfully added to the platform.";
      }
    } else {
      if (id > 0 && status.toString() === "1") {
        return "The agency has been added to Hiring target premium network.";
      }
      if (id > 0 && status.toString() === "2") {
        return "The agency information is updated successfully.";
      }
      if (id > 0 && status.toString() === "3") {
        return t("succMsg.agencyAlreadyPremiumAlert");
      }
      if ((id === undefined || id === 0) && status.toString() === "1") {
        return t("succMsg.agencyInvitationMsg");
      }
      if ((id === undefined || id === 0) && status.toString() === "2") {
        return t("succMsg.agencyAddedSuccessfully");
      }
    }
  }

  return (
    <Box
      width={{ xs: "90%", sm: "90%", md: "600px" }}
      className={[classes.modalWrap]}
      style={{ overflow: "visible" }}
    >
      <AppBar
        position="static"
        color="default"
        align="center"
        style={{ borderRadius: "10px 10px 0 0" }}
      >
        <Toolbar className={classes.modalHeadWrap}>
          <Typography className={classes.modalHead} variant="h6">
            {t("common:addnewagency")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Divider className={classes.modalHeadHr} />

      <Box className={classes.modalContent}>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12}>
            <InputLabel className={classes.inputLabel}>
              {t("companyname")}
            </InputLabel>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              theme={{
                container: classes.reactAutosuggestContainer,
                input: errors.companyName
                  ? classes.reactAutosuggestInputErr
                  : classes.reactAutosuggestInput,
                inputOpen: classes.reactAutosuggestInputOpen,
                inputFocused: classes.reactAutosuggestInputFocused,
                suggestionsContainer:
                  classes.reactAutosuggestSuggestionsContainer,
                suggestionsContainerOpen:
                  classes.reactAutosuggestSuggestionsContainerOpen,
                suggestionsList: classes.reactAutosuggestSuggestionsList,
                suggestion: classes.reactAutosuggestSuggestion,
                suggestionHighlighted:
                  classes.reactAutosuggestSuggestionHighlighted,
              }}
            />
            {showMsg && !showAddUser && (
              <div>
                <Typography style={{ color: "red", padding: "10px 0" }}>
                  {t("common:agencydoesnotexists")}
                </Typography>
                <Button
                  onClick={() => {
                    setShowMsg(false);
                  }}
                  style={{ fontSize: "10px" }}
                  variant="contained"
                  size="small"
                  className={classes.modalBtnSecondary}
                >
                  {t("cancel")}
                </Button>{" "}
                &nbsp;
                <Button
                  onClick={() => {
                    setShowAddUser(true);
                  }}
                  style={{ fontSize: "10px" }}
                  variant="contained"
                  size="small"
                  color="primary"
                >
                  {t("yes")}
                </Button>
              </div>
            )}
            {/* <TextField
              id="outlined-bare"
              className={classes.textField}
              error={errors.companyName}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 85 }}
              placeholder="Company Name"
              onChange={(event) =>
                handleFieldChange("companyName", event.target.value)
              }
              value={values.companyName}
            /> */}
          </Grid>
        </Grid>
        {showAddUser && (
          <React.Fragment>
            <Grid container item spacing={3} className={classes.formContainer}>
              <Grid item xs={12}>
                <InputLabel className={classes.inputLabel}>
                  {" "}
                  {t("email")}
                </InputLabel>
                <TextField
                  id="outlined-bare"
                  className={classes.textField}
                  error={getMsg(errors.username, t)}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxlength: 85 }}
                  placeholder={t("email")}
                  onChange={(event) =>
                    handleFieldChange("username", event.target.value)
                  }
                  disabled={values.userId}
                  value={values.username}
                />
              </Grid>
            </Grid>
            <Grid container item spacing={3} className={classes.formContainer}>
              <Grid item xs={12} sm={6} md={4}>
                <InputLabel className={classes.inputLabel}>
                  {t("common:contactname")}
                </InputLabel>
                <TextField
                  error={getMsg(errors.fname, t)}
                  id="outlined-bare"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxlength: 80 }}
                  placeholder={t("firstname")}
                  onChange={(event) =>
                    handleFieldChange("fname", event.target.value)
                  }
                  disabled={values.userId}
                  value={values.fname}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} className={classes.subItem}>
                <TextField
                  error={getMsg(errors.lname, t)}
                  id="outlined-bare"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxlength: 80 }}
                  placeholder={t("lastname")}
                  onChange={(event) =>
                    handleFieldChange("lname", event.target.value)
                  }
                  disabled={values.userId}
                  value={values.lname}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        )}
        <Grid item xs={12} className={classes.modalFooter}>
          <Button
            onClick={props.onCancel}
            variant="contained"
            className={classes.modalBtnSecondary}
          >
            {t("cancel")}
          </Button>{" "}
          &nbsp;
          {showAddUser && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              //color="secondary"
              className={classes.modalBtnPrimary}
            >
              {values.userId ? "Upgrade" : "Save & Upgrade"}
            </Button>
          )}
        </Grid>
      </Box>
      <Dialog
        open={showPopup}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <div style={{ textAlign: "center", padding: "30px" }}>
                <img
                  alt="HR Matrix"
                  src={modalIcon}
                  Component=""
                  style={{ width: "60px" }}
                />
              </div>
              <Typography variant="h6">
                {getMessage(values.userId, values.status)}
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleConfirmation}
              className={classes.ctaButton}
            >
              {t("ok")}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showExistPopup}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <div style={{ textAlign: "center", padding: "30px" }}>
                <img
                  alt="HR Matrix"
                  src={modalIcon}
                  Component=""
                  style={{ width: "60px" }}
                />
              </div>
              <Typography variant="h6">{t("agencyAlreadyExists")}</Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              style={{ backgroundColor: "#bfbfbf" }}
              className={classes.button}
              onClick={() => handleCancel()}
            >
              {t("no")}
            </Button>
            &nbsp;
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleAttach()}
              className={classes.ctaButton}
            >
              {t("yes")}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const mapDispatchToProps = {
  addPremiumAgency,
  attachPremiumAgency,
  checkUser,
  addUserToExistingPremiumAgency,
  getAgencySuggestions,
  upgradeAgency,
  getOrgUsers,
};

const mapStateToProps = (state) => ({
  orgId: state.profile && state.profile.orgId,
  userId: state.profile && state.profile.id,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AddPremiumAgency))
);
