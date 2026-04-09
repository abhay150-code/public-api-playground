/**
 * Public API Playground - Main Logic
 * Using fetch() with async/await, error handling, and loading states.
 */

// --- CONFIGURATION & API KEYS ---
const API_CONFIG = {
    NINJAS_API_KEY: 'Ez7FBgQY5Sx3asdaQGsGUftjwT7T4UwZHdNEwNgn', // Provided by user
};

// --- UTILITY FUNCTIONS ---

/**
 * Generic fetch helper with loading and error state management
 * @param {string} url - The API endpoint
 * @param {string} cardId - The ID prefix for the card UI elements
 * @param {object} options - Fetch options (headers, methods, etc.)
 * @param {boolean} isBlob - Whether to treat response as a blob
 */
async function fetchData(url, cardId, options = {}, isBlob = false) {
    const outputElement = document.getElementById(`${cardId}-output`);
    const loader = document.querySelector(`#${cardId}-card .loader`);
    const errorMsg = document.querySelector(`#${cardId}-card .error-msg`);

    // Reset UI state
    loader.classList.remove('hidden');
    errorMsg.classList.add('hidden');
    outputElement.style.opacity = '0.3';

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        
        if (isBlob) {
            return await response.blob();
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching for ${cardId}:`, error);
        errorMsg.textContent = `Error: ${error.message}`;
        errorMsg.classList.remove('hidden');
        return null;
    } finally {
        loader.classList.add('hidden');
        outputElement.style.opacity = '1';
    }
}

/**
 * Handles copy-to-clipboard functionality
 */
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const textToCopy = element.value || element.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('URL copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// --- API SPECIFIC HANDLERS ---

/**
 * 1. Dog Finder
 */
async function getDog() {
    const cardId = 'dog';
    const data = await fetchData('https://dog.ceo/api/breeds/image/random', cardId);
    if (data && data.status === 'success') {
        const imageUrl = data.message;
        const breedPart = imageUrl.split('/')[4];
        const breedName = breedPart.replace('-', ' ').toUpperCase();
        const output = document.getElementById(`${cardId}-output`);
        output.innerHTML = `
            <div class="fade-in">
                <div class="img-container"><img src="${imageUrl}" alt="Random Dog"></div>
                <h3>${breedName}</h3>
                <input type="hidden" id="dog-img-url" value="${imageUrl}">
            </div>`;
        const copyBtn = document.getElementById('copy-dog');
        if (copyBtn) copyBtn.classList.remove('hidden');
    }
}

/**
 * 2. QR Code Generator (API Ninjas)
 */
async function generateQRCode() {
    const cardId = 'qrcode';
    const qrInput = document.getElementById('qrcode-input');
    const qrData = qrInput.value || 'https://api-ninjas.com';
    const encodedData = encodeURIComponent(qrData);

    const url = `https://api.api-ninjas.com/v1/qrcode?data=${encodedData}&format=png`;
    const options = {
        headers: { 
            'X-Api-Key': API_CONFIG.NINJAS_API_KEY, 
            'Accept': 'image/png' 
        }
    };

    const blob = await fetchData(url, cardId, options, true);
    if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        const output = document.getElementById(`${cardId}-output`);
        output.innerHTML = `
            <div class="fade-in">
                <div class="img-container">
                    <img src="${imageUrl}" alt="QR Code">
                </div>
                <input type="hidden" id="qrcode-img-url" value="${imageUrl}">
            </div>`;
        const copyBtn = document.getElementById('copy-qrcode');
        if (copyBtn) copyBtn.classList.remove('hidden');
    }
}

/**
 * 3. Random User Profile
 */
async function getUser() {
    const cardId = 'user';
    const data = await fetchData('https://randomuser.me/api/', cardId);
    if (data && data.results && data.results.length > 0) {
        const user = data.results[0];
        const output = document.getElementById(`${cardId}-output`);
        output.innerHTML = `
            <div class="fade-in profile-card">
                <img src="${user.picture.large}" alt="user headshot">
                <div class="profile-info">
                    <p><strong>Name:</strong> ${user.name.first} ${user.name.last}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Age:</strong> ${user.dob.age}</p>
                    <p><strong>Country:</strong> ${user.location.country}</p>
                </div>
            </div>`;
    }
}

/**
 * 4. Joke Generator (Official Joke API)
 */
async function getJoke() {
    const cardId = 'joke';
    const data = await fetchData('https://official-joke-api.appspot.com/random_joke', cardId);
    if (data) {
        const output = document.getElementById(`${cardId}-output`);
        output.innerHTML = `
            <div class="fade-in joke-container">
                <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">${data.setup}</p>
                <p style="color: var(--primary); font-weight: 700; font-size: 1.25rem;">${data.punchline}</p>
            </div>`;
    }
}

/**
 * 5. Emoji Finder (API Ninjas)
 */
async function getEmoji() {
    const cardId = 'emoji';
    const emojiInput = document.getElementById('emoji-input');
    const emojiName = emojiInput.value || 'smile';

    const url = `https://api.api-ninjas.com/v1/emoji?name=${emojiName}`;
    const options = {
        headers: { 'X-Api-Key': API_CONFIG.NINJAS_API_KEY }
    };

    const data = await fetchData(url, cardId, options);
    if (data && data.length > 0) {
        const emoji = data[0];
        const output = document.getElementById(`${cardId}-output`);
        output.innerHTML = `
            <div class="fade-in" style="text-align: center;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">${emoji.character}</div>
                <h3 style="color: var(--primary); text-transform: uppercase;">${emoji.name}</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Unicode: ${emoji.code}</p>
            </div>`;
    } else if (data && data.length === 0) {
        const errorMsg = document.querySelector(`#${cardId}-card .error-msg`);
        errorMsg.textContent = "No emoji found with that name.";
        errorMsg.classList.remove('hidden');
    }
}

/**
 * 6. Animal Finder (API Ninjas)
 */
async function getAnimal() {
    const cardId = 'animal';
    const animalInput = document.getElementById('animal-input');
    const animalName = animalInput.value || 'Cheetah';

    const url = `https://api.api-ninjas.com/v1/animals?name=${animalName}`;
    const options = {
        headers: { 'X-Api-Key': API_CONFIG.NINJAS_API_KEY }
    };

    const data = await fetchData(url, cardId, options);
    if (data && data.length > 0) {
        const animal = data[0];
        const output = document.getElementById(`${cardId}-output`);
        output.innerHTML = `
            <div class="fade-in" style="text-align: left;">
                <h3 style="color: var(--primary); text-transform: uppercase; margin-bottom: 1rem;">${animal.name}</h3>
                <div class="profile-info">
                    <p><strong>Scientific Name:</strong> ${animal.taxonomy.scientific_name}</p>
                    <p><strong>Habitat:</strong> ${animal.characteristics.habitat || 'N/A'}</p>
                    <p><strong>Diet:</strong> ${animal.characteristics.diet || 'N/A'}</p>
                    <p><strong>Location:</strong> ${animal.locations.join(', ')}</p>
                    <p style="margin-top: 0.5rem; font-style: italic;">"${animal.characteristics.slogan || ''}"</p>
                </div>
            </div>`;
    } else if (data && data.length === 0) {
        const errorMsg = document.querySelector(`#${cardId}-card .error-msg`);
        errorMsg.textContent = "No animals found with that name.";
        errorMsg.classList.remove('hidden');
    }
}
