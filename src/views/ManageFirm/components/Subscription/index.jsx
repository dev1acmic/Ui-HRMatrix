import React, { useState, useEffect } from "react";
import {
  Container,
  withStyles,
  Grid,
  InputLabel,
  TextField,
  FormControl,
  FormLabel,
  Button,
  SnackbarContent,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";
import MessageBox from "util/messageBox";
import { withRouter } from "react-router-dom";
import { Dashboard as DashboardLayout } from "layouts";
import styles from "../../../JobPost/components/styles";
import { useTranslation } from "react-i18next";
import { getMsg } from "util/helper";

import PaymentCard from "react-payment-card-component";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  addsubscription,
  loadOrganization,
} from "services/organization/action";
import validate from "validate.js";
import schema from "./schema";

const Subscription = (props) => {
  const { classes } = props;
  const { t } = useTranslation("common");
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  const [card, setCard] = useState(null);
  const [stripeCustomerId, setStripeCustomerId] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subErrMsg, setSubErrMsg] = useState(false);
  const [shwSubErr, setShwSubErr] = useState(false);

  const [succMsg, setSuccMsg] = useState(false);
  const [shwSucc, setShwSucc] = useState(false);

  const CARD_ELEMENT_OPTIONS = {
    hidePostalCode: true,
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const ELEMENTS_OPTIONS = {
    fonts: [
      {
        cssSrc: "https://fonts.googleapis.com/css?family=Roboto",
      },
    ],
  };

  useEffect(() => {
    if (props.orgId) {
      props.loadOrganization(props.orgId);
    }
  }, [props.orgId]);

  useEffect(() => {
    if (props.organization && Object.keys(props.organization).length > 0) {
      if (
        props.organization.stripeCustomerId &&
        props.organization.stripeSubscriptionItemId
      ) {
        setStripeCustomerId(props.organization.stripeCustomerId);

        let stripe = props.organization.stripe;
        if (stripe) {
          setIsSubscribed(true);
          setCard(stripe.card);
          setLoading(false);
        } else {
          setIsSubscribed(false);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, [props.organization]);

  const CardField = ({ onChange }) => {
    return (
      <div className="FormRow">
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={onChange} />
      </div>
    );
  };

  const SubmitButton = ({ processing, error, children, disabled }) => (
    <Button
      variant="contained"
      color="secondary"
      type="submit"
      disabled={processing || disabled}
      className={classes.button}
    >
      {processing ? "Processing..." : children}
    </Button>
  );

  const Information = ({}) =>
    card && (
      // <SnackbarContent
      //   style={{ backgroundColor: "rgb(18, 65, 93)" }}
      //   message={"Your subscription is now active."}
      // />
      <div>
        <PaymentCard
          //bank="itau"
          //model="personnalite"
          type="black"
          brand={card.brand}
          number={"XXXX-XXXX-" + card.last4}
          //cvv="202"
          holderName={props.organization.name}
          expiration={
            String(card.exp_month.toString()).padStart(2, "0") +
            "/" +
            card.exp_year.toString().substr(2, 2)
          }
          flipped={false}
        />

        <ResetButton onClick={reset} />
      </div>
    );
  function handleCloseSub() {
    setShwSubErr(false);
  }

  function close() {
    setShwSucc(false);
  }

  const reset = () => {
    setCard(null);
    setIsSubscribed(false);
    setShwSubErr(null);
    setShwSucc(null);
  };

  const back = () => {
    let stripe = props.organization.stripe;
    if (stripe) {
      setIsSubscribed(true);
      setCard(stripe.card);
      setLoading(false);
    } else {
      reset();
    }
  };

  const ResetButton = ({ onClick }) => (
    <Button
      onClick={onClick}
      variant="contained"
      color="secondary"
      type="button"
      style={{ marginTop: "12px" }}
      className={classes.button}
    >
      {t("common:changesubscription")}
    </Button>
  );

  const Back = ({ onClick }) => (
    <Button
      onClick={onClick}
      variant="contained"
      color="primary"
      type="button"
      className={classes.button}
    >
      {t("cancel")}
    </Button>
  );

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [cardComplete, setCardComplete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({ email: null, name: null });
    const [errMsg, setErrMsg] = useState(false);
    const [shwErr, setShwErr] = useState(false);

    const [billingDetails, setBillingDetails] = useState({
      email: props.profile && props.profile.email,
      name: props.organization && props.organization.name,
    });

    function handleClose() {
      setShwErr(false);
    }

    function validateForm() {
      const errors = validate(billingDetails, schema);

      setErrors(errors || {});
      let valid = errors ? false : true;

      if (!valid) {
        setShwErr(true);
        if (billingDetails.email && errors.email) {
          setErrMsg(errors.email[0]);
        } else {
          setErrMsg(t("common:errMsg.fillReqInfo"));
        }

        setBillingDetails(billingDetails);
      }

      return valid;
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (validateForm()) {
        if (!stripe || !elements) {
          // Stripe.js has not loaded yet. Make sure to disable
          // form submission until Stripe.js has loaded.
          return;
        }

        if (error) {
          elements.getElement("card").focus();
          setErrMsg(error.message);
          setShwErr(true);
          return;
        }

        if (cardComplete) {
          setProcessing(true);
        }
        let data;
        // if (!stripeCustomerId) {
        const payload = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
          billing_details: billingDetails,
        });
        if (payload.error) {
          setErrMsg(payload.error.message);
          setShwErr(true);
          setProcessing(false);
          // setError(payload.error);
        } else {
          data = {
            paymentMethod: payload.paymentMethod.id,
            stripeCustomerId: stripeCustomerId ? stripeCustomerId : null,
            priceId: process.env.REACT_APP_STRIPE_JOB_PRICE,
            parttimePriceId: process.env.REACT_APP_STRIPE_JOB_PARTTIME_PRICE,
            contractPriceId: process.env.REACT_APP_STRIPE_JOB_CONTRACT_PRICE,
            internshipPriceId:
              process.env.REACT_APP_STRIPE_JOB_INTERNSHIP_PRICE,
            seasonalPriceId: process.env.REACT_APP_STRIPE_JOB_SEASONAL_PRICE,
            email: billingDetails.email,
            id: props.orgId,
            name: billingDetails.name,
            isCreateSubscription: true,
          };
          //update the customer by updating payment method only
          if (stripeCustomerId) {
            data.isCreateSubscription = false;
            data.isUpdatePaymentMethod = true;
          }
          await props.addsubscription(data).then((result) => {
            let res = result.organization;
            let subscription = result.stripe;
            if (res) {
              if (
                res &&
                res.stripeCustomerId &&
                res.stripePaymentMethodId &&
                res.stripeSubscriptionId &&
                res.stripeSubscriptionItemId &&
                res.stripeStatusFlag
              ) {
                setProcessing(false);
                setStripeCustomerId(res.stripeCustomerId);
                if (subscription) {
                  setCard(subscription.card);
                  setIsSubscribed(true);
                }
                if (res.stripeStatusReason) {
                  setSubErrMsg(res.stripeStatusReason);
                  setShwSubErr(true);
                  setIsSubscribed(false);
                } else {
                  setSuccMsg("Your subscription is now active.");
                  setShwSucc(true);
                }
              } else {
                setSubErrMsg(res.stripeStatusReason);
                setShwSubErr(true);
                setBillingDetails(billingDetails);
              }
            } else {
              setProcessing(false);
            }
          });
        }
      }
    };

    if (!stripe || !elements) {
      return <CircularProgress className={classes.progress} />;
    }
    if (stripe) {
      return (
        <form className="Form" onSubmit={handleSubmit}>
          <MessageBox
            open={shwErr}
            variant="error"
            onClose={handleClose}
            message={errMsg}
          />
          <Grid container spacing={3}>
            {/* <Grid container item spacing={3} className={classes.formContainer}>
              <Grid item xs={12} md={8}>
                <InputLabel className={classes.inputLabel}>
                  Company Name
                </InputLabel>
                <TextField
                  id="outlined-bare"
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  disabled
                  inputProps={{ "aria-label": "bare", maxlength: 85 }}
                  placeholder="Company Name"
                  onChange={(e) => {
                    setBillingDetails({
                      ...billingDetails,
                      name: e.target.value,
                    });
                  }}
                  value={billingDetails.name || ""}
                  error={errors.name}
                />
              </Grid>
            </Grid>*/}
            <Grid container item spacing={3} className={classes.formContainer}>
              <Grid item xs={12} sm={6} md={8}>
                <InputLabel className={classes.inputLabel}>
                  {t("email")}
                </InputLabel>
                <TextField
                  id="outlined-bare"
                  disabled
                  className={classes.textField}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  inputProps={{ "aria-label": "bare", maxlength: 45 }}
                  placeholder={t("email")}
                  value={billingDetails.email}
                  onChange={(e) => {
                    setBillingDetails({
                      ...billingDetails,
                      email: e.target.value,
                    });
                  }}
                  error={getMsg(errors.email, t)}
                />
              </Grid>
            </Grid>

            {loading && <CircularProgress className={classes.progress} />}

            {!loading && !isSubscribed && (
              <Grid
                container
                item
                spacing={3}
                className={classes.formContainer}
                style={{ float: "left" }}
              >
                <Grid item xs={12} sm={6} md={8}>
                  <InputLabel className={classes.inputLabel}>
                    {t("cardDet")}
                  </InputLabel>

                  <CardField
                    onChange={(e) => {
                      setError(e.error);

                      setCardComplete(e.complete);
                    }}
                  />
                </Grid>
              </Grid>
            )}
            {!loading && !isSubscribed && (
              <Grid
                container
                item
                spacing={3}
                className={classes.formContainer}
              >
                <Grid item xs={12} sm={6} md={8}>
                  {/* {error && <ErrorMessage>{error.message}</ErrorMessage>} */}

                  <SubmitButton
                    processing={processing}
                    error={error}
                    disabled={!stripe}
                  >
                    {t("subscribe")}
                  </SubmitButton>

                  <Back onClick={back} />
                </Grid>
              </Grid>
            )}
            {!loading && isSubscribed && (
              <Grid
                container
                item
                spacing={3}
                className={classes.formContainer}
              >
                <Grid item xs={12} sm={6} md={8}>
                  <Information />
                </Grid>
              </Grid>
            )}
          </Grid>
        </form>
      );
    }
  };

  return (
    <DashboardLayout title={t("dashboard")}>
      <Container className={classes.root}>
        <MessageBox
          open={shwSubErr}
          variant="error"
          onClose={handleCloseSub}
          message={subErrMsg}
        />
        <MessageBox
          open={shwSucc}
          variant="success"
          onClose={close}
          message={succMsg}
        />
        <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
          <CheckoutForm />
        </Elements>
      </Container>
    </DashboardLayout>
  );
};
const mapDispatchToProps = { addsubscription, loadOrganization };

const mapStateToProps = (state) => ({
  roles: state.admin && state.admin.roles,
  profile: state.profile || null,
  organization: state.organization || null,
  orgId: state.profile.orgId,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Subscription))
);
