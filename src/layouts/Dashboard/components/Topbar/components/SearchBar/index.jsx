import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { IconButton, InputBase } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import styles from "./styles";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getJobsbyEmployer } from "services/jobPost/action";
import {
  isRoleAdmin,
  isRoleHM,
  isRoleRecruiter,
  isRoleTA,
  isTypeEmployer,
} from "util/roleUtil";
import { Roles, Types } from "util/enum";
import { useTranslation } from "react-i18next";

const SearchBar = (props) => {
  const { classes } = props;
  const { roles } = props.profile;
  const { t } = useTranslation("common");
  // create a ref to store the textInput DOM element
  const textInput = React.createRef();

  const [role, setRole] = useState();
  const [type, setType] = useState(props.profile.type);
  const rowsPerPage = 10;
  const page = 0;
  const [keyword, setKeyword] = useState("");

  const userId = props.profile.id;

  useEffect(() => {
    let role;
    if (isRoleTA(roles)) {
      role = Roles.TalentAcquisitionTeam;
    } else if (isRoleHM(roles)) {
      role = Roles.HiringManager;
    } else if (isRoleRecruiter(roles)) {
      role = Roles.Recruiter;
    } else if (isRoleAdmin(roles)) {
      role = Roles.Admin;
    }

    if (isTypeEmployer(type)) {
      setType(Types.Employer);
    }

    setRole(role);
  }, []);

  const focusTextInput = () => {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    textInput.current.focus();
  };

  const handleInputChange = (value) => {
    setKeyword(value);
  };

  const handleSearch = () => {
    if (keyword) {
      props
        .getJobsbyEmployer(userId, role, rowsPerPage, page, "", "", keyword)
        .then((res) => {
          props.history.push("/rc/search");
        });
    }
  };

  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setKeyword("");
    }
  };

  return (
    <div className={classes.searchBarWrapper}>
      <IconButton onClick={focusTextInput} className={classes.searchIcon}>
        <SearchIcon />
      </IconButton>
      <InputBase
        label="My Textfield"
        type="search"
        id="mui-theme-provider-input"
        inputRef={textInput}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "Search" }}
        value={keyword}
        onChange={(event) => handleInputChange(event.target.value)}
        onKeyPress={_handleKeyDown}
        onBlur={() => {
          setKeyword("");
        }}
        placeholder={t("search")}
      />
    </div>
  );
};

SearchBar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  //notifications: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
};

const mapDispatchToProps = {
  getJobsbyEmployer: getJobsbyEmployer,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SearchBar))
);
