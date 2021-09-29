import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  withStyles,
  Grid,
  InputLabel,
  TextField,
  FormControl,
  FormLabel,
  OutlinedInput,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  CircularProgress,
  MenuItem,
} from "@material-ui/core";
import { connect } from "react-redux";

import { withRouter, Link } from "react-router-dom";
import { Dashboard as DashboardLayout } from "layouts";
import styles from "../../../JobPost/components/styles";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import { addRecruiter, loadRoles } from "services/admin/action";
//import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";
import MessageBox from "util/messageBox";
import modalIcon from "assets/images/modal_ico_1.png";

const AddNewRecruiter = (props) => {
  const { classes, roles, orgId, userId } = props;
  const initialUserState = {
    values: {
      fname: "",
      lname: "",
      username: "",
      roleId: 0,
      status: 0,
      showSuccess: false,
      successMsg: "",
      showErr: false,
      showErrMsg: "",
    },
    touched: {
      fname: false,
      lname: false,
      username: false,
      roleId: false,
    },
    errors: {
      fname: null,
      lname: null,
      username: null,
      roleId: null,
    },
    isValid: false,
    loading: false,
    submitError: null,
  };
  const { t } = useTranslation("common");
  let [values, setValues] = useState(initialUserState.values);
  const [isEditing, setEditing] = useState(false);
  const [touched, setTouched] = useState(initialUserState.touched);
  const [errors, setErrors] = useState(initialUserState.touched);
  const [loading, setLoading] = useState(false);
  const [isValid, setValid] = useState(false);
  let [submitError, setSubmitError] = useState(initialUserState);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    props.loadRoles();
    //get user item from props
    if (props.location && props.location.data) {
      setEditing(true);
      let data = props.location.data;
      data.roleId =
        (props.location.data.roles &&
          props.location.data.roles[0] &&
          props.location.data.roles[0].id) ||
        0;
      setValues(data);
    }
    // const userId =
    //   props.history.location &&
    //   props.history.location.state &&
    //   props.history.location.state.userId
    //     ? props.history.location.state.userId
    //     : 0;
    // if (userId) {
    //   props.getUserById(userId);
    // }
  }, []);

  function validateForm() {
    setShowPopup(false);
    const errors = validate(values, schema);
    setErrors(errors || {});
    let valid = errors ? false : true;
    setValid(valid);
    return valid;
  }

  const handleFieldChange = (field, value) => {
    setValues({ ...values, [field]: value });
    setTouched({ ...touched, [field]: true });
  };

  function buildPassword() {
    let a = "",
      b = "abcdefghijklmnopqrstuvwxyz1234567890",
      c = 10;
    for (let ma = 0; ma < c; ma++) {
      a += b[Math.floor(Math.random() * b.length)];
    }
    return a;
  }

  function handleAddRecruiter(async) {
    if (validateForm()) {
      if (!values.id) {
        values.password = buildPassword();
      }
      values.organizationId = orgId;
      values.status = values.status ? values.status : 2;
      props.addRecruiter(values).then((status) => {
        if (!status) {
          setValues({
            ...values,
            showErr: true,
            showErrMsg: "Email already exists!",
          });
        }
        let msg = "";
        if (values.id > 0) {
          msg = "User has been successfully updated";
        } else {
          msg = "New user has been successfully invited to the platform";
        }
        if (status) {
          showConfirmationMsg();
        } else {
        }
      });
    }
  }

  function handleMsgClose() {
    setValues({ ...values, showSuccess: false });
  }

  function handleErrMsgClose() {
    setValues({ ...values, showErr: false });
  }
  function showConfirmationMsg() {
    setShowPopup(true);
  }

  function handleConfirmation() {
    props.history.push({
      pathname: "/rc/manage-recruiter",
    });
  }

  function getMessage(id, status) {
    if (id > 0) {
      return t("recruiterUpdatedMsg");
    } else {
      return "The recruiter has been successfully added to the platform. An invitation has been sent to the recruiter with necessary instructions to activate the account.";
    }

    // if (id > 0 && status === 1) {
    //   return "The recruiter information is updated successfully. An invitation has been sent to the recruiter with necessary instructions to activate the account.";
    // }
    // if (id > 0 && status === 2) {
    //   return "The recruiter information is updated successfully.";
    // }
    // if ((id === undefined || id === 0) && status === 1) {
    //   return "The recruiter has been successfully added to the platform. An invitation has been sent to the recruiter with necessary instructions to activate the account.";
    // }
    // if ((id === undefined || id === 0) && status === 2) {
    //   return "The recruiter has been successfully added to the platform.";
    // }
  }

  return (
    <DashboardLayout title={t("dashboard")}>
      <Container className={classes.root}>
        <Grid container spacing={3}>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12}>
              <Typography variant="h1" className={classes.pageTitle}>
                {isEditing ? t("updateRecruiter") : t("addnNewRecruiter")}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel className={classes.inputLabel}>
                {t("firstname")}
              </InputLabel>
              <TextField
                error={getMsg(errors.fname, t)}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxLength: 32 }}
                placeholder={t("firstname")}
                name="fname"
                onChange={(event) =>
                  handleFieldChange("fname", event.target.value)
                }
                value={values.fname}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel className={classes.inputLabel}>
                {t("lastname")}
              </InputLabel>
              <TextField
                error={getMsg(errors.lname, t)}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxLength: 32 }}
                placeholder={t("lastname")}
                name="lname"
                onChange={(event) =>
                  handleFieldChange("lname", event.target.value)
                }
                value={values.lname}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel className={classes.inputLabel}>
                {t("emailaddress")}
              </InputLabel>
              <TextField
                error={getMsg(errors.username, t)}
                //disabled={values.id > 0}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxLength: 64 }}
                placeholder={t("emailaddress")}
                name="username"
                onChange={(event) =>
                  handleFieldChange("username", event.target.value)
                }
                value={values.username}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <FormLabel className={classes.formLabel}>
                  {t("common:role")}
                </FormLabel>
                <Select
                  error={getMsg(errors.roleId, t)}
                  value={values.roleId}
                  margin="dense"
                  input={<OutlinedInput labelWidth="0" name="role" id="role" />}
                  onChange={(event) =>
                    handleFieldChange("roleId", event.target.value)
                  }
                >
                  <MenuItem value="0"> {t("common:select")}</MenuItem>
                  {roles &&
                    roles.map((item, index) => {
                      return item.type === 2 ? (
                        <MenuItem key={index} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ) : null;
                    })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {values.isVerified === true && (
            <Grid container item spacing={3} className={classes.formContainer}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <FormLabel className={classes.formLabel}>Status</FormLabel>
                  <Select
                    disabled={values.id === userId}
                    error={getMsg(errors.status, t)}
                    value={values.status}
                    margin="dense"
                    input={
                      <OutlinedInput labelWidth="0" name="status" id="status" />
                    }
                    onChange={(event) =>
                      handleFieldChange("status", event.target.value)
                    }
                  >
                    <MenuItem value="0"> {t("common:select")}</MenuItem>
                    <MenuItem value={1}>{t("common:active")}</MenuItem>
                    <MenuItem value={2}>{t("common:inactive")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
          <Grid spacing={3} item container className={classes.buttonBar}>
            <Button
              variant="contained"
              className={classes.button}
              to="/rc/manage-recruiter"
              component={Link}
            >
              {t("cancel")}
            </Button>
            {loading ? (
              <CircularProgress className={classes.progress} />
            ) : (
              <Button
                className={classes.button}
                color="primary"
                onClick={handleAddRecruiter}
                size="large"
                variant="contained"
              >
                {t("save")}
              </Button>
            )}
          </Grid>
          <MessageBox
            open={values.showSuccess}
            variant="success"
            onClose={handleMsgClose}
            message={values.successMsg}
          />
          <MessageBox
            open={values.showErr}
            variant="error"
            onClose={handleErrMsgClose}
            message={values.showErrMsg}
          />
          &nbsp; <br />
          &nbsp; <br />
          &nbsp; <br />
          &nbsp; <br />
        </Grid>
      </Container>
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
                {getMessage(values.id, values.status)}
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
    </DashboardLayout>
  );
  //}
};
const mapDispatchToProps = {
  loadRoles,
  addRecruiter,
};

const mapStateToProps = (state) => ({
  roles: state.admin && state.admin.roles,
  orgId: state.profile && state.profile.orgId,
  userId: state.profile && state.profile.id,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AddNewRecruiter))
);
