import configuration from "../../utils/configuration.js";

async function gettypeOfContact(userId, accessToken) {
  const response = await fetch(
    `${configuration.API_URL}/api/masterdata/contacts/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response;
}

export default gettypeOfContact;
