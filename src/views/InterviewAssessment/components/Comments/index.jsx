import React from "react";
import {
  Container,
  Grid,
  Box,
  withStyles,
  Typography,
  createMuiTheme,
  MuiThemeProvider,
  CircularProgress,
  Checkbox,
} from "@material-ui/core";
import MUIRichTextEditor from "mui-rte";
import { convertToRaw, convertFromHTML, ContentState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useTranslation } from "react-i18next";

import styles from "../style";
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

export function Handle({ handle: { id, value, percent }, getHandleProps }) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: "absolute",
        marginLeft: -5,
        marginTop: 10,
        zIndex: 2,
        width: 20,
        height: 20,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "#fff",
        color: "#333",
        border: "4px solid #38B5ED",
      }}
      {...getHandleProps(id)}
    >
      <div style={{ fontFamily: "Roboto", fontSize: 11, marginTop: -15 }}>
        {value}
      </div>
    </div>
  );
}
const Comments = (props) => {
  const { classes, disabled } = props;
  const { t } = useTranslation("interviewAssessment");
  const [loading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState(null);
  const [checked, setChecked] = React.useState(true);

  React.useEffect(() => {
    if (props.comments) {
      setComments(displayContent(props.comments));
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [props.comments]);

  React.useEffect(() => {
    setChecked(!props.disableCommentAssessment);
  }, [props.disableCommentAssessment]);

  const displayContent = (markUp) => {
    const contentHTML = convertFromHTML(markUp);
    const state = ContentState.createFromBlockArray(
      contentHTML.contentBlocks,
      contentHTML.entityMap
    );
    const content = JSON.stringify(convertToRaw(state));
    return content;
  };

  const handleCommentChange = (editorState) => {
    let html = stateToHTML(editorState.getCurrentContent());
    if (html !== "<p><br></p>") {
      props.setComments(html);
    }
  };

  const handleDisable = (event) => {
    props.setComments(null, true);
    setChecked(event.target.checked);
  };

  if (loading) {
    return <CircularProgress className={classes.progress} size={20} />;
  }

  return (
    <Container className={classes.root} style={{ paddingBottom: 0 }}>
      <Box className={classes.MainWrapper}>
        <Box className={classes.SubWrapperOutline}>
          <Box className={classes.titleWrap}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                disabled={disabled}
                checked={checked}
                onChange={handleDisable}
                inputProps={{ "aria-label": "Checkbox A" }}
                style={{ padding: 0 }}
              />
              <Typography variant="h2" className={classes.tTitle}>
                {t("comments.interviewerComments")}
              </Typography>
            </Box>
          </Box>

          <Grid item xs={12} md={12} lg={12} style={{ position: "relative" }}>
            {!checked && <div className={classes.cover}></div>}
            <MuiThemeProvider theme={theme}>
              <MUIRichTextEditor
                readOnly={disabled}
                label={t("comments.enterComments")}
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
                value={comments}
                onChange={handleCommentChange}
              />
            </MuiThemeProvider>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default withStyles(styles)(Comments);
