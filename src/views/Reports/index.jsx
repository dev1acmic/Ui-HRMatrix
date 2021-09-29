import React, { Component, useRef, useState, useEffect } from "react";
import { Container, withStyles, CircularProgress } from "@material-ui/core";
import { Dashboard as DashboardLayout } from "layouts";
import { Data, Info, Status, Filter, Excel } from "./components";
import styles from "./style";
/**
 *React framework for powerful internationalization
 *The module provides multiple components eg. to assert that needed translations get loaded or that your content gets rendered when the language changes.
 */
import { useTranslation } from "react-i18next";
import { getReportSummary } from "services/jobPost/action";
import {
  isRoleSuperUserAdmin,
  isRoleAgencyAdmin,
  isRoleAdmin,
} from "util/roleUtil";
import { Roles } from "util/enum";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loadOrganization } from "services/organization/action";

const Report = (props) => {
  const { roles } = props.profile;
  const { t } = useTranslation(["reports", "common"]);
  const childRef = useRef();
  const { classes, organization } = props; 
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState(null);
  const [isSuperAdminAgency, setIsSuperAdminAgency] = useState(null);

  useEffect(() => {
    if (organization && Object.keys(organization).length > 0 && isSuperAdminAgency !== null )
    {
     
      if (isRoleSuperUserAdmin(roles) && isSuperAdminAgency !== "undefined") {
        setLoading(true);
        props.getReportSummary(
          Roles.SuperUserAdmin,
          0,
          organization.stripeCustomerId,
          isSuperAdminAgency
        ).then(res => {
          const timer = setTimeout(() => {
            setLoading(false);
              }, 200);
        });
      }
  
      if (isRoleAgencyAdmin(roles)) {
        props.getReportSummary(
          Roles.AgencyAdmin,
          props.orgId,
          organization.stripeCustomerId
        );
      }
  
      if (isRoleAdmin(roles)) {
        props.getReportSummary(
          Roles.Admin,
          props.orgId,
          organization.stripeCustomerId
        );
      }
      
    }
    
  }, [organization,isSuperAdminAgency]);

  const filter = () => { 
    let startdate, enddate;

    if (childRef.current && childRef.current.startDate) {
      startdate = childRef.current.startDate;
    }

    if (childRef.current && childRef.current.endDate) {
      enddate = childRef.current.endDate;
    }

    if (isRoleSuperUserAdmin(roles) && isSuperAdminAgency !== "undefined") {
      props.getReportSummary(
        Roles.SuperUserAdmin,
        0,
        organization.stripeCustomerId,
        isSuperAdminAgency,
        startdate,
        enddate
      );
    }

    if (isRoleAgencyAdmin(roles)) {
      props.getReportSummary(
        Roles.AgencyAdmin,
        props.orgId,
        organization.stripeCustomerId,
        null,
        startdate,
        enddate
      );
    }

    if (isRoleAdmin(roles)) {
      props.getReportSummary(
        Roles.Admin,
        props.orgId,
        organization.stripeCustomerId,
        null,
        startdate,
        enddate
      );
    }
  };

  useEffect(() => {
    const role =
      props.match.params &&
      props.match.params.role &&
      props.match.params.role === "0";
    setIsSuperAdminAgency(role);
  }, [props.match.params.role]);

  useEffect(() => {
    if (props.reports && Object.keys(props.reports).length > 0) {
      setReports(props.reports);
      const timer = setTimeout(() => {
        setLoading(false);
          }, 200);
     
    }
  }, [props.reports]);

  useEffect(() => {
    if (props.orgId) {
      props.loadOrganization(props.orgId);
    }
  }, [props.orgId]);

  return (
    <DashboardLayout title={t("common:dashboard")}>
      {loading ? (
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
      ) :(  reports &&  (
        <Container
          className={classes.root}
          style={{ backgroundColor: "#f3f3f3" }}
        >
          <Info
            roles={roles}
            isSuperAdminAgency={isSuperAdminAgency}
            reports={reports}
          />
          <Filter
            filter={() => {
              filter();
            }}
            isSuperAdminAgency={isSuperAdminAgency}
            ref={childRef}
            roles={roles}
          />
          <Status
            roles={roles}
            isSuperAdminAgency={isSuperAdminAgency}
            reports={reports}
          />
          <Excel
            roles={roles}
            isSuperAdminAgency={isSuperAdminAgency}
            reports={reports}
          />
          <Data
            roles={roles}
            isSuperAdminAgency={isSuperAdminAgency}
            reports={reports}
          />
        </Container>) 
      )}
    </DashboardLayout>
  );
};

const mapDispatchToProps = { getReportSummary, loadOrganization };
const mapStateToProps = (state) => ({
  profile: state.profile,
  orgId: state.profile.orgId,
  organization: state.organization,
  reports: (state.jobPost && state.jobPost.reports) || null,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Report))
);
