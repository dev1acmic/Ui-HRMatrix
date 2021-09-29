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
  MenuItem
} from "@material-ui/core";
import { connect } from "react-redux";

import { withRouter, Link } from "react-router-dom";
import { Dashboard as DashboardLayout } from "layouts";
import styles from "../../../JobPost/components/styles";
import { addRecruiter, loadStates } from "services/admin/action";
//import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";
import MessageBox from "util/messageBox";
import modalIcon from "assets/images/modal_ico_1.png";

const AddRecruiter = props => {
  const { classes, states, orgId, userId } = props;
  const initialUserState = {
    values: {
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
      prevStatus: 0,
      showSuccess: false,
      successMsg: ""
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
      username: null
    },
    isValid: false,
    loading: false,
    submitError: null
  };

  let [values, setValues] = useState(initialUserState.values);
  const [prevStatus, setprevStatus] = useState(null);
  const [errors, setErrors] = useState(initialUserState.errors);
  const [loading, setLoading] = useState(false);
  const [isValid, setValid] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    props.loadStates();
    //get user item from props
    if (props.location && props.location.data) {
      setEditing(true);
      let data = props.location.data;
      let org = data.organization;
      if (org) {
        data.orgId = org.id;
        data.companyName = org.name;
        let address = org.addresses && org.addresses[0];
        if (address) {
          data.addressId = address.id;
          data.addrLine1 = address.line1;
          data.addrLine2 = address.line2;
          data.city = address.city;
          data.state = address.state;
          data.zip = address.zip;
        }
        data.contactNo1 = org.contactNo1;
        data.contactNo2 = org.contactNo2;
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
      console.log(values);
      // setValues({ values:prevStatus: data.status });
    }
  }, []);

  function validateForm() {
    setShowPopup(false);
    let errors = validate(values, schema);
    if (values.contactNo2) {
      let reg = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
      if (!reg.test(values.contactNo2)) {
        if (!errors) {
          errors = {};
        }
        errors.contactNo2 = [""];
        setErrMsg("Invalid phone number");
      }
      if (errors && errors.contactNo1 && values.contactNo1) {
        let reg = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
        if (!reg.test(values.contactNo1)) {
          setErrMsg("Invalid phone number");
        }
      }

      if (errors && errors.zip && values.zip) {
        let reg = /^\d{5}$/;
        if (!reg.test(values.zip)) {
          setErrMsg("Invalid zip code");
        }
      }
    }
    setErrors(errors || {});
    let valid = errors ? false : true;
    setValid(valid);
    return valid;
  }

  function handleClose() {
    setErrMsg(false);
  }

  const handleFieldChange = (field, value) => {
    const newState = { ...values };
    const re = /^[+?0-9\b]+$/;

    if (field === "contactNo1" || field === "contactNo2") {
      if (value && !re.test(value)) {
        value = newState[field] || "";
      }
      // else if (!value.startsWith("+1")) {
      //   value = "+1" + value;
      // } else if (value.length === 2 && value.startsWith("+")) {
      //   value = "";
      // }
    }

    setValues({ ...values, [field]: value });
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
      if (!values.userId) {
        values.password = buildPassword();
      }
      values.empOrgId = orgId;
      props.addRecruiter(values).then(status => {
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

  function showConfirmationMsg() {
    setShowPopup(true);
  }

  function handleConfirmation() {
    props.history.push({
      pathname: "/rc/manage-recruiter"
    });
  }

  function getMessage(id, status) {
    if (status === prevStatus) {
      if (id > 0) {
        return "The user information is updated successfully.";
      }
      if (id === undefined || id === 0) {
        return "The user has been successfully added to the platform.";
      }
    } else {
      if (id > 0 && status.toString() === "1") {
        return "The user information is updated successfully. An invitation has been sent to the user with necessary instructions to activate the account.";
      }
      if (id > 0 && status.toString() === "2") {
        return "The user information is updated successfully.";
      }
      if ((id === undefined || id === 0) && status.toString() === "1") {
        return "The user has been successfully added to the platform. An invitation has been sent to the user with necessary instructions to activate the account.";
      }
      if ((id === undefined || id === 0) && status.toString() === "2") {
        return "The user has been successfully added to the platform.";
      }
    }
  }

  return (
    <DashboardLayout title="Dashboard">
      <Container className={classes.root}>
        <Grid container spacing={3}>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12}>
              <Typography variant="h1" className={classes.pageTitle}>
                {isEditing ? "Update Recruiter" : "Add New Recruiter"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} md={8}>
              <InputLabel className={classes.inputLabel}>
                Company Name
              </InputLabel>
              <TextField
                error={errors.companyName}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 85 }}
                placeholder="Company Name"
                onChange={event =>
                  handleFieldChange("companyName", event.target.value)
                }
                value={values.companyName}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel className={classes.inputLabel}>Address</InputLabel>
              <TextField
                error={errors.addrLine1}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 80 }}
                placeholder="Address line 1"
                onChange={event =>
                  handleFieldChange("addrLine1", event.target.value)
                }
                value={values.addrLine1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.subItem}>
              <TextField
                error={errors.addrLine2}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 80 }}
                placeholder="Address line 2"
                onChange={event =>
                  handleFieldChange("addrLine2", event.target.value)
                }
                value={values.addrLine2}
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
              sm={4}
              md={3}
              //className={classes.threeColEqual}
              style={{ marginTop: 8 }}
            >
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  error={errors.city}
                  id="outlined-bare"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxlength: 50 }}
                  placeholder="City"
                  onChange={event =>
                    handleFieldChange("city", event.target.value)
                  }
                  value={values.city}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              //className={classes.threeColEqual}
              style={{ marginTop: 8 }}
            >
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  style={{ marginTop: 8 }}
                  margin="dense"
                  input={<OutlinedInput labelWidth="0" name="role" id="role" />}
                  onChange={event =>
                    handleFieldChange("state", event.target.value)
                  }
                  value={values.state}
                  error={errors.state}
                >
                  <MenuItem value=" ">State</MenuItem>
                  {states &&
                    states.map((item, index) => (
                      <MenuItem key={index} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <TextField
                error={errors.zip}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 5 }}
                placeholder="Zip"
                onChange={event => handleFieldChange("zip", event.target.value)}
                value={values.zip}
                style={{ marginTop: 15 }}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel className={classes.inputLabel}>
                Contact Number
              </InputLabel>
              <TextField
                error={errors.contactNo1}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 12 }}
                placeholder="Primary #"
                onChange={event =>
                  handleFieldChange("contactNo1", event.target.value)
                }
                value={values.contactNo1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.subItem}>
              <TextField
                error={errors.contactNo2}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 12 }}
                placeholder="Secondary #"
                onChange={event =>
                  handleFieldChange("contactNo2", event.target.value)
                }
                value={values.contactNo2}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel className={classes.inputLabel}>
                Contact Name
              </InputLabel>
              <TextField
                error={errors.fname}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 80 }}
                placeholder="First Name"
                onChange={event =>
                  handleFieldChange("fname", event.target.value)
                }
                value={values.fname}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.subItem}>
              <TextField
                error={errors.lname}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 80 }}
                placeholder="Last Name"
                onChange={event =>
                  handleFieldChange("lname", event.target.value)
                }
                value={values.lname}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={6} md={6}>
              <InputLabel className={classes.inputLabel}>Email</InputLabel>
              <TextField
                error={errors.username}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 80 }}
                placeholder="Email"
                onChange={event =>
                  handleFieldChange("username", event.target.value)
                }
                value={values.username}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl variant="outlined" className={classes.formControl}>
                <FormLabel className={classes.formLabel}>Status</FormLabel>
                <Select
                  disabled={values.userId === userId}
                  error={errors.status}
                  margin="dense"
                  input={
                    <OutlinedInput labelWidth="0" name="status" id="status" />
                  }
                  onChange={event =>
                    handleFieldChange("status", event.target.value)
                  }
                  value={values.status}
                >
                  <MenuItem value="0">Select</MenuItem>
                  <MenuItem value="1">Active</MenuItem>
                  <MenuItem value="2">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid spacing={3} item container className={classes.buttonBar}>
            <Button
              variant="contained"
              className={classes.button}
              to="/rc/manage-recruiter"
              component={Link}
            >
              Cancel
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
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
      <MessageBox
        open={values.showSuccess}
        variant="success"
        onClose={handleMsgClose}
        message={values.successMsg}
      />
      <MessageBox
        open={errMsg}
        variant="error"
        onClose={handleClose}
        message={errMsg}
      />

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
              Ok
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};
const mapDispatchToProps = {
  addRecruiter,
  loadStates
};

const mapStateToProps = state => ({
  states: state.admin && state.admin.states,
  orgId: state.profile && state.profile.orgId,
  userId: state.profile && state.profile.id
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddRecruiter))
);
