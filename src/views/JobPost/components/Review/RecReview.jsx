import React, { useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

// Material helpers
import { withStyles, CircularProgress } from "@material-ui/core";

// Material components
import {
  GradeOutlined,
  SupervisedUserCircleOutlined,
  DescriptionOutlined,
  AssignmentIndOutlined,
  FlagOutlined,
  Done,
  Clear,
  WorkOutlineOutlined,
  PlaceOutlined,
  AssignmentOutlined,
  SchoolOutlined,
  ClassOutlined,
  ForumOutlined,
  BusinessOutlined,
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
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { JobType } from "util/enum";
import { getFullAddress } from "util/helper";

// Component styles
import styles from "../styles";
import { useTranslation } from "react-i18next";
// Actions
import { getJobPost } from "services/jobPost/action";

const RecReview = (props) => {
  const { t } = useTranslation(["jobPost", "common"]);
  const { classes } = props;
  const [values, setValues] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (props.match.params && props.match.params.jobPostId) {
      props.getJobPost(props.match.params.jobPostId);
    }
  }, [props.match.params]);

  useEffect(() => {
    if (props.jobPost) {
      setValues(props.jobPost);
      setLoading(false);
    }
  }, [props.jobPost]);

  const renderHTML = (markup) => {
    return <div dangerouslySetInnerHTML={{ __html: markup }} />;
  };

  if (loading) {
    return <CircularProgress></CircularProgress>;
  }
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
            <BusinessOutlined
              color="secondary"
              className={classes.reviewIcon}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {(values.user &&
                  values.user.organization &&
                  values.user.organization.name) ||
                  ""}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("competency.company")}
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
            <AssignmentIndOutlined
              color="secondary"
              className={classes.reviewIcon}
            />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.title}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:jobTitle")}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.paperTwoCol}>
            <FlagOutlined color="secondary" className={classes.reviewIcon} />
            <div>
              <Typography variant="h2" className={classes.reviewTitle}>
                {values.uniqueId}
              </Typography>
              <Typography variant="body1" className={classes.reviewLabel}>
                {t("common:jobID")}
              </Typography>
            </div>
          </Grid>
        </Grid>
        <br />
        <Grid
          container
          style={{ position: "relative" }}
          spacing={3}
          xs={12}
          lg={12}
          className={classes.reviewItemWrap}
        >
          <Grid
            align="center"
            item
            style={{ position: "relative" }}
            xs={6}
            sm={4}
            md={4}
          >
            <WorkOutlineOutlined
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <Typography
              variant="h3"
              fontSize="28"
              className={classes.reviewTitle}
            >
              {values.type > 0
                ? t(`${JobType.getNameByValue(values.type)}`)
                : "NA"}
            </Typography>
            <Typography variant="body1" className={classes.reviewLabel}>
              {t("jobtype")}
            </Typography>
            <Divider className={classes.dividerVer} />
          </Grid>

          <Grid
            item
            xs={6}
            sm={4}
            md={4}
            style={{ position: "relative" }}
            align="center"
          >
            <SupervisedUserCircleOutlined
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <Typography
              variant="h3"
              fontSize="28"
              className={classes.reviewTitle}
            >
              {values.position || t("common:noDataAvailable")}
            </Typography>
            <Typography variant="body1" className={classes.reviewLabel}>
              {t("ofpositions")}
            </Typography>
            <Divider className={classes.dividerVer} />
          </Grid>
          <Grid item xs={6} sm={4} md={4} align="center">
            <PlaceOutlined
              color="secondary"
              className={classes.reviewIcon}
              style={{ transform: "scale(.8)" }}
            />
            <Typography
              variant="h3"
              fontSize="28"
              color="textSecondary"
              className={classes.reviewTitle}
            >
              {values.addresses && values.addresses[0]
                ? getFullAddress(values.addresses[0])
                : "Not selected"}
            </Typography>
            <Typography variant="body1" className={classes.reviewLabel}>
              {t("location")}
            </Typography>
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
          <Typography
            variant="h3"
            className={classes.reviewTitle}
            style={{ padding: "15px 0px 0 15px" }}
          >
            <DescriptionOutlined
              color="secondary"
              className={classes.titleIcon}
            />{" "}
            {t("jobdescription")}
          </Typography>

          <Typography
            style={{ padding: 15, width: "100%" }}
            color="textSecondary"
          >
            {values.description
              ? renderHTML(values.description)
              : t("common:noDataAvailable")}
          </Typography>
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
          <Typography
            variant="h3"
            className={classes.reviewTitle}
            style={{ padding: "15px 0px 0 15px" }}
          >
            <AssignmentOutlined
              color="secondary"
              className={classes.titleIcon}
            />{" "}
            {t("jobresponsibilities")}
          </Typography>

          <Typography
            style={{ padding: 15, width: "100%" }}
            color="textSecondary"
          >
            {values.responsibility
              ? renderHTML(values.responsibility)
              : t("common:noDataAvailable")}
          </Typography>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {values.jobskills && values.jobskills.length > 0 ? (
                  values.jobskills.map((item) => {
                    return (
                      <TableRow>
                        <TableCell className={classes.firstCol}>
                          {item.name}
                        </TableCell>

                        <TableCell align="center">
                          {item.mandatory ? (
                            <Done color="secondary" />
                          ) : (
                            <Clear color="error" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>{t("common:noDataAvailable")}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        </Grid>
        <br />
        <Grid
          container
          item
          spacing={3}
          xs={12}
          lg={12}
          style={{ flexDirection: "column" }}
          className={classes.reviewItemWrap}
        >
          <br />
          <Typography
            variant="h3"
            className={classes.reviewTitle}
            style={{ padding: "0px 0px 30px 15px" }}
          >
            <SchoolOutlined color="secondary" className={classes.titleIcon} />{" "}
            {t("competency.education")}
          </Typography>
          {values.jobeduqualifications &&
          values.jobeduqualifications.length > 0 ? (
            values.jobeduqualifications.map((item) => {
              return (
                <div>
                  <Typography variant="body1" className={classes.eduTitle}>
                    {item.qualification}
                  </Typography>
                  <Typography variant="body1" className={classes.eduDesc}>
                    {item.additionalInfo}
                  </Typography>
                </div>
              );
            })
          ) : (
            <Typography>{t("common:noDataAvailable")}</Typography>
          )}
          <br />
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
                </TableRow>
              </TableHead>
              <TableBody>
                {values.jobcertifications &&
                values.jobcertifications.length > 0 ? (
                  values.jobcertifications.map((item) => {
                    return (
                      <TableRow>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="center">
                          {item.mandatory ? (
                            <Done color="secondary" />
                          ) : (
                            <Clear color="error" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>{t("common:noDataAvailable")}</TableCell>
                  </TableRow>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {values.jobscreeningqtns &&
                values.jobscreeningqtns.length > 0 ? (
                  values.jobscreeningqtns.map((item) => {
                    return (
                      <TableRow>
                        <TableCell>{item.question}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    {" "}
                    <TableCell>{t("common:noDataAvailable")}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        </Grid>
        <br />
      </Grid>
    </Fade>
  );
};

const mapDispatchToProps = {
  getJobPost: getJobPost,
};

const mapStateToProps = (state) => ({
  jobPost: (state.jobPost && state.jobPost.data) || null,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RecReview))
);
