export default theme => ({
  topbar: {
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0,
    right: "auto",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  topbarShift: {
    marginLeft: "234px",
    width: "calc(-234px + 100vw)"
  },
  drawerPaper: {
    zIndex: 1200,
    width: "234px",
    borderRight: "none"
  },
  sidebar: {
    width: "234px"
  },
  content: {
    marginTop: "64px",
    backgroundColor: "white",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  contentShift: {
    marginLeft: "234px"
  },
  pageScroll: {
    height: "calc(100vh - 64px)",
    overflowY: "scroll",
    overflowX: "hidden"
  }
});
