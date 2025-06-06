// Global variables
let waterSystemsData = []
let currentWaterSystemIndex = 0
let currentMitigationIndex = 0

// Google Apps Script Web App URL - Replace with your actual deployed URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8nABbiKjvfWMKXWG76OYFPfljhkEoGXWFiei1BonJQcxTYBcoZ2ovad9g9qJQKUuU/exec"

// DOM elements
let zipcodeInput, searchBtn, errorMessage, loading, resultsSection, mitigationSection
let waterSystemsCarousel, mitigationCarousel, prevBtn, nextBtn, mitigationPrevBtn, mitigationNextBtn

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM elements
  zipcodeInput = document.getElementById("zipcode")
  searchBtn = document.getElementById("searchBtn")
  errorMessage = document.getElementById("error-message")
  loading = document.getElementById("loading")
  resultsSection = document.getElementById("results-section")
  mitigationSection = document.getElementById("mitigation-section")
  waterSystemsCarousel = document.getElementById("waterSystemsCarousel")
  mitigationCarousel = document.getElementById("mitigationCarousel")
  prevBtn = document.getElementById("prevBtn")
  nextBtn = document.getElementById("nextBtn")
  mitigationPrevBtn = document.getElementById("mitigationPrevBtn")
  mitigationNextBtn = document.getElementById("mitigationNextBtn")

  // Check if all elements exist
  if (!zipcodeInput || !searchBtn) {
    console.error("Required DOM elements not found!")
    return
  }

  console.log("DOM elements initialized successfully")

  // Add event listeners
  searchBtn.addEventListener("click", handleSearch)
  zipcodeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  })

  // Zipcode input validation
  zipcodeInput.addEventListener("input", (e) => {
    const value = e.target.value.replace(/\D/g, "")
    e.target.value = value
    hideError()
  })

  // Carousel navigation
  if (prevBtn) prevBtn.addEventListener("click", () => navigateWaterSystems(-1))
  if (nextBtn) nextBtn.addEventListener("click", () => navigateWaterSystems(1))
  if (mitigationPrevBtn) mitigationPrevBtn.addEventListener("click", () => navigateMitigation(-1))
  if (mitigationNextBtn) mitigationNextBtn.addEventListener("click", () => navigateMitigation(1))

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!resultsSection || resultsSection.classList.contains("hidden")) return

    if (e.key === "ArrowLeft") {
      if (currentWaterSystemIndex > 0) {
        navigateWaterSystems(-1)
      }
    } else if (e.key === "ArrowRight") {
      if (currentWaterSystemIndex < waterSystemsData.length - 1) {
        navigateWaterSystems(1)
      }
    }
  })
})

// Main search function
async function handleSearch() {
  const zipcode = zipcodeInput.value.trim()

  console.log("=== STARTING SEARCH FOR REAL DATA ===")
  console.log("Searching for zipcode:", zipcode)

  if (!validateZipcode(zipcode)) {
    return
  }

  showLoading()
  hideError()
  hideResults()

  try {
    // Clear previous data
    waterSystemsData = []

    // Fetch real data from Google Sheets
    const data = await fetchWaterSystemData(zipcode)
    console.log("=== RECEIVED DATA FROM GOOGLE SHEETS ===")
    console.log("Zipcode:", zipcode)
    console.log("Number of systems found:", data.length)
    console.log("Raw data:", data)

    if (data && data.length > 0) {
      waterSystemsData = data
      currentWaterSystemIndex = 0
      currentMitigationIndex = 0

      setTimeout(() => {
        displayResults()
        hideLoading()
      }, 500)
    } else {
      console.log("No data found in Google Sheets for zipcode:", zipcode)
      hideLoading()
      showError("No water systems found for the specified ZIP code in our database.")
    }
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error)
    hideLoading()
    showError("Error connecting to database. Please check your internet connection and try again.")
  }
}

// Zipcode validation
function validateZipcode(zipcode) {
  if (!zipcode) {
    showError("Please enter a ZIP code.")
    return false
  }

  if (zipcode.length !== 5) {
    showError("ZIP code must be exactly 5 digits.")
    return false
  }

  if (!/^\d{5}$/.test(zipcode)) {
    showError("ZIP code must contain only numbers.")
    return false
  }

  return true
}

