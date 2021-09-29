import React, { Component } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";

// Externals
import classNames from "classnames";

// Material helpers
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import {
  loadSkills,
  //loadInterviewLevels,
  loadInterviewers,
} from "services/employer/action";

import {
  withStyles,
  //createMuiTheme,
  //MuiThemeProvider
} from "@material-ui/core";

import {
  updateJobPost,
  deleteJobSkill,
  deleteEducation,
  deleteCertification,
  deleteScreeningQuest,
  deleteInterviewLevel,
  deleteInterviewQuest,
  getJobPost,
} from "services/jobPost/action";
// Material components
import { Edit, DeleteOutlined } from "@material-ui/icons";
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
  //Chip,
  Switch,
  Modal,
  //FormControl,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
} from "@material-ui/core";

// Component styles
import styles from "../styles";
import { EditQuestions } from "../../../Modals/";
import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";
import MessageBox from "util/messageBox";
import { AnswerType, Competency, InterviewMode, Priority } from "util/enum";

export function Handle({ handle: { id, value, percent }, getHandleProps }) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: "absolute",
        marginLeft: -5,
        top: "-5px",
        zIndex: 2,
        width: 15,
        height: 15,
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
  marginTop: 0,
  borderRadius: 5,
  backgroundColor: "#DED9D9",
};

validate.validators.array = (arrayItems, itemConstraints) => {
  const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
    const error = validate(item, itemConstraints);
    if (error) errors[index] = { error: error };
    return errors;
  }, {});

  return arrayItemErrors.length === 0 ? null : arrayItemErrors;
};
// const themes = createMuiTheme({
//   palette: {
//     primary: {
//       contrastText: "white",
//       main: "#3188C8",
//       light: "#ebf8fe",
//       dark: "#0270a2"
//     },
//     secondary: {
//       contrastText: "white",
//       main: "#57B894",
//       light: "",
//       dark: "#156a4a"
//     }
//   },
//   overrides: {
//     MuiSelect: {
//       root: {
//         padding: "2px 5px!important",
//         minHeight: "38px!important",
//         display: "flex",
//         alignItems: "center",
//         flexWrap: "wrap"
//       }
//     },
//     MuiChip: {
//       root: {
//         border: "1px solid #2196F3",
//         backgroundColor: "#f9f9f9",
//         margin: 2,
//         height: 26,
//         borderRadius: 13
//       }
//     }
//   }
// });

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//       marginTop: 40
//     }
//   }
// };

