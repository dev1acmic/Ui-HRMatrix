import React from "react";
import {
  Container,
  withStyles,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import { Dashboard as DashboardLayout } from "layouts";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; //import { isRoleTA } from "util/roleUtil";
import { checkOrgHasTA } from "services/jobPost/action";
import styles from "./submitJobStyle";
import transImg from "assets/images/trans_img_01.png";

const ThankYou = (props) => {
  const { classes } = props;
  const { t } = useTranslation("common");
  return (
    <DashboardLayout title={t("dashboard")}>
      <Container className={classes.root}>
        <div className={classes.root}>
          <Grid
            container
            spacing={3}
            xs={12}
            style={{ margin: "0" }}
            className={classes.reviewItemWrap}
          >
            <Grid
              item
              xs={12}
              md={4}
              lg={4}
              style={{
                background:
                  "linear-gradient(90.01deg, #60CE8C 1.57%, #48BDAF 96.56%), #48BDAF",
                borderRadius: "5px 0 0 5px",
              }}
            >
              <img
                alt="HR Matrix"
                src={transImg}
                Component=""
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={8} lg={8}>
              <div className={classes.valCntWrap}>
                <Typography variant="h2" className={classes.ValTitle}>
                  {t("thankyou")}
                </Typography>

                <Grid item xs={12}>
                  <div
                    style={{
                      padding: "10px",
                      fontFamily: "Roboto",
                    }}
                  >
                    <div>
                      <Typography variant="p" className={classes.ValParagraph}>
                        {t("common:candidatesubmittedalert")}
                      </Typography>
                      <Grid
                        spacing={3}
                        item
                        container
                        className={classes.buttonBar}
                      >
                        <Link to="/rc/dashboard" className={classes.Button}>
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                          >
                            {t("common:ok")}
                          </Button>
                        </Link>
                      </Grid>
                    </div>
                  </div>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  checkOrgHasTA: checkOrgHasTA,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ThankYou));
