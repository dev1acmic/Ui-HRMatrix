import React, { useState, forwardRef, useImperativeHandle ,useEffect} from "react";
 
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import {
  Container,
  Typography,  TextField, Grid,InputAdornment,ClickAwayListener
} from "@material-ui/core";
import { 
  Close as CloseIcon, DateRange as DateRangeIcon
} from "@material-ui/icons"; 
import styles from "../style";
import { connect } from "react-redux";  
import { useTranslation } from "react-i18next";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, createStaticRanges } from 'react-date-range';
import {
  addDays,
  subDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  addQuarters,
  startOfQuarter,
  endOfQuarter,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  addYears
} from 'date-fns';
import moment from "moment";

const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfToday: startOfDay(new Date()),
  startOfLastSevenDay: startOfDay(addDays(new Date(), -7)),
  startOfLastThirtyDay: startOfDay(addDays(new Date(), -30)),
  startOfLastNintyDay: startOfDay(addDays(new Date(), -90)),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  startOfQuarter:startOfQuarter(new Date(), -1),
  endOfQuarter:endOfQuarter(new Date(), -1),
  startOfLastQuarter: startOfQuarter(addQuarters(new Date(), -1)),
  endOfLastQuarter: endOfQuarter(addQuarters(new Date(), -1)),
  startOfYear: startOfYear(new Date()),
  endOfYear: endOfYear(new Date()),
  startOflastYear: startOfYear(addYears(new Date(), -1)),
  endOflastYear: endOfYear(addYears(new Date(), -1))
};

