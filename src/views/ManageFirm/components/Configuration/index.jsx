import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
  Grid,
  Chip,
  FormLabel,
  Paper,
  Modal,
  //InputAdornment,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
  Select,
  Typography,
  MenuItem,
} from "@material-ui/core";
import { Edit, DeleteOutlined } from "@material-ui/icons";
import { connect } from "react-redux";
import { withRouter, Prompt } from "react-router-dom";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AddLocation, AddPanel } from "../../../Modals";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../../JobPost/components/styles";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

//import { CalendarToday } from "@material-ui/icons";
import {
  loadAddress,
  loadUsers,
  loadInterviewPanel,
  updateOrgConfig,
  loadStates,
  loadOrgConfig,
  deleteLocation,
  deletePanel,
  interviewPanelPromise,
  addressPromise,
  clearUser,
  deleteDepartment,
} from "services/admin/action";
import { loadDepartments } from "services/employer/action";
//import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";
import MessageBox from "util/messageBox";
import { Month } from "util/enum";
import ReactTags from "react-tag-autocomplete";

const sliderStyle = {
  position: "relative",
  width: "100%",
  height: 30,
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
      <div style={{ fontFamily: "Roboto", fontSize: 11, marginTop: -20 }}>
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

const Configuration = (props) => {
  const {
    classes,
    profile,
    addr,
    interviewPanel,
    panelMembers,
    orgconfig,
    states,
    deptList,
  } = props;
  const { t } = useTranslation(["common", "enum"]);
  const configState = {
    values: {
      orgId: profile.orgId,
      level: 1,
      FinStartMonth: "",
      FinEndMonth: "",
      addr: [],
      interviewPanels: [],
      panelMembers: [],
      addressItem: "",
      panelItem: "",
      showError: false,
      errMsg: "",
      errHeaderMsg: "",
      deleteIndex: "",
      departments: [],
      tagPlaceholder: t("typeDept"),
      preIntvSkillScore: 0,
      preIntvPreScreeningScore: 0,
      postIntvSkillScore: 0,
      postIntvPreScreeningScore: 0,
      totalPreIntvScore: 0,
      totalPostIntvScore: 0,
      showPreIntvError: false,
      showPostIntvError: false,
      msgError: "",
    },
    touched: {},
    errors: {
      level: 0,
      FinStartMonth: null,
      FinEndMonth: null,
    },
    modal: {
      open1: false,
      open2: false,
      panelDelete: false,
      locationDelete: false,
    },
    isValid: false,
    loading: false,
    submitError: null,
    suggestions: [],
  };

  let [values, setValues] = useState(configState.values);
  let [modal, setModals] = useState(configState.modal);
  let [isBlocking, setIsBlocking] = useState(false);
  const [errors, setErrors] = useState(configState.errors);
  const [errMsg, setErrMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setValid] = useState(false);
  const [touched, setTouched] = useState(configState.touched);
  const [suggestions, setSuggestions] = useState(null);
  const [showConfirmPopup, setshowConfirmPopup] = useState(false);
  let [deleteId, setdeleteId] = useState(0);

  function handleClose() {
    setErrMsg(false);
  }
  function handleCloseSuccess() {
    setSuccessMsg(false);
  }
  function handleOpen1() {
    setValues({ ...values, addressItem: "" });
    setModals({ open1: true });
  }
  function handleClose1() {
    setModals({ open1: false });
  }
  function handleOpen2() {
    setValues({ ...values, panelItem: "" });
    setModals({ open2: true });
  }
  function handleClose2() {
    setModals({ open2: false });
    props.clearUser();
  }

  // function handleIntvErrorClose() {
  //   this.setState({ showDialog: false });
  // };

  useEffect(() => {
    props.loadDepartments(profile.orgId);
    props.loadAddress(profile.orgId);
    props.loadUsers(profile.orgId, -1);
    props.loadInterviewPanel(profile.orgId);
    props.loadOrgConfig(profile.orgId);
  }, []);

  useEffect(() => {
    if (addr && addr.length > 0) {
      let address = [];
      addr.map((item) => {
        return address.push(item.address);
      });
      setValues({ ...values, addr: address });
    }
  }, [addr]);

  useEffect(() => {
    if (deptList) {
      values.departments = deptList || [];
    }
    if (deptList && deptList.length > 0) {
      let departments = [];
      deptList.map((item) => {
        departments.push({
          id: item.id,
          name: item.name,
          organizationId: item.organizationId,
        });
      });
      setSuggestions(departments);
    }
  }, [deptList]);

  useEffect(() => {
    if (panelMembers && panelMembers.length > 0) {
      setValues({
        ...values,
        panelMembers: panelMembers,
      });
    }
  }, [panelMembers]);
  useEffect(() => {
    if (interviewPanel && interviewPanel.length > 0) {
      setValues({
        ...values,
        interviewPanels: interviewPanel,
      });
    }
  }, [interviewPanel]);

  useEffect(() => {
    if (orgconfig && orgconfig.length > 0) {
      let newState = { ...values };
      orgconfig.map((c) => {
        if (c.key === "Level") {
          newState.level = c.value;
        }
        if (c.key === "FinStartMonth") {
          newState.FinStartMonth = c.value;
        }
        if (c.key === "FinEndMonth") {
          newState.FinEndMonth = c.value;
        }
        if (c.key === "PreIntvSkillScore") {
          newState.preIntvSkillScore = c.value;
        }
        if (c.key === "PreIntvPreScreeningScore") {
          newState.preIntvPreScreeningScore = c.value;
        }
        if (c.key === "PostIntvSkillScore") {
          newState.postIntvSkillScore = c.value;
        }
        if (c.key === "PostIntvPreScreeningScore") {
          newState.postIntvPreScreeningScore = c.value;
        }
        newState.totalPreIntvScore =
          Number(newState.preIntvSkillScore) +
          Number(newState.preIntvPreScreeningScore);
        newState.totalPostIntvScore =
          Number(newState.postIntvSkillScore) +
          Number(newState.postIntvPreScreeningScore);
      });
      setValues(newState);
    }
  }, orgconfig);

  function saveLocation(data) {
    if (data.idx || data.idx === 0) {
      values.addr[data.idx] = Object.assign(values.addr[data.idx], data);
    } else {
      setValues({
        ...values,
        addr: [...values.addr, data],
      });
    }
    data.organizationId = values.orgId;
    props.addressPromise(data);

    handleClose1();
    setErrMsg(false);
    setSuccessMsg(true);
    setSuccessMsg(t("succMsg.locationSavedSuccessfully"));
  }

  function savePanelMembers(data) {
    if (data.idx || data.idx === 0) {
      values.interviewPanels[data.idx] = Object.assign(
        values.interviewPanels[data.idx],
        data
      );
    } else {
      setValues({
        ...values,
        interviewPanels: [...values.interviewPanels, data],
      });
    }
    data.organizationId = values.orgId;
    props.interviewPanelPromise(data);
    handleClose2();
    setErrMsg(false);
    setSuccessMsg(true);
    setSuccessMsg(t("succMsg.panelSavedSuccessfully"));
  }

  function handleFieldChange(field, value) {
    if (field === "FinStartMonth") {
      // Logic to change end month when start month is selected
      const startMonth = parseInt(value);
      let endMonth = startMonth - 1;
      if (startMonth === 1) {
        endMonth = 12;
      }
      if (startMonth === 0) {
        endMonth = 0;
      }
      setValues({
        ...values,
        ["FinEndMonth"]: endMonth,
        ["FinStartMonth"]: startMonth,
      });
    } else {
      setValues({ ...values, [field]: value });
    }

    if (value) {
      setIsBlocking(true);
    }
  }

  function validateForm() {
    let errors = validate(values, schema);
    let errorMsg = "";
    let errorHeaderMsg = "";

    if (
      !errors &&
      (!values.interviewPanels || values.interviewPanels.length === 0)
    ) {
      if (!errors) {
        errors = {};
      }
      errors.interviewPanels = [""];
      errorMsg = "Interview Panel is empty.";
    }

    if (
      !errors &&
      values.FinStartMonth &&
      values.FinEndMonth &&
      values.FinStartMonth - values.FinEndMonth !== 1 &&
      values.FinStartMonth - values.FinEndMonth !== -11
    ) {
      if (!errors) {
        errors = {};
      }

      // if () {
      errors.FinStartMonth = [""];
      errors.FinEndMonth = [""];
      errorHeaderMsg = "Financial year is not valid";
      errorMsg = "Please make sure to mark a 12 month cycle.";
      // }
    }

    if ((!errors && !values.departments) || values.departments.length === 0) {
      if (!errors) {
        errors = {};
      }
      errors.departments = [""];
      errorMsg = t("common:errMsg.fillReqInfo");
    }

    if (!errors && values.totalPreIntvScore !== 100) {
      if (!errors) {
        errors = {};
      }
      errorMsg = t("common:errMsg.overallScoreShouldbe");
    }
    if (!errors && values.totalPostIntvScore !== 100) {
      if (!errors) {
        errors = {};
      }
      errorMsg = t("common:errMsg.overallScoreShouldbe");
    }

    setErrors(errors || {});
    let valid = errors ? false : true;
    setValid(valid);
    setErrMsg(false);
    setSuccessMsg(false);
    if (!valid) {
      setValues({
        ...values,
        showError: true,
        errMsg: errorMsg || t("common:errMsg.fillReqInfo"),
        errHeaderMsg: errorHeaderMsg || t("common:errMsg.incompleteInfo"),
      });
    }
    return valid;
  }

  function handleUpdateOrgConfig(c) {
    let finalSubmit = c ? validateForm() : true;
    if (finalSubmit) {
      setLoading(true);
      let orgConfig = [...props.orgconfig];
      if (orgConfig.length > 0) {
        if (orgConfig.findIndex((c) => c.key === "PreIntvSkillScore") === -1) {
          orgConfig.push({
            key: "PreIntvSkillScore",
            value: values.preIntvSkillScore,
            organizationId: values.orgId,
          });
        }
        if (
          orgConfig.findIndex((c) => c.key === "PreIntvPreScreeningScore") ===
          -1
        ) {
          orgConfig.push({
            key: "PreIntvPreScreeningScore",
            value: values.preIntvPreScreeningScore,
            organizationId: values.orgId,
          });
        }
        if (orgConfig.findIndex((c) => c.key === "PostIntvSkillScore") === -1) {
          orgConfig.push({
            key: "PostIntvSkillScore",
            value: values.postIntvSkillScore,
            organizationId: values.orgId,
          });
        }
        if (
          orgConfig.findIndex((c) => c.key === "PostIntvPreScreeningScore") ===
          -1
        ) {
          orgConfig.push({
            key: "PostIntvPreScreeningScore",
            value: values.postIntvPreScreeningScore,
            organizationId: values.orgId,
          });
        }
        if (orgConfig.findIndex((c) => c.key === "FinStartMonth") === -1) {
          orgConfig.push({
            key: "FinStartMonth",
            value: values.FinStartMonth,
            organizationId: values.orgId,
          });
        }
        if (orgConfig.findIndex((c) => c.key === "FinEndMonth") === -1) {
          orgConfig.push({
            key: "FinEndMonth",
            value: values.FinEndMonth,
            organizationId: values.orgId,
          });
        }
        if (orgConfig.findIndex((c) => c.key === "Level") === -1) {
          orgConfig.push({
            key: "Level",
            value: values.level,
            organizationId: values.orgId,
          });
        }
        orgConfig.forEach(function (item) {
          if (item.key === "Level") {
            item.value = values.level === "0" ? "1" : values.level;
          } else if (item.key === "FinStartMonth") {
            item.value = values.FinStartMonth;
          } else if (item.key === "FinEndMonth") {
            item.value = values.FinEndMonth;
          } else if (item.key === "PreIntvSkillScore") {
            item.value = values.preIntvSkillScore;
          } else if (item.key === "PreIntvPreScreeningScore") {
            item.value = values.preIntvPreScreeningScore;
          } else if (item.key === "PostIntvSkillScore") {
            item.value = values.postIntvSkillScore;
          } else if (item.key === "PostIntvPreScreeningScore") {
            item.value = values.postIntvPreScreeningScore;
          }
        }, orgConfig);
        values.orgConfig = orgConfig;
      } else {
        orgConfig.push({
          key: "Level",
          value: values.level,
          organizationId: values.orgId,
        });
        orgConfig.push({
          key: "FinStartMonth",
          value: values.FinStartMonth,
          organizationId: values.orgId,
        });
        orgConfig.push({
          key: "FinEndMonth",
          value: values.FinEndMonth,
          organizationId: values.orgId,
        });
        orgConfig.push({
          key: "PreIntvSkillScore",
          value: values.preIntvSkillScore,
          organizationId: values.orgId,
        });
        orgConfig.push({
          key: "PreIntvPreScreeningScore",
          value: values.preIntvPreScreeningScore,
          organizationId: values.orgId,
        });
        orgConfig.push({
          key: "PostIntvSkillScore",
          value: values.postIntvSkillScore,
          organizationId: values.orgId,
        });
        orgConfig.push({
          key: "PostIntvPreScreeningScore",
          value: values.postIntvPreScreeningScore,
          organizationId: values.orgId,
        });
        values.orgConfig = orgConfig;
        // const org = [
        //   { key: "Level", value: level, organizationId: orgId },
        //   {
        //     key: "FinStartDate",
        //     value: finStartDate,
        //     organizationId: orgId
        //   },
        //   { key: "FinEndDate", value: finEndDate, organizationId: orgId }
        // ];
      }
      props.updateOrgConfig(values).then((result) => {
        setLoading(false);
        setIsBlocking(false);
        setErrMsg(false);
        setSuccessMsg(true);
        setSuccessMsg(t("common:succMsg.savedSuccessfully"));
        setValues({
          ...values,
          showError: false,
        });
      });
      // const timer = setTimeout(() => {
      //   setLoading(false);
      // }, 1000);
      // setIsBlocking(false);
      // setErrMsg(false);
      // setSuccessMsg(true);
      // setSuccessMsg("Saved successfully.");
      // setValues({
      //   ...values,
      //   showError: false
      // });
      // return () => clearTimeout(timer);
    }
  }
  function handleEdit1(item, idx) {
    if (idx || idx === 0) {
      item.idx = idx;
    }
    setValues({ ...values, addressItem: item });
    setModals({ open1: true });
  }

  function handleEdit2(item, idx) {
    if (idx || idx === 0) {
      item.idx = idx;
    }
    setValues({ ...values, panelItem: item });
    setModals({ open2: true });
  }

  function handleDeletePanels(idx, item) {
    setModals({ panelDelete: true });
    setValues({ ...values, panelItem: item, deleteIndex: idx });
    // this.setState({ showSkillPopup: true, deleteSkillId: idx });
  }
  function handleDeleteLocations(idx, item) {
    setModals({ locationDelete: true });
    setValues({ ...values, addressItem: item, deleteIndex: idx });
    // this.setState({ showSkillPopup: true, deleteSkillId: idx });
  }

  function handleCancelPanels() {
    setModals({ panelDelete: false });
  }

  function handleCancelLocations() {
    setModals({ locationDelete: false });
  }

  function handleDelete(i) {
    setshowConfirmPopup(true);
    setdeleteId(i);
  }

  const handleAddition = (tag) => {
    tag.organizationId = profile.orgId;
    const departments = [].concat(values.departments, tag);
    const touched = { ...values.touched };
    if (departments.length > 0) {
      touched.departments = true;
    }
    setValues({ ...values, departments });
    setTouched({ ...touched, departments: true });
    setSuggestions(suggestions && suggestions.filter((c) => c !== tag));
  };

  const Tag = (props) => (
    <Chip
      label={props.tag.name}
      onDelete={props.onDelete}
      className={props.classNames.selectedTagName}
      color="primary"
      variant="outlined"
    />
  );

  const handleOk = () => {
    const i = deleteId;
    const department = values.departments[i];
    const departments = values.departments.slice(0);
    const id = departments[i].id;
    if (id > 0) {
      props.deleteDepartment(id);
    }
    departments.splice(i, 1);
    setshowConfirmPopup(false);
    setValues({ ...values, departments });
    setSuggestions(suggestions && suggestions.concat(department));
  };

  const handleCancel = () => {
    setshowConfirmPopup(false);
  };

  function handleRemoveSpecificLocationRow() {
    const idx = values.deleteIndex;
    const item = values.addressItem;
    const addresses = values.addr;

    if (item.id > 0) {
      props.deleteLocation(item.id).then((res) => {
        if (res) {
          addresses.splice(idx, 1);
          setErrMsg(false);
          setSuccessMsg(true);
          setSuccessMsg("Location removed successfully.");
          setValues({
            ...values,
            addr: addresses,
            showError: false,
          });
        } else {
          setSuccessMsg(false);
          setErrMsg(true);
          setErrMsg("Location already in use.");
          setValues({
            ...values,
            showError: false,
          });
        }
      });
    } else {
      addresses.splice(idx, 1);
      setErrMsg(false);
      setSuccessMsg(true);
      setSuccessMsg("Location removed successfully.");
      setValues({
        ...values,
        addr: addresses,
        showError: false,
      });
    }

    setModals({ locationDelete: false });
  }

  function handleRemoveSpecificPanelRow() {
    const idx = values.deleteIndex;
    const item = values.panelItem;
    const panels = values.interviewPanels;

    if (item.id > 0) {
      props.deletePanel(item.id).then((res) => {
        if (res) {
          panels.splice(idx, 1);
          setErrMsg(false);
          setSuccessMsg(true);
          setSuccessMsg("Interview Panel removed successfully.");
          setValues({
            ...values,
            interviewPanels: panels,
            showError: false,
          });
        } else {
          setSuccessMsg(false);
          setValues({
            ...values,
            showError: false,
          });
          setErrMsg(true);
          setErrMsg("Interview Panel already in use.");
        }
      });
    } else {
      panels.splice(idx, 1);
      setErrMsg(false);
      setSuccessMsg(true);
      setSuccessMsg("Interview Panel removed successfully.");
      setValues({
        ...values,
        interviewPanels: panels,
        showError: false,
      });
    }

    setModals({ panelDelete: false });
  }

  const getInterviewScore = (values) => {
    const newState = { ...values };
    newState.totalPreIntvScore =
      Number(values.preIntvSkillScore) +
      Number(values.preIntvPreScreeningScore);
    newState.totalPostIntvScore =
      Number(values.postIntvSkillScore) +
      Number(values.postIntvPreScreeningScore);
    if (newState.totalPreIntvScore > 100) {
      newState.showPreIntvError = true;
      newState.msgError = t("common:errMsg.overallScoreShouldbe");
    } else {
      newState.showPreIntvError = false;
    }
    if (newState.totalPostIntvScore > 100) {
      newState.showPostIntvError = true;
      newState.msgError = t("common:errMsg.overallScoreShouldbe");
    } else {
      newState.showPostIntvError = false;
    }
    setValues(newState);
  };

  const handlePreIntvValueChange = (field, value) => {
    const newState = { ...values };
    newState[field] = value;
    if (field === "preIntvPreScreeningScore") {
      newState.preIntvSkillScore = 100 - value;
    }

    if (field === "preIntvSkillScore") {
      newState.preIntvPreScreeningScore = 100 - value;
    }
    setValues(newState);
    getInterviewScore(newState);
  };

  const handlePostIntvValueChange = (field, value) => {
    const newState = { ...values };
    newState[field] = value;
    if (field === "postIntvPreScreeningScore") {
      newState.postIntvSkillScore = 100 - value;
    }

    if (field === "postIntvSkillScore") {
      newState.postIntvPreScreeningScore = 100 - value;
    }
    setValues(newState);
    getInterviewScore(newState);
  };

  return (
    <Container
      className={classes.root}
      style={{ padding: 0, paddingTop: 40, margin: -24 }}
    >
      <Prompt when={isBlocking} message={t("common:errMsg.unsavedAlert")} />
      <Grid container spacing={3}>
        <Grid container item xs={12} sm={9}>
          <FormLabel className={classes.formHeader}>
            {t("otherOfficeLocation")}
          </FormLabel>
          <Paper style={{ width: "100%" }}>
            <PerfectScrollbar>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHead}>
                      {t("address")}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableHead}
                      style={{ width: 120 }}
                    >
                      {t("actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.addr && values.addr.length > 0 ? (
                    values.addr.map((item, index) => {
                      return (
                        <TableRow hover>
                          <TableCell>
                            {item.line1 +
                              ", " +
                              (item.line2 && item.line2 + ", ") +
                              item.city +
                              ", " +
                              item.state +
                              ", " +
                              item.zip}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton small>
                              <Edit onClick={() => handleEdit1(item, index)} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteLocations(index, item)}
                              small
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell>{t("common:noDataAvailable")}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          </Paper>
          <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleOpen1}
              className={classes.inlineBtn}
            >
              {t("add")}
            </Button>
          </Grid>
        </Grid>

        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12} sm={9}>
            <FormLabel className={classes.formLabel}>
              {t("departments")}
            </FormLabel>
            <ReactTags
              tags={values.departments || ""}
              suggestions={suggestions || []}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              autofocus={false}
              allowNew={true}
              placeholder={values.tagPlaceholder}
              tagComponent={Tag}
              allowBackspace={false}
              inputAttributes={{ maxLength: 50 }}
              autoresize={false}
              classNames={{
                root: errors.departments
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
        </Grid>

        <Grid container item xs={12} sm={9}>
          <FormLabel className={classes.formHeader}>
            {t("interviewLevels")}
          </FormLabel>
          <Box
            display="flex"
            flexDirection="row"
            width="100%"
            style={{ margin: "15px 0" }}
          >
            <Box display="flex" width="70px" alignItems="center">
              {t("levels")}
            </Box>
            <Box
              style={{ zIndex: 1 }}
              display="flex"
              width="200px"
              alignItems="center"
            >
              <Slider
                rootStyle={sliderStyle}
                domain={[10, 25]}
                step={1}
                mode={2}
                values={[values.level]}
                onSlideEnd={(event) => handleFieldChange("level", event[0])}
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
            </Box>
          </Box>
          {/* <Paper style={{ width: "100%" }}>
            <PerfectScrollbar>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHead}>
                      {t("panel")}
                    </TableCell>
                    <TableCell className={classes.tableHead}>
                      {t("interviewers")}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableHead}
                      style={{ width: 120 }}
                    >
                      {t("actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.interviewPanels &&
                  values.interviewPanels.length > 0 ? (
                    Object.keys(values.interviewPanels).map((index) => {
                      const panel = values.interviewPanels[index];

                      return (
                        <TableRow hover>
                          <TableCell>{panel.name}</TableCell>
                          <TableCell>
                            {panel.users && panel.users.length > 0 ? (
                              panel.users
                                .map((c) => c.fname + " " + c.lname)
                                .join(", ")
                            ) : (
                              <i>---</i>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton small>
                              <Edit onClick={() => handleEdit2(panel, index)} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeletePanels(index, panel)}
                              small
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell>{t("common:noDataAvailable")}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          </Paper> */}
          {/* <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleOpen2}
              className={classes.inlineBtn}
            >
              {t("add")}
            </Button>
          </Grid> */}
        </Grid>
        <Grid container item xs={12} sm={9}>
          <Grid item xs={12} sm={12}>
            <FormLabel className={classes.formHeader}>
              {t("scoreWeightageDistribution")}
            </FormLabel>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            style={{
              padding: "15px",
              borderRadius: "5px",
              border: "1px solid #dfe3e8",
              position: "relative",
              marginTop: "20px",
            }}
          >
            <Typography
              variant="h5"
              style={{
                textTransform: "uppercase",
                fontSize: "13px",
                color: "#000",
                position: "absolute",
                top: "-11px",
                left: "1px",
                background: "#fff",
                padding: "0 5px",
              }}
            >
              {t("skillvsprescreeningassessment")}
            </Typography>
            <Grid item xs={12} md={12} lg={12}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={10} lg={10}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Grid container spacing={0}>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={6}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "30px 0",
                          }}
                        >
                          <Typography
                            style={{ color: "#505050", fontSize: "13px" }}
                          >
                            {t("common:skillsweightage")}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={4}
                          lg={4}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "30px 0",
                          }}
                        >
                          <Slider
                            rootStyle={sliderStyle}
                            domain={[0, 100]}
                            step={1}
                            mode={2}
                            values={[values.preIntvSkillScore]}
                            onSlideEnd={(event) =>
                              handlePreIntvValueChange(
                                "preIntvSkillScore",
                                event[0]
                              )
                            }
                          >
                            <Rail>
                              {(
                                { getRailProps } // adding the rail props sets up events on the rail
                              ) => (
                                <div style={railStyle} {...getRailProps()} />
                              )}
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
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Grid container spacing={0}>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={6}
                          className={classes.columnBox}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "30px 0",
                            marginRight: 10,
                          }}
                        >
                          <Typography
                            style={{ color: "#505050", fontSize: "13px" }}
                          >
                            {t("preScreeningWeightage")}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={4}
                          lg={4}
                          className={classes.columnBox}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "30px 0",
                          }}
                        >
                          <Slider
                            rootStyle={sliderStyle}
                            domain={[0, 100]}
                            step={1}
                            mode={2}
                            values={[values.preIntvPreScreeningScore]}
                            onSlideEnd={(event) =>
                              handlePreIntvValueChange(
                                "preIntvPreScreeningScore",
                                event[0]
                              )
                            }
                          >
                            <Rail>
                              {(
                                { getRailProps } // adding the rail props sets up events on the rail
                              ) => (
                                <div style={railStyle} {...getRailProps()} />
                              )}
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
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                  <Box
                    className={classes.scoreBox}
                    style={{ borderLeft: "1px solid #BEBEBE" }}
                  >
                    <Box className={classes.circleProgWrapXlg}>
                      <span className={classes.circleProgValXlg}>
                        {values.totalPreIntvScore}%
                      </span>
                      {values.totalPreIntvScore > 100 ? (
                        <CircularProgress
                          className={classes.cirProgGreenLg}
                          style={{ color: "#ff725f" }}
                          variant="static"
                          value={values.totalPreIntvScore}
                          color="red"
                          thickness={5}
                        />
                      ) : (
                        <CircularProgress
                          className={classes.cirProgGreenLg}
                          variant="static"
                          value={values.totalPreIntvScore}
                          color="red"
                          thickness={5}
                        />
                      )}
                    </Box>
                    <Typography
                      style={{
                        color: "#69D193",
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginTop: "15px",
                      }}
                    >
                      {t("common:totalScore")}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            style={{
              padding: "15px",
              borderRadius: "5px",
              border: "1px solid #dfe3e8",
              position: "relative",
              marginTop: "40px",
            }}
          >
            <Typography
              variant="h5"
              style={{
                textTransform: "uppercase",
                fontSize: "13px",
                color: "#000",
                position: "absolute",
                top: "-11px",
                left: "1px",
                background: "#fff",
                padding: "0 5px",
              }}
            >
              {t("common:skillsvsinterviewassessment")}
            </Typography>
            <Grid item xs={12} md={12} lg={12}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={10} lg={10}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Grid container spacing={0}>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={6}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "30px 0",
                          }}
                        >
                          <Typography
                            style={{ color: "#505050", fontSize: "13px" }}
                          >
                            {t("common:skillsweightage")}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={4}
                          lg={4}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "30px 0",
                          }}
                        >
                          <Slider
                            rootStyle={sliderStyle}
                            domain={[0, 100]}
                            step={1}
                            mode={2}
                            values={[values.postIntvSkillScore]}
                            onSlideEnd={(event) =>
                              handlePostIntvValueChange(
                                "postIntvSkillScore",
                                event[0]
                              )
                            }
                          >
                            <Rail>
                              {(
                                { getRailProps } // adding the rail props sets up events on the rail
                              ) => (
                                <div style={railStyle} {...getRailProps()} />
                              )}
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
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Grid container spacing={0}>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={6}
                          className={classes.columnBox}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "30px 0",
                            marginRight: 10,
                          }}
                        >
                          <Typography
                            style={{ color: "#505050", fontSize: "13px" }}
                          >
                            {t("common:interviewweightage")}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={4}
                          lg={4}
                          className={classes.columnBox}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "30px 0",
                          }}
                        >
                          <Slider
                            rootStyle={sliderStyle}
                            domain={[0, 100]}
                            step={1}
                            mode={2}
                            values={[values.postIntvPreScreeningScore]}
                            onSlideEnd={(event) =>
                              handlePostIntvValueChange(
                                "postIntvPreScreeningScore",
                                event[0]
                              )
                            }
                          >
                            <Rail>
                              {(
                                { getRailProps } // adding the rail props sets up events on the rail
                              ) => (
                                <div style={railStyle} {...getRailProps()} />
                              )}
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
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                  <Box
                    className={classes.scoreBox}
                    style={{ borderLeft: "1px solid #BEBEBE" }}
                  >
                    <Box className={classes.circleProgWrapXlg}>
                      <span className={classes.circleProgValXlg}>
                        {values.totalPostIntvScore}%
                      </span>
                      {values.totalPostIntvScore > 100 ? (
                        <CircularProgress
                          className={classes.cirProgGreenLg}
                          style={{ color: "#ff725f" }}
                          variant="static"
                          value={values.totalPostIntvScore}
                          color="red"
                          thickness={5}
                        />
                      ) : (
                        <CircularProgress
                          className={classes.cirProgGreenLg}
                          variant="static"
                          value={values.totalPostIntvScore}
                          color="red"
                          thickness={5}
                        />
                      )}
                    </Box>
                    <Typography
                      style={{
                        color: "#69D193",
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginTop: "15px",
                      }}
                    >
                      {t("common:totalScore")}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container item xs={12} sm={9}>
          <FormLabel className={classes.formHeader}>
            {" "}
            {t("common:financialyear")}
          </FormLabel>
          <Box
            style={{ display: "flex", flexBasis: "100%", flexDirection: "row" }}
          >
            <Box>
              <Select
                value={values.FinStartMonth || "0"}
                margin="dense"
                style={{ zIndex: 100 }}
                input={
                  <OutlinedInput
                    labelWidth="0"
                    name="age"
                    id="outlined-age-simple"
                  />
                }
                error={getMsg(
                  errors.emailerrors && errors.emailerrors.FinStartMonth,
                  t
                )}
                onChange={(event) =>
                  handleFieldChange("FinStartMonth", event.target.value)
                }
              >
                <MenuItem value="0">Month</MenuItem>
                {Month.getKeyValuePairs().map((item) => {
                  return (
                    <MenuItem value={item.value}> {t(`${item.name}`)}</MenuItem>
                  );
                })}
              </Select>
            </Box>
            <Box style={{ marginLeft: "10px" }}>
              <Select
                value={values.FinEndMonth || "0"}
                margin="dense"
                style={{ zIndex: 100 }}
                input={
                  <OutlinedInput
                    labelWidth="0"
                    name="age"
                    id="outlined-age-simple"
                  />
                }
                error={getMsg(errors.FinEndMonth, t)}
                onChange={(event) =>
                  handleFieldChange("FinEndMonth", event.target.value)
                }
              >
                <MenuItem value="0">Month</MenuItem>
                {Month.getKeyValuePairs().map((item) => {
                  return (
                    <MenuItem value={item.value}> {t(`${item.name}`)}</MenuItem>
                  );
                })}
              </Select>
            </Box>
          </Box>
        </Grid>

        <Grid spacing={3} item container className={classes.buttonBar}>
          {loading ? (
            <CircularProgress className={classes.progress} />
          ) : (
            <div>
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => {
                  props.history.push("/rc/dashboard");
                }}
              >
                {t("common:cancel")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleUpdateOrgConfig(false);
                }}
                className={classes.button}
              >
                {t("common:saveforLater")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleUpdateOrgConfig(true);
                }}
              >
                {t("save")}
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
      <Modal
        style={
          {
            // position: "absolute",
            // top: "20%",
            // left: "0"
            // overflowY: "scroll",
            //  height: "100%"
            // display: "block"
          }
        }
        aria-labelledby={t("common:addScreeningQ")}
        aria-describedby={t("common:addScreeningQ")}
        open={modal.open1}
        onClose={handleClose1}
      >
        <AddLocation
          states={states}
          item={values.addressItem}
          onCancel={handleClose1}
          saveLocation={saveLocation}
        />
      </Modal>
      <Modal
        style={
          {
            // position: "absolute",
            // top: "20%",
            // left: "0"
            //overflowY: "scroll",
            // height: "100%"
            //display: "block"
          }
        }
        aria-labelledby={t("common:addScreeningQ")}
        aria-describedby={t("common:addScreeningQ")}
        open={modal.open2}
        onClose={handleClose2}
      >
        <AddPanel
          item={values.panelItem}
          panelMembers={values.panelMembers}
          savePanelMembers={savePanelMembers}
          organizationId={values.orgId}
          onCancel={handleClose2}
        />
      </Modal>

      <MessageBox
        open={successMsg}
        variant="success"
        onClose={handleCloseSuccess}
        message={successMsg}
      />

      <MessageBox
        open={errMsg}
        variant="error"
        onClose={handleClose}
        message={errMsg}
      />
      <MessageBox
        open={values.showPreIntvError}
        variant="error"
        onClose={() => {
          setValues({ ...values, showPreIntvError: false });
        }}
        message={values.msgError}
      />
      <MessageBox
        open={values.showPostIntvError}
        variant="error"
        onClose={() => {
          setValues({ ...values, showPostIntvError: false });
        }}
        message={values.msgError}
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
        <DialogTitle id="alert-dialog-title">{values.errHeaderMsg}</DialogTitle>
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
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={modal.panelDelete}
      >
        <DialogTitle id="confirmation-dialog-title">
          {t("removePanel")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("removePanelAlert")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPanels} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={handleRemoveSpecificPanelRow} color="primary">
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={showConfirmPopup}
      >
        <DialogTitle id="confirmation-dialog-title">
          {t("common: delete")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("common:deleteItem")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={handleOk} color="primary">
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={modal.locationDelete}
      >
        <DialogTitle id="confirmation-dialog-title">
          {t("common:removeLoc")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("common:removeLocAlert")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLocations} color="primary">
            {t("common:cancel")}
          </Button>
          <Button onClick={handleRemoveSpecificLocationRow} color="primary">
            {t("common:ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const mapDispatchToProps = {
  loadAddress,
  loadInterviewPanel,
  loadUsers,
  updateOrgConfig,
  loadOrgConfig,
  loadStates,
  deleteLocation,
  deletePanel,
  interviewPanelPromise,
  addressPromise,
  clearUser,
  loadDepartments,
  deleteDepartment,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  deptList: state.employer && state.employer.departments,
  addr:
    state.admin && state.admin.orgOtherAddrr && state.admin.orgOtherAddrr.data,
  interviewPanel:
    state.admin &&
    state.admin.interviewpanels &&
    state.admin.interviewpanels.data,
  panelMembers: state.admin && state.admin.users,
  orgconfig: state.admin && state.admin.orgconfig && state.admin.orgconfig.data,
  states: state.admin && state.admin.states,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Configuration))
);
