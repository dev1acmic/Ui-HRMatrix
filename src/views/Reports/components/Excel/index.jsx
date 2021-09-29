import React, { useEffect } from "react";
/** Author:Alphonsa
 * React component for excel exporting with styling
 *https://www.npmjs.com/package/react-data-export
 * @example react-export-excel, react-export-excel-fixed-xlsx(to be explored)
 */
import ReactExport from "react-data-export";
// Material helpers
import { withStyles } from "@material-ui/core";
import IconExcel from "../../../../assets/images/iconExcel.svg";
// Component styles
import styles from "../style";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  isRoleSuperUserAdmin,
  isRoleAgencyAdmin,
  isRoleAdmin,
} from "util/roleUtil";
/**
 *React framework for powerful internationalization
 *The module provides multiple components eg. to assert that needed translations get loaded or that your content gets rendered when the language changes.
 */
import { useTranslation } from "react-i18next";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Excel = (props) => {
  const { classes, roles } = props;
  const { t } = useTranslation(["reports", "common"]);
  const [excelData, setExcelData] = React.useState([]);
  const [reportsSummary, setReportsSummary] = React.useState([]);

  useEffect(() => {
    if (props.reports && Object.keys(props.reports).length > 0) {
      let data = [];
      let summary = [];
      if (isRoleAdmin(roles)) {
        /**Populate excel data if admin */
        props.reports &&
          props.reports.results.forEach(function (org) {
            data.push([
              {
                value: org.SLNo,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: org.dept,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: org.postings,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: org.curr,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: org.totalC,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.fulltime,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.parttime,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.contract,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.internship,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.seasonal,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: parseInt(org.billing),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  //alignment: { horizontal: "center" },
                },
              },
            ]);
          });
        if (
          props.reports &&
          props.reports.total &&
          props.reports.total.length > 0
        ) {
          const reportsTotal = props.reports;
          data.push([
            {
              value: t("total"),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: "",
              style: {
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].postings),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].curr),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].totalC),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].fulltime),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].parttime),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].contract),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].internship),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].seasonal),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].billing),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
          ]);
        }
        if (props.reports && props.reports.summary.length > 0) {
          props.reports.summary.forEach(function (sum) {
            summary.push([
              {
                value: sum.HiringManager,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: sum.uniqueId,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: sum.jobtitle,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: sum.dept,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
            ]);
          });
        }
      } else if (isRoleAgencyAdmin(roles)) {
        /**Populate excel data if agency admin user */
        props.reports &&
          props.reports.results.forEach(function (agc) {
            data.push([
              {
                value: agc.SLNo,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: agc.name,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: agc.totaljobs,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: agc.curr,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: agc.totalC,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.fulltime,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.parttime,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.contract,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.internship,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.seasonal,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: parseInt(agc.billing) || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
            ]);
          });
        if (
          props.reports &&
          props.reports.total &&
          props.reports.total.length > 0
        ) {
          const reportsTotal = props.reports;
          data.push([
            {
              value: t("total"),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: "",
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].totaljobs),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].curr),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].totalC),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].fulltime),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
                fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].parttime),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
                fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].contract),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
                fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].internship),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
                fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].seasonal),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
                fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].billing) || 0,
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
          ]);
        }
        if (props.reports && props.reports.summary.length > 0) {
          props.reports.summary.forEach(function (sum) {
            summary.push([
              {
                value: sum.name,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: sum.uniqueId,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: sum.title,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: sum.candidates,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
            ]);
          });
        }
      } else if (isRoleSuperUserAdmin(roles) && props.isSuperAdminAgency) {
        /**Populate excel data if HT admin */
        props.reports &&
          props.reports.agencySummary.forEach(function (agc) {
            data.push([
              {
                value: agc.SLNo,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: agc.name,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: agc.current,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: agc.interactions || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: agc.jobCount || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: agc.totalc || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.fulltime || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.parttime || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.contract || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.internship || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.seasonal || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: agc.totalCandid || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: parseInt(agc.revenue),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
            ]);
          });
        if (
          props.reports &&
          props.reports.total &&
          props.reports.total.length > 0
        ) {
          const reportsTotal = props.reports;
          data.push([
            {
              value: t("total"),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: "",
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: "",
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].interactions),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].jobCount),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].totalc),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].fulltime),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].parttime),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].contract),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].internship),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].seasonal),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].totalCandid),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].revenue),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
          ]);
        }
      } else {
        /**Populate excel data if HT admin agencies */
        props.reports &&
          props.reports.data.forEach(function (org) {
            data.push([
              {
                value: org.SLNo,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: org.name,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: org.deptCount,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: org.currentPosting,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: org.jobCount || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: org.fulltime || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.parttime || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.contract || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.internship || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.seasonal || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                value: org.applnCount || 0,
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                value: parseInt(org.revenue),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
            ]);
          });
        if (
          props.reports &&
          props.reports.total &&
          props.reports.total.length > 0
        ) {
          const reportsTotal = props.reports;
          data.push([
            {
              value: t("total"),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: "",
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].deptCount),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].currentPosting),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].jobCount),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].fulltime),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].parttime),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].contract),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].internship),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].seasonal),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].applnCount) || 0,
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
            {
              value: parseInt(reportsTotal.total[0].revenue),
              style: {
                font: { bold: true },
                border: {
                  top: { style: "medium" },
                  bottom: { style: "medium" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
              },
            },
          ]);
        }
      }
      setExcelData(data);
      setReportsSummary(summary);
    }
  }, [props.reports]);
  let multiDataSet = null;
  // eslint-disable-next-line no-lone-blocks
  {
    isRoleAdmin(roles) /**Initialize excel data columns if admin */
      ? (multiDataSet = [
          {
            columns: [
              {
                title: "",
                /**Specify the preferred style elements with the supported cell style properties
                 *https://www.npmjs.com/package/react-data-export
                 */
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("agency.candidate"),
                style: {
                  font: { sz: "12", bold: true },
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
            ],
            data:
              "" /**Specify data as null if no data comes under the specified header */,
          },
          /**Additional column tag can be added if neccessary */
          {
            columns: [
              {
                title: t("slno"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("data.department"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("agency.jobpostings"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("agency.current"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("total"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("fulltime"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("parttime"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("contractors"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("internship"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("seasonal"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title:
                  t("status.billing") + "(" + t("common:currencySymbol") + ")",
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
            ],
            data: excelData,
          },
          /**Additional column tag can be added if neccessary */
          {
            ySteps: 5 /**To specify horizontal spacing between a set of datas */,

            columns: [
              {
                title: t("hrManager"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("common:jobID"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("common:jobTitle"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("data.department"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
            ],
            data: reportsSummary,
          },
        ])
      : isRoleAgencyAdmin(
          roles
        ) /**Initialize excel data columns if agency admin */
      ? (multiDataSet = [
          {
            columns: [
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("admin.candidateSubmissions"),
                style: {
                  font: { sz: "12", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                },
              },
            ],
            data: "",
          },
          {
            columns: [
              {
                title: t("slno"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("admin.employer"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("agency.jobpostings"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("agency.current"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("total"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("fulltime"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("parttime"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("contractors"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("internship"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("seasonal"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title:
                  t("status.billing") + "(" + t("common:currencySymbol") + ")",
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
            ],
            data: excelData,
          },
          {
            ySteps: 5,
            columns: [
              {
                title: t("admin.employer"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("common:jobID"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("common:jobTitle"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("ofcandidatesSubmitted"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                  alignment: { wrapText: true },
                  fill: { patternType: "solid", fgColor: { rgb: "e6f6fc" } },
                },
              },
            ],
            data: reportsSummary,
          },
        ])
      : isRoleSuperUserAdmin(roles) &&
        props.isSuperAdminAgency /**Initialize excel data columns if HT admin and HT agency admin */
      ? (multiDataSet = [
          {
            columns: [
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("admin.candidateSubmissions"),
                style: {
                  font: { sz: "12", bold: true },
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
            ],
            data: "",
          },
          {
            columns: [
              {
                title: t("slno"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("agency.agency"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("agency.current"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("agency.employerinteractions"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("agency.jobpostings"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("total"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("fulltime"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("parttime"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("contractors"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("internship"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("seasonal"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("ofcandidates"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("revenue") + "(" + t("common:currencySymbol") + ")",
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
            ],
            data: excelData,
          },
        ])
      : (multiDataSet = [
          /**Initialize excel data columns if HT admin */
          {
            columns: [
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: t("admin.alljobpostings"),
                style: {
                  font: { sz: "12", bold: true },
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  fill: { fgColor: { rgb: "e6f6fc" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
              {
                title: "",
                style: {
                  border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  fill: { patternType: "solid", fgColor: { rgb: "ffffff" } },
                },
              },
            ],
            data: "",
          },
          {
            columns: [
              {
                title: t("slno"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("admin.employer"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("admin.#ofdepartments"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("admin.currentJobPostings"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("total"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("fulltime"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("parttime"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("contractors"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("internship"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("seasonal"),
                style: {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "11", bold: true },
                  fill: { patternType: "solid", fgColor: { rgb: "f0f0f0" } },
                },
              },
              {
                title: t("ofcandidates"),
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
              {
                title: t("revenue") + "(" + t("common:currencySymbol") + ")",
                style: {
                  border: {
                    bottom: { style: "medium" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                  },
                  font: { sz: "12", bold: true },
                },
              },
            ],
            data: excelData,
          },
        ]);
  }
  return (
    <div>
      <ExcelFile
        filename={"reports"} /**Specify the file name for the excel */
        element={
          <img
            title={t("exportToExcel")}
            className={classes.excelIcon}
            src={IconExcel}
            alt=""
          />
        }
      >
        <ExcelSheet
          dataSet={multiDataSet} /**Pass the built data to the excel sheet */
          name="Organization"
        />
      </ExcelFile>
    </div>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state) => ({});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Excel))
);
