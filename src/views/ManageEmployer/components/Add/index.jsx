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

import { loadStates, manageEmployer } from "services/admin/action";
import { updateEmployer } from "services/employer/action";
import validate from "validate.js";
import schema from "./schema";
import MessageBox from "util/messageBox";
import modalIcon from "assets/images/modal_ico_1.png";
const moment = require("moment");

const AddEmployer = (props) => {
  const { classes, orgId, states } = props;
  const { t } = useTranslation(["manageEmployer", "common"]);
  const initialEmployerState = {
    values: {
      id: 0,
      name: "",
      contactNo1: "",
      fax: "",
      email: "",
      addrId: 0,
      line1: "",
      line2: "",
      city: "",
      state: " ",
      country: t("currentCountryCode"),
      zip: "",
      trialPeriod: "",
      showSuccess: false,
      showError: false,
      errMsg: "",
    },
    errors: {
      name: null,
      contactNo1: null,
      fax: null,
      email: null,
      line1: null,
      line2: null,
      city: null,
      state: null,
      country: null,
      zip: null,
    },
    isValid: false,
    loading: false,
    submitError: null,
  };
  let [values, setValues] = useState(initialEmployerState.values);
  const [isEditing, setEditing] = useState(false);
  const [errors, setErrors] = useState(initialEmployerState.errors);
  const [loading, setLoading] = useState(false);
  const [isValid, setValid] = useState(false);
  let [isBlocking, setIsBlocking] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errMsg, setErrMsg] = useState(false);

  useEffect(() => {
    props.loadStates();
  }, []);

  useEffect(() => {
    /**get user item from props */
    let orgDetails, addrDetails;
    if (props.location && props.location.data) {
      orgDetails = props.location.data;
      var createdDate = moment(orgDetails.createdAt, "YYYY-MM-DD");
      var endDate = orgDetails.stripeTrialEndDate
        ? moment(orgDetails.stripeTrialEndDate, "YYYY-MM-DD")
        : null;
      orgDetails.trialPeriod = endDate
        ? endDate.diff(createdDate, t("common:days")) + 1
        : null;
      setValues(orgDetails);

      if (
        props.location.data.addresses &&
        props.location.data.addresses.length > 0
      ) {
        addrDetails = props.location.data.addresses[0];
        let addrId = addrDetails.id;
        let newstate = Object.assign(addrDetails, orgDetails);
        newstate.addrId = addrId;
        setValues(newstate);
      }
    }
  }, []);

  function validateForm() {
    const errors = validate(values, schema);

    if (errors && errors.fax && values.fax) {
      let reg = /[\+? *[1-9]+]?[0-9 ]+/;
      if (!reg.test(values.fax)) {
        setErrMsg("Invalid fax");
      }
      setErrors(errors || {});
      return false;
    }
    if (errors && errors.contactNo1 && values.contactNo1) {
      const msg = t("invalidphone");
      let reg = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
      if (!reg.test(values.contactNo1)) {
        setErrMsg(msg);
      }
      setErrors(errors || {});
      return false;
    }

    if (errors && errors.zip && values.zip) {
      let reg = /^\d{5}$/;
      if (!reg.test(values.zip)) {
        setErrMsg("Invalid zip code");
      }
      setErrors(errors || {});
      return false;
    }
    setErrMsg(false);
    setErrors(errors || {});
    let valid = errors ? false : true;
    setValid(valid);
    if (!valid) {
      setValues({
        ...values,
        showError: true,
        showSuccess: false,
        errMsg: t("common:errMsg.fillReqInfo"),
      });
    }

    return valid;
  }

  const handleFieldChange = (field, value) => {
    const newState = { ...values };
    const re = /^[0-9\b]+$/;
    const contactRe = /^[+?0-9\b]+$/;
    if (field === "trialPeriod" && value && !re.test(value)) {
      value = newState[field] || "";
    }
    if (
      (field === "contactNo1" || field === "fax") &&
      value &&
      !contactRe.test(value)
    ) {
      value = newState[field] || "";
    }
    setValues({ ...values, [field]: value });
    if (value) {
      setIsBlocking(true);
    }
  };

  function handleUpdateEmployer(c) {
    if (validateForm()) {
      setLoading(true);
      props.manageEmployer(values).then((res) => {
        if (res) {
          showConfirmationMsg();
        } else {
        }
      });
    }
  }

  function handleMsgClose() {
    setValues({ ...values, showSuccess: false });
  }

  function showConfirmationMsg() {
    setShowPopup(true);
  }

  function handleConfirmation() {
    props.history.push({
      pathname: "/rc/manage-employer",
    });
  }

  return (
    <DashboardLayout title={t("common:dashboard")}>
      <Container className={classes.root}>
        <Grid container spacing={3}>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12}>
              <Typography variant="h1" className={classes.pageTitle}>
                {isEditing ? t("updateEmployer") : t("addNewEmployer")}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} md={8}>
              <InputLabel className={classes.inputLabel}>
                {t("companyName")}
              </InputLabel>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 85 }}
                placeholder={t("companyName")}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
                value={values.name || ""}
                error={getMsg(errors.name, t)}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel className={classes.inputLabel}>
                {t("common:corporateAddress")}
              </InputLabel>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 80 }}
                placeholder={t("common:addressLineOne")}
                onChange={(event) =>
                  handleFieldChange("line1", event.target.value)
                }
                value={values.line1 || ""}
                error={getMsg(errors.line1, t)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.subItem}>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 80 }}
                placeholder={t("common:addressLineTwo")}
                onChange={(event) =>
                  handleFieldChange("line2", event.target.value)
                }
                value={values.line2 || ""}
                error={getMsg(errors.line2, t)}
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
            <Grid item xs={12} sm={6} md={4} style={{ marginTop: 8 }}>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  id="outlined-bare"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxlength: 50 }}
                  placeholder={t("common:city")}
                  onChange={(event) =>
                    handleFieldChange("city", event.target.value)
                  }
                  value={values.city || ""}
                  error={getMsg(errors.city, t)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{ marginTop: 8 }}>
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  style={{ marginTop: 7 }}
                  margin="dense"
                  input={<OutlinedInput labelWidth="0" name="role" id="role" />}
                  onChange={(event) =>
                    handleFieldChange("state", event.target.value)
                  }
                  value={values.state || " "}
                  error={getMsg(errors.state, t)}
                >
                  <MenuItem value=" ">{t("common:state")}</MenuItem>
                  {states &&
                    states.map((item, index) => (
                      <MenuItem key={index} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            item
            spacing={3}
            className={classes.formContainer}
            style={{ paddingTop: 0, marginTop: -20 }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 5 }}
                placeholder={t("common:zip")}
                onChange={(event) =>
                  handleFieldChange("zip", event.target.value)
                }
                value={values.zip || ""}
                error={getMsg(errors.zip, t)}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel className={classes.inputLabel}>
                {t("common:contactNumber")}
              </InputLabel>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 12 }}
                placeholder={t("common:contactNumber")}
                onChange={(event) =>
                  handleFieldChange("contactNo1", event.target.value)
                }
                value={values.contactNo1 || ""}
                error={getMsg(errors.contactNo1, t)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.subItem}>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 12 }}
                placeholder={t("common:fax")}
                onChange={(event) =>
                  handleFieldChange("fax", event.target.value)
                }
                value={values.fax || ""}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={8}>
              <InputLabel className={classes.inputLabel}>
                {t("common:email")}
              </InputLabel>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 45 }}
                placeholder={t("common:email")}
                onChange={(event) =>
                  handleFieldChange("email", event.target.value)
                }
                value={values.email || ""}
                error={getMsg(errors.email, t)}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <FormLabel className={classes.formLabel}>
                  {t("status")}
                </FormLabel>
                <Select
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
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel className={classes.inputLabel}>
                {t("trialPeriod")}
              </InputLabel>
              <TextField
                error={getMsg(errors.trialPeriod, t)}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxLength: 64 }}
                placeholder={t("trialPeriod")}
                name="trialPeriod"
                onChange={(event) =>
                  handleFieldChange("trialPeriod", event.target.value)
                }
                value={values.trialPeriod}
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            spacing={3}
            className={classes.formContainer}
          ></Grid>
          <Grid spacing={3} item container className={classes.buttonBar}>
            <Button
              variant="contained"
              className={classes.button}
              to="/rc/manage-employer"
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
                onClick={handleUpdateEmployer}
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
              <Typography variant="h6">{t("updatedMsg")}</Typography>
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
              {t("common:ok")}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
  //}
};
const mapDispatchToProps = {
  loadStates,
  manageEmployer,
  updateEmployer,
};

const mapStateToProps = (state) => ({
  roles: state.admin && state.admin.roles,
  orgId: state.profile && state.profile.orgId,
  userId: state.profile && state.profile.id,
  states: state.admin && state.admin.states,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddEmployer))
);
