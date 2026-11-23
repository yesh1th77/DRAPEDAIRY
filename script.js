
/* ==============================
   DRAPEDIARY - WARDROBE DATA
============================== */

const defaultItems = [
    {
        id: 1,
        name: "White Linen Shirt",
        category: "Top",
        color: "White",
        price: 1200,
        wears: 8,
        favorite: true,
        laundry: false,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Classic Blue Denim",
        category: "Bottom",
        color: "Blue",
        price: 1800,
        wears: 12,
        favorite: false,
        laundry: false,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Beige Overshirt",
        category: "Outerwear",
        color: "Beige",
        price: 2200,
        wears: 4,
        favorite: true,
        laundry: false,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Everyday Sneakers",
        category: "Footwear",
        color: "White",
        price: 2500,
        wears: 15,
        favorite: false,
        laundry: false,
        image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Black Essential Tee",
        category: "Top",
        color: "Black",
        price: 700,
        wears: 10,
        favorite: true,
        laundry: false,
        image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Relaxed Beige Trousers",
        category: "Bottom",
        color: "Beige",
        price: 1600,
        wears: 3,
        favorite: false,
        laundry: false,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Soft Cotton T-Shirt",
        category: "Top",
        color: "Green",
        price: 900,
        wears: 5,
        favorite: false,
        laundry: false,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Brown Casual Shoes",
        category: "Footwear",
        color: "Brown",
        price: 2000,
        wears: 6,
        favorite: false,
        laundry: false,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    }
];

/* ==============================
   STORAGE
============================== */

let items;

try {
    const savedItems = localStorage.getItem("drapeItems");
    items = savedItems ? JSON.parse(savedItems) : defaultItems;
} catch {
    items = defaultItems;
}

let planner;

try {
    planner = JSON.parse(localStorage.getItem("drapePlanner")) || {};
} catch {
    planner = {};
}

let currentFilter = "All";
let currentOutfit = [];

/* ==============================
   SAVE DATA
============================== */

function saveData() {
    localStorage.setItem("drapeItems", JSON.stringify(items));
    localStorage.setItem("drapePlanner", JSON.stringify(planner));
}

/* ==============================
   NAVIGATION
============================== */

