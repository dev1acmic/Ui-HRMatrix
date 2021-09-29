import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";

// Externals
import classNames from "classnames";
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";
import { withTranslation } from "react-i18next";

// Material components
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Collapse,
} from "@material-ui/core";

// Material icons
import {
  DashboardOutlined as DashboardIcon,
  SupervisedUserCircleOutlined as LockOpenIcon,
  FindInPageOutlined as ImageIcon,
  InfoOutlined as InfoIcon,
  FileCopyOutlined as AccountBoxIcon,
  AccountCircleOutlined as SettingsIcon,
  AddBoxOutlined as AddIcon,
  FiberManualRecordOutlined as BulletIcon,
  AssessmentOutlined as AssessmentIcon,
  SettingsOutlined as Settings,
  BusinessOutlined as BusinessIcon,
  AccountBalanceOutlined as AccountBalanceIcon
} from "@material-ui/icons";

// Component styles
import styles from "./styles";
import logo from "../../../../assets/images/logo-white.png";

import * as roleUtil from "util/roleUtil";
import { loadOrganization } from "services/organization/action";
class Sidebar extends Component {
  state = {
    open1: false,
    open2: false,
    open4: false,
    isRoleAdmin: false,
    isRoleHM: false,
    isRoleRecruiter: false,
    isRoleTA: false,
    isRoleAgencyAdmin: false,
    isRoleSuperUserAdmin: false,
    isTypeEmployer: false,
    isTypeRecruiter: false,
    isPremiumOrganization:false
  };

  handleClick1 = () => {
    this.setState((state) => ({ open1: !state.open1 }));
  };

  handleClick2 = () => {
    this.setState((state) => ({ open2: !state.open2 }));
  };

  handleClick4 = () => {
    this.setState((state) => ({ open4: !state.open4 }));
  };

  componentDidMount = () => {
    this.setState(() => ({
      isRoleAdmin: roleUtil.isRoleAdmin(this.props.profile.roles),
      isRoleHM: roleUtil.isRoleHM(this.props.profile.roles),
      isRoleRecruiter: roleUtil.isRoleRecruiter(this.props.profile.roles),
      isRoleTA: roleUtil.isRoleTA(this.props.profile.roles),
      isRoleAgencyAdmin: roleUtil.isRoleAgencyAdmin(this.props.profile.roles),
      isRoleSuperUserAdmin: roleUtil.isRoleSuperUserAdmin(
        this.props.profile.roles
      ),
      isTypeEmployer: roleUtil.isTypeEmployer(this.props.profile.type),
      isTypeRecruiter: roleUtil.isTypeRecruiter(this.props.profile.type),
    }));

    if (roleUtil.isRoleSuperUserAdmin(this.props.profile.roles)) {
      this.setState((state) => ({ open4: !state.open4 }));
    }

    

    if (this.props.organization && Object.keys(this.props.organization).length > 0) {
      this.setState({ isPremiumOrganization: this.props.organization.isPremium });
    } else {
      const orgId = this.props.orgId > 0 ? this.props.orgId : null;
      if (orgId > 0) {
        this.props.loadOrganization(orgId);
      }
    }
     
  };

  componentWillReceiveProps(props) {
    if (props.organization && Object.keys(props.organization).length > 0) {
      this.setState({ isPremiumOrganization: props.organization.isPremium });
    } 
  }
   


