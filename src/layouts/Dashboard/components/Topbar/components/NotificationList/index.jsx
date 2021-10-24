import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";

// Externals
import PropTypes from "prop-types";
import classNames from "classnames";

// Material helpers
import {withStyles} from "@material-ui/core";
import moment from "moment";

// Material components
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
} from "@material-ui/core";

// Material icons
import {
  WorkOutline as JobIcon,
  HowToRegOutlined as ProfileIcon,
  VerifiedUserOutlined as HiringIcon,
  SupervisedUserCircleOutlined as RecruiterIcon,
} from "@material-ui/icons";
import {useTranslation} from "react-i18next";

// Component styles
import styles from "./styles";

const icons = {
  order: {
    icon: <JobIcon />,
    color: "#fb6e5a",
  },
  user: {
    icon: <ProfileIcon />,
    color: "#58c897",
  },
  product: {
    icon: <RecruiterIcon />,
    color: "#fbb357",
  },
  feature: {
    icon: <HiringIcon />,
    color: "#2196f3",
  },
};

const getCategoryIcon = (category) => {
  switch (category) {
    case "JP":
      return icons["order"];
    case "JA":
      return icons["user"];
    case "IP":
      return icons["product"];
    case "NF":
      return icons["feature"];
    default:
      return icons["feature"];
  }
};

const NotificationList = (props) => {
  const {className, classes} = props;
  const {t} = useTranslation("jobPost");
  const rootClassName = classNames(classes.root, className);

  const htmlNotificationItem = (notification, index) => {
    const {category, id, message, createdAt, isRead, params} = notification;
    const categoryIcon = getCategoryIcon(category);
    const readStyle = isRead ? null : classes.listRead;

    return (
      <>
        <ListItem
          className={classNames(classes.listItem, readStyle)}
          onClick={async () => {
            if (!isRead) {
              await props.onSelect(id);
            }
            props.toJobPost(params, category);
          }}
        >
          <ListItemIcon
            className={classes.listItemIcon}
            style={{color: categoryIcon.color}}
          >
            {categoryIcon.icon}
          </ListItemIcon>
          <ListItemText
            classes={{secondary: classes.listItemTextSecondary}}
            primary={message}
            secondary={moment(createdAt).fromNow()}
          />
        </ListItem>
        <Divider />
      </>
    );
  };

  const showMoreButton = (notifications) => {
    if (notifications.list.length < notifications.total) {
      return (
        <Button
          style={{marginLeft: 5}}
          //color="primary"
          size="small"
          variant="contained"
          onClick={() => {
            props.onMore();
          }}
        >
          {t("loadMore")}
        </Button>
      );
    }
    return null;
  };

  const htmlNotificationList = () => {
    const {notifications, isNotificationLoading} = props;

    if (isNotificationLoading) {
      return (
        <Fragment>
          <div className={classes.loaderWrap}>
            <CircularProgress></CircularProgress>
          </div>
        </Fragment>
      );
    }

    return notifications.list.length > 0 ? (
      <Fragment>
        <div className={classes.notiHeader}>
          <Typography variant="h6">{t("platformnotifications")}</Typography>
        </div>
        <div className={classes.content} style={{height: 250}}>
          <PerfectScrollbar>
            <List component="div">
              {notifications.list.map((notification, index) =>
                htmlNotificationItem(notification, index)
              )}
            </List>
            <div className={classes.footer}>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  props.onUnReadAll(props.userId);
                  props.onClose();
                }}
              >
                {t("markAllRead")}
              </Button>

              {showMoreButton(notifications)}
            </div>
          </PerfectScrollbar>
        </div>
      </Fragment>
    ) : (
      <div className={classes.empty}>
        <Typography variant="h5">There's nothing here...</Typography>
      </div>
    );
  };

  return (
    <div className={rootClassName} style={{overflow: "hidden"}}>
      {htmlNotificationList()}
    </div>
  );
};

NotificationList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
};

NotificationList.defaultProps = {
  notifications: {},
  onSelect: () => {},
};

export default withStyles(styles)(NotificationList);
