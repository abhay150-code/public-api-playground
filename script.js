/**
 * Public API Playground - Logic
 * 🚀 Vanilla JavaScript | Standard APIs, Anime, Emoji & Food
 */

// --- Global Constants & State ---
const API_URLS = {
    dog: 'https://dog.ceo/api/breeds/image/random',
    joke: 'https://v2.jokeapi.dev/joke/Any?safe-mode',
    user: 'https://randomuser.me/api/',
    anime: 'https://api.jikan.moe/v4/random/anime',
    emoji: 'https://emojihub.yurace.pro/api/random',
    food: 'https://foodish-api.com/api/'
};

// --- Initialization ---
window.addEventListener('load', () => {
    initApp();
});

function initApp() {
    checkProtocol();

    // Fetch initial data
    fetchDog();
    fetchJoke();
    fetchUser();
    fetchAnime();
    fetchEmoji();
    fetchFood();

    // Event Listeners
    setupEventListeners();
}

/**
 * Warns the user if they are using file:// which blocks some API requests
 */
function checkProtocol() {
    if (window.location.protocol === 'file:') {
        const header = document.querySelector('.header');
        const warning = document.createElement('div');
        warning.style.cssText = `
            margin: -2rem auto 3rem;
            padding: 0.75rem 1rem;
            background: #fef2f2;
            border: 1px solid #fee2e2;
            border-radius: 8px;
            color: #b91c1c;
            font-size: 0.875rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        `;
        warning.className = 'animate-in';
        warning.innerHTML = `
            <i data-lucide="alert-circle" style="width:16px;height:16px;"></i>
            <span>Running from a local file. Use <strong>Live Server</strong> for full feature support.</span>
        `;
        header.insertAdjacentElement('afterend', warning);
        refreshIcons();
    }
}

function setupEventListeners() {
    // Standard APIs
    document.getElementById('refresh-dog').addEventListener('click', () => fetchDog());
    document.getElementById('copy-dog-url').addEventListener('click', copyDogURL);
    document.getElementById('refresh-joke').addEventListener('click', () => fetchJoke());
    document.getElementById('refresh-user').addEventListener('click', () => fetchUser());
    document.getElementById('refresh-user-btn').addEventListener('click', () => fetchUser());
    
    // Anime & Emoji
    document.getElementById('refresh-anime').addEventListener('click', () => fetchAnime());
    document.getElementById('refresh-emoji').addEventListener('click', () => fetchEmoji());
    document.getElementById('refresh-emoji-btn').addEventListener('click', () => fetchEmoji());

    // Food
    document.getElementById('refresh-food').addEventListener('click', () => fetchFood());
    document.getElementById('refresh-food-btn').addEventListener('click', () => fetchFood());
}

function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
}

// --- API Helpers ---