// Fetch data from Google Sheets via Apps Script
async function fetchWaterSystemData(zipcode) {
  console.log("Fetching data from Google Sheets for zipcode:", zipcode)

  // Check if Google Script URL is configured
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE") {
    console.error("Google Script URL not configured!")
    throw new Error("Google Sheets connection not configured. Please set up your Google Apps Script URL.")
  }

  try {
    const url = `${GOOGLE_SCRIPT_URL}?zipcode=${zipcode}`
    console.log("Making request to:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Parsed JSON data:", data)

    // Handle different response formats
    if (data.error) {
      throw new Error(data.error)
    }

    // Return the data array
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error in fetchWaterSystemData:", error)
    throw error
  }
}

// Display results
function displayResults() {
  console.log("Displaying results for", waterSystemsData.length, "systems")
  renderWaterSystemsCarousel()
  renderMitigationCarousel()
  showResults()
  updateCarouselButtons()
}

// Render water systems carousel
function renderWaterSystemsCarousel() {
  if (!waterSystemsCarousel) {
    console.error("waterSystemsCarousel element not found!")
    return
  }

  waterSystemsCarousel.innerHTML = ""

  waterSystemsData.forEach((system, index) => {
    const card = createWaterSystemCard(system)
    waterSystemsCarousel.appendChild(card)
  })

  updateWaterSystemsCarousel()
}

// Create water system card
function createWaterSystemCard(system) {
  const card = document.createElement("div")
  card.className = "water-system-card"

  // Get chemicals present
  const chemicals = []
  for (let i = 1; i <= 9; i++) {
    const chemical = system[`CHEMICAL ${i}`] || system[`CHEMICAL${i}`] // Handle both formats
    if (chemical && chemical.trim()) {
      chemicals.push(chemical.trim())
    }
  }

  const chemicalsText = chemicals.length > 0 ? chemicals.join(", ") : "None detected"

  // Handle different possible field names from Google Sheets
  const siteName = system.MAILINGNAME || system.SITENAME || system.NAME || "Unknown System"
  const address = system.ADDRESS1 || system.ADDRESS || "Address not available"
  const city = system.CITY || "City not available"
  const email = system.EMAIL || "Email not available"
  const phone = system.PHONE || "Phone not available"
  const microbiology = system.MICROBIOLOGY || "Status not available"

  card.innerHTML = `
        <div class="site-name">SITE NAME: ${siteName}</div>
        
        <div class="contact-section">
            <div class="contact-title">SITE CONTACT</div>
            <div class="contact-info">
                <div class="contact-item">
                    <span class="contact-label">ADDRESS:</span> ${address}
                </div>
                <div class="contact-item">
                    <span class="contact-label">CITY:</span> ${city}
                </div>
                <div class="contact-item">
                    <span class="contact-label">EMAIL:</span> ${email}
                </div>
                <div class="contact-item">
                    <span class="contact-label">PHONE NUMBER:</span> ${phone}
                </div>
            </div>
        </div>
        
        <div class="contaminants-section">
            <div class="contaminants-title">
                The following water contaminants were present during testing of the site in the year 2023
            </div>
            
            <div class="chemical-list">
                <strong>CHEMICALS PRESENT:</strong> ${chemicalsText}
            </div>
            
            <div class="microbiology-status">
                <strong>MICROBIOLOGY STATUS:</strong> ${microbiology}
            </div>
        </div>
        
        <div class="note">
            <strong>Note:</strong> The presence of chemicals should not scare you, in some instances the detected level is below the lethal level. However, it is important to take necessary precaution and contact the specific water system and Florida Department of environmental protection for current data and mitigation measures that have been put in place to minimize risk.
        </div>
    `

  return card
}

// Render mitigation carousel
function renderMitigationCarousel() {
  if (!mitigationCarousel) {
    console.error("mitigationCarousel element not found!")
    return
  }

  mitigationCarousel.innerHTML = ""

  waterSystemsData.forEach((system, index) => {
    const card = createMitigationCard(system)
    mitigationCarousel.appendChild(card)
  })

  updateMitigationCarousel()
}

