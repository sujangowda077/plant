"use client";

import { useRef, useState, useCallback, useEffect } from 'react';

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // Start with rear camera

  // Start the camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
      
      // Set the stream to state
      setStream(mediaStream);
      setIsCameraActive(true);
      setHasCameraPermission(true);
      
      // Set the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasCameraPermission(false);
    }
  }, [facingMode]);

  // Stop the camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // Switch between front and rear cameras
  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  }, [facingMode, stopCamera]);

  // State to store captured image
  const [capturedImage, setCapturedImage] = useState(null);

  // Take a photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL (JPEG format)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Set the captured image preview
      setCapturedImage(dataUrl);
      
      // Stop the camera after capturing
      stopCamera();
    } catch (err) {
      console.error('Error capturing photo:', err);
    }
  }, [stopCamera]);

  // Confirm and use the captured photo
  const confirmPhoto = useCallback(() => {
    if (capturedImage) {
      // Call the onCapture callback with the data URL
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // If we don't know camera permission status yet, return null
  if (hasCameraPermission === null && !isCameraActive) {
    return (
      <div className="text-center p-4">
        <button 
          onClick={startCamera}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors">
          Open Camera
        </button>
      </div>
    );
  }

  // If camera permission denied
  if (hasCameraPermission === false) {
    return (
      <div className="text-center p-4 text-red-600 dark:text-red-400">
        <p>Camera access denied. Please enable camera permissions and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {capturedImage ? (
        // Show captured image with confirm/retake buttons
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img 
              src={capturedImage} 
              alt="Captured plant" 
              className="w-full object-contain" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center p-4">
              <div className="flex justify-center space-x-4 w-full">
                <button
                  onClick={retakePhoto}
                  className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retake
                </button>
                
                <button
                  onClick={confirmPhoto}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors w-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : isCameraActive ? (
        // Show camera stream
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg shadow-lg"
          />
          
          <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4">
            <button
              onClick={capturePhoto}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <circle cx="12" cy="12" r="8" fill="currentColor" />
              </svg>
            </button>
            
            <button
              onClick={switchCamera}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
            
            <button
              onClick={stopCamera}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        // Show button to start camera
        <div className="text-center p-4">
          <button 
            onClick={startCamera}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors">
            Open Camera
          </button>
        </div>
      )}
    </div>
  );
}
