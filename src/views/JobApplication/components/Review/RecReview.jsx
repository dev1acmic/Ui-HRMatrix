import React, { useState, useEffect, forwardRef } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import moment from "moment";
// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
  GradeOutlined,
  MonetizationOnOutlined,
  AssignmentIndOutlined,
  AssignmentInd,
  CenterFocusStrong,
  Business,
  Done,
  Clear,
  Flag,
  CardMembership,
  ExitToApp,
  WorkOutlineOutlined,
  ImportantDevicesOutlined,
  CalendarTodayOutlined,
  SchoolOutlined,
  ClassOutlined,
  ForumOutlined,
  MailOutline,
  Phone,
  PinDrop,
  FlightTakeoff,
} from "@material-ui/icons";
import {
  Grid,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Fade,
} from "@material-ui/core";
import { Competency } from "util/enum";
import { useTranslation } from "react-i18next";
// Component styles
import styles from "../../../JobPost/components/styles";

import { Month } from "util/enum";
import { formatCurrency } from "util/helper";
import { getJobPost } from "services/jobPost/action";
import { loadStates } from "services/jobApplication/action";
import { Roles } from "util/enum";

const RecView = forwardRef((props) => {
  const reviewState = {
    values: {
      role: 0,
      companyLabel: "",
      companyName: "NA",
      jobTitle: "NA",
      jobId: "NA",
      candidName: "NA",
      email: "NA",
      phone: "NA",
      state: "NA",
      country: "NA",
      currentJob: "NA",
      exp: "NA",
      payRate: "NA",
      availDate: "NA",
      isVet: false,
      workAuth: false,
      reloc: false,
      travelPerc: "NA",
      competency: [],
      education: [],
      certification: [],
      prescreening: [],
      employer: [],
    },
  };
  let [values, setValues] = useState(reviewState.values);
  const { t } = useTranslation(["jobApplication", "common", "enum"]);
  function mergeByKey(a, b) {
    let merged = [];

    for (let i = 0; i < a.length; i++) {
      merged.push(Object.assign(a[i], b[i]));
    }
    return merged;
  }

  function checkAvailability(arr, val) {
    return arr.some(function (arrVal) {
      if (val === arrVal["jobscreeningqtnId"]) {
        return true;
      } else {
        return false;
      }
    });
  }

  useEffect(() => {
    props.loadStates();
  }, []);

  useEffect(() => {
    if (props.jobApplication) {
      let data = {};
      const det = props.jobApplication;
      data.id = props.jobApplication.id;
      data.candidName = det.fname ? det.fname + " " + det.lname : "NA";
      data.email = det.email || "NA";
      data.phone = det.phone ? formatPhoneNumber(det.phone) : "NA";
      let allstates = props.states;
      const selState = allstates && allstates.find((c) => c.code === det.state);
      data.state = (selState && selState.name) || "NA";
      data.country = det.country || "NA";
      data.currentJob = det.currJob || "NA";
      data.exp = det.exp ? det.exp + " years" : "NA";
      data.payRate = det.payRate
        ? t("common:currencySymbol") + formatCurrency(det.payRate)
        : "NA";
      data.availDate = det.availDate
        ? moment(values.endDate).format("L")
        : "NA";
      data.isVet = det.armyVet || false;
      data.workAuth = det.workAuth || false;
      data.reloc = det.relocate || false;
      data.travelPerc = det.travelPrc || "NA";

      if (det.jobapplicantcerts && det.jobapplicantcerts.length > 0) {
        data.certification = det.jobapplicantcerts;
      }

      if (det.jobapplicantedus) {
        data.education = det.jobapplicantedus;
      }
      if (det.jobapplicantemployers) {
        data.employer = det.jobapplicantemployers;
      }
      if (det.jobscreeningchoices) {
        let questns = [];
        for (var i = 0; i <= det.jobscreeningchoices.length - 1; i++) {
          if (questns.length > 0) {
            const found = checkAvailability(
              questns,
              det.jobscreeningchoices[i].jobscreeningqtnId
            );
            if (!found) {
              questns.push({
                jobscreeningqtnId: det.jobscreeningchoices[i].jobscreeningqtnId,
                question: det.jobscreeningchoices[i].jobscreeningqtn.question,
                answer: det.jobscreeningchoices[i].choice,
              });
            } else {
              questns.map((item) => {
                if (
                  item.jobscreeningqtnId ===
                  det.jobscreeningchoices[i].jobscreeningqtnId
                ) {
                  item.answer = item.answer.concat(
                    ",",
                    det.jobscreeningchoices[i].choice
                  );
                }
              });
            }
          } else {
            questns.push({
              jobscreeningqtnId: det.jobscreeningchoices[i].jobscreeningqtnId,
              question: det.jobscreeningchoices[i].jobscreeningqtn.question,
              answer: det.jobscreeningchoices[i].choice,
            });
          }
        }
        data.prescreening = questns;
      }
      if (det.jobskills) {
        data.competency = det.jobskills;
      }
      setValues(data);
    }
  }, [props.jobApplication]);

  useEffect(() => {
    if (props.jobPost) {
      let jobId = props.jobPost.uniqueId || "NA";
      let jobTitle = props.jobPost.title || "NA";
      let certification, companyLabel, companyName;
      certification = props.jobPost.jobcertifications
        ? props.jobPost.jobcertifications
        : null;
      if (props.jobApplication && props.jobApplication.jobapplicantcerts) {
        certification = mergeByKey(
          props.jobApplication.jobapplicantcerts,
          props.jobPost.jobcertifications
        );
      }

      const role = props.profile.roles ? props.profile.roles[0] : null;
      if (role) {
        if (role.id === Roles.Recruiter || role.id === Roles.AgencyAdmin) {
          companyName = props.organization ? props.organization.name : "NA";
          companyLabel = t("requestedBy");
        } else {
          let jobApplication = props.jobApplication;
          let jobPost =
            jobApplication &&
            jobApplication.jobpost &&
            jobApplication.jobpost.user
              ? jobApplication.jobpost.user
              : null;
          companyName = jobPost ? jobPost.fname + " " + jobPost.lname : "";
          companyLabel = t("createdby");
        }
      }

      setValues({
        ...values,
        jobId: jobId,
        jobTitle: jobTitle,
        certification: certification,
        companyName: companyName,
        companyLabel: companyLabel,
      });
    }
  }, [props.jobPost]);

  useEffect(() => {
    if (props.jobApplication) {
      const jobId = props.jobApplication
        ? props.jobApplication.jobpostId
        : null;
      if (jobId) {
        props.getJobPost(jobId);
      }
    }
  }, [props.jobApplication]);

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return null;
  }

  const { classes } = props;
  return (
    <Fade in="true" timeout="10">
      <Grid container spacing={3}>
        <Grid
          container
          item
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Grid
            item
            xs={12}
            sm={4}
            className={classes.paperTwoCol}
            style={{ borderRight: "1px solid #DFE3E8" }}
          >
            <Business
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.companyName}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {values.companyLabel}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            className={classes.paperTwoCol}
            style={{ borderRight: "1px solid #DFE3E8" }}
          >
            <CenterFocusStrong
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.jobTitle}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:jobTitle")}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            className={classes.paperTwoCol}
            style={{ borderRight: "1px solid #DFE3E8" }}
          >
            <AssignmentInd
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.jobId}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:jobID")}
              </Typography>
            </div>
          </Grid>
        </Grid>

        <Grid
          container
          item
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Grid
            item
            xs={12}
            sm={4}
            className={classes.paperTwoCol}
            style={{ borderRight: "1px solid #DFE3E8" }}
          >
            <AssignmentIndOutlined
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.candidName}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:name")}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            className={classes.paperTwoCol}
            style={{ borderRight: "1px solid #DFE3E8" }}
          >
            <MailOutline
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.email}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:email")}
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            className={classes.paperTwoCol}
            style={{ borderRight: "1px solid #DFE3E8" }}
          >
            <Phone
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.phone}
              </Typography>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.state},{values.country}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
              {t("contactInfo")}
              </Typography>
            </div>
          </Grid>
          {/* <Grid item xs={12} sm={3} className={classes.paperTwoCol}>
            <PinDrop
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.state},{values.country}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:state")},{t("common:country")}
              </Typography>
            </div>
          </Grid> */}
        </Grid>
        <br />
        <Grid
          container
          item
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Grid
            item
            xs={6}
            sm={3}
            md={3}
            style={{ borderRight: "1px solid #DFE3E8" }}
            className={classes.paperTwoCol}
          >
            <WorkOutlineOutlined
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.currentJob}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("competency.currentJob")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </div>
          </Grid>

          <Grid
            item
            xs={6}
            sm={3}
            md={3}
            style={{ borderRight: "1px solid #DFE3E8" }}
            className={classes.paperTwoCol}
          >
            <ImportantDevicesOutlined
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.exp}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("competency.experience")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </div>
          </Grid>

          <Grid
            item
            xs={6}
            sm={3}
            md={3}
            style={{ borderRight: "1px solid #DFE3E8" }}
            className={classes.paperTwoCol}
          >
            <MonetizationOnOutlined
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.payRate} ({values.payType === 1 ? "$/annum" : "$/hr"})
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:expectedcompensation")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </div>
          </Grid>

          <Grid item xs={6} sm={3} md={3} className={classes.paperTwoCol}>
            <CalendarTodayOutlined
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.availDate}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:availableOn")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </div>
          </Grid>
        </Grid>

        <br />
        <Grid
          container
          item
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Grid
            item
            xs={6}
            sm={3}
            md={3}
            style={{ borderRight: "1px solid #DFE3E8" }}
            className={classes.paperTwoCol}
          >
            <Flag
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.isVet ? (
                  <Done color="secondary" />
                ) : (
                  <Clear color="error" />
                )}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("isVeteran")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </div>
          </Grid>

          <Grid
            item
            xs={6}
            sm={3}
            md={3}
            style={{ borderRight: "1px solid #DFE3E8" }}
            className={classes.paperTwoCol}
          >
            <CardMembership
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.workAuth ? (
                  <Done color="secondary" />
                ) : (
                  <Clear color="error" />
                )}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:workauthorization")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </div>
          </Grid>

          <Grid
            item
            xs={6}
            sm={3}
            md={3}
            style={{ borderRight: "1px solid #DFE3E8" }}
            className={classes.paperTwoCol}
          >
            <ExitToApp
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.reloc ? (
                  <Done color="secondary" />
                ) : (
                  <Clear color="error" />
                )}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:willingtorelocate")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </div>
          </Grid>

          <Grid item xs={6} sm={3} md={3} className={classes.paperTwoCol}>
            <FlightTakeoff
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.travelPerc}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("competency.travelPerc")}
              </Typography>
              <Divider className={classes.dividerVer} />
            </div>
          </Grid>
        </Grid>

        <br />
        <Grid
          container
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Typography
            variant="h3"
            className={classes.reviewTitle}
            style={{ padding: "20px 0px 0 22px" }}
          >
            <GradeOutlined color="secondary" className={classes.titleIcon} />{" "}
            {t("competency.competency")}
          </Typography>
          <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
            <Table className={classes.tableReview}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.firstCol}>
                    {t("competency.skillToolDomain")}
                  </TableCell>

                  <TableCell align="center">
                    {t("competency.mandatory")}?
                  </TableCell>
                  <TableCell align="center">
                    {t("competency.experience")}
                  </TableCell>
                  <TableCell align="center">
                    {t("competency.competency")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!values.competency || values.competency.length === 0 ? (
                  <TableRow>
                    <TableCell>{t("common:noDataAvailable")}</TableCell>
                  </TableRow>
                ) : (
                  values.competency.map((item) => (
                    <TableRow>
                      <TableCell className={classes.firstCol}>
                        {item.skill ? item.skill.name : "NA"}
                      </TableCell>

                      <TableCell align="center">
                        {item.mandatory ? (
                          <Done color="secondary" />
                        ) : (
                          <Clear color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {item.jobapplicantskills && item.jobapplicantskills.exp
                          ? item.jobapplicantskills.exp + " years"
                          : "NA"}
                      </TableCell>
                      <TableCell align="center">
                        {item.jobapplicantskills &&
                        item.jobapplicantskills.competency
                          ? t(
                              `${Competency.getNameByValue(
                                parseInt(item.jobapplicantskills.competency)
                              )}`
                            )
                          : "--"}{" "}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        </Grid>
        <br />

        <Grid
          container
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Typography
            variant="h3"
            className={classes.reviewTitle}
            style={{ padding: "20px 0px 0 22px" }}
          >
            <SchoolOutlined color="secondary" className={classes.titleIcon} />{" "}
            {t("competency.education")}
          </Typography>
          <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
            <Table className={classes.tableReview}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.firstCol}>
                    {t("competency.educationalQualification")}
                  </TableCell>

                  <TableCell align="center">
                    {" "}
                    {t("competency.additionalInfo")}
                  </TableCell>
                  <TableCell align="center">
                    {t("competency.schoolInstitution")}
                  </TableCell>
                  <TableCell align="center">{t("competency.year")}</TableCell>
                  <TableCell align="center">{t("competency.gpa")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!values.education || values.education.length === 0 ? (
                  <TableRow>
                    <TableCell>{t("common:noDataAvailable")}</TableCell>
                  </TableRow>
                ) : (
                  values.education.map((item) => (
                    <TableRow>
                      <TableCell className={classes.firstCol}>
                        {item.qualification}
                      </TableCell>

                      <TableCell align="center">
                        {" "}
                        {item.additionalInfo}
                      </TableCell>
                      <TableCell align="center">{item.institution}</TableCell>
                      <TableCell align="center">{item.year}</TableCell>
                      <TableCell align="center">{item.gpa}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        </Grid>
        <br />

        <Grid
          container
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Typography
            variant="h3"
            className={classes.reviewTitle}
            style={{ padding: "20px 0px 0 22px" }}
          >
            <ClassOutlined color="secondary" className={classes.titleIcon} />{" "}
            {t("competency.certifications")}
          </Typography>
          <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
            <Table className={classes.tableReview}>
              <TableHead>
                <TableRow>
                  <TableCell>{t("competency.certification")}</TableCell>
                  <TableCell align="center">
                    {t("competency.mandatory")}
                  </TableCell>
                  <TableCell align="center">
                    {t("competency.available")}
                  </TableCell>
                  <TableCell align="center">
                    {t("competency.yearofCertification")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!values.certification || values.certification.length === 0 ? (
                  <TableRow>
                    <TableCell>{t("common:noDataAvailable")}</TableCell>
                  </TableRow>
                ) : (
                  values.certification.map((item) => (
                    <TableRow>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="center">
                        {item.mandatory ? (
                          <Done color="secondary" />
                        ) : (
                          <Clear color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {item.has ? (
                          <Done color="secondary" />
                        ) : (
                          <Clear color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">{item.year}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        </Grid>
        <br />

        <Grid
          container
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Typography
            variant="h3"
            className={classes.reviewTitle}
            style={{ padding: "20px 0px 0 22px" }}
          >
            <ForumOutlined color="secondary" className={classes.titleIcon} />{" "}
            {t("common:screeningquestions")}
          </Typography>
          <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
            <Table className={classes.tableReview}>
              <TableHead>
                <TableRow>
                  <TableCell>{t("question")}</TableCell>
                  <TableCell align="left">{t("answer")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!values.prescreening || values.prescreening.length === 0 ? (
                  <TableRow>
                    <TableCell>{t("common:noDataAvailable")}</TableCell>
                  </TableRow>
                ) : (
                  values.prescreening.map((item) => (
                    <TableRow>
                      <TableCell>{item.question}</TableCell>
                      <TableCell>{item.answer}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        </Grid>
        <br />
        <Grid
          container
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Typography
            variant="h3"
            className={classes.reviewTitle}
            style={{ padding: "20px 0px 0 22px" }}
          >
            <SchoolOutlined color="secondary" className={classes.titleIcon} />{" "}
            {t("competency.employmentHistory")}
          </Typography>
          <PerfectScrollbar style={{ width: "100%", height: "auto" }}>
            <Table className={classes.tableReview}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.firstCol}>
                    {t("competency.company")}
                  </TableCell>
                  <TableCell align="center">{t("competency.title")}</TableCell>
                  <TableCell align="center">
                    {t("competency.startDate")}
                  </TableCell>
                  <TableCell align="center">
                    {t("competency.endDate")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!values.employer || values.employer.length === 0 ? (
                  <TableRow>
                    <TableCell>{t("common:noDataAvailable")}</TableCell>
                  </TableRow>
                ) : (
                  values.employer.map((item) => (
                    <TableRow>
                      <TableCell className={classes.firstCol}>
                        {item.company}
                      </TableCell>

                      <TableCell align="center">{item.title}</TableCell>
                      <TableCell align="center">
                        {item.strtMonth
                          ? t(
                              `${Month.getNameByValue(
                                item.strtMonth.toString()
                              )}`
                            ) +
                            " / " +
                            item.strtYear
                          : ""}
                      </TableCell>
                      <TableCell align="center">
                        {item.endMonth
                          ? t(
                              `${Month.getNameByValue(
                                item.endMonth.toString()
                              )}`
                            ) +
                            " / " +
                            item.endYear
                          : ""}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        </Grid>

        <br />
      </Grid>
    </Fade>
  );
});

const mapDispatchToProps = { getJobPost: getJobPost, loadStates };
const mapStateToProps = (state) => ({
  organization:
    (state.jobPost &&
      state.jobPost.data &&
      state.jobPost.data.user &&
      state.jobPost.data.user.organization) ||
    null,
  jobPost: (state.jobPost && state.jobPost.data) || null,
  jobApplication: (state.jobApplication && state.jobApplication.data) || null,
  profile: state.profile,
  states: state.admin && state.admin.states,
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(withStyles(styles)(RecView));
