import React, { useState } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import MUIRichTextEditor from "mui-rte";
import { stateToHTML } from "draft-js-export-html";
// Material helpers
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core";

// Material components
import {
  Typography,
  Box,
  AppBar,
  Grid,
  InputLabel,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
// Component styles
import styles from "../styles";
import MessageBox from "util/messageBox";
import { useTranslation } from "react-i18next";
import modalIcon from "../../../assets/images/modal_ico_1.png";
import schema from "./schema";
import validate from "validate.js";

const sliderStyle = {
  position: "relative",
  width: "100%",
  height: 30,
};

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
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "#fff",
        color: "#333",
        border: "2px solid #2C98F0",
      }}
      {...getHandleProps(id)}
    >
      <div style={{ fontFamily: "Roboto", fontSize: 11, marginTop: -15 }}>
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

const RatingConfirm = (props) => {
  const { classes } = props;
  const { t } = useTranslation("common");
  const initialState = {
    values: {
      enthusiasmPerc: "1",
      summary: "",
      showError: false,
      summaryLength: 250,
      isValid: true,
    },
    errors: {
      enthusiasmPerc: null,
    },
  };

  const [values, setValues] = useState(initialState.values);
  const [enthusiasmPerc, setEnthusiasmPerc] = useState(1);
  const [summary, setSummary] = useState(initialState.summary);
  const [summaryLength, setSummaryLength] = useState(
    initialState.values.summaryLength
  );
  const [isValid, setIsValid] = useState(initialState.values.isValid);
  const [modal, setModal] = React.useState(false);

  const handleChange = (value) => {
    setEnthusiasmPerc(value);
  };

  const validate = async () => {
    const isValid = enthusiasmPerc > 0 ? true : false;
    if (!isValid) {
      setValues({
        ...values,
        showError: true,
        showSuccess: false,
        errMsg: t("common:errMsg.fillReqInfo"),
      });
    }
    return isValid;
  };

  function handleModalClose() {
    setModal(false);
  }

  function handleClose() {
    setValues({ showError: false });
  }

  const handleSubmit = () => {
    validate().then((isValid) => {
      if (isValid) {
        props.getJobApplicationFinalValues(enthusiasmPerc, summary);
      }
    });
  };

  const handleSummaryChange = (editorState) => {
    const length = editorState.getCurrentContent().getPlainText("").length;
    if (length >= summaryLength) {
      setValues({
        ...values,
        showError: true,
        showSuccess: false,
        errMsg: t("common:errMsg.summaryAlert"),
      });
      setIsValid(false);
    } else {
      setIsValid(true);
      let html = stateToHTML(editorState.getCurrentContent());
      if (html !== "<p><br></p>") {
        setSummary(html);
      }
    }
  };

  return (
    <PerfectScrollbar style={{ zIndex: 1000 }}>
      <Box
        width={{ xs: "90%", sm: "90%", md: "450px" }}
        className={classes.modalWrap}
      >
        <AppBar position="static" color="default" align="center"></AppBar>
        <Box className={classes.modalContent}>
          <Grid container spacing={3}>
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
                {t("common:profileSubmissionAlert")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel
                className={classes.inputLabel}
                style={{ fontWeight: 500, fontSize: "16px" }}
              >
                {t("common:enthusiasmtojoin")}
              </InputLabel>
              <Slider
                rootStyle={sliderStyle}
                domain={[1, 100]}
                step={1}
                mode={2}
                values={[enthusiasmPerc]}
                onSlideEnd={(event) => handleChange(event[0])}
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
            <Grid item xs={12} sm={12}>
              <InputLabel
                className={classes.inputLabel}
                style={{ fontWeight: 500, fontSize: "16px" }}
              >
                {t("common:summaryOptional")}
              </InputLabel>
              <MuiThemeProvider theme={theme}>
                <MUIRichTextEditor
                  label={t("summaryPlaceholder")}
                  value={summary}
                  onChange={handleSummaryChange}
                />
              </MuiThemeProvider>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                className={classes.modalBtnSecondary}
                onClick={props.onCancel}
              >
                {t("common:cancel")}
              </Button>{" "}
              &nbsp;
              <Button
                disabled={!isValid}
                onClick={handleSubmit}
                variant="contained"
                color="secondary"
                component={Link}
                className={classes.ctaButton}
              >
                {t("common:submit")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <MessageBox
        open={values.showError}
        variant="error"
        onClose={handleClose}
        message={values.errMsg}
      />
    </PerfectScrollbar>
  );
};

export default withStyles(styles)(RatingConfirm);
