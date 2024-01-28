import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

const Test = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const cameraRef = useRef(null);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  // Function to open the device's camera using Expo Camera
  const openCamera = async () => {
    if (cameraPermission && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  // Function to convert the captured image to base64
  const convertImageToBase64 = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Function to make the API request
  const makeApiRequest = async () => {
    if (capturedImage) {
      console.log('Captured Image URI:', capturedImage);

      const imageBase64 = await convertImageToBase64(capturedImage);

      // Define your endpoint and project IDs
      const ENDPOINT_ID="8171194384654532608"
      const PROJECT_ID="834745453959"

      // Create the JSON object
      const data = {
        instances: [
          {
            content: imageBase64,
          },
        ],
        parameters: {
          confidenceThreshold: 0.5,
          maxPredictions: 1,
        },
      };

      // Make the API request
      fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/endpoints/${ENDPOINT_ID}:predict`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ya29.a0AfB_byA7WpC-b881VmSJ2oqwG9tFTmyaQ6bbIvvGMQ6tlONn8A4Sv72Xs2l3hBOhBCGtktu_FQieB_OpuXO60b_D6GI-fuayDI4zS_7R9zYnaj25Kr1vPbVEoep4dAuQee31J0vxT2GoY8QgwBLDz6xzeV-s5UXo0h5CMgOnDgaCgYKAWMSARISFQHGX2Mi0IT0gy5mARLmu7Ky3jPPDQ0177',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(result => {
          // Handle the API response here
          console.log(result);
        })
        .catch(error => {
          // Handle errors here
          console.error(error);
        });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        onCameraReady={() => console.log('Camera is ready')}
      />
      
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 }}>
        <Text>Your React Native App</Text>

        {/* Display the captured image if available */}
        {capturedImage && (
          <Image
            source={{ uri: capturedImage }}
            style={{ width: 200, height: 200, marginBottom: 10 }}
          />
        )}

        {/* Button to open the camera */}
        <TouchableOpacity onPress={openCamera} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5, marginBottom: 10 }}>
          <Text style={{ color: 'white' }}>Open Camera</Text>
        </TouchableOpacity>

        {/* Button to make the API request */}
        <TouchableOpacity onPress={makeApiRequest} style={{ padding: 10, backgroundColor: 'green', borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Make API Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Test;
