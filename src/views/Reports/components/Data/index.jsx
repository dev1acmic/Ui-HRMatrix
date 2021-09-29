import React, { useEffect } from "react";
// import { Excel } from "../../components";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  TablePagination,
} from "@material-ui/core";
import classNames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { paginate } from "util/helper";
import {
  isRoleSuperUserAdmin,
  isRoleAgencyAdmin,
  isRoleAdmin,
} from "util/roleUtil";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import styles from "../style";
const theme = createMuiTheme({
  overrides: {
    MuiTable: {
      root: {
        width: "100%",
        borderCollapse: "initial",
      },
    },
    MuiTableCell: {
      root: {
        textAlign: "center",
        fontWeight: 600,
        borderBottom: "none",
      },
      head: {
        backgroundColor: "white",
        "&:last-child": {
          paddingRight: "12px!important",
        },
        "&:first-child": {
          paddingLeft: "12px!important",
        },
        padding: "6px 6px 6px 6px!important",
        borderBottom: "none",
        borderTop: "none",
        fontWeight: 600,
      },
      body: {
        backgroundColor: "white",
        "&:last-child": {
          borderRadius: "0 4px 4px 0",
          paddingRight: "12px!important",
        },
        "&:first-child": {
          borderRadius: "4px 0 0 4px",
          paddingLeft: "12px!important",
        },
        padding: "6px 6px 6px 6px!important",
      },
    },
  },
});

