import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { IconButton, InputBase } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import styles from "./style";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.searchBarWrapper}>
        <IconButton
          onClick={this.focusTextInput}
          className={classes.searchIcon}
        >
          <SearchIcon />
        </IconButton>
        <InputBase
          label="My Textfield"
          id="mui-theme-provider-input"
          inputRef={this.textInput}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "Search" }}
          value={this.props.searchTerm}
          onChange={this.props.handleSearchChange}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
};

export default withStyles(styles)(SearchBar);
