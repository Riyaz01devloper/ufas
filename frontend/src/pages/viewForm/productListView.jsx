import styles from "./ProductMaster.module.css";

function ProductListView({ products }) {
  return (
    <div className={styles.tableContainer}>

      <table className={styles.productTable}>

        <thead>
          <tr>
            <th>Select</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Cost</th>
            <th>Selling Price</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>

          {products.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className={styles.noProducts}
              >
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>

                <td>
                  <input type="checkbox" />
                </td>

                <td>{product.product}</td>

                <td>{product.brandName}</td>

                <td>{product.category}</td>

                <td>
                  ₹{Number(product.cost).toLocaleString("en-IN")}
                </td>

                <td>
                  ₹
                  {Number(
                    product.sellingPrice
                  ).toLocaleString("en-IN")}
                </td>

                <td>{product.quantity}</td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default ProductListView;