  dashBoard = (classes, t) => {
    if (!this.state.isRoleSuperUserAdmin) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/dashboard"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("common:dashboard")}
          />
        </ListItem>
      );
    }
  };

  postJob = (classes, t) => {
    if (
      this.state.isTypeEmployer &&
      (this.state.isRoleAdmin || this.state.isRoleHM)
    ) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/job-post"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <AddIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("postaJob")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  hiringTeam = (classes, t) => {
    if (
      this.state.isTypeEmployer &&
      (this.state.isRoleAdmin || this.state.isRoleHM)
    ) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          onClick={this.handleClick2}
          to="#"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("hiringTeam")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  manageUsers = (classes, t) => {
    if (this.state.isTypeEmployer && this.state.isRoleAdmin) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/manage-user"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <LockOpenIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("manageUsers")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  manageRecuriters = (classes, t) => {
    if (this.state.isTypeRecruiter && this.state.isRoleAgencyAdmin) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/manage-recruiter"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <LockOpenIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("manageUsers")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  manageSettings = (classes, t) => {
    if (this.state.isTypeRecruiter && this.state.isRoleAgencyAdmin &&  this.state.isPremiumOrganization ) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/manage-settings"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <LockOpenIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("manageSettings")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  manageAgencies = (classes, t) => {
    if (
      this.state.isTypeEmployer &&
      (this.state.isRoleAdmin || this.state.isRoleTA)
    ) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/manage-agency"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("manageAgencies")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  managePremiumAgencies = (classes, t) => {
    if (this.state.isRoleSuperUserAdmin) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/manage-premium-agency"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("manageAgencies")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  manageEmployers = (classes, t) => {
    if (this.state.isRoleSuperUserAdmin) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/manage-employer"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("manageEmployer")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  manageFirm = (classes, t) => {
    if (this.state.isTypeEmployer && this.state.isRoleAdmin) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/manage-firm"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <Settings />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("manageSettings")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  reports = (classes, t) => {
    //if (this.state.isRoleSuperUserAdmin) {
    if (this.state.isRoleSuperUserAdmin) {
      return (
        <>
          <ListItem
            className={classes.listItem}
            component={NavLink}
            to="#"
            onClick={this.handleClick4}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary={t("reports")}
            />
          </ListItem>
          <Collapse in={this.state.open4} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                activeClassName={classes.activeListItem}
                className={classes.nested}
                component={NavLink}
                to="/rc/reports/1"
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <BulletIcon />
                </ListItemIcon>
                <ListItemText inset primary={t("HTAdmin")} />
              </ListItem>
              '
              <ListItem
                button
                activeClassName={classes.activeListItem}
                className={classes.nested}
                component={NavLink}
                to="/rc/reports/0"
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <BulletIcon />
                </ListItemIcon>
                <ListItemText inset primary={t("HTAgency")} />
              </ListItem>
            </List>
          </Collapse>
        </>
      );
    } else if (
      (this.state.isTypeRecruiter && this.state.isRoleAgencyAdmin) ||
      (this.state.isTypeEmployer && this.state.isRoleAdmin)
    ) {
      return (
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/rc/reports"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary={t("reports")}
          />
        </ListItem>
      );
    } else {
      return null;
    }
  };

  customerSupport = (classes, t) => {};

  render() {
    const { classes, t, className } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <nav className={rootClassName}>
        <div className={classes.logoWrapper}>
          <Link to="#" className={classes.logoLink}>
            <img alt="Hiring Target" className={classes.logoImage} src={logo} />
          </Link>
        </div>
        <Divider className={classes.logoDivider} />
        <div className={classes.navWrap}>
          <PerfectScrollbar>
            <List component="div" disablePadding style={{ paddingTop: 20 }}>
              {this.dashBoard(classes, t)}
              {this.postJob(classes, t)}
              {/* {this.hiringTeam(classes)} */}
              {this.manageUsers(classes, t)}
              {this.manageRecuriters(classes, t)}
              {this.manageSettings(classes, t)}
              {this.manageAgencies(classes, t)}
              {this.managePremiumAgencies(classes, t)}
              {this.manageEmployers(classes, t)}
              {this.manageFirm(classes, t)}
              {this.reports(classes, t)}
            </List>
            <Divider className={classes.listDivider} />
            {this.customerSupport(classes, t)}
          </PerfectScrollbar>
        </div>
      </nav>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = { loadOrganization};

const mapStateToProps = (state) => ({
  profile: state.profile,
  orgId: state.profile.orgId,
  organization: state.organization,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withTranslation(["sidebar", "common"])(Sidebar)));
