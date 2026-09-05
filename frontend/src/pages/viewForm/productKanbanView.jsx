import styles from "./ProductMaster.module.css";

function ProductKanbanView({ products }) {
  return (
    <div className={styles.kanbanContainer}>

      {products.length === 0 ? (
        <div className={styles.noProducts}>
          No products found
        </div>
      ) : (
        products.map((product) => (
          <div
            className={styles.productCard}
            key={product.id}
          >

            {/* IMAGE */}

            <div className={styles.productImage}>
              <span>Image</span>
            </div>

            {/* DETAILS */}

            <div className={styles.cardDetails}>

              <h3>{product.product}</h3>

              <p>
                <strong>Brand:</strong>{" "}
                {product.brandName}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {product.category}
              </p>

              <p>
                <strong>Selling Price:</strong>{" "}
                ₹
                {Number(
                  product.sellingPrice
                ).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Cost:</strong>{" "}
                ₹
                {Number(
                  product.cost
                ).toLocaleString("en-IN")}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {product.quantity}
              </p>

            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default ProductKanbanView;