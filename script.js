// Global variables
let waterSystemsData = [];
let currentWaterSystemIndex = 0;
let currentMitigationIndex = 0;

// Google Apps Script Web App URL - Replace with your actual deployed URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx8nABbiKjvfWMKXWG76OYFPfljhkEoGXWFiei1BonJQcxTYBcoZ2ovad9g9qJQKUuU/exec';

// DOM elements
const zipcodeInput = document.getElementById('zipcode');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('results-section');
const mitigationSection = document.getElementById('mitigation-section');
const waterSystemsCarousel = document.getElementById('waterSystemsCarousel');
const mitigationCarousel = document.getElementById('mitigationCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const mitigationPrevBtn = document.getElementById('mitigationPrevBtn');
const mitigationNextBtn = document.getElementById('mitigationNextBtn');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    searchBtn.addEventListener('click', handleSearch);
    zipcodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Zipcode input validation
    zipcodeInput.addEventListener('input', function(e) {
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
        hideError();
    });
    
    // Carousel navigation
    prevBtn.addEventListener('click', () => navigateWaterSystems(-1));
    nextBtn.addEventListener('click', () => navigateWaterSystems(1));
    mitigationPrevBtn.addEventListener('click', () => navigateMitigation(-1));
    mitigationNextBtn.addEventListener('click', () => navigateMitigation(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (resultsSection.classList.contains('hidden')) return;
        
        if (e.key === 'ArrowLeft') {
            if (currentWaterSystemIndex > 0) {
                navigateWaterSystems(-1);
            }
        } else if (e.key === 'ArrowRight') {
            if (currentWaterSystemIndex < waterSystemsData.length - 1) {
                navigateWaterSystems(1);
            }
        }
    });
});

// Main search function
async function handleSearch() {
    const zipcode = zipcodeInput.value.trim();
    
    if (!validateZipcode(zipcode)) {
        return;
    }
    
    showLoading();
    hideError();
    hideResults();
    
    try {
        const data = await fetchWaterSystemData(zipcode);
        if (data && data.length > 0) {
            waterSystemsData = data;
            currentWaterSystemIndex = 0;
            currentMitigationIndex = 0;
            displayResults();
        } else {
            showError('No water systems found for the specified ZIP code.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showError('Error retrieving data. Please try again later.');
    } finally {
        hideLoading();
    }
}

// Zipcode validation
function validateZipcode(zipcode) {
    if (!zipcode) {
        showError('Please enter a ZIP code.');
        return false;
    }
    
    if (zipcode.length !== 5) {
        showError('ZIP code must be exactly 5 digits.');
        return false;
    }
    
    if (!/^\d{5}$/.test(zipcode)) {
        showError('ZIP code must contain only numbers.');
        return false;
    }
    
    return true;
}

// Fetch data from Google Sheets via Apps Script
async function fetchWaterSystemData(zipcode) {
    // For demo purposes, return mock data
    // Replace this with actual Google Apps Script call
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData = generateMockData(zipcode);
            resolve(mockData);
        }, 1500);
    });
    
    // Uncomment and modify this for actual Google Apps Script integration:
    /*
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?zipcode=${zipcode}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching from Google Apps Script:', error);
        throw error;
    }
    */
}