// Create mitigation card
function createMitigationCard(system) {
  const card = document.createElement("div")
  card.className = "mitigation-card"

  let mitigationContent = ""

  for (let i = 1; i <= 9; i++) {
    const chemical = system[`CHEMICAL ${i}`] || system[`CHEMICAL${i}`] // Handle both formats
    const mitigation = system[`MITIGATION ${i}`] || system[`MITIGATION${i}`] // Handle both formats

    if (chemical && chemical.trim() && mitigation && mitigation.trim()) {
      mitigationContent += `
                <div class="mitigation-item">
                    <div class="chemical-name">For "${chemical}"</div>
                    <div class="mitigation-text">The following is recommended: ${mitigation}</div>
                </div>
            `
    }
  }

  if (!mitigationContent) {
    mitigationContent = `
            <div class="mitigation-item">
                <div class="mitigation-text">No specific mitigation measures required at this time. Continue to monitor water quality reports.</div>
            </div>
        `
  }

  const siteName = system.MAILINGNAME || system.SITENAME || system.NAME || "Unknown System"

  card.innerHTML = `
        <div class="mitigation-site-name">"${siteName}"</div>
        ${mitigationContent}
    `

  return card
}

// Navigation functions
function navigateWaterSystems(direction) {
  currentWaterSystemIndex += direction
  currentWaterSystemIndex = Math.max(0, Math.min(currentWaterSystemIndex, waterSystemsData.length - 1))
  currentMitigationIndex = currentWaterSystemIndex
  updateWaterSystemsCarousel()
  updateMitigationCarousel()
  updateCarouselButtons()
}

function navigateMitigation(direction) {
  currentMitigationIndex += direction
  currentMitigationIndex = Math.max(0, Math.min(currentMitigationIndex, waterSystemsData.length - 1))
  currentWaterSystemIndex = currentMitigationIndex
  updateWaterSystemsCarousel()
  updateMitigationCarousel()
  updateCarouselButtons()
}

// Update carousel positions
function updateWaterSystemsCarousel() {
  if (!waterSystemsCarousel) return
  const translateX = -currentWaterSystemIndex * 100
  waterSystemsCarousel.style.transform = `translateX(${translateX}%)`
}

function updateMitigationCarousel() {
  if (!mitigationCarousel) return
  const translateX = -currentMitigationIndex * 100
  mitigationCarousel.style.transform = `translateX(${translateX}%)`
}

// Update carousel button states and results title
function updateCarouselButtons() {
  const hasMultipleSystems = waterSystemsData.length > 1

  if (prevBtn) {
    prevBtn.disabled = currentWaterSystemIndex === 0
    prevBtn.style.display = hasMultipleSystems ? "block" : "none"
  }
  if (nextBtn) {
    nextBtn.disabled = currentWaterSystemIndex === waterSystemsData.length - 1
    nextBtn.style.display = hasMultipleSystems ? "block" : "none"
  }

  if (mitigationPrevBtn) {
    mitigationPrevBtn.disabled = currentMitigationIndex === 0
    mitigationPrevBtn.style.display = hasMultipleSystems ? "block" : "none"
  }
  if (mitigationNextBtn) {
    mitigationNextBtn.disabled = currentMitigationIndex === waterSystemsData.length - 1
    mitigationNextBtn.style.display = hasMultipleSystems ? "block" : "none"
  }

  const resultsTitle = document.querySelector(".results-title")
  if (resultsTitle) {
    if (hasMultipleSystems) {
      resultsTitle.textContent = `The following are information for water system(s) in the specified zip code (${currentWaterSystemIndex + 1} of ${waterSystemsData.length})`
    } else {
      resultsTitle.textContent = "The following are information for water system(s) in the specified zip code"
    }
  }
}

// UI helper functions
function showLoading() {
  if (loading) loading.classList.remove("hidden")
}

function hideLoading() {
  if (loading) loading.classList.add("hidden")
}

function showResults() {
  if (resultsSection) resultsSection.classList.remove("hidden")
  if (mitigationSection) mitigationSection.classList.remove("hidden")
}

function hideResults() {
  if (resultsSection) resultsSection.classList.add("hidden")
  if (mitigationSection) mitigationSection.classList.add("hidden")
}

function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
  }
}

function hideError() {
  if (errorMessage) {
    errorMessage.style.display = "none"
  }
}
