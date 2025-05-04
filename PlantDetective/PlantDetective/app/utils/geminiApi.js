import { GoogleGenerativeAI } from '@google/generative-ai';

// Function to convert an image to a base64 string
export const imageToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the prefix (e.g., "data:image/jpeg;base64,") to get only the base64 string
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Process the text response from Gemini into structured data
export const processGeminiResponse = (response) => {
  const text = response.trim();
  
  // Extract fields from the response
  const commonName = extractField(text, 'Common Name:', '\n') || 'Unknown Plant';
  const scientificName = extractField(text, 'Scientific Name:', '\n') || 'Species unknown';
  const description = extractField(text, 'Description:', '\n\n') || 'No description available';
  
  // Extract care tips
  let careTips = [];
  const careTipsSection = extractField(text, 'Care Tips:', '\n\n');
  if (careTipsSection) {
    careTips = careTipsSection
      .split('\n')
      .map(tip => tip.trim())
      .filter(tip => tip.length > 0 && !tip.startsWith('Care Tips:'));
  }
  
  // Extract fun facts
  let funFacts = [];
  const funFactsSection = extractField(text, 'Fun Facts:', '\n\n');
  if (funFactsSection) {
    funFacts = funFactsSection
      .split('\n')
      .map(fact => fact.trim())
      .filter(fact => fact.length > 0 && !fact.startsWith('Fun Facts:'));
  }
  
  return {
    commonName,
    scientificName,
    description,
    careTips,
    funFacts
  };
};

// Helper function to extract content between labels
function extractField(text, startLabel, endLabel) {
  const startIndex = text.indexOf(startLabel);
  if (startIndex === -1) return null;
  
  const endIndex = text.indexOf(endLabel, startIndex + startLabel.length);
  if (endIndex === -1) {
    // If end label not found, take all remaining text
    return text.substring(startIndex + startLabel.length).trim();
  }
  
  return text.substring(startIndex + startLabel.length, endIndex).trim();
}
