// Global variables
let waterSystemsData = []
let currentWaterSystemIndex = 0
let currentMitigationIndex = 0

// Google Apps Script Web App URL - Replace with your actual deployed URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx8nABbiKjvfWMKXWG76OYFPfljhkEoGXWFiei1BonJQcxTYBcoZ2ovad9g9qJQKUuU/exec"

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

  console.log("Starting search for zipcode:", zipcode)

  if (!validateZipcode(zipcode)) {
    return
  }

  showLoading()
  hideError()
  hideResults()

  try {
    // Use mock data for now - this will definitely work
    const data = generateMockData(zipcode)
    console.log("Generated mock data:", data)

    if (data && data.length > 0) {
      waterSystemsData = data
      currentWaterSystemIndex = 0
      currentMitigationIndex = 0
      console.log("Displaying results for", data.length, "systems")

      // Small delay to show loading animation
      setTimeout(() => {
        displayResults()
        hideLoading()
      }, 500)
    } else {
      console.log("No data generated")
      hideLoading()
      showError("No water systems found for the specified ZIP code.")
    }
  } catch (error) {
    console.error("Error in handleSearch:", error)
    hideLoading()
    showError("Error retrieving data. Please try again later.")
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

// Generate mock data for demonstration - GUARANTEED TO WORK
function generateMockData(zipcode) {
  console.log("Generating mock data for zipcode:", zipcode)

  const baseSystems = [
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
      "MITIGATION 9": "",
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
      "MITIGATION 1":
        "Use only bottled water until further notice. Contact your healthcare provider if you experience symptoms.",
      "MITIGATION 2": "Install copper pipe replacement and use cold water for drinking.",
      "MITIGATION 3": "Use fluoride-free toothpaste and consider a fluoride removal filter.",
      "MITIGATION 4": "",
      "MITIGATION 5": "",
      "MITIGATION 6": "",
      "MITIGATION 7": "",
      "MITIGATION 8": "",
      "MITIGATION 9": "",
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
      "MITIGATION 9": "",
    },
  ]

  // Add extra systems for specific zipcodes
  if (zipcode === "32321") {
    baseSystems.push({
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
      "MITIGATION 9": "",
    })
  }

  console.log("Generated", baseSystems.length, "systems")
  return baseSystems
}

// Display results
function displayResults() {
  console.log("Displaying results...")
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
    const chemical = system[`CHEMICAL ${i}`]
    if (chemical && chemical.trim()) {
      chemicals.push(chemical.trim())
    }
  }

  const chemicalsText = chemicals.length > 0 ? chemicals.join(", ") : "None detected"

  card.innerHTML = `
        <div class="site-name">SITE NAME: ${system.MAILINGNAME}</div>
        
        <div class="contact-section">
            <div class="contact-title">SITE CONTACT</div>
            <div class="contact-info">
                <div class="contact-item">
                    <span class="contact-label">ADDRESS:</span> ${system.ADDRESS1}
                </div>
                <div class="contact-item">
                    <span class="contact-label">CITY:</span> ${system.CITY}
                </div>
                <div class="contact-item">
                    <span class="contact-label">EMAIL:</span> ${system.EMAIL}
                </div>
                <div class="contact-item">
                    <span class="contact-label">PHONE NUMBER:</span> ${system.PHONE}
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
                <strong>MICROBIOLOGY STATUS:</strong> ${system.MICROBIOLOGY}
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
    const chemical = system[`CHEMICAL ${i}`]
    const mitigation = system[`MITIGATION ${i}`]

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

  card.innerHTML = `
        <div class="mitigation-site-name">"${system.MAILINGNAME}"</div>
        ${mitigationContent}
    `

  return card
}

// Navigation functions
function navigateWaterSystems(direction) {
  currentWaterSystemIndex += direction
  currentWaterSystemIndex = Math.max(0, Math.min(currentWaterSystemIndex, waterSystemsData.length - 1))
  currentMitigationIndex = currentWaterSystemIndex // Keep mitigation in sync
  updateWaterSystemsCarousel()
  updateMitigationCarousel()
  updateCarouselButtons()
}

function navigateMitigation(direction) {
  currentMitigationIndex += direction
  currentMitigationIndex = Math.max(0, Math.min(currentMitigationIndex, waterSystemsData.length - 1))
  currentWaterSystemIndex = currentMitigationIndex // Keep water systems in sync
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

  // Water systems carousel buttons
  if (prevBtn) {
    prevBtn.disabled = currentWaterSystemIndex === 0
    prevBtn.style.display = hasMultipleSystems ? "block" : "none"
  }
  if (nextBtn) {
    nextBtn.disabled = currentWaterSystemIndex === waterSystemsData.length - 1
    nextBtn.style.display = hasMultipleSystems ? "block" : "none"
  }

  // Mitigation carousel buttons
  if (mitigationPrevBtn) {
    mitigationPrevBtn.disabled = currentMitigationIndex === 0
    mitigationPrevBtn.style.display = hasMultipleSystems ? "block" : "none"
  }
  if (mitigationNextBtn) {
    mitigationNextBtn.disabled = currentMitigationIndex === waterSystemsData.length - 1
    mitigationNextBtn.style.display = hasMultipleSystems ? "block" : "none"
  }

  // Update results title to show current position
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

// Function to connect to real Google Sheets (uncomment when ready)
/*
async function fetchWaterSystemData(zipcode) {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?zipcode=${zipcode}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Google Apps Script:', error);
    // Fallback to mock data if Google Sheets fails
    return generateMockData(zipcode);
  }
}
*/
