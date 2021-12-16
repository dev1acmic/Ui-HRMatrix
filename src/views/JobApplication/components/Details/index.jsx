import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";

// Material helpers
import { Prompt } from "react-router-dom";
import DatePicker from "react-datepicker";
import Popout from "react-popout";
// Material components
import {
  CalendarToday,
  CameraAltRounded,
  CloseOutlined,
  CloudUpload,
  RemoveRedEyeOutlined,
} from "@material-ui/icons";
import {
  Grid,
  TextField,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Select,
  OutlinedInput,
  Button,
  InputAdornment,
  //createMuiTheme,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Modal,
  Avatar as ProfilePicAvatar,
  MenuItem,
} from "@material-ui/core";
import MessageBox from "util/messageBox";
// Component styles
import styles from "../../../JobPost/components/styles";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import {
  saveApplication,
  uploadFile,
  getFile,
  loadStates,
} from "services/jobApplication/action";

import { withStyles, Typography } from "@material-ui/core";
import { fromPreferredPremium ,isPremiumJob} from "services/jobPost/action";
import { connect } from "react-redux";
//import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";
import { formatCurrency, b64toBlob } from "util/helper";
import profilePicUrl from "assets/images/avatar0.jpg";
import { ProfilePic } from "views/Modals/";

const sliderStyle = {
  position: "relative",
  width: "100%",
  height: 30,
  marginTop: "10px",
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
      <div style={{ fontFamily: "Roboto", fontSize: 11, marginTop: -18 }}>
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

const Details = forwardRef((props, ref) => {
  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => {
    return {
      saveJobApplication,
      isBlocking,
      clearUnsavedData,
    };
  });

  const initialState = {
    values: {
      jobpostId: props.jobId,
      payType: props.type,
      id: 0,
      fname: "",
      lname: "",
      email: "",
      phone: "",
      state: " ",
      country: " ",
      currJob: "",
      exp: null,
      payRate: null,
      availDate: null,
      travelPrc: "1",
      armyVet: null,
      workAuth: null,
      relocate: null,
      hadVisa: null,
      tab: "0,0,0",
      status: 0,
      resumeId: null,
      avatarId: null,
    },
    errors: {
      fname: null,
      lname: null,
      email: null,
      phone: null,
      state: null,
      country: null,
      currJob: null,
      exp: null,
      payRate: null,
      availDate: null,
      travelPrc: null,
      armyVet: null,
      workAuth: null,
      relocate: null,
      hadVisa: null,
    },
  };

  const { classes } = props;
  const { t } = useTranslation(["jobApplication", "common"]);
  let [values, setValues] = useState(initialState.values);
  let [isBlocking, setIsBlocking] = useState(false);
  const [errors, setErrors] = useState(initialState.errors);
  const [, setValid] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [succMsg, setSuccMsg] = useState(false);
  const [alert, setAlert] = useState(false);
  const [resumeUpload, setResumeUpload] = useState({
    fileName: null,
    isUploading: false,
  });
  const [resumePopOut, setResumePopOut] = useState(null);

  const [avatarUpload, setAvatarUpload] = useState({
    src: null,
    isDialogOpen: false,
    url: profilePicUrl,
    //isLoading: false
  });

  useEffect(() => {
    if (props.jobPost) {
      const payType = props.jobPost.type;

      setValues({ ...values, payType: payType });
    }
  }, [props.jobPost]);

  useEffect(() => {
    if (props.jobApplication) {
      const setValue = props.jobApplication;

      if (props.jobApplication.payRate) {
        setValue.payRate = formatCurrency(setValue.payRate);
      }
      setValues(setValue);

      //
      if (setValue.file) {
        const { originalName } = setValue.file;
        setResumeUpload({
          fileName: originalName,
          isUploading: false,
        });
      }

      if (setValue.avatarId) {
        getAvatar(setValue.avatarId);
      }
    }
  }, [props.jobApplication]);

  useEffect(() => {
    props.loadStates();
  }, []);
  const format = (money) => {
    if (money) {
      const newState = { ...values };
      const curencyRegex = /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$/;
      if (!curencyRegex.test(money)) {
        setValues({ ...values, ["payRate"]: "" });
        setErrMsg(true);
        setErrMsg("Invalid pay rate");
      } else {
        setErrMsg(false);
        newState.payRate = formatCurrency(money);
        setValues(newState);
      }
    }
  };

  const handleClose = () => {
    setSuccMsg(false);
    setAlert(false);
    setErrMsg(false);
  };

  const handleChange = (field, value) => {
    const newState = { ...values };
    const re = /^[+?0-9\b]+$/;
    if ((field === "phone" || field === "exp") && value && !re.test(value)) {
      value = newState[field] || "";
    }
    if (field === "armyVet" || field === "workAuth" || field === "relocate") {
      value = value === "1" ? 1 : 0;
    }

    setValues({ ...values, [field]: value });
    if (value) {
      setIsBlocking(true);
    }
  };

  function validateForm() {
    let errors = validate(values, schema);

    if (!errors) {
      let reg = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
      var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (values.phone && !reg.test(values.phone)) {
        const msg = t("invalidphone");
        errors = {};
        errors.phone = [""];
        handleClose();
        setErrMsg(true);
        setErrors(errors || {});
        setErrMsg(msg);
        return false;
      }

      if (values.email && !regEmail.test(values.email)) {
        errors = {};
        errors.email = [""];
        handleClose();
        setErrMsg(true);
        setErrors(errors || {});
        setErrMsg(t("common:errMsg.emailisnotavalidemail"));
        return false;
      }
    }
    handleClose();
    setErrors(errors || {});
    let valid = errors ? false : true;
    setValid(valid);

    if (!valid) {
      setAlert(true);
      setAlert(t("common:errMsg.fillReqInfo"));
      setValues({
        ...values,
      });
    }
    return valid;
  }

  const clearUnsavedData = () => {
    let nextState = initialState.values;
    nextState = props.jobApplication ? { ...props.jobApplication } : nextState;
    setValues(nextState);
  };

  const saveJobApplication = async (c) => {
    let finalSubmit = c ? validateForm() : true;
    const newVal = { ...values };
    if (!c) {
      setErrors(undefined || {});
    }
    let errors = validate(values, schema);
    if (
      (errors && Object.entries(errors).length) ===
      (schema && Object.entries(schema).length)
    ) {
      setAlert(true);
      setAlert(this.props.t("common:errMsg.infoNotAdded"));
    } else {
      let valid = errors ? false : true;

      let splitTabs = [];

      if (newVal.tab) {
        splitTabs = newVal.tab.split(",");
        splitTabs[0] = valid ? 1 : 0;
        splitTabs[2] = splitTabs[0] || splitTabs[1] === 0 ? 0 : 1;
        newVal.tab = splitTabs.toString();
      } else {
        newVal.tab = valid ? "1,0,0" : "0,0,0";
      }
      if (newVal.payRate) {
        newVal.payRate = newVal.payRate.replace(/,/g, "");
      }

      newVal.jobpostId = props.jobId;
      newVal.status = 0;
      newVal.updatedAt = new Date().toISOString();
      delete newVal.createdAt;
      if (finalSubmit) {
        const isPreferedPremiumAgency = await props.fromPreferredPremium(
          props.profileId,
          props.jobPost.user.organization.id
        );

        // await props.isPremiumJob(props.profileId, props.jobId);

        newVal.isPremiumCandidate = isPreferedPremiumAgency ? false : true;
        let res = await props.saveApplication(newVal);
        if (res) {
          setSuccMsg(true);
          setIsBlocking(false);
          return [res, valid];
        }
      }
    }
  };

  const handleResumeUpload = async (event) => {
    const maxSize = 5242880;
    //console.log(event.target.files[0]);

    //clear state values
    setResumeUpload({
      ...resumeUpload,
      isUploading: true,
    });

    for (let index = 0; index < event.target.files.length; index++) {
      const file = event.target.files[index];
      if (file.size > maxSize) {
        setAlert(true);
        setAlert("Resume file size cannot be more than 5Mb");
        setResumeUpload({
          ...resumeUpload,
          isUploading: false,
        });
        return;
      }
      if (
        !(
          file.type.includes("application/pdf") ||
          file.type.includes("image/png") ||
          file.type.includes(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          )
        )
      ) {
        setAlert(true);
        setAlert("Resume file should be of type .pdf or .docx");
        setResumeUpload({
          ...resumeUpload,
          isUploading: false,
        });
        return;
      }
    }

    let res = await props.uploadFile(event.target.files, "resume");
    if (res.status) {
      const { originalName, id } = res.result[0];

      setResumeUpload({
        ...resumeUpload,
        fileName: originalName,
        isUploading: false,
      });

      setValues({ ...values, resumeId: id });
    } else {
      setResumeUpload({
        ...resumeUpload,
        isUploading: false,
      });
    }
  };

  const handleRemoveResume = () => {
    setResumeUpload({
      ...resumeUpload,
      fileName: null,
    });
    setValues({ ...values, resumeId: null });
  };

  const getAvatar = async (avatarId) => {
    props.getFile(avatarId).then((res) => {
      //console.log(resumeUpload);
      if (res.status) {
        const { url, originalName } = res.result;
        setAvatarUpload({
          fileName: originalName,
          isUploading: false,
          url: url,
        });
      }
    });
  };

  const handleShowFile = async () => {
    setResumePopOut(null);
    let res = await props.getFile(values.resumeId);
    //console.log(resumeUpload);
    if (res.status) {
      const { url, originalName } = res.result;
      setResumePopOut({ url: url, title: originalName, isOpen: true });
    }
  };

  const handleCloseFile = () => {
    setResumePopOut(null);
  };

  const showPopOutWindow = () => {
    if (resumePopOut && resumePopOut.isOpen) {
      return (
        <Popout
          url={resumePopOut.url}
          title={resumePopOut.title}
          options={{ height: "300", width: "600" }}
          onClosing={handleCloseFile}
        >
          <div>Please wait...</div>
        </Popout>
      );
    }
    return;
  };

  const handleOpenAvatarModal = () => {
    setAvatarUpload({ ...avatarUpload, isDialogOpen: true });
  };

  const handleAvatarCrop = (preview) => {
    setAvatarUpload({ ...avatarUpload, preview: preview });
  };

  const handleAvatarClose = () => {
    setAvatarUpload({ ...avatarUpload, preview: null });
  };

  const handleBeforeAvatarFileLoad = (elem) => {
    const maxSize = 153600;

    const file = elem.target.files[0];
    console.log(file.size);
    if (file.size > maxSize) {
      setAlert("Profile photo file size cannot be more than 150Kb");
      elem.target.value = "";
    }

    if (
      !(file.type.includes("image/png") || file.type.includes("image/jpeg"))
    ) {
      setAlert("Profile photo file should be of type png/jpeg");
      elem.target.value = "";
    }
  };

  const handleAvatarDialogClose = () => {
    setAvatarUpload({ ...avatarUpload, isDialogOpen: false, preview: null });
  };

  const handleAvatarDialogOK = async () => {
    setAvatarUpload({
      ...avatarUpload,
      //isLoading: true
    });

    const blob = b64toBlob(avatarUpload.preview);
    const res = await props.uploadFile([blob], "avatar");
    let orgName, url;

    if (res.status) {
      const { originalName, id } = res.result[0];
      orgName = originalName;
      url = avatarUpload.preview;
      setValues({ ...values, avatarId: id });
    }
    setAvatarUpload({
      ...avatarUpload,
      isDialogOpen: false,
      preview: null,
      name: orgName,
      url,
      //isLoading: false
    });
  };

  return (
    <Fade in="true" timeout="10">
      <Grid container spacing={3}>
        <Prompt when={isBlocking} message={t("common:errMsg.unsavedAlert")} />
        <Grid
          container
          item
          xs={12}
          md={12}
          spacing={3}
          className={classes.formContainer}
        >
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              {t("common:firstname")}
            </InputLabel>
            <TextField
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 80 }}
              placeholder="Eg: John"
              onChange={(event) => handleChange("fname", event.target.value)}
              value={values.fname || ""}
              error={getMsg(errors.fname, t)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel className={classes.inputLabel}>
              {t("common:lastname")}
            </InputLabel>
            <TextField
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 80 }}
              placeholder="Eg: Smith"
              onChange={(event) => handleChange("lname", event.target.value)}
              value={values.lname || ""}
              error={getMsg(errors.lname, t)}
            />
          </Grid>
        </Grid>

        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid container item xs={12} md={12} spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel className={classes.inputLabel}>
                {t("email")}
              </InputLabel>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 85 }}
                placeholder="Eg: johnsmith@mail.com"
                onChange={(event) => handleChange("email", event.target.value)}
                value={values.email || ""}
                error={getMsg(errors.email, t)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel className={classes.inputLabel}>
                {t("competency.contact")}#
              </InputLabel>
              <TextField
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 10 }}
                placeholder="Eg: (123) 456 7890"
                onChange={(event) => handleChange("phone", event.target.value)}
                value={values.phone || ""}
                error={getMsg(errors.phone, t)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <FormLabel className={classes.formLabel}>
                  {t("common:states")}
                </FormLabel>
                <Select
                  // style={{ marginTop: 9, width: 170 }}
                  margin="dense"
                  input={<OutlinedInput labelWidth="0" name="role" id="role" />}
                  onChange={(event) =>
                    handleChange("state", event.target.value)
                  }
                  value={values.state}
                  error={getMsg(errors.state, t)}
                >
                  <MenuItem value=" ">{t("common:state")}</MenuItem>
                  {props.states &&
                    props.states.map((item, index) => (
                      <MenuItem key={index} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <FormLabel className={classes.formLabel}>
                  {t("common:country")}
                </FormLabel>
                <Select
                  margin="dense"
                  input={<OutlinedInput labelWidth="0" name="role" id="role" />}
                  onChange={(event) =>
                    handleChange("country", event.target.value)
                  }
                  value={values.country || " "}
                  error={getMsg(errors.country, t)}
                >
                  <MenuItem value=" ">{t("common:country")}</MenuItem>

                  <MenuItem key={1} value={t("currentCountryCode")}>
                    {t("currentCountry")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs={12}
          md={12}
          spacing={3}
          className={classes.formContainer}
        >
          <Grid item xs={12} sm={6} md={3}>
            <FormControl variant="outlined" className={classes.formControl}>
              <FormLabel className={classes.inputLabel}>
                {t("common:currentjob")}
              </FormLabel>
              <TextField
                id="outlined-dense-multiline"
                margin="dense"
                variant="outlined"
                fullWidth
                placeholder={t("common:currentjob")}
                onChange={(event) =>
                  handleChange("currJob", event.target.value)
                }
                value={values.currJob || ""}
                error={getMsg(errors.currJob, t)}
                inputProps={{ maxlength: 100 }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl variant="outlined" className={classes.formControl}>
              <FormLabel className={classes.inputLabel}>
                {t("common:experience")}
              </FormLabel>
              <TextField
                id="outlined-dense-multiline"
                margin="dense"
                variant="outlined"
                fullWidth
                placeholder={t("yearsofexp")}
                onChange={(event) => handleChange("exp", event.target.value)}
                value={values.exp || ""}
                error={getMsg(errors.exp, t)}
                inputProps={{ maxlength: 2 }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl variant="outlined" className={classes.formControl}>
              <FormLabel className={classes.inputLabel}>
                {t("common:expectedcompensation")}
              </FormLabel>
              <TextField
                id="outlined-dense-multiline"
                margin="dense"
                variant="outlined"
                fullWidth
                placeholder={values.payType === 1 ? t("annum") : t("hr")}
                onChange={(event) =>
                  handleChange("payRate", event.target.value)
                }
                value={values.payRate || ""}
                error={getMsg(errors.payRate, t)}
                inputProps={{ maxLength: 8 }}
                onBlur={(e) => (
                  (e.target.placeholder =
                    values.payType === 1 ? t("annum") : t("hr")),
                  format(e.target.value)
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <InputLabel className={classes.inputLabel}>
              {t("common:availableOn")}
            </InputLabel>

            <DatePicker
              placeholderText={t("availabledate")}
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = t("availabledate"))}
              format="MM/DD/YYYY"
              selected={values.availDate && new Date(values.availDate)}
              onChange={(date) => handleChange("availDate", date)}
              minDate={new Date()}
              customInput={
                <TextField
                  error={getMsg(errors.availDate, t)}
                  id="outlined-dense-multiline"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <CalendarToday style={{ height: 16, width: 16 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              }
            />
          </Grid>
        </Grid>

        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid container item xs={12} md={12} spacing={3}>
            <Grid item xs={6} sm={3} md={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.inputLabel}>
                  {t("jobApplication:isVeteran")}
                </FormLabel>
                <RadioGroup
                  aria-label="veteran"
                  name="veteran"
                  row
                  onChange={(event) =>
                    handleChange("armyVet", event.target.value)
                  }
                >
                  <FormControlLabel
                    value={1}
                    control={
                      <Radio
                        color="primary"
                        className={
                          errors.armyVet ? classes.radioButtonIconErr : null
                        }
                      />
                    }
                    label={t("common:yes")}
                    labelPlacement="end"
                    checked={values.armyVet === 1 || values.armyVet === true}
                  />
                  <FormControlLabel
                    value={0}
                    control={
                      <Radio
                        color="primary"
                        className={
                          errors.armyVet ? classes.radioButtonIconErr : null
                        }
                      />
                    }
                    label={t("common:no")}
                    labelPlacement="end"
                    checked={values.armyVet === 0 || values.armyVet === false}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.inputLabel}>
                  {t("common:workauthorization")}?
                </FormLabel>
                <RadioGroup
                  aria-label="auth"
                  name="auth"
                  row
                  onChange={(event) =>
                    handleChange("workAuth", event.target.value)
                  }
                >
                  <FormControlLabel
                    value={1}
                    control={
                      <Radio
                        color="primary"
                        className={
                          errors.workAuth ? classes.radioButtonIconErr : null
                        }
                      />
                    }
                    label={t("common:yes")}
                    labelPlacement="end"
                    checked={values.workAuth === 1 || values.workAuth === true}
                  />
                  <FormControlLabel
                    value={0}
                    control={
                      <Radio
                        color="primary"
                        className={
                          errors.workAuth ? classes.radioButtonIconErr : null
                        }
                      />
                    }
                    label={t("common:no")}
                    labelPlacement="end"
                    checked={values.workAuth === 0 || values.workAuth === false}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.inputLabel}>
                  {t("common:willingtorelocate")}?
                </FormLabel>
                <RadioGroup
                  aria-label="relocate"
                  name="relocate"
                  row
                  onChange={(event) =>
                    handleChange("relocate", event.target.value)
                  }
                >
                  <FormControlLabel
                    value={1}
                    control={
                      <Radio
                        color="primary"
                        className={
                          errors.relocate ? classes.radioButtonIconErr : null
                        }
                      />
                    }
                    label={t("common:yes")}
                    labelPlacement="end"
                    checked={values.relocate === 1 || values.relocate === true}
                  />
                  <FormControlLabel
                    value={0}
                    control={
                      <Radio
                        color="primary"
                        className={
                          errors.relocate ? classes.radioButtonIconErr : null
                        }
                      />
                    }
                    label={t("common:no")}
                    labelPlacement="end"
                    checked={values.relocate === 0 || values.relocate === false}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <InputLabel className={classes.inputLabel}>
                {t("competency.travelPerc")}
              </InputLabel>
              <Slider
                rootStyle={sliderStyle}
                domain={[1, 100]}
                step={10}
                mode={2}
                values={[values.travelPrc]}
                onSlideEnd={(event) => handleChange("travelPrc", event[0])}
              >
                <Rail>
                  {(
                    { getRailProps } // adding the rail props sets up events on the rail
                  ) => <div style={railStyle} {...getRailProps()} />}
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
            </Grid>
          </Grid>
          <Grid container item xs={12} md={12} spacing={3}>
            <Grid item xs={6} sm={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.inputLabel}>
                  {t("common:profilephoto")}?
                </FormLabel>
                <div style={{ width: 60, position: "relative" }}>
                  <ProfilePicAvatar
                    src={avatarUpload.url}
                    className={classes.avatarBig}
                  />
                  <CameraAltRounded
                    className={classes.avatarIcon}
                    onClick={handleOpenAvatarModal}
                  />
                </div>

                <Typography variant="caption" className={classes.avatarHelp}>
                  {t("uploadalert")}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.inputLabel}>
                  {t("common:resume")} (5Mb max)
                </FormLabel>
                {!resumeUpload.fileName ? (
                  !resumeUpload.isUploading ? (
                    <Button
                      variant="contained"
                      className={classes.uploadBtn}
                      component="label"
                    >
                      <CloudUpload></CloudUpload>
                      &nbsp; {t("common:upload")}
                      <input
                        type="file"
                        accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                        onChange={handleResumeUpload}
                        multiple="false"
                        hidden
                      />
                    </Button>
                  ) : (
                    <CircularProgress className={classes.progress} />
                  )
                ) : (
                  // <Typography className={classes.viewUpload}>
                  //   <RemoveRedEyeOutlined onClick={handleShowFile} />
                  //   &nbsp;{resumeUpload.fileName}
                  //   <Button onClick={handleRemoveResume}>Remove</Button>
                  // </Typography>

                  <Typography className={classes.viewUpload}>
                    <RemoveRedEyeOutlined />
                    <span>
                      &nbsp;
                      <span
                        onClick={handleShowFile}
                        style={{ cursor: "pointer" }}
                      >
                        {resumeUpload.fileName}
                      </span>
                    </span>
                    &nbsp;
                    <CloseOutlined
                      title="Delete File"
                      style={{ cursor: "pointer", transform: "scale(.8)" }}
                      onClick={handleRemoveResume}
                    />
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid container item xs={12} md={12} spacing={3}>
            <Grid item xs={12} sm={3}>
              <FormControl component="fieldset" style={{ display: "none" }}>
                <FormLabel component="legend" className={classes.inputLabel}>
                  {t("visaNeed")}
                </FormLabel>
                <RadioGroup
                  aria-label="visa"
                  name="visa"
                  row
                  onChange={(event) =>
                    handleChange("hadVisa", event.target.value)
                  }
                >
                  <FormControlLabel
                    value="1"
                    control={
                      <Radio
                        color="primary"
                        className={
                          errors.hadVisa ? classes.radioButtonIconErr : null
                        }
                      />
                    }
                    label={t("common:yes")}
                    labelPlacement="end"
                    checked={values.hadVisa === 1}
                  />
                  <FormControlLabel
                    value="0"
                    control={
                      <Radio
                        color="primary"
                        className={
                          errors.hadVisa ? classes.radioButtonIconErr : null
                        }
                      />
                    }
                    label={t("common:no")}
                    labelPlacement="end"
                    checked={values.hadVisa === 0}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Dialog
          open={alert}
          onClose={handleClose}
          mess
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t("common:errMsg.incompleteInfo")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {alert}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              {t("common:ok")}
            </Button>
          </DialogActions>
        </Dialog>

        <Modal
          // style={{
          //   position: "absolute",
          //   top: "20%",
          //   left: "0",
          //   overflowY: "scroll",
          //   height: "100%",
          //   display: "block"
          // }}
          aria-labelledby="Profile photo"
          aria-describedby="Profile photo"
          open={avatarUpload.isDialogOpen}
          onClose={handleAvatarDialogClose}
        >
          <ProfilePic
            onCrop={handleAvatarCrop}
            onClose={handleAvatarClose}
            onBeforeFileLoad={handleBeforeAvatarFileLoad}
            onSubmit={handleAvatarDialogOK}
            src={avatarUpload.src}
            preview={avatarUpload.preview}
            onDialogClose={handleAvatarDialogClose}
            //isLoading={avatarUpload.isLoading}
          />
        </Modal>

        <MessageBox
          open={succMsg}
          variant="success"
          onClose={handleClose}
          message={t("common:succMsg.savedSuccessfully")}
        />
        <MessageBox
          open={errMsg}
          variant="error"
          onClose={handleClose}
          message={errMsg}
        />

        {showPopOutWindow()}
      </Grid>
    </Fade>
  );
});

const mapDispatchToProps = {
  saveApplication: saveApplication,
  uploadFile,
  getFile,
  loadStates,
  fromPreferredPremium,
  isPremiumJob
};
const mapStateToProps = (state) => ({
  jobApplication: state.jobApplication && state.jobApplication.data,
  jobPost: (state.jobPost && state.jobPost.data) || null,
  states: state.admin && state.admin.states,
  profileId: state.profile && state.profile.id,
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(withStyles(styles)(Details));
