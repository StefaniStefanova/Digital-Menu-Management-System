import { db } from './firebase.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

// Elements
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const addBtn = document.getElementById('add-btn');
const productListSection = document.getElementById('product-list-section');
const productTableBody = document.querySelector('#product-table tbody');
const loginBtn = document.getElementById('login-btn');

const categorySelect = document.getElementById('category');
const typeSelect = document.getElementById('type');
const typeWrapper = document.getElementById('typeWrapper');

const searchInput = document.getElementById('search-input');

let allProducts = [];


// ===== TYPE OPTIONS FUNCTION =====
function setTypeOptions(category, selectElement) {
  selectElement.innerHTML = '';

  if (category === 'shots') {
    selectElement.innerHTML = `
      <option value="">Select type</option>
      <option value="single">Single</option>
      <option value="shaker">Shaker</option>
    `;
  }

  else if (category === 'hot-drinks') {
    selectElement.innerHTML = `
      <option value="">Select type</option>
      <option value="espresso">Espresso Selection</option>
      <option value="coffee">Coffee Specialties</option>
      <option value="tea-chocolate">Tea & Hot Chocolate</option>
      <option value="add-ons">Add-ons</option>
    `;
  }
}


// ===== AUTH CHECK =====
onAuthStateChanged(auth, async user => {
  if (user) {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    productListSection.style.display = 'block';
    await renderProductList();
  } else {
    loginSection.style.display = 'block';
    adminSection.style.display = 'none';
    productListSection.style.display = 'none';
  }
});


// ===== LOGIN =====
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});


// ===== CATEGORY CHANGE =====
categorySelect.addEventListener('change', () => {
  if (categorySelect.value === 'shots' || categorySelect.value === 'hot-drinks') {
    typeWrapper.style.display = 'block';
    setTypeOptions(categorySelect.value, typeSelect);
  } else {
    typeWrapper.style.display = 'none';
    typeSelect.innerHTML = '';
  }
});


// ===== ADD ITEM =====
addBtn.addEventListener('click', async () => {

  const category = categorySelect.value;
  const typeValue = typeSelect.value;
  const flavoursInput = document.getElementById('flavours').value;

  const flavoursArray = flavoursInput
    ? flavoursInput.split(',').map(f => f.trim()).filter(f => f !== '')
    : [];

  const item = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    price: Number(document.getElementById('price').value),
    image: document.getElementById('image').value,
    category,
    type: (category === 'shots' || category === 'hot-drinks') ? typeValue : null,
    flavours: flavoursArray,
    available: true
  };

  await addDoc(collection(db, 'menu'), item);
  alert('Added!');
  await renderProductList();
});


// ===== RENDER PRODUCT LIST =====
async function renderProductList() {

  productTableBody.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, 'menu'));

  allProducts = [];

  querySnapshot.forEach(docSnap => {
    allProducts.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  displayProducts(allProducts);
}


// ===== DISPLAY PRODUCTS =====
function displayProducts(products) {

  productTableBody.innerHTML = '';

  if (products.length === 0) {
    productTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;">No products found</td>
      </tr>
    `;
    return;
  }

  products.forEach(item => {

    const tr = document.createElement('tr');

    const flavoursText =
      item.flavours && item.flavours.length > 0
        ? item.flavours.join(', ')
        : '-';

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description || '-'}</td>
      <td>${item.category}</td>
      <td>${item.price}</td>
      <td>${flavoursText}</td>
      <td>${item.type || '-'}</td>
      <td>${item.available ? 'Yes' : 'No'}</td>
      <td>
        <button class="action-btn available-btn">Available</button>
        <button class="action-btn edit-btn">Edit</button>
        <button class="action-btn delete-btn">Delete</button>
      </td>
    `;

    // Toggle availability
    tr.querySelector('.available-btn').addEventListener('click', async () => {
      await updateDoc(doc(db, 'menu', item.id), {
        available: !item.available
      });
      await renderProductList();
    });

    // Delete
    tr.querySelector('.delete-btn').addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this item?')) {
        await deleteDoc(doc(db, 'menu', item.id));
        await renderProductList();
      }
    });

    // ===== EDIT (ОРИГИНАЛНИЯТ ТИ БЛОК) =====
    tr.querySelector('.edit-btn').addEventListener('click', () => {

      tr.innerHTML = `
        <td><input class="edit-name" type="text" value="${item.name}"></td>
        <td><input class="edit-description" type="text" value="${item.description || ''}"></td>
        <td>
          <select class="edit-category">
            <option value="cocktails" ${item.category==='cocktails'?'selected':''}>Cocktails</option>
            <option value="hot-drinks" ${item.category==='hot-drinks'?'selected':''}>Hot drinks</option>
            <option value="cold-drinks" ${item.category==='cold-drinks'?'selected':''}>Cold drinks</option>
            <option value="alcohol" ${item.category==='alcohol'?'selected':''}>Alcohol</option>
            <option value="shots" ${item.category==='shots'?'selected':''}>Shots</option>
            <option value="snacks" ${item.category==='snacks'?'selected':''}>Snacks</option>
          </select>
        </td>
        <td><input class="edit-price" type="text" value="${item.price}"></td>
        <td><input class="edit-flavours" type="text" value="${item.flavours ? item.flavours.join(', ') : ''}"></td>
        <td>
          <select class="edit-type"></select>
        </td>
        <td>${item.available ? 'Yes' : 'No'}</td>
        <td>
          <input class="edit-image" type="text" value="${item.image || ''}">
          <button class="action-btn save-btn">Save</button>
          <button class="action-btn cancel-btn">Cancel</button>
        </td>
      `;

      const editCategory = tr.querySelector('.edit-category');
      const editType = tr.querySelector('.edit-type');

      function updateEditTypeOptions() {
        if (editCategory.value === 'shots' || editCategory.value === 'hot-drinks') {
          editType.style.display = 'inline-block';
          setTypeOptions(editCategory.value, editType);
          editType.value = item.type || '';
        } else {
          editType.style.display = 'none';
        }
      }

      updateEditTypeOptions();

      editCategory.addEventListener('change', () => {
        updateEditTypeOptions();
      });

      tr.querySelector('.save-btn').addEventListener('click', async () => {

        const flavoursInput = tr.querySelector('.edit-flavours').value;

        const flavoursArray = flavoursInput
          ? flavoursInput.split(',').map(f => f.trim()).filter(f => f !== '')
          : [];

        const newCategory = editCategory.value;

        const updatedItem = {
          name: tr.querySelector('.edit-name').value,
          description: tr.querySelector('.edit-description').value,
          category: newCategory,
          price: Number(tr.querySelector('.edit-price').value),
          image: tr.querySelector('.edit-image').value,
          type: (newCategory === 'shots' || newCategory === 'hot-drinks')
                ? editType.value
                : null,
          flavours: flavoursArray,
          available: item.available
        };

        await updateDoc(doc(db, 'menu', item.id), updatedItem);
        await renderProductList();
      });

      tr.querySelector('.cancel-btn').addEventListener('click', async () => {
        await renderProductList();
      });
    });

    productTableBody.appendChild(tr);
  });
}


// ===== SEARCH =====
searchInput.addEventListener('input', () => {

  const searchValue = searchInput.value.toLowerCase();

  const filtered = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchValue)
  );

  displayProducts(filtered);
});