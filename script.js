const searchInput = document.getElementById("searchInput");
let productsList = []; // Keep all products here to search/filter

// Add search functionality
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = productsList.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
  renderInventory(filtered);
});

// script.js

const API_URL = "http://localhost:3000/products";
const form = document.getElementById("productForm");
const inventoryBody = document.getElementById("inventoryBody");

// CREATE Product
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newProduct = {
    name: form.name.value,
    category: form.category.value,
    price: Number(form.price.value),
    quantity: Number(form.quantity.value),
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });

  form.reset();
  loadInventory();
});

window.addEventListener("DOMContentLoaded", loadInventory);
// Fetch products from JSON Server and render the table + dashboard
async function loadInventory() {
  const res = await fetch(API_URL);
  const products = await res.json();
  productsList = products; // Save all products for search
  renderInventory(products); // Show in table
  updateSummary(products);  // Update totals
}

// Render the inventory table from the product list
function renderInventory(products) {
  inventoryBody.innerHTML = ""; // Clear table before rendering

  products.forEach((product) => {
    inventoryBody.innerHTML += `
      <tr class="border-t">
        <td class="p-2">${product.name}</td>
        <td class="p-2">${product.category}</td>
        <td class="p-2">${product.price}</td>
        <td class="p-2">${product.quantity}</td>
        <td class="p-2 space-x-2">
          <button onclick="editProduct(${product.id})" class="bg-yellow-400 px-2 py-1 rounded">Edit</button>
          <button onclick="deleteProduct(${product.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </td>
      </tr>
    `;
  });
}
console.log("fetched products ",products);


// UPDATE Product
function editProduct(id) {
  const row = event.target.closest("tr");
  const name = row.children[0].textContent;
  const category = row.children[1].textContent;
  const price = row.children[2].textContent;
  const quantity = row.children[3].textContent;

  const updatedName = prompt("Edit Name", name);
  const updatedCategory = prompt("Edit Category", category);
  const updatedPrice = prompt("Edit Price", price);
  const updatedQuantity = prompt("Edit Quantity", quantity);

  if (updatedName && updatedCategory && updatedPrice && updatedQuantity) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: updatedName,
        category: updatedCategory,
        price: Number(updatedPrice),
        quantity: Number(updatedQuantity),
      }),
    }).then(loadInventory);
  }
}

// DELETE Product
function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then(loadInventory);
  }
}

// Initial Load
loadInventory();
function updateSummary(products) {
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("totalQuantity").textContent = totalQuantity;
  document.getElementById("totalValue").textContent = `Ksh ${totalValue.toLocaleString()}`;
}
function updateSummary(products) {
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("totalQuantity").textContent = totalQuantity;
  document.getElementById("totalValue").textContent =` Ksh ${totalValue.toLocaleString()}`;
}