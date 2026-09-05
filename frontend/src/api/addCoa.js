import configuration from "../utils/configuration.js"; 

function createChartOfAccount(ChartOfAccountData, accessToken) {
    const response = fetch(`${configuration.API_URL}/api/masterdata/add-chart-of-accounts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(ChartOfAccountData)
    });
    return response;
}

export default createChartOfAccount;