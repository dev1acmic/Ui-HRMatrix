import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { withStyles, Container } from "@material-ui/core";
import styles from "./style";
import { Dashboard as DashboardLayout } from "layouts";
import { useTranslation } from "react-i18next";
import { loadOrganization } from "services/organization/action";
import { CompanyInfo, Configuration, Subscription } from "./components";
import { connect } from "react-redux";
import compose from "recompose/compose";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ManageFirm(props) {
  //  const childRef = React.useRef();
  const { t } = useTranslation("common");
  const { classes } = props;
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    // childRef.current.sayHello();

    setValue(newValue);
  }

  function changeTab(newValue) {
    setValue(newValue);
  }

  useEffect(() => {
    if (props.orgId) {
      props.loadOrganization(props.orgId);
    }
  }, [props.orgId]);

  useEffect(() => {
    if (
      props.location &&
      props.location.state &&
      props.location.state.activeTab
    ) {
      setValue(props.location.state.activeTab);
    }
  }, []);

  return (
    <DashboardLayout title={t("dashboard")}>
      <Container className={classes.root}>
        <AppBar position="static" className={classes.tabBg}>
          <Tabs
            classes={{
              indicator: classes.indicator,
            }}
            value={value}
            onChange={handleChange}
            aria-label={t("manageFirm")}
          >
            <Tab
              className={classes.tabItem}
              label={t("companyInfo")}
              {...a11yProps(0)}
            />
            <Tab
              className={classes.tabItem}
              label={t("configuration")}
              {...a11yProps(1)}
            />
            <Tab
              className={classes.tabItem}
              label={t("paymentinformation")}
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} className={classes.tabContainer}>
          <CompanyInfo changeTab={changeTab} />
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.tabContainer}>
          <Configuration />
        </TabPanel>
        <TabPanel value={value} index={2} className={classes.tabContainer}>
          <Subscription />
        </TabPanel>
      </Container>
    </DashboardLayout>
  );
}

const mapDispatchToProps = { loadOrganization };
const mapStateToProps = (state) => ({
  orgId: state.profile.orgId,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ManageFirm))
);
