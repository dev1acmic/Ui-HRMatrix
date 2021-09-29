import React, { useState, Suspense } from "react";
import {
  Container,
  Grid,
  Box,
  withStyles,
  Typography,
} from "@material-ui/core";

// Material helpers

import Funnel from "./Funnel_en";
import Bar from "./Bar";

import {
  FeaturedPlayListOutlined,
  FilterListOutlined,
  GpsFixedOutlined,
} from "@material-ui/icons";

import styles from "../style";
import { useTranslation } from "react-i18next";

const Analytics = (props) => {
  const { classes, summary } = props;
  const { t, i18n } = useTranslation("dashboard");
  const { selected, setSelected } = useState(1);
  const { selected1, setSelected1 } = useState(1);
  const Funnel = React.lazy(() => import(`./Funnel_${i18n.language}`));

  const handleChange = (value) => {
    setSelected(value);
  };
  const handleChange1 = (value) => {
    setSelected1(value);
  };

  if (summary) {
    return (
      <Container
        className={classes.root}
        style={{ paddingBottom: 0, paddingTop: 0 }}
      >
        <Grid
          container
          className={classes.analyticsWrap}
          style={{ borderColor: "#FB6E5A" }}
        >
          <Box className={classes.analyticsHeadWrap}>
            <Box className={classes.trackBarLeft}>
              <FeaturedPlayListOutlined className={classes.trackBarIcon} />
              <Typography variant="h2" className={classes.trackBarTitle}>
                {t("analytics.hiringProcessAnalytics")}
              </Typography>
            </Box>
            {/* <Box className={classes.trackBarRight}>
              <Box className={classes.searchWrap}>
                <Select
                  disableUnderline="true"
                  value={selected1}
                  MenuProps={{
                    classes: {
                      list: classes.inlineSelectDrpdwn
                    }
                  }}
                  onChange={event => handleChange1(event.target.value)}
                  inputProps={{
                    name: 'type',
                    id: 'type'
                  }}
                  className={classes.inlineSelect}>
                  <MenuItem selected value={1}>
                    All
                  </MenuItem>
                  <MenuItem value={20}>Monthly</MenuItem>
                  <MenuItem value={30}>Quarterly</MenuItem>
                  <MenuItem value={40}>Annually</MenuItem>
                  <MenuItem value={40}>Custom</MenuItem>
                  <MenuItem>
                    <TextField
                      id="outlined-dense-multiline"
                      margin="dense"
                      variant="outlined"
                      placeholder="Start Date"
                      className={classes.dateInput}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment>
                            <CalendarToday style={{ height: 16, width: 16 }} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <Typography style={{ padding: 5 }}> - </Typography>
                    <TextField
                      id="outlined-dense-multiline"
                      margin="dense"
                      variant="outlined"
                      className={classes.dateInput}
                      placeholder="End Date"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment>
                            <CalendarToday style={{ height: 16, width: 16 }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </MenuItem>
                </Select>
              </Box>
            </Box> */}
          </Box>
          <Box className={classes.chartWrap}>
            <Box className={classes.chartLeft}>
              <Box className={classes.titleWrap}>
                <FilterListOutlined />
                <Typography variant="h2">
                  {t("analytics.funnel.recruitmentFunnel")}
                </Typography>
              </Box>
              <Suspense fallback={<div>Loading...</div>}>
                <Funnel summary={summary} />
              </Suspense>
            </Box>
            <Box className={classes.chartRight}>
              <Box className={classes.titleWrap}>
                <GpsFixedOutlined />
                <Typography variant="h2">
                  {t("analytics.bar.averageHiringPeriod")}
                </Typography>
                <Box className={classes.counter}>
                  {((summary.profileSourcing && summary.profileSourcing.days) ||
                    0) +
                    ((summary.profileReview && summary.profileReview.days) ||
                      0) +
                    ((summary.applicantInterview &&
                      summary.applicantInterview.days) ||
                      0) +
                    ((summary.applicantSelected &&
                      summary.applicantSelected.days) ||
                      0)}
                  <Typography variant="body1">
                    {t("analytics.bar.days")}
                  </Typography>
                </Box>
              </Box>
              <Bar summary={summary} />
            </Box>
          </Box>
        </Grid>
      </Container>
    );
  }
};

export default withStyles(styles)(Analytics);