const Data = (props) => {
  const { classes, roles } = props;
  const { t } = useTranslation(["reports", "common"]);
  const pageSize = 10;
  // const [excelData, setExcelData] = React.useState([]);
  // const [reportsSummary, setReportsSummary] = React.useState([]);
  const [reports, setReports] = React.useState(null);
  const [state, setState] = React.useState({
    selected: "absoulte",
    anchorEl: null,
    expandSkill: true,
    expandQn: true,
    pageNo: 1,
  });

  const agency_adminReport = (reports) => {
    return (
      <Table size="small">
        <TableHead className={classes.tableRow} style={{ borderRadius: 4 }}>
          <TableRow>
            <TableCell
              align="left"
              rowSpan="2"
              className={classes.tableHeadTL12}
            >
              {t("slno")}
            </TableCell>
            <TableCell
              align="left"
              rowSpan="2"
              className={classes.tableHeadTL12}
            >
              {t("agency.agency")}
            </TableCell>
            <TableCell rowSpan="2" align="center" className={classes.tableHead}>
              {t("agency.current")}
            </TableCell>
            <TableCell rowSpan="2" align="center" className={classes.tableHead}>
              {t("agency.employerinteractions")}
            </TableCell>
            <TableCell rowSpan="2" align="center" className={classes.tableHead}>
              {t("agency.jobpostings")}
            </TableCell>
            <TableCell
              className={classes.tableHead}
              style={{ backgroundColor: "#E6F6FC" }}
              colSpan="6"
            >
              {t("admin.candidateSubmissions")}
            </TableCell>
            <TableCell className={classes.tableHead} rowSpan="2">
              {t("ofcandidates")}
            </TableCell>
            <TableCell className={classes.tableHeadTR12} rowSpan="2">
              {t("revenue")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.tableBodyScore}>
              {t("total")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {t("fulltime")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {t("parttime")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {t("contractors")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {t("internship")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {t("seasonal")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan="11" className={classes.borderRow}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports &&
            reports.agencySummary &&
            reports.agencySummary.map((agc) => (
              <>
                <TableRow className={classes.tableRow}>
                  <TableCell align="left" className={classes.tableBody}>
                    {agc.SLNo}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {agc.name}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {agc.current}
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    {agc.interactions || 0}
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    {agc.jobCount || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {agc.totalc || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {agc.fulltime || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {agc.parttime || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {agc.contract || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {agc.internship || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {agc.seasonal || 0}
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    {agc.totalCandid || 0}
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    {t("common:currencySymbol") + agc.revenue}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan="11"
                    className={classes.borderRow}
                  ></TableCell>
                </TableRow>
              </>
            ))}
          {reports &&
            reports.agencySummary &&
            reports.agencySummary.length === 0 && (
              <TableRow className={classes.tableRow}>
                <TableCell colSpan="13" className={classes.tableBody}>
                  {t("noRecordsFound")}
                </TableCell>
              </TableRow>
            )}

          {reports && reports.total && reports.total.length > 0 && (
            <TableRow
              className={classNames(classes.tableRow, classes.totalRow)}
            >
              <TableCell align="center" className={classes.tableBody}>
                <span style={{ paddingLeft: 50 }}>{t("total")}</span>
              </TableCell>
              <TableCell
                align="center"
                className={classes.tableBody}
              ></TableCell>{" "}
              <TableCell
                align="center"
                className={classes.tableBody}
              ></TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].interactions}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].jobCount}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].totalc}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].fulltime}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].parttime}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].contract}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].internship}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].seasonal}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].totalCandid}
              </TableCell>
              <TableCell className={classes.tableBody}>
                {" "}
                {t("common:currencySymbol") + reports.total[0].revenue}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  const agencyReport = (reports) => {
    return (
      <>
        <Table size="small">
          <TableHead className={classes.tableRow} style={{ borderRadius: 4 }}>
            <TableRow>
              <TableCell
                align="left"
                rowSpan="2"
                className={classes.tableHeadTL12}
              >
                {t("slno")}
              </TableCell>
              <TableCell
                align="left"
                rowSpan="2"
                className={classes.tableHeadTL12}
              >
                {t("admin.employer")}
              </TableCell>
              <TableCell
                rowSpan="2"
                align="center"
                className={classes.tableHead}
              >
                {t("agency.jobpostings")}
              </TableCell>
              <TableCell
                rowSpan="2"
                align="center"
                className={classes.tableHead}
              >
                {t("agency.current")}
              </TableCell>
              <TableCell
                className={classes.tableHead}
                style={{ backgroundColor: "#E6F6FC" }}
                colSpan="6"
              >
                {t("admin.candidateSubmissions")}
              </TableCell>
              <TableCell className={classes.tableHeadTR12} rowSpan="2">
                {t("status.billing")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableBodyScore}>
                {t("total")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("fulltime")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("parttime")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("contractors")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("internship")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("seasonal")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan="11" className={classes.borderRow}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports &&
              reports.results &&
              reports.results.map((agc) => (
                <>
                  <TableRow className={classes.tableRow}>
                    <TableCell align="left" className={classes.tableBody}>
                      {agc.SLNo}
                    </TableCell>
                    <TableCell align="center" className={classes.tableBody}>
                      {agc.name}
                    </TableCell>
                    <TableCell align="center" className={classes.tableBody}>
                      {agc.totaljobs}
                    </TableCell>
                    <TableCell align="center" className={classes.tableBody}>
                      {agc.curr}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {agc.totalC}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {agc.fulltime}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {agc.parttime}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {agc.contract}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {agc.internship}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {agc.seasonal}
                    </TableCell>
                    <TableCell className={classes.tableBody}>
                      {t("common:currencySymbol") + agc.billing || 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan="11"
                      className={classes.borderRow}
                    ></TableCell>
                  </TableRow>
                </>
              ))}

            {reports && reports.results && reports.results.length === 0 && (
              <TableRow className={classes.tableRow}>
                <TableCell colSpan="13" className={classes.tableBody}>
                  {t("noRecordsFound")}
                </TableCell>
              </TableRow>
            )}

            {reports && reports.total && reports.total.length > 0 && (
              <TableRow
                className={classNames(classes.tableRow, classes.totalRow)}
              >
                <TableCell align="center" className={classes.tableBody}>
                  <span style={{ paddingLeft: 50 }}> {t("total")}</span>
                </TableCell>
                <TableCell
                  align="center"
                  className={classes.tableBody}
                ></TableCell>

                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].totaljobs}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].curr}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].totalC}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].fulltime}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].parttime}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].contract}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].internship}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].seasonal}
                </TableCell>
                <TableCell className={classes.tableBody}>
                  {" "}
                  {t("common:currencySymbol") + reports.total[0].billing || 0}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Table size="small" style={{ marginTop: "50px" }}>
          <TableHead className={classes.tableRow} style={{ borderRadius: 4 }}>
            <TableRow>
              <TableCell
                align="center"
                rowSpan="2"
                className={classes.tableHeadTL12}
              >
                {t("admin.employer")}
              </TableCell>
              <TableCell
                rowSpan="2"
                align="center"
                className={classes.tableHead}
              >
                {t("common:jobID")}
              </TableCell>
              <TableCell
                rowSpan="2"
                align="center"
                className={classes.tableHead}
              >
                {t("common:jobTitle")}
              </TableCell>
              <TableCell className={classes.tableHead} rowSpan="2">
                {t("ofcandidatesSubmitted")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports &&
              reports.summary &&
              reports.summary.map((agc) => (
                <TableRow className={classes.tableRow}>
                  <TableCell align="center" className={classes.tableBody}>
                    {agc.name}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {agc.uniqueId}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {agc.title}
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    {agc.candidates}
                  </TableCell>
                </TableRow>
              ))}

            {reports && reports.summary && reports.summary.length === 0 && (
              <TableRow className={classes.tableRow}>
                <TableCell colSpan="4" className={classes.tableBody}>
                  {t("noRecordsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </>
    );
  };

  const super_adminReport = (reports) => {
    return (
      <Table size="small">
        <TableHead className={classes.tableRow} style={{ borderRadius: 4 }}>
          <TableRow>
            <TableCell
              align="left"
              rowSpan="2"
              className={classes.tableHeadTL12}
            >
              {t("slno")}
            </TableCell>
            <TableCell
              align="left"
              rowSpan="2"
              className={classes.tableHeadTL12}
            >
              {t("admin.employer")}
            </TableCell>
            <TableCell rowSpan="2" align="center" className={classes.tableHead}>
              {t("admin.#ofdepartments")}
            </TableCell>
            <TableCell rowSpan="2" align="center" className={classes.tableHead}>
              {t("admin.currentJobPostings")}
            </TableCell>
            <TableCell
              className={classes.tableHead}
              style={{ backgroundColor: "#E6F6FC" }}
              colSpan="6"
            >
              {t("admin.alljobpostings")}
            </TableCell>
            <TableCell className={classes.tableHeadTR12} rowSpan="2">
              {t("ofcandidates")}
            </TableCell>
            <TableCell className={classes.tableHeadTR12} rowSpan="2">
              {t("revenue")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.tableBodyScore}>
              {t("total")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {" "}
              {t("fulltime")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {t("parttime")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {t("contractors")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {t("internship")}
            </TableCell>
            <TableCell className={classes.tableBodyScore}>
              {t("seasonal")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan="11" className={classes.borderRow}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports &&
            reports.data &&
            reports.data.map((org) => (
              <>
                <TableRow className={classes.tableRow}>
                  <TableCell align="left" className={classes.tableBody}>
                    {org.SLNo}
                  </TableCell>
                  <TableCell align="left" className={classes.tableBody}>
                    {org.name}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {org.deptCount}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {org.currentPosting}
                  </TableCell>

                  <TableCell className={classes.tableBodyScore}>
                    {org.jobCount || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {org.fulltime || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {org.parttime || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {org.contract || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {org.internship || 0}
                  </TableCell>
                  <TableCell className={classes.tableBodyScore}>
                    {org.seasonal || 0}
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    {org.applnCount || 0}
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    {t("common:currencySymbol") + org.revenue}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan="11"
                    className={classes.borderRow}
                  ></TableCell>
                </TableRow>
              </>
            ))}

          {reports && reports.data && reports.data.length === 0 && (
            <TableRow className={classes.tableRow}>
              <TableCell colSpan="12" className={classes.tableBody}>
                {t("noRecordsFound")}
              </TableCell>
            </TableRow>
          )}
          {reports && reports.total && reports.total.length > 0 && (
            <TableRow
              className={classNames(classes.tableRow, classes.totalRow)}
            >
              <TableCell align="center" className={classes.tableBody}>
                <span style={{ paddingLeft: 50 }}> {t("total")}</span>
              </TableCell>
              <TableCell
                align="center"
                className={classes.tableBody}
              ></TableCell>

              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].deptCount}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].currentPosting}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].jobCount}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].fulltime}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].parttime}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].contract}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].internship}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {reports.total[0].seasonal}
              </TableCell>
              <TableCell className={classes.tableBody}>
                {reports.total[0].applnCount || 0}
              </TableCell>
              <TableCell className={classes.tableBody}>
                {t("common:currencySymbol") + reports.total[0].revenue}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  const adminReport = (reports) => {
    return (
      <>
        <Table size="small">
          <TableHead className={classes.tableRow} style={{ borderRadius: 4 }}>
            <TableRow>
              <TableCell
                align="left"
                rowSpan="2"
                className={classes.tableHeadTL12}
              >
                {t("slno")}
              </TableCell>
              <TableCell
                align="left"
                rowSpan="2"
                className={classes.tableHeadTL12}
              >
                {t("data.department")}
              </TableCell>
              <TableCell
                rowSpan="2"
                align="center"
                className={classes.tableHead}
              >
                {t("agency.jobpostings")}
              </TableCell>
              <TableCell
                rowSpan="2"
                align="center"
                className={classes.tableHead}
              >
                {t("agency.current")}
              </TableCell>
              <TableCell
                className={classes.tableHead}
                style={{ backgroundColor: "#E6F6FC" }}
                colSpan="6"
              >
                {t("agency.candidate")}
              </TableCell>
              <TableCell className={classes.tableHeadTR12} rowSpan="2">
                {t("status.billing")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableBodyScore}>
                {t("total")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("fulltime")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("parttime")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("contractors")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("internship")}
              </TableCell>
              <TableCell className={classes.tableBodyScore}>
                {t("seasonal")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan="11" className={classes.borderRow}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports &&
              reports.results &&
              reports.results.map((org) => (
                <>
                  <TableRow className={classes.tableRow}>
                    <TableCell align="left" className={classes.tableBody}>
                      {org.SLNo}
                    </TableCell>
                    <TableCell align="center" className={classes.tableBody}>
                      {org.dept}
                    </TableCell>
                    <TableCell align="center" className={classes.tableBody}>
                      {org.postings}
                    </TableCell>
                    <TableCell align="center" className={classes.tableBody}>
                      {org.curr}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {org.totalC}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {org.fulltime}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {org.parttime}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {org.contract}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {org.internship}
                    </TableCell>
                    <TableCell className={classes.tableBodyScore}>
                      {org.seasonal}
                    </TableCell>
                    <TableCell className={classes.tableBody}>
                      {t("common:currencySymbol") + org.billing}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan="11"
                      className={classes.borderRow}
                    ></TableCell>
                  </TableRow>
                </>
              ))}

            {reports && reports.results && reports.results.length === 0 && (
              <TableRow className={classes.tableRow}>
                <TableCell colSpan="11" className={classes.tableBody}>
                  {t("noRecordsFound")}
                </TableCell>
              </TableRow>
            )}

            {reports && reports.total && reports.total.length > 0 && (
              <TableRow
                className={classNames(classes.tableRow, classes.totalRow)}
              >
                <TableCell align="center" className={classes.tableBody}>
                  <span style={{ paddingLeft: 50 }}> {t("total")}</span>
                </TableCell>
                <TableCell
                  align="center"
                  className={classes.tableBody}
                ></TableCell>

                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].postings}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].curr}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].totalC}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].fulltime}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].parttime}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].contract}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].internship}
                </TableCell>
                <TableCell className={classes.tableBodyScore}>
                  {reports.total[0].seasonal}
                </TableCell>
                <TableCell className={classes.tableBody}>
                  {t("common:currencySymbol") + reports.total[0].billing}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Table size="small" style={{ marginTop: "50px" }}>
          <TableHead className={classes.tableRow} style={{ borderRadius: 4 }}>
            <TableRow>
              <TableCell
                align="center"
                rowSpan="2"
                className={classes.tableHeadTL12}
              >
                {t("hrManager")}
              </TableCell>
              <TableCell
                rowSpan="2"
                align="center"
                className={classes.tableHead}
              >
                {t("common:jobID")}
              </TableCell>
              <TableCell
                rowSpan="2"
                align="center"
                className={classes.tableHead}
              >
                {t("common:jobTitle")}
              </TableCell>
              <TableCell
                rowSpan="2"
                align="center"
                className={classes.tableHead}
              >
                {t("data.department")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports &&
              reports.summary &&
              reports.summary.map((org) => (
                <TableRow className={classes.tableRow}>
                  <TableCell align="center" className={classes.tableBody}>
                    {org.HiringManager}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {org.uniqueId}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {org.jobtitle}
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    {org.dept}
                  </TableCell>
                </TableRow>
              ))}

            {reports && reports.summary && reports.summary.length === 0 && (
              <TableRow className={classes.tableRow}>
                <TableCell colSpan="11" className={classes.tableBody}>
                  {t("noRecordsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </>
    );
  };

  useEffect(() => {
    if (props.reports && Object.keys(props.reports).length > 0) {
      setReports(props.reports);

      // let data = [];
      // let summary = [];
      // if (isRoleAdmin(roles)) {
      //   props.reports &&
      //     props.reports.results.forEach(function (org) {
      //       data.push([
      //         {
      //           value: org.SLNo,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: org.dept,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: org.postings,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: org.curr,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: org.totalC,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.fulltime,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.parttime,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.contract,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.internship,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.seasonal,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: parseInt(org.billing),
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             //alignment: { horizontal: "center" },
      //           },
      //         },
      //       ]);
      //     });
      //   if (
      //     props.reports &&
      //     props.reports.total &&
      //     props.reports.total.length > 0
      //   ) {
      //     const reportsTotal = props.reports;
      //     data.push([
      //       {
      //         value: t("total") + "(" + t("common:currencySymbol") + ")",
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: "",
      //         style: {
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].postings),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].curr),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].totalC),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].fulltime),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].parttime),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].contract),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].internship),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].seasonal),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].billing),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //     ]);
      //   }
      //   if (props.reports && props.reports.summary.length > 0) {
      //     props.reports.summary.forEach(function (sum) {
      //       summary.push([
      //         {
      //           value: sum.HiringManager,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: sum.uniqueId,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: sum.jobtitle,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: sum.dept,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //       ]);
      //     });
      //   }
      // } else if (isRoleAgencyAdmin(roles)) {
      //   props.reports &&
      //     props.reports.results.forEach(function (agc) {
      //       data.push([
      //         {
      //           value: agc.SLNo,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: agc.name,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: agc.totaljobs,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: agc.curr,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: agc.totalC,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.fulltime,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.parttime,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.contract,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.internship,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.seasonal,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: parseInt(agc.billing) || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //       ]);
      //     });
      //   if (
      //     props.reports &&
      //     props.reports.total &&
      //     props.reports.total.length > 0
      //   ) {
      //     const reportsTotal = props.reports;
      //     data.push([
      //       {
      //         value: t("total") + "(" + t("common:currencySymbol") + ")",
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: "",
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].totaljobs),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].curr),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].totalC),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].fulltime),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //           fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].parttime),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //           fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].contract),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //           fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].internship),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //           fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].seasonal),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //           fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].billing) || 0,
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //     ]);
      //   }
      //   if (props.reports && props.reports.summary.length > 0) {
      //     props.reports.summary.forEach(function (sum) {
      //       summary.push([
      //         {
      //           value: sum.name,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: sum.uniqueId,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: sum.title,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: sum.candidates,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //       ]);
      //     });
      //   }
      // } else if (isRoleSuperUserAdmin(roles) && props.isSuperAdminAgency) {
      //   props.reports &&
      //     props.reports.agencySummary.forEach(function (agc) {
      //       data.push([
      //         {
      //           value: agc.SLNo,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: agc.name,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: agc.current,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: agc.interactions || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: agc.jobCount || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: agc.totalc || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.fulltime || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.parttime || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.contract || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.internship || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.seasonal || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: agc.totalCandid || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: parseInt(agc.revenue),
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //       ]);
      //     });
      //   if (
      //     props.reports &&
      //     props.reports.total &&
      //     props.reports.total.length > 0
      //   ) {
      //     const reportsTotal = props.reports;
      //     data.push([
      //       {
      //         value: t("total") + "(" + t("common:currencySymbol") + ")",
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: "",
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: "",
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].interactions),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].jobCount),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].totalc),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].fulltime),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].parttime),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].contract),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].internship),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].seasonal),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].totalCandid),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].revenue),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //     ]);
      //   }
      // } else {
      //   props.reports &&
      //     props.reports.data.forEach(function (org) {
      //       data.push([
      //         {
      //           value: org.SLNo,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: org.name,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: org.deptCount,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: org.currentPosting,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: org.jobCount || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: org.fulltime || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.parttime || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.contract || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.internship || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.seasonal || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //             fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
      //           },
      //         },
      //         {
      //           value: org.applnCount || 0,
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //         {
      //           value: parseInt(org.revenue),
      //           style: {
      //             border: {
      //               top: { style: "thin" },
      //               bottom: { style: "thin" },
      //               left: { style: "thin" },
      //               right: { style: "thin" },
      //             },
      //           },
      //         },
      //       ]);
      //     });
      //   if (
      //     props.reports &&
      //     props.reports.total &&
      //     props.reports.total.length > 0
      //   ) {
      //     const reportsTotal = props.reports;
      //     data.push([
      //       {
      //         value: t("total") + "(" + t("common:currencySymbol") + ")",
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: "",
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].deptCount),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].currentPosting),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].jobCount),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].fulltime),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].parttime),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].contract),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].internship),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].seasonal),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].applnCount) || 0,
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //       {
      //         value: parseInt(reportsTotal.total[0].revenue),
      //         style: {
      //           font: { bold: true },
      //           border: {
      //             top: { style: "medium" },
      //             bottom: { style: "medium" },
      //             left: { style: "thin" },
      //             right: { style: "thin" },
      //           },
      //         },
      //       },
      //     ]);
      //   }
      // }
      // setExcelData(data);
      // setReportsSummary(summary);
    }
  }, [props.reports, reports, state]);

  // const handlePaginateNext = (event, page) => {
  //   debugger
  //   const pageNo = page + 1;
  //   setState({ ...state, pageNo });
  //   setReports(paginate(reports.data, pageSize, pageNo));
  // };
  // let multiDataSet = null;
  // // eslint-disable-next-line no-lone-blocks
  // {
  //   isRoleAdmin(roles)
  //     ? (multiDataSet = [
  //         {
  //           columns: [
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("admin.candidateSubmissions"),
  //               style: {
  //                 font: { sz: "12", bold: true },
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //           ],
  //           data: "",
  //         },
  //         {
  //           columns: [
  //             {
  //               title: t("slno"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("data.department"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("agency.jobpostings"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("agency.current"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("total"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("fulltime"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("parttime"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("contractors"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("internship"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("seasonal"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title:
  //                 t("status.billing") + "(" + t("common:currencySymbol") + ")",
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //           ],
  //           data: excelData,
  //         },
  //         {
  //           ySteps: 5,
  //           columns: [
  //             {
  //               title: t("admin.employer"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("common:jobID"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("common:jobTitle"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("ofcandidatesSubmitted"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //                 alignment: { wrapText: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //           ],
  //           data: reportsSummary,
  //         },
  //       ])
  //     : isRoleAgencyAdmin(roles)
  //     ? (multiDataSet = [
  //         {
  //           columns: [
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("admin.candidateSubmissions"),
  //               style: {
  //                 font: { sz: "12", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //               },
  //             },
  //           ],
  //           data: "",
  //         },
  //         {
  //           columns: [
  //             {
  //               title: t("slno"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("admin.employer"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("agency.jobpostings"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("agency.current"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("total"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("fulltime"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("parttime"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("contractors"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("internship"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("seasonal"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title:
  //                 t("status.billing") + "(" + t("common:currencySymbol") + ")",
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //           ],
  //           data: excelData,
  //         },
  //         {
  //           ySteps: 5,
  //           columns: [
  //             {
  //               title: t("hrManager"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("common:jobID"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("common:jobTitle"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("data.department"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //           ],
  //           data: reportsSummary,
  //         },
  //       ])
  //     : isRoleSuperUserAdmin(roles) && props.isSuperAdminAgency
  //     ? (multiDataSet = [
  //         {
  //           columns: [
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("agency.candidate"),
  //               style: {
  //                 font: { sz: "12", bold: true },
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //           ],
  //           data: "",
  //         },
  //         {
  //           columns: [
  //             {
  //               title: t("slno"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("agency.agency"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("agency.current"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("agency.employerinteractions"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("agency.jobpostings"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("total"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("fulltime"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("parttime"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("contractors"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("internship"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("seasonal"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("ofcandidates"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("revenue") + "(" + t("common:currencySymbol") + ")",
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //           ],
  //           data: excelData,
  //         },
  //       ])
  //     : (multiDataSet = [
  //         {
  //           columns: [
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: t("admin.alljobpostings"),
  //               style: {
  //                 font: { sz: "12", bold: true },
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 fill: { fgColor: { rgb: "e6f6fc" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //             {
  //               title: "",
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
  //               },
  //             },
  //           ],
  //           data: "",
  //         },
  //         {
  //           columns: [
  //             {
  //               title: t("slno"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("admin.employer"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("admin.#ofdepartments"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("admin.currentJobPostings"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("total"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("fulltime"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("parttime"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("contractors"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("internship"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("seasonal"),
  //               style: {
  //                 border: {
  //                   top: { style: "thin" },
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "11", bold: true },
  //                 fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
  //               },
  //             },
  //             {
  //               title: t("ofcandidates"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //             {
  //               title: t("revenue"),
  //               style: {
  //                 border: {
  //                   bottom: { style: "medium" },
  //                   left: { style: "thin" },
  //                   right: { style: "thin" },
  //                 },
  //                 font: { sz: "12", bold: true },
  //               },
  //             },
  //           ],
  //           data: excelData,
  //         },
  //       ]);
  // }

  return (
    <Container className={classes.root}>
      {/* <Excel multiDataSet={multiDataSet} /> */}
      <div className={classes.root}>
        <MuiThemeProvider theme={theme}>
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
        </MuiThemeProvider>
        {/* <TablePagination
            backIconButtonProps={{
              "aria-label": "Prev",
            }}
            component="div"
            nextIconButtonProps={{
              "aria-label":"Next",
            }}
            className={classes.paginationWrap}
            onChangePage={handlePaginateNext}
            count={props.reports &&props.reports.data && props.reports.data.length}
            page={state.pageNo - 1}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[]}
          /> */}
      </div>
    </Container>
  );
};

const mapDispatchToProps = {};
const mapStateToProps = () => ({});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Data))
);
