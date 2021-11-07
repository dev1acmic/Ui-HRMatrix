import React, {useEffect, useState} from "react";

// Material helpers
import {withStyles} from "@material-ui/core";

// Material components
import {Typography, Tooltip} from "@material-ui/core";
import {
  WorkOutlineOutlined,
  CardMembershipOutlined,
  CardGiftcardOutlined,
} from "@material-ui/icons";

// Component styles
import styles from "./styles";
import {useTranslation} from "react-i18next";

const colors = [
  "#894CBD",
  "#F4522F",
  "#32A6E7",
  "#BF8053",
  "#3823B8",
  "#FFA723",
  "#537EBF",
];

const TimeLine = (props) => {
  const {classes, applicant, isPrint} = props;
  const {t} = useTranslation("common");
  const [timeline, setTimeline] = useState(null);
  useEffect(() => {
    if (applicant) {
      let certificates = [];
      /**
       * Author:Alphonsa
       * new code added to add all the certificates of the candidates */
      applicant.jobapplicantcerts &&
        applicant.jobapplicantcerts.map((a) => {
          if (a.has) {
            certificates = [...certificates, {...a}];
          }
        });
      /**
       * Commented:Alphonsa
       * old code to add job certificates of the candidate */
      // applicant.jobapplicantcerts &&
      //   applicant.jobapplicantcerts.map((a) => {
      //     applicant.jobpost &&
      //       applicant.jobpost.jobcertifications.map((b) => {
      //         if (a.jobcertificationId === b.id) {
      //           certificates = [...certificates, { ...a, ...b }];
      //         }
      //       });
      //   });

      let timeLineArr = [];

      if (applicant.jobapplicantedus) {
        const edus =
          applicant.jobapplicantedus &&
          applicant.jobapplicantedus.filter((c) => c.isAvailable === 1);
        timeLineArr = [...timeLineArr, ...edus];
      }

      if (certificates) {
        timeLineArr = [...timeLineArr, ...certificates];
      }

      if (applicant.jobapplicantemployers) {
        timeLineArr = [...timeLineArr, ...applicant.jobapplicantemployers];
      }

      let dict = [];

      timeLineArr.map((item) => {
        const year = item.year || item.strtYear;
        const index = dict.findIndex((c) => c.key === year);
        if (index === -1) {
          dict.push({
            key: year,
            value: item,
          });
        } else {
          const newData = {...dict[index].value, ...item};
          dict[index].value = newData;
        }
      });
      dict = dict.sort((a, b) => b.key - a.key);
      setTimeline(dict);
    }
  }, [applicant]);

  const getColor = (i) => {
    return colors[i % 7];
  };

  return (
    <div className={classes.treeWrap}>
      {timeline &&
        timeline.map((item, index) => (
          <div
            className={classes.treeL}
            style={{
              color: getColor(index),
              paddingBottom: isPrint && timeline.length > 5 && 25,
            }}
          >
            <Typography
              className={classes.treeLyear}
              style={{borderColor: getColor(index)}}
            >
              {item.key}
            </Typography>
            <div className={classes.treeItemWrap}>
              {item.value.company && (
                <div className={classes.treeItemSub}>
                  <Tooltip title={t("job")}>
                    <WorkOutlineOutlined
                      className={classes.treeIcon}
                      style={{color: getColor(index)}}
                    />
                  </Tooltip>
                  <Typography className={classes.treeItemHead}>
                    {item.value.company}
                  </Typography>
                  <Typography className={classes.treeItemDesc}>
                    {item.value.title}
                  </Typography>
                </div>
              )}
              {item.value.has && (
                <div className={classes.treeItemSub}>
                  <Tooltip title={t("certificate")}>
                    <CardMembershipOutlined
                      className={classes.treeIcon}
                      style={{color: getColor(index)}}
                    />
                  </Tooltip>
                  <Typography className={classes.treeItemHead}>
                    {item.value.name}
                  </Typography>
                </div>
              )}
              {item.value.qualification && (
                <div className={classes.treeItemSub}>
                  <Tooltip title={t("education")}>
                    <CardGiftcardOutlined
                      className={classes.treeIcon}
                      style={{color: getColor(index)}}
                    />
                  </Tooltip>
                  <Typography className={classes.treeItemHead}>
                    {item.value.qualification}
                  </Typography>
                  <Typography className={classes.treeItemDesc}>
                    {item.value.institution}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default withStyles(styles)(TimeLine);
