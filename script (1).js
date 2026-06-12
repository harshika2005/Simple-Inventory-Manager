// Load Products from Backend
async function loadProducts() {
    try {
        const response = await fetch("http://localhost:5000/products");
        const products = await response.json();

        const table = document.getElementById("productTable");
        table.innerHTML = "";

        let warning = "";

        products.forEach(product => {
            if (product.stock < 5) {
                warning = "⚠️ Low Stock Alert!";
            }

            table.innerHTML += `
                <tr class="${product.stock < 5 ? "low-stock" : ""}">
                    <td>${product._id.substring(0, 6)}...</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.stock}</td>
                    <td>
                        ${product.stock < 5
                            ? '<span style="color:red;font-weight:bold;">Low Stock</span>'
                            : '<span style="color:green;font-weight:bold;">In Stock</span>'}
                    </td>
                    <td>
                        <button class="addBtn"
                            onclick="updateStock('${product._id}', 1)">
                            + Add
                        </button>

                        <button class="removeBtn"
                            onclick="updateStock('${product._id}', -1)">
                            - Reduce
                        </button>
                    </td>
                </tr>
            `;
        });

        document.getElementById("warning").innerText = warning;

    } catch (err) {
        console.log(err);
        alert("Could not load products!");
    }
}

// Update Stock
async function updateStock(id, change) {
    try {
        const response = await fetch(
            `http://localhost:5000/products/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    change: change
                })
            }
        );

        const data = await response.json();
        console.log(data);

        if (data.warning) {
            alert(data.warning);
        }

        // Reload products after update
        loadProducts();

    } catch (err) {
        console.log(err);
        alert("Failed to update stock!");
    }
}

// Initial Load
window.onload = () => {
    loadProducts();
};