import bg from "assets/images/bg-login.png";
import splash from "assets/images/img-signin_fr.png";
import loginBox from "assets/images/loginBoxBg.png";

export default (theme) => ({
  root: {
    backgroundImage: "url(" + bg + ")",
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom center",
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflowY: "scroll",
  },
  grid: {
    height: "95%",
  },
  quoteWrapper: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  quote: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    //backgroundImage: "url(" + splash + ")",
    backgroundSize: "80%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "15% 35px",
  },
  container: {
    height: "100%",
    position: "relative",
    paddingTop: 10,
    paddingBottom: 50,
  },
  loginWrap: {
    padding: "40px 30px 60px 30px",
    backgroundColor: "white",
    boxShadow: "0px 3px 25px rgba(11, 133, 193, 0.5)",
    borderRadius: 7,
    width: "100%",
    marginBottom: 75,
    backgroundImage: "url(" + loginBox + ")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom center",
    backgroundSize: "contain",
    [theme.breakpoints.down("md")]: {
      padding: "40px 20px",
      width: "85%",
    },
  },
  topLink: {
    margin: "2px 10px",
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  btnTopLink: {
    padding: "0px 20px 0px 15px",
    fontFamily: "Montserrat",
  },
  topBarRight: {
    textAlign: "right",
    justifyContent: "flex-end",
    alignItems: "center",
    display: "flex",
  },
  loginLogo: {
    width: 225,
    marginTop: "10px",
  },
  quoteInner: {
    textAlign: "center",
    flexBasis: "600px",
  },
  quoteText: {
    color: theme.palette.common.black,
    fontWeight: 300,
    marginTop: 150,
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.common.white,
  },
  bio: {
    color: theme.palette.common.white,
  },
  contentWrapper: {},
  content: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingRight: 24,
  },
  backButton: {},
  contentBody: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
    },
  },
  form: {
    flexBasis: "700px",
    // [theme.breakpoints.down('sm')]: {
    //   paddingLeft: theme.spacing(2),
    //   paddingRight: theme.spacing(2)
    // },
    position: "relative",
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    backgroundColor: "white",
    display: "block",
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "5px 30px",
    marginTop: "-40px",
    borderRadius: 7,
    boxShadow: "0 -9px 16px -8px rgba(11, 133, 193, 0.5)",
    color: theme.palette.primary.main,
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  sugestion: {
    color: theme.palette.text.secondary,
    margin: "0px 0 20px 0",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  fields: {
    marginTop: theme.spacing(2),
  },
  textField: {
    borderColor: "#D8D8D8",
    width: "100%",
    "&::placeholder": {
      color: "blue",
      fontSize: 10,
    },
    "& + & ": {
      marginTop: theme.spacing(2),
    },
    "&:focus $notchedOutline": {
      borderColor: "green",
    },
    "&:hover $notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "& $notchedOutline": {
      borderColor: "#E6E9EC",
    },
  },
  inputOutlined: {
    fontFamily: "Montserrat",
    color: "black",
    fontWeight: 500,
    "&$inputFocused $notchedOutline": {
      borderColor: theme.palette.primary.main,
      borderWidth: 1,
    },
  },
  inputOutlinedG: {
    fontFamily: "Montserrat",
    color: "black",
    fontWeight: 500,
    "&$inputFocused $notchedOutline": {
      borderColor: theme.palette.secondary.main,
      borderWidth: 1,
    },
    "&:hover $notchedOutline": {
      borderColor: theme.palette.secondary.main,
    },
  },

  inputFocused: {},
  notchedOutline: {},
  policy: {
    display: "flex",
    alignItems: "center",
  },
  policyCheckbox: {
    marginLeft: "-14px",
  },
  policyText: {
    display: "inline",
    color: theme.palette.text.secondary,
    fontFamily: "Montserrat",
  },
  policyUrl: {
    color: theme.palette.text.primary,
    "&:hover": {
      cursor: "pointer",
      color: theme.palette.primary.main,
    },
  },
  progress: {
    display: "block",
    marginTop: theme.spacing(2),
    marginLeft: "auto",
    marginRight: "auto",
  },
  signInButton: {
    marginTop: theme.spacing(2),
    float: "right",
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  signUp: {
    marginTop: theme.spacing(3),
    color: theme.palette.text.secondary,
    fontFamily: "Montserrat",
  },
  signUpUrl: {
    color: theme.palette.primary.main,
    fontWeight: "600",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  loginUrl: {
    color: theme.palette.secondary.main,
    fontWeight: "600",
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  forgot: {
    marginTop: theme.spacing(1),
  },
  forgotTxt: {
    color: theme.palette.text.disabled,
    fontSize: 12,
    fontFamily: "Montserrat",
    "&:hover": {
      color: theme.palette.text.secondary,
    },
  },
  fieldError: {
    color: theme.palette.danger.main,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
    fontFamily: "Montserrat",
  },
  submitError: {
    color: theme.palette.danger.main,
    alignText: "center",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    fontFamily: "Montserrat",
  },
  labelRoot: {
    color: "#B9B9B9",
    fontFamily: "Montserrat",
  },
  labelFocused: {
    backgroundColor: theme.palette.primary.main,
    color: "white!important",
    padding: "3px 5px",
    marginLeft: -4,
    height: 20,
    paddingTop: 3,
    marginTop: -2,
    borderRadius: 3,
  },
  labelFocusedG: {
    backgroundColor: theme.palette.secondary.main,
    color: "white!important",
    padding: "3px 5px",
    marginLeft: -4,
    height: 20,
    paddingTop: 3,
    marginTop: -2,
    borderRadius: 3,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  btnMenuIcon: {
    color: "white",
    marginRight: 10,
  },
  menuIcon: {
    color: theme.palette.text.secondary,
    marginRight: 10,
  },
  menuLogin: {
    color: theme.palette.primary.main,
  },
  menuReg: {
    color: theme.palette.secondary.main,
  },
});