function showSection(id, element) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(id);

    if (target) {
        target.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(nav => {
        nav.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    } else {
        document.querySelectorAll(".nav-item").forEach(nav => {
            if (nav.getAttribute("onclick")?.includes(id)) {
                nav.classList.add("active");
            }
        });
    }

    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==============================
   CLOTHING CARD
============================== */

function createCard(item) {
    return `
        <div class="clothing-card">
            <img src="${item.image}" alt="${item.name}"
            onerror="this.src='https://placehold.co/500x500/e8e5dd/555?text=Clothing'">

            <div class="card-info">
                <div class="card-name">${item.name}</div>

                <div class="card-meta">
                    ${item.category} · ${item.color}
                </div>

                <div class="card-footer">
                    <span class="wear-tag">${item.wears} wears</span>

                    <button class="heart ${item.favorite ? "fav" : ""}"
                    onclick="toggleFavorite(${item.id})">
                    ${item.favorite ? "♥" : "♡"}
                    </button>
                </div>

            ${item.laundry ? `
                <button class="btn btn-light btn-small"
                style="width:100%;margin-top:8px;"
                onclick="markClean(${item.id})">
                Mark clean
                </button>
            ` : ""}
            </div>
        </div>
    `;
}

/* ==============================
   MY CLOSET
============================== */

function renderCloset() {
    const grid = document.getElementById("closetGrid");

    if (!grid) return;

    const search =
        document.getElementById("searchInput")?.value.toLowerCase() || "";

    const filtered = items.filter(item => {
        const categoryMatch =
            currentFilter === "All" || item.category === currentFilter;

        const searchMatch =
            item.name.toLowerCase().includes(search) ||
            item.color.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search);

        return categoryMatch && searchMatch;
    });

    grid.innerHTML = filtered.map(createCard).join("") ||
        `<div class="empty">No clothing items found.</div>`;
}

function setFilter(category, button) {
    currentFilter = category;

    document.querySelectorAll(".filter").forEach(filter => {
        filter.classList.remove("active");
    });

    button.classList.add("active");
    renderCloset();
}

/* ==============================
   FAVORITES
============================== */

function toggleFavorite(id) {
    const item = items.find(item => item.id === id);

    if (!item) return;

    item.favorite = !item.favorite;

    saveData();
    renderAll();
}

/* ==============================
   ADD CLOTHING
============================== */

function openModal() {
    document.getElementById("addModal").classList.add("show");
}

function closeModal() {
    document.getElementById("addModal").classList.remove("show");
}

function addItem() {
    const name = document.getElementById("itemName").value.trim();
    const category = document.getElementById("itemCategory").value;
    const color = document.getElementById("itemColor").value.trim() || "Unknown";
    const price = Number(document.getElementById("itemPrice").value) || 0;
    let image = document.getElementById("itemImage").value.trim();

    if (!name) {
        alert("Please enter an item name.");
        return;
    }

    if (!image) {
        image = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80";
    }

    const newItem = {
        id: Date.now(),
        name,
        category,
        color,
        price,
        wears: 0,
        favorite: false,
        laundry: false,
        image
    };

    items.unshift(newItem);

    saveData();
    renderAll();
    closeModal();

    document.getElementById("itemName").value = "";
    document.getElementById("itemColor").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemImage").value = "";

    currentFilter = "All";

    document.querySelectorAll(".filter").forEach(filter => {
        filter.classList.remove("active");
    });

    document.querySelector(".filter").classList.add("active");

    showSection("closet");
}

/* ==============================
   OUTFIT GENERATOR
============================== */

function pickRandom(array) {
    if (!array.length) return null;

    return array[Math.floor(Math.random() * array.length)];
}

function generateOutfit() {
    const weather = document.getElementById("weatherSelect").value;
    const cleanItems = items.filter(item => !item.laundry);

    const tops = cleanItems.filter(item => item.category === "Top");
    const bottoms = cleanItems.filter(item => item.category === "Bottom");
    const shoes = cleanItems.filter(item => item.category === "Footwear");
    const outerwear = cleanItems.filter(item => item.category === "Outerwear");

    currentOutfit = [];

    const top = pickRandom(tops);
    const bottom = pickRandom(bottoms);
    const footwear = pickRandom(shoes);

    if (top) currentOutfit.push(top);
    if (bottom) currentOutfit.push(bottom);
    if (footwear) currentOutfit.push(footwear);

    if ((weather === "cold" || weather === "rainy") && outerwear.length) {
        currentOutfit.push(pickRandom(outerwear));
    }

    if (!currentOutfit.length) {
        document.getElementById("outfitResult").innerHTML =
            `<div class="message">Add clothing to your closet first.</div>`;
        return;
    }

    renderOutfit();
}

/* ==============================
   DISPLAY OUTFIT
============================== */

function renderOutfit() {
    const occasion = document.getElementById("occasion").value;

    document.getElementById("outfitResult").innerHTML = `
        <div class="message">
            ✧ Your ${occasion.toLowerCase()} look is ready.
        </div>

        <div class="outfit-grid">
            ${currentOutfit.map(item => `
                <div class="outfit-item">
                    <img src="${item.image}" alt="${item.name}"
                    onerror="this.src='https://placehold.co/500x500/e8e5dd/555?text=Clothing'">

                    <h4>${item.name}</h4>
                    <p>${item.category} · ${item.color}</p>
                </div>
            `).join("")}
        </div>

        <div class="outfit-actions">
            <button class="btn" onclick="wearOutfit()">✓ Wear this outfit</button>
            <button class="btn btn-light" onclick="generateOutfit()">↻ Try another</button>
            <button class="btn btn-light" onclick="saveToPlanner()">▦ Plan this outfit</button>
        </div>
    `;
}

/* ==============================
   WEAR OUTFIT
============================== */

function wearOutfit() {
    if (!currentOutfit.length) return;

    currentOutfit.forEach(outfitItem => {
        const actualItem = items.find(item => item.id === outfitItem.id);

        if (actualItem) {
            actualItem.wears++;
            actualItem.laundry = true;
        }
    });

    saveData();
    renderAll();

    document.getElementById("outfitResult").innerHTML =
        `<div class="message">✓ Outfit recorded! Your worn pieces are now in laundry.</div>`;

    currentOutfit = [];
}

/* ==============================
   WEATHER
============================== */

function updateWeather() {
    const weather = document.getElementById("weatherPageSelect").value;

    const weatherData = {
        warm: ["☀️", "Warm & sunny", "Light clothes and breathable fabrics work well."],
        cold: ["❄️", "Cool weather", "Layer up with comfortable outerwear."],
        rainy: ["🌧️", "Rainy day", "Choose practical layers and shoes."],
        mild: ["☁️", "Mild weather", "A relaxed outfit with a light layer."]
    };

    const data = weatherData[weather];

    document.getElementById("weatherIcon").textContent = data[0];
    document.getElementById("weatherTitle").textContent = data[1];

    document.getElementById("weatherSuggestion").innerHTML =
        `<div class="message">${data[2]}</div>`;
}

function weatherOutfit() {
    document.getElementById("weatherSelect").value =
        document.getElementById("weatherPageSelect").value;

    showSection("studio");
    generateOutfit();
}

/* ==============================
   WEEKLY PLANNER
============================== */

function saveToPlanner() {
    if (!currentOutfit.length) {
        alert("Generate an outfit first!");
        return;
    }

    const day = document.getElementById("plannerDay").value;

    planner[day] = currentOutfit.map(item => item.name).join(" + ");

    saveData();
    renderPlanner();

    alert("Outfit saved for " + day + "!");
}

function renderPlanner() {
    const days = [
        "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday"
    ];

    document.getElementById("plannerGrid").innerHTML = days.map(day => `
        <div class="day-card">
            <h4>${day}</h4>
            <p>${planner[day] || "No outfit planned"}</p>
        </div>
    `).join("");
}

/* ==============================
   LAUNDRY
============================== */

function markClean(id) {
    const item = items.find(item => item.id === id);

    if (item) {
        item.laundry = false;
    }

    saveData();
    renderAll();
}

function renderLaundry() {
    const laundryItems = items.filter(item => item.laundry);

    document.getElementById("laundryGrid").innerHTML =
        laundryItems.map(item => `
            <div class="list-item">
                <div>
                    <p>${item.name}</p>
                    <small>${item.category}</small>
                </div>

                <button class="btn btn-light btn-small"
                onclick="markClean(${item.id})">
                Mark clean
                </button>
            </div>
        `).join("") ||
        `<div class="empty">Everything is clean. Your wardrobe is ready!</div>`;
}

/* ==============================
   WEAR TRACKER
============================== */

function renderTracker() {
    const total = items.length;
    const worn = items.filter(item => item.wears > 0).length;
    const percentage = total ? Math.round((worn / total) * 100) : 0;

    document.getElementById("utilizationText").textContent =
        `${worn} of ${total} items have been worn at least once (${percentage}%).`;

    document.getElementById("utilizationBar").style.width =
        percentage + "%";

    const mostWorn = [...items]
        .sort((a, b) => b.wears - a.wears)
        .slice(0, 5);

    document.getElementById("mostWorn").innerHTML =
        mostWorn.map(item => `
            <div class="list-item">
                <div>
                    <p>${item.name}</p>
                    <small>${item.category}</small>
                </div>

                <span class="wear-tag">${item.wears} wears</span>
            </div>
        `).join("") ||
        `<div class="empty">Add clothing to track it.</div>`;

    const forgotten = [...items]
        .sort((a, b) => a.wears - b.wears)
        .slice(0, 5);

    document.getElementById("forgotten").innerHTML =
        forgotten.map(item => `
            <div class="list-item">
                <div>
                    <p>${item.name}</p>
                    <small>${item.color} · ${item.wears} wears</small>
                </div>

                <button class="btn btn-light btn-small"
                onclick="reviveItem(${item.id})">
                Style it
                </button>
            </div>
        `).join("") ||
        `<div class="empty">No items yet.</div>`;
}

/* ==============================
   FORGOTTEN ITEM OUTFIT
============================== */

function reviveItem(id) {
    const item = items.find(item => item.id === id);

    if (!item || item.laundry) {
        alert("This item is in laundry. Mark it clean first!");
        return;
    }

    generateOutfitWithItem(item);
}

function generateOutfitWithItem(item) {
    const cleanItems = items.filter(i => !i.laundry);

    currentOutfit = [item];

    const neededCategory =
        item.category === "Top" ? "Bottom" : "Top";

    const matches = cleanItems.filter(i =>
        i.category === neededCategory && i.id !== item.id
    );

    const matchingItem = pickRandom(matches);

    if (matchingItem) {
        currentOutfit.push(matchingItem);
    }

    const shoes = cleanItems.filter(i => i.category === "Footwear");
    const footwear = pickRandom(shoes);

    if (footwear && footwear.id !== item.id) {
        currentOutfit.push(footwear);
    }

    showSection("studio");
    renderOutfit();
}

/* ==============================
   DASHBOARD
============================== */

function renderDashboard() {
    document.getElementById("totalItems").textContent = items.length;

    document.getElementById("totalWears").textContent =
        items.reduce((sum, item) => sum + item.wears, 0);

    document.getElementById("totalFavorites").textContent =
        items.filter(item => item.favorite).length;

    document.getElementById("laundryCount").textContent =
        items.filter(item => item.laundry).length;

    document.getElementById("recentGrid").innerHTML =
        items.slice(0, 4).map(createCard).join("");
}

/* ==============================
   FAVORITES PAGE
============================== */

function renderFavorites() {
    const favorites = items.filter(item => item.favorite);

    document.getElementById("favoritesGrid").innerHTML =
        favorites.map(createCard).join("") ||
        `<div class="empty">Save your favorite pieces using the heart button.</div>`;
}

/* ==============================
   RENDER EVERYTHING
============================== */

function renderAll() {
    renderDashboard();
    renderCloset();
    renderFavorites();
    renderTracker();
    renderPlanner();
    renderLaundry();
}

/* ==============================
   INITIALIZE WEBSITE
============================== */

renderAll();
updateWeather();
