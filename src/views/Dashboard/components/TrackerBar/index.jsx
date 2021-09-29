import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  withStyles,
  Typography,
  Select,
  MenuItem,
  InputBase,
  IconButton,
  RadioGroup,
} from "@material-ui/core";
import moment from "moment";
import { FeaturedPlayListOutlined, SearchOutlined } from "@material-ui/icons";
import MessageBox from "util/messageBox";

import { Roles, Types } from "util/enum";
import styles from "../style";
import { useTranslation } from "react-i18next";

const Info = (props) => {
  const { classes, role, type, isSearch } = props;
  const { t } = useTranslation(["dashboard", "common"]);
  const [sortKey, setSortKey] = useState(0);
  const [search, setSearch] = useState({ key: "all", value: "" });
  const [dateError, setDateError] = useState(false);
  const key = t("trackerBar.pendingSubmission");

  const handleInputChange = (value) => {
    setSearch({ ...search, value: value });
  };

  const handleSearch = (value) => {
    if (search.value && search.value !== "") {
      if (search.key === "createdAt") {
        const dateIsValid = moment(search.value, "MM/DD/YYYY", true).isValid();
        if (dateIsValid) {
          props.onChange(sortKey, search.key, search.value);
        } else {
          setDateError(true);
        }
      } else {
        props.onChange(sortKey, search.key, search.value);
      }
    }
  };

  const handleChange = (type, value) => {
    if (type === "sort") {
      setSortKey(value);
      props.onChange(value, search.key, search.value);
    } else if (type === "searchKey") {
      setSearch({ ...search, key: value });
      if (value === "all") {
        setSearch({ key: value, value: "" });
        props.onChange(sortKey, "", "");
      } else {
        setSearch({ key: value, value: "" });
      }
    } else if (type === "searchValue") {
      setSearch({ ...search, value: value });
    }
  };

  return (
    <Container
      className={classes.root}
      style={{ paddingBottom: 0, paddingTop: 20 }}
    >
      <Grid
        container
        className={classes.trackBarWrap}
        style={{ borderColor: "#FB6E5A" }}
      >
        <Box className={classes.trackBarLeft}>
          <FeaturedPlayListOutlined className={classes.trackBarIcon} />
          <Typography variant="h2" className={classes.trackBarTitle}>
            {isSearch
              ? t("trackerBar.searchJobs")
              : t("trackerBar.jobsTracker")}
          </Typography>
          {type !== Types.Recruiter && role !== Roles.InterviewPanel ? (
            <Box className={classes.legendWrap}>
              <Box className={classes.legendItem}>
                <span className={classes.trackBarLegend}></span>
                <Typography className={classes.legendText}>
                  {t("trackerBar.pendingSubmission")}
                  {/* {key.replace(/\n/g, "<br />").join("")} */}
                </Typography>
              </Box>

              <Box className={classes.legendItem}>
                <span
                  className={classes.trackBarLegend}
                  style={{ backgroundColor: "#FBB357" }}
                ></span>
                <Typography className={classes.legendText}>
                  {t("trackerBar.pendingReview")}
                </Typography>
              </Box>

              <Box className={classes.legendItem}>
                <span
                  className={classes.trackBarLegend}
                  style={{ backgroundColor: "#58C897" }}
                ></span>
                <Typography className={classes.legendText}>
                  {t("trackerBar.onTrack")}
                </Typography>
              </Box>
              <Box className={classes.legendItem}>
                <span
                  className={classes.trackBarLegend}
                  style={{ backgroundColor: "#FB6E5A" }}
                ></span>
                <Typography className={classes.legendText}>
                  {t("summary.needAttention")}
                </Typography>
              </Box>

              <Box className={classes.legendItem}>
                <span
                  className={classes.trackBarLegend}
                  style={{ backgroundColor: "#0560ec" }}
                ></span>
                <Typography className={classes.legendText}>
                  {t("trackerBar.closed")}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box className={classes.legendWrap}>
              <Box className={classes.legendItem}>
                <span
                  className={classes.trackBarLegend}
                  style={{ backgroundColor: "#58C897" }}
                ></span>
                <Typography className={classes.legendText}>
                  {t("summary.open")}
                </Typography>
              </Box>
              <Box className={classes.legendItem}>
                <span
                  className={classes.trackBarLegend}
                  style={{ backgroundColor: "#0560ec" }}
                ></span>
                <Typography className={classes.legendText}>
                  {" "}
                  {t("trackerBar.closed")}
                </Typography>
              </Box>
            </Box>
          )}
          {/* {type === Types.Recruiter && role === Roles.InterviewPanel && (
            } */}
        </Box>
        <Box className={classes.trackBarRight}>
          <Box className={classes.searchWrap} style={{ marginRight: 10 }}>
            <Select
              disableUnderline={true}
              value={sortKey}
              onChange={(event) => handleChange("sort", event.target.value)}
              MenuProps={{
                classes: {
                  list: classes.inlineSelectDrpdwn,
                },
              }}
              inputProps={{
                name: "type",
                id: "type",
              }}
              className={classes.inlineSelect}
            >
              <MenuItem selected value={0}>
                {t("common:sortBy")}
              </MenuItem>
              {role === Roles.Recruiter && (
                <MenuItem value={"payRate"}>Pay Rate</MenuItem>
              )}
              <MenuItem value={"startDate"}>{t("common:startDate")}</MenuItem>
              <MenuItem value={"createdAt"}>{t("common:posteddate")}</MenuItem>
            </Select>
          </Box>

          <Box className={classes.searchWrap}>
            <Select
              disableUnderline={true}
              value={search.key}
              onChange={(event) =>
                handleChange("searchKey", event.target.value)
              }
              MenuProps={{
                classes: {
                  list: classes.inlineSelectDrpdwn,
                },
              }}
              inputProps={{
                name: "type",
                id: "type",
              }}
              className={classes.inlineSelect}
            >
              <MenuItem selected value={"all"}>
                {t("common:all")}
              </MenuItem>
              <MenuItem value={"title"}>{t("common:jobtitle")}</MenuItem>
              <MenuItem value={"uniqueId"}>{t("common:jobId")}</MenuItem>
              {/* <MenuItem value={"type"}>Job Type</MenuItem> */}
              <MenuItem value={"createdAt"}>{t("common:postedon")}</MenuItem>
              {role !== Roles.HiringManager && (
                <MenuItem value={"hiringManager"}>
                  {t("common:postedby")}
                </MenuItem>
              )}
            </Select>
            <InputBase
              placeholder={search.key === "createdAt" ? "MM/DD/YYYY" : ""}
              inputProps={{
                maxLength: search.key === "createdAt" ? 10 : 20,
              }}
              className={classes.searchInput}
              onChange={(event) => handleInputChange(event.target.value)}
              value={search.value}
            />
            <IconButton
              disabled={search.key === "all"}
              className={classes.searchBtn}
              onClick={() => handleSearch()}
            >
              <SearchOutlined />
            </IconButton>
          </Box>
        </Box>
      </Grid>
      <MessageBox
        open={dateError}
        variant="error"
        onClose={() => {
          setDateError(false);
        }}
        message={t("common:errMsg.validDate")}
      />
    </Container>
  );
};

export default withStyles(styles)(Info);
