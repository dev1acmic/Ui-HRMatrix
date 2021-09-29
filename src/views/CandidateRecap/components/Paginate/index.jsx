import React from "react";

// Material helpers
import { withStyles, Link } from "@material-ui/core";

// Material components
import { Box, ButtonGroup, Button } from "@material-ui/core";
import {
  ArrowBackOutlined,
  SaveAltOutlined,
  DescriptionOutlined,
  ArrowForwardOutlined,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";

// Component styles
import styles from "../TopBar/styles";
import ReactToPrint from "react-to-print";
//import ReactToPdf from "react-to-pdf";

const Paginate = (props) => {
  const { classes } = props;
  const { t } = useTranslation("common");

  return (
    <div>
      <Box className={classes.topButtonWrap}>
        <ButtonGroup
          variant="contained"
          size="small"
          className={classes.btnGrp}
          aria-label="large contained secondary button group"
        >
          >
          <Button
            onClick={() => props.handlePaginate(-1)}
            disabled={props.currentPage === 1}
          >
            <ArrowBackOutlined size /> {t("common:previous")}
          </Button>
          <Button
            onClick={() => {
              props.handleShowResume();
            }}
          >
            <DescriptionOutlined /> {t("common:viewresume")}
          </Button>
          <Button>
            {/* <ReactToPdf targetRef={props.componentRef} filename="candidate.pdf">
              {({ toPdf }) => <button onClick={toPdf}>Generate pdf</button>}
            </ReactToPdf> */}
            <ReactToPrint
              trigger={() => (
                <Button>
                  <SaveAltOutlined />
                  {t("common:print")}
                </Button>
              )}
              content={() => props.componentRef.current}
            />
          </Button>
          <Button
            onClick={() => props.handlePaginate(1)}
            disabled={props.totalPage === props.currentPage}
          >
            <ArrowForwardOutlined />
            {t("common:next")}
          </Button>
        </ButtonGroup>
      </Box>
    </div>
  );
};

export default withStyles(styles)(Paginate);
