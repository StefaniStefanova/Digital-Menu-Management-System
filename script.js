import { db } from './firebase.js';
import { collection, getDocs, query, where } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const menuContainer = document.querySelector('.menu');
const categoryButtons = document.querySelectorAll('.category');

async function renderMenu(category) {
  menuContainer.innerHTML = '';

  const q = query(
    collection(db, 'menu'),
    where('category', '==', category),
    where('available', '==', true)
  );

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


  // ===== SHOTS =====
  if (category === 'shots') {

    const shakerShots = docs.filter(item => item.type === 'shaker');
    const singleShots = docs.filter(item => item.type === 'single');

    if (shakerShots.length) {
      const h2Shaker = document.createElement('h2');
      h2Shaker.textContent = 'Shaker Shots';
      h2Shaker.className = 'shot-group-title';
      menuContainer.appendChild(h2Shaker);

      shakerShots.forEach(item =>
        menuContainer.appendChild(createCard(item, category))
      );
    }

    if (singleShots.length) {
      const h2Single = document.createElement('h2');
      h2Single.textContent = 'Single Shots';
      h2Single.className = 'shot-group-title';
      menuContainer.appendChild(h2Single);

      singleShots.forEach(item =>
        menuContainer.appendChild(createCard(item, category))
      );
    }
  }


  // ===== HOT DRINKS =====
  else if (category === 'hot-drinks') {

    const espressoItems = docs.filter(item => item.type === 'espresso');
    const coffeeItems = docs.filter(item => item.type === 'coffee');
    const teaItems = docs.filter(item => item.type === 'tea-chocolate');
    const addonsItems = docs.filter(item => item.type === 'add-ons');

    if (espressoItems.length) {
      const h2Espresso = document.createElement('h2');
      h2Espresso.textContent = 'Espresso Selection';
      h2Espresso.className = 'hot-drink-group-title';
      menuContainer.appendChild(h2Espresso);

      espressoItems.forEach(item =>
        menuContainer.appendChild(createCard(item, category))
      );
    }

    if (coffeeItems.length) {
      const h2Coffee = document.createElement('h2');
      h2Coffee.textContent = 'Coffee Specialties';
      h2Coffee.className = 'hot-drink-group-title';
      menuContainer.appendChild(h2Coffee);

      coffeeItems.forEach(item =>
        menuContainer.appendChild(createCard(item, category))
      );
    }

    if (teaItems.length) {
      const h2Tea = document.createElement('h2');
      h2Tea.textContent = 'Tea & Hot Chocolate';
      h2Tea.className = 'hot-drink-group-title';
      menuContainer.appendChild(h2Tea);

      teaItems.forEach(item =>
        menuContainer.appendChild(createCard(item, category))
      );
    }

    if (addonsItems.length) {
      const h2Addons = document.createElement('h2');
      h2Addons.textContent = 'Add-ons';
      h2Addons.className = 'hot-drink-group-title';
      menuContainer.appendChild(h2Addons);

      addonsItems.forEach(item =>
        menuContainer.appendChild(createCard(item, category))
      );
    }
  }


  // ===== OTHER CATEGORIES =====
  else {
    docs.forEach(item =>
      menuContainer.appendChild(createCard(item, category))
    );
  }
}


// ===== CREATE CARD =====
function createCard(item, category) {

  const card = document.createElement('div');
  card.className = 'card';

  const hasFlavours = item.flavours && item.flavours.length > 0;

  card.innerHTML = `
    ${
      category !== 'hot-drinks'
        ? `<img src="${item.image}" alt="${item.name}">`
        : ''
    }

    <div class="card-content">
      <h3>${item.name}</h3>
      <p>${item.description || ''}</p>
      <span class="price">${item.price} лв</span>

      ${
        hasFlavours
          ? `
          <div class="flavour-wrapper">
            <label class="flavour-label">Available Flavours</label>
            <select class="flavour-select">
              ${item.flavours
                .map(f => `<option value="${f}">${f}</option>`)
                .join('')}
            </select>
          </div>
        `
          : ''
      }
    </div>
  `;

  
  return card;
}


// ===== CATEGORY BUTTONS =====
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {

    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    renderMenu(button.dataset.filter);
  });
});


// ===== INITIAL LOAD =====
renderMenu('cocktails');