// Generate mock data for demonstration - NOW RETURNS MULTIPLE SYSTEMS PER ZIPCODE
function generateMockData(zipcode) {
    const mockSystems = [
        {
            MAILINGNAME: "ALTHA, TOWN OF WATER SYSTEM",
            ADDRESS1: "HIGHWAY 71",
            CITY: "ALTHA",
            EMAIL: "townofaltha@yahoo.com",
            PHONE: "8507623280",
            ZIPFIVE: zipcode,
            "CHEMICAL 1": "NITRATE",
            "CHEMICAL 2": "CHLORINE",
            "CHEMICAL 3": "",
            "CHEMICAL 4": "",
            "CHEMICAL 5": "",
            "CHEMICAL 6": "",
            "CHEMICAL 7": "",
            "CHEMICAL 8": "",
            "CHEMICAL 9": "",
            MICROBIOLOGY: "Negative for Total Coliform",
            "MITIGATION 1": "Use bottled water for drinking and cooking. Install a reverse osmosis filtration system.",
            "MITIGATION 2": "Allow tap water to sit for 24 hours before use to let chlorine evaporate.",
            "MITIGATION 3": "",
            "MITIGATION 4": "",
            "MITIGATION 5": "",
            "MITIGATION 6": "",
            "MITIGATION 7": "",
            "MITIGATION 8": "",
            "MITIGATION 9": ""
        },
        {
            MAILINGNAME: "QUINCY WATER TREATMENT FACILITY",
            ADDRESS1: "123 MAIN STREET",
            CITY: "QUINCY",
            EMAIL: "water@quincy.gov",
            PHONE: "8505551234",
            ZIPFIVE: zipcode,
            "CHEMICAL 1": "LEAD",
            "CHEMICAL 2": "COPPER",
            "CHEMICAL 3": "FLUORIDE",
            "CHEMICAL 4": "",
            "CHEMICAL 5": "",
            "CHEMICAL 6": "",
            "CHEMICAL 7": "",
            "CHEMICAL 8": "",
            "CHEMICAL 9": "",
            MICROBIOLOGY: "Positive for E. Coli",
            "MITIGATION 1": "Use only bottled water until further notice. Contact your healthcare provider if you experience symptoms.",
            "MITIGATION 2": "Install copper pipe replacement and use cold water for drinking.",
            "MITIGATION 3": "Use fluoride-free toothpaste and consider a fluoride removal filter.",
            "MITIGATION 4": "",
            "MITIGATION 5": "",
            "MITIGATION 6": "",
            "MITIGATION 7": "",
            "MITIGATION 8": "",
            "MITIGATION 9": ""
        },
        {
            MAILINGNAME: "RIVERSIDE MUNICIPAL WATER DISTRICT",
            ADDRESS1: "456 WATER STREET",
            CITY: "RIVERSIDE",
            EMAIL: "info@riversidewater.com",
            PHONE: "8505559876",
            ZIPFIVE: zipcode,
            "CHEMICAL 1": "ARSENIC",
            "CHEMICAL 2": "NITRATE",
            "CHEMICAL 3": "CHLORAMINE",
            "CHEMICAL 4": "TRIHALOMETHANES",
            "CHEMICAL 5": "",
            "CHEMICAL 6": "",
            "CHEMICAL 7": "",
            "CHEMICAL 8": "",
            "CHEMICAL 9": "",
            MICROBIOLOGY: "Negative for Total Coliform",
            "MITIGATION 1": "Install arsenic removal filter. Use bottled water for drinking.",
            "MITIGATION 2": "Use bottled water for drinking and cooking. Install a reverse osmosis filtration system.",
            "MITIGATION 3": "Use activated carbon filter to remove chloramine taste and odor.",
            "MITIGATION 4": "Install whole house carbon filtration system to reduce trihalomethanes.",
            "MITIGATION 5": "",
            "MITIGATION 6": "",
            "MITIGATION 7": "",
            "MITIGATION 8": "",
            "MITIGATION 9": ""
        }
    ];
    
    // Add additional systems for specific zipcodes to demonstrate variety
    if (zipcode === "32321") {
        mockSystems.push({
            MAILINGNAME: "TALLAHASSEE UTILITIES DEPARTMENT",
            ADDRESS1: "300 S ADAMS STREET",
            CITY: "TALLAHASSEE",
            EMAIL: "utilities@talgov.com",
            PHONE: "8508914968",
            ZIPFIVE: zipcode,
            "CHEMICAL 1": "CHLORINE",
            "CHEMICAL 2": "FLUORIDE",
            "CHEMICAL 3": "IRON",
            "CHEMICAL 4": "",
            "CHEMICAL 5": "",
            "CHEMICAL 6": "",
            "CHEMICAL 7": "",
            "CHEMICAL 8": "",
            "CHEMICAL 9": "",
            MICROBIOLOGY: "Negative for Total Coliform",
            "MITIGATION 1": "Allow tap water to sit for 24 hours before use to let chlorine evaporate.",
            "MITIGATION 2": "Use fluoride-free toothpaste and consider a fluoride removal filter.",
            "MITIGATION 3": "Install iron removal filter to improve taste and reduce staining.",
            "MITIGATION 4": "",
            "MITIGATION 5": "",
            "MITIGATION 6": "",
            "MITIGATION 7": "",
            "MITIGATION 8": "",
            "MITIGATION 9": ""
        });
    }
    
    if (zipcode === "32301") {
        mockSystems.push({
            MAILINGNAME: "LEON COUNTY UTILITIES",
            ADDRESS1: "1800 COMMONWEALTH BLVD",
            CITY: "TALLAHASSEE",
            EMAIL: "utilities@leoncountyfl.gov",
            PHONE: "8506065100",
            ZIPFIVE: zipcode,
            "CHEMICAL 1": "MANGANESE",
            "CHEMICAL 2": "SULFATE",
            "CHEMICAL 3": "",
            "CHEMICAL 4": "",
            "CHEMICAL 5": "",
            "CHEMICAL 6": "",
            "CHEMICAL 7": "",
            "CHEMICAL 8": "",
            "CHEMICAL 9": "",
            MICROBIOLOGY: "Negative for Total Coliform",
            "MITIGATION 1": "Install manganese removal filter to improve water quality.",
            "MITIGATION 2": "Use bottled water if sulfate taste is objectionable.",
            "MITIGATION 3": "",
            "MITIGATION 4": "",
            "MITIGATION 5": "",
            "MITIGATION 6": "",
            "MITIGATION 7": "",
            "MITIGATION 8": "",
            "MITIGATION 9": ""
        });
    }
    
    return mockSystems;
}

// Display results
function displayResults() {
    renderWaterSystemsCarousel();
    renderMitigationCarousel();
    showResults();
    updateCarouselButtons();
}

// Render water systems carousel
function renderWaterSystemsCarousel() {
    waterSystemsCarousel.innerHTML = '';
    
    waterSystemsData.forEach((system, index) => {
        const card = createWaterSystemCard(system);
        waterSystemsCarousel.appendChild(card);
    });
    
    updateWaterSystemsCarousel();
}

// Create water system card
function createWaterSyste
