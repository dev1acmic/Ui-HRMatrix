import React, { useState, useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";

// Material helpers
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Toolbar,
  Typography,
  Box,
  AppBar,
  Divider,
  Grid,
  InputLabel,
  TextField,
  Select,
  OutlinedInput,
  FormControl,
  Button,
  MenuItem,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import MessageBox from "util/messageBox";
import styles from "../styles";
//import _ from "underscore";
import validate from "validate.js";
import schema from "./schema";

const AddLocation = (props) => {
  const { classes } = props;
  const { t } = useTranslation("common");
  const addrState = {
    values: {
      line1: "",
      line2: "",
      city: "",
      state: " ",
      country: "US",
      zip: "",
    },
    errors: {
      line1: null,
      line2: null,
      city: null,
      state: null,
      country: null,
      zip: null,
    },
    isValid: false,
    loading: false,
    submitError: null,
  };
  let [values, setValues] = useState(addrState.values);
  const [, setLoading] = useState(false);
  const [, setValid] = useState(false);
  const [errors, setErrors] = useState(addrState.errors);
  const [errMsg, setErrMsg] = useState(false);
  function handleFieldChange(field, value) {
    setValues({ ...values, [field]: value });
  }
  function validateForm() {
    const errors = validate(values, schema);
    if (errors && errors.zip && values.zip) {
      let reg = /^\d{5}$/;
      if (!reg.test(values.zip)) {
        setErrMsg("Invalid zip code");
      }
    }
    setErrors(errors || {});
    let valid = errors ? false : true;
    setValid(valid);
    return valid;
  }
  function handleClose() {
    setErrMsg(false);
  }
  function handleSubmit() {
    if (validateForm()) {
      setLoading(true);
      let data = values;
      props.saveLocation(data);
    }
  }
  useEffect(() => {
    if (props.item) {
      setValues(props.item);
    }
  }, props.item);

  return (
    <Box
      width={{ xs: "90%", sm: "90%", md: "600px" }}
      className={classes.modalWrap}
    >
      <MessageBox
        open={errMsg}
        variant="error"
        onClose={handleClose}
        message={errMsg}
      />
      <AppBar position="static" color="default" align="center">
        <Toolbar className={classes.modalHeadWrap}>
          <Typography className={classes.modalHead} variant="h6">
            {t("addnewofficeloc")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Divider className={classes.modalHeadHr} />

      <Box className={classes.modalContent}>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item xs={12} md={6}>
            <InputLabel className={classes.inputLabel}>
              {t("address")}
            </InputLabel>
            <TextField
              error={getMsg(errors.line1, t)}
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              inputProps={{ "aria-label": "bare", maxlength: 85 }}
              placeholder={t("addressLineOne")}
              onChange={(event) =>
                handleFieldChange("line1", event.target.value)
              }
              value={values.line1 || ""}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.subItem}>
            <TextField
              error={getMsg(errors.line2, t)}
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              style={{ marginTop: 20 }}
              inputProps={{ "aria-label": "bare", maxlength: 85 }}
              placeholder={t("addressLineTwo")}
              onChange={(event) =>
                handleFieldChange("line2", event.target.value)
              }
              value={values.line2 || ""}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          spacing={3}
          className={classes.formContainer}
          style={{ paddingTop: 0, marginTop: -20 }}
        >
          <Grid
            item
            xs={12}
            md={4}
            //className={classes.threeColEqual}
            style={{ marginTop: 8 }}
          >
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                error={getMsg(errors.city, t)}
                id="outlined-bare"
                className={classes.textField}
                margin="dense"
                variant="outlined"
                fullWidth
                inputProps={{ "aria-label": "bare", maxlength: 50 }}
                placeholder={t("city")}
                onChange={(event) =>
                  handleFieldChange("city", event.target.value)
                }
                value={values.city || ""}
                // inputProps={{
                //   maxlength: 50
                // }}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            //className={classes.threeColEqual}
            style={{ marginTop: 7 }}
          >
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                style={{ marginTop: 9, width: 170 }}
                margin="dense"
                input={<OutlinedInput labelWidth="0" name="role" id="role" />}
                onChange={(event) =>
                  handleFieldChange("state", event.target.value)
                }
                value={values.state}
                error={getMsg(errors.state, t)}
              >
                <MenuItem value=" ">{t("state")}</MenuItem>
                {props.states &&
                  props.states.map((item, index) => (
                    <MenuItem key={index} value={item.code}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            style={{ marginTop: 6 }}
            //className={classes.threeColEqual}
          >
            <TextField
              error={getMsg(errors.zip, t)}
              id="outlined-bare"
              className={classes.textField}
              margin="dense"
              variant="outlined"
              fullWidth
              style={{ marginTop: 10 }}
              inputProps={{ "aria-label": "bare", maxlength: 5 }}
              placeholder={t("zip")}
              onChange={(event) => handleFieldChange("zip", event.target.value)}
              value={values.zip || ""}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.modalFooter}>
          <Button
            onClick={props.onCancel}
            variant="contained"
            className={classes.modalBtnSecondary}
          >
            {t("cancel")}
          </Button>{" "}
          &nbsp;
          <Button
            onClick={handleSubmit}
            variant="contained"
            //color="secondary"
            className={classes.modalBtnPrimary}
          >
            {t("submit")}
          </Button>
        </Grid>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = () => ({});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddLocation))
);
