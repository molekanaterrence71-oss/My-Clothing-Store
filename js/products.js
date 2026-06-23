import { db } from './firebase-config.js';
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const productContainer = document.getElementById('product-container');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

let allProducts = [];

// Fetch products from Firestore
const fetchProducts = async () => {
    try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        allProducts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        renderProducts(allProducts);
    } catch (error) {
        console.error("Error fetching products: ", error);
        productContainer.innerHTML = `<p>Error loading products. Please try again later.</p>`;
    }
};

// Render products to DOM
const renderProducts = (products) => {
    productContainer.innerHTML = '';
    
    if(products.length === 0) {
        productContainer.innerHTML = `<p>No products found.</p>`;
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'glass-card product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 8px;">
                <button class="wishlist-btn" data-id="${product.id}"><i class="far fa-heart"></i></button>
            </div>
            <div class="product-info" style="margin-top: 1rem;">
                <p class="category" style="color: var(--accent-color); font-size: 0.8rem; text-transform: uppercase;">${product.category}</p>
                <h3 style="margin: 0.5rem 0;">${product.name}</h3>
                <p class="price" style="font-weight: 600; font-size: 1.2rem;">$${product.price.toFixed(2)}</p>
                <a href="product.html?id=${product.id}" class="btn-secondary" style="width: 100%; text-align: center; margin-top: 1rem; display: block;">View Details</a>
            </div>
        `;
        productContainer.appendChild(productCard);
    });
};

// Filtering Logic
categoryFilter.addEventListener('change', (e) => {
    const category = e.target.value;
    let filtered = allProducts;
    if (category !== 'all') {
        filtered = allProducts.filter(p => p.category === category);
    }
    renderProducts(filtered);
});

// Initialize
document.addEventListener('DOMContentLoaded', fetchProducts);
