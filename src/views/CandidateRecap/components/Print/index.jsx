import React from "react";

import ReactPDF, {
  Text,
  Document,
  Font,
  Page,
  StyleSheet,
  Image,
  View,
  PDFViewer
} from "@react-pdf/renderer";
import ReactDOM from "react-dom";
import {
  Timeline,
  TopBar,
  Swot,
  BarChart,
  PieChart,
  BubbleChart
} from "../../components";
// import Education from "./Education";
// import Experience from "./Experience";
// import Skills from "./Skills";

import chart4 from "assets/images/interview.png";

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  container: {
    flex: 1,
    flexDirection: "row",
    "@media max-width: 400": {
      flexDirection: "column"
    }
  },
  image: {
    marginBottom: 10
  },
  leftColumn: {
    flexDirection: "column",
    width: 170,
    paddingTop: 30,
    paddingRight: 15,
    "@media max-width: 400": {
      width: "100%",
      paddingRight: 0
    },
    "@media orientation: landscape": {
      width: 200
    }
  },
  footer: {
    fontSize: 12,
    //fontFamily: "Roboto",
    textAlign: "center",
    marginTop: 25,
    paddingTop: 10,
    borderWidth: 3,
    borderColor: "gray",
    borderStyle: "dashed",
    "@media orientation: landscape": {
      marginTop: 10
    }
  }
});

const Recap = props => (
  <Page {...props} style={styles.page} wrap>
    <View style={styles.container} wrap={false}>
      {props.applicant && <Timeline {...props} />}
    </View>
    <Text style={styles.footer}>This IS the candidate you are looking for</Text>
  </Page>
);

const Print = props => {
  return (
    <PDFViewer style={{ position: "relative", width: "100%", height: "800px" }}>
      <Document>
        <Recap size="A4" {...props} />
        {/* <Recap orientation="landscape" size="A4" />
        <Recap size={[380, 1250]} /> */}
      </Document>
    </PDFViewer>
  );
};

ReactDOM.render(<Print />, document.getElementById("root"));
export default Print;
