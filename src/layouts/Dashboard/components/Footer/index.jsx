import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";
import classNames from "classnames";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import { Typography } from "@material-ui/core";

// Component styles
const styles = theme => ({
  root: {
    padding: 32,
    paddingBottom: 10,
    paddingTop: 1,
    background: "#f9fafb",
    borderTop: "1px solid #eaeaea"
  },
  company: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 0.5,
    fontSize: 12,
    color: "#828282"
  }
});

class Footer extends Component {
  render() {
    const { classes, className } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <Typography className={classes.company} variant="body1">
          Copyright &copy; 2019 Hiring Matrix, all rights reserved.
        </Typography>
        {/* <Typography variant="caption"></Typography> */}
      </div>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
