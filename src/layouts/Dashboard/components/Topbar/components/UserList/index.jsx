import React, { Component, Fragment } from "react";

// Externals
import PropTypes from "prop-types";
import classNames from "classnames";

// Material components
import {
  Button,
  Avatar,
  Divider,
  Typography,
  withStyles,
} from "@material-ui/core";
import { logout } from "services/user/action";
import { Role } from "util/enum";

// Component styles
import styles from "./styles";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import avatarimg from "../../../../../../assets/images/user.png";
import { withTranslation } from "react-i18next";
class SignOut extends Component {
  state = {
    username: "",
  };

  handleSignOut = () => {
    this.props.logout();
    const { history } = this.props;
    history.push("/sign-in");
  };

  render() {
    const { className, t, classes, profile } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <Fragment>
          <div className={classes.header}>
            <Avatar
              classes={{
                root: classes.avatarImage,
              }}
              alt="Remy Sharp"
              src={avatarimg}
              className={classes.avatar}
            />

            <Typography variant="h6">
              {profile.fname + " " + profile.lname}
            </Typography>
            <Typography className={classes.subtitle} variant="body2">
              {profile.roles &&
              profile.roles.length > 0 &&
              profile.roles[0].id > 0
                ? t(`${Role.getNameByValue(profile.roles[0].id)}`)
                : " "}
            </Typography>
          </div>
          <Divider className={classes.avatarDivider} />
          <div className={classes.content}>
            <div className={classes.footer}>
              <Button
                color="primary"
                component={Link}
                size="small"
                to="/rc/change-password"
                variant="contained"
              >
                {t("common:profile")}
              </Button>
              <Button
                color="secondary"
                //component={Link}
                size="small"
                //to="#"
                variant="contained"
                onClick={this.handleSignOut}
              >
                {t("common:logout")}
              </Button>
            </div>
          </div>
        </Fragment>
      </div>
    );
  }
}

SignOut.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  //notifications: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
};

SignOut.defaultProps = {
  //notifications: [],
  onSelect: () => {},
};

const mapDispatchToProps = {
  logout: logout,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation(["common", "enum"])(SignOut)))
);