function getUnique(arr, comp) {
  if (arr) {
    try {
      const unique = arr
        .map((e) => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter((e) => arr[e])
        .map((e) => arr[e]);
      return unique;
    } catch (error) {
      //  errorHandler(error);
      return null;
    }
  }
}

class Competancy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: [],
      errMsg: "",
      tagPlaceholder: this.props.t("enternewskilltooldomain"),
      open: false,
      istagUpdate: false,
      errors: {},
      errorFlag: false,
      selectedPanels: [],
      skillRows: [
        {
          id: 0,
          skillId: 0,
          competency: "0",
          exp: "",
          name: "",
          mandatory: false,
          priority: "0",
        },
      ],
      educationRows: [{ qualification: "", additionalInfo: "" }],
      certificatonRows: [{ name: "", mandatory: false }],
      interLevelRows: [
        {
          level: "0",
          mode: "0",
          panelId: "0",
        },
      ],
      interQuestRows: [
        {
          question: "",
          panelId: "0",
        },
      ],
      screeningRows: [],
      skillScore: "0",
      domainScore: "0",
      interviewScore: "0",
      behaviouralScore: "0",
      totalScore: 0,
      touched: {},
    };
    this.handleModalClose = this.handleModalClose.bind(this);
    this.initialState = this.state;
  }

  clearUnsavedData = () => {
    const newState = { ...this.state };
    newState.skillRows =
      this.props.jobPost.data &&
      this.props.jobPost.data.jobskills &&
      this.props.jobPost.data.jobskills.length !== 0
        ? this.props.jobPost.data.jobskills
        : this.initialState.skillRows;
    newState.educationRows =
      this.props.jobPost.data &&
      this.props.jobPost.data.jobeduqualifications &&
      this.props.jobPost.data.jobeduqualifications.length !== 0
        ? this.props.jobPost.data.jobeduqualifications
        : this.initialState.educationRows;
    newState.certificatonRows =
      this.props.jobPost.data &&
      this.props.jobPost.data.jobcertifications &&
      this.props.jobPost.data.jobcertifications.length !== 0
        ? this.props.jobPost.data.jobcertifications
        : this.initialState.certificatonRows;

    this.setState(newState, this.validateForm);
  };

  componentDidMount() {
    this.props.onRef(this);
    this.props.loadSkills();
    //this.props.loadInterviewLevels(this.props.orgId);
    this.props.loadInterviewers(this.props.orgId);
    if (
      this.props.jobPost &&
      this.props.jobPost.data &&
      this.props.jobPost.data.id > 0
    ) {
      this.props.getJobPost(this.props.jobPost.data.id);
    }
    //this.validateForm();
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  componentDidUpdate(prevProps) {
    this.validateForm();
  }
  handleOpen = (idx) => () => {
    const screeningRows = [...this.state.screeningRows];
    if (idx || idx === 0) {
      const screeningItem = screeningRows[idx];
      screeningItem.idx = idx;
      this.setState({ open: true, screeningItem });
    } else {
      this.setState({ open: true });
    }
  };
  handleModalClose() {
    this.setState({ screeningItem: null, open: false });
  }
  handleDelete = (event) => {
    alert("Are you sure, you want to delete the skill?");
  };

  handleMsgClose = () => {
    this.setState({ showSuccess: false });
  };
  validateForm = _.debounce(async () => {
    // const {
    //   skillRows,
    //   educationRows,
    //   certificatonRows,
    //   addDetails
    // } = this.state;

    const newState = { ...this.state };
    let errors = validate(newState, schema);
    if (
      !errors &&
      (!newState.screeningRows || newState.screeningRows.length === 0)
    ) {
      if (!errors) {
        errors = {};
      }
      errors.screeningRows = [""];
      newState.errMsg = this.props.t("common:errMsg.screeningQnEmpty");
    }
    if (!errors && this.state.totalScore !== 100) {
      if (!errors) {
        errors = {};
      }
      errors.skillScore = [""];
      errors.domainScore = [""];
      errors.interviewScore = [""];
      errors.behaviouralScore = [""];
      newState.errMsg = this.props.t("common:errMsg.overallScoreShouldbe");
    }
    //  else if (errors) {
    //   newState.errMsg = this.props.t("common:errMsg.fillReqInfo");
    // }
    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
    return newState.isValid;
  }, 300);

  //Save Competancy
  saveCompetancy = async () => {
    const {
      jobPost,
      skillRows,
      educationRows,
      certificatonRows,
      interLevelRows,
      interQuestRows,
      screeningRows,
      skillScore,
      domainScore,
      interviewScore,
      behaviouralScore,
      totalScore,
      errors,
    } = this.state;
    const data = { ...jobPost };
    const hasValue =
      (skillRows.length > 0 && skillRows[0].skillId > 0) ||
      (educationRows.length > 0 && educationRows[0].qualification !== "") ||
      (certificatonRows.length > 0 && certificatonRows[0].name !== "") ||
      (interLevelRows.length > 0 && interLevelRows[0].level !== "0") ||
      (interQuestRows.length > 0 && interQuestRows[0].question !== "") ||
      screeningRows.length > 0 ||
      totalScore > 0;
    if (this.checkUnsavedData() || hasValue) {
      data.skillRows = skillRows.filter((c) => c.name && c.name !== "");
      data.educationRows = educationRows.filter(
        (c) => c.qualification && c.qualification !== ""
      );
      data.certificatonRows = certificatonRows.filter(
        (c) => c.name && c.name !== ""
      );
      data.interLevelRows = interLevelRows.filter((c) => c.level !== "0");
      data.interQuestRows = interQuestRows.filter((c) => c.question !== "");
      data.screeningRows = screeningRows;
      data.skillScore = skillScore;
      data.domainScore = domainScore;
      data.interviewScore = interviewScore;
      data.behaviouralScore = behaviouralScore;
      //data.createdAt = new Date().toISOString();

      let splitTabs = [];
      let tab = null;
      if (data.tab) {
        splitTabs = data.tab.split(",");
      }
      if (Object.entries(errors).length === 0) {
        tab = splitTabs.length > 0 && splitTabs[0] === "1" ? "1,1,0" : "0,1,0";
      } else {
        tab = splitTabs.length > 0 && splitTabs[0] === "1" ? "1,0,0" : "0,0,0";
      }
      data.tab = tab;
      //data.status = 1;
      this.setState({
        ...this.state,
        touched: {},
        showError: false,
        showSuccess: true,
      });
      const res = await this.props.updateJobPost(data, {
        competencyError: errors,
      });
      return res;
    } else {
      this.setState({
        showDialog: true,
        errTitleMsg: this.props.t("common:errMsg.emptyFields"),
        errMsg: this.props.t("common:errMsg.infoNotAdded"),
      });
    }
  };

  saveAndContinueCompetancy = async () => {
    const {
      jobPost,
      skillRows,
      educationRows,
      certificatonRows,
      interLevelRows,
      interQuestRows,
      screeningRows,
      skillScore,
      domainScore,
      interviewScore,
      behaviouralScore,
      errors,
    } = this.state;
    if (Object.entries(errors).length === 0) {
      const data = { ...jobPost };
      data.skillRows = skillRows.filter((c) => c.name && c.name !== "");
      data.educationRows = educationRows.filter(
        (c) => c.qualification && c.qualification !== ""
      );
      data.certificatonRows = certificatonRows.filter(
        (c) => c.name && c.name !== ""
      );
      data.interLevelRows = interLevelRows.filter((c) => c.level !== "0");
      data.interQuestRows = interQuestRows.filter((c) => c.question !== "");
      data.screeningRows = screeningRows;
      data.skillScore = skillScore;
      data.domainScore = domainScore;
      data.interviewScore = interviewScore;
      data.behaviouralScore = behaviouralScore;
      //data.createdAt = new Date().toISOString();

      let splitTabs = [];
      if (data.tab) {
        splitTabs = data.tab.split(",");
      }

      data.tab =
        splitTabs.length > 0 && splitTabs[0] === "1" ? "1,1,0" : "0,1,0";
      this.setState({ ...this.state, touched: {} });
      const res = await this.props.updateJobPost(data, {
        competencyError: errors,
      });
      return res;
    } else {
      let errMsg = this.state.errMsg;
      this.setState({
        showDialog: true,
        showError: true,
        errMsg: errMsg || this.props.t("common:errMsg.fillReqInfo"),
      });
    }
  };

  // Skill Rows -- Start //
  handleChangeSkill = (idx) => (e) => {
    const newState = { ...this.state };
    const { name, value } = e.target;

    const re = /^[0-9\b]+$/;
    if (name === "exp") {
      if (e.target.value === "" || re.test(e.target.value)) {
        const skillRows = [...this.state.skillRows];
        skillRows[idx] = { ...skillRows[idx], [name]: value };
        newState.skillRows = skillRows;
        // this.setState(
        //   {
        //     skillRows
        //   },
        //   this.validateForm
        // );
      }
    } else if (name === "mandatory") {
      const skillRows = [...this.state.skillRows];
      skillRows[idx] = {
        ...skillRows[idx],
        [name]: !(value === "true"),
      };
      newState.skillRows = skillRows;
      // this.setState({
      //   skillRows
      // });
    } else {
      const skillRows = [...this.state.skillRows];
      skillRows[idx] = { ...skillRows[idx], [name]: value };
      newState.skillRows = skillRows;
      // this.setState(
      //   {
      //     skillRows
      //   },
      //   this.validateForm
      // );
    }

    if (value && value !== "0") {
      newState.touched[name] = true;
    } else {
      delete newState.touched[name];
    }
    this.setState(newState, this.validateForm);
  };
  handleAddSkillRow = () => {
    const item = {
      competency: "0",
      exp: "",
      skill: "",
      mandatory: false,
      priority: "0",
    };
    this.setState({
      skillRows: [...this.state.skillRows, item],
    });
  };

  handleDeleteScreeningQuest = (idx) => () => {
    this.setState({
      showScreeningQuestPopup: true,
      deleteScreeningQuestId: idx,
    });
  };

  handleRemoveScreeningQuestRow = () => {
    const idx = this.state.deleteScreeningQuestId;
    const screeningRows = [...this.state.screeningRows];
    const id = screeningRows[idx].id;
    if (id > 0) {
      this.props.deleteScreeningQuest(id);
    }

    if (screeningRows.length === 1) {
      this.setState({
        screeningRows: [],
        showScreeningQuestPopup: false,
      });
    } else {
      screeningRows.splice(idx, 1);
      this.setState({
        screeningRows,
        showScreeningQuestPopup: false,
      });
    }
  };

  handleAddInterviewLevel = () => {
    const item = {
      level: "0",
      mode: "0",
      panelId: "0",
    };
    this.setState({
      interLevelRows: [...this.state.interLevelRows, item],
    });
  };

  handleChangeInterviewLevel = (idx) => (e) => {
    const newState = { ...this.state };
    const { name, value } = e.target;
    if (name === "panelId") {
      let panel = this.props.interviewers.find((c) => c.id === value);
      const selectedPanels = this.state.selectedPanels
        ? [...this.state.selectedPanels]
        : [];
      // selectedPanels.push(panel);
      selectedPanels.push(panel);

      newState.selectedPanels = getUnique(selectedPanels, "id");
    }

    const interLevelRows = [...this.state.interLevelRows];
    interLevelRows[idx] = { ...interLevelRows[idx], [name]: value };
    newState.interLevelRows = interLevelRows;

    if (value && value !== "0") {
      newState.touched[name] = true;
    } else {
      delete newState.touched[name];
    }
    this.setState(newState, this.validateForm);
  };

  handleRemoveInterLevelRow = () => {
    const idx = this.state.deleteInterLevelId;
    const interLevelRows = [...this.state.interLevelRows];
    const id = interLevelRows[idx].id;
    const panelId = interLevelRows[idx].panelId;
    if (panelId > 0) {
      let selectedPanels = [...this.state.selectedPanels];
      selectedPanels = selectedPanels.filter((c) => c.id !== panelId);
      const uniqueNames = Array.from(new Set(selectedPanels));

      this.setState({ selectedPanels: uniqueNames });
    }

    if (id > 0) {
      this.props.deleteInterviewLevel(id);
    }

    if (interLevelRows.length === 1) {
      this.setState({
        interLevelRows: [
          {
            level: "0",
            mode: "0",
            panelId: "0",
          },
        ],
        showInterLevelPopup: false,
      });
    } else {
      interLevelRows.splice(idx, 1);
      this.setState({
        interLevelRows,
        showInterLevelPopup: false,
      });
    }
  };

  handleDeleteInterviewLevel = (idx) => () => {
    this.setState({ showInterLevelPopup: true, deleteInterLevelId: idx });
  };

  handleAddInterviewQuest = () => {
    const item = {
      level: "0",
      mode: "0",
      panelId: "0",
    };
    this.setState({
      interQuestRows: [...this.state.interQuestRows, item],
    });
  };

  handleChangeInterviewQuest = (idx) => (e) => {
    const newState = { ...this.state };
    const { name, value } = e.target;

    const interQuestRows = [...this.state.interQuestRows];
    interQuestRows[idx] = { ...interQuestRows[idx], [name]: value };
    newState.interQuestRows = interQuestRows;

    if (value && value !== "0") {
      newState.touched[name] = true;
    } else {
      delete newState.touched[name];
    }
    this.setState(newState, this.validateForm);
  };

  handleRemoveInterQuestRow = () => {
    const idx = this.state.deleteInterQuestId;
    const interQuestRows = [...this.state.interQuestRows];
    const id = interQuestRows[idx].id;
    if (id > 0) {
      this.props.deleteInterviewQuest(id);
    }

    if (interQuestRows.length === 1) {
      this.setState({
        interQuestRows: [
          {
            question: "",
            panelId: "0",
          },
        ],
        showInterQuestPopup: false,
      });
    } else {
      interQuestRows.splice(idx, 1);
      this.setState({
        interQuestRows,
        showInterQuestPopup: false,
      });
    }
  };

  handleDeleteInterviewQuest = (idx) => () => {
    this.setState({ showInterQuestPopup: true, deleteInterQuestId: idx });
  };

  handleDeleteSkill = (idx) => () => {
    this.setState({ showSkillPopup: true, deleteSkillId: idx });
  };
  handleDeleteEdu = (idx) => () => {
    this.setState({ showEduPopup: true, deleteEduId: idx });
  };
  handleDeleteCer = (idx) => () => {
    this.setState({ showCerPopup: true, deleteCerId: idx });
  };

  handleCancelSkill = () => {
    this.setState({ showSkillPopup: false });
  };
  handleCancelEdu = () => {
    this.setState({ showEduPopup: false });
  };
  handleCancelCer = () => {
    this.setState({ showCerPopup: false });
  };
  handleCancelScreeningQuest = () => {
    this.setState({ showScreeningQuestPopup: false });
  };
  handleCancelInterLevel = () => {
    this.setState({ showInterLevelPopup: false });
  };
  handleCancelInterQuest = () => {
    this.setState({ showInterQuestPopup: false });
  };

  handleRemoveSpecificSkillRow = () => {
    const idx = this.state.deleteSkillId;
    const skill = this.state.skillRows[idx];
    const skillRows = [...this.state.skillRows];
    const id = skillRows[idx].id;
    if (id > 0) {
      this.props.deleteJobSkill(id);
    }

    if (skillRows.length === 1) {
      this.setState({
        skillRows: [
          {
            id: 0,
            skillId: 0,
            competency: "0",
            exp: "",
            name: "",
            mandatory: false,
            priority: "0",
          },
        ],
        showSkillPopup: false,
      });
    } else {
      skillRows.splice(idx, 1);
      this.setState({
        skillRows,
        showSkillPopup: false,
        suggestions: this.state.suggestions.concat(skill),
      });
    }
  };
  // Skill Rows -- End //

  //Education Rows -- Start//
  handleChangeEdu = (idx) => (e) => {
    const newState = { ...this.state };
    const { name, value } = e.target;
    const educationRows = [...this.state.educationRows];
    educationRows[idx] = { ...educationRows[idx], [name]: value };
    newState.educationRows = educationRows;
    // this.setState(
    //   {
    //     educationRows
    //   },
    //   this.validateForm
    // );

    if (value) {
      newState.touched[name] = true;
    } else {
      delete newState.touched[name];
    }
    this.setState(newState, this.validateForm);
  };
  handleAddEduRow = () => {
    const item = {
      id: 0,
      qualification: "",
      additionalInfo: "",
    };
    this.setState({
      educationRows: [...this.state.educationRows, item],
    });
  };
  handleRemoveSpecificEduRow = () => {
    const idx = this.state.deleteEduId;
    const educationRows = [...this.state.educationRows];
    const id = educationRows[idx].id;
    if (id > 0) {
      this.props.deleteEducation(id);
    }

    if (educationRows.length === 1) {
      this.setState({
        educationRows: [{ qualification: "", additionalInfo: "" }],
        showEduPopup: false,
      });
    } else {
      educationRows.splice(idx, 1);
      this.setState({ educationRows, showEduPopup: false });
    }
  };
  //Education Rows -- End//

  //Certification Rows -- Start//
  handleChangeCert = (idx) => (e) => {
    const newState = { ...this.state };
    const { name, value } = e.target;

    if (name === "mandatory") {
      const certificatonRows = [...this.state.certificatonRows];
      certificatonRows[idx] = {
        ...certificatonRows[idx],
        [name]: !(value === "true"),
      };
      newState.certificatonRows = certificatonRows;
      // this.setState({
      //   certificatonRows
      // });
    } else {
      const certificatonRows = [...this.state.certificatonRows];
      certificatonRows[idx] = { ...certificatonRows[idx], [name]: value };
      newState.certificatonRows = certificatonRows;
      // this.setState(
      //   {
      //     certificatonRows
      //   },
      //   this.validateForm
      // );
    }
    if (value) {
      newState.touched[name] = true;
    } else {
      delete newState.touched[name];
    }
    this.setState(newState, this.validateForm);
  };
  handleAddCertRow = () => {
    const item = {
      name: "",
      mandatory: false,
    };
    this.setState({
      certificatonRows: [...this.state.certificatonRows, item],
    });
  };
  handleRemoveSpecificCertRow = () => {
    const idx = this.state.deleteCerId;
    const certificatonRows = [...this.state.certificatonRows];
    const id = certificatonRows[idx].id;
    if (id > 0) {
      this.props.deleteCertification(id);
    }

    if (certificatonRows.length === 1) {
      this.setState({
        certificatonRows: [{ name: "", mandatory: false }],
        showCerPopup: false,
      });
    } else {
      certificatonRows.splice(idx, 1);
      this.setState({
        certificatonRows,
        showCerPopup: false,
      });
    }
  };
  //Certification Rows -- End//

  handleAddition = (idx) => (e) => {
    const skillRows = [...this.state.skillRows];
    skillRows[idx] = { ...skillRows[idx], name: e.name, skillId: e.skillId };
    this.setState({
      skillRows,
      suggestions: this.state.suggestions.filter(
        (c) => c.skillId !== e.skillId
      ),
    });
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
      tagPlaceholder: this.props.t("enternewskilltooldomain"),
    });
  };

  handleClose = () => {
    this.setState({ showDialog: false });
  };

  checkUnsavedData = () => {
    const { touched } = this.state;
    return touched && Object.entries(touched).length > 0;
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.skills && !prevState.suggestionFlag) {
      return {
        suggestions: nextProps.skills.map((t) => ({
          skillId: t.id,
          name: t.name,
        })),
        suggestionFlag: true,
      };
    }
    if (nextProps.jobPost.data && nextProps.jobPost.data.id) {
      prevState.id = nextProps.jobPost.data.id;
    }
    if (
      nextProps.jobPost &&
      nextProps.jobPost.errors &&
      nextProps.jobPost.errors.competencyError &&
      !prevState.errorFlag
    ) {
      return {
        errors: nextProps.jobPost.errors.competencyError,
        errorFlag: true,
      };
    }
    if (
      nextProps.jobPost.data &&
      nextProps.jobPost.data.jobskills &&
      !prevState.istagUpdate
    ) {
      const mappings = nextProps.jobPost.data.jobskills.map((t) => ({
        id: t.id,
        name: t.name ? t.name : t.skill.name,
        skillId: t.skillId,
        competency: t.competency ? t.competency : "0",
        exp: t.exp ? t.exp : "",
        mandatory: t.mandatory ? t.mandatory : false,
        priority: t.priority ? t.priority : "0",
      }));
      const suggestions = prevState.suggestions.filter(function (val) {
        return mappings.findIndex((c) => c.skillId === val.skillId) === -1;
      });
      // const suggestions = prevState.suggestions.filter(
      //   item => !mappings.includes(item.skillId)
      // );

      return {
        suggestions: suggestions,
        jobPost: nextProps.jobPost.data,
        skillRows: mappings.length === 0 ? prevState.skillRows : mappings,
        // addDetails: nextProps.jobPost.data
        //   ? nextProps.jobPost.data.addDetails
        //   : "",
        istagUpdate: true,
      };
    }
    if (
      nextProps.jobPost.data &&
      (nextProps.jobPost.data.jobcertifications ||
        nextProps.jobPost.data.jobeduqualifications) &&
      !prevState.iscertUpdate
    ) {
      let interLevelRows =
        nextProps.jobPost.data &&
        nextProps.jobPost.data.jobinterviewers &&
        nextProps.jobPost.data.jobinterviewers.length > 0 &&
        nextProps.jobPost.data.jobinterviewers;

      const selectedPanels =
        interLevelRows &&
        interLevelRows.map((item) => {
          return item.interviewpanel || null;
        });
      const uniqueNames = selectedPanels
        ? getUnique(selectedPanels, "id")
        : null;
      return {
        interLevelRows: interLevelRows || prevState.interLevelRows,
        selectedPanels:
          uniqueNames || getUnique(prevState.selectedPanels, "id"),
        certificatonRows:
          nextProps.jobPost.data &&
          nextProps.jobPost.data.jobcertifications &&
          nextProps.jobPost.data.jobcertifications.length > 0
            ? nextProps.jobPost.data.jobcertifications
            : prevState.certificatonRows,
        educationRows:
          nextProps.jobPost.data &&
          nextProps.jobPost.data.jobeduqualifications &&
          nextProps.jobPost.data.jobeduqualifications.length > 0
            ? nextProps.jobPost.data.jobeduqualifications
            : prevState.educationRows,
        screeningRows:
          nextProps.jobPost.data &&
          nextProps.jobPost.data.jobscreeningqtns &&
          nextProps.jobPost.data.jobscreeningqtns.length > 0
            ? nextProps.jobPost.data.jobscreeningqtns
            : prevState.screeningRows,
        skillScore:
          nextProps.jobPost.data && nextProps.jobPost.data.skillScore
            ? nextProps.jobPost.data.skillScore
            : prevState.skillScore,
        domainScore:
          nextProps.jobPost.data && nextProps.jobPost.data.domainScore
            ? nextProps.jobPost.data.domainScore
            : prevState.domainScore,
        interviewScore:
          nextProps.jobPost.data && nextProps.jobPost.data.interviewScore
            ? nextProps.jobPost.data.interviewScore
            : prevState.interviewScore,
        behaviouralScore:
          nextProps.jobPost.data && nextProps.jobPost.data.behaviouralScore
            ? nextProps.jobPost.data.behaviouralScore
            : prevState.behaviouralScore,
        totalScore:
          nextProps.jobPost.data &&
          nextProps.jobPost.data.skillScore !== null &&
          nextProps.jobPost.data &&
          nextProps.jobPost.data.domainScore !== null &&
          nextProps.jobPost.data &&
          nextProps.jobPost.data.interviewScore !== null &&
          nextProps.jobPost.data &&
          nextProps.jobPost.data.behaviouralScore !== null
            ? Number(nextProps.jobPost.data.skillScore) +
              Number(nextProps.jobPost.data.domainScore) +
              Number(nextProps.jobPost.data.interviewScore) +
              Number(nextProps.jobPost.data.behaviouralScore)
            : prevState.totalScore,
        // interLevelRows:
        //   nextProps.jobPost.data &&
        //   nextProps.jobPost.data.jobinterviewers &&
        //   nextProps.jobPost.data.jobinterviewers.length > 0
        //     ? nextProps.jobPost.data.jobinterviewers
        //     : prevState.interLevelRows,
        interQuestRows:
          nextProps.jobPost.data &&
          nextProps.jobPost.data.jobinterviewqtns &&
          nextProps.jobPost.data.jobinterviewqtns.length > 0
            ? nextProps.jobPost.data.jobinterviewqtns
            : prevState.interQuestRows,
        iscertUpdate: true,
      };
    }
    // if (
    //   nextProps.jobPost.data &&
    //   nextProps.jobPost.data.jobeduqualifications &&
    //   !prevState.iseduUpdate
    // ) {
    //   return {
    //     educationRows:
    //       nextProps.jobPost.data &&
    //       nextProps.jobPost.data.jobeduqualifications &&
    //       nextProps.jobPost.data.jobeduqualifications.length > 0
    //         ? nextProps.jobPost.data.jobeduqualifications
    //         : prevState.educationRows,
    //     iseduUpdate: true
    //   };
    // }

    return null;
  }

  getAssessmentScore = (state) => {
    const newState = { ...this.state };
    newState.totalScore =
      Number(state.skillScore) +
      Number(state.domainScore) +
      Number(state.interviewScore) +
      Number(state.behaviouralScore);
    if (newState.totalScore > 100) {
      newState.showScoreError = true;
      newState.msgError = this.props.t("common:errMsg.overallScoreShouldbe");
    } else {
      newState.showScoreError = false;
    }
    this.setState(newState);

    ////old code
    // const newState = { ...this.state };
    // newState.totalScore =
    //   Number(state.skillScore) +
    //   Number(state.domainScore) +
    //   Number(state.interviewScore) +
    //   Number(state.behaviouralScore);
    // this.setState(newState);
    // if (this.state.totalScore > 100) {
    //   this.setState({
    //     showScoreError: true,
    //     msgError: "Overall score should be 100",
    //   });
    // } else {
    //   this.setState({
    //     showScoreError: false,
    //   });
    // }
    // console.log(this.state.totalScore);
  };

  handleChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
    this.getAssessmentScore(this.state);

    ////old code
    // this.setState({ ...this.state, [field]: value });
    // this.field = value;
    // this.getAssessmentScore(this.state);
  };

  savePreScreeningQstns = (rows) => {
    const newState = { ...this.state };
    let screeningRows = [...this.state.screeningRows];
    if (rows.idx || rows.idx === 0) {
      screeningRows[rows.idx] = Object.assign(screeningRows[rows.idx], rows);
    } else {
      rows.priority = 0;
      screeningRows = screeningRows.concat(rows);
    }
    newState.touched[screeningRows] = true;
    newState.screeningRows = screeningRows;
    this.setState(newState);
    this.handleModalClose();
  };

  handleChangePreScreeningQstns = (idx) => (e) => {
    const newState = { ...this.state };
    const screeningRows = [...this.state.screeningRows];
    screeningRows[idx] = { ...screeningRows[idx], priority: e.target.value };
    newState.screeningRows = screeningRows;
    this.setState(newState);
  };

  render() {
    const { classes, t, i18n, hideBtn, levels, interviewers } = this.props;
    const { errors, selectedPanels } = this.state;
    const showError = this.state.showError || this.props.showError;

    return (
      <Fade in="true" timeout="10">
        <div
          className={classes.gridBg2}
          style={{
            backgroundImage: `url(${require(`assets/images/tab-2-bg_${i18n.language}.png`)})`,
          }}
        >
          <Grid container xs={12} sm={10}>
            <Grid container item xs={12}>
              <FormLabel className={classes.formHeader}>
                {t("competency.competencies")}
              </FormLabel>
              <Paper style={{ width: "100%" }}>
                {/* <PerfectScrollbar> */}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHead}>
                        {t("competency.skillToolDomain")}
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
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 90 }}
                      >
                        {t("competency.mandatory")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        align="center"
                        style={{ width: 150 }}
                      >
                        {t("competency.priority")}
                      </TableCell>
                      <TableCell
                        className={classes.tableHead}
                        style={{ width: 25 }}
                        align="center"
                      />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.skillRows.map((item, idx) => (
                      <TableRow hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="center">
                          <TextField
                            error={
                              showError &&
                              errors.skillRows &&
                              errors.skillRows[0][idx] &&
                              getMsg(errors.skillRows[0][idx].error.exp, t)
                            }
                            id="outlined-bare"
                            name="exp"
                            value={item.exp}
                            className={classes.textField}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            inputProps={{ "aria-label": "bare", maxlength: 2 }}
                            placeholder="Ex: 5"
                            style={{ minWidth: 100 }}
                            onChange={this.handleChangeSkill(idx)}
                            onFocus={(e) => (e.target.placeholder = "")}
                            onBlur={(e) => (e.target.placeholder = "Ex: 5")}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Select
                            error={
                              showError &&
                              errors.skillRows &&
                              errors.skillRows[0][idx] &&
                              getMsg(
                                errors.skillRows[0][idx].error.competency,
                                t
                              )
                            }
                            fullWidth
                            value={item.competency}
                            margin="dense"
                            input={
                              <OutlinedInput
                                labelWidth="0"
                                name="competency"
                                id="outlined-age-simple"
                              />
                            }
                            onChange={this.handleChangeSkill(idx)}
                          >
                            <MenuItem value="0">{t("common:select")}</MenuItem>
                            {Competency.getKeyValuePairs().map((item) => {
                              return (
                                <MenuItem value={item.value}>
                                  {t(`${item.name}`)}
                                </MenuItem>
                              );
                            })}
                            {/* <MenuItem value="1">
                              {t("competency.beginner")}
                            </MenuItem>
                            <MenuItem value="2">
                              {t("competency.intermediate")}
                            </MenuItem>
                            <MenuItem value="3">
                              {t("competency.advanced")}
                            </MenuItem>
                            <MenuItem value="4">
                              {t("competency.expert")}
                            </MenuItem> */}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={item.mandatory}
                            value={item.mandatory}
                            color="primary"
                            name="mandatory"
                            onChange={this.handleChangeSkill(idx)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {/* <Switch
                            value={item.priority}
                            color="primary"
                            name="priority"
                            onChange={this.handleChangeSkill(idx)}
                          /> */}
                          <Select
                            error={
                              showError &&
                              errors.skillRows &&
                              errors.skillRows[0][idx] &&
                              getMsg(errors.skillRows[0][idx].error.priority, t)
                            }
                            fullWidth
                            value={item.priority}
                            margin="dense"
                            input={
                              <OutlinedInput
                                labelWidth="0"
                                name="priority"
                                id="outlined-age-simple"
                              />
                            }
                            onChange={this.handleChangeSkill(idx)}
                          >
                            <MenuItem value="0">{t("common:select")}</MenuItem>
                            {Priority.getKeyValuePairs().map((item) => {
                              return (
                                <MenuItem value={item.value}>
                                  {t(`${item.name}`)}
                                </MenuItem>
                              );
                            })}
                            {/* <MenuItem value="1">
                              {t("competency.high")}
                            </MenuItem>
                            <MenuItem value="2">
                              {t("competency.medium")}
                            </MenuItem>
                            <MenuItem value="3">{t("competency.low")}</MenuItem> */}
                          </Select>
                        </TableCell>
                        {!hideBtn && (
                          <TableCell align="center">
                            <IconButton
                              small
                              onClick={this.handleDeleteSkill(idx)}
                              disabled={
                                idx > 0
                                  ? false
                                  : item.name ||
                                    item.exp ||
                                    item.competency !== "0"
                                  ? false
                                  : true
                              }
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* </PerfectScrollbar> */}
              </Paper>
              {!hideBtn ? (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
                  <Button
                    className={classes.inlineBtn}
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={this.handleAddSkillRow}
                  >
                    {t("competency.add")}
                  </Button>
                </Grid>
              ) : (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 30 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid container xs={12} sm={10}>
            <Grid container item xs={12}>
              <FormLabel className={classes.formHeader}>
                {t("competency.education")}
              </FormLabel>
              <Typography
                style={{
                  fontSize: "12px",
                  marginTop: "-1px",
                  color: "#616161",
                  marginLeft: "4px",
                }}
              >
                ({t("highestQualification")})
              </Typography>
              <Paper style={{ width: "100%" }}>
                <PerfectScrollbar>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHead}>
                          {t("competency.educationalQualification")}
                        </TableCell>
                        <TableCell
                          className={classes.tableHead}
                          //style={{ width: 100 }}
                        >
                          {t("competency.additionalInfo")}
                        </TableCell>

                        <TableCell
                          className={classes.tableHead}
                          style={{ width: 25 }}
                          align="center"
                        />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.educationRows.map((item, idx) => (
                        <TableRow hover>
                          <TableCell>
                            <TextField
                              error={
                                showError &&
                                errors.educationRows &&
                                errors.educationRows[0][idx] &&
                                getMsg(
                                  errors.educationRows[0][idx].error
                                    .qualification,
                                  t
                                )
                              }
                              inputProps={{ maxLength: 200 }}
                              id="qualification"
                              name="qualification"
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              placeholder={t("eduplaceholder")}
                              value={item.qualification}
                              onChange={this.handleChangeEdu(idx)}
                              onFocus={(e) => (e.target.placeholder = "")}
                              onBlur={(e) =>
                                (e.target.placeholder = t("eduplaceholder"))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              error={
                                showError &&
                                errors.educationRows &&
                                errors.educationRows[0][idx] &&
                                getMsg(
                                  errors.educationRows[0][idx].error
                                    .additionalInfo,
                                  t
                                )
                              }
                              inputProps={{ maxLength: 200 }}
                              id="additionalInfo"
                              name="additionalInfo"
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              placeholder={t("competency.additionalInfo")}
                              value={item.additionalInfo}
                              onChange={this.handleChangeEdu(idx)}
                              onFocus={(e) => (e.target.placeholder = "")}
                              onBlur={(e) =>
                                (e.target.placeholder = t(
                                  "competency.additionalInfo"
                                ))
                              }
                            />
                          </TableCell>
                          {!hideBtn && (
                            <TableCell align="center">
                              <IconButton
                                small
                                onClick={this.handleDeleteEdu(idx)}
                                disabled={
                                  idx > 0
                                    ? false
                                    : item.qualification || item.additionalInfo
                                    ? false
                                    : true
                                }
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </Paper>
              {!hideBtn ? (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
                  <Button
                    className={classes.inlineBtn}
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={this.handleAddEduRow}
                  >
                    {t("competency.add")}
                  </Button>
                </Grid>
              ) : (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 30 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid container xs={12} sm={10}>
            <Grid container item xs={12}>
              <FormLabel className={classes.formHeader}>
                {t("competency.certificate")}
              </FormLabel>
              <Paper style={{ width: "100%" }}>
                <PerfectScrollbar>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHead}>
                          {t("competency.certificate")}
                        </TableCell>
                        <TableCell className={classes.tableHead}>
                          {t("competency.mandatory")}
                        </TableCell>

                        <TableCell
                          className={classes.tableHead}
                          style={{ width: 25 }}
                          align="center"
                        />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.certificatonRows.map((item, idx) => (
                        <TableRow hover>
                          <TableCell>
                            <TextField
                              error={
                                showError &&
                                errors.certificatonRows &&
                                errors.certificatonRows[0][idx] &&
                                getMsg(
                                  errors.certificatonRows[0][idx].error.name,
                                  t
                                )
                              }
                              inputProps={{ maxLength: 100 }}
                              id="name"
                              name="name"
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              placeholder={t("certplaceholder")}
                              value={item.name}
                              onChange={this.handleChangeCert(idx)}
                              onFocus={(e) => (e.target.placeholder = "")}
                              onBlur={(e) =>
                                (e.target.placeholder = t("certplaceholder"))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={item.mandatory}
                              value={item.mandatory}
                              name="mandatory"
                              color="primary"
                              onChange={this.handleChangeCert(idx)}
                            />
                          </TableCell>
                          {!hideBtn && (
                            <TableCell align="center">
                              <IconButton
                                small
                                onClick={this.handleDeleteCer(idx)}
                                disabled={
                                  idx > 0 ? false : item.name ? false : true
                                }
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </Paper>
              {!hideBtn ? (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
                  <Button
                    className={classes.inlineBtn}
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={this.handleAddCertRow}
                  >
                    {t("competency.add")}
                  </Button>
                </Grid>
              ) : (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 30 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid container xs={12} sm={10}>
            <Grid container item xs={12}>
              <h2 className={classes.subHead}>{t("interviewsetup")}</h2>
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
                          style={{ width: 135 }}
                        >
                          {t("competency.answertype")}
                        </TableCell>
                        <TableCell
                          className={classes.tableHead}
                          align="center"
                          style={{ width: 100 }}
                        >
                          {t("competency.priority")}
                        </TableCell>
                        {!hideBtn && (
                          <TableCell
                            className={classes.tableHead}
                            align="center"
                            style={{ width: 120 }}
                          >
                            {t("setparameter")}
                          </TableCell>
                        )}
                        <TableCell
                          className={classes.tableHead}
                          align="center"
                          style={{ width: 35 }}
                        />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.screeningRows &&
                        this.state.screeningRows.length === 0 && (
                          <TableRow>
                            <TableCell>{t("common:nodata")}</TableCell>
                          </TableRow>
                        )}
                      {this.state.screeningRows.map((item, idx) => (
                        <TableRow>
                          <TableCell
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            {item.question}
                          </TableCell>
                          <TableCell align="center">
                            {item.answerType > 0
                              ? t(
                                  `${AnswerType.getNameByValue(
                                    item.answerType
                                  )}`
                                )
                              : "NA"}
                          </TableCell>
                          <TableCell align="center">
                            <Select
                              error={
                                showError &&
                                errors.screeningRows &&
                                errors.screeningRows[0][idx] &&
                                getMsg(
                                  errors.screeningRows[0][idx].error.priority,
                                  t
                                )
                              }
                              fullWidth
                              value={item.priority}
                              margin="dense"
                              input={
                                <OutlinedInput
                                  labelWidth="0"
                                  name="age"
                                  id="outlined-age-simple"
                                />
                              }
                              onChange={this.handleChangePreScreeningQstns(idx)}
                            >
                              <MenuItem value="0">
                                {t("common:select")}
                              </MenuItem>
                              {Priority.getKeyValuePairs().map((item) => {
                                return (
                                  <MenuItem value={item.value}>
                                    {t(`${item.name}`)}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </TableCell>
                          {!hideBtn && (
                            <TableCell align="center">
                              <IconButton small>
                                <Edit onClick={this.handleOpen(idx)} />
                              </IconButton>
                            </TableCell>
                          )}
                          {!hideBtn && (
                            <TableCell align="center">
                              <IconButton
                                small
                                onClick={this.handleDeleteScreeningQuest(idx)}
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </Paper>
              {!hideBtn ? (
                <Grid
                  item
                  xs={12}
                  style={{ textAlign: "right", paddingTop: 10 }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    className={classes.inlineBtn}
                    onClick={this.handleOpen()}
                  >
                    {t("competency.add")}
                  </Button>
                </Grid>
              ) : (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 30 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid container xs={12} sm={10}>
            <Grid container item xs={12}>
              <FormLabel className={classes.formHeader}>
                {t("interviewers")}
              </FormLabel>
              <Paper style={{ width: "100%" }}>
                <PerfectScrollbar>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableHead}
                          style={{ width: 175 }}
                        >
                          {t("competency.level")}
                        </TableCell>
                        <TableCell
                          className={classes.tableHead}
                          align="center"
                          style={{ width: 175 }}
                        >
                          {t("mode")}
                        </TableCell>
                        <TableCell className={classes.tableHead}>
                          {t("teaminterviewers")}
                        </TableCell>
                        <TableCell
                          className={classes.tableHead}
                          align="center"
                          style={{ width: 35 }}
                        />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.interLevelRows.map((item, idx) => (
                        <TableRow>
                          <TableCell>
                            <Select
                              fullWidth
                              value={item.level}
                              margin="dense"
                              input={
                                <OutlinedInput
                                  labelWidth="0"
                                  name="level"
                                  id="outlined-age-simple"
                                />
                              }
                              onChange={this.handleChangeInterviewLevel(idx)}
                              error={
                                showError &&
                                errors.interLevelRows &&
                                errors.interLevelRows[0][idx] &&
                                getMsg(
                                  errors.interLevelRows[0][idx].error.level,
                                  t
                                )
                              }
                            >
                              <MenuItem value="0">
                                {t("common:select")}
                              </MenuItem>
                              {levels &&
                                levels.map((item, index) => (
                                  <MenuItem key={index} value={item.id}>
                                    {t(
                                      `${
                                        "competency." +
                                        item.name
                                          .split(".")[1]
                                          .replace(/TRANSLATION./g, "")
                                          .split(" ")[0]
                                      }`
                                    ) +
                                      " " +
                                      item.name.split(" ")[1]}
                                  </MenuItem>
                                ))}
                            </Select>
                          </TableCell>

                          <TableCell align="center">
                            <Select
                              fullWidth
                              value={item.mode}
                              margin="dense"
                              input={
                                <OutlinedInput
                                  labelWidth="0"
                                  name="mode"
                                  id="outlined-age-simple"
                                  error={
                                    showError &&
                                    errors.interLevelRows &&
                                    errors.interLevelRows[0][idx] &&
                                    getMsg(
                                      errors.interLevelRows[0][idx].error.mode,
                                      t
                                    )
                                  }
                                />
                              }
                              onChange={this.handleChangeInterviewLevel(idx)}
                            >
                              <MenuItem value="0">
                                {t("common:select")}
                              </MenuItem>
                              {InterviewMode.getKeyValuePairs().map((item) => {
                                return (
                                  <MenuItem value={item.value}>
                                    {t(`${item.name}`)}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              fullWidth
                              value={item.panelId}
                              margin="dense"
                              input={
                                <OutlinedInput
                                  labelWidth="0"
                                  name="panelId"
                                  id="outlined-age-simple"
                                  error={
                                    showError &&
                                    errors.interLevelRows &&
                                    errors.interLevelRows[0][idx] &&
                                    getMsg(
                                      errors.interLevelRows[0][idx].error
                                        .panelId,
                                      t
                                    )
                                  }
                                />
                              }
                              onChange={this.handleChangeInterviewLevel(idx)}
                            >
                              <MenuItem value="0">
                                {t("common:select")}
                              </MenuItem>
                              {interviewers &&
                                interviewers.map((item, index) => (
                                  <MenuItem key={index} value={item.id}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </TableCell>
                          {!hideBtn && (
                            <TableCell align="center">
                              <IconButton
                                small
                                onClick={this.handleDeleteInterviewLevel(idx)}
                                disabled={
                                  idx > 0
                                    ? false
                                    : item.level !== "0" ||
                                      item.mode !== "0" ||
                                      item.panelId !== "0"
                                    ? false
                                    : true
                                }
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </Paper>
              {!hideBtn ? (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
                  <Button
                    className={classes.inlineBtn}
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={this.handleAddInterviewLevel}
                  >
                    {t("competency.add")}
                  </Button>
                </Grid>
              ) : (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 30 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid container xs={12} sm={10}>
            <Grid container item xs={12}>
              <FormLabel className={classes.formHeader}>
                {t("competency.interviewQuestions")}
              </FormLabel>
              <Paper style={{ width: "100%" }}>
                <PerfectScrollbar>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableHead}
                          style={{ width: 350 }}
                        >
                          {t("competency.questions")}
                        </TableCell>
                        <TableCell className={classes.tableHead}>
                          {t("interviewer")}
                        </TableCell>
                        <TableCell
                          className={classes.tableHead}
                          align="center"
                          style={{ width: 35 }}
                        />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.interQuestRows.map((item, idx) => (
                        <TableRow>
                          <TableCell>
                            <TextField
                              name="question"
                              value={item.question}
                              className={classes.textField}
                              margin="dense"
                              variant="outlined"
                              fullWidth
                              inputProps={{ "aria-label": "bare" }}
                              placeholder={t("question")}
                              style={{ minWidth: 100 }}
                              onChange={this.handleChangeInterviewQuest(idx)}
                              onFocus={(e) => (e.target.placeholder = "")}
                              onBlur={(e) =>
                                (e.target.placeholder = t("question"))
                              }
                              error={
                                showError &&
                                errors.interQuestRows &&
                                errors.interQuestRows[0][idx] &&
                                getMsg(
                                  errors.interQuestRows[0][idx].error.question,
                                  t
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              fullWidth
                              value={item.panelId}
                              margin="dense"
                              input={
                                <OutlinedInput
                                  labelWidth="0"
                                  name="panelId"
                                  id="outlined-age-simple"
                                />
                              }
                              onChange={this.handleChangeInterviewQuest(idx)}
                              error={
                                showError &&
                                errors.interQuestRows &&
                                errors.interQuestRows[0][idx] &&
                                getMsg(
                                  errors.interQuestRows[0][idx].error.panelId,
                                  t
                                )
                              }
                            >
                              <MenuItem value="0">
                                {" "}
                                {t("common:select")}
                              </MenuItem>
                              {selectedPanels &&
                                selectedPanels.map((item, index) => (
                                  <MenuItem key={index} value={item.id}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </TableCell>
                          {!hideBtn && (
                            <TableCell align="center">
                              <IconButton
                                small
                                onClick={this.handleDeleteInterviewQuest(idx)}
                                disabled={
                                  idx > 0
                                    ? false
                                    : item.question !== "" ||
                                      item.panelId !== "0"
                                    ? false
                                    : true
                                }
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </Paper>
              {!hideBtn ? (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 10 }}>
                  <Button
                    className={classes.inlineBtn}
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={this.handleAddInterviewQuest}
                  >
                    {t("competency.add")}
                  </Button>
                </Grid>
              ) : (
                <Grid xs={12} style={{ textAlign: "right", paddingTop: 30 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid container xs={12} sm={10}>
            <Grid item xs={12} md={12} lg={12}>
              <FormLabel className={classes.formHeader}>
                {t("assessmentscores")}
              </FormLabel>
            </Grid>
            <Paper style={{ width: "100%", padding: "20px" }}>
              <Grid item xs={12} md={12} lg={12}>
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    md={10}
                    lg={10}
                    style={{ marginTop: "10px" }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={6} lg={6}>
                        <Grid container spacing={0}>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                            className={classes.columnBox}
                          >
                            <Typography
                              style={{ color: "#505050", fontSize: "13px" }}
                            >
                              {t("common:skillscompetency")}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={4}
                            lg={4}
                            className={classes.columnBox}
                          >
                            <Slider
                              rootStyle={sliderStyle}
                              domain={[0, 100]}
                              step={1}
                              mode={2}
                              values={[this.state.skillScore]}
                              onSlideEnd={(event) =>
                                this.handleChange("skillScore", event[0])
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
                          >
                            <Typography
                              style={{ color: "#505050", fontSize: "13px" }}
                            >
                              {t("competency.domainCompetency")}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={4}
                            lg={4}
                            className={classes.columnBox}
                          >
                            <Slider
                              rootStyle={sliderStyle}
                              domain={[0, 100]}
                              step={1}
                              mode={2}
                              values={[this.state.domainScore]}
                              onSlideEnd={(event) =>
                                this.handleChange("domainScore", event[0])
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
                          >
                            <Typography
                              style={{ color: "#505050", fontSize: "13px" }}
                            >
                              {t("competency.interviewQuestions")}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={4}
                            lg={4}
                            className={classes.columnBox}
                          >
                            <Slider
                              rootStyle={sliderStyle}
                              domain={[0, 100]}
                              step={1}
                              mode={2}
                              values={[this.state.interviewScore]}
                              onSlideEnd={(event) =>
                                this.handleChange("interviewScore", event[0])
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
                          >
                            <Typography
                              style={{ color: "#505050", fontSize: "13px" }}
                            >
                              {t("behaviouralassessment")}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={4}
                            lg={4}
                            className={classes.columnBox}
                          >
                            <Slider
                              rootStyle={sliderStyle}
                              domain={[0, 100]}
                              step={1}
                              mode={2}
                              values={[this.state.behaviouralScore]}
                              onSlideEnd={(event) =>
                                this.handleChange("behaviouralScore", event[0])
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
                          {this.state.totalScore}%
                        </span>
                        {this.state.totalScore > 100 ? (
                          <CircularProgress
                            className={classes.cirProgGreenLg}
                            style={{ color: "#ff725f" }}
                            variant="static"
                            value={this.state.totalScore}
                            color="red"
                            thickness={5}
                          />
                        ) : (
                          <CircularProgress
                            className={classes.cirProgGreenLg}
                            variant="static"
                            value={this.state.totalScore}
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
                        {t("common:overallscore")}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
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
            open={this.state.open}
            onClose={this.handleModalClose}
          >
            <EditQuestions
              screeningItem={this.state.screeningItem}
              onCancel={this.handleModalClose}
              savePreScreeningQstns={this.savePreScreeningQstns}
            />
          </Modal>

          <MessageBox
            open={this.state.showSuccess}
            variant="success"
            onClose={this.handleMsgClose}
            message={t("common:succMsg.savedSuccessfully")}
          />

          <MessageBox
            open={this.state.showScoreError}
            variant="error"
            onClose={this.handleClose}
            message={this.state.msgError}
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
            open={this.state.showSkillPopup}
          >
            <DialogTitle id="confirmation-dialog-title">
              {t("common:errMsg.removeSkill")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("common:errMsg.deleteSkillAlert")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancelSkill} color="primary">
                {t("common:cancel")}
              </Button>
              <Button
                onClick={this.handleRemoveSpecificSkillRow}
                color="primary"
              >
                {t("common:ok")}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={this.state.showEduPopup}
          >
            <DialogTitle id="confirmation-dialog-title">
              {t("common:errMsg.removeEducation")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("common:errMsg.deleteEduAlert")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancelEdu} color="primary">
                {t("common:cancel")}
              </Button>
              <Button onClick={this.handleRemoveSpecificEduRow} color="primary">
                {t("common:ok")}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={this.state.showCerPopup}
          >
            <DialogTitle id="confirmation-dialog-title">
              {t("removeCert")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("common:errMsg.deleteCertAlert")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancelCer} color="primary">
                {t("common:cancel")}
              </Button>
              <Button
                onClick={this.handleRemoveSpecificCertRow}
                color="primary"
              >
                {t("common:ok")}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={this.state.showScreeningQuestPopup}
          >
            <DialogTitle id="confirmation-dialog-title">
              {t("common:errMsg.removePreScreeningQa")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("common:errMsg.removePreScreeningQaAlert")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancelScreeningQuest} color="primary">
                {t("common:cancel")}
              </Button>
              <Button
                onClick={this.handleRemoveScreeningQuestRow}
                color="primary"
              >
                {t("common:ok")}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={this.state.showInterLevelPopup}
          >
            <DialogTitle id="confirmation-dialog-title">
              {t("common:errMsg.removeInterviewer")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("common:errMsg.removeInterviewerAlert")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancelInterLevel} color="primary">
                {t("common:cancel")}
              </Button>
              <Button onClick={this.handleRemoveInterLevelRow} color="primary">
                {t("common:ok")}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={this.state.showInterQuestPopup}
          >
            <DialogTitle id="confirmation-dialog-title">
              {t("removeIntwQa")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("removeIntwQaAlert")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancelInterQuest} color="primary">
                {t("common:cancel")}
              </Button>
              <Button onClick={this.handleRemoveInterQuestRow} color="primary">
                {t("common:ok")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Fade>
    );
  }
}

Competancy.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  loadSkills: loadSkills,
  //loadInterviewLevels: loadInterviewLevels,
  loadInterviewers: loadInterviewers,
  updateJobPost: updateJobPost,
  deleteJobSkill: deleteJobSkill,
  deleteEducation: deleteEducation,
  deleteCertification: deleteCertification,
  deleteScreeningQuest: deleteScreeningQuest,
  deleteInterviewLevel: deleteInterviewLevel,
  deleteInterviewQuest: deleteInterviewQuest,
  getJobPost: getJobPost,
};

const mapStateToProps = (state) => ({
  skills: state.employer && state.employer.skills,
  levels:
    state.employer && state.employer.config && state.employer.config.levels,
  interviewers: state.employer && state.employer.interviewers,
  jobPost: state.jobPost,
  orgId: state.profile && state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withStyles(styles)(
      withTranslation(["jobPost", "common", "enum"])(Competancy)
    )
  )
);
