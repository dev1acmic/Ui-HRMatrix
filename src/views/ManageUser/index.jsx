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
import { withTranslation } from "react-i18next";
import { PersonAddOutlined, PersonOutlined } from "@material-ui/icons";
import styles from "../JobPost/components/styles";
import { loadUsers } from "services/admin/action";
import { UserTable } from "./components";

class ManageUser extends Component {
  signal = true;
  state = {
    isLoading: false,
    error: null,
  };

  async loadUsers(id) {
    try {
      this.setState({ isLoading: true });
      const { users } = await this.props.loadUsers(id);

      if (this.signal) {
        this.setState({
          isLoading: false,
          users,
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
    this.props.loadUsers(this.props.orgId, rowsPerPage, page);
  };

  componentDidMount() {
    this.signal = true;
    this.loadUsers(this.props.orgId);
  }

  renderUsers() {
    const { classes, users } = this.props;
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

    if (!users) {
      return <Typography variant="h6"></Typography>;
    }

    return (
      <UserTable
        onSelect={this.handleSelect}
        onChange={this.handleChangePage}
        userList={users}
      />
    );
  }

  render() {
    const { classes, t } = this.props;

    return (
      <DashboardLayout title={t("dashboard")}>
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
                    {t("common:manageusers")}
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
                    to="/rc/manage-user/add-user"
                    component={Link}
                    color="secondary"
                  >
                    <PersonAddOutlined style={{ marginRight: 5 }} />
                    {t("common:addnewuser")}
                  </Button>
                </Box>
              </Box>
              <div style={{ width: "100%" }}>{this.renderUsers()}</div>
            </Grid>
          </div>
        </Container>
      </DashboardLayout>
    );
  }
}
const mapDispatchToProps = {
  loadUsers,
};

const mapStateToProps = (state) => ({
  users: (state.admin && state.admin.users) || null,
  orgId: state.profile.orgId,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(ManageUser)))
);
