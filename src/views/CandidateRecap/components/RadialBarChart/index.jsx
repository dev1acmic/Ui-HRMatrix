import React, { useEffect } from "react";

import ReactApexChart from "react-apexcharts";
import { CircularProgress } from "@material-ui/core";

const RadialBarChart = props => {
  const { isPrint } = props;

  const initialState = {
    colors: [],
    labels: [],
    scores: [],
    gradientColors: []
  };
  const { screening } = props;
  const [loading, setLoading] = React.useState(true);
  const [assessment, setAssessment] = React.useState(initialState);

  useEffect(() => {
    if (props.assessment) {
      const assessmentLevels = initialState;
      for (let index = 0; index < props.assessment.length; index++) {
        const exists = assessmentLevels.labels.findIndex(
          c => c === "Level " + props.assessment[index].level
        );
        if (exists === -1) {
          assessmentLevels.colors.push(
            getColorCodes(props.assessment[index].level % 4)
          );
          assessmentLevels.gradientColors.push(
            getGradientColor(props.assessment[index].level % 4)
          );
          assessmentLevels.labels.push(
            "Level " + props.assessment[index].level
          );
          assessmentLevels.scores.push(props.assessment[index].overallScore);
        }
      }
      assessmentLevels.colors.push(
        getColorCodes((props.assessment.length + 1) % 4)
      );
      assessmentLevels.gradientColors.push(
        getGradientColor((props.assessment.length + 1) % 4)
      );
      assessmentLevels.labels.push("Screening");
      assessmentLevels.scores.push(screening);

      if (props.assessment.length < 4) {
        for (let index = props.assessment.length; index < 4; index++) {
          assessmentLevels.colors.push("#FFF");
          assessmentLevels.gradientColors.push("#FFF");
          assessmentLevels.labels.push("");
          assessmentLevels.scores.push("100");
        }
      }
      setAssessment(assessmentLevels);
      setLoading(false);
    }
  }, [props.assessment]);

  const getColorCodes = level => {
    switch (level) {
      case 1: {
        return "#48BDAF";
      }
      case 2: {
        return "#73F690";
      }
      case 3: {
        return "#F9C51D";
      }
      case 4: {
        return "#F4522F";
      }
      default: {
        return "#48BDAF";
      }
    }
  };

  const getGradientColor = level => {
    switch (level) {
      case 1: {
        return "#B9E6E1";
      }
      case 2: {
        return "#C3F1D1";
      }
      case 3: {
        return "#FEF0C1";
      }
      case 4: {
        return "#FCC5BA";
      }
      default: {
        return "#B9E6E1";
      }
    }
  };
  const arr = [
    "vimeo is for videos",
    "messenger for talking",
    "facebook for socializing",
    "linkedin for socialicing professionally"
  ];
  const data = {
    options: {
      chart: {
        //height: 350,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          offsetY: -10,
          offsetX: isPrint && -50,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "40",
            background: "transparent",
            image: undefined
          },
          track: {
            show: true,
            startAngle: undefined,
            endAngle: undefined,
            background: "#CACACA",
            strokeWidth: "97%",
            opacity: 1,
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: assessment.gradientColors,
          //gradientToColors: ["#B9E6E1", "#E9EEF0", "#FEF1C8", "#FCCDC3"],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      //colors: ["#51C0B3", "#86F6A0", "#F9C51D", "#F4522F", "#51C0B3"],
      //labels: ["Level 1", "Level 2", "Level 3", "Level 4", "Screening"],
      colors: assessment.colors,
      labels: assessment.labels,
      legend: {
        show: true,
        floating: true,
        fontSize: isPrint ? "11px" : "12px",
        position: "left",

        offsetX: isPrint ? -50 : -40,
        offsetY: 0,
        labels: {
          useSeriesColors: true,
          textAlign: "left"
        },
        markers: {
          size: 0
        },
        formatter: function(seriesName, opts) {
          return seriesName === ""
            ? ""
            : seriesName +
                "-  " +
                opts.w.globals.series[opts.seriesIndex] +
                "%";
        },
        itemMargin: {
          horizontal: isPrint ? 0.5 : 2.5
        }
      },
      responsive: [
        {
          breakpoint: 300,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    },
    series: assessment.scores
    //series: [50, 75, 70, 80, 85]
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
          marginBottom: 30
        }}
      >
        <CircularProgress style={{ height: 30, width: 30 }} />
      </div>
    );
  }

  return (
    <div
      id="radialChart"
      style={{
        fontFamily: "Roboto",
        fontSize: "12px",
        fontWeight: "bold",
        width: "100%"
        //height: isPrint ? "250px" : "350px",
        //backgroundColor: "red"
      }}
    >
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="radialBar"
        height={isPrint ? 280 : 350}
        width={isPrint ? 320 : "100%"}
        style={isPrint ? { marginLeft: 80 } : { marginLeft: -20 }}
      />
    </div>
  );
};
export default RadialBarChart;
