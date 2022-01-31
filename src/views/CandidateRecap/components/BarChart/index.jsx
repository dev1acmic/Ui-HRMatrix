import React, { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import { ResponsiveBar } from "@nivo/bar";
import _ from 'lodash'

const BarChart = (props) => {
  const { isPrint } = props;
  const [applicantSkills, setApplicantSkills] = React.useState(null);
  const max_exp = props.applicantSkills && _.maxBy(props.applicantSkills, function(o) {
    return o.exp;
  }); //set as max value
  const exp = max_exp && max_exp.exp + 1;
  const [loading, setLoading] = React.useState(true);
  const yaxisValues = Array.from(Array(exp + 1).keys());
  useEffect(() => {
    if (props.applicantSkills) {
      const applicantSkills = [];

      for (let index = 0; index < props.applicantSkills.length; index++) {
        const skill = props.applicantSkills[index];
        let applicantSkill = [];
        applicantSkill.skill = skill.name;
        let candidateExp = skill.exp;
        let reqExp = skill.reqExp;
        if (candidateExp > reqExp) {
          let diff = candidateExp - reqExp;
          applicantSkill["+ Variance"] = diff;
          applicantSkill.diff = `+ ${diff}`;
          applicantSkill["+ VarianceColor"] = "#7CC486";
          applicantSkill["Candidate skill"] = reqExp;
        } else if (candidateExp < reqExp) {
          let diff = reqExp - candidateExp;
          applicantSkill["- Variance"] = diff;
          applicantSkill.diff = `- ${diff}`;
          applicantSkill["- VarianceColor"] = "#F65E5F";
          applicantSkill["Candidate skill"] = candidateExp;
        } else {
          applicantSkill["Candidate skill"] = reqExp;
        }
        applicantSkill["Candidate skillColor"] = "#F1F1F1";
        applicantSkills.push(applicantSkill);
      } 
      setApplicantSkills(applicantSkills);
      setLoading(false);
    }
  }, [props.applicantSkills]);

  const getLabel = (obj) => {
    if (obj.id !== "Candidate skill") {
      return obj.data.diff;
    }
  };

  const getTooltip = (obj) => {
    if (obj.id === "Candidate skill") {
      let reqExp = obj.data["- Variance"]
        ? obj.data["Candidate skill"] + obj.data["- Variance"]
        : obj.data["Candidate skill"];
      return `${obj.id} - ${obj.indexValue} :${reqExp}`;
    } else {
      return `${obj.id} - ${obj.indexValue} : ${obj.data.diff}`;
    }
  };

  /**
   * Returns a tick element that wraps text for the given number of lines and adds an ellipsis if the text can't fit. This can be passed to the renderTick method.
   */
  const HorizontalTick = ({ textAnchor, textBaseline, value, x, y }) => { 
    const MAX_LINE_LENGTH = 10;
    const MAX_LINES = 2;
    const LENGTH_OF_ELLIPSIS = 3;
    const TRIM_LENGTH = MAX_LINE_LENGTH * MAX_LINES - LENGTH_OF_ELLIPSIS;
    const trimWordsOverLength = new RegExp(`^(.{${TRIM_LENGTH}}[^\\w]*).*`);
    const groupWordsByLength = new RegExp(
      `([^\\s].{0,${MAX_LINE_LENGTH}}(?=[\\s\\W]|$))`,
      "gm"
    );
    const splitValues = value
      .replace(trimWordsOverLength, "$1...")
      .match(groupWordsByLength)
      .slice(0, 2)
      .map((val, i) => (
        <tspan
          key={val}
          dy={12 * i}
          x={0}
          y={20}
          style={{ fontFamily: "Roboto", fontSize: isPrint ? "8px" : "10px" }}
        >
          {val}
        </tspan>
      ));
    return (
      <g transform={`translate(${x},${y})`}>
        <text alignmentBaseline={textBaseline} textAnchor={textAnchor}>
          {splitValues}
        </text>
      </g>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          height: 400,
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
        height: isPrint ? 250 : 400,
        backgroundColor: "rgba(0, 204, 255, 0.09)",
        padding: "10px",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontSize: "12px",
        width: isPrint ? 500 : "100%",
      }}
    >
      {applicantSkills && (
        <ResponsiveBar
          data={applicantSkills}
          keys={["Candidate skill", "- Variance", "+ Variance"]}
          indexBy="skill"
          maxValue={exp}
          margin={
            isPrint
              ? { top: 10, right: 10, bottom: 75, left: 40 }
              : { top: 50, right: 20, bottom: 75, left: 50 }
          }
          padding={applicantSkills.length > 5 ? 0.4 : 0.8}
          //colors={{ scheme: "nivo" }}
          colors={({ id, data }) => data[`${id}Color`]}
          label={(d) => getLabel(d)}
          //borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          borderWidth={1}
          borderColor="#c2c2c2"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: "middle",
            legendOffset: 0,
            marginBottom: 20,
            fontSize: 10,
            renderTick: HorizontalTick,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Years",
            legendPosition: "middle",
            legendOffset: -30,
            tickValues: yaxisValues,
            //labelFontFamily: "roboto"
          }}
          markers={[
            {
              axis: "x",
              value: 0,
              lineStyle: { stroke: "#000", strokeWidth: 1 },
            },
            {
              axis: "y",
              value: 0,
              lineStyle: { stroke: "#000", strokeWidth: 1 },
            },
          ]}
          defs={[
            {
              id: "gradientA",
              type: "linearGradient",
              colors: [
                { offset: 0, color: "#e3e3e3" },
                { offset: 100, color: "#F4F4F4" },
              ],
            },
            // {
            //   id: "gradientA",
            //   type: "linearGradient",
            //   colors: [
            //     { offset: 20, color: "inherit" },
            //     { offset: 100, color: "inherit", opacity: 0.5 }
            //   ]
            // },
            {
              id: "gradientB",
              type: "linearGradient",
              colors: [
                { offset: 0, color: "#7CC486 " },
                { offset: 100, color: "#b3e3c6" },
              ],
            },
            {
              id: "gradientC",
              type: "linearGradient",
              colors: [
                { offset: 0, color: "#F65E5F " },
                { offset: 100, color: "#f0b1b1" },
              ],
            },
          ]}
          fill={[
            {
              match: {
                id: "Candidate skill",
              },
              id: "gradientA",
            },
            {
              match: {
                id: "+ Variance",
              },
              id: "gradientB",
            },
            {
              match: {
                id: "- Variance",
              },
              id: "gradientC",
            },
          ]}
          enableGridX={true}
          theme={{
            paddingBottom: 10,
            background: "#E8FAFF",
            //   axis: {
            //     fontSize: "12px",
            //     fontFamily: "Roboto, Helvetica, Arial, sans-serif"
            //   },
            grid: {
              line: {
                stroke: "#DFF5FC",
                strokeWidth: 2,
              },
            },
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: -5,
              translateY: 85,
              itemsSpacing: 2,
              itemWidth: 130,
              itemHeight: 40,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 30,
              symbolShape: ({ x, y, size, fill }) => (
                <rect
                  x={x}
                  y={14}
                  width={size}
                  height={10}
                  rx="5.5"
                  fill={fill}
                  stroke={"#c2c2c2"}
                />
              ),

              //symbolBorderColor: "#c2c2c2",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          tooltip={(d) => getTooltip(d)} //custom tootip
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      )}
    </div>
  );
};
export default BarChart;
