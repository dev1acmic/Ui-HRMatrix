import React, { useEffect,useState } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider"; 
// Material helpers
import { withStyles } from "@material-ui/core"; 
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
// Material components 
import {
  Toolbar,
  Typography,
  Box,
  AppBar,
  Divider,
  Grid,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Select,
  OutlinedInput,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  CircularProgress,
  MenuItem,
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { getMsg } from "util/helper";

// Component styles
import styles from "../styles"; 
import MessageBox from "util/messageBox";
import validate from "validate.js";
import schema from "./schema"; 
 
const AddMoreLevel = (props) =>{
   const {levels,jobinterviewqtns, classes, t} = props  
   const [values,setValues] = useState({question:'', level:jobinterviewqtns.length+1})
   const [errors, setErrors] = useState([]); 
   const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(false);

   const handleChange= (value ,field) =>{ 
    setValues({ ...values, [field]: value });
   }

   function validateForm() {
    let errors = validate(values, schema);
    let valid = errors ? false : true;
    if (!valid) {
      setLoading(false)
      setErrMsg("Please fill in the required fields.");
    }  
    setErrors(errors || {});
    return valid;
  }

  const handleClose = () => {
    setErrMsg(false);
  };

  const handleSubmit = () => {
    setLoading(true)
    let valid = validateForm();
    if (valid) {
      props.onSubmit(values)
    }
  }

    return (
      <PerfectScrollbar style={{ zIndex: 1000 }}>
        <Box
          width={{ xs: "90%", sm: "90%", md: "600px" }}
          className={classes.modalWrap}
        >
          <AppBar position="static" color="default" align="center">
            <Toolbar className={classes.modalHeadWrap}>
              <Typography className={classes.modalHead} variant="h6">
              Add Interview Level 
              </Typography>
            </Toolbar>
          </AppBar>
          <Divider className={classes.modalHeadHr} />

          <Box className={classes.modalContent}>
            <Grid container spacing={3}> 
              <Grid item xs={12} sm={8}>
                <InputLabel className={classes.inputLabel} style={{marginBottom:10}}>
                 Level
                </InputLabel>
                <Select
                  error={getMsg(errors.level, t)}
                  fullWidth
                  margin="dense"
                  input={
                    <OutlinedInput
                      labelWidth="0"
                      name="age"
                      id="outlined-age-simple"
                    />
                  }
                  name="answerType"
                  disabled={true}
                  value={values.level}
                  onChange={(e) =>  handleChange(e.target.value, 'level')}
                >
                  <MenuItem value="0"> {t("common:select")}</MenuItem>
                  {levels &&
                                levels.map((item, index) => (
                                  <MenuItem key={index} value={item.id}>
                                    {t(
                                      `${
                                        "competency." +
                                        item.name
                                          .split(".")[1]
                                          .replace(/TRANSLATION./g, "")
                                          .split(" ")[0]
                                      }`
                                    ) +
                                      " " +
                                      item.name.split(" ")[1]}
                                  </MenuItem>
                                ))}
                </Select>
              </Grid> 
              <Grid item xs={12}>
                <InputLabel className={classes.inputLabel}>
                  {t("question")}
                </InputLabel>
                <TextField
                  error={getMsg(errors.question, t)}
                  name="question"
                  id="outlined-bare"
                  margin="dense"
                  variant="outlined"
                  multiline
                  rowsMax="4"
                  rows="3"
                  className={classes.textField}
                  //margin="dense"
                  //variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxLength: 250 }}
                  placeholder={t("competency.rateexpertise")}
                  value={values.question}
                  onChange={(e) =>  handleChange(e.target.value, 'question')}
                />
              </Grid>
              <Grid item xs={12} className={classes.modalFooter}>
                  <Button
                    variant="contained"
                    className={classes.modalBtnSecondary}
                    onClick={props.onCancel}
                  >
                    {t("common:cancel")}
                  </Button>{" "}
                  &nbsp;
                  {loading ? <CircularProgress className={classes.progress} /> :  <Button
                    variant="contained"
                    //color="secondary"
                    className={classes.modalBtnPrimary}
                     onClick={handleSubmit}
                  >
                    {t("common:submit")}
                  </Button>}
                </Grid>
            </Grid>
          </Box>
        </Box> 
        <MessageBox
         open={errMsg}
         variant="error"
         onClose={handleClose}
         message={errMsg}
        />
      </PerfectScrollbar>
    ); 
}
 

const mapDispatchToProps = { };
const mapStateToProps = (state) => ({
  levels:
  state.employer && state.employer.config && state.employer.config.levels,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(
    withTranslation(["jobPost", "common", "enum"])(AddMoreLevel)
  ))
);

