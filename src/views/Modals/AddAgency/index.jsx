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
import share from "common/share";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import {
  addAgency,
  attachAgency,
  addUserToExistingAgency,
  checkUser,
  isUserExist,
} from "services/admin/action";

import {
  getAgencySuggestions,
  getUserSuggestionsByAgency,
} from "services/employer/action";
import { getUserById } from "services/user/action";

import modalIcon from "assets/images/modal_ico_1.png";
import { Roles } from "util/enum";
import Autosuggest from "react-autosuggest";

const AddAgency = (props) => {
  const { classes, orgId, userId } = props;
  const initialUserState = {
    values: {
      companyName: "",
      fname: "",
      lname: "",
      username: "",
      status: 0,
    },

    errors: {
      companyName: null,
      fname: null,
      lname: null,
      username: null,
    },
  };
  const { t } = useTranslation("common");
  let [values, setValues] = useState(initialUserState.values);
  // const [prevStatus, setprevStatus] = useState(null);
  const [errors, setErrors] = useState(initialUserState.errors);
  const [isEditing, setEditing] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showExistPopup, setShowExistPopup] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);

  const [errMsg, setErrMsg] = useState(false);

  const [selected, setSelected] = useState(null);
  const [selecteduser, setSelecteduser] = useState(null);

  const [disableField, setDisableField] = useState(false);

  function handleClose() {
    setErrMsg(false);
  }
  // autosuggest agency
  const onChange = (event, { newValue, method }) => {
    handleFieldChange("companyName", newValue);
    let res;
    try {
      res = props.getAgencySuggestions(newValue).then(async (res) => {
        if (res && res.data.length > 0) {
          setShowMsg(false);
        } else {
          setShowMsg(true);
        }
      });
    } catch (e) {
      setShowMsg(true);
    }
  };

  const onBlur = (event, { newValue, method }) => {
    const v =
      values.companyName &&
      share.escapeRegexCharacters(values.companyName.trim());
    if (v && v.length > 0) {
      props.getAgencySuggestions(values.companyName).then(async (res) => {
        if (res && res.data.length > 0) {
          setShowMsg(false);
          // if (res.data.filter(c => c.name === values.companyName).length > 0) {
          //   setShowMsg(false);
          // } else {
          //   setShowMsg(true);
          // }
        } else {
          setShowMsg(true);
          setSelected(null);
        }
      });
    }
  };

  const inputProps = {
    placeholder: t("companyname"),
    value: values["companyName"],
    onChange: onChange,
    onBlur: onBlur,
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    const newValue = value && share.escapeRegexCharacters(value.trim());
    props.getAgencySuggestions(newValue).then(async (res) => {
      if (res && res.data.length > 0) {
        setSuggestions(getSuggestions(value, res.data));
        setShowMsg(false);
      } else {
        setSuggestions(getSuggestions(value, []));
        setShowMsg(true);
      }
    });
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  function getSuggestions(value, agList) {
    const escapedValue = value && share.escapeRegexCharacters(value.trim());
    const inputLength = escapedValue.length;
    if (inputLength === 0 || escapedValue === "") {
      return [];
    }
    // if (escapedValue === '') {
    //   return [];
    // }

    const regex = new RegExp("^" + escapedValue, "i");

    return (
      agList && agList.length > 0 && agList.filter((c) => regex.test(c.name))
    );
  }

  function getSuggestionValue(suggestion) {
    setSelected(suggestion.id);
    setShowAddUser(true);
    return suggestion.name;
  }

  function renderSuggestion(suggestion) {
    return <span>{suggestion.name}</span>;
  }

  // autosuggest user

  const onUserChange = (event, { newValue, method }) => {
    handleFieldChange("username", newValue);

    const oid = selected ? selected : values.recOrgId;
    if (oid && oid > 0) {
      props.getUserSuggestionsByAgency(newValue, oid).then(async (res) => {
        if (res && res.data.length > 0) {
          // setUsers(getUserSuggestions(newValue, res.data));
        } else {
          // setUsers(getUserSuggestions(newValue, []));
        }
      });
    }
  };

  const onUserBlur = (event, { newValue, method }) => {
    const v =
      values.username && share.escapeRegexCharacters(values.username.trim());
    if (v && v.length > 0) {
      const oid = selected ? selected : values.recOrgId;
      if (oid && oid > 0) {
        props
          .getUserSuggestionsByAgency(values.username, oid)
          .then(async (res) => {
            if (res && res.data.length > 0) {
              // setUsers(getUserSuggestions(newValue, res.data));
            } else {
              setValues({
                ...values,
                fname: "",
                lname: "",
                userId: 0,
              });
              setDisableField(false);
              // setUsers(getUserSuggestions(newValue, []));
            }
          });
      }
    }
  };

  const inputUserProps = {
    placeholder: t("email"),
    value: values["username"],
    onChange: onUserChange,
    onBlur: onUserBlur,
  };

  const onUserSuggestionsFetchRequested = ({ value }) => {
    const newValue = value && share.escapeRegexCharacters(value.trim());
    const oid = selected ? selected : values.recOrgId;
    if (oid && oid > 0) {
      props.getUserSuggestionsByAgency(newValue, oid).then(async (res) => {
        if (res && res.data.length > 0) {
          setUsers(getUserSuggestions(value, res.data));
        } else {
          setUsers(getUserSuggestions(value, []));
        }
      });
    }
  };

  const onUserSuggestionsClearRequested = () => {
    setUsers([]);
  };

  function getUserSuggestions(value, userList) {
    const escapedValue = value && share.escapeRegexCharacters(value.trim());
    const inputLength = escapedValue.length;
    if (inputLength === 0 || escapedValue === "") {
      return [];
    }
    // if (escapedValue === '') {
    //   return [];
    // }

    const regex = new RegExp("^" + escapedValue, "i");

    return (
      userList &&
      userList.length > 0 &&
      userList.filter((c) => regex.test(c.email))
    );
  }

  function getUserSuggestionValue(users) {
    setSelecteduser(users);
    return users.email;
  }

  useEffect(() => {
    if (selecteduser) {
      setValues({
        ...values,
        fname: selecteduser.fname,
        lname: selecteduser.lname,
        userId: selecteduser.id,
      });

      setDisableField(true);
    }
  }, [selecteduser]);

  function renderUserSuggestion(users) {
    return <span>{users.email}</span>;
  }

  useEffect(() => {
    if (!props.item || props.item === null) {
      setValues(initialUserState.values);
      setShowAddUser(false);
      setEditing(false);
    } else {
      let data = props.item;
      let org = data.organization;
      if (org) {
        data.recOrgId = org.id;
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
      setShowAddUser(true);
      setEditing(true);
    }
  }, [props.item]);

  // useEffect(() => {
  //   //get user item from props
  //   if (props.location && props.location.data) {
  //     setEditing(true);
  //     let data = props.location.data;
  //     let org = data.organization;
  //     if (org) {
  //       data.orgId = org.id;
  //       data.companyName = org.name;
  //       // let address = org.addresses && org.addresses[0];
  //       // if (address) {
  //       //   data.addressId = address.id;
  //       //   data.addrLine1 = address.line1;
  //       //   data.addrLine2 = address.line2;
  //       //   data.city = address.city;
  //       //   data.state = address.state;
  //       //   data.zip = address.zip;
  //       // }
  //       // data.contactNo1 = org.contactNo1;
  //       // data.contactNo2 = org.contactNo2;
  //     }
  //     let user = data.user;
  //     if (user) {
  //       data.userId = user.id;
  //       data.fname = user.fname;
  //       data.lname = user.lname;
  //       data.username = user.username;
  //     }

  //     setValues(data);
  //     // setprevStatus(data.status);
  //     // setValues({ values:prevStatus: data.status });
  //   }
  // }, []);

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
      let user = await props.getUserById(values.username);
      values.userId = user ? user.id : 0;
      values.empOrgId = orgId;
      values.recOrgId = selected ? selected : values.recOrgId;
      if (values.userId > 0) {
        let verifyUserDuplication = await props.isUserExist(
          values.userId,
          values.recOrgId
        );

        if (verifyUserDuplication) {
          setShowPopup(true);
          setShowExistPopup(true);
          setErrMsg(
            "The agency cannot be added to your preferred list. The user is already attached to a different agency. Please verify the agency name and emailId"
          );
          return false;
        }
      }

      if (!values.userId) {
        values.password = buildPassword();
      }

      const status = await props.addAgency(values);
      if (status) {
        let msg;
        if (user) {
          msg = user.isVerified
            ? "Agency has been added to your preferred list. The recruiter will start receiving the jobs as and when you start posting it."
            : "Agency has been added to your preferred list. An invitation to activate the account has been sent to the user.";
        } else {
          msg = t("agencyUpdated");
        }

        setErrMsg(msg);
        setShowPopup(true);
        setShowExistPopup(false);
      }

      // if (values.userId) {
      //   //edit data
      //   const status = await props.addAgency(values);
      //   if (status) {
      //     setShowPopup(true);
      //   }
      // } else {
      //   const status = await props.addAgency(values);
      //   if (status) {
      //     setShowPopup(true);
      //   } else {
      //     const res = await props.checkUser(values.username, orgId);
      //     if (res) {
      //       setShowExistPopup(true);
      //     }
      //   }
      // }

      // else if (selected > 0) {
      //   //if organization is selected
      //   const res = await props.checkUser(values.username, selected);
      //   if (res) {
      //     props.attachAgency(orgId, values.username).then((status) => {
      //       if (status) {
      //         setShowPopup(true);
      //         //add to existing list
      //       }
      //     });
      //   } //add new user
      //   else {
      //     const user = {
      //       fname: values.fname,
      //       lname: values.lname,
      //       username: values.username,
      //       password: values.password,
      //       organizationId: selected,
      //     };
      //     const status = props.addUserToExistingAgency(user, orgId);
      //     if (status) {
      //       setShowPopup(true);
      //     }
      //   }
      // }
    }
  };

  const handleCancel = () => {
    setShowExistPopup(false);
  };

  const handleAttach = () => {
    props.attachAgency(orgId, values.username).then((status) => {
      if (status) {
        //add to existing list
      }
    });
    setShowExistPopup(false);
  };

  const handleConfirmation = () => {
    setShowPopup(false);
    if (!showExistPopup) {
      // retain add agency modal for taking next action, if the user has been attached to another agency alert
      props.onCancel();
      props.refreshList();
    }
    // props.history.push({
    //   pathname: "/rc/manage-agency",
    // });
  };

  function getMessage(id, status) {
    // if (status) {
    //   if (id > 0) {
    //     return "The agency information is updated successfully.";
    //   }
    //   if (id === undefined || id === 0) {
    //     return "The agency has been successfully added to the platform.";
    //   }
    // } else {
    //   if (id > 0 && status.toString() === "1") {
    //     return "The agency information is updated successfully. An invitation has been sent to the agency with necessary instructions to activate the account.";
    //   }
    //   if (id > 0 && status.toString() === "2") {
    //     return "The agency information is updated successfully.";
    //   }
    //   if ((id === undefined || id === 0) && status.toString() === "1") {
    //     return "The agency has been successfully added to the platform. An invitation has been sent to the agency with necessary instructions to activate the account.";
    //   }
    //   if ((id === undefined || id === 0) && status.toString() === "2") {
    //     return "The agency has been successfully added to the platform.";
    //   }
    // }
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
            {t("addAgency")}
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
                  {t("common:errMsg.agencydoesnotexists")}
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
                  {t("email")}
                </InputLabel>
                <Autosuggest
                  suggestions={users}
                  onSuggestionsFetchRequested={onUserSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onUserSuggestionsClearRequested}
                  getSuggestionValue={getUserSuggestionValue}
                  renderSuggestion={renderUserSuggestion}
                  inputProps={inputUserProps}
                  theme={{
                    container: classes.reactAutosuggestContainer,
                    input: errors.username
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
                {/* <TextField
                  id="outlined-bare"
                  className={classes.textField}
                  error={errors.username}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxlength: 85 }}
                  placeholder="Email"
                  onChange={(event) =>
                    handleFieldChange("username", event.target.value)
                  }
                  value={values.username}
                /> */}
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
                  disabled={disableField}
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
                  disabled={disableField}
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
              {isEditing ? t("update") : t("save")}
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
              <Typography variant="h6">{errMsg}</Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                handleConfirmation();
              }}
              className={classes.ctaButton}
            >
              {t("ok")}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const mapDispatchToProps = {
  addAgency,
  attachAgency,
  checkUser,
  addUserToExistingAgency,
  getAgencySuggestions,
  getUserSuggestionsByAgency,
  getUserById,
  isUserExist,
};

const mapStateToProps = (state) => ({
  orgId: state.profile && state.profile.orgId,
  userId: state.profile && state.profile.id,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddAgency))
);
