import Anthropic from '@anthropic-ai/sdk';

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

// Process the text response from Claude into structured data
export const processClaudeResponse = (response) => {
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

// Use Anthropic's API to identify a plant from an image
export async function identifyPlantWithClaude(base64Image) {
  // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `I have an image of a plant. Please identify it and provide the following information in this exact format:

Common Name: [plant's common name]
Scientific Name: [plant's scientific name]
Description: [short description of the plant]

Care Tips:
[bullet point list of 5 care tips including light, water, soil, temperature, and fertilizer requirements]

Fun Facts:
[bullet point list of 3-4 interesting facts about the plant]

Please be very specific in your identification and only respond with the above format.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ]
    });

    return processClaudeResponse(response.content[0].text);
  } catch (error) {
    console.error('Error identifying plant with Claude:', error);
    throw error;
  }
}
