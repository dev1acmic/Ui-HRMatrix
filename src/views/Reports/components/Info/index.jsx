import React, { Component, useState, useEffect } from "react";
import {
  Container,
  Table,
  TableCell,
  TableRow,
  withStyles,
  Divider,
  Typography,
  FormLabel, CircularProgress ,
} from "@material-ui/core";
import { FeaturedPlayListOutlined } from "@material-ui/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import styles from "../style";
import { useTranslation } from "react-i18next";

import { connect } from "react-redux";
import {
  isRoleSuperUserAdmin,
  isRoleAgencyAdmin,
  isRoleAdmin,
} from "util/roleUtil";

const Info = (props) => {
  const { classes,reports, roles } = props;
  const { t } = useTranslation("reports"); 

  const agency_adminReport = (reports) => {
    return (
      <> 
        <FormLabel
          className={classes.formHeader}
          style={{ margin: "30px 0 20px 0" }}
        >
          <FeaturedPlayListOutlined className={classes.trackBarIcon} />{" "}
          {t("agency.analytics")}
        </FormLabel>
        <Typography variant="h2" className={classes.subHead}>
          {t("summary")}
        </Typography>
        <Table
          className={classes.reviewItemWrap}
          style={{ borderColor: "#2F80ED", marginTop: 0 }}
        >
          <TableRow>
            <TableCell className={classes.reviewCol} align="center">
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                {t("agency.currentagencies")}  
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                {reports.currentAgencyCount} 
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                {t("currentjobs")}  
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                {reports.currentAgencyJobCount || 0} 
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                {t("currentrevenue")} 
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                { reports.currentRevenue ? t("common:currencySymbol") + reports.currentRevenue :  t("common:currencySymbol") + "0.00" } 
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                {t("agency.curntprefrdagencies")} 
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                {reports.currentPreferredAgencyCount} 
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                {t("agency.curntjobsagncyexclsv")} 
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                {reports.currentJobPreferredAgencyCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                {t("agency.currentHTNagncy")} 
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                {reports.currentPremiumAgencyCount || 0} 
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                {t("agency.currentHTNjobsagncy")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                {reports.currentJobPremiumAgencyCount}
                </Typography>
              </div>
            </TableCell>
          </TableRow>
        </Table>
      </>
    );
  };

  const agencyReport = (reports) => {
    return (
      <> 
        <FormLabel
          className={classes.formHeader}
          style={{ margin: "30px 0 20px 0" }}
        >
          <FeaturedPlayListOutlined className={classes.trackBarIcon} />{" "}
          {t("agency.analytics")}
        </FormLabel>
        <Typography variant="h2" className={classes.subHead}>
          {t("summary")}
        </Typography>
        <Table
          className={classes.reviewItemWrap}
          style={{ borderColor: "#2F80ED", marginTop: 0 }}
        >
          <TableRow>
            <TableCell className={classes.reviewCol} align="center">
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("admin.currentJobPostings")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.currentjobsCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("employer.candidatesSubmitted")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.currentSubmittedCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
          </TableRow>
        </Table>
      </>
    );
  };

  const super_adminReport = (reports) => {
    return (
      <>
        <FormLabel
          className={classes.formHeader}
          style={{ margin: "30px 0 20px 0" }}
        >
          <FeaturedPlayListOutlined className={classes.trackBarIcon} />{" "}
          {t("admin.analytics")}
        </FormLabel>
        <Typography variant="h2" className={classes.subHead}>
          {t("summary")}
        </Typography>
        <Table
          className={classes.reviewItemWrap}
          style={{ borderColor: "#2F80ED", marginTop: 0 }}
        >
          <TableRow>
            <TableCell className={classes.reviewCol} align="center">
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("admin.allemployers")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.employerCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("Noofjobs")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.jobsCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("allrevenue")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  { reports.allRevenue? t("common:currencySymbol") + reports.allRevenue : t("common:currencySymbol") + "0.00"
                     }
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>

            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("admin.currentemployers")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.currentEmployersCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>

            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("currentjobs")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.currentJobsCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>

            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("currentrevenue")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {
                   reports.currentRevenue? t("common:currencySymbol") + reports.currentRevenue:  t("common:currencySymbol") + "0.00"}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
          </TableRow>
        </Table>
      </>
    );
  };

  const adminReport = (reports) => {
    return (
      <> 
        <FormLabel
          className={classes.formHeader}
          style={{ margin: "30px 0 20px 0" }}
        >
          <FeaturedPlayListOutlined className={classes.trackBarIcon} />{" "}
          {t("admin.analytics")}
        </FormLabel>
        <Typography variant="h2" className={classes.subHead}>
          {t("summary")}
        </Typography>
        <Table
          className={classes.reviewItemWrap}
          style={{ borderColor: "#2F80ED", marginTop: 0 }}
        >
          <TableRow>
            <TableCell className={classes.reviewCol} align="center">
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("admin.currentJobPostings")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.currentjobsCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("employer.candidatesShortlisted")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.currentShortListedCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("employer.candidatesSubmitted")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.currentSubmittedCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("employer.noofcandidatesfrompreferredagencies")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.currentPrefCandidCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
            <TableCell className={classes.reviewCol}>
              <div className={classes.reviewItem}>
                <Typography variant="body1" className={classes.reviewLabel}>
                  {t("employer.noofcandidatesfromhtnagencies")}
                </Typography>
                <Typography variant="h2" className={classes.reviewTitle}>
                  {reports.currentPremCandidCount}
                </Typography>
              </div>
              <Divider className={classes.dividerVer} />
            </TableCell>
          </TableRow>
        </Table>
      </>
    );
  };

  return (   
        <Container className={classes.root}>
          <div className={classes.root}>
            <PerfectScrollbar className={classes.scroller}>
              {(isRoleSuperUserAdmin(roles) &&
                props.isSuperAdminAgency &&
                agency_adminReport(reports)) ||
                (isRoleSuperUserAdmin(roles) &&
                  !props.isSuperAdminAgency &&
                  super_adminReport(reports)) ||
                (isRoleAgencyAdmin(roles) && agencyReport(reports)) ||
                (isRoleAdmin(roles) && adminReport(reports))}
            </PerfectScrollbar>
          </div>
        </Container> 
 );
};

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Info));
