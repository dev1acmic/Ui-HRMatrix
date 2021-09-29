export default theme => ({
  root: {},
  modalWrap: {
    transform: "translate(-50%, -10%)",
    top: "10%",
    left: "50%",
    position: "absolute",
    background: "#fff",
    outline: "none",
    //overflowY: 'auto',
    borderRadius: 10,
    //maxHeight: 500,
    marginTop: 40,
    marginBottom: 30,
    overflow: "hidden"
  },
  modalContent: {
    padding: 20
  },
  modalHeadWrap: {
    justifyContent: "center"
  },
  modalHead: {
    fontSize: 16
  },
  modalHeadHr: {
    background:
      "linear-gradient(92.75deg, #2F80ED 1.57%, #56CCF2 96.56%), #338ECB",
    height: 2
  },
  modalFooter: {
    margin: "30px 0"
  },
  modalBtnPrimary: {
    background: "linear-gradient(90deg, #60CE8C 17.24%, #48BDAF 100%), #2196F3",
    "&:hover": {
      background: "#60CE8C"
    }
  },
  modalBtnSecondary: {
    background: "rgba(0, 0, 0, 0.25);"
  },
  modalBtnInline: {
    fontSize: 12,
    padding: "2px 10px",
    lineHeight: "20px",
    textTransform: "capitalize"
  },
  inputLabel: {
    color: "#1044AB"
  },
  group: {
    float: "left",
    flexDirection: "row"
  },
  formContainer: {
    marginTop: 5
  },
  formControl: {
    display: "flex",
    justifyContent: "space-between"
  },
  label: {
    width: "100%",
    justifyContent: "space-between",
    border: "1px solid #ccc",
    paddingLeft: 10,
    borderRadius: 5,
    marginLeft: 0
  },
  subItem: {
    alignItems: "flex-end",
    display: "grid",
    paddingTop: "0px!important"
  },
  //////////////////////For Tags -- Start/////////////////////
  tagsWrap: {
    padding: "5px 10px",
    border: "1px solid rgba(0, 0, 0, .23)",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "flex-end"
  },
  tagsWrapErr: {
    padding: "5px 10px",
    border: "1px solid red",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "flex-end"
  },
  tagsInput: {
    paddingLeft: 5,
    fontSize: 14,
    borderColor: "transparent",
    "&::placeholder": {
      color: "blue",
      fontSize: 10
    },
    "& input": {
      backgroundColor: "white",
      border: "none",
      outline: "none",
      padding: "9px 5px 9px 0",
      minWidth: 170,
      width: 300,
      fontSize: 16,
      color: "rgb(102, 120, 138);"
    },
    "& input::placeholder": {
      fontSize: 16,
      color: "#ccc"
    }
  },
  selectedTag: {
    marginRight: 5,
    margin: 2,
    color: "black",
    "& svg": {
      color: theme.palette.text.secondary
    }
  },
  selectedTagWrap: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap"
  },
  dropDown: {
    border: "1px solid #ccc",
    position: "absolute",
    backgroundColor: "white",
    zIndex: 10000,
    display: "block!important",
    minWidth: 150,
    "& ul": {
      margin: 0,
      padding: 0
    },
    "& li": {
      listStyle: "none",
      padding: "5px 10px"
    }
  },
  activeSugg: {
    backgroundColor: "#c4ebfc"
  },
  suggestion: {
    backgroundColor: "red"
  },
  searchInput: {
    borderColor: "transparent"
  },
  buttonIconErr: {
    color: "red"
  },
  weightWrap: {
    padding: "10px",
    border: "1px solid #d2d2d2",
    borderRadius: "5px",
    textAlign: "center"
  },
  iconTextGradient: {
    background: "linear-gradient(90deg, #30ec7b 17.24%, #4abead 100%)",
    WebkitBackgroundClip: "text!important",
    textFillColor: "transparent",
    fontSize: "36px",
    lineHeight: "40px"
  },
  weightTxt: { fontSize: "14px", fontWeight: "100" },

  reactAutosuggestContainer: {
    position: "relative",
    paddingTop:8,
  },
  
  reactAutosuggestInput: {
    width: "100%",
    height: "30px",
    padding: "18.5px 14px",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 300,
    fontSize: "16px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px"
  },
  reactAutosuggestInputErr:{
    width: "100%",
    height: "30px",
    padding: "18.5px 14px",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 300,
    fontSize: "16px",
    border: "1px solid #f44336",
    borderRadius: "4px"
  },
  
  reactAutosuggestInputFocused: {
    outline: "none"
  },
  
  reactAutosuggestInputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  
  reactAutosuggestSuggestionsContainer: {
    display: "block"
  },
  
  reactAutosuggestSuggestionsContainerOpen: {
    display: "block",
    position: "absolute",
    top: "41px",
    width: "280px",
    border: "1px solid #aaa",
    backgroundColor: "#fff",
    fontFamily: "Helvetica, sans-serif",
    fontWeight: 300,
    fontSize: "16px",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
    zIndex: 2
  },
  
  reactAutosuggestSuggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  
  reactAutosuggestSuggestion: {
    cursor: "pointer",
    padding: "10px 20px"
  },
  
  reactAutosuggestSuggestionHighlighted: {
    backgroundColor: "#ddd"
  }
  
  //////////////////////For Tags -- End/////////////////////
});
