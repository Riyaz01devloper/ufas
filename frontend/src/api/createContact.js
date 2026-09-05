import configuration from "../utils/configuration.js"; 

function createContact(contactData, accessToken) {
    const response = fetch(`${configuration.API_URL}/api/masterdata/add-contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(contactData)
    });
    return response;
}

export default createContact;