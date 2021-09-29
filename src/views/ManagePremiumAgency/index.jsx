import React, { Component, Suspense } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  withStyles,
  Grid,
  CircularProgress,
  Modal,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Dashboard as DashboardLayout } from "layouts";
import { PersonAddOutlined, PersonOutlined } from "@material-ui/icons";

import styles from "../JobPost/components/styles";
import { loadPremiumAgencies } from "services/admin/action";
import { AgencyTable } from "./components";
import { AddPremiumAgency } from "../Modals";
import { withTranslation } from "react-i18next";

class ManagePremiumAgency extends Component {
  signal = true;
  state = {
    isLoading: false,
    error: null,
    showModal: false,
    page: 0,
    rowsPerPage: 10,
    premiumRecruiters: [],
  };

  async loadPremiumAgencies(rowsPerPage = 10, page = 0) {
    try {
      this.setState({ isLoading: true });
      const { premiumRecruiters } = await this.props.loadPremiumAgencies(
        rowsPerPage,
        page
      );
      if (this.signal) {
        this.setState({
          isLoading: false,
          premiumRecruiters,
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
    this.loadPremiumAgencies(rowsPerPage, page);
    this.setState({ ...this.state, page: page });
  };

  componentDidMount() {
    this.signal = true;
    this.loadPremiumAgencies();
  }

  handleOpen() {
    this.setState({ ...this.state, showModal: true });
  }

  handleClose() {
    this.setState({ ...this.state, showModal: false });
  }

  renderRecruiters() {
    const { classes, premiumRecruiters } = this.props;
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

    if (!premiumRecruiters) {
      return <Typography variant="h6"></Typography>;
    }
    return (
      <AgencyTable
        onSelect={this.handleSelect}
        onChange={this.handleChangePage}
        premiumAgencyList={premiumRecruiters}
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
                    {t("manageAgency")}
                  </Typography>
                </Box>
                <Box
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    margin: "20px 20px 10px 0",
                  }}
                >
                  {/* <Button
                    autoCapitalize="false"
                    variant="contained"
                    size="small"
                    onClick={() => {
                      this.handleOpen();
                    }}
                    //to="/rc/manage-agency/add-agency"
                    //component={Link}
                    color="secondary"
                  >
                    <PersonAddOutlined style={{ marginRight: 5 }} />
                    Add New Agency
                  </Button> */}
                </Box>
              </Box>
              <div style={{ width: "100%" }}>{this.renderRecruiters()}</div>
            </Grid>
          </div>
          <Modal
            aria-labelledby={t("common:addScreeningQ")}
            aria-describedby={t("common:addScreeningQ")}
            open={this.state.showModal}
            onClose={() => this.handleClose()}
          >
            <AddPremiumAgency
              // item={values.panelItem}
              // organizationId={values.orgId}
              onCancel={() => this.handleClose()}
            />
          </Modal>
        </Container>
      </DashboardLayout>
    );
  }
}
const mapDispatchToProps = {
  loadPremiumAgencies,
};

const mapStateToProps = (state) => ({
  premiumRecruiters: (state.admin && state.admin.premiumRecruiters) || null,
  orgId: state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withStyles(styles)(
      withTranslation(["managePremiumAgency", "common"])(ManagePremiumAgency)
    )
  )
);
