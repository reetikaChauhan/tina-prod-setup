const fs = require('fs');
const path = require('path');

// Define the file you want to sanitize (client.ts in this case)
const generatedFilePath = path.join(__dirname, '../tina/__generated__/client.ts');

// Define the sensitive information or patterns to remove
const sensitivePatterns = [
  /TINA_TOKEN\s*=\s*['"][^'"]+['"]/g,  // Example pattern for TINA_TOKEN
  /token\s*:\s*['"][^'"]+['"]/g,  // Other token patterns
  // Add more patterns as necessary
];

// Function to remove sensitive data from the file
const sanitizeFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // Remove sensitive data using regex patterns
    sensitivePatterns.forEach((pattern) => {
      fileContent = fileContent.replace(pattern, '/* REPLACED SENSITIVE DATA */');
    });

    // Write the sanitized content back to the file
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`Sensitive data removed from: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
};

// Run the sanitization
sanitizeFile(generatedFilePath);
