import React from "react";

// Material helpers
import { withStyles } from "@material-ui/core";
import flag from "assets/images/flag_us.png";
import { formatCurrency } from "util/helper";
import { ProfilePic } from "util/ProfilePic";
import moment from "moment";
import { useTranslation } from "react-i18next";

// Material components
import { Grid, Box, Typography, List, ListItem } from "@material-ui/core";
import {
  DoneOutlined,
  ClearOutlined,
  CompareArrowsOutlined,
} from "@material-ui/icons";
import ReactSpeedometer from "react-d3-speedometer";
import { BarChart } from "../../components/";
// Component styles
import styles from "./styles";

const PrintHeader = (props) => {
  const { t } = useTranslation(["reports", "common"]);
  const { classes, applicant } = props;

  const renderHTML = (markup) => {
    return (
      <div
        style={{
          fontFamily: "Roboto",
          fontSize: 11,
        }}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  };

  return (
    <div>
      <Grid container className={classes.topBarWrap}>
        <Grid item spacing="0" xs={8} className={classes.topBarCol1}>
          <ProfilePic
            id={applicant.avatarId}
            className={classes.candidateAvatar}
            getFile={props.getFile}
          />

          <List className={classes.headRight}>
            <ListItem style={{ padding: 0 }}>
              <Typography variant="h1" className={classes.candidateName}>
                {applicant.fname} {applicant.lname}
              </Typography>
            </ListItem>
            <ListItem style={{ padding: 0 }}>
              <Typography variant="body1" className={classes.candidateLocation}>
                <img src={flag} alt="US" className={classes.candidateFlag} />{" "}
                {applicant.country}
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item spacing="0" xs={4} className={classes.topBarCol2}>
          <Box className={classes.gaugeWrap}>
            <Box className={classes.gauge1}>
              <Typography variant="h5" className={classes.topBarCol1Head}>
                {t("common:overallscore")}
              </Typography>
              <Typography className={classes.dialChartLegend}>
                {applicant.overAllScore + "%"}
              </Typography>
              <ReactSpeedometer
                maxValue={100}
                value={applicant.overAllScore}
                needleColor={"#545454"}
                startColor="red"
                endColor="green"
                segments={3}
                segmentColors={["#FF725F", "#F9D052", "#75D49B"]}
                width={100}
                height={60}
                ringWidth={3}
                needleHeightRatio={0.7}
                textColor={"rgba(255,255,255,0)"}
              />
            </Box>
            <Box className={classes.gauge2}>
              <Typography variant="h5" className={classes.topBarCol1Head}>
                {t("common:enthusiasmtojoin")}
              </Typography>
              <Typography className={classes.dialChartLegend}>
                {applicant.enthusiasmPerc ? applicant.enthusiasmPerc + "%" : 0}
              </Typography>
              <ReactSpeedometer
                maxValue={100}
                value={applicant.enthusiasmPerc || 0}
                needleColor={"#545454"}
                startColor="red"
                endColor="green"
                segments={3}
                segmentColors={["#FF725F", "#F9D052", "#75D49B"]}
                width={100}
                height={60}
                ringWidth={3}
                needleHeightRatio={0.7}
                textColor={"rgba(255,255,255,0)"}
              />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          spacing="0"
          xs={4}
          className={classes.topBarColLeft}
          // style={{
          //   borderTop: "1px solid #e4e4e4",
          //   marginTop: 10,
          //   marginBottom: -10
          // }}
        >
          <Typography variant="h5" className={classes.topBarCol1Head}>
            {t("common:recruitingagency")}
          </Typography>
          <Typography variant="h5" className={classes.topBarCol1SubHead}>
            {applicant.user &&
              applicant.user.organization &&
              applicant.user.organization.name}
          </Typography>
          {applicant.summary && (
            <React.Fragment>
              <Typography variant="h5" className={classes.topBarCol1Head}>
                {t("summary")}
              </Typography>
              <Typography variant="body2" className={classes.topBarColSmry}>
                {renderHTML(applicant.summary)}
              </Typography>
            </React.Fragment>
          )}

          <Grid container className={classes.col3Wrap}>
            <Grid item xs={6}>
              <Typography variant="h5" className={classes.topBarCol1Head}>
                {t("common:totalexperience")}
              </Typography>
              <Typography variant="body2">{applicant.exp} Years</Typography>

              <Typography variant="h5" className={classes.topBarCol1Head}>
                {t("common:availableOn")}
              </Typography>
              <Typography variant="body2">
                {" "}
                {applicant.availDate
                  ? moment(applicant.availDate).format("L")
                  : "Not selected"}
              </Typography>
              <Typography variant="h5" className={classes.topBarCol1Head}>
                {t("common:workauthorization")}
              </Typography>
              {applicant.workAuth ? (
                <DoneOutlined style={{ color: "#75d49b" }} />
              ) : (
                <ClearOutlined style={{ color: "#ff725f" }} />
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" className={classes.topBarCol1Head}>
                {t("currentJob")}
              </Typography>
              <Typography variant="body2">{applicant.currJob}</Typography>

              <Typography variant="h5" className={classes.topBarCol1Head}>
                {t("common:compensation")}
              </Typography>
              <Typography variant="body2">
                {" "}
                {applicant.payRate
                  ? t("common:currencySymbol") +
                    formatCurrency(applicant.payRate)
                  : t("common:noDataAvailable")}
              </Typography>
              <Typography
                variant="h5"
                className={classes.topBarCol1Head}
                style={{ whiteSpace: "nowrap" }}
              >
                {t("common:willingnesstorelocate")}
              </Typography>
              {applicant.relocate ? (
                <DoneOutlined style={{ color: "#75d49b" }} />
              ) : (
                <ClearOutlined style={{ color: "#ff725f" }} />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          spacing="0"
          xs={8}
          className={classes.topBarCol3}
          // style={{
          //   borderTop: "1px solid #e4e4e4",
          //   marginTop: 10,
          //   marginBottom: -10
          // }}
        >
          <Box
            className={classes.comparisonWrap}
            style={{ border: "none", boxShadow: "none" }}
          >
            <Typography
              variant="h2"
              className={classes.heading}
              style={{ marginBottom: 5 }}
            >
              <CompareArrowsOutlined />{" "}
              {t("common:skillsrequirementvsactualexperience")}
            </Typography>

            <BarChart
              applicantSkills={applicant.skills}
              exp={applicant.exp}
              isPrint={true}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(PrintHeader);