const Filter = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
        startDate,endDate
    };
  });

  const sideBarOptions = () => {
    const customDateObjects = [ 
        {
            label: 'Today',
            range: () => ({
                startDate: defineds.startOfToday,
                endDate: defineds.endOfToday
            })
      },    
      {
        label: 'Yesterday',
        range: () => ({
          startDate: defineds.startOfYesterday,
          endDate: defineds.endOfYesterday,
        }),
      },
        // {
        //     label: 'Last 7 Days',
        //     range: () => ({
        //         startDate: defineds.startOfLastSevenDay,
        //         endDate: defineds.endOfToday
        //     })
        // },
        // {
        //     label: 'Last 30 Days',
        //     range: () => ({
        //         startDate: defineds.startOfLastThirtyDay,
        //         endDate: defineds.endOfToday
        //     })
        // },
        // {
        //     label: 'Last 90 Days',
        //     range: () => ({
        //         startDate: defineds.startOfLastNintyDay,
        //         endDate: defineds.endOfToday
        //     })
        // },
        {
            label: 'This Week',
            range: () => ({
                startDate: defineds.startOfWeek,
                endDate: defineds.endOfWeek
            })
        },
        {
            label: 'Last Week',
            range: () => ({
                startDate: defineds.startOfLastWeek,
                endDate: defineds.endOfLastWeek
            })
        },
        {
            label: 'This Month',
            range: () => ({
                startDate: defineds.startOfMonth,
                endDate: defineds.endOfMonth
            })
        },
        {
              label: 'Last Month',
              range: () => ({
                  startDate: defineds.startOfLastMonth,
                  endDate: defineds.endOfLastMonth
              })
        },
          {
            label: 'This Quarter',
            range: () => ({
                startDate: defineds.startOfQuarter,
                endDate: defineds.endOfQuarter
            })
        },
        {
          label: 'Last Quarter',
          range: () => ({
              startDate: defineds.startOfLastQuarter,
              endDate: defineds.endOfLastQuarter
          })
        },
        {
            label: 'This Year',
            range: () => ({
                startDate: defineds.startOfYear,
                endDate: defineds.endOfYear
            })
        },
        {
            label: 'Last Year',
            range: () => ({
                startDate: defineds.startOflastYear,
                endDate: defineds.endOflastYear
            })
        }
    ];
 
    return customDateObjects;
};

  const { classes,  } = props;
  const { t } = useTranslation(["reports", "common"]); 
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(defineds.startOfYear.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
  const[endDate,setEndDate]= useState(defineds.endOfYear.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
  const [state, setState] = useState([
    {
      startDate: defineds.startOfYear,
      endDate: defineds.endOfYear,
      key: 'selection'
    }
  ]);
  const [isFiltered, setIsFiltered] = useState(null);
 
 
 
  const [label,setLabel]= useState("This Year");
 

  const sideBar = sideBarOptions();
 
    const staticRanges = [
        // ...defaultStaticRanges,
        ...createStaticRanges(sideBar)
    ];
  
  // function handleApply()
  // {
  //   setShow(false);
  //   props.filter();
  //   let label = staticRanges && staticRanges.filter(c => c.range().startDate === state[0].startDate);
  //   if (label && label.length > 0)
  //   {
  //     setLabel(label[0].label);
  //   }

  //   if (label && label.length === 0 && state[0].startDate && state[0].endDate)
  //   {
  //     setLabel(null);
  //   }

  // }

  useEffect(() => { 
    if (isFiltered)
    {
      handleClear();
     }
   
  }, [props.isSuperAdminAgency]);

  function handleClear()
  {
    props.filter();
    setStartDate(defineds.startOfYear.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
    setEndDate(defineds.endOfYear.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
    setLabel("This Year");
    setState([{
      startDate: defineds.startOfYear,
      endDate: defineds.endOfYear,
      key: 'selection'
    }]); 
  }

  const handleClickAway = () => {
    setShow(false);
  }; 

  useEffect(() => { 
    if (state[0].startDate.toDateString() === new Date(startDate).toDateString() && isFiltered)
    {
      props.filter();
    }
    
  }, [endDate]);
 
  function handleSelect(ranges) {  
    setIsFiltered(true);
    if (ranges.selection.startDate.toDateString() === new Date(startDate).toDateString())
    {
      setShow(false);
    }


    setState([ranges.selection]); 
    setStartDate(ranges.selection.startDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })); 
    setEndDate(ranges.selection.endDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));  
    
    let label = staticRanges && staticRanges.filter(c => c.range().startDate === ranges.selection.startDate);

    if (label && label.length > 0)
    {
      setLabel(label[0].label);
      setShow(false);
    } 

    if (label && label.length === 0 && ranges.selection.startDate && ranges.selection.endDate)
    {
      setLabel(null);  
    } 
  }
  
  return (
    <Container className={classes.root} style={{display: 'flex', justifyContent: 'space-between',paddingBottom:0}}>
      <Typography
        variant="h2"
        className={classes.subHead}
       // style={{ paddingTop: 15, borderTop: "1px solid #e0e0e0" }}
      >
        {t("detail")}
      </Typography>
    
      <Grid container spacing={3} style={{textAlign:"right"}} className={classes.calendarWrap}>
        <Grid container item spacing={3} style={{
              padding: '8px'}}>
            <Grid item xs={12}>  
            <TextField
              variant="outlined"
              style={{backgroundColor:"white"
              }}  
              size="small"
                className={classes.calendarText}
                id="input-with-icon-textfield" 
              InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRangeIcon onClick={(event) =>
                          setShow(true)
                      } />
                    </InputAdornment>
                  ),
                }}
                autoComplete='off'
                onFocus={(event) =>
                  setShow(true)
                 } 
                value={label?label: startDate && startDate + " - " + endDate} 
                
              />                 
          </Grid> 
          </Grid>
        </Grid>
      {show && <>
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={handleClickAway}
        >
          <DateRangePicker
            showSelectionPreview={true} 
            editableDateInputs={true}
            months={2}
            maxDate={new Date()} 
            className={classes.dropdown}
            ranges={state}
            direction="horizontal"
            onChange={(e) => { handleSelect(e) }} 
            staticRanges={staticRanges}
            dateDisplayFormat={"MM/dd/yyyy"}
            inputRanges={[]}   
          />
        </ClickAwayListener>
          </>
        } 
     
    </Container>
  );
});

Filter.propTypes = {
  className: PropTypes.string,
};

const mapDispatchToProps = {};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(withStyles(styles)(Filter));
