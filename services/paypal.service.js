import axios from "axios";

const base = process.env.BASE;
const BASE_FRONTEND = process.env.BASE_FRONTEND;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

async function generateAccessToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING API CREDENTIALS");
    }

    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");

    const response = await axios({
      url: `${base}/v1/oauth2/token`,
      method: "post",
      data: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
}

export const createOrder = async (data) => {
  const payload = {
    intent: "CAPTURE",
    purchase_units: data,
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          return_url: `${BASE_FRONTEND}/paypal-success`,
          cancel_url: `${BASE_FRONTEND}/cancel`,
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "Wooly furniture"
        },
      },
    },
  };

  const accessToken = await generateAccessToken();

  const response = await axios({
    url: `${base}/v2/checkout/orders`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    data: JSON.stringify(payload),
  });

  //return approved link
  return response.data.links.find((link) => link.rel === "payer-action").href;
};
amdccc
//capture payment, orderId is token from route
export const capturePaymentOrder = async (orderId) => {
  const accessToken = await generateAccessToken();

  const response = await axios({
    url: `${base}/v2/checkout/orders/${orderId}/capture`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  
  return response.data;
};


export const fetchOrderDetails = async (orderId) => {

  const accessToken = await generateAccessToken();
  
  const response = await axios({
    url: `${base}/rv2/checkout/orders/${orderId}`,
    method: "get",
    headers: {
      Authorization: "Bearer " + accessToken,
    }
  });

  
  return response.data;
}