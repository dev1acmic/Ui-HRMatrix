import userBg from "../../../../../../assets/images/loginBoxBg.png";
export default theme => ({
  root: {
    width: "250px",
    maxWidth: "100%"
  },
  header: {
    backgroundColor: "#fff",
    padding: "30px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    backgroundImage: "url(" + userBg + ")",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom"
  },
  subtitle: {
    color: theme.palette.text.secondary
  },
  content: {
    backgroundColor: "#3f4041"
  },
  footer: {
    padding: 10,
    display: "flex",
    justifyContent: "space-around"
  },
  avatarImage: {
    height: 75,
    width: 75,
    border: "2px solid #2196f3"
  },
  avatarDivider: {
    background:
      "linear-gradient(90.63deg, #EDDA2F 1.57%, #56CCF2 96.56%), #338ECB",
    height: 3
  }
});
