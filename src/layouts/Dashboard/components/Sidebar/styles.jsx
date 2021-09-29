export default theme => ({
  root: {
    background:
      "linear-gradient(94.85deg, #363738 37.34%, #717171 106.38%), linear-gradient(90.04deg, #3188C8 -0.67%, #38B5ED 96.98%), url(photo-1462899006636-339e08d1844e.jpg), #FFFFFF",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden"
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "64px",
    flexShrink: 0,
    backgroundColor: "#363738",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.11)",
    margin: "0"
  },
  navWrap: {
    height: "100%"
  },
  logoLink: {
    fontSize: 0
  },
  logoImage: {
    cursor: "pointer",
    width: "160px"
  },
  // logoDivider: {
  //   marginBottom: theme.spacing.unit * 2
  // },
  profile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "fit-content"
  },
  avatar: {
    width: "100px",
    height: "100px"
  },
  nameText: {
    marginTop: theme.spacing.unit * 2
  },
  bioText: {},
  profileDivider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  listSubheader: {
    color: theme.palette.text.secondary
  },
  listItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& $listItemIcon": {
        color: "white"
      }
    },
    "& + &": {
      marginTop: theme.spacing.unit
    }
  },
  activeListItem: {
    backgroundColor: theme.palette.primary.main,
    "& $listItemText": {
      color: "white"
    },
    "& $listItemIcon": {
      color: "white",
      marginLeft: "-4px"
    }
  },
  listItemIcon: {
    marginRight: 0,
    color: "white"
  },
  listItemText: {
    fontWeight: 500,
    color: "white"
  },
  listDivider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    backgroundColor: "#828282"
  },
  logoDivider: {
    background:
      "linear-gradient(90.63deg, #EDDA2F 1.57%, #56CCF2 96.56%), #338ECB",
    height: 3
  },
  nested: {
    padding: 0,
    "& span": {
      color: "rgba(255,255,255,.7)",
      fontSize: 13
    },
    "&:hover span": {
      color: "white"
    },
    "& div:nth-child(1)": {
      marginLeft: 40,
      transform: "scale(0.5)",
      minWidth: 20,
      color: "#ccc"
    },
    "& div:nth-child(2)": {
      paddingLeft: 0
    }
  }
});
