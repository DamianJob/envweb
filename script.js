/**
 * Google Apps Script for FAMU Water Quality Website
 * This script should be deployed as a web app to handle data requests
 */

// Replace with your actual Google Sheets ID
const SHEET_ID = 'YOUR_GOOGLE_SHEETS_ID_HERE';
const SHEET_NAME = 'Sheet1'; // Replace with your actual sheet name

/**
 * Main function to handle GET requests from the website
 */
function doGet(e) {
  try {
    const zipcode = e.parameter.zipcode;
    
    if (!zipcode) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'ZIP code is required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = getWaterSystemsByZipcode(zipcode);
    
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Internal server error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Function to retrieve water systems data by ZIP code
 */
function getWaterSystemsByZipcode(zipcode) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return [];
    }
    
    // Get headers from first row
    const headers = data[0];
    
    // Find the ZIPFIVE column index
    const zipfiveIndex = headers.indexOf('ZIPFIVE');
    
    if (zipfiveIndex === -1) {
      throw new Error('ZIPFIVE column not found in spreadsheet');
    }
    
    // Filter data by ZIP code and convert to objects
    const filteredData = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowZipcode = String(row[zipfiveIndex]).trim();
      
      if (rowZipcode === zipcode) {
        const rowObject = {};
        
        // Convert row to object using headers
        headers.forEach((header, index) => {
          rowObject[header] = row[index] || '';
        });
        
        filteredData.push(rowObject);
      }
    }
    
    return filteredData;
    
  } catch (error) {
    console.error('Error in getWaterSystemsByZipcode:', error);
    throw error;
  }
}

/**
 * Function to test the script (for development purposes)
 */
function testScript() {
  try {
    const testZipcode = '32301'; // Replace with a test ZIP code from your data
    const result = getWaterSystemsByZipcode(testZipcode);
    console.log('Test result:', result);
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    return null;
  }
}

/**
 * Function to get all unique ZIP codes (for debugging)
 */
function getAllZipcodes() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return [];
    }
    
    const headers = data[0];
    const zipfiveIndex = headers.indexOf('ZIPFIVE');
    
    if (zipfiveIndex === -1) {
      return [];
    }
    
    const zipcodes = new Set();
    
    for (let i = 1; i < data.length; i++) {
      const zipcode = String(data[i][zipfiveIndex]).trim();
      if (zipcode) {
        zipcodes.add(zipcode);
      }
    }
    
    return Array.from(zipcodes).sort();
    
  } catch (error) {
    console.error('Error in getAllZipcodes:', error);
    return [];
  }
}

/**
 * Function to validate spreadsheet structure
 */
function validateSpreadsheetStructure() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    const requiredColumns = [
      'COUNTY', 'EMAIL', 'PWSID', 'MAILINGNAME', 'ADDRESS1', 'ADDRESS2',
      'CITY', 'ZIPFIVE', 'ZIPFOUR', 'PHONE', 'CHEMICAL 1', 'CHEMICAL 2',
      'CHEMICAL 3', 'CHEMICAL 4', 'CHEMICAL 5', 'CHEMICAL 6', 'CHEMICAL 7',
      'CHEMICAL 8', 'CHEMICAL 9', 'MICROBIOLOGY', 'MITIGATION 1', 'MITIGATION 2',
      'MITIGATION 3', 'MITIGATION 4', 'MITIGATION 5', 'MITIGATION 6',
      'MITIGATION 7', 'MITIGATION 8', 'MITIGATION 9'
    ];
    
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      console.error('Missing columns:', missingColumns);
      return false;
    }
    
    console.log('Spreadsheet structure is valid');
    return true;
    
  } catch (error) {
    console.error('Error validating spreadsheet structure:', error);
    return false;
  }
}

/**
 * Function to setup the web app (run this once after deployment)
 */
function setupWebApp() {
  console.log('Setting up web app...');
  
  // Validate spreadsheet structure
  if (!validateSpreadsheetStructure()) {
    console.error('Spreadsheet structure validation failed');
    return false;
  }
  
  // Test with a sample ZIP code
  const testResult = testScript();
  if (testResult) {
    console.log('Setup completed successfully');
    return true;
  } else {
    console.error('Setup test failed');
    return false;
  }
}

/**
 * Instructions for deployment:
 * 
 * 1. Replace SHEET_ID with your actual Google Sheets ID
 * 2. Replace SHEET_NAME with your actual sheet name
 * 3. Deploy this script as a web app:
 *    - Click "Deploy" > "New deployment"
 *    - Choose "Web app" as the type
 *    - Set execute as "Me"
 *    - Set access to "Anyone"
 *    - Click "Deploy"
 * 4. Copy the web app URL and update the GOOGLE_SCRIPT_URL in script.js
 * 5. Run the setupWebApp() function to validate everything is working
 */
