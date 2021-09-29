import React, { useEffect } from "react";
import ZingChart from "zingchart-react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { FiberManualRecordRounded } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

//import { Competency } from "util/enum";

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

const PieChart = (props) => {
  const classes = useStyles();
  const { isPrint } = props;
  const { t } = useTranslation("common");

  const [config, setConfig] = React.useState([]);

  useEffect(() => {
    const id = isPrint ? "zing-print" : "zing-pie";
    window.zingchart.exec(id, "setdata", {
      data: config,
    });
  }, [config]);

  useEffect(() => {
    if (props.applicantSkills) {
      const applicantSkills = [];

      props.applicantSkills.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (b.name < a.name) {
          return 1;
        }
        return 0;
      });

      for (let index = 0; index < props.applicantSkills.length; index++) {
        const skill = props.applicantSkills[index];
        let applicantSkill = [];
        //applicantSkill.label = Competency.getNameByValue(skill.competency);
        applicantSkill.text = skill.name;
        applicantSkill.values = [20];
        let gradience = getColorCodes(skill.competency);
        applicantSkill["background-color-1"] = gradience[0];
        applicantSkill["background-color-2"] = gradience[1];
        applicantSkill["fill-angle"] = 15;
        applicantSkills.push(applicantSkill);
      }

      if (props.applicantSkills.length < 12) {
        for (let index = props.applicantSkills.length; index < 12; index++) {
          let applicantSkill = [];
          applicantSkill.text = "";
          applicantSkill.values = [20];
          applicantSkill["background-color-1"] = getColorCodes();
          applicantSkill["background-color-2"] = getColorCodes();
          applicantSkill["fill-angle"] = 15;
          applicantSkills.push(applicantSkill);
        }
      }
      //setApplicantSkills(applicantSkills);
      setConfig(simulateLiveData(applicantSkills));
    }
  }, [props.applicantSkills]);

  let transform = [8, "20%", "fold=20", "fixed=45%;55%"];
  const simulateLiveData = (applicantSkills) => {
    return {
      type: "pie",
      plot: {
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        // slice: 90,
        slice: transform[1],
        pieTransform: transform[2],
        refAngle: 270,

        valueBox: {
          placement: transform[3],
          text: "%t",
          fontFamily: "Roboto",
          fontSize: isPrint ? "8px" : "10px",
          fontColor: "#000000",
          fontWeight: isPrint ? "normal" : "bold",
          angle: 0,
          width: 45,
          wrapText: true,
          whiteSpace: "wrap",
        },
        tooltip: {
          fontSize: "12",
          fontFamily: "Roboto",
          padding: "5 10",
          text: "%t",
        },
      },

      plotarea: {
        margin: "0 0 0 0",
      },

      series: applicantSkills,

      //series: data
    };
  };

  const getColorCodes = (competency) => {
    switch (competency) {
      case 1: {
        return ["#ffd6d8", "#d14f59"];
      }
      case 2: {
        return ["#fffceb", "#F9C51D"];
      }
      case 3: {
        return ["#f0fcec", "#A7E790"];
      }
      case 4: {
        return ["#d6faee", "#53BF7E"];
      }
      default: {
        return "#F5F5F5";
      }
    }
  };

  return (
    <div
      style={{
        //height: isPrint ? 240 : 500,
        fontFamily: "Roboto",
        fontSize: "12px",
        fontWeight: isPrint && "bold",
        width: isPrint && "100%",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ZingChart
        id={isPrint ? "zing-print" : "zing-pie"}
        data={config}
        width={isPrint && 240}
        height={isPrint && 240}
      ></ZingChart>
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
export default PieChart;
