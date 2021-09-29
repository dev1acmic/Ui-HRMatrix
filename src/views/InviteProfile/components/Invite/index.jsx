import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  withStyles,
  Checkbox,
  createMuiTheme,
  MuiThemeProvider,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  loadRecruiters,
  inviteRecruiter,
  loadRecentlyContactedRecruiters,
  loadRecentlyContactedPremiumRecruiters,
} from "services/employer/action";
import { loadPremiumOrganizations } from "services/organization/action";
import { getFullAddress, getFullName } from "util/helper";
import { Email, ContactPhone } from "@material-ui/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import MUIRichTextEditor from "mui-rte";
import { stateToHTML } from "draft-js-export-html";
import MessageBox from "util/messageBox";
import moment from "moment";
import styles from "../style";
import SearchBar from "../SearchBar";

const theme = createMuiTheme({
  overrides: {
    MUIRichTextEditor: {
      root: {
        marginTop: 8,
        width: "100%",
        border: "0",
        borderRadius: 3,
        minHeight: 290,
      },
      editor: {
        padding: "0 20px 10px 15px",
      },
      placeHolder: {
        padding: "4px 15px",
        color: "#BCC5D8",
      },
      editorContainer: {
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

const Invite = (props) => {
  const { classes } = props;
  const { t } = useTranslation(["common", "managePremiumAgency"]);
  const [state, setState] = React.useState({});
  const [recruiters, setRecruiters] = React.useState([]);
  const [recentRecruiters, setRecentRecruiters] = React.useState([]);
  const [recentPremiumRecruiters, setRecentPremiumRecruiters] = React.useState(
    []
  );
  //const [selected, setSelected] = React.useState([]);
  const [msg, setMsg] = React.useState();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState(null);
  const [alert, setAlert] = React.useState(false);
  const [selectedrecruiters, setSelectedecruiters] = React.useState(null);
  const [premiumOrganizations, setPremiumOrganizations] = React.useState(null);

  const [handleSendToPremium, setHandleSendToPremium] = React.useState({
    sendToPremium: false,
    checked: false,
  });

  const [handleSendToRecentPremium, setHandleSendToRecentPremium] =
    React.useState({
      sendToRecentPremium: false,
      checked: false,
    });

  useEffect(() => {
    props.loadPremiumOrganizations().then((res) => {
      if (res) {
        setPremiumOrganizations(res);
      }
    });
  }, []);

  useEffect(() => {
    if (props.orgId) {
      props.loadRecruiters(props.orgId);

      if (props.match.params && props.match.params.jobPostId) {
        const jobPostId = props.match.params.jobPostId;
        props.loadRecentlyContactedRecruiters(props.orgId, jobPostId);
        props.loadRecentlyContactedPremiumRecruiters(jobPostId);
        setState({ ...state, jobPostId: jobPostId });
      }
    }
  }, [props.orgId]);

  useEffect(() => {
    if (props.recruiters && props.recruiters.length > 0) {
      let item = unique(props.recruiters, "recOrgId");

      let data = item.map((t) => ({
        ...t,
        checked: false,
      }));
      setRecruiters(data);
    }
  }, [props.recruiters]);

  function unique(array, propertyName) {
    return array.filter(
      (e, i) =>
        array.findIndex((a) => a[propertyName] === e[propertyName]) === i
    );
  }

  useEffect(() => {
    if (
      props.recentRecruiters &&
      props.recentRecruiters.data &&
      props.recentRecruiters.data.length > 0
    ) {
      let data = props.recentRecruiters.data.map((t) => ({
        ...t,
        checked: false,
      }));
      setRecentRecruiters(data);
    }
  }, [props.recentRecruiters]);

  useEffect(() => {
    if (
      props.recentPremiumRecruiters &&
      props.recentPremiumRecruiters.data &&
      props.recentPremiumRecruiters.data.length > 0
    ) {
      let data = props.recentPremiumRecruiters.data.map((t) => ({
        ...t,
        checked: false,
      }));
      setRecentPremiumRecruiters(data);
    }
  }, [props.recentPremiumRecruiters]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const results = recruiters.filter(
      (c) =>
        c.organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.user &&
          c.user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setSearchResults(results);
  }, [searchTerm]);

  const handleSelectAll = (event) => {
    let selectAllRecruiters = recruiters.map((t) => ({
      ...t,
      checked: event.target.checked,
    }));
    setRecruiters(selectAllRecruiters);
    setSearchResults(selectAllRecruiters);
    setHandleSendToPremium({
      sendToPremium: event.target.checked,
      checked: event.target.checked,
    });
    // if (event.target.checked) {
    //   let arr = recruiters.map((t) => t.contactUserId);
    //   setSelected(arr);
    // } else {
    //   setSelected([]);
    // }
    //setState({ ...state, selectAll: event.target.checked });
  };

  const handlePremiumRecruiters = (event) => {
    let value = event.target.checked;
    setHandleSendToPremium({ sendToPremium: value, checked: value });
  };

  const handleRecentPremiumRecruiters = (event) => {
    let value = event.target.checked;
    setHandleSendToRecentPremium({
      sendToRecentPremium: value,
      checked: value,
    });
  };

  const handleChange = (event, idx) => {
    let value = event.target.checked;
    let selectedRecruiters = [...recruiters];
    selectedRecruiters[idx].checked = value;
    setRecruiters(selectedRecruiters);
    setSearchResults(selectedRecruiters);
  };

  const handleRecentChange = () => (event) => {
    let value = parseInt(event.target.value);
    // let arr = [...selected];
    // const index = arr.findIndex((c) => c === value);
    // if (index === -1) {
    //   arr = [...selected, value];
    // } else {
    //   arr = arr.filter((e) => e !== value);
    // }
    let selectedRecruiters = [...recentRecruiters];
    selectedRecruiters = selectedRecruiters.map((t) => ({
      ...t,
      checked:
        t.recruiterId === parseInt(value) ? event.target.checked : t.checked,
    }));
    //setRecruiters(selectedRecruiters);
    setRecentRecruiters(selectedRecruiters);
    //setSelected(arr);
  };

  const handleClose = () => {
    setAlert(false);
  };

  const handleMsgChange = (editorState) => {
    let html = stateToHTML(editorState.getCurrentContent());
    if (html !== "<p><br></p>") {
      setMsg(html);
    }
  };

  const handleInviteProfile = async () => {
    let selectedRecruiters =
      recruiters &&
      recruiters
        .filter((c) => c.checked === true)
        .map((c) => ({
          recruiterId: c.contactUserId,
          recOrgId: c.organization.id,
        }));

    let selectedRecentRecruiters =
      recentRecruiters &&
      recentRecruiters
        .filter((c) => c.checked === true)
        .map((c) => ({
          recruiterId: c.recruiterId,
          recOrgId: c.orgId,
        }));
    let sendToRecruiters = [...selectedRecruiters, ...selectedRecentRecruiters];
    console.log(sendToRecruiters);
    setSelectedecruiters(sendToRecruiters);
    // if (status) {
    const data = {
      recruiters: sendToRecruiters,
      msg: msg,
      jobpostId: state.jobPostId,
      sendToPremium:
        handleSendToPremium.sendToPremium ||
        handleSendToRecentPremium.sendToRecentPremium,
    };
    if (data.recruiters && data.recruiters.length > 0) {
      const res = props.inviteRecruiter(data);
      if (res) {
        setState({
          ...state,
          showSuccess: true,
          isError: false,
          successMsg: t("common:succMsg.sendtoRecruiters"),
        });
        setTimeout(
          () =>
            props.history.push({
              pathname: "/rc/dashboard",
            }),
          2000
        );
      }
    } else {
      setState({
        ...state,
        showError: true,
        errMsg: t("selectAtLeastOneRecruiter"),
      });
    }
    // } else {
    //   setState({
    //     ...state,
    //     showError: true,
    //     errMsg: "Please select at least one recruiter",
    //   });
    // }

    // setAlert(false);
  };

  function alertPremium() {
    let selectedRecruiters =
      recruiters &&
      recruiters
        .filter((c) => c.checked === true)
        .map((c) => ({
          recruiterId: c.contactUserId,
          recOrgId: c.organization.id,
        }));

    let selectedRecentRecruiters =
      recentRecruiters &&
      recentRecruiters
        .filter((c) => c.checked === true)
        .map((c) => ({
          recruiterId: c.recruiterId,
          recOrgId: c.orgId,
        }));
    let sendToRecruiters = [...selectedRecruiters, ...selectedRecentRecruiters];
    console.log(sendToRecruiters);
    setSelectedecruiters(sendToRecruiters);
    if (sendToRecruiters && sendToRecruiters.length > 0) {
      // setAlert(true);
      return true;
    } else {
      // setAlert(false);
      // setState({
      //   ...state,
      //   showError: true,
      //   errMsg: "Please select at least one recruiter",
      // });
      return false;
    }
  }

  function handleMsgClose() {
    setState({ ...state, showSuccess: false });
  }
  const results =
    searchTerm && searchTerm.length > 0 ? searchResults : recruiters;
  return (
    <Container className={classes.root} style={{ padding: 0 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={3}>
          <Box className={classes.reviewItemWrap}>
            <Typography variant="h3" className={classes.reviewTitle}>
              {t("alreadyContacted")}
            </Typography>
            <PerfectScrollbar style={{ width: "100%", height: "300px" }}>
              <Table>
                <TableBody>
                  {recentPremiumRecruiters &&
                    recentPremiumRecruiters.length > 0 && (
                      <TableRow>
                        {/* <TableCell
                          align="center"
                          style={{
                            whiteSpace: "nowrap",
                            width: 35,
                            padding: 0,
                          }}
                        >
                          <Checkbox
                            value={handleSendToRecentPremium.checked}
                            checked={handleSendToRecentPremium.checked}
                            inputProps={{ "aria-label": "Checkbox B" }}
                            style={{ padding: 0 }}
                            onChange={handleRecentPremiumRecruiters}
                          />
                        </TableCell> */}
                        <TableCell className={classes.firstCol}>
                          <Typography
                            component="h4"
                            variant="inherit"
                            color="inherit"
                            style={{ fontWeight: 900 }}
                            m={0}
                            className={classes.listTitle}
                          >
                            {t("hiringTargetPremiumNetwork")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  {recentRecruiters && recentRecruiters.length > 0 ? (
                    recentRecruiters.map((recruiter, idx) => (
                      <TableRow>
                        {/* <TableCell
                          align="center"
                          style={{
                            whiteSpace: "nowrap",
                            width: 35,
                            padding: 0,
                          }}
                        >
                          <Checkbox
                            value={recruiter.recruiterId}
                            checked={recruiter.checked}
                            style={{ padding: 0 }}
                            onChange={handleRecentChange(idx)}
                          />
                        </TableCell> */}
                        <TableCell className={classes.firstCol}>
                          <Typography
                            component="h4"
                            variant="inherit"
                            color="inherit"
                            m={0}
                            className={classes.listTitle}
                          >
                            {recruiter.orgName}
                          </Typography>
                          <Typography
                            style={{ fontSize: "12px", color: "#555" }}
                          >
                            {t("lastContactedOn")}{" "}
                            {recruiter.updatedAt
                              ? moment(recruiter.updatedAt).format(
                                  "Do MMM YYYY"
                                )
                              : ""}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className={classes.tableRow}>
                      <TableCell
                        colSpan={10}
                        style={{ textAlign: "center" }}
                        className={classes.tableCell}
                      >
                        {t("noRecentAgencies")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box className={classes.reviewItemWrap}>
            <Grid container spacing={0}>
              <Grid container xs={6} md={6}>
                {/* <Typography variant="h3" className={classes.reviewTitle}>
                  Location(CA)
                </Typography> */}
              </Grid>

              <Grid
                container
                xs={6}
                md={6}
                style={{ flexDirection: "column", alignItems: "flex-end" }}
              >
                <Typography variant="h3">
                  <SearchBar
                    searchTerm={searchTerm}
                    handleSearchChange={handleSearchChange}
                  />
                </Typography>
              </Grid>
            </Grid>

            <PerfectScrollbar style={{ width: "100%", height: "328px" }}>
              <Grid>
                <Typography
                  component="h4"
                  variant="inherit"
                  color="inherit"
                  m={0}
                  style={{
                    color: "#000",
                    borderBottom: "0",
                    fontFamily: "Roboto",
                    fontSize: "12px",
                    marginTop: "10px",
                  }}
                >
                  <Checkbox
                    value="selectAll"
                    inputProps={{ "aria-label": "Checkbox A" }}
                    style={{ padding: 0 }}
                    onChange={handleSelectAll}
                  />
                  {t("selectAll")}
                </Typography>
              </Grid>
              <Table className={classes.table} size="small">
                <TableBody>
                  {premiumOrganizations && premiumOrganizations.length > 0 && (
                    <TableRow>
                      <TableCell
                        align="center"
                        style={{
                          whiteSpace: "nowrap",
                          width: 35,
                          padding: 0,
                        }}
                      >
                        <Checkbox
                          value={handleSendToPremium.checked}
                          checked={handleSendToPremium.checked}
                          inputProps={{ "aria-label": "Checkbox B" }}
                          style={{ padding: 0 }}
                          onChange={handlePremiumRecruiters}
                        />
                      </TableCell>
                      <TableCell className={classes.firstCol}>
                        <Typography
                          component="h4"
                          variant="inherit"
                          color="inherit"
                          style={{ fontWeight: 900 }}
                          m={0}
                          className={classes.listTitle}
                        >
                          {t("hiringTargetPremiumNetwork")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {results && results.length > 0 ? (
                    results.map((recruiter, idx) => (
                      <TableRow>
                        <TableCell
                          align="center"
                          style={{
                            whiteSpace: "nowrap",
                            width: 35,
                            padding: 0,
                          }}
                        >
                          <Checkbox
                            value={recruiter.checked}
                            checked={recruiter.checked}
                            //inputProps={{ "aria-label": "chk" + idx }}
                            style={{ padding: 0 }}
                            onChange={(e) => handleChange(e, idx)}
                          />
                        </TableCell>
                        <TableCell className={classes.firstCol}>
                          <Typography
                            component="h4"
                            variant="inherit"
                            color="inherit"
                            m={0}
                            className={classes.listTitle}
                          >
                            {recruiter.organization &&
                              recruiter.organization.name}
                          </Typography>
                          {recruiter &&
                            recruiter.organization.addresses &&
                            recruiter.organization.addresses[0] && (
                              <Typography
                                variant="subtitle1"
                                align="left"
                                className={classes.tinyText}
                                component="p"
                              >
                                {getFullAddress(
                                  recruiter.organization.addresses[0]
                                )}
                              </Typography>
                            )}

                          <Typography
                            variant="subtitle1"
                            align="left"
                            component="p"
                            className={classes.mnp}
                          >
                            <span className={classes.cntWrap}>
                              <Email
                                color="secondary"
                                className={classes.titleIcon}
                              />
                              {recruiter.user && recruiter.user.username}
                            </span>
                            {recruiter.organization &&
                              recruiter.organization.contactNo1 && (
                                <span className={classes.cntWrap}>
                                  <ContactPhone
                                    color="secondary"
                                    className={classes.titleIcon}
                                  />{" "}
                                  {recruiter.organization.contactNo1}
                                </span>
                              )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className={classes.tableRow}>
                      <TableCell
                        colSpan={10}
                        style={{ textAlign: "center" }}
                        className={classes.tableCell}
                      >
                        {t("managePremiumAgency:noAgency")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box style={{ width: "100%" }} className={classes.reviewItemWrap}>
            <Typography variant="h3" className={classes.reviewTitle}>
              {t("messages")}
            </Typography>
            <PerfectScrollbar style={{ width: "100%", height: "300px" }}>
              <MuiThemeProvider theme={theme}>
                <MUIRichTextEditor
                  label={t("enterMsg")}
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
                  onChange={handleMsgChange}
                  height="200"
                />
              </MuiThemeProvider>
            </PerfectScrollbar>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid item xs={12} md={12} className={classes.btnWrap}>
          <div className={classes.buttonBar}>
            <Box style={{ width: "100%" }}>
              <Link to="/rc/dashboard" className={classes.ctaButton}>
                <Button variant="contained">{t("cancel")}</Button>
              </Link>

              <Button
                variant="contained"
                color="secondary"
                className={classes.ctaButton}
                onClick={handleInviteProfile}
              >
                {t("send")}
              </Button>
            </Box>
          </div>
        </Grid>
      </Grid>
      <MessageBox
        open={state.showSuccess}
        variant={"success"}
        onClose={handleMsgClose}
        message={state.successMsg}
      />

      {/* <Dialog
        open={alert}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{" SEND"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item xs={12} style={{ textAlign: "left" }}>
              <Typography variant="h8">
                Would you like to send this job to Hiring target premium
                recruiters?
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleInviteProfile(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleInviteProfile(true)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}

      <Dialog
        open={state.showError}
        onClose={() => {
          setState({ ...state, showError: false });
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
            {state.errMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setState({ ...state, showError: false });
            }}
            color="primary"
            autoFocus
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const mapDispatchToProps = {
  loadRecruiters,
  inviteRecruiter,
  loadRecentlyContactedRecruiters,
  loadRecentlyContactedPremiumRecruiters,
  loadPremiumOrganizations,
};

const mapStateToProps = (state) => ({
  orgId: state.profile && state.profile.orgId,
  recruiters: (state.employer && state.employer.recruiters) || null,
  recentRecruiters: (state.employer && state.employer.recentRecruiters) || null,
  recentPremiumRecruiters:
    (state.employer && state.employer.recentPremiumRecruiters) || null,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Invite))
);
