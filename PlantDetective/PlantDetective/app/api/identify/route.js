import { identifyPlantWithOpenAI } from '../../utils/openaiApi';
import { storage } from '../../../server/storage';

// Use a detailed sample response for the demo mode
const sampleData = {
  commonName: "Peace Lily",
  scientificName: "Spathiphyllum wallisii",
  description: "The Peace Lily is a popular indoor plant with elegant white flowers and glossy, dark green leaves. It's known for its air-purifying qualities and ability to thrive in low light conditions.",
  careTips: [
    "Light: Thrives in low to medium indirect light; avoid direct sunlight",
    "Water: Keep soil moist but not soggy; allow top inch to dry between waterings",
    "Soil: Well-draining potting mix rich in organic matter",
    "Temperature: Prefers 65-85°F (18-29°C); avoid cold drafts",
    "Fertilizer: Feed monthly with balanced houseplant fertilizer during growing season"
  ],
  funFacts: [
    "Peace Lilies were named for their white flowers resembling white flags of peace",
    "They're excellent air purifiers that can remove toxins like benzene and formaldehyde",
    "The plant produces oxygen even at night, making it ideal for bedrooms",
    "In some cultures, Peace Lilies symbolize prosperity, tranquility, and purity"
  ]
};

export async function POST(request) {
  try {
    // Process the uploaded file
    const formData = await request.formData();
    const imageFile = formData.get('image');
    
    if (!imageFile) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }
    
    // Check if we have a valid OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Log API key detection (safely)
    console.log('API Key detection:');
    console.log('- API Key exists:', apiKey ? 'Yes' : 'No');
    console.log('- API Key starts with:', apiKey ? apiKey.substring(0, 8) + '...' : 'N/A');
    
    if (!apiKey) {
      // Ask for an API key if not available
      console.warn('DEMO MODE: No OpenAI API key found. Using sample data.');
      
      // Return sample data with a clear notice
      return Response.json({
        ...sampleData,
        _notice: "DEMO MODE: This is sample data. The app is showing the same plant information regardless of the image you upload. To enable real plant identification, please provide a valid OpenAI API key."
      });
    }
    
    try {
      // Convert image to base64
      const buffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      
      // Use OpenAI to identify the plant
      console.log('Identifying plant with OpenAI API...');
      const identificationResult = await identifyPlantWithOpenAI(base64Image);
      
      // Store the plant data in the database
      try {
        // First check if the plant already exists
        let plant = await storage.getPlantByName(identificationResult.commonName);
        
        // If not, create it
        if (!plant) {
          plant = await storage.createPlant({
            commonName: identificationResult.commonName,
            scientificName: identificationResult.scientificName,
            description: identificationResult.description,
            careTips: identificationResult.careTips,
            funFacts: identificationResult.funFacts || []
          });
        }
        
        // Record this identification
        await storage.createIdentification({
          plantId: plant.id,
          isSuccessful: true
        });
      } catch (dbError) {
        console.error('Error storing plant data:', dbError);
        // Continue even if database storage fails
      }
      
      // Return the identification result
      return Response.json(identificationResult);
      
    } catch (apiError) {
      console.error('Error with OpenAI API:', apiError);
      
      // Check if this is a quota error
      if (apiError.message && apiError.message.includes('quota')) {
        console.warn('API quota exceeded. Using sample data as fallback.');
        return Response.json({
          ...sampleData,
          _notice: "API QUOTA EXCEEDED: Your OpenAI API key has reached its usage limit. Using sample data instead. Please upgrade your OpenAI plan or try again later."
        });
      }
      
      // If API call fails for other reasons, fall back to sample data
      return Response.json({
        ...sampleData,
        _notice: "API ERROR: Could not identify the plant with OpenAI API. Using sample data instead. Error: " + apiError.message
      });
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Check if this is a quota error
    if (error.message && error.message.includes('quota')) {
      console.warn('API quota exceeded. Using sample data as fallback.');
      return Response.json({
        ...sampleData,
        _notice: "API QUOTA EXCEEDED: Your OpenAI API key has reached its usage limit. Using sample data instead. Please upgrade your OpenAI plan or try again later."
      });
    }
    
    return Response.json(
      { error: 'Failed to process request: ' + error.message },
      { status: 500 }
    );
  }
}
