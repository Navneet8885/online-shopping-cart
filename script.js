// Product list
const products = [
    {id:1,name:"Wireless Headphones",price:1500,image:"wireless headphones.jpg"},
    {id:2,name:"Smart Watch",price:2500,image:"smart watch.jpg"},
    {id:3,name:"Bluetooth Speaker",price:1200,image:"bluetooth speaker.jpg"},
    {id:4,name:"Coffee Maker",price:3000,image:"coffee maker.jpg"},
    {id:5,name:"Vacuum Cleaner",price:4000,image:"vacuum cleaner.jpg"},
    {id:6,name:"LED TV 42 inch",price:22000,image:"led tv 42 inch.jpg"},
    {id:7,name:"Laptop 15 inch",price:55000,image:"laptop 15 inch.jpg"},
    {id:8,name:"Gaming Mouse",price:1500,image:"gaming mouse.jpg"},
    {id:9,name:"Office Chair",price:4500,image:"office chair.jpg"},
    {id:10,name:"Smartphone",price:18000,image:"smartphone.jpg"},
    {id:11,name:"Microwave Oven",price:5000,image:"microwave open.jpg"},
    {id:12,name:"Tablet",price:12000,image:"tablet.jpg"},
    {id:13,name:"Desk Lamp",price:800,image:"desk lamp.jpg"},
    {id:14,name:"Refrigerator",price:25000,image:"refrigerator.jpg"},
    {id:15,name:"Fitness Tracker",price:3000,image:"fitness tracker.jpg"}
];

// Cheaper options for Smart Budget
const cheaperOptions = {
    "Wireless Headphones": {name:"Budget Headphones", price:1200},
    "Smart Watch": {name:"Basic Smart Watch", price:2000},
    "Bluetooth Speaker": {name:"Mini Speaker", price:1000},
    "Coffee Maker": {name:"Budget Coffee Maker", price:2500},
    "Vacuum Cleaner": {name:"Compact Vacuum", price:3500},
    "LED TV 42 inch": {name:"LED TV 32 inch", price:18000},
    "Laptop 15 inch": {name:"Laptop 14 inch", price:50000},
    "Gaming Mouse": {name:"Basic Mouse", price:1200},
    "Office Chair": {name:"Simple Chair", price:3500},
    "Smartphone": {name:"Budget Smartphone", price:15000}
};

// Load cart from localStorage or empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render products
function renderProducts(containerId){
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    products.forEach(p=>{
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>₹${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        `;
        container.appendChild(div);
    });
}

// Add to cart
function addToCart(id){
    const product = products.find(p=>p.id===id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Remove from cart
function removeFromCart(id){
    cart = cart.filter(p=>p.id!==id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}
// Render cart
function renderCart(){
    const container = document.getElementById('cart-container');
    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `${item.name} - ₹${item.price} <button onclick="removeFromCart('${item.name}')">Remove</button>`;
        container.appendChild(div);

        // Smart Budget suggestion
        if(cheaperOptions[item.name] && cheaperOptions[item.name].price < item.price){
            const sug = cheaperOptions[item.name];
            const sugDiv = document.createElement('div');
            sugDiv.className = 'smart-suggestion';
            sugDiv.innerHTML = `💡 Suggestion: ${item.name} → ${sug.name} (Save ₹${item.price - sug.price})`;
            container.appendChild(sugDiv);
        }
    });

    const summary = document.createElement('div');
    summary.style.marginTop = '15px';
    summary.innerHTML = `<strong>Total Items: ${cart.length} | Total Price: ₹${total}</strong>`;
    container.appendChild(summary);
}

// Voice control
function initVoice(){
    const btn = document.getElementById('voice-btn');
    if(!('webkitSpeechRecognition' in window)){
        alert('Your browser does not support voice recognition.');
        return;
    }
    btn.onclick = ()=>{
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event)=>{
            const command = event.results[0][0].transcript.toLowerCase();
            console.log('Voice command:', command);
            if(command.startsWith('add ')){
                const prodName = command.replace('add ','').trim();
                const product = products.find(p=>p.name.toLowerCase()===prodName);
                if(product) addToCart(product.id);
            }
            else if(command.startsWith('remove ')){
                const prodName = command.replace('remove ','').trim();
                const product = products.find(p=>p.name.toLowerCase()===prodName);
                if(product) removeFromCart(product.id);
            }
        };
    };
}

// Initial render
document.addEventListener('DOMContentLoaded', ()=>{
    if(document.getElementById('products-container')) renderProducts('products-container');
    if(document.getElementById('cart-container')) renderCart();
    if(document.getElementById('voice-btn')) initVoice();
});
