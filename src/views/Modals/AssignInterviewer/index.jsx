import React, { useEffect, useState } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import classNames from "classnames";
import { Calendar, momentLocalizer } from "react-big-calendar";
// Material helpers
import { useEventCallback, withStyles } from "@material-ui/core";
// Material components
import { CalendarToday, ArrowLeft, ArrowRight } from "@material-ui/icons";
import {
  Toolbar,
  Typography,
  Box,
  AppBar,
  Divider,
  Grid,
  InputLabel,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Button,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core";
import moment from "moment";
// Component styles
import styles from "../styles";
import { stateToHTML } from "draft-js-export-html";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { InterviewMode } from "util/enum";
import MUIRichTextEditor from "mui-rte";
import _ from "lodash";
import ReactTags from "react-tag-autocomplete";
import validate from "validate.js";
import userschema from "../AddPanel/schema_user";
import schema from "./schema";
import MessageBox from "util/messageBox";
import { useTranslation } from "react-i18next";
import {
  getMsg,
  loadTimeSlots,
  compareTime,
  getInterviewSchedule,
  truncate,
} from "util/helper";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { 
  getInterviewersByPanel,
  getInterviewersByApplicantId,
  saveApplicantInterviewers,
  getInterviewersSchedulebyDate,
  getCandidateSchedulebyJob,
  deleteApplicantInterviewers,
  removeApplicantInterviewers,
} from "services/jobApplication/action";
import { addUser, loadUsers } from "services/admin/action";
import DatePicker from "react-datepicker";
const startTime = new Date().getHours();
// const timeSlots = loadTimeSlots();
const theme = createMuiTheme({
  overrides: {
    MUIRichTextEditor: {
      root: {
        marginTop: 8,
        width: "100%",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: 3,
      },
      error: {
        border: "1px solid red",
        borderBottomWidth: 1,
        margin: -1,
        width: "calc(100% + 2px)",
        borderRadius: "0 0 3px 3px",
      },
      placeHolder: {
        padding: "15px",
        color: "#BCC5D8",
      },
      editorContainer: {
        minHeight: 150,
        padding: "15px",
        "& ol": {
          paddingLeft: 20,
        },
        "& ul": {
          paddingLeft: 20,
        },
      },
    },
    MuiSvgIcon: {
      root: {
        height: 20,
        width: 20,
      },
    },
    MuiButtonBase: {
      root: {
        padding: "5px!important",
        marginLeft: 2,
      },
    },
  },
});
const localizer = momentLocalizer(moment);
const AssignInterviewer = (props) => {
  const {
    classes,
    organizationId,
    applicantId,
    applicantName,
    applicantEmail,
    jobpostId,
    totalLevels,
    jobApplications,
    jobPost,
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
        email: t.username,
      })),
    interviewers:
      props.interviewers &&
      props.interviewers.map((t) => ({
        id: t.id,
        fname: t.fname,
        lname: t.lname,
        email: t.username,
      })),
  }; 
  const { t } = useTranslation(["common", "enum"]);
  const [state, setState] = useState({});
  const [time, setTime] = useState(loadTimeSlots(new Date()));
  let [values, setValues] = useState(panel.values);
  let [newuser, setNewuser] = useState(panel.newuser);
  const [suggestions, setSuggestions] = useState(panel.suggestions);
  const [interviewers, setInterviewers] = useState(panel.interviewers);
  const [errors, setErrors] = useState(panel.errors);
  const [option, setOption] = useState(false);
  const [optionBtn, setOptionBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeslot, setTimeslot] = useState([]);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [key, setKey] = useState(0);
  const [errMsg, setErrMsg] = useState(false);  

  useEffect(() => {
    if(props.interviewers)
    { 
      const interviewers =   props.interviewers.map((t) => ({
        id: t.id,
        fname: t.fname,
        lname: t.lname,
        email: t.username,
      }));
      const suggestions = props.interviewers.map((t) => ({
        id: t.id,
        name: t.fname + " " + t.lname,
        email: t.username,
      }));
      setInterviewers(interviewers)
      setSuggestions(suggestions)
    }  
  }, [props.interviewers])

  const getHours = () => {
    let hours;
    if (state.fromtime && state.totime && state.day) {
      let startDt = new Date(
        `${state.day.toLocaleDateString()} ${state.fromtime}`
      );
      let endDt = new Date(
        `${state.day.toLocaleDateString()} ${state.totime}`
      );
      let duration = moment.duration(moment(endDt).diff(moment(startDt)));
      hours =
        duration.asHours() < 1
          ? duration.asMinutes() + " mins"
          : duration.asHours() + " hour";
    }
    return hours || ''
  }

  const handleChange = (value, field) => { 
    if (field === "fromtime") {
      let valid =
        state.totime &&
        compareTime(
          new Date(`${new Date().toLocaleDateString()} ${value}`),
          new Date(`${new Date().toLocaleDateString()} ${state.totime}`)
        );

      if (valid === 1 || _.isEmpty(state.totime)) {
        let to = moment(new Date(`${new Date().toLocaleDateString()} ${value}`))
          .add(1, "hours")
          .format("hh:mm A");
        setState({ ...state, [field]: value, totime: to });
      } else {
        setState({ ...state, [field]: value });
      }
    } else if (field === "totime") {
      let valid =
        state.fromtime &&
        compareTime(
          new Date(`${new Date().toLocaleDateString()} ${state.fromtime}`),
          new Date(`${new Date().toLocaleDateString()} ${value}`)
        );
      if (valid === 1 || _.isEmpty(state.fromtime)) {
        let from = moment(
          new Date(`${new Date().toLocaleDateString()} ${value}`)
        )
          .subtract(1, "hours")
          .format("hh:mm A");
        setState({ ...state, [field]: value, fromtime: from });
      } else {
        setState({ ...state, [field]: value });
      }
    } else if (field === "message") {
      // const length = value.getCurrentContent().getPlainText("").length;
      let html = stateToHTML(value.getCurrentContent());
      if (html !== "<p><br></p>") {
        setState({ ...state, [field]: html });
      }
    } else if (field === "interviewtype") { 
      const hours = getHours() 
      const message = getMessage(value, hours);
      setMessage(message);
      setKey(key ? key + 1 : 1);
      setState({ ...state, [field]: value });
    } else {
      if (field === "day") {
        setTime(loadTimeSlots(new Date(value)));
      } 
      const hours = getHours() 
      if(hours)
      { 
        const message = getMessage(value, hours);
        setMessage(message);
        setKey(key ? key + 1 : 1);
      }
      setState({ ...state, [field]: value });
    }
  };

  useEffect(() => {
    let hours;
    if (state && state.fromtime && state.totime && state.day) { 
      let startDt = new Date(
        `${state.day.toLocaleDateString()} ${state.fromtime}`
      );
      let endDt = new Date(`${state.day.toLocaleDateString()} ${state.totime}`);
      let startHr = moment(startDt).format("HH");
      let startMin = moment(startDt).format("mm");
      let endHr = moment(endDt).format("HH");
      let endMin = moment(endDt).format("mm");
      let start = new Date(
        startDt.getFullYear(),
        startDt.getMonth(),
        startDt.getDate(),
        startHr,
        startMin
      );
      let end = new Date(
        endDt.getFullYear(),
        endDt.getMonth(),
        endDt.getDate(),
        endHr,
        endMin
      );
      let slot = []; 
      let newSlot;
      if (timeslot && timeslot.length > 0) {
        newSlot = timeslot.filter(
          (c) => c.applicantid === applicantId && c.jobid === props.jobPost.id
        );
      }
      if (newSlot && newSlot.length > 0) {
        newSlot[0].start = start;
        newSlot[0].end = end;
        newSlot[0].title = `Interview for ${applicantName}`;
        slot = _.map(timeslot, function (obj) {
          return _.assign(obj, _.find(newSlot, { id: obj.id }));
        });
      } else {
        slot = [
          ...timeslot,
          {
            title: `Interview for ${applicantName}` || "",
            start,
            end,
            applicantid: applicantId,
            jobid: props.jobPost && props.jobPost.id,
          },
        ];
      }
      setTimeslot(slot);
      let duration = moment.duration(moment(endDt).diff(moment(startDt)));
      hours =
        duration.asHours() < 1
          ? duration.asMinutes() + " mins"
          : duration.asHours() + " hour";
    }

    if (state.interviewtype) {
      const message = getMessage(state.interviewtype, hours);
      setMessage(message);
      setKey(key ? key + 1 : 1);
    }
  }, [state.totime, state.fromtime, state.day]);

  const getMessage = (interviewtype, hours) => {
    let orgName =
      props.jobPost &&
      props.jobPost.user &&
      props.jobPost.user.organization &&
      props.jobPost.user.organization.name;
    let jobTitle = props.jobPost && props.jobPost.title;
    let name = props.profile && props.profile.fname + " " + props.profile.lname;
    let email = props.profile && props.profile.email;
    let modeofinterview = t(
      `${InterviewMode.getNameByValue(parseInt(interviewtype))}`
    );
    let timeslot = hours ? hours : "(to be updated)";
    let msg = `Hi ${applicantName},<br><br>Thank you for applying to the ${jobTitle} position at ${orgName}. After reviewing your application, we are excited to move forward with the interview process. We would like to schedule a ${timeslot} ${modeofinterview.toLocaleLowerCase()} interview.<br><br>Please feel free to reply directly to this email if you have any questions.<br><br>Thank you,<br>${name},<br>${email}`;
    setState({...state, message:msg})
    const contentHTML = convertFromHTML(msg);
    const html = ContentState.createFromBlockArray(
      contentHTML.contentBlocks,
      contentHTML.entityMap
    );
    const content = JSON.stringify(convertToRaw(html));
    return content;
  };

  useEffect(() => { 
    if (props.interviewDetails ) {
      const interviewDetails = props.interviewDetails;
      let orgName =
        props.jobPost &&
        props.jobPost.user &&
        props.jobPost.user.organization &&
        props.jobPost.user.organization.name;
      let jobTitle = props.jobPost && props.jobPost.title; 
      setState({
        level: interviewDetails.level,
        mode: interviewDetails.mode,
        subject: `Interview Invitation with ${orgName} for the ${jobTitle} position`,
        day: new Date(),
      });
      if(props.interviewDetails.level !== state.level)
      {
        props.getCandidateSchedulebyJob(
          applicantId,
          props.jobPost && props.jobPost.id,
          interviewDetails.level
        );
        
      props.getInterviewersByApplicantId(applicantId, interviewDetails.level);
        setMessage('')
        setKey(0)
      } 
    }
  }, [props.interviewDetails]);

  useEffect(() => { 
    async function fetch(interviewSchedule, users) {
      // if (
      //    interviewSchedule &&
      //   interviewSchedule.length > 0 &&
      //    users
      // ) { 
      //   const res = getInterviewSchedule(interviewSchedule);
      //   setTimeslot(res);
      // } 
      if (
        (interviewSchedule && interviewSchedule.length === 0) ||
        ! users
      ) {
        
        setTimeslot([...timeslot]); 
      }  
    }
    fetch(props.interviewSchedule,values.users);
    
  }, [props.interviewSchedule]);

  useEffect(() => {
    if(props.interviewDetails.level === state.level)
    {
    if (props.candidateSchedule && props.candidateSchedule.length > 0) {
      setState({
        ids: props.candidateSchedule.map((c) => {
          return { id: c.id, interviewerid: c.interviewerid };
        }),
        level: props.candidateSchedule[0].interviewlevel,
        interviewtype: props.candidateSchedule[0].interviewtype,
        subject: props.candidateSchedule[0].subject,
        message: props.candidateSchedule[0].message,
        totime: moment(props.candidateSchedule[0].totime).format("hh:mm A"),
        fromtime: moment(props.candidateSchedule[0].fromtime).format("hh:mm A"),
        day: new Date(props.candidateSchedule[0].totime),
      });
      setTime(loadTimeSlots(new Date(props.candidateSchedule[0].interviewdate))); 
      let users = [];
      props.candidateSchedule &&
        props.candidateSchedule.map((c) => {
          const interviewer = interviewers.filter(
            (p) => p.id === c.interviewerid
          );
          if (interviewer && interviewer.length) {
            users.push({
              id: interviewer[0].id,
              fname: interviewer[0].fname,
              lname: interviewer[0].lname,
              email: interviewer[0].email,
            });
          }
        });
      const tags = suggestions.filter(function (val) {
        return users.findIndex((c) => c.id === val.id) === -1;
      });
      setSuggestions(tags);
      setValues({ ...values, users });
    } else {
      const users =
        props.applicantInterviewers &&
        props.applicantInterviewers.map((t) => ({
          id: t.userId,
          fname: t.user.fname,
          lname: t.user.lname,
          email: t.user.username,
          applicantinterviewerId: t.id,
        }));

      const interviewDetails = props.interviewDetails;
      let orgName =
        props.jobPost &&
        props.jobPost.user &&
        props.jobPost.user.organization &&
        props.jobPost.user.organization.name;
      let jobTitle = props.jobPost && props.jobPost.title;

      if (interviewDetails) {
        setState({
          level: interviewDetails.level,
          mode: interviewDetails.mode,
          subject: `Level ${interviewDetails.level} Interview – ${applicantName} for ${jobTitle}  with  ${orgName}`,
          day: new Date(),
          message: "",
        });
        setValues({ ...values, users });
        if(users && users.length>0)
        {
          const tags =
          suggestions &&
          suggestions.filter(function (val) {
            return users && users.findIndex((c) => c.id === val.id) === -1;
          });
           
        setSuggestions(tags);
        }
        
        setTimeslot([...timeslot]);
      }
    }
  }
  }, [props.candidateSchedule]);

  useEffect(() => {
    if (props.applicantInterviewers && props.applicantInterviewers.length > 0) {
      const users = props.applicantInterviewers.map((t) => ({
        id: t.userId,
        fname: t.user.fname,
        lname: t.user.lname,
        email: t.user.username,
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
    if (values.users && values.users.length > 0) { 
      let userids = values.users.map((c) => c.id);
      if (userids) {
        props.getInterviewersSchedulebyDate(
          userids,
          state.day ? state.day : new Date()
        );
      }
    }
  }, [values.users, state.day]);

  useEffect(() => {
    if (props.user) { 
       if(interviewers.filter(c=>c.id === props.user[0].id).length===0)
       {
        const newUser = props.user[0];
        const users = [].concat(values.users || [], newUser);
        setValues({ ...values, users });
        setSuggestions(suggestions.filter((c) => c.id !== newUser.id));
       } 
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
          props.loadUsers(organizationId, -1);
        }
        setLoading(false);
      });
    }
  }

  function validateUserForm() {
    let errors = validate(newuser, userschema);
    // setErrMsg("common:errMsg.fillReqInfo")
    setErrors(errors || {});
    let valid = errors ? false : true;
    return valid;
  }

  const handleClose = () => {
    setErrMsg(false);
  };

  function handleUserFieldChange(field, value) {
    setNewuser({ ...newuser, [field]: value });
  }

  function validateForm() {
    let errors = validate(state, schema);
    let valid = errors ? false : true;
    if (!valid) {
      setErrMsg("Please fill in the required fields.");
    }
    if (valid && !message) {
      valid = false;
      errors = {};
      errors.message = ["Message is required"];
      setErrMsg(true);
      setErrMsg("Message is required");
    }
    if (
      (valid && !values.users) ||
      (values.users && values.users.length === 0)
    ) {
      valid = false;
      errors = {};
      setErrMsg(true);
      errors.users = ["Interviewers is required"];
      setErrMsg("Interviewers is required");
    }
    if(!valid)
    {

      setLoading(false)
    }
    setErrors(errors || {});
    return valid;
  }

  function handleSubmit() { 
    setLoading(true)
    if (validateForm()) {
      setLoading(true);

      let data = values;
      if (state.ids) {
        data.ids = state.ids.map((c) => c.id);
      } 
      data.candidate={};
      data.candidate = {name:applicantName, email:applicantEmail, isCandidate:true}
      data.interviewlevel = state.level;
      data.jobapplicantid = applicantId;
      data.jobid = jobpostId;
      data.subject = state.subject;
      data.message = state.message.replace(/(?:\r\n|\r|\n)/g, '<br>');;
      data.interviewdate = moment(state.day, "YYYY-MM-DD").format();
      data.fromtime = moment(
        new Date(`${state.day.toLocaleDateString()} ${state.fromtime}`),
        "YYYY-MM-DD HH:mm A"
      ).format();
      data.totime = moment(
        new Date(`${state.day.toLocaleDateString()} ${state.totime}`),
        "YYYY-MM-DD HH:mm A"
      ).format();
      data.interviewtype = state.interviewtype;
      //console.log(data);
      props.saveApplicantInterviewers(data).then((res) => {
        if (res) {
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            props.onCancel();
            if(props.isRecap)
            {
              props.handleRefresh() 
            }
          }, 1000);
        }
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
    setInterviewers(users);
    if (state && state.ids) {
      const interviewerid = state.ids.filter(
        (c) => c.interviewerid === user.id
      );
      if (interviewerid && interviewerid.length > 0) { 
        props.removeApplicantInterviewers(interviewerid[0].id);
        const applicantinterviewer =  props.applicantInterviewers &&
        props.applicantInterviewers.filter(c=>c.userId===interviewerid[0].interviewerid)
        props.deleteApplicantInterviewers(applicantinterviewer[0].id);
       
      }
    }

    setValues({ ...values, users: users });
    if (users.length === 0) {
        setTimeslot([...timeslot]);
    }
    //suggestions = suggestions.concat(user);
    setSuggestions(suggestions.concat(tag));
  }

  const handleAddition = (tag) => {
    const uname = props.interviewers.find((u) => u.id === tag.id);
    tag = {};
    tag.id = uname.id;
    tag.fname = uname.fname;
    tag.lname = uname.lname;
    tag.email = uname.username;
    const users = [].concat(values.users || [], tag);

    setValues({ ...values, users });
    setInterviewers(users);
    setSuggestions(suggestions.filter((c) => c.id !== tag.id));
  };

  const Tag = (props) => {
    return (
      <Chip
        label={props.tag && props.tag.fname + " " + props.tag.lname}
        onDelete={props.onDelete}
        className={props.classNames.selectedTagName}
        color="primary"
        variant="outlined"
      />
    );
  };

  const dialogue = () => {
    return (
      <Dialog
        open={alert}
        mess
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "left" }}>
              <Typography variant="h8">
                No changes, if any will be saved. Do you really want to proceed
                with the cancel?
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlert(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              setAlert(false);
              props.onCancel();
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box
      width={{ xs: "90%", sm: "90%", md: "80%" }}
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
        <div style={{ display: "flex" }}>
          <Grid item xs={6} md={6}>
            <div style={{ flex: 1.5 }}>
              <PerfectScrollbar style={{ paddingRight: 20, maxHeight: "56vh" }}>
                <Grid
                  container
                  item
                  spacing={3}
                  className={classes.formContainer}
                >
                  <Grid item xs={4}>
                    {/* <InputLabel className={classes.inputLabel}>Candidate name</InputLabel> */}
                    <TextField
                      id="outlined-bare"
                      className={classes.textField}
                      margin="dense"
                      label="Candidate Name"
                      variant="outlined"
                      fullWidth
                      inputProps={{ "aria-label": "bare" }}
                      placeholder="Candidate Name"
                      value={applicantName}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="outlined-bare"
                      className={classes.textField}
                      margin="dense"
                      label="Interview level"
                      variant="outlined"
                      fullWidth
                      inputProps={{ "aria-label": "bare" }}
                      placeholder="Interview Level"
                      value={state && state.level}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      style={{ marginTop: 8 }}
                      fullWidth
                      label="Type of Interview"
                      value={(state && state.interviewtype) || "0"}
                      onChange={(event) =>
                        handleChange(event.target.value, "interviewtype")
                      }
                      variant="outlined"
                      margin="dense"
                      error={getMsg(errors.interviewtype, t)}
                    >
                      <MenuItem value="0">{t("common:select")}</MenuItem>
                      {InterviewMode.getKeyValuePairs().map((item) => {
                        return (
                          <MenuItem value={item.value}>
                            {t(`${item.name}`)}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                   <InputLabel className={classes.inputLabel}> </InputLabel>
                </Grid>
                <Grid
                  container
                  item
                  spacing={3}
                  className={classes.formContainer}
                  style={{ paddingTop: 0, marginTop: 0 }}
                >
                  <Grid
                    item
                    xs={12}
                    //className={classes.threeColEqual}
                    style={{ marginTop: 8 }}
                  >
                    <InputLabel
                      className={classes.inputLabel}
                      style={{ marginBottom: 10 }}
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
                      classNames={{
                        root: errors.users
                          ? classes.tagsWrapErr
                          : classes.tagsWrap,
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
                            handleUserFieldChange(
                              "username",
                              event.target.value
                            )
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
                  <Grid
                    container
                    item
                    spacing={3}
                    className={classes.formContainer}
                    style={{ marginTop: -10 }}
                  >
                    <Grid item xs={12}>
                      {/* <InputLabel className={classes.inputLabel}>Subject</InputLabel> */}
                      <TextField
                        label="Subject"
                        id="outlined-bare"
                        className={classes.textField}
                        margin="dense"
                        variant="outlined"
                        error={getMsg(errors.subject, t)}
                        fullWidth
                        inputProps={{ "aria-label": "bare" }}
                        placeholder="Subject"
                        onChange={(event) =>
                          handleChange(event.target.value, "subject")
                        }
                        value={state && state.subject}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    spacing={3}
                    className={classes.formContainer}
                    style={{ marginTop: -10 }}
                  >
                    <Grid
                      item
                      xs={4}
                      className={classes.fiveCol}
                      style={{ paddingRight: 0 }}
                    >
                      {/* <InputLabel className={classes.inputLabel}>
                                                Day
                                            </InputLabel> */}
                      <DatePicker
                        placeholderText={"Day"}
                        onFocus={(e) => (e.target.placeholder = "")}
                        onBlur={(e) => (e.target.placeholder = "Day")}
                        format="MM/DD/YYYY"
                        selected={state && state.day && new Date(state.day)}
                        onChange={(date) => handleChange(date, "day")}
                        minDate={new Date()}
                        customInput={
                          <TextField
                            error={getMsg(errors.day, t)}
                            id="outlined-dense-multiline"
                            margin="dense"
                            label="Day"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment>
                                  <CalendarToday
                                    style={{ height: 16, width: 16 }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      {/* <InputLabel className={classes.inputLabel}>Start Time</InputLabel> */}
                      <TextField
                        select
                        style={{ marginTop: 8 }}
                        fullWidth
                        onChange={(event) =>
                          handleChange(event.target.value, "fromtime")
                        }
                        margin="dense"
                        label="Start Time"
                        variant="outlined"
                        value={(state && state.fromtime) || "Select"}
                        error={getMsg(errors.fromtime, t)}
                      >
                        {time &&
                          time.map((item, index) => (
                            <MenuItem selected key={index} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={4}>
                      {/* <InputLabel className={classes.inputLabel}>End Time</InputLabel> */}
                      <TextField
                        label="End Time"
                        select
                        variant="outlined"
                        style={{ marginTop: 8 }}
                        fullWidth
                        onChange={(event) =>
                          handleChange(event.target.value, "totime")
                        }
                        margin="dense"
                        value={(state && state.totime) || "Select"}
                        error={getMsg(errors.totime, t)}
                        margin="dense"
                        input={
                          <OutlinedInput
                            labelWidth="0"
                            name="age"
                            id="outlined-age-simple"
                          />
                        }
                      >
                        {time &&
                          time.map((item, index) => (
                            <MenuItem selected key={index} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                      </TextField> 
                    </Grid>
                    <Grid item xs={12} style={{flex:'1', textAlign:'right', marginTop:-20}}><InputLabel className={classes.inputLabel} style={{fontSize:'0.8rem'}}><i>Time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone +' - '+ new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]}</i></InputLabel></Grid>
                  
                  </Grid>
                  <Grid
                    container
                    item
                    spacing={3}
                    className={classes.formContainer}
                    style={{ marginTop: -20 }}
                  >
                    <Grid item xs={12}>
                      {/* <InputLabel className={classes.inputLabel}>Message</InputLabel> */}
                      {/* <TextField
                                                 InputLabelProps={{
                                                    shrink: true
                                                  }}
                                                label="Message"
                                                id="outlined-bare"
                                                className={classes.textField}
                                                margin="dense"
                                                variant="outlined"
                                                error={getMsg(errors.message, t)}
                                                fullWidth
                                                inputProps={{ 'aria-label': 'bare' }}
                                                placeholder="Message"
                                                multiline
                                                rows={2}
                                                rowsMax={4}
                                                value={state && state.message}
                                                onChange={event => handleChange(event.target.value, 'message')}
                                            /> */}
                      <MuiThemeProvider theme={theme}>
                        <MUIRichTextEditor
                          label="Message"
                          key={key}
                          margin="dense"
                          variant="outlined"
                          error={getMsg(errors.message, t)}
                          placeholder="Message"
                          value={message}
                          onChange={(event) => handleChange(event, "message")}
                        />
                      </MuiThemeProvider>
                    </Grid>
                  </Grid>
                </Grid>
              </PerfectScrollbar>
            </div>
          </Grid>
          {dialogue()}
          <Grid item xs={6} md={6}>
            <Calendar
              scrollToTime={
                state.fromtime
                  ? new Date(
                      `${state.day.toLocaleDateString()} ${state.fromtime}`
                    )
                  : new Date()
              }
              localizer={localizer}
              events={timeslot}
              views={["day"]}
              style={{ fontFamily: "Lato" }}
              defaultDate={new Date()}
              date={state && state.day && new Date(state.day)}
              eventPropGetter={(event, start, end, isSelected) => {
                return {
                  style: {
                    backgroundColor: "#60ce8c",
                    borderColor: "#60ce8c",
                    color: "#000",
                  },
                };
              }}
              onNavigate={(date) => {
                setState({ ...state, day: date });
              }}
              style={{ maxHeight: "56vh" }}
              messages={{
                previous: <ArrowLeft style={{ height: 16, width: 16 }} />,
                next: <ArrowRight style={{ height: 16, width: 16 }} />,
                today: <CalendarToday style={{ height: 16, width: 16 }} />,
              }}
              defaultView={"day"}
            />
          </Grid>
        </div>
        <Grid
          item
          xs={12}
          className={classes.modalFooter}
          style={{ marginTop: 10 }}
        >
          <Button
            onClick={() => {
              setAlert(true);
            }}
            variant="contained"
            className={classes.modalBtnSecondary}
          >
            {t("cancel")}
          </Button>{" "}
          &nbsp;
          {
            loading ? <CircularProgress className={classes.progress} /> : <Button
              onClick={() => { 
                handleSubmit();
              }}
              variant="contained"
              //color="secondary"
              className={classes.modalBtnPrimary}
            >
              Send
            </Button>
          }

        </Grid>
        <MessageBox
          open={success}
          variant="success"
          onClose={() => {
            setSuccess(false);
          }}
          message={t("succMsg.interviewerAssignedSuccessfully")}
        />
        <MessageBox
          open={errMsg}
          variant="error"
          onClose={handleClose}
          message={errMsg}
        />
      </Box>
    </Box>
  );
};

const mapDispatchToProps = {
  addUser,
  getInterviewersByPanel,
  getInterviewersSchedulebyDate,
  getInterviewersByApplicantId,
  saveApplicantInterviewers,
  getCandidateSchedulebyJob,
  deleteApplicantInterviewers,
  removeApplicantInterviewers,
  loadUsers, 
};

const mapStateToProps = (state) => ({
  panelMembers: state.jobApplication && state.jobApplication.panelMembers,
  applicantInterviewers:
    state.jobApplication && state.jobApplication.applicantInterviewers,
  candidateSchedule:
    state.jobApplication && state.jobApplication.candidateSchedule,
  user: state.admin && state.admin.newuser,
  interviewSchedule:
    state.jobApplication && state.jobApplication.interviewSchedule,
  profile: state.profile,
  interviewers: state.admin && state.admin.users,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AssignInterviewer))
);
