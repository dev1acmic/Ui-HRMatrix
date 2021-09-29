import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
// Material components
import { Grid } from "@material-ui/core";

import ResetPassword from "./components/ResetPassword";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  },
  content: {
    marginTop: "150px",
    textAlign: "center"
  },
  image: {
    display: "inline-block",
    marginTop: "50px",
    maxWidth: "100%",
    width: "554px"
  }
});

class Reset extends Component {
  state = {
    token: this.props.match.params.token || null
  };
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container justify="center" spacing={4}>
          <Grid item lg={6} xs={12}>
            <div className={classes.content}>
              <ResetPassword token={this.state.token} />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Reset.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = {};

const mapStateToProps = state => ({});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Reset))
);
