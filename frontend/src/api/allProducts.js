import configuration from "../utils/configuration.js"; 

function getAllProducts(accessToken) {
    const response = fetch(`${configuration.API_URL}/api/masterdata/all-products`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return response;
}

export default getAllProducts;