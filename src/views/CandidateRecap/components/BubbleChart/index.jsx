import React, { useEffect } from "react";

import { ResponsiveBubble, Bubble } from "@nivo/circle-packing";
import { CircularProgress } from "@material-ui/core";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { FiberManualRecordRounded } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const colors = [
  "#7B48BD",
  "#60D6D3",
  "#FE984D",
  "#D74E72",
  "#2F80ED",
  "#E062EB",
  "#FFA723",
  "#91FD96",
];
const useStyles = makeStyles((theme) => ({
  legendWrap: {
    display: "flex",
    justifyContent: "space-evenly",
    color: "#898989",
    "& $legendItem": {
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      fontSize: 12,
    },
    "& svg": {
      transform: "scale(.8)",
    },
  },
  legendItem: {},
}));
const BubbleChart = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("common");
  const { isPrint } = props;
  const [applicantSkills, setApplicantSkills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (props.applicantSkills) {
      let applicantSkills = [];
      const sortedSkills = props.applicantSkills.sort((a, b) => b.exp - a.exp);
      for (let index = 0; index < sortedSkills.length; index++) {
        const skill = sortedSkills[index];
        let applicantSkill = {};
        applicantSkill.name = skill.name;
        applicantSkill.color = getColor(skill.competency);
        applicantSkill.value = skill.exp;
        applicantSkills.push(applicantSkill);
      }
      // if (sortedSkills.length < 12) {
      //   let name = "";
      //   let value = "0.9";
      //   for (let index = sortedSkills.length; index < 12; index++) {
      //     let applicantSkill = {};
      //     applicantSkill.name = name;
      //     applicantSkill.value = value;
      //     applicantSkill.color = getColor(index);
      //     applicantSkills.push(applicantSkill);
      //     name = name + " ";
      //     value = value - 0.3;
      //   }
      // }

      setApplicantSkills({
        name: "stack",
        color: "hsl(176, 70%, 50%)",
        children: applicantSkills,
      });
      setLoading(false);
    }
  }, [props.applicantSkills]);

  // const getColor = i => {
  //   return colors[i % 8];
  // };

  const getColor = (competency) => {
    switch (competency) {
      case 1: {
        return "#d14f59";
      }
      case 2: {
        return "#f9c51d";
      }
      case 3: {
        return "#a7e790";
      }
      case 4: {
        return "#19a350";
      }
      default: {
        return "#F5F5F5";
      }
    }
  };

  const getTooltip = (obj) => {
    if (obj.id.trim()) {
      return `${obj.id}- ${obj.value} year(s)`;
    }
  };

  const getLabel = (obj) => {
    if (obj.id && obj.id.trim().length > 10 && obj.r < 40) {
      return `${obj.id.substring(0, 5)}..`;
    }
    return obj.id;
  };

  if (loading) {
    return (
      <div
        style={{
          height: 500,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          marginBottom: 30,
        }}
      >
        <CircularProgress style={{ height: 30, width: 30 }} />
      </div>
    );
  }

  return (
    <div
      style={{
        height: isPrint ? 300 : 500,
        width: isPrint && "100%",
        fontFamily: "Roboto",
        fontWeight: !isPrint && "bold",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isPrint ? (
        <Bubble
          width={300}
          height={275}
          root={applicantSkills}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          identity="name"
          value="value"
          colors={(d) => d.color}
          padding={-10}
          leavesOnly={true}
          labelTextColor={"#000000"}
          label={(d) => getLabel(d)}
          theme={{
            fontFamily: "Roboto",
            fontSize: "10px",
            tooltip: {
              fontFamily: "Roboto",
              fontSize: "12px",
            },
          }}
          // borderWidth={1}
          // borderColor={{ from: "color" }}
          defs={[
            {
              id: "gradientA",
              type: "linearGradient",
              colors: [
                { offset: 10, color: "inherit" },
                { offset: 100, color: "inherit", opacity: 0 },
              ],
            },
          ]}
          fill={[
            {
              match: "*",
              id: "gradientA",
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={12}
          tooltip={(d) => getTooltip(d)} //custom tootip
        />
      ) : (
        <ResponsiveBubble
          root={applicantSkills}
          margin={{ top: 20, right: 20, bottom: 20, left: isPrint ? -200 : 20 }}
          identity="name"
          value="value"
          colors={(d) => d.color}
          padding={-10}
          leavesOnly={true}
          labelTextColor={"#000000"}
          label={(d) => getLabel(d)}
          theme={{
            fontFamily: "Roboto",
            fontSize: "10px",
            tooltip: {
              fontFamily: "Roboto",
              fontSize: "12px",
            },
          }}
          // borderWidth={1}
          // borderColor={{ from: "color" }}
          defs={[
            {
              id: "gradientA",
              type: "linearGradient",
              colors: [
                { offset: 10, color: "inherit" },
                { offset: 100, color: "inherit", opacity: 0 },
              ],
            },
          ]}
          fill={[
            {
              match: "*",
              id: "gradientA",
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={12}
          tooltip={(d) => getTooltip(d)} //custom tootip
        />
      )}
      <Box className={classes.legendWrap}>
        <Typography
          className={classes.legendItem}
          style={isPrint && { fontSize: 10 }}
        >
          <FiberManualRecordRounded style={{ color: "#d14f59" }} />{" "}
          {t("beginner")}
        </Typography>
        <Typography
          className={classes.legendItem}
          style={isPrint && { fontSize: 10 }}
        >
          <FiberManualRecordRounded style={{ color: "#f9c51d" }} />{" "}
          {t("intermediate")}
        </Typography>
        <Typography
          className={classes.legendItem}
          style={isPrint && { fontSize: 10 }}
        >
          <FiberManualRecordRounded style={{ color: "#a7e790" }} />{" "}
          {t("advanced")}
        </Typography>
        <Typography
          className={classes.legendItem}
          style={isPrint && { fontSize: 10 }}
        >
          <FiberManualRecordRounded style={{ color: "#19a350" }} />{" "}
          {t("expert")}
        </Typography>
      </Box>
    </div>
  );
};
export default BubbleChart;
