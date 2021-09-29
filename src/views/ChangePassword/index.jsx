import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  withStyles,
  Grid,
  InputLabel,
  TextField,
} from "@material-ui/core";
import validate from "validate.js";
import { Link, withRouter } from "react-router-dom";
import { Dashboard as DashboardLayout } from "layouts";
import styles from "../JobPost/components/styles";
import { connect } from "react-redux";
import schema from "./schema";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import { resetPassword } from "services/user/action";
import MessageBox from "util/messageBox";

const ChangePassword = (props) => {
  const { classes, t } = props;
  const initialUserState = {
    userId: props.userId || 0,
    values: {
      password: "",
      confirm: "",
    },
    touched: {
      password: false,
      confirm: false,
    },
    errors: {
      password: null,
      confirm: null,
    },
    isValid: false,
    isLoading: false,
    submitError: null,
  };

  const [values, setValues] = useState(initialUserState.values);
  const [errors, setErrors] = useState(initialUserState.errors);
  const [touched, setTouched] = useState(initialUserState.touched);
  const [successMsg, setSuccessMsg] = useState(false);

  const showPasswordError =
    touched.password && errors.password ? errors.password[0] : false;
  const showConfirmError =
    touched.confirm && errors.confirm ? errors.confirm[0] : false;

  function validateForm(values) {
    setSuccessMsg(false);
    const errors = validate(values, schema);
    setErrors(errors || {});
    let valid = errors ? false : true;
    return valid;
  }

  const handleFieldChange = (field, value) => {
    const variables = { ...values };
    variables[field] = value;
    setValues(variables);
    setTouched({ ...touched, [field]: true });
    validateForm(variables);
  };

  const handleCloseSuccess = () => {
    setSuccessMsg(false);
  };

  const handleChangePassword = async () => {
    if (validateForm(values)) {
      props.resetPassword(values.password, props.userId);
      setSuccessMsg(true);
      setSuccessMsg("Updated successfully.");
      const timer = setTimeout(() => {
        props.history.push("/rc/dashboard");
      }, 1000);
    }
  };

  return (
    <DashboardLayout title={t("common:dashboard")}>
      <Container className={classes.root}>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12}>
            <Typography variant="h1" className={classes.pageTitle}>
              {t("changepassword")}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          className={classes.reviewItemWrap}
          md={6}
          xs={12}
          style={{ padding: "10px 20px 20px 20px", marginLeft: 0 }}
        >
          <Grid container item spacing={3} className={classes.formContainer}>
            <Grid item xs={12}>
              <InputLabel className={classes.inputLabel}>
                {t("newPswd")}
              </InputLabel>
              <TextField
                className={classes.textField}
                error={getMsg(errors.password, t)}
                id="outlined-bare"
                name="password"
                margin="dense"
                variant="outlined"
                fullWidth
                type="password"
                inputProps={{ "aria-label": "bare" }}
                placeholder={t("newPswd")}
                onChange={(event) =>
                  handleFieldChange("password", event.target.value)
                }
                value={values.password}
                autoComplete="off"
              />
              {showPasswordError && (
                <Typography className={classes.fieldError} variant="body2">
                  {getMsg(errors.password[0], t)}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            item
            spacing={3}
            className={classes.formContainer}
            style={{ marginTop: -15 }}
          >
            <Grid item xs={12}>
              <InputLabel className={classes.inputLabel}>
                {t("confirmpassword")}
              </InputLabel>
              <TextField
                className={classes.textField}
                error={getMsg(errors.confirm, t)}
                id="outlined-bare"
                margin="dense"
                variant="outlined"
                fullWidth
                type="password"
                inputProps={{ "aria-label": "bare" }}
                placeholder={t("confirmpassword")}
                onChange={(event) =>
                  handleFieldChange("confirm", event.target.value)
                }
                value={values.confirm}
                autoComplete="off"
              />
              {showConfirmError && (
                <Typography className={classes.fieldError} variant="body2">
                  {getMsg(errors.confirm[0], t)}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Grid spacing={3} item container className={classes.buttonBar}>
            <Button
              variant="contained"
              className={classes.button}
              to="/rc/dashboard"
              component={Link}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              // to="/rc/dashboard"
              component={Link}
              className={classes.button}
              onClick={handleChangePassword}
            >
              {t("save")}
            </Button>
            <MessageBox
              open={successMsg}
              variant="success"
              onClose={handleCloseSuccess}
              message={successMsg}
            />
            <br />
            &nbsp; <br />{" "}
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

const mapDispatchToProps = {
  resetPassword,
};

const mapStateToProps = (state) => ({
  roles: state.admin && state.admin.roles,
  orgId: state.profile && state.profile.orgId,
  userId: state.profile && state.profile.id,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withTranslation("common")(ChangePassword)))
);
