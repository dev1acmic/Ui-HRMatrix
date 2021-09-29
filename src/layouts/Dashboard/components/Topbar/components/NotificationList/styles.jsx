import notiBg from "../../../../../../assets/images/loginBoxBg.png";
export default theme => ({
  root: {
    width: "350px",
    maxWidth: "100%"
  },
  header: {
    backgroundColor: theme.palette.background.default,
    backgroundImage: "url(" + notiBg + ")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right bottom",
    backgroundSize: "contain",
    paddingBottom: "34px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "34px"
  },
  subtitle: {
    color: theme.palette.text.secondary
  },
  content: {},
  listItem: {
    cursor: "pointer",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: theme.palette.background.default
    }
  },
  listRead: {
    backgroundColor: "#fdffd2"
  },
  loaderWrap: {
    width: "100%",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  notiHeader: {
    padding: 10,
    textAlign: "center",
    paddingBottom: 5,
    borderBottom: "1px solid #ccc"
  },

  listItemIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: "10px",
    borderRadius: "50%",
    marginRight: theme.spacing.unit * 2
  },
  listItemTextSecondary: {
    marignTop: "4px",
    color: theme.palette.text.secondary
  },
  arrowForward: {
    color: theme.palette.text.secondary,
    height: "16px",
    width: "16px"
  },
  footer: {
    paddingBottom: theme.spacing.unit,
    display: "flex",
    justifyContent: "center"
  },
  empty: {
    textAlign: "center",
    padding: theme.spacing.unit * 3
  },
  emptyImageWrapper: {
    marginBottom: theme.spacing.unit * 3
  },
  emptyImage: {
    width: "240px",
    maxWidth: "100%",
    height: "auto"
  }
});
