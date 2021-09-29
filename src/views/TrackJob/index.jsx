import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";

// Material components
import {
  Container,
  Typography,
  Button,
  Box,
  withStyles,
  Grid,
  CircularProgress
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  PersonAddOutlined,
  PersonOutlined} from "@material-ui/icons";
// Shared layouts
import { Dashboard as DashboardLayout } from "layouts";

// Custom components
import { JobTable } from "./components";

import { getJobsbyEmployer } from "services/jobPost/action";

// Component styles
import styles from "../JobPost/components/styles";
import { connect } from "react-redux";

class TrackJob extends Component {
  signal = true;

  state = {
    isLoading: false,
    // limit: 10,
    // jobList: [],
    // selectedUsers: [],
    error: null
  };

  async getJobsbyEmployer(id) {
    try {
      this.setState({ isLoading: true });
      const { jobList } = await this.props.getJobsbyEmployer(id);

      if (this.signal) {
        this.setState({
          isLoading: false,
          jobList
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error
        });
      }
    }
  }

  componentDidMount() {
    this.signal = true;
    this.getJobsbyEmployer(this.props.profile.id);
  }

  componentWillUnmount() {
    this.signal = false;
  }

  handleSelect = selectedUsers => {
    this.setState({ selectedUsers });
  };

  handleChangePage = (rowsPerPage, page) => {
    this.signal = true;
    this.props.getJobsbyEmployer(this.props.profile.id, rowsPerPage, page);
  };

  renderJobs() {
    const { classes, jobList } = this.props;
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
            marginBottom: 30
          }}
        >
          <CircularProgress style={{ height: 30, width: 30 }} />
        </div>
      );
    }

    if (error) {
      return <Typography variant="h6">{error}</Typography>;
    }

    if (!jobList) {
      return <Typography variant="h6"></Typography>;
    }

    return (
      <JobTable
        onSelect={this.handleSelect}
        onChange={this.handleChangePage}
        jobList={jobList}
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
                    Track Job
                  </Typography>
                </Box>
                <Box
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    margin: "20px 20px 10px 0"
                  }}
                >
                  <Button
                    autoCapitalize="false"
                    variant="contained"
                    size="small"
                    to="/rc/job-post"
                    component={Link}
                    color="secondary"
                  >
                    <PersonAddOutlined style={{ marginRight: 5 }} />
                    Add New Job
                  </Button>
                </Box>
              </Box>
              <div style={{ width: "100%" }}>{this.renderJobs()}</div>
            </Grid>
          </div>
        </Container>
      </DashboardLayout>
    );
  }
}

TrackJob.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = {
  getJobsbyEmployer: getJobsbyEmployer
};

const mapStateToProps = state => ({
  jobList: (state.jobPost && state.jobPost.jobList) || null,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TrackJob));
