'use client';

import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUpload from './components/ImageUpload';
import CameraCapture from './components/CameraCapture';
import PlantDetails from './components/PlantDetails';
import LoadingState from './components/LoadingState';
import ErrorDisplay from './components/ErrorDisplay';

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle image uploads from the file input
  const handleImageUpload = async (file) => {
    setImageUrl(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setPlantData(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPlantData(data);
    } catch (err) {
      console.error('Error identifying plant:', err);
      setError(err.message || 'Failed to identify plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle images captured from the camera
  const handleCameraCapture = async (dataUrl) => {
    setImageUrl(dataUrl);
    setLoading(true);
    setError(null);
    setPlantData(null);

    try {
      // Convert the data URL to a file object
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });

      // Create a FormData object to send to the API
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPlantData(data);
    } catch (err) {
      console.error('Error identifying plant from camera capture:', err);
      setError(err.message || 'Failed to identify plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setImageUrl(null);
    setPlantData(null);
    setLoading(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {!imageUrl && !loading && !error && (
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-4">
                Identify Any Plant with AI
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Upload a photo or use your camera to get instant plant identification and care tips
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">Upload Image</h2>
                  <ImageUpload onUpload={handleImageUpload} />
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">Take Photo</h2>
                  <CameraCapture onCapture={handleCameraCapture} />
                </div>
              </div>
            </div>
          )}

          {loading && <LoadingState />}

          {error && <ErrorDisplay message={error} onReset={resetState} />}

          {imageUrl && plantData && !loading && !error && (
            <PlantDetails data={plantData} imageUrl={imageUrl} onReset={resetState} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
