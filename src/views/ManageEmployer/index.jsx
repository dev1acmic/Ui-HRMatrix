import React, { Component } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  withStyles,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Dashboard as DashboardLayout } from "layouts";
import { PersonAddOutlined, PersonOutlined } from "@material-ui/icons";
import styles from "../JobPost/components/styles";
import { withTranslation } from "react-i18next";

import { loadEmployers } from "services/employer/action";
import { AgencyTable } from "./components";
import i18next from "i18next";

class ManageEmployer extends Component {
  signal = true;
  state = {
    isLoading: false,
    error: null,
    showModal: false,
    page: 0,
    rowsPerPage: 10,
    employers: [],
  };

  async loadEmployers(rowsPerPage = 10, page = 0) {
    try {
      this.setState({ isLoading: true });
      const { employers } = await this.props.loadEmployers(rowsPerPage, page);
      if (this.signal) {
        this.setState({
          isLoading: false,
          employers,
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error,
        });
      }
    }
  }

  handleChangePage = (rowsPerPage, page) => {
    this.signal = true;
    this.loadEmployers(rowsPerPage, page);
    this.setState({ ...this.state, page: page });
  };

  componentDidMount() {
    this.signal = true;
    this.loadEmployers();
  }

  handleOpen() {
    this.setState({ ...this.state, showModal: true });
  }

  handleClose() {
    this.setState({ ...this.state, showModal: false });
  }

  renderEmployers() {
    const { classes, t, employers } = this.props;
    const { isLoading, error, page, rowsPerPage } = this.state;
    if (isLoading) {
      return (
        <div
          className={classes.progressWrapper}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginBottom: 30,
          }}
        >
          <CircularProgress style={{ height: 30, width: 30 }} />
        </div>
      );
    }

    if (error) {
      return <Typography variant="h6">{error}</Typography>;
    }

    if (!employers) {
      return <Typography variant="h6"></Typography>;
    }
    return (
      <AgencyTable
        onSelect={this.handleSelect}
        onChange={this.handleChangePage}
        employerList={employers}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    );
  }

  render() {
    const { classes, t } = this.props;

    return (
      <DashboardLayout title={t("common:dashboard")}>
        <Container className={classes.root}>
          <div className={classes.root}>
            <Grid
              container
              spacing={3}
              xs={12}
              style={{ margin: "0" }}
              className={classes.reviewItemWrap}
            >
              <Box display="flex" width="100%">
                <Box flexGrow={1}>
                  <Typography
                    variant="h3"
                    className={classes.reviewTitle}
                    style={{ padding: "20px 0px 0 22px" }}
                  >
                    <PersonOutlined
                      color="secondary"
                      className={classes.titleIcon}
                    />
                    {t("manageEmployer")}
                  </Typography>
                </Box>
                <Box
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    margin: "20px 20px 10px 0",
                  }}
                ></Box>
              </Box>
              <div style={{ width: "100%" }}>{this.renderEmployers()}</div>
            </Grid>
          </div>
        </Container>
      </DashboardLayout>
    );
  }
}
const mapDispatchToProps = {
  loadEmployers,
};

const mapStateToProps = (state) => ({
  employers: (state.employer && state.employer.employers) || null,
  orgId: state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withStyles(styles)(
      withTranslation(["manageEmployer", "common"])(ManageEmployer)
    )
  )
);
