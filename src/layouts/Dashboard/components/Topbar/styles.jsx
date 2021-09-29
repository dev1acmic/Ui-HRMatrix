export default theme => ({
  root: {
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.11)",
    display: "flex",
    alignItems: "center",
    height: "64px",
    zIndex: theme.zIndex.appBar,
    background:
      "linear-gradient(94.9deg, #363738 -0.67%, #717171 96.98%), #3188C8"
    //backgroundColor: theme.palette.primary.main
  },
  toolbar: {
    minHeight: "auto",
    width: "100%"
  },
  title: {
    marginLeft: theme.spacing.unit,
    color: "#fff",
    fontSize: 22,
    fontWeight: 300,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  menuButton: {
    marginLeft: "-4px",
    color: "white"
  },
  signOutButton: {
    marginLeft: theme.spacing.unit,
    color: "white"
  },
  notificationsButton: {
    color: "white",
    fontSize: 50,
    marginLeft: 10,
    marginRight: 10,
    "& svg": {
      width: 28,
      height: 28
    }
  },
  avatarButton: {
    color: "white"
  },
  avatarImage: {
    border: "2px solid #fff",
    width: 30,
    height: 30
  },

  snackRootError: {
    backgroundColor: "#d32f2f"
  },
  snackRootWarning: {
    backgroundColor: "#ffa000"
  },
  snackRootSuccess: {
    backgroundColor: "#43a047"
  },
  snackRootInfo: {
    backgroundColor: theme.palette.primary.main
  },
  snackAction: {
    backgroundColor: "transparent"
  },
  snackMsg: {
    backgroundColor: "transparent",
    "& span": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        marginRight: 5
      }
    }
  }
});
