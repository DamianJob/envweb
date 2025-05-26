// script.js

document.addEventListener('DOMContentLoaded', function() {
    const zipCodeInput = document.getElementById('zipCode');
    const checkButton = document.getElementById('checkButton');
    const resultsSection = document.getElementById('results');
    const systemName = document.getElementById('systemName');
    const systemAddress = document.getElementById('systemAddress');
    const systemCity = document.getElementById('systemCity');
    const systemEmail = document.getElementById('systemEmail');
    const systemPhone = document.getElementById('systemPhone');
    const chemicalList = document.getElementById('chemicalList');
    const microbiologyResults = document.getElementById('microbiologyResults');
    const mitigationList = document.getElementById('mitigationList');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const mitigationPrevBtn = document.getElementById('mitigationPrevBtn');
    const mitigationNextBtn = document.getElementById('mitigationNextBtn');
    
    let waterSystemsData = [];
    let currentWaterSystemIndex = 0;
    let currentMitigationIndex = 0;

    // Function to display water system information
    function displayWaterSystem(system) {
        systemName.textContent = system.MAILINGNAME;
        systemAddress.textContent = system.ADDRESS1;
        systemCity.textContent = system.CITY;
        systemEmail.textContent = system.EMAIL;
        systemPhone.textContent = system.PHONE;

        // Display chemical violations
        chemicalList.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const chemical = system[`CHEMICAL ${i}`];
            if (chemical) {
                const listItem = document.createElement('li');
                listItem.textContent = chemical;
                chemicalList.appendChild(listItem);
            }
        }

        // Display microbiology results
        microbiologyResults.textContent = system.MICROBIOLOGY;

        // Display mitigation strategies
        mitigationList.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const mitigation = system[`MITIGATION ${i}`];
            if (mitigation) {
                const listItem = document.createElement('li');
                listItem.textContent = mitigation;
                mitigationList.appendChild(listItem);
            }
        }
    }

    // Function to handle navigation between water systems
    function navigateWaterSystems(direction) {
        currentWaterSystemIndex += direction;
        displayWaterSystem(waterSystemsData[currentWaterSystemIndex]);
        updateCarouselButtons();
    }

    // Function to handle navigation between mitigation strategies
    function navigateMitigation(direction) {
        currentMitigationIndex += direction;
        //displayMitigation(waterSystemsData[currentWaterSystemIndex].mitigations[currentMitigationIndex]);
        updateCarouselButtons();
    }

    // Update carousel button states
    function updateCarouselButtons() {
        const hasMultipleSystems = waterSystemsData.length > 1;
        
        // Water systems carousel buttons
        prevBtn.disabled = currentWaterSystemIndex === 0;
        nextBtn.disabled = currentWaterSystemIndex === waterSystemsData.length - 1;
        prevBtn.style.display = hasMultipleSystems ? 'flex' : 'none';
        nextBtn.style.display = hasMultipleSystems ? 'flex' : 'none';
        
        // Mitigation carousel buttons
        mitigationPrevBtn.disabled = currentMitigationIndex === 0;
        mitigationNextBtn.disabled = currentMitigationIndex === waterSystemsData.length - 1;
        mitigationPrevBtn.style.display = hasMultipleSystems ? 'flex' : 'none';
        mitigationNextBtn.style.display = hasMultipleSystems ? 'flex' : 'none';
        
        // Update results title to show current position
        const resultsTitle = document.querySelector('.results-title');
        if (hasMultipleSystems) {
            resultsTitle.textContent = `The following are information for water system(s) in the specified zip code (${currentWaterSystemIndex + 1} of ${waterSystemsData.length})`;
        } else {
            resultsTitle.textContent = 'The following are information for water system(s) in the specified zip code';
        }
    }

    // Event listener for checking water systems
    checkButton.addEventListener('click', function() {
        const zipCode = zipCodeInput.value;
        if (zipCode) {
            waterSystemsData = generateMockData(zipCode);
            currentWaterSystemIndex = 0;
            currentMitigationIndex = 0;

            if (waterSystemsData.length > 0) {
                displayWaterSystem(waterSystemsData[currentWaterSystemIndex]);
                resultsSection.classList.remove('hidden');
                updateCarouselButtons();
            } else {
                alert('No water systems found for this zip code.');
                resultsSection.classList.add('hidden');
            }
        } else {
            alert('Please enter a zip code.');
        }
    });

    // Event listeners for carousel buttons
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

    // Generate mock data for demonstration
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
        
        return mockSystems;
    }
});
