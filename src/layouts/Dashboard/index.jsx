import React, { Component, Fragment } from "react";

// Externals
import classNames from "classnames";
import compose from "recompose/compose";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Material helpers
import { withStyles, withWidth } from "@material-ui/core";

// Material components
import { Drawer } from "@material-ui/core";

// Custom components
import { Sidebar, Topbar } from "./components";
import { removeError } from "services/error/action";
import MessageBox from "util/messageBox";

// Component styles
import styles from "./styles";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    const isMobile = ["xs", "sm", "md"].includes(props.width);

    this.state = {
      isOpen: !isMobile,
    };
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  handleToggleOpen = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  showMsgBox = () => {
    return this.props.error.message && this.props.error.message !== "";
  };

  handleCloseMsg = () => {
    this.props.removeError();
  };

  render() {
    const { classes, width, title, children } = this.props;
    const { isOpen } = this.state;

    const isMobile = ["xs", "sm", "md"].includes(width);
    const shiftTopbar = isOpen && !isMobile;
    const shiftContent = isOpen && !isMobile;

    return (
      <Fragment>
        <MessageBox
          open={this.showMsgBox()}
          variant="error"
          onClose={this.handleCloseMsg}
          message={this.props.error.message}
        />
        <Topbar
          className={classNames(classes.topbar, {
            [classes.topbarShift]: shiftTopbar,
          })}
          isSidebarOpen={isOpen}
          onToggleSidebar={this.handleToggleOpen}
          title={title}
        />
        <Drawer
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
          onClose={this.handleClose}
          open={isOpen}
          variant={isMobile ? "temporary" : "persistent"}
        >
          <Sidebar className={classes.sidebar} />
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: shiftContent,
          })}
        >
          {children}
          {/* <Footer /> */}
        </main>
      </Fragment>
    );
  }
}

const mapDispatchToProps = {
  removeError,
};
const mapStateToProps = (state) => ({
  error: state.error,
});

Dashboard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  width: PropTypes.string.isRequired,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(compose(withStyles(styles), withWidth())(Dashboard));
