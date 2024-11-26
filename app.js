const API_URL = 'http://localhost:3000/items';
const productTable = document.getElementById('productTable');
const productForm = document.getElementById('productForm');
const productIdInput = document.getElementById('productId');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');


document.addEventListener('DOMContentLoaded', fetchProducts);


async function fetchProducts() {
  const response = await fetch(API_URL);
  const products = await response.json();
  renderProducts(products);
}


function renderProducts(products) {
  productTable.innerHTML = products
    .map(
      (product) => `
      <tr>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>
          <button class="edit" onclick="editProduct(${product.id})">Edit</button>
          <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');
}


productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = productIdInput.value;
  const name = nameInput.value;
  const description = descriptionInput.value;

  const product = { name, description };

  if (id) {

    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
  } else {

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
  }

  productForm.reset();
  fetchProducts();
});


async function editProduct(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
  
      const product = await response.json();
  

      productIdInput.value = product.id;
      nameInput.value = product.name;
      descriptionInput.value = product.description;
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to fetch product. Please try again.');
    }
  }
  


async function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchProducts();
  }
}
