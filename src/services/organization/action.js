import client from "../feathersApi";
import { errorHandler } from "../error/action";

/*----- ORGANIZATION------*/
export const addsubscription = (data) => async (dispatch) => {
  try {
    const res = await client.service("stripeapi").patch(data.id, data);
    if (res) {
      dispatch({
        type: "SUBSCRIPTION",
        data: res,
      });
      return res;
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadPremiumOrganizations = (limit = -1, pageno = 0) => async (
  dispatch
) => {
  try {
    const res = await client.service("organizations").find({
      query: {
        $limit: limit,
        $skip: pageno * limit, //skip*limit
        $sort: {
          createdAt: -1,
        },
        isPremium: true
      },
    });
    if (res) {
      dispatch({
        type: "LOAD_PREMIUM_ORGANIZATIONS",
        data: res,
      });
      return res;
    }
    return false;
  } catch (error) {
    errorHandler(error);
    return false;
  }
};

export const loadOrganization = (organizationId) => async (dispatch) => {
  try {
    const res = await client.service("organizations").get(organizationId);
    let stripe = null;
    if (res) {
      if (res.stripePaymentMethodId) {
        stripe = await client.service("stripeapi").find({
          query: {
            organizationId: organizationId,
            paymentMethodId: res.stripePaymentMethodId,
          },
        });
      }

      const addr = await client.service("officelocations").find({
        query: {
          organizationId: organizationId,
          isCorporate: true,
        },
      });
      res.stripe = stripe ? stripe : null;
      res.addr = addr.data;
      dispatch({
        type: "LOAD_ORGANIZATION",
        data: res,
      });
    }
  } catch (error) {
    errorHandler(error);
    return false;
  }
};
