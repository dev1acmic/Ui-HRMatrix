import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

// Externals
//import classNames from "classnames";

import { withStyles, MenuItem } from "@material-ui/core";
import { Prompt } from "react-router-dom";
import { connect } from "react-redux";
//import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";
// Material helpers
//import { createMuiTheme } from "@material-ui/core";

// Material components
import {
  Edit,
  Done,
  Clear,
  DeleteOutlined,
  NewReleasesTwoTone,
} from "@material-ui/icons";
import {
  Grid,
  TextField,
  FormLabel,
  Button,
  Select,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Modal,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import MessageBox from "util/messageBox";
// Component styles
import styles from "../../../JobPost/components/styles";
import { ViewQuestions } from "../../../Modals/";

import {
  getJobApplicationsById,
  saveApplication,
  deleteApplEducation,
  deleteApplEmployers,
} from "services/jobApplication/action";
import { Month, Competency } from "util/enum";
//const ITEM_HEIGHT = 48;
//const ITEM_PADDING_TOP = 8;

const Competancy = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      saveJobCompetency,
      isBlocking,
      clearUnsavedData,
    };
  });
  const { t } = useTranslation(["jobApplication", "common", "enum"]);
  const initialState = {
    skillRows: [{ exp: "", competency: "" }],
    educationRows: [{ institution: "", year: "", gpa: "" }],
    certificatonRows: [{ has: 0, year: "" }],
    screeningRows: [],
    employmentRows: [
      {
        company: "",
        title: "",
        strtYear: null,
        strtMonth: null,
        endYear: null,
        endMonth: null,
        isCurrentJob: false,
      },
    ],
    errors: {},
  };
  const { classes } = props;
  let [values, setValues] = useState(initialState);
  let [isBlocking, setIsBlocking] = useState(false);
  const [errors, setErrors] = useState(initialState.errors);
  const [isValid, setValid] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [succMsg, setSuccMsg] = useState(false);
  const [alert, setAlert] = useState(false);
  const [delMod, setDelMod] = useState(false);
  const [open, setOpen] = useState(false);
  const [screeningItem, setScreeningItem] = useState(false);
  let [screeningAns, setscreeningAns] = useState([]);
  const [jobApplication, setJobApplication] = useState([]);
  let [skillRows, setSkillRows] = useState(initialState.skillRows);
  let [educationRows, setEducationRows] = useState(initialState.educationRows);
  let [certificatonRows, setCertificatonRows] = useState(
    initialState.certificatonRows
  );
  let [screeningRows, setScreeningRows] = useState(initialState.screeningRows);
  let [employmentRows, setEmploymentRows] = useState(
    initialState.employmentRows
  );

  validate.validators.array = (arrayItems, itemConstraints) => {
    const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
      let error = validate(item, itemConstraints);
      if (error) {
        values.inValid = false;
        errors[index] = { error: error };
      }

      if (!error && item.gpa) {
        //const reg = /^(?!0?0\.00$)\d{1,2}\.\d{2}$/;
        let valid = parseInt(item.gpa) <= 10;
        if (valid) {
          values.gpaErr = false;
        }
        if (!valid) {
          error = {};
          error.gpa = [t("common:errMsg.validGPA")];
          errors[index] = { error: error };
          values.gpaErr = true;
          values.inValid = true;
          setErrMsg(true);
          setErrMsg(t("common:errMsg.validGPA"));
        }
      }

      if (!error && item.year && !values.gpaErr) {
        let valid =
          parseInt(item.year) > 1947 &&
          parseInt(item.year) <= new Date().getFullYear();

        if (!valid) {
          error = {};
          error.year = [t("common:errMsg.validYear")];
          errors[index] = { error: error };
          values.inValid = true;
          setErrMsg(true);
          setErrMsg(t("common:errMsg.validYear"));
        }
      }

      if (!error && item.strtYear && !values.gpaErr) {
        let valid =
          parseInt(item.strtYear) > 1947 &&
          parseInt(item.strtYear) <= new Date().getFullYear();

        if (!valid) {
          error = {};
          error.strtYear = [t("common:errMsg.validYear")];
          errors[index] = { error: error };
          values.inValid = true;
          setErrMsg(true);
          setErrMsg(t("common:errMsg.validYear"));
        }
      }

      if (!error && item.endYear && !values.gpaErr) {
        let valid =
          parseInt(item.endYear) > 1947 &&
          parseInt(item.endYear) <= new Date().getFullYear();

        if (!valid) {
          error = {};
          error.endYear = [t("common:errMsg.validYear")];
          errors[index] = { error: error };
          values.inValid = true;
          setErrMsg(true);
          setErrMsg(t("common:errMsg.validYear"));
        }
      }

      if (!error && item.has) {
        if (item.has === 1 && (item.year === "" || item.year === null)) {
          error = {};
          error.year = [t("common:errMsg.validCertYear")];
          errors[index] = { error: error };
          values.inValid = true;
          setErrMsg(true);
          setErrMsg(t("common:errMsg.validCertYear"));
        }
      }

      if (!error && item.isAvailable === 1) {
        error = {};

        if (item.gpa === "") {
          error.gpa = [t("common:errMsg.validGPA")];
          errors[index] = { error: error };
          values.gpaErr = true;
          values.inValid = true;
          setErrMsg(true);
          setErrMsg(t("common:errMsg.validGPA"));
        }
        if (item.year === "") {
          error.year = [t("common:errMsg.validYear")];
          errors[index] = { error: error };
          values.inValid = true;
          setErrMsg(true);
          setErrMsg(t("common:errMsg.validYear"));
        }
        if (item.institution === "") {
          error.institution = [t("common:errMsg.validInstitution")];
          errors[index] = { error: error };
          values.inValid = true;
          setErrMsg(true);
          setErrMsg(t("common:errMsg.validInstitution"));
        }
      }

      if (!error && item.name === "Management") {
        if (
          item.exp > 0 &&
          (item.competency === "0" || item.competency === 0)
        ) {
          error = {};
          error.competency = ["Please select a competency"];
          errors[index] = { error: error };
          values.inValid = true;
          setErrMsg(true);
          setErrMsg("Please select a competency");
        }
      }
      if (!error && item.company && item.company !== "") {
        if (
          !error &&
          item.endYear !== null &&
          item.endYear !== "" &&
          item.endYear < item.strtYear
        ) {
          error = {};
          error.endYear = [t("common:errMsg.yearAlert")];
          errors[index] = { error: error };
          values.inValid = true;
          setErrMsg(true);
          setErrMsg(t("common:errMsg.yearAlert"));
        }
        if (!error && item.endYear !== null && item.endYear === item.strtYear) {
          if (item.endMonth <= item.strtMonth) {
            error = {};
            error.endMonth = [t("common:errMsg.monthAlert")];
            errors[index] = { error: error };
            values.inValid = true;
            setErrMsg(true);
            setErrMsg(t("common:errMsg.monthAlert"));
          }
        }

        if (!error && (item.endYear === null || item.endYear === "")) {
          if (!error && !item.isCurrentJob) {
            error = {};
            error.isCurrentJob = [t("common:errMsg.currentJobAlert")];
            errors[index] = { error: error };
            values.inValid = true;
            setErrMsg(true);
            setErrMsg(t("common:errMsg.currentJobAlert"));
          }
        }
      }

      return errors;
    }, {});

    return arrayItemErrors.length === 0 ? null : arrayItemErrors;
  };

  const handleCloseAll = () => {
    setSuccMsg(false);
    setAlert(false);
    setErrMsg(false);
  };

  // const mergeByKey = (a1, a2) =>
  //   a1.map(itm => ({
  //     ...a2.find(item => item.key === itm.key && item),
  //     ...itm
  //   }));

  // function mergeByKey(a, b, prop) {
  //   let merged = [];

  //   for (let i = 0; i < a.length; i++) {
  //     merged.push({
  //       ...b[i],
  //       ...a.find(itmInner => itmInner[i] === b[i])
  //     });
  //   }
  //   return merged;
  // }

  function mergeByKey(a, b, prop) {
    let merged = [];

    for (let i = 0; i < a.length; i++) {
      merged.push(Object.assign(a[i], b[i]));
    }
    return merged;
  }

  useEffect(() => {
    if (props.jobApplication && props.jobApplication.id) {
      props.getJobApplicationsById(props.jobApplication.id);
    }
  }, []);

  useEffect(() => {
    if (props.jobApplication) {
      setJobApplication(props.jobApplication);

      if (props.jobPost) {
        assignValues(props.jobPost);
      }
    }
  }, [props.jobApplication]);

  const skillsMap = (skillRows) => {
    let skills = skillRows.map((t) => ({
      id: 0,
      name: t.name,
      competency: "",
      exp: "",
      jobskillId: t.id,
      mandatory: t.mandatory,
    }));

    if (
      props.jobApplication &&
      props.jobApplication.jobskills &&
      props.jobApplication.jobskills.length > 0
    ) {
      let appSkills = props.jobApplication.jobskills;

      skills = appSkills.map((item) => ({
        id: item.jobapplicantskills ? item.jobapplicantskills.id : 0,
        name: item.skill ? item.skill.name : "NA",
        competency: item.jobapplicantskills
          ? item.jobapplicantskills.competency
          : 0,
        exp: item.jobapplicantskills ? item.jobapplicantskills.exp : 0,
        jobskillId: item.id,
        mandatory: item.mandatory,
      }));
    }
    setSkillRows(skills);
  };

  const eduMap = (educations) => {
    let education = educations.map((t) => ({
      id: t.cndEduId || 0,
      jobeduqualificationId: t.id,
      qualification: t.qualification,
      additionalInfo: t.additionalInfo,
    }));

    if (
      props.jobApplication &&
      props.jobApplication.jobapplicantedus &&
      props.jobApplication.jobapplicantedus.length > 0
    ) {
      setEducationRows(props.jobApplication.jobapplicantedus);
    } else {
      // education = mergeByKey(
      //   educationRows,
      //   props.jobApplication.jobapplicantedus
      // );
      setEducationRows(education);
    }
  };

  const certfMap = (certifications) => {
    let certification = certifications.map((t) => ({
      id: t.cndCertId || 0,
      jobcertificationId: t.id,
      name: t.name,
      mandatory: t.mandatory,
    }));

    if (
      props.jobApplication &&
      props.jobApplication.jobapplicantcerts &&
      props.jobApplication.jobapplicantcerts.length > 0
    ) {
      setCertificatonRows(props.jobApplication.jobapplicantcerts);
    } else {
      // certification = mergeByKey(
      //   certification,
      //   props.jobApplication.jobapplicantcerts,
      //   "jobcertificationId"
      // );
      setCertificatonRows(certification);
    }
  };

  const screenMap = (screening) => {
    if (props.jobApplication && props.jobApplication.jobscreeningchoices) {
      let answers = [];
      props.jobApplication.jobscreeningchoices.map((item) => {
        let index = answers.findIndex((c) => c.id === item.jobscreeningqtnId);
        if (index !== -1) {
          answers[index].ans = [...answers[index].ans, item.id];
        } else {
          answers.push({ id: item.jobscreeningqtnId, ans: [item.id] });
        }
      });
      setscreeningAns(answers);
    }
  };

  const employmentMap = (employers) => {
    if (employers && employers.length > 0) {
      let answers = [];
      let employment = employers.map((item) => ({
        company: item.company || "",
        title: item.title || "",
        strtYear: item.strtYear || null,
        strtMonth: item.strtMonth || null,
        endYear: item.endYear || null,
        endMonth: item.endMonth || null,
        isCurrentJob: item.isCurrentJob === 0,
      }));
      setEmploymentRows(employment);
    }
  };

  useEffect(() => {
    if (props.jobPost) {
      assignValues(props.jobPost);
    }
  }, [props.jobPost]);

  const assignValues = (jobDet) => {
    if (jobDet.jobskills) {
      skillsMap(jobDet.jobskills);
    }

    if (jobDet.jobeduqualifications) {
      eduMap(jobDet.jobeduqualifications);
    }

    if (jobDet.jobcertifications) {
      certfMap(jobDet.jobcertifications);
    }

    if (jobDet.jobscreeningqtns) {
      setScreeningRows(jobDet.jobscreeningqtns);
      screenMap(jobDet.jobscreeningqtns);
    }

    if (
      props.jobApplication &&
      props.jobApplication.jobapplicantemployers &&
      props.jobApplication.jobapplicantemployers.length > 0
    ) {
      setEmploymentRows(props.jobApplication.jobapplicantemployers);
      // employmentMap(props.jobApplication.jobapplicantemployers);
    }
  };

  const validateForm = async (c) => {
    values.skillRows = skillRows;
    values.certificatonRows = certificatonRows;
    values.educationRows = educationRows;
    values.employmentRows = employmentRows;
    let errors = await validate(values, schema, c);
    if (!c) {
      if (
        errors &&
        errors.skillRows &&
        Object.entries(errors.skillRows[0]).length ===
          values.skillRows.length &&
        errors &&
        errors.employmentRows &&
        Object.entries(errors.employmentRows[0]).length ===
          values.employmentRows.length
      ) {
        setAlert(true);
        setAlert(this.props.t("common:errMsg.infoNotAdded"));
        return false;
      }
      return true;
    } else {
      if (!errors && (!screeningAns || screeningAns.length === 0)) {
        if (!errors) {
          errors = {};
        }
        errors.screeningAns = [""];
        setErrors(errors || {});
        setAlert(true);
        setAlert(t("common:errMsg.screeningQnEmpty"));
        return false;
      }

      handleClose();
      setErrors(errors || {});
      let valid = errors ? false : true;
      setValid(valid);

      if (!valid) {
        if (!values.inValid) {
          setErrMsg(false);
          setAlert(true);
          setAlert(t("common:errMsg.fillReqInfo"));
        }

        setValues({
          ...values,
        });
      }
      return valid;
    }
  };

  const saveJobCompetency = async (c) => {
    const data = {};
    setErrMsg(false);
    const isValid = await validateForm(c);
    if (isValid) {
      if (c) {
        return saveComp(data);
      } else {
        setErrors(undefined || {});
        return saveComp(data);
      }
    }
  };

  const saveComp = async (data) => {
    data.id =
      props.jobApplication && props.jobApplication.id
        ? props.jobApplication.id
        : 0;
    if (screeningAns && screeningAns.length > 0) {
      data.screeningAns = screeningAns
        .map(function (val) {
          return val.ans;
        })
        .reduce(function (res, ans) {
          return res.concat(ans);
        });
    }
    data.skillRows = skillRows;
    data.educationRows = educationRows;
    data.certificatonRows = certificatonRows;
    if (employmentRows && employmentRows.length > 0) {
      let employment = [...employmentRows];
      const index = employment.findIndex((c) => c.isCurrentJob === true);
      if (index !== -1) {
        const currentJob = employment.filter(
          (item) => item.isCurrentJob === true
        )[0];
        if (currentJob.endMonth !== null && currentJob.endYear !== null) {
          currentJob.endMonth = null;
          currentJob.endYear = null;
          employment[index] = currentJob;
        }
      }
      data.employmentRows = employment;
    }

    data.status = 0;
    data.jobpostId = props.jobId;
    let errors = await validate(values, schema);
    setErrMsg(false);
    let valid = errors ? false : true;
    let splitTabs = [];
    if (props.jobApplication && props.jobApplication.tab) {
      splitTabs = props.jobApplication.tab.split(",");
      splitTabs[1] = valid ? 1 : 0;
      splitTabs[2] = splitTabs[0] || splitTabs[1] === 0 ? 0 : 1;
      data.tab = splitTabs.toString();
    } else {
      data.tab = valid ? "0,1,0" : "0,0,0";
    }
    let res = await props.saveApplication(data);

    if (res) {
      if (props.jobApplication && props.jobApplication.id) {
        props.getJobApplicationsById(props.jobApplication.id);
      }

      setSuccMsg(true);
      setIsBlocking(false);
      return [res, valid];
    }
  };

  const handleOpen = (idx) => () => {
    const newscreeningRows = [...screeningRows];
    const screeningItem = newscreeningRows[idx];
    const id = screeningItem.id;
    let item = screeningAns.find((c) => c.id === id);
    let selectedChoice = [];
    if (item) {
      selectedChoice = item.ans;
    }
    screeningItem.selectedChoice = selectedChoice;
    setOpen(true);
    setScreeningItem(screeningItem);
  };

  const handleClose = () => {
    setScreeningItem(null);
    setOpen(false);
  };

  const savePreScreeningChoices = (id, data) => {
    setIsBlocking(true);
    const ans = { id, ans: data };
    let newscreeningAns = [...screeningAns];
    let index = newscreeningAns.findIndex((c) => c.id === id);
    if (index !== -1) {
      newscreeningAns[index].ans = data;
    } else {
      newscreeningAns = newscreeningAns.concat(ans);
    }
    setscreeningAns(newscreeningAns);
    handleClose();
  };

  const handleChangeSkill = (idx, field, value) => {
    const newState = [...skillRows];
    const re = /^[+?0-9\b]+$/;
    if (field === "exp" && value && !re.test(value)) {
      value = newState[idx][field] || "";
    }

    newState[idx] = { ...newState[idx], [field]: value };

    setSkillRows(newState);
    if (value) {
      setIsBlocking(true);
    }
  };

  const handleChangeEdu = (idx, field, value) => {
    const newState = [...educationRows];
    const re = /^[+?0-9\b]+$/;
    const gpre = /^\d*\.?\d*$/;
    if (field === "year" && value && !re.test(value)) {
      value = newState[idx][field] || "";
    }
    if (field === "gpa" && value && !gpre.test(value)) {
      value = newState[idx][field] || "";
    }
    if (field === "isAvailable") {
      value = value === "1" ? 0 : 1;
    }
    newState[idx] = { ...newState[idx], [field]: value };

    setEducationRows(newState);
    if (value) {
      setIsBlocking(true);
    }
  };

  const clearUnsavedData = () => {
    let screen = initialState.screeningRows;
    let emp = initialState.employmentRows;

    skillsMap(props.jobPost.jobskills);
    eduMap(props.jobPost.jobeduqualifications);
    certfMap(props.jobPost.jobcertifications);

    if (props.jobApplication && props.jobApplication.jobapplicantscreeningans) {
      screen = props.jobApplication.jobapplicantscreeningans;
    }
    setscreeningAns(screen);

    if (props.jobApplication && props.jobApplication.jobapplicantemployers) {
      emp = props.jobApplication.jobapplicantemployers;
    }
    setEmploymentRows(emp);
  };

  const handleChangeCert = (idx, field, value) => {
    const newState = [...certificatonRows];
    const re = /^[+?0-9\b]+$/;
    if (field === "year" && value && !re.test(value)) {
      value = newState[idx][field] || "";
    }
    if (field === "has") {
      value = value === "1" ? 0 : 1;
    }
    newState[idx] = { ...newState[idx], [field]: value };

    setCertificatonRows(newState);
    if (value) {
      setIsBlocking(true);
    }
  };

  const handleChangeEmp = (idx, field, value) => {
    const newState = [...employmentRows];
    const re = /^[+?0-9\b]+$/;
    if (
      (field === "strtYear" || field === "endYear") &&
      value &&
      !re.test(value)
    ) {
      value = newState[idx][field] || "";
    }

    newState[idx] = { ...newState[idx], [field]: value };

    setEmploymentRows(newState);
    if (value) {
      setIsBlocking(true);
    }
  };

  const handleCurrentJobChange = (idx, field, event) => {
    let emp = [];
    if (employmentRows && employmentRows.length > 0) {
      let employment = employmentRows.map((item) => ({
        id: item.id || null,
        company: item.company || "",
        title: item.title || "",
        strtYear: item.strtYear || null,
        strtMonth: item.strtMonth || null,
        endYear: item.endYear || null,
        endMonth: item.endMonth || null,
        isCurrentJob:
          item.isCurrentJob === 0 /**To uncheck already set current jobs */,
      }));
      emp.push(employment);
    }
    const newState = [...emp[0]];
    if (field === "isCurrentJob") {
      newState[field] = event.target.checked;
      newState[idx][field] = event.target.checked;
    }
    setEmploymentRows(newState);
  };

  const handleAdd = (row) => {
    if (row === 2) {
      const eduRow = {
        institution: "",
        isAvailable: 1,
        year: "",
        gpa: "",
      };
      setEducationRows([...educationRows, eduRow]);
    }
    if (row === 3) {
      const certRow = {
        name: "",
        mandatory: false,
        has: 1,
        year: "",
      };
      setCertificatonRows([...certificatonRows, certRow]);
    }
    if (row === 5) {
      const empRow = {
        company: "",
        title: "",
        strtYear: null,
        strtMonth: null,
        endYear: null,
        endMonth: null,
        isCurrentJob: false,
      };
      setEmploymentRows([...employmentRows, empRow]);
    }
  };

  const handleDelete = (idx, row) => {
    if (row === 2) {
      setDelMod(true);
      setDelMod(t("common:errMsg.deleteEduAlert"));
      values.row = row;
      values.deleteId = idx;
    }

    if (row === 5) {
      setDelMod(true);
      setDelMod(t("common:errMsg.deleteEmployerAlert"));
      values.row = row;
      values.deleteId = idx;
    }
    setValues(values);
  };

  const handleCancel = () => {
    setDelMod(false);
  };

  const handleRemove = () => {
    if (values.row === 2) {
      const educations = [...educationRows];
      const education = educations[values.deleteId];
      if (education.id > 0) {
        props.deleteApplEducation(education.id);
      }
      educations.splice(values.deleteId, 1);
      setEducationRows(educations);
    }

    if (values.row === 5) {
      const employers = [...employmentRows];
      const employer = employers[values.deleteId];
      if (employer.id > 0) {
        props.deleteApplEmployers(employer.id);
      }
      if (employers.length === 1) {
        setEmploymentRows(initialState.employmentRows);
      } else {
        employers.splice(values.deleteId, 1);
        setEmploymentRows(employers);
      }
    }
    setDelMod(false);
    setSuccMsg(true);
    setSuccMsg("Removed Successfully!");
  };

  return (
    <Fade in="true" timeout="10">
      <div>
        <Grid container xs={12} sm={12}>
          <Prompt when={isBlocking} message={t("common:errMsg.unsavedAlert")} />
          <Grid container item xs={12}>
            <FormLabel className={classes.formHeader}>
              {t("competency.competencies")}
            </FormLabel>
            <Paper style={{ width: "100%" }}>
              <PerfectScrollbar>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHead}>
                        {t("competency.skillToolDomain")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        align="center"
                        style={{ width: 90 }}
                      >
                        {t("competency.mandatory")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        align="center"
                        style={{ width: 100 }}
                      >
                        {t("experienceYrs")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        align="center"
                        style={{ width: 150 }}
                      >
                        {t("competency.competency")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {skillRows && skillRows.length === 0 && (
                      <TableRow>
                        <TableCell>{t("common:noDataAvailable")}</TableCell>
                      </TableRow>
                    )}
                    {skillRows.map((item, idx) => (
                      <TableRow hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="center">
                          {item.mandatory ? (
                            <Done color="secondary" />
                          ) : (
                            <Clear color="error" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            id="outlined-bare"
                            className={classes.textField}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            inputProps={{ "aria-label": "bare", maxlength: 2 }}
                            placeholder="Ex: 5"
                            style={{ minWidth: 100 }}
                            error={
                              errors.skillRows &&
                              errors.skillRows[0][idx] &&
                              getMsg(errors.skillRows[0][idx].error.exp, t)
                            }
                            value={item.exp || ""}
                            onChange={(event) =>
                              handleChangeSkill(idx, "exp", event.target.value)
                            }
                            onFocus={(e) => (e.target.placeholder = "")}
                            onBlur={(e) => (e.target.placeholder = "Ex: 5")}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Select
                            fullWidth
                            margin="dense"
                            input={
                              <OutlinedInput
                                labelWidth="0"
                                name="competency"
                                id="outlined-age-simple"
                              />
                            }
                            error={
                              errors.skillRows &&
                              errors.skillRows[0][idx] &&
                              getMsg(
                                errors.skillRows[0][idx].error.competency,
                                t
                              )
                            }
                            value={item.competency || "0"}
                            onChange={(event) =>
                              handleChangeSkill(
                                idx,
                                "competency",
                                event.target.value
                              )
                            }
                          >
                            <MenuItem value="0">{t("common:select")}</MenuItem>
                            {Competency.getKeyValuePairs().map((item) => {
                              return (
                                <MenuItem value={item.value}>
                                  {t(`${item.name}`)}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </PerfectScrollbar>
            </Paper>
            <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}></Grid>
          </Grid>
        </Grid>
        <br></br>

        <Grid container xs={12} sm={12}>
          <Grid container item xs={12}>
            <FormLabel className={classes.formHeader}>
              {t("competency.education")}
            </FormLabel>
            <Paper style={{ width: "100%" }}>
              <PerfectScrollbar>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHead}>
                        {t("competency.educationalQualification")}
                      </TableCell>
                      <TableCell className={classes.tableHead}>
                        {t("competency.additionalInfo")}
                      </TableCell>
                      <TableCell className={classes.tableHead}>
                        {t("competency.available")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 200 }}
                      >
                        {t("competency.schoolInstitution")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 130 }}
                      >
                        {t("competency.year")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 150 }}
                      >
                        {t("competency.gpa")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 150 }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {educationRows && educationRows.length === 0 && (
                      <TableRow>
                        <TableCell>{t("common:noDataAvailable")}</TableCell>
                      </TableRow>
                    )}
                    {educationRows.map((item, idx) => (
                      <TableRow hover>
                        <TableCell>
                          {item.jobeduqualificationId ? (
                            item.qualification
                          ) : (
                            <TextField
                              id="outlined-bare"
                              className={classes.textField}
                              margin="dense"
                              variant="outlined"
                              fullWidth
                              inputProps={{
                                "aria-label": "bare",
                                maxlength: 100,
                              }}
                              placeholder={t("qualificationDet")}
                              error={
                                errors.educationRows &&
                                errors.educationRows[0][idx] &&
                                getMsg(
                                  errors.educationRows[0][idx].error
                                    .qualification,
                                  t
                                )
                              }
                              value={item.qualification || ""}
                              onFocus={(e) => (e.target.placeholder = "")}
                              onBlur={(e) =>
                                (e.target.placeholder = t("qualificationDet"))
                              }
                              onChange={(event) =>
                                handleChangeEdu(
                                  idx,
                                  "qualification",
                                  event.target.value
                                )
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {item.jobeduqualificationId ? (
                            item.additionalInfo
                          ) : (
                            <TextField
                              id="outlined-bare"
                              className={classes.textField}
                              margin="dense"
                              variant="outlined"
                              fullWidth
                              inputProps={{
                                "aria-label": "bare",
                                maxlength: 100,
                              }}
                              placeholder={t("competency.additionalInfo")}
                              error={
                                errors.educationRows &&
                                errors.educationRows[0][idx] &&
                                getMsg(
                                  errors.educationRows[0][idx].error
                                    .additionalInfo,
                                  t
                                )
                              }
                              value={item.additionalInfo || ""}
                              onFocus={(e) => (e.target.placeholder = "")}
                              onBlur={(e) =>
                                (e.target.placeholder = t(
                                  "competency.additionalInfo"
                                ))
                              }
                              onChange={(event) =>
                                handleChangeEdu(
                                  idx,
                                  "additionalInfo",
                                  event.target.value
                                )
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={item.isAvailable === 1 ? true : false}
                            color="primary"
                            error={
                              errors.educationRows &&
                              errors.educationRows[0][idx] &&
                              getMsg(
                                errors.educationRows[0][idx].error.isAvailable,
                                t
                              )
                            }
                            value={item.isAvailable}
                            onFocus={(e) => (e.target.placeholder = "")}
                            onChange={(event) =>
                              handleChangeEdu(
                                idx,
                                "isAvailable",
                                event.target.value
                              )
                            }
                          />
                        </TableCell>

                        <TableCell align="center">
                          <TextField
                            id="outlined-bare"
                            className={classes.textField}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            inputProps={{
                              "aria-label": "bare",
                              maxlength: 100,
                            }}
                            placeholder={t("competency.schoolInstitution")}
                            error={
                              errors.educationRows &&
                              errors.educationRows[0][idx] &&
                              getMsg(
                                errors.educationRows[0][idx].error.institution,
                                t
                              )
                            }
                            value={item.institution || ""}
                            onFocus={(e) => (e.target.placeholder = "")}
                            onBlur={(e) =>
                              (e.target.placeholder = t(
                                "competency.schoolInstitution"
                              ))
                            }
                            onChange={(event) =>
                              handleChangeEdu(
                                idx,
                                "institution",
                                event.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                              <TextField
                                id="outlined-bare"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                  "aria-label": "bare",
                                  maxlength: 4,
                                }}
                                placeholder={t("competency.yyyy")}
                                error={
                                  errors.educationRows &&
                                  errors.educationRows[0][idx] &&
                                  getMsg(
                                    errors.educationRows[0][idx].error.year,
                                    t
                                  )
                                }
                                value={item.year || ""}
                                onFocus={(e) => (e.target.placeholder = "")}
                                onBlur={(e) =>
                                  (e.target.placeholder = t("competency.yyyy"))
                                }
                                onChange={(event) =>
                                  handleChangeEdu(
                                    idx,
                                    "year",
                                    event.target.value
                                  )
                                }
                              />
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            id="outlined-bare"
                            className={classes.textField}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            inputProps={{ "aria-label": "bare", maxlength: 3 }}
                            placeholder="Ex: 5"
                            error={
                              errors.educationRows &&
                              errors.educationRows[0][idx] &&
                              getMsg(errors.educationRows[0][idx].error.gpa, t)
                            }
                            value={item.gpa || ""}
                            onFocus={(e) => (e.target.placeholder = "")}
                            onBlur={(e) => (e.target.placeholder = "Ex: 5")}
                            onChange={(event) =>
                              handleChangeEdu(idx, "gpa", event.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            small
                            onClick={(event) => handleDelete(idx, 2)}
                            disabled={
                              idx === 0
                                ? item.jobeduqualificationId
                                  ? true
                                  : item.qualification ||
                                    item.additionalInfo ||
                                    item.institution
                                  ? false
                                  : true
                                : false
                            }
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </PerfectScrollbar>
            </Paper>
            <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.inlineBtn}
                onClick={(event) => handleAdd(2)}
              >
                {t("competency.add")}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid container xs={12} sm={12}>
          <Grid container item xs={12}>
            <br></br>
          </Grid>
        </Grid>
        <Grid container xs={12} sm={12}>
          <Grid container item xs={12}>
            <FormLabel className={classes.formHeader}>
              {t("competency.certification")}
            </FormLabel>
            <Paper style={{ width: "100%" }}>
              <PerfectScrollbar>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHead}>
                        {t("competency.certificate")}
                      </TableCell>
                      <TableCell
                        style={{ width: 90 }}
                        className={classes.tableHead}
                        align="center"
                      >
                        {t("competency.mandatory")}
                      </TableCell>
                      <TableCell
                        style={{ width: 90 }}
                        className={classes.tableHead}
                        align="center"
                      >
                        {t("competency.available")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 140 }}
                        align="center"
                      >
                        {t("competency.yearofCertification")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {certificatonRows && certificatonRows.length === 0 && (
                      <TableRow>
                        <TableCell>{t("common:noDataAvailable")}</TableCell>
                      </TableRow>
                    )}
                    {certificatonRows.map((item, idx) => (
                      <TableRow hover>
                        <TableCell>
                          {item.jobcertificationId ? (
                            item.name
                          ) : (
                            <TextField
                              id="outlined-bare"
                              className={classes.textField}
                              margin="dense"
                              variant="outlined"
                              fullWidth
                              inputProps={{
                                "aria-label": "bare",
                                maxlength: 100,
                              }}
                              placeholder={t("certplaceholder")}
                              style={{ minWidth: 100 }}
                              error={
                                errors.certificatonRows &&
                                errors.certificatonRows[0][idx] &&
                                getMsg(
                                  errors.certificatonRows[0][idx].error.name,
                                  t
                                )
                              }
                              value={item.name || ""}
                              onFocus={(e) => (e.target.placeholder = "")}
                              onBlur={(e) =>
                                (e.target.placeholder = t("certplaceholder"))
                              }
                              onChange={(event) =>
                                handleChangeCert(
                                  idx,
                                  "name",
                                  event.target.value
                                )
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {item.mandatory ? (
                            <Done color="secondary" />
                          ) : (
                            <Clear color="error" />
                          )}
                        </TableCell>

                        <TableCell>
                          <Switch
                            checked={item.has === 1 ? true : false}
                            color="primary"
                            error={
                              errors.certificatonRows &&
                              errors.certificatonRows[0][idx] &&
                              getMsg(
                                errors.certificatonRows[0][idx].error.has,
                                t
                              )
                            }
                            value={item.has}
                            onFocus={(e) => (e.target.placeholder = "")}
                            onChange={(event) =>
                              handleChangeCert(idx, "has", event.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            id="outlined-bare"
                            className={classes.textField}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            inputProps={{ "aria-label": "bare", maxlength: 4 }}
                            placeholder={t("competency.yyyy")}
                            style={{ minWidth: 100 }}
                            error={
                              errors.certificatonRows &&
                              errors.certificatonRows[0][idx] &&
                              getMsg(
                                errors.certificatonRows[0][idx].error.year,
                                t
                              )
                            }
                            value={item.year || ""}
                            onFocus={(e) => (e.target.placeholder = "")}
                            onBlur={(e) =>
                              (e.target.placeholder = t("competency.yyyy"))
                            }
                            onChange={(event) =>
                              handleChangeCert(idx, "year", event.target.value)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </PerfectScrollbar>
            </Paper>
            <Grid item xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.inlineBtn}
                onClick={(event) => handleAdd(3)}
              >
                {t("competency.add")}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid container xs={12} sm={12}>
          <Grid container item xs={12}>
            <FormLabel className={classes.formHeader}>
              {t("common:screeningquestions")}
            </FormLabel>
            <Paper style={{ width: "100%" }}>
              <PerfectScrollbar>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHead}>
                        {t("competency.questions")}
                      </TableCell>

                      <TableCell
                        className={classes.tableHead}
                        align="center"
                        style={{ width: 120 }}
                      >
                        {t("competency.setAnswer")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        align="center"
                        style={{ width: 35 }}
                      />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {screeningRows && screeningRows.length === 0 && (
                      <TableRow>
                        <TableCell>{t("common:noDataAvailable")}</TableCell>
                      </TableRow>
                    )}
                    {screeningRows.map((item, idx) => (
                      <TableRow>
                        <TableCell>{item.question}</TableCell>

                        <TableCell align="center">
                          <IconButton small>
                            <Edit onClick={handleOpen(idx)} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </PerfectScrollbar>
            </Paper>
            <Grid
              item
              xs={12}
              style={{ textAlign: "right", paddingTop: 10 }}
            ></Grid>
          </Grid>
        </Grid>

        <br></br>

        <Grid container xs={12} sm={12}>
          <Grid container item xs={12}>
            <FormLabel className={classes.formHeader}>
              {t("competency.employmentHistory")}
            </FormLabel>
            <Paper style={{ width: "100%" }}>
              <PerfectScrollbar>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHead}>
                        {t("competency.company")}
                      </TableCell>
                      <TableCell className={classes.tableHead}>
                        {t("common:title")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 230 }}
                      >
                        {t("competency.startDate")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 230 }}
                      >
                        {t("competency.endDate")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 230 }}
                        align="center"
                      >
                        {t("competency.currentJob")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 25 }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employmentRows && employmentRows.length > 0
                      ? employmentRows.map((item, idx) => (
                          <TableRow hover>
                            <TableCell>
                              <TextField
                                id="outlined-bare"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                  "aria-label": "bare",
                                  maxlength: 100,
                                }}
                                placeholder={t("competency.employerName")}
                                error={
                                  errors.employmentRows &&
                                  errors.employmentRows[0][idx] &&
                                  getMsg(
                                    errors.employmentRows[0][idx].error.company,
                                    t
                                  )
                                }
                                value={item.company || ""}
                                onFocus={(e) => (e.target.placeholder = "")}
                                onBlur={(e) =>
                                  (e.target.placeholder = t(
                                    "competency.employerName"
                                  ))
                                }
                                onChange={(event) =>
                                  handleChangeEmp(
                                    idx,
                                    "company",
                                    event.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                id="outlined-bare"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                  "aria-label": "bare",
                                  maxlength: 100,
                                }}
                                placeholder={t("common:designation")}
                                error={
                                  errors.employmentRows &&
                                  errors.employmentRows[0][idx] &&
                                  getMsg(
                                    errors.employmentRows[0][idx].error.title,
                                    t
                                  )
                                }
                                value={item.title || ""}
                                onFocus={(e) => (e.target.placeholder = "")}
                                onBlur={(e) =>
                                  (e.target.placeholder = t(
                                    "common:designation"
                                  ))
                                }
                                onChange={(event) =>
                                  handleChangeEmp(
                                    idx,
                                    "title",
                                    event.target.value
                                  )
                                }
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Select
                                    fullWidth
                                    value={item.strtMonth || "0"}
                                    margin="dense"
                                    style={{ marginTop: "8px" }}
                                    input={
                                      <OutlinedInput
                                        labelWidth="0"
                                        name="age"
                                        id="outlined-age-simple"
                                      />
                                    }
                                    error={
                                      errors.employmentRows &&
                                      errors.employmentRows[0][idx] &&
                                      getMsg(
                                        errors.employmentRows[0][idx].error
                                          .strtMonth,
                                        t
                                      )
                                    }
                                    onChange={(event) =>
                                      handleChangeEmp(
                                        idx,
                                        "strtMonth",
                                        event.target.value
                                      )
                                    }
                                  >
                                    <MenuItem value="0">
                                      {t("competency.month")}
                                    </MenuItem>
                                    {Month.getKeyValuePairs().map((item) => {
                                      return (
                                        <MenuItem value={item.value}>
                                          {t(`${item.name}`)}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    id="outlined-bare"
                                    className={classes.textField}
                                    margin="dense"
                                    variant="outlined"
                                    fullWidth
                                    inputProps={{
                                      "aria-label": "bare",
                                      maxlength: 4,
                                    }}
                                    placeholder={t("competency.yyyy")}
                                    error={
                                      errors.employmentRows &&
                                      errors.employmentRows[0][idx] &&
                                      getMsg(
                                        errors.employmentRows[0][idx].error
                                          .strtYear,
                                        t
                                      )
                                    }
                                    value={item.strtYear || ""}
                                    onFocus={(e) => (e.target.placeholder = "")}
                                    onBlur={(e) =>
                                      (e.target.placeholder = t(
                                        "competency.yyyy"
                                      ))
                                    }
                                    onChange={(event) =>
                                      handleChangeEmp(
                                        idx,
                                        "strtYear",
                                        event.target.value
                                      )
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </TableCell>
                            <TableCell align="center">
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Select
                                    fullWidth
                                    value={item.endMonth || "0"}
                                    margin="dense"
                                    style={{ marginTop: "8px" }}
                                    input={
                                      <OutlinedInput
                                        labelWidth="0"
                                        name="age"
                                        id="outlined-age-simple"
                                      />
                                    }
                                    error={
                                      errors.employmentRows &&
                                      errors.employmentRows[0][idx] &&
                                      getMsg(
                                        errors.employmentRows[0][idx].error
                                          .endMonth,
                                        t
                                      )
                                    }
                                    onChange={(event) =>
                                      handleChangeEmp(
                                        idx,
                                        "endMonth",
                                        event.target.value
                                      )
                                    }
                                  >
                                    <MenuItem value="0">
                                      {t("competency.month")}
                                    </MenuItem>
                                    {Month.getKeyValuePairs().map((item) => {
                                      return (
                                        <MenuItem value={item.value}>
                                          {t(`${item.name}`)}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <TextField
                                    id="outlined-bare"
                                    className={classes.textField}
                                    margin="dense"
                                    variant="outlined"
                                    fullWidth
                                    inputProps={{
                                      "aria-label": "bare",
                                      maxlength: 4,
                                    }}
                                    placeholder={t("competency.yyyy")}
                                    error={
                                      errors.employmentRows &&
                                      errors.employmentRows[0][idx] &&
                                      errors.employmentRows[0][idx].error
                                        .endYear
                                      // getMsg(
                                      //   errors.employmentRows[0][idx].error
                                      //     .endYear,
                                      //   t
                                      // )
                                    }
                                    value={item.endYear || ""}
                                    onFocus={(e) => (e.target.placeholder = "")}
                                    onBlur={(e) =>
                                      (e.target.placeholder = t(
                                        "competency.yyyy"
                                      ))
                                    }
                                    onChange={(event) =>
                                      handleChangeEmp(
                                        idx,
                                        "endYear",
                                        event.target.value
                                      )
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </TableCell>

                            <TableCell align="center">
                              <div
                                onChange={(event) =>
                                  handleCurrentJobChange(
                                    idx,
                                    "isCurrentJob",
                                    event
                                  )
                                }
                              >
                                <input
                                  type="radio"
                                  name="isCurrentJob"
                                  value={item.isCurrentJob}
                                  checked={
                                    item.isCurrentJob === 1 ||
                                    item.isCurrentJob === true
                                  }
                                  color="primary"
                                />
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                small
                                onClick={(event) => handleDelete(idx, 5)}
                                disabled={
                                  idx === 0
                                    ? item.company || item.title
                                      ? false
                                      : true
                                    : false
                                }
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      : ""}
                  </TableBody>
                </Table>
              </PerfectScrollbar>
            </Paper>
            <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.inlineBtn}
                onClick={(event) => handleAdd(5)}
              >
                {t("competency.add")}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Modal
          // style={{
          //   position: "absolute",
          //   top: "10%",
          //   left: "0",
          //   overflowY: "scroll",
          //   height: "100%",
          //   display: "block"
          // }}
          aria-labelledby={t("common:addScreeningQ")}
          aria-describedby={t("common:addScreeningQ")}
          open={open}
          onClose={handleClose}
        >
          <ViewQuestions
            screeningItem={screeningItem}
            onCancel={handleClose}
            savePreScreeningChoices={savePreScreeningChoices}
            isMatrix={false}
          />
        </Modal>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="confirmation-dialog-title"
          open={delMod}
        >
          <DialogTitle id="confirmation-dialog-title">
            {t("common:errMsg.remove")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {delMod}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              {t("common:cancel")}
            </Button>
            <Button onClick={handleRemove} color="primary">
              {t("common:ok")}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={alert}
          onClose={handleCloseAll}
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
            <Button onClick={handleCloseAll} color="primary" autoFocus>
              {t("common:ok")}
            </Button>
          </DialogActions>
        </Dialog>
        <MessageBox
          open={succMsg}
          variant="success"
          onClose={handleCloseAll}
          message={t("common:succMsg.savedSuccessfully")}
        />

        <MessageBox
          onClose={handleCloseAll}
          open={errMsg}
          variant="error"
          message={errMsg}
        />
      </div>
    </Fade>
  );
});
const mapDispatchToProps = {
  getJobApplicationsById: getJobApplicationsById,
  saveApplication: saveApplication,
  deleteApplEmployers: deleteApplEmployers,
  deleteApplEducation: deleteApplEducation,
};

const mapStateToProps = (state) => ({
  jobPost: (state.jobPost && state.jobPost.data) || null,
  jobApplication: (state.jobApplication && state.jobApplication.data) || null,
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(withStyles(styles)(Competancy));