async function apiFetch(name, url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error [${name}]:`, error);
        return { error: error.message || 'Connection failed' };
    }
}

/**
 * Replaces card content with an error message
 */
function displayCardError(name, message) {
    const container = document.getElementById(`${name}-card`);
    if (!container) return;
    
    const content = container.querySelector('.card-content');
    content.innerHTML = `
        <div class="error-state small animate-in">
            <i data-lucide="alert-circle"></i>
            <p>${message}</p>
            <button class="btn btn-secondary btn-sm mt-1" onclick="location.reload()">Retry Card</button>
        </div>
    `;
    refreshIcons();
}

// --- API Functions ---

async function fetchDog() {
    const container = document.getElementById('dog-image-container');
    const breedEl = document.getElementById('dog-breed');
    container.innerHTML = '<div class="skeleton"></div>';
    
    const data = await apiFetch('dog', API_URLS.dog);
    if (data.error) {
        displayCardError('dog', data.error);
        return;
    }

    const breedMatch = data.message.match(/breeds\/([^/]+)\//);
    const breed = breedMatch ? formatBreedName(breedMatch[1]) : 'Random Breed';

    const img = new Image();
    img.src = data.message;
    img.onload = () => {
        container.innerHTML = '';
        container.appendChild(img);
        breedEl.innerText = breed;
    };
    img.onerror = () => displayCardError('dog', 'Failed to load image');
}

function formatBreedName(breedStr) {
    return breedStr.split('-').reverse().map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function copyDogURL() {
    const img = document.querySelector('#dog-image-container img');
    if (!img) return;
    try {
        await navigator.clipboard.writeText(img.src);
        const btn = document.getElementById('copy-dog-url');
        const old = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check"></i> Copied';
        setTimeout(() => { btn.innerHTML = old; refreshIcons(); }, 2000);
    } catch (e) {
        alert('Failed to copy');
    }
    refreshIcons();
}

async function fetchJoke() {
    const setupEl = document.getElementById('joke-setup');
    const punchlineEl = document.getElementById('joke-punchline');
    setupEl.innerText = 'Consulting the comedy gods...';
    punchlineEl.classList.add('hidden');

    const data = await apiFetch('joke', API_URLS.joke);
    if (data.error) {
        displayCardError('joke', data.error);
        return;
    }

    if (data.type === 'single') {
        setupEl.innerText = data.joke;
        punchlineEl.innerText = 'Enjoy!';
    } else {
        setupEl.innerText = data.setup;
        punchlineEl.innerText = data.delivery;
    }
    setTimeout(() => punchlineEl.classList.remove('hidden'), 1000);
}

async function fetchUser() {
    const nameEl = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');
    const skeleton = avatarEl.parentElement.querySelector('.skeleton');
    
    avatarEl.classList.add('hidden');
    skeleton.classList.remove('hidden');

    const data = await apiFetch('user', API_URLS.user);
    if (data.error) {
        displayCardError('user', data.error);
        return;
    }

    const user = data.results[0];
    avatarEl.src = user.picture.large;
    avatarEl.onload = () => {
        avatarEl.classList.remove('hidden');
        skeleton.classList.add('hidden');
    };

    nameEl.innerText = `${user.name.first} ${user.name.last}`;
    document.getElementById('user-email').innerText = user.email;
    document.getElementById('user-location').innerText = `${user.location.city}, ${user.location.country}`;
    document.getElementById('user-phone').innerText = user.phone;
    document.getElementById('user-age').innerText = `${user.dob.age} years old`;
}

async function fetchAnime() {
    const titleEl = document.getElementById('anime-title');
    const synopsisEl = document.getElementById('anime-synopsis');
    const scoreEl = document.getElementById('anime-score');
    const typeEl = document.getElementById('anime-type');
    const container = document.getElementById('anime-poster-container');
    
    container.innerHTML = '<div class="skeleton"></div>';
    
    // Set initial loading state
    titleEl.innerText = 'Seeking epic tales...';
    titleEl.classList.add('skeleton-text');
    synopsisEl.innerText = 'Consulting the scrolls...';
    synopsisEl.classList.add('skeleton-text');

    const data = await apiFetch('anime', API_URLS.anime);
    if (data.error) {
        displayCardError('anime', data.error);
        return;
    }

    const anime = data.data;
    
    // Update Title
    titleEl.innerText = anime.title;
    titleEl.classList.remove('skeleton-text');
    
    // Update Synopsis
    let synopsis = anime.synopsis || "No description available for this anime.";
    synopsis = synopsis.split('[Written by')[0].trim();
    synopsisEl.innerText = synopsis;
    synopsisEl.classList.remove('skeleton-text');

    // Update Badges
    scoreEl.innerHTML = `<i data-lucide="star"></i> ${anime.score || 'N/A'}`;
    typeEl.innerHTML = `<i data-lucide="monitor"></i> ${anime.type || 'N/A'}`;

    const img = new Image();
    img.src = anime.images.jpg.large_image_url;
    img.onload = () => {
        container.innerHTML = '';
        container.appendChild(img);
        refreshIcons();
    };
    img.onerror = () => displayCardError('anime', 'Poster not found');
}

async function fetchEmoji() {
    const displayEl = document.getElementById('emoji-display');
    const nameEl = document.getElementById('emoji-name');
    const groupEl = document.getElementById('emoji-group');
    
    displayEl.innerHTML = '...';
    displayEl.classList.remove('pop');
    nameEl.classList.add('skeleton-text');
    nameEl.innerText = 'Loading...';

    const data = await apiFetch('emoji', API_URLS.emoji);
    if (data.error) {
        displayCardError('emoji', data.error);
        return;
    }

    // Force animation restart
    void displayEl.offsetWidth; 
    
    displayEl.innerHTML = data.htmlCode.join('');
    displayEl.classList.add('pop');
    
    nameEl.innerText = data.name;
    nameEl.classList.remove('skeleton-text');
    
    groupEl.innerText = `${data.category} / ${data.group}`;
}

async function fetchFood() {
    const container = document.getElementById('food-image-container');
    const categoryEl = document.getElementById('food-category');
    container.innerHTML = '<div class="skeleton"></div>';
    categoryEl.innerText = 'Gourmet in progress...';
    categoryEl.classList.add('skeleton-text');

    const data = await apiFetch('food', API_URLS.food);
    if (data.error) {
        displayCardError('food', data.error);
        return;
    }

    // Extract category from URL: https://foodish-api.com/images/pizza/pizza12.jpg -> pizza
    const categoryMatch = data.image.match(/images\/([^/]+)\//);
    const category = categoryMatch ? categoryMatch[1].charAt(0).toUpperCase() + categoryMatch[1].slice(1) : 'Gourmet Dish';

    const img = new Image();
    img.src = data.image;
    img.onload = () => {
        container.innerHTML = '';
        container.appendChild(img);
        categoryEl.innerText = category;
        categoryEl.classList.remove('skeleton-text');
    };
    img.onerror = () => displayCardError('food', 'Failed to load gourmet image');
}
