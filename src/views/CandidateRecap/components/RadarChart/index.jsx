import React, { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";

import { ResponsiveRadar } from "@nivo/radar";
import { useTranslation } from "react-i18next";

const RadarChart = (props) => {
  const { isPrint } = props;
  const { t } = useTranslation("common");
  const [loading, setLoading] = React.useState(false);
  const [assessment, setAssessment] = React.useState([]);

  useEffect(() => {
    if (props.assessment) {
      const assessmentLevels = props.assessment;
      const TM = assessmentLevels.map((c) => c.timeManagement);
      const CB = assessmentLevels.map((c) => c.collaboration);
      const CT = assessmentLevels.map((c) => c.criticalThinking);
      const CM = assessmentLevels.map((c) => c.communication);
      const LS = assessmentLevels.map((c) => c.leadership);

      setAssessment([
        {
          skill: t("common:timemanagement"),
          level: getAvg(TM),
        },
        {
          skill: t("common:collaboration"),
          level: getAvg(CB),
        },
        {
          skill: t("common:criticalthinking"),
          level: getAvg(CT),
        },
        {
          skill: t("common:communication"),
          level: getAvg(CM),
        },
        {
          skill: t("common:leadership"),
          level: getAvg(LS),
        },
      ]);
      setLoading(false);

      //const assessmentLevels = [];
      // for (let index = 0; index < props.assessment.length; index++) {
      //   const assessment = props.assessment[index];
      //   const exists = assessmentLevels.findIndex(
      //     c => c.name === "Level " + assessment.level
      //   );
      //   if (exists === -1) {
      //     assessmentLevels.push({
      //       name: "Level " + assessment.level,
      //       data: [
      //         assessment.timeManagement,
      //         assessment.collaboration,
      //         assessment.criticalThinking,
      //         assessment.communication,
      //         assessment.leadership
      //       ]
      //     });
      //   }
      // }
      // setAssessment(assessmentLevels);
      // setLoading(false);
    }
  }, [props.assessment]);

  const getAvg = (arr) => {
    const sum = arr.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / arr.length) || 0;
    return avg;
  };

  const LabelComponent = ({ id, anchor }) => (
    <g
      transform={`translate(${
        anchor === "end" ? -30 : anchor === "middle" ? -50 : -50
      }, 5)`}
    >
      <text>
        {id}
        {/* <tspan x="0" dy=".6em">
          {id}
        </tspan>
        <tspan x="0" dy="1.2em">
          tspan line 2
        </tspan> */}
      </text>
    </g>
  );
  // const data = {
  //   options: {
  //     chart: {
  //       height: 400

  //       // dropShadow: {
  //       //   enabled: true,
  //       //   blur: 1,
  //       //   left: 1,
  //       //   top: 1
  //       // }
  //     },
  //     grid: {
  //       show: false,
  //       borderColor: "#FFF",
  //       strokeDashArray: 0,
  //       position: "back",
  //       xaxis: {
  //         lines: {
  //           show: false
  //         }
  //       },
  //       yaxis: {
  //         lines: {
  //           show: false
  //         }
  //       },
  //       row: {
  //         colors: undefined,
  //         opacity: 0.5
  //       },
  //       column: {
  //         colors: undefined,
  //         opacity: 0.5
  //       },
  //       padding: {
  //         top: 0,
  //         right: 0,
  //         bottom: 0,
  //         left: -10
  //       }
  //     },
  //     plotOptions: {
  //       radar: {
  //         polygons: {
  //           strokeColors: ["#797979", "#CCC"],
  //           connectorColors: "rgba(0, 0, 0, 0.25)"
  //           // fill: {
  //           //   colors: ["#FFF", "#60EC9F", "#60EC9F", "#60EC9F"]
  //           // }
  //         }
  //       }
  //     },
  //     // colors: [
  //     //   "#7B48BD",
  //     //   "#60D6D3",
  //     //   "#FE984D",
  //     //   "#D74E72",
  //     //   "#2F80ED",
  //     //   "#E062EB",
  //     //   "#FFA723",
  //     //   "#91FD96"
  //     // ],
  //     labels: [
  //       "Time Management",
  //       "Collaboration",
  //       "Critical Thinking",
  //       "Communication",
  //       "Leadership"
  //     ],
  //     legend: {
  //       show: false,
  //       showForSingleSeries: false
  //       // floating: true,
  //       // fontSize: "12px",
  //       // // position: "left",
  //       // offsetX: -90,
  //       // offsetY: 70,
  //       // labels: {
  //       //   useSeriesColors: true,
  //       //   textAlign: "left"
  //       // },
  //       // markers: {
  //       //   size: 0
  //       // }
  //     },

  //     dataLabels: {
  //       enabled: true,
  //       enabledOnSeries: undefined,
  //       textAnchor: "right",
  //       offsetX: 0,
  //       offsetY: 0,
  //       style: {
  //         fontSize: "11px",
  //         fontFamily: "Roboto",
  //         colors: ["#000000"]
  //       }
  //     },

  //     yaxis: {
  //       show: false,
  //       showAlways: false,
  //       labels: {
  //         show: true,
  //         align: "right",
  //         minWidth: 0,
  //         maxWidth: 160,
  //         style: {
  //           colors: ["#000000"],
  //           fontSize: "12px",
  //           fontFamily: "Roboto",
  //           zIndex: 10000
  //         },
  //         offsetX: 0,
  //         offsetY: 0,
  //         rotate: 46
  //       },
  //       axisBorder: {
  //         show: false
  //       },
  //       axisTicks: {
  //         show: false
  //       }
  //     },
  //     stroke: {
  //       width: 1
  //     },
  //     fill: {
  //       type: "gradient",
  //       gradient: {
  //         shade: "light",
  //         type: "horizontal",
  //         shadeIntensity: 0.5,
  //         //gradientToColors: ["#5907DF"],
  //         inverseColors: false,
  //         opacityFrom: 0.5,
  //         opacityTo: 0.9,
  //         stops: [0, 100]
  //       }
  //     },
  //     markers: {
  //       size: 0
  //     }
  //   },

  //   series: assessment
  //   // series: [
  //   //   {
  //   //     name: "Level 1",
  //   //     data: [2, 1, 3, 4, 2]
  //   //   },
  //   //   {
  //   //     name: "Level 2",
  //   //     data: [1, 2, 3, 4, 4]
  //   //   },
  //   //   {
  //   //     name: "Level 3",
  //   //     data: [4, 3, 1, 2, 1]
  //   //   }
  //   // ]
  // };

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
        fontFamily: "Roboto",
        fontSize: "12px",
        fontWeight: "bold",
        width: isPrint ? 370 : "100%",
        height: isPrint ? 250 : 320,
      }}
    >
      <ResponsiveRadar
        data={assessment}
        keys={["level"]}
        indexBy="skill"
        maxValue="auto"
        margin={{ top: 0, right: 100, bottom: 0, left: 70 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={"#2196f3"}
        gridLevels={3}
        gridShape="linear"
        gridLabelOffset={10}
        theme={{
          grid: {
            line: {
              stroke: "#ccc",
              strokeWidth: 1,
            },
          },
        }}
        enableDots={true}
        // dotSize={5}
        // dotColor={{ theme: "background" }}
        // dotBorderWidth={2}
        // dotBorderColor={{ from: "color" }}
        enableDotLabel={false}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={"#2196f3"}
        fillOpacity={0.25}
        blendMode="normal"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        isInteractive={true}
        // legends={[
        //   {
        //     anchor: "top-left",
        //     direction: "column",
        //     translateX: -50,
        //     translateY: -40,
        //     itemWidth: 80,
        //     itemHeight: 20,
        //     itemTextColor: "#999",
        //     symbolSize: 12,
        //     symbolShape: "circle",
        //     effects: [
        //       {
        //         on: "hover",
        //         style: {
        //           itemTextColor: "#000"
        //         }
        //       }
        //     ]
        //   }
        // ]}
      />
    </div>
  );
};
export default RadarChart;
