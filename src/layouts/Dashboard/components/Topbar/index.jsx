import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

// Externals
import classNames from "classnames";
import PropTypes from "prop-types";

// Material components
import {
  IconButton,
  Popover,
  Toolbar,
  Typography,
  Avatar,
  Badge,
  withStyles,
  Snackbar,
  Slide,
} from "@material-ui/core";

// Material icons
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  NotificationsOutlined as NotificationsIcon,
  KeyboardArrowDown as ArrowDownIcon,
  InfoOutlined,
  Clear,
} from "@material-ui/icons";
import * as roleUtil from "util/roleUtil";

import avatarimg from "../../../../assets/images/user.png";
// Custom components
import { NotificationList, SearchBar, UserList } from "./components";

// Component styles
import styles from "./styles";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import { connect } from "react-redux";
// Actions
import { removeError } from "services/error/action";
import { logout } from "services/user/action";
import {
  getNotifications,
  setNotificationToRead,
  setAllNotificationToRead,
  clearNewNotification,
} from "services/notifications/action";
import { getJobApplicationsById } from "services/jobApplication/action";
import { Roles } from "util/enum";

class Topbar extends Component {
  signal = true;

  state = {
    notificationsEl: null,
    isNotificationLoading: false,
    pageNo: 1,
    isRoleRecruiter: false,
    isRoleAgencyAdmin: false,
  };

  componentDidMount() {
    this.signal = true;
  }

  componentDidMount = () => {
    this.setState(() => ({
      isRoleRecruiter: roleUtil.isRoleRecruiter(this.props.profile.roles),
      isRoleAgencyAdmin: roleUtil.isRoleAgencyAdmin(this.props.profile.roles),
    }));
  };

  componentWillUnmount() {
    this.signal = false;
  }

  handleMoreNotification = () => {
    const { id } = this.props.profile;
    const pageNo = this.state.pageNo + 1;
    this.props.getNotifications(id, pageNo).then(() => {
      this.setState({
        //isNotificationLoading: false,
        pageNo: pageNo,
      });
    });
  };

  toJobPost = async (id, category) => {
    if (category === "JP") {
      if (
        this.props.profile.roles[0].id === this.state.isRoleAgencyAdmin ||
        this.state.isRoleRecruiter
      ) {
        this.props.history.push({
          pathname: "/rc/job-review/" + id,
          state: { id: id },
        });
      } else {
        this.props.history.push({
          pathname: "/rc/job-post",
          state: { id: id, empReview: true },
        });
      }
    } else if (category === "JA") {
      this.props.history.push({
        pathname: "/rc/job-application-review",
        state: { jobAppId: id },
      });
    } else {
      const res = await this.props.getJobApplicationsById(id, true);
      this.props.history.push({
        pathname: "/rc/recap/" + res.jobpostId,
        state: { jobApplId: id },
      });
    }
  };

  handleShowNotifications = async (event) => {
    this.setState({
      notificationsEl: event.currentTarget,
      isNotificationLoading: true,
    });
    const { id } = this.props.profile;
    const pageNo = 1;
    this.props.getNotifications(id, pageNo).then(() => {
      this.setState({
        isNotificationLoading: false,
        pageNo: pageNo,
      });
    });
  };

  handleCloseNotifications = () => {
    this.setState({
      notificationsEl: null,
      notifications: [],
    });
  };

  handleShowUserList = (event) => {
    this.setState({
      userListEl: event.currentTarget,
    });
  };

  handleCloseUserList = () => {
    this.setState({
      userListEl: null,
    });
  };

  handleCloseMsg = () => {
    this.props.removeError();
  };

  showMsgBox = () => {
    return this.props.error.message && this.props.error.message !== "";
  };

  dissMissNotificationPopup = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.clearNewNotification().then((res) => {});
  };

  showNotificationPopup = (classes, notifications, t) => {
    function SlideTransition(props) {
      return <Slide {...props} direction="down" />;
    }

    return notifications && notifications.newMessage ? (
      <Snackbar
        style={{ paddingTop: 30 }}
        TransitionComponent={SlideTransition}
        ContentProps={{
          classes: {
            root: classes.snackRootInfo,
            message: classes.snackMsg,
            action: classes.snackAction,
          },
        }}
        autoHideDuration={9000}
        open={true}
        onClose={this.dissMissNotificationPopup}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        action={[
          <IconButton
            onClick={this.dissMissNotificationPopup}
            color="inherit"
            key="undo"
            style={{ opacity: 0.5 }}
          >
            <Clear />
          </IconButton>,
        ]}
        message={
          <span>
            <InfoOutlined />
            {t("newNotiArrived")}
          </span>
        }
      />
    ) : null;
  };

  render() {
    const {
      classes,
      className,
      isSidebarOpen,
      onToggleSidebar,
      notifications,
      t,
    } = this.props;
    const { notifyCount } = this.props.profile;

    const { notificationsEl, userListEl, isNotificationLoading } = this.state;

    const rootClassName = classNames(classes.root, className);
    const showNotifications = Boolean(notificationsEl);
    const showUserList = Boolean(userListEl);

    return (
      <Fragment>
        <div className={rootClassName}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              className={classes.menuButton}
              onClick={onToggleSidebar}
              variant="text"
            >
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography className={classes.title} variant="h4">
              {/* {title} */}
            </Typography>

            <SearchBar />
            {/* <IconButton className={classes.dashButton}>
              <DashIcon />
            </IconButton> */}
            <IconButton
              className={classes.notificationsButton}
              onClick={this.handleShowNotifications}
            >
              <Badge
                badgeContent={notifyCount}
                color="error"
                variant="standard"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              disableRipple={true}
              className={classes.avatarButton}
              onClick={this.handleShowUserList}
            >
              <Avatar
                classes={{
                  root: classes.avatarImage,
                }}
                alt="Remy Sharp"
                src={avatarimg}
                className={classes.avatar}
              />
              <ArrowDownIcon />
            </IconButton>
          </Toolbar>
        </div>
        <Popover
          anchorEl={notificationsEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          onClose={this.handleCloseNotifications}
          open={showNotifications}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <NotificationList
            notifications={notifications}
            onSelect={this.props.setNotificationToRead}
            onUnReadAll={this.props.setAllNotificationToRead}
            userId={this.props.profile.id}
            onClose={this.handleCloseNotifications}
            onMore={this.handleMoreNotification}
            isNotificationLoading={isNotificationLoading}
            toJobPost={this.toJobPost}
          />
        </Popover>
        <Popover
          anchorEl={userListEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          onClose={this.handleCloseUserList}
          open={showUserList}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <UserList
            //notifications={notifications}
            onSelect={this.handleCloseUserList}
          />
        </Popover>

        {this.showNotificationPopup(classes, notifications, t)}
      </Fragment>
    );
  }
}

Topbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isSidebarOpen: PropTypes.bool,
  onToggleSidebar: PropTypes.func,
  title: PropTypes.string,
};

Topbar.defaultProps = {
  onToggleSidebar: () => {},
};

const mapDispatchToProps = {
  removeError,
  logout,
  getNotifications,
  setNotificationToRead,
  setAllNotificationToRead,
  clearNewNotification,
  getJobApplicationsById,
};

const mapStateToProps = (state) => ({
  error: state.error,
  profile: state.profile,
  notifications: state.notifications,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("topbar")(Topbar)))
);
