import configuration from "../utils/configuration.js"; 

function getAllProducts() {
    const response = fetch(`${configuration.API_URL}/api/masterdata/all-products`, {
        method: "GET"
    });
    return response;
}

export default getAllProducts;