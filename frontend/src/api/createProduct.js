import configuration from "../utils/configuration.js"; 

function createProduct(ProductData, accessToken) {
    const response = fetch(`${configuration.API_URL}/api/masterdata/create-product`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(ProductData)
    });
    return response;
}

export default createProduct;