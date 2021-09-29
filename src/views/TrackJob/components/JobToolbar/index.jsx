import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";
import classNames from "classnames";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import { Button, IconButton } from "@material-ui/core";
import{withTranslation}from "react-i18next":

// Material icons
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

// Shared components
import { DisplayMode, SearchInput } from "components";

// Component styles
import styles from "./styles";

class JobToolbar extends Component {
  render() {
    const { classes,t, className, selectedUsers } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <div className={classes.row}>
          <span className={classes.spacer} />
          {selectedUsers.length > 0 && (
            <IconButton
              className={classes.deleteButton}
              onClick={this.handleDeleteUsers}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <Button
            className={classes.importButton}
            size="small"
            variant="outlined"
          >
            <ArrowDownwardIcon className={classes.importIcon} /> Import
          </Button>
          <Button
            className={classes.exportButton}
            size="small"
            variant="outlined"
          >
            <ArrowUpwardIcon className={classes.exportIcon} />
            Export
          </Button>
          <Button color="primary" size="small" variant="outlined">
            {t("add")}
          </Button>
        </div>
        <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            placeholder="Search user"
          />
          <span className={classes.spacer} />
          <DisplayMode mode="list" />
        </div>
      </div>
    );
  }
}

JobToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  selectedUsers: PropTypes.array,
};

JobToolbar.defaultProps = {
  selectedUsers: [],
};

export default withStyles(styles)(withTranslation("trackJob")(JobToolbar));
