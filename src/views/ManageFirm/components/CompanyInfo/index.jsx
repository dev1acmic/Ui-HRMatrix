import React, {
  useState,
  useEffect,
  forwardRef,
  //  useImperativeHandle
} from "react";
import {
  Container,
  Button,
  withStyles,
  Grid,
  InputLabel,
  TextField,
  FormControl,
  OutlinedInput,
  Select,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from "@material-ui/core";
import { connect } from "react-redux";

import { Link, Prompt } from "react-router-dom";

import styles from "../../../JobPost/components/styles";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import { loadStates, manageFirm } from "services/admin/action";
//import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";
import MessageBox from "util/messageBox";

const CompanyInfo = forwardRef((props, ref) => {
  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  // useImperativeHandle(ref, () => {
  //   return {
  //     sayHello() {
  //       console.log("Hello! I was called from Parent.");
  //     }
  //   };
  // });
  const { classes, profile, organization, address, states } = props;
  const { t } = useTranslation("common");
  const initialFirmState = {
    values: {
      id: profile.orgId,
      name: "",
      contactNo1: "",
      fax: "",
      email: "",
      addrId: 0,
      line1: "",
      line2: "",
      city: "",
      state: " ",
      country: "US",
      zip: "",
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

  let [values, setValues] = useState(initialFirmState.values);
  let [isBlocking, setIsBlocking] = useState(false);
  const [errors, setErrors] = useState(initialFirmState.errors);
  const [loading, setLoading] = useState(false);
  const [isValid, setValid] = useState(false);
  const [errMsg, setErrMsg] = useState(false);

  useEffect(() => {
    props.loadStates();
  }, []);
  useEffect(() => {
    //get user item from props
    let orgDetails, addrDetails;
    if (organization) {
      orgDetails = organization;
      setValues(orgDetails);
    }
    if (address && address.length > 0) {
      addrDetails = address[0].address;
      let addrId = addrDetails.id;
      let newstate = Object.assign(addrDetails, orgDetails);
      newstate.addrId = addrId;
      setValues(newstate);
    }
  }, [organization, address]);

  const handleFieldChange = (field, value) => {
    const newState = { ...values };
    const re = /^[+?0-9\b]+$/;
    if (
      // (field === "contactNo1" || field === "fax") &&
      field === "contactNo1" &&
      value &&
      !re.test(value)
    ) {
      value = newState[field] || "";
    }
    setValues({ ...values, [field]: value });
    if (value) {
      setIsBlocking(true);
    }
  };
  function handleClose() {
    setErrMsg(false);
  }
  function handleMsgClose() {
    setValues({ ...values, showSuccess: false });
  }
  function validateForm() {
    const errors = validate(values, schema);

    // if (errors && errors.fax && values.fax) {
    //   let reg = /[\+? *[1-9]+]?[0-9 ]+/;
    //   if (!reg.test(values.fax)) {
    //     setErrMsg("Invalid fax");
    //   }
    //   setErrors(errors || {});
    //   return false;
    // }

    if (errors && errors.contactNo1 && values.contactNo1) {
      const msg = t("invalidphone");
      let reg =
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
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

  function handleUpdateFirm(c) {
    let finalSubmit = c ? validateForm() : true;

    if (finalSubmit) {
      setLoading(true);
      props.manageFirm(values).then((res) => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000);
        setErrMsg(false);
        setIsBlocking(false);
        setValues({
          ...values,
          addrId: res.addrId,
          showSuccess: false,
          showError: false,
        });
        if (c) {
          props.changeTab(1);
        }

        return () => clearTimeout(timer);
      });
    }
  }

  return (
    <Container className={classes.root} style={{ padding: 0, margin: -24 }}>
      <Prompt when={isBlocking} message={t("errMsg.unsavedAlert")} />
      <Grid container spacing={3}>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12} md={8}>
            <InputLabel className={classes.inputLabel}>
              {t("companyname")}
            </InputLabel>
            <TextField
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 85 }}
              placeholder={t("companyname")}
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
              {t("corporateAddress")}
            </InputLabel>
            <TextField
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 80 }}
              placeholder={t("addressLineOne")}
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
              placeholder={t("addressLineTwo")}
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
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            //className={classes.threeColEqual}
            style={{ marginTop: 8 }}
          >
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 50 }}
                placeholder={t("city")}
                onChange={(event) =>
                  handleFieldChange("city", event.target.value)
                }
                value={values.city || ""}
                error={getMsg(errors.city, t)}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            //className={classes.threeColEqual}
            style={{ marginTop: 8 }}
          >
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
                <MenuItem value=" ">{t("state")}</MenuItem>
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
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            //className={classes.threeColEqual}
          >
            <TextField
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 5 }}
              placeholder={t("zip")}
              onChange={(event) => handleFieldChange("zip", event.target.value)}
              value={values.zip || ""}
              error={getMsg(errors.zip, t)}
            />
          </Grid>
          {/* <Grid
        item
        xs={12}
        sm={6}
        md={4}
        //className={classes.threeColEqual}
        //style={{ marginTop: 8 }}
      >
        <FormControl variant="outlined" className={classes.formControl}>
          <Select
            style={{ marginTop: 7 }}
            margin="dense"
            input={<OutlinedInput labelWidth="0" name="role" id="role" />}
            onChange={event =>
              handleFieldChange("country", event.target.value)
            }
            value={values.country || ""}
            error={errors.country}
          >
            <MenuItem value="Select">Country</MenuItem>

            <MenuItem key={1} value={"US"}>
              USA
            </MenuItem>
          </Select>
        </FormControl>
      </Grid> */}
        </Grid>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel className={classes.inputLabel}>
              {t("contactNumber")}
            </InputLabel>
            <TextField
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 12 }}
              placeholder={t("contactNumber")}
              onChange={(event) =>
                handleFieldChange("contactNo1", event.target.value)
              }
              value={values.contactNo1 || ""}
              error={getMsg(errors.contactNo1, t)}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4} className={classes.subItem}>
            <TextField
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 12 }}
              placeholder={t("fax")}
              onChange={(event) => handleFieldChange("fax", event.target.value)}
              value={values.fax || ""}
              //error={errors.fax}
            />
          </Grid> */}
        </Grid>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12} sm={6} md={8}>
            <InputLabel className={classes.inputLabel}>{t("email")}</InputLabel>
            <TextField
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 45 }}
              placeholder={t("email")}
              onChange={(event) =>
                handleFieldChange("email", event.target.value)
              }
              value={values.email || ""}
              error={getMsg(errors.email, t)}
            />
          </Grid>
        </Grid>
        <Grid spacing={3} item container className={classes.buttonBar}>
          {loading ? (
            <CircularProgress className={classes.progress} />
          ) : (
            <div>
              <Link to="/rc/dashboard" className={classes.button}>
                <Button variant="contained">{t("cancel")}</Button>
              </Link>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleUpdateFirm(false);
                }}
                className={classes.button}
              >
                {t("common:saveforLater")}
              </Button>
              <Button
                onClick={() => {
                  handleUpdateFirm(true);
                }}
                variant="contained"
                color="primary"
              >
                {t("common:saveandcontinue")}
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
      <MessageBox
        open={values.showSuccess}
        variant="success"
        onClose={handleMsgClose}
        message={t("common:succMsg.savedSuccessfully")}
      />

      <MessageBox
        open={errMsg}
        variant="error"
        onClose={handleClose}
        message={errMsg}
      />

      <Dialog
        open={values.showError}
        onClose={() => {
          setValues({ ...values, showError: false });
        }}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("errMsg.incompleteInfo")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {values.errMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setValues({ ...values, showError: false });
            }}
            color="primary"
            autoFocus
          >
            {t("common:ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});

const mapDispatchToProps = {
  loadStates,
  manageFirm,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  states: state.admin && state.admin.states,
  organization: state.admin && state.admin.organization,
  address:
    state.admin && state.admin.organization && state.admin.organization.addr,
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(withStyles(styles)(CompanyInfo));
