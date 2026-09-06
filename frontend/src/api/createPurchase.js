import configuration from "../utils/configuration.js";

function createPurchase(purchaseData, accessToken) {
  return fetch(
    `${configuration.API_URL}/api/masterdata/create-purchase`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      credentials: "include",

      body: JSON.stringify(purchaseData),
    },
  );
}

export default createPurchase;