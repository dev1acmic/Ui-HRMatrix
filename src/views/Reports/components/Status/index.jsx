import React, { Component } from "react";
import {
  Container,
  Table,
  TableCell,
  TableRow,
  withStyles,
  Divider,
  Typography,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import styles from "../style";
import { useTranslation } from "react-i18next";

import {
  isRoleSuperUserAdmin,
  isRoleAgencyAdmin,
  isRoleAdmin,
} from "util/roleUtil";

const Status = (props) => {
  const { classes, reports, roles, isSuperAdminAgency } = props;
  const { t } = useTranslation("reports");

  const agency_adminReport = (reports) => {
    return (
      <Table className={classes.reviewItemWrap}>
        <TableRow>
          <TableCell className={classes.reviewCol} align="center">
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
              {t("agency.allagencies")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.agencyCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
              {t("Noofjobs")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                 {reports.agencyJobCount || 0}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
              {t("allrevenue")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                 {reports.allRevenue?  t("common:currencySymbol") + reports.allRevenue : t("common:currencySymbol") + "0.00"} 
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
              {t("agency.preferredagencies")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                 {reports.preferredAgencyCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
              {t("Noofjobs")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.preferredAgencyJobCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
              {t("agency.htnetworkagencies")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.premiumAgencyCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
              {t("Noofjobs")}  
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
              {reports.premiumAgencyJobCount}  
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
        </TableRow>
      </Table>
    );
  };

  const agencyReport = (reports) => {
    return (
      <Table className={classes.reviewItemWrap}>
        <TableRow>
          <TableCell className={classes.reviewCol} align="center">
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofJobsReceived")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.jobReceivedCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofJobRelied")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.jobRepliedCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>

          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofcandidatessubmitted")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.candidSubmittedCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>

          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofCandidatesHired")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.candidHiredCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>

          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.billing")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                { reports.billing ? t("common:currencySymbol") + reports.billing : t("common:currencySymbol") + "0.00"
                   }
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
        </TableRow>
      </Table>
    );
  };

  const super_adminReport = (reports) => {
    return (
      <Table className={classes.reviewItemWrap}>
        <TableRow>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("Noofjobs")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.jobsCountbyFilter}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("admin.noofcandidates")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.candidatesCountbyFilter||0}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("admin.newemployers")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.newEmployerCountByFilter}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("revenue")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                { reports.revenueByFilter? t("common:currencySymbol") + reports.revenueByFilter : t("common:currencySymbol") + "0.00"}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
        </TableRow>
      </Table>
    );
  };

  const adminReport = (reports) => {
    return (
      <Table className={classes.reviewItemWrap}>
        <TableRow>
          <TableCell className={classes.reviewCol} align="center">
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofJobsPosted")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.jobsCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofPositionsFilled")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.positionFilledCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.billing")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                { reports.billing? t("common:currencySymbol") + reports.billing :  t("common:currencySymbol") + "0.00"  }
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofcandidatesshortlisted")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.shortListedCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>

          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofcandidatessubmitted")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.submittedCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>

          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofCandfromPreferredAgncy")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.prefCandidAgencyCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>

          <TableCell className={classes.reviewCol}>
            <div className={classes.reviewItem}>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("status.noofCandfromhtnAgncy")}
              </Typography>
              <Typography
                variant="h2"
                className={classes.reviewTitle}
                style={{ color: "#60CE8C" }}
              >
                {reports.premCandidCount}
              </Typography>
            </div>
            <Divider className={classes.dividerVer} />
          </TableCell>
        </TableRow>
      </Table>
    );
  };

  return (
    <Container className={classes.root} >
      <div className={classes.root}>
        <PerfectScrollbar className={classes.scroller}>
          { (isRoleSuperUserAdmin(roles) &&
            isSuperAdminAgency &&
            agency_adminReport(reports)) ||
            (isRoleSuperUserAdmin(roles) &&
              !isSuperAdminAgency &&
              super_adminReport(reports)) ||
            (isRoleAgencyAdmin(roles) && agencyReport(reports)) ||
            (isRoleAdmin(roles) && adminReport(reports))}
        </PerfectScrollbar>
      </div>
    </Container>
  );
};

export default withStyles(styles)(Status);
