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
import { loadRecruiters } from "services/admin/action";
import { RecruiterTable } from "./components";

class ManageRecruiter extends Component {
  signal = true;
  state = {
    isLoading: false,
    error: null,
  };

  async loadRecruiters(id) {
    try {
      this.setState({ isLoading: true });
      const { recruiters } = await this.props.loadRecruiters(id);

      if (this.signal) {
        this.setState({
          isLoading: false,
          recruiters,
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
    this.props.loadRecruiters(this.props.orgId, rowsPerPage, page);
  };

  componentDidMount() {
    this.signal = true;
    this.loadRecruiters(this.props.orgId);
  }

  renderRecruiters() {
    const { classes, recruiters } = this.props;
    const { isLoading, error } = this.state;

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

    if (!recruiters) {
      return <Typography variant="h6"></Typography>;
    }

    return (
      <RecruiterTable
        onSelect={this.handleSelect}
        onChange={this.handleChangePage}
        recruiterList={recruiters}
      />
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Dashboard">
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
                    Manage Recruiters
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
                  <Button
                    autoCapitalize="false"
                    variant="contained"
                    size="small"
                    to="/rc/manage-recruiter/add-recruiter"
                    component={Link}
                    color="secondary"
                  >
                    <PersonAddOutlined style={{ marginRight: 5 }} />
                    Add New Recruiter
                  </Button>
                </Box>
              </Box>
              <div style={{ width: "100%" }}>{this.renderRecruiters()}</div>
            </Grid>
          </div>
        </Container>
      </DashboardLayout>
    );
  }
}
const mapDispatchToProps = {
  loadRecruiters,
};

const mapStateToProps = (state) => ({
  recruiters: (state.admin && state.admin.recruiters) || null,
  orgId: state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ManageRecruiter))
);
