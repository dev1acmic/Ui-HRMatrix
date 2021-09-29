import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import "react-perfect-scrollbar/dist/css/styles.css";

// Material helpers
import { withStyles } from "@material-ui/core";

import {
  Toolbar,
  Typography,
  Box,
  AppBar,
  Divider,
  Grid,
  Button,
  CircularProgress,
} from "@material-ui/core";

import styles from "../styles";
import { useTranslation } from "react-i18next";
const ProfilePic = (props) => {
  const [state, setState] = useState({ isLoading: false });
  const { t } = useTranslation("common");
  const { classes } = props;

  // useEffect(() => {
  //   const { isLoading } = props;
  //   setState({ ...state, isLoading: isLoading });
  // }, []);

  const onSubmit = () => {
    setState({ ...state, isLoading: true });
    props.onSubmit();
    //setState({ ...state, isLoading: false });
  };

  const showButton = () => {
    return state.isLoading ? (
      <CircularProgress></CircularProgress>
    ) : (
      <>
        <Button
          onClick={props.onDialogClose}
          variant="contained"
          className={classes.modalBtnSecondary}
        >
          {t("cancel")}
        </Button>
        {"    "}
        {props.preview ? (
          <Button
            onClick={onSubmit}
            variant="contained"
            //color="secondary"
            className={classes.modalBtnPrimary}
          >
            {t("submit")}
          </Button>
        ) : null}
      </>
    );
  };
  return (
    <Box
      width={{ xs: "90%", sm: "90%", md: "700px" }}
      className={classes.modalWrap}
    >
      <AppBar position="static" color="default" align="center">
        <Toolbar className={classes.modalHeadWrap}>
          <Typography className={classes.modalHead} variant="h6">
            {t("updateProfilePic")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Divider className={classes.modalHeadHr} />

      <Box className={classes.modalContent}>
        <Grid container item spacing={3} className={classes.formContainer}>
          <Grid item md={8}>
            <Avatar
              width={300}
              height={250}
              imageWidth={300}
              imageHeight={250}
              style={{ backgroundColor: "white" }}
              onCrop={props.onCrop}
              onClose={props.onClose}
              onBeforeFileLoad={props.onBeforeFileLoad}
              src={props.src}
              label={t("chooseProfilePic")}
            />
          </Grid>
          <Grid item md={2} style={{ textAlign: "center" }}>
            {props.preview ? (
              <img src={props.preview} width="125" alt="Preview" />
            ) : null}
          </Grid>
        </Grid>
        <Grid item xs={10} className={classes.modalFooter}>
          {showButton()}
        </Grid>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(ProfilePic);
