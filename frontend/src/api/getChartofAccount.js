import configuration from "../utils/configuration";

function getChartOfAccount(accessToken) {
    const response = fetch(`${configuration.API_URL}/chart-of-accounts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
    });
    return response;
}

export default getChartOfAccount;