import React, { Component } from "react";

// Externals
//import classNames from "classnames";
import moment from "moment";
import MUIRichTextEditor from "mui-rte";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";

// Material helpers
import { withStyles, CircularProgress } from "@material-ui/core";
import { withRouter, Prompt } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";

import ReactTags from "react-tag-autocomplete"; 

// Actions
import {
  loadDepartments,
  loadAddresses,
  loadSkills,
  loadConfiguration,
} from "services/employer/action";
import {
  createJobPost,
  deleteJobSkill,
  getJobPost,
} from "services/jobPost/action";
import classNames from "classnames";
// Material components
import { Add, Remove, CalendarToday, Close, Warning } from "@material-ui/icons";
import {
  Grid,
  TextField,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
  Select,
  OutlinedInput,
  ButtonGroup,
  InputBase,
  Chip,
  InputAdornment,
  createMuiTheme,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MuiThemeProvider,
  Snackbar,
  IconButton,
  MenuItem,
} from "@material-ui/core";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { JobType, Roles } from "util/enum";
import {
  getFullAddress,
  getFinancialYear,
  getQuarterYear,
  formatCurrency,
} from "util/helper";
import MessageBox from "util/messageBox";

// Component styles
import styles from "../styles";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

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
let jobData = {};
class Details extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();

    this.state = {
      tagPlaceholder: this.props.t("typeReq"),
      flag: false,
      errorFlag: false,
      selectedAddressId: 0,
      selectedDepartmentId: 0,
      suggestions: [],
      isBlocking: false,
      errors: {
        // title: null,
        // type: null,
        // tags: null,
        // addressId: null,
        // departmentId: null,
        // position: null,
        // startDate: null,
        // endDate: null
      },
      values: {
        title: "",
        type: 0,
        jobskills: [],
        createdAt: new Date().toISOString(),
        position: 1,
      },
      touched: {},
      editorState: EditorState.createEmpty(),
    };
    this.initialState = { ...this.state.values };
  }

  // get initialState() {
  //   return {
  //     title: "",
  //     type: 0,
  //     jobskills: [],
  //     position: 1,
  //     exp: "",
  //     payRate: "",
  //     description: "",
  //     responsibility: ""
  //   };
  // }

  componentDidMount() {
    this.props.onRef(this);
    this.props.loadDepartments(this.props.orgId);
    this.props.loadAddresses(this.props.orgId);
    this.props.loadConfiguration(this.props.orgId);
    this.props.loadSkills();
    if (
      (this.props.jobPost &&
        this.props.jobPost.data &&
        this.props.jobPost.data.id > 0) ||
      this.props.jobId > 0
    ) {
      const id =
        this.props.jobId > 0 ? this.props.jobId : this.props.jobPost.data.id;
      this.props.getJobPost(id);
      this.setState({ loading: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.jobPost.data !== this.props.jobPost.data) {
      this.setState({ loading: false });
    }
    this.validateForm();
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.jobPost && nextProps.jobPost.data && !prevState.flag) {
      jobData = { ...nextProps.jobPost.data };
      return { values: nextProps.jobPost.data, flag: true };
    }
    if (
      nextProps.jobPost &&
      nextProps.jobPost.errors &&
      nextProps.jobPost.errors.detailsError &&
      !prevState.errorFlag
    ) {
      return { errors: nextProps.jobPost.errors.detailsError, errorFlag: true };
    }
    if (nextProps.skills && !prevState.suggestionFlag) {
      return {
        suggestions: nextProps.skills.map((t) => ({
          skillId: t.id,
          name: t.name,
        })),
        suggestionFlag: true,
      };
    }
    return null;
  }
  handleMsgClose = () => {
    this.setState({ showSuccess: false, isBlocking: false });
  };

  // handleClose = () => {
  //   this.setState({ dateError: false });
  // };

  getSkillsByText = () => {
    //this.props.loadSkills(this.state.);
  };

  validateForm = _.debounce(async () => {
    const { values } = this.state;

    const newState = { ...this.state };
    let errors = validate(values, schema);
    if (!values.jobskills || values.jobskills.length === 0) {
      if (!errors) {
        errors = {};
      }
      errors.jobskills = ["Tag is required"];
    } else if (errors && errors.jobskills) {
      delete errors.jobskills;
    }
    if (values.type <= 2 && errors && errors.duration) {
      delete errors.duration;
    }

    if (
      values.type === 1 ||
      (values.type === "1" && errors && errors.endDate)
    ) {
      delete errors.endDate;
    }

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    newState.dateError =
      (values.startDate && values.endDate && errors && errors.endDate) || false;
    newState.hasDateErr =
      (values.startDate && values.endDate && errors && errors.endDate) || false;

    this.setState(newState);
    return newState.isValid;
  }, 300);

  handleChange = (field, value) => {
    const newState = { ...this.state };
    const re = /^[0-9\b]+$/;

    if (
      (field === "exp" || field === "duration" || field === "position") &&
      value &&
      !re.test(value)
    ) {
      value = newState.values[field] || "";
    }
    // else if (field === "payRate" && value && !curencyRegex.test(value)) {
    //   value = newState.values[field] || "";
    // }

    if (field === "duration" && value > 0) {
      const startDate = new Date(newState.values.startDate);
      if (startDate) {
        const endDate = moment(startDate, "MM/DD/YYYY").add(value, "days");
        newState.values.endDate = new Date(endDate);
      }
    } else if (field === "endDate") {
      if (newState.values.startDate) {
        const startDate = newState.values.startDate;
        const endDate = moment(value);
        const duration = endDate.diff(startDate, "days");
        if (duration > 0) {
          newState.values.duration = duration;
        }
      }
    }

    newState.submitError = null;
    if (value) {
      newState.touched[field] = true;
    } else {
      delete newState.touched[field];
    }
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
    if (value) {
      this.setState({ isBlocking: true });
    }

    //this.setState({ [field]: value });
  };

  formatCurrency = (money) => {
    if (money) {
      const newState = { ...this.state };
      const curencyRegex =
        /^(?!0*[.,]?0+$)\d*[.,]?\d+$/;
      if (!curencyRegex.test(money)) {  
        newState.values.payRate = "";
        this.setState(newState);
      } else {
        newState.commonError = false;
        newState.commonErrorMsg = "";
        newState.values.payRate = formatCurrency(money);
        this.setState(newState);
      }
    }
  };

  IncrementItem = () => {
    this.setState((prevState) => {
      const position = prevState.values.position
        ? prevState.values.position
        : 0;
      return {
        values: { ...prevState.values, position: parseInt(position) + 1 },
      };
    }, this.validateForm);
  };

  RedirectToConfig = () => {
    this.props.history.push("/rc/manage-firm");
  };
  DecreaseItem = () => {
    this.setState((prevState) => {
      if (prevState.values.position > 0) {
        return {
          values: {
            ...prevState.values,
            position: prevState.values.position - 1,
          },
        };
      } else {
        return null;
      }
    }, this.validateForm);
  };

  handleOk = () => {
    const i = this.state.deleteId;
    const skill = this.state.values.jobskills[i];
    const jobskills = this.state.values.jobskills.slice(0);
    const id = jobskills[i].id;
    if (id > 0) {
      this.props.deleteJobSkill(id);
    }
    jobskills.splice(i, 1);
    this.setState({
      showConfirmPopup: false,
      values: { ...this.state.values, jobskills },
      suggestions: this.state.suggestions.concat(skill),
    });
  };

  handleCancel = () => {
    this.setState({ showConfirmPopup: false });
  };

  handleDelete = (i) => {
    this.setState({ showConfirmPopup: true, deleteId: i });
  };

  handleAddition = (tag) => {
    const jobskills = [].concat(this.state.values.jobskills, tag);
    const touched = { ...this.state.touched };
    if (jobskills.length > 0) {
      touched.jobskills = true;
    }
    this.setState({
      touched,
      values: { ...this.state.values, jobskills },
      suggestions: this.state.suggestions.filter((c) => c !== tag),
    });
  };

  handleValidate = (tag) => {
    return tag.name.length <= 50;
  };

  handleFocus = () => {
    this.setState({
      ...this.state,
      tagPlaceholder: "",
    });
  };
  handleBlur = () => {
    this.setState({
      ...this.state,
      tagPlaceholder: this.props.t("typeReq"),
    });
  };

  Tag = (props) =>
    this.props.hideBtn ? (
      <Chip
        label={props.tag.name}
        className={props.classNames.selectedTagName}
        color="primary"
        variant="outlined"
      />
    ) : (
      <Chip
        label={props.tag.name}
        onDelete={props.onDelete}
        className={props.classNames.selectedTagName}
        color="primary"
        variant="outlined"
      />
    );

  handleDescChange = (editorState) => {
    let html = stateToHTML(editorState.getCurrentContent());
    const newState = { ...this.state };
    if (html !== "<p><br></p>") {
      newState.submitError = null;
      if (html) {
        newState.touched["description"] = true;
      } else {
        delete newState.touched["description"];
      }
      newState.values["description"] = html;

      this.setState(newState, this.validateForm);
    } else {
      newState.values["description"] = "";
      this.setState(newState, this.validateForm);
    }
  };

  handleRespChange = (editorState) => {
    let html = stateToHTML(editorState.getCurrentContent());
    const newState = { ...this.state };
    if (html !== "<p><br></p>") {
      newState.submitError = null;
      if (html) {
        newState.touched["responsibility"] = true;
      } else {
        delete newState.touched["responsibility"];
      }
      newState.values["responsibility"] = html;

      this.setState(newState, this.validateForm);
    } else {
      newState.values["responsibility"] = "";
      this.setState(newState, this.validateForm);
    }
  };

  displayContent = (markUp) => {
    const contentHTML = convertFromHTML(markUp);
    const state = ContentState.createFromBlockArray(
      contentHTML.contentBlocks,
      contentHTML.entityMap
    );
    const content = JSON.stringify(convertToRaw(state));
    return content;
  };

  saveJobPost = async () => {
    const { values, errors, commonErrorMsg, hasDateErr, flag } = this.state;
    const data = { ...values };

    if (this.checkUnsavedData() || flag) {
      if (commonErrorMsg && commonErrorMsg.length > 0) {
        this.setState({ commonError: true });
      } else if (hasDateErr) {
        this.setState({ dateError: true });
      } else {
        let splitTabs = [];
        let tab = null;
        if (data.tab) {
          splitTabs = data.tab.split(",");
        }
        if (Object.entries(errors).length === 0) {
          tab =
            splitTabs.length > 0 && splitTabs[1] === "1" ? "1,1,0" : "1,0,0";
        } else {
          tab =
            splitTabs.length > 0 && splitTabs[1] === "1" ? "0,1,0" : "0,0,0";
        }
        data.tab = tab;
        //data.status = 1;
        if (!data.exp) {
          delete data.exp;
        }
        if (data.payRate) {
          data.payRate = data.payRate.replace(/,/g, "");
        }
        this.setState({
          ...this.state,
          touched: {},
          showError: false,
          showSuccess: true,
        });
        jobData = data;
        const res = await this.props.createJobPost(data, {
          detailsError: errors,
        });
        return res;
      }
    } else {
      this.setState({
        showDialog: true,
        errTitleMsg: this.props.t("common:errMsg.emptyFields"),
        errMsg: this.props.t("common:errMsg.infoNotAdded"),
      });
    }
  };

  saveAndContinueJobPost = async () => {
    const { values, errors, commonErrorMsg } = this.state;
    if (Object.entries(errors).length === 0) {
      if (commonErrorMsg && commonErrorMsg.length > 0) {
        this.setState({ commonError: true });
      } else {
        const data = { ...values };
        let splitTabs = [];
        if (data.tab) {
          splitTabs = data.tab.split(",");
        }
        data.tab =
          splitTabs.length > 0 && splitTabs[1] === "1" ? "1,1,0" : "1,0,0";
        //data.status = 1;
        if (data.payRate) {
          data.payRate = data.payRate.replace(/,/g, "");
        }
        this.setState({ ...this.state, touched: {} });
        const res = await this.props.createJobPost(data, {
          detailsError: errors,
        });
        return res;
      }
    } else {
      this.setState({
        showError: true,
        showDialog: true,
        errMsg: this.props.t("common:errMsg.fillReqInfo"),
      });
    }
  };

  handleClose = () => {
    this.setState({ showDialog: false });
  };

  checkUnsavedData = () => {
    const { touched } = this.state;
    return touched && Object.entries(touched).length > 0;
  };

  hasValue = () => {
    const { values } = this.state;
    return values && Object.entries(values).length > 0;
  };

  clearUnsavedData = () => {
    const nextState = { ...this.state };
    nextState.values = this.props.jobPost.data
      ? { ...jobData }
      : {
          ...this.initialState,
        };
    this.setState(nextState, this.validateForm);
  };

  render() {
    if (this.state.loading) {
      return <CircularProgress></CircularProgress>;
    }
    const { classes, t, i18n, dList, addresses, finStartMonth } = this.props;
    const { values, errors, dateError, suggestions, commonError } = this.state;
    values.jobskills = values.jobskills || [];
    const showError = this.state.showError || this.props.showError;
    // const financialYear =
    //   finStartDate && finEndDate
    //     ? getYear(finStartDate, finEndDate)
    //     : values.startDate && getFinancialYear(new Date(values.startDate));
    const financialYear =
      values.startDate &&
      getFinancialYear(new Date(values.startDate), finStartMonth);
    const jobDesc =
      values.description &&
      values.description.length > 0 &&
      this.displayContent(values.description);
    const jobResp =
      values.responsibility &&
      values.responsibility.length > 0 &&
      this.displayContent(values.responsibility);

    return (
      <Fade in="true" timeout="10">
        <Grid
          container
          spacing={3}
          className={classes.gridBg1}
          style={{
            backgroundImage: `url(${require(`assets/images/tab-1-bg_${i18n.language}.png`).default})`, 
          }}
        >
          <Prompt
            when={this.state.isBlocking}
            message={t("common:errMsg.unsavedAlert")}
          />
          <Snackbar
            style={{
              position: "relative",
              margin: "-20px 15px 30px 0px",
              zIndex: 1,
            }}
            ContentProps={{
              classes: {
                root: classNames(classes.snackRootWarning, classes.snackRoot),
                message: classes.snackMsg,
                action: classes.snackAction,
              },
            }}
            autoHideDuration={10000}
            open={
              !this.props.configAlert
                ? this.props.configAlert
                : this.props.configAlert ||
                  (addresses && addresses.length === 0)
            }
            onClose={() => this.props.configClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            bodyStyle={{ backgroundColor: "red" }}
            action={[
              <IconButton
                onClick={() => this.props.configClose}
                key="close"
                aria-label="close"
                color="inherit"
              >
                <Close onClick={this.props.configClose} />
              </IconButton>,
            ]}
            message={
              <span>
                <Warning />
                {this.props.roles.id === Roles.Admin
                  ? t("mandatoryConfigAlert")
                  : t("mandatoryConfigAdminAlert")}
              </span>
            }
          />

          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={9}>
              <InputLabel className={classes.inputLabel}>
                {t("common:title")}
              </InputLabel>
              <TextField
                error={showError && getMsg(errors.title, t)}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxLength: 100 }}
                placeholder={t("titleplaceholder")}
                value={values.title || ""}
                onChange={(event) =>
                  this.handleChange("title", event.target.value)
                }
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = t("titleplaceholder"))}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={9}>
              <FormLabel className={classes.formLabel}>
                {t("common:skills")}
              </FormLabel>
              <ReactTags
                tags={values.jobskills || ""}
                suggestions={suggestions}
                handleDelete={this.handleDelete}
                handleAddition={this.handleAddition}
                autofocus={false}
                allowNew={true}
                placeholder={this.state.tagPlaceholder}
                tagComponent={this.Tag}
                allowBackspace={false}
                inputAttributes={{ maxLength: 50 }}
                autoresize={false}
                //handleValidate={this.handleValidate}
                //handleFocus={this.handleFocus}
                //handleBlur={this.handleBlur}
                classNames={{
                  root:
                    showError && errors.jobskills
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
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={3}>
              <InputLabel
                className={classes.formLabel}
                style={{ marginBottom: 0 }}
              >
                {t("numberofpositions")}
              </InputLabel>
              <ButtonGroup
                size="large"
                color="primary"
                variant="contained"
                style={{ width: 137, boxShadow: "none" }}
                aria-label="small outlined button group"
              >
                <Button
                  variant="contained"
                  className={classes.grpButton}
                  onClick={this.DecreaseItem}
                >
                  <Remove />
                </Button>
                <InputBase
                  style={
                    showError && errors.position
                      ? { border: "1px solid red" }
                      : null
                  }
                  inputProps={{
                    style: {
                      textAlign: "center",
                      borderRight: "1px solid #ff9900!important",
                    },
                  }}
                  className={classes.addRemove}
                  value={values.position || "1"}
                  onChange={(event) =>
                    this.handleChange("position", event.target.value)
                  }
                />
                  <Button
                  variant="contained"
                  className={classes.grpButton}
                  onClick={this.IncrementItem}
                >
                  <Add />
                </Button>
              
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" className={classes.formControl}>
                <FormLabel className={classes.formLabel}>
                  {t("location")}
                </FormLabel>
                <Select
                  error={showError && getMsg(errors.addressId, t)}
                  value={values.addressId || this.state.selectedAddressId}
                  margin="dense"
                  input={
                    <OutlinedInput
                      labelWidth={0}
                      name="Location"
                      id="outlined-age-simple"
                    />
                  }
                  onChange={(event) =>
                    this.handleChange("addressId", event.target.value)
                  }
                >
                  <MenuItem value="0" disabled>
                    {t("common:select")}
                  </MenuItem>

                  {addresses &&
                    addresses.map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {getFullAddress(item)}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.inputLabel}>
                  {t("type")}
                </FormLabel>
                <RadioGroup
                  aria-label="type"
                  name="type"
                  row
                  value={parseInt(values.type)}
                  onChange={(event) => {
                    this.setState(
                      {
                        values: {
                          ...this.state.values,
                          type: event.target.value,
                        },
                      },
                      this.validateForm
                    );
                  }}
                >
                  {JobType.getKeyValuePairs().map((item) => {
                    return (
                      <FormControlLabel
                        value={item.value}
                        control={
                          <Radio
                            color="primary"
                            className={
                              showError && errors.type
                                ? classes.radioButtonIconErr
                                : null
                            }
                          />
                        }
                        label={t(`${item.name}`)}
                        labelPlacement="end"
                        className={classes.radioItem}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={2} className={classes.fiveCol}>
              <InputLabel className={classes.inputLabel}>
                {t("jobstartdate")}
              </InputLabel>
              <DatePicker
                placeholderText={t("common:startDate")}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = t("common:startDate"))}
                format="MM/DD/YYYY"
                selected={values.startDate && new Date(values.startDate)}
                onChange={(date) => this.handleChange("startDate", date)}
                minDate={new Date()}
                customInput={
                  <TextField
                    error={
                      (showError && getMsg(errors.startDate, t)) || dateError
                    }
                    id="outlined-dense-multiline"
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    //value={values.startDate}
                    // InputProps={{
                    //   endAdornment: (
                    //     <InputAdornment>
                    //       <CalendarToday style={{ height: 16, width: 16 }} />
                    //     </InputAdornment>
                    //   ),
                    // }}
                    // onChange={event =>
                    //   this.handleChange("startDate", event.target.value)
                    // }
                  />
                }
              />
            </Grid>
            {values.type > 1 && (
              <Grid item xs={12} sm={2} className={classes.fiveCol}>
                <InputLabel className={classes.inputLabel}>
                  {t("endDate")}
                </InputLabel>
                <DatePicker
                  placeholderText={t("endDate")}
                  format="MM/DD/YYYY"
                  minDate={new Date()}
                  selected={values.endDate && new Date(values.endDate)}
                  onChange={(date) => this.handleChange("endDate", date)}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = t("endDate"))}
                  customInput={
                    <TextField
                      error={
                        (showError && getMsg(errors.endDate, t)) || dateError
                      }
                      id="outlined-dense-multiline"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      //value={values.endDate}
                      // InputProps={{
                      //   endAdornment: (
                      //     <InputAdornment>
                      //       <CalendarToday style={{ height: 16, width: 16 }} />
                      //     </InputAdornment>
                      //   ),
                      // }}
                      // onChange={event =>
                      //   this.handleChange("endDate", event.target.value)
                      // }
                    />
                  }
                />
              </Grid>
            )}
            {values.type > 2 && (
              <Grid item xs={12} sm={2} className={classes.fiveCol}>
                <InputLabel className={classes.inputLabel}>
                  {t("duration")}
                </InputLabel>
                <TextField
                  error={showError && getMsg(errors.duration, t)}
                  id="outlined-dense-multiline"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  placeholder={t("duration")}
                  value={values.duration || ""}
                  onChange={(event) =>
                    this.handleChange("duration", event.target.value)
                  }
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = t("duration"))}
                  inputProps={{
                    maxlength: 4,
                  }}
                />
              </Grid>
            )}
            {values.startDate && (
              <Grid item xs={12} sm={2} className={classes.fiveCol}>
                <InputLabel className={classes.inputLabel}>
                  {t("quarter")}
                </InputLabel>
                <TextField
                  disabled={true}
                  id="outlined-dense-multiline"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  placeholder={t("quarter")}
                  value={
                    values.startDate &&
                    getQuarterYear(new Date(values.startDate), finStartMonth)
                  }
                  inputProps={{
                    style: {
                      color: "#66788A",
                    },
                  }}
                />
              </Grid>
            )}
            {values.startDate && (
              <Grid item xs={12} sm={2} className={classes.fiveCol}>
                <InputLabel className={classes.inputLabel}>
                  {t("common:financialyear")}
                </InputLabel>
                <TextField
                  disabled={true}
                  id="outlined-dense-multiline"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  placeholder={t("common:financialyear")}
                  value={financialYear}
                  inputProps={{
                    style: {
                      color: "#66788A",
                    },
                  }}
                />
              </Grid>
            )}
          </Grid>
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={2} className={classes.fiveCol}>
              <FormControl variant="outlined" className={classes.formControl}>
                <FormLabel className={classes.inputLabel}>
                  {t("experienceYrs")}
                </FormLabel>
                <TextField
                  error={showError && getMsg(errors.exp, t)}
                  value={values.exp || ""}
                  id="outlined-dense-multiline"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  placeholder={t("minimum")}
                  onChange={(event) =>
                    this.handleChange("exp", event.target.value)
                  }
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = t("minimum"))}
                  inputProps={{
                    maxlength: 2,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} className={classes.threeCol}>
              <FormControl variant="outlined" className={classes.formControl}>
                <FormLabel className={classes.formLabel}>
                  {t("department")}
                </FormLabel>
                <Select
                  error={showError && getMsg(errors.departmentId, t)}
                  value={values.departmentId || this.state.selectedDepartmentId}
                  margin="dense"
                  input={
                    <OutlinedInput
                      labelWidth="0"
                      name="age"
                      id="outlined-age-simple"
                    />
                  }
                  onChange={(event) =>
                    this.handleChange("departmentId", event.target.value)
                  }
                >
                  <MenuItem value="0" disabled>
                    {t("common:select")}
                  </MenuItem>
                  {dList &&
                    dList.map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2} className={classes.fiveCol}>
              <FormControl variant="outlined" className={classes.formControl}>
                <FormLabel className={classes.inputLabel}>
                  {t("common:compensation")}
                </FormLabel>
                <TextField
                  error={
                    (showError && getMsg(errors.payRate, t)) || commonError
                  }
                  value={values.payRate || ""}
                  inputProps={{ maxLength: 8 }}
                  id="outlined-dense-multiline"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  placeholder={values.type > 1 ? t("perhour") : t("perannum")}
                  onChange={(event) =>
                    this.handleChange("payRate", event.target.value)
                  }
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (
                    (e.target.placeholder =
                      values.type > 2 ? t("perhour") : t("perannum")),
                    this.formatCurrency(e.target.value)
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={9}>
              <InputLabel className={classes.inputLabel}>
                {t("jobdescription")}
              </InputLabel>

              <MuiThemeProvider theme={theme}>
                <MUIRichTextEditor
                  error={showError && getMsg(errors.description, t)}
                  label={t("descriptionPlaceholder")}
                  controls={[
                    "title",
                    "bold",
                    "italic",
                    "underline",
                    "undo",
                    "redo",
                    "quote",
                    "bulletList",
                    "numberList",
                    "Blockquote",
                    "code",
                    "clear",
                  ]}
                  //onSave={this.handleSave}
                  value={jobDesc}
                  onChange={this.handleDescChange}
                />
              </MuiThemeProvider>

              {/* <TextField
                error={showError && errors.description}
                id="outlined-dense-multiline"
                value={values.description || ""}
                inputProps={{
                  maxlength: 2000
                }}
                // helperText={
                //   values.description && values.description.length > 0
                //     ? `${values.description.length}/${CHARACTER_LIMIT}`
                //     : CHARACTER_LIMIT
                // }
                margin="dense"
                variant="outlined"
                multiline
                rowsMax="4"
                rows="3"
                fullWidth
                placeholder="Provide a broad and general statement of the job including the purpose, scope and working conditions."
                onChange={event =>
                  this.handleChange("description", event.target.value)
                }
                onFocus={e => (e.target.placeholder = "")}
                onBlur={e =>
                  (e.target.placeholder =
                    "Provide a broad and general statement of the job including the purpose, scope and working conditions.")
                }
              /> */}
            </Grid>
          </Grid>

          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12} sm={9}>
              <InputLabel className={classes.inputLabel}>
                {t("jobresponsibilities")}
              </InputLabel>

              <MuiThemeProvider theme={theme}>
                <MUIRichTextEditor
                  error={showError && getMsg(errors.responsibility, t)}
                  label={t("respplaceholder")}
                  controls={[
                    "title",
                    "bold",
                    "italic",
                    "underline",
                    "undo",
                    "redo",
                    "quote",
                    "bulletList",
                    "numberList",
                    "Blockquote",
                    "code",
                    "clear",
                  ]}
                  value={jobResp}
                  onChange={this.handleRespChange}
                />
              </MuiThemeProvider>

              {/* <TextField
                error={showError && errors.responsibility}
                inputProps={{
                  maxlength: 2000
                }}
                // helperText={
                //   values.responsibility && values.responsibility.length > 0
                //     ? `${values.responsibility.length}/${CHARACTER_LIMIT}`
                //     : CHARACTER_LIMIT
                // }
                id="outlined-dense-multiline"
                value={values.responsibility || ""}
                margin="dense"
                variant="outlined"
                multiline
                rowsMax="4"
                rows="3"
                fullWidth
                placeholder="A description of the responsibilities and expectations defined for the job."
                onChange={event =>
                  this.handleChange("responsibility", event.target.value)
                }
                onFocus={e => (e.target.placeholder = "")}
                onBlur={e =>
                  (e.target.placeholder =
                    "A description of the responsibilities and expectations defined for the job.")
                }
              /> */}
            </Grid>
          </Grid>
          <MessageBox
            open={this.state.dateError}
            variant="error"
            onClose={() => {
              this.setState({ dateError: false });
            }}
            message={t("common:errMsg.endDateErr")}
          />
          <MessageBox
            open={this.state.showSuccess}
            variant="success"
            onClose={this.handleMsgClose}
            message={t("common:succMsg.savedSuccessfully")}
          />
          <MessageBox
            open={this.state.commonError}
            variant="error"
            onClose={() => {
              this.setState({ commonError: false });
            }}
            message={this.state.commonErrorMsg}
          />

          <Dialog
            open={this.state.showDialog}
            onClose={this.handleClose}
            mess
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {this.state.errTitleMsg || t("common:errMsg.incompleteInfo")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {this.state.errMsg}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                {t("common:ok")}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={this.state.showConfirmPopup}
          >
            <DialogTitle id="confirmation-dialog-title">Delete</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("deleteItem")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancel} color="primary">
                {t("common:cancel")}
              </Button>
              <Button onClick={this.handleOk} color="primary">
                {t("common:ok")}
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Fade>
    );
  }
}
const mapDispatchToProps = {
  loadDepartments: loadDepartments,
  loadAddresses: loadAddresses,
  loadConfiguration: loadConfiguration,
  loadSkills: loadSkills,
  createJobPost: createJobPost,
  getJobPost: getJobPost,
  deleteJobSkill: deleteJobSkill,
};

const mapStateToProps = (state) => ({
  dList: state.employer && state.employer.departments,
  addresses: state.employer && state.employer.locations,
  skills: state.employer && state.employer.skills,
  jobPost: state.jobPost,
  orgId: state.profile && state.profile.orgId,
  finStartMonth:
    (state.employer &&
      state.employer.config &&
      state.employer.config.FinStartMonth) ||
    "",
  finEndMonth:
    (state.employer &&
      state.employer.config &&
      state.employer.config.FinEndMonth) ||
    "",
  roles: state.profile && state.profile.roles && state.profile.roles[0],
});

Details.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation(["jobPost", "common", "enum"])(Details)))
);
