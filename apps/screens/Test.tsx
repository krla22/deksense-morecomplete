import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, TextInput, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB, REALTIME_DB } from '../../firebaseConfig';
import { getDatabase, ref, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';

const Test = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back); // Default to back camera
  const cameraRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [autoCaptureInterval, setAutoCaptureInterval] = useState(null);
  const [accessToken, setAccessToken] = useState('');

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();

    const fetchAccessToken = async () => {
      const accessTokenDocRef = doc(FIRESTORE_DB, 'accessTokens', 'accessTokens'); // Replace with your actual document ID
      try {
        const docSnap = await getDoc(accessTokenDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAccessToken(data.accessTokens);
          console.log('Access token retrieved')
        } else {
          console.log('No such document!');
        }
      } catch (e) {
        console.error('Error fetching document:', e);
      }
    };

    fetchAccessToken();

  }, []);

  const openCamera = async () => {
    if (cameraPermission && cameraRef.current) {
      setPredictions([]);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Base Image URI:', photo.uri);

        const resizedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 600, height: 600 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );
        console.log('Resized Image URI:', resizedImage.uri);

        const imageBase64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log('Base64 Image Converted');

        await setCapturedImage(resizedImage.uri); // Update the state with the processed image URI

        // Call makeApiRequest with the processed image
        await makeApiRequest(resizedImage.uri, imageBase64);
      } catch (error) {
        console.error('Error taking and processing picture:', error);
      }
    }
  };

  const makeApiRequest = async (processedImageUri, imageBase64) => {
    if (processedImageUri) {
      console.log('Processed Image URI:', processedImageUri);

      const ENDPOINT_ID = '8547807903493390336';
      const PROJECT_ID = '241313517878';

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

      try {
        // Make the API request
        const response = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/endpoints/${ENDPOINT_ID}:predict`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log(result);

        const predictions = result.predictions || [];

        console.log('Predictions:', predictions);

        setPredictions(predictions);
      } catch (error) {
        console.error(error);
        Alert.alert('API Request Error', error.message);
      }
    }
  };

  // Toggle between front and back cameras
  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  // Start automatic capture at intervals
  const startAutoCapture = () => {
    setAutoCaptureInterval(setInterval(() => {
      openCamera();
    }, 5000)); // Capture every 5 seconds
  };

  // Stop automatic capture
  const stopAutoCapture = () => {
    clearInterval(autoCaptureInterval);
    setAutoCaptureInterval(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.7}}>
        <Camera
          style={{ flex: 1 }}
          type={cameraType}
          ref={cameraRef}
          onCameraReady={() => console.log('Camera is ready')}
        />
      </View>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 5, alignItems: "center" }}>
        <View style={{backgroundColor: "white", flexDirection: "row" }}>
          {capturedImage && (
            <Image
            source={{ uri: capturedImage }}
            style={{ width: 80, height: 80, margin: 10 }}
            />
          )}
          {predictions.map((prediction, index) => (
            <View key={index} style={{alignItems: 'center', marginTop: 10}}>
              <Text>Predictions:</Text>
              <Text>Confidences: {prediction.confidences.join(', ')}</Text>
              <Text>Display Names: {prediction.displayNames.join(', ')}</Text>
              <Text>IDs: {prediction.ids.join(', ')}</Text>
            </View>
          ))}
        </View>


        <ScrollView horizontal >
          <View style={{alignItems: "center"}}>
            <TouchableOpacity onPress={openCamera} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5, margin: 5, width: 140 }}>
              <Text style={{ color: 'white', fontSize: 15, textAlign: "center" }}>Check Posture</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraType} style={{ padding: 10, backgroundColor: 'orange', borderRadius: 5, margin: 5, width: 140 }}>
              <Text style={{ color: 'white', fontSize: 15, textAlign: "center" }}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: "center", alignSelf: "center"}}>
            <TouchableOpacity onPress={startAutoCapture} style={{ padding: 10, backgroundColor: 'purple', borderRadius: 5, margin: 5, width: 140 }}>
              <Text style={{ color: 'white', fontSize: 15, textAlign: "center" }}>Auto Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={stopAutoCapture} style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, margin: 5, width: 140 }}>
              <Text style={{ color: 'white', fontSize: 15, textAlign: "center" }}>Stop Capture</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Test;
