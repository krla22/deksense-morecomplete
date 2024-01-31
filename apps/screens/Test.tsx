import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB, REALTIME_DB } from '../../firebaseConfig';
import { ref, get, update, set } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';

const Test = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [autoCaptureInterval, setAutoCaptureInterval] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [isWatching, setIsWatching] = useState(false);
  const [useCamera, setUseCamera] = useState(false)
  const [showCameraButtons, setShowCameraButtons] = useState(true);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();

  }, []);

  const openCamera = async () => {
    if (cameraPermission && cameraRef.current) {
      setPredictions([]);
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        const resizedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 600, height: 600 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );

        console.log('Resized Image URI:', resizedImage.uri);

        const resizedImageBase64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await setCapturedImage(resizedImage.uri);
        await makeApiRequest(resizedImage.uri, resizedImageBase64);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const changeImageSource = async () => {
    setPredictions([]);
    try {
      if (useCamera) {
        setShowCameraButtons(true);
        await openCamera();
      } else {
        setShowCameraButtons(false);
        const databaseRef = ref(REALTIME_DB, 'images');
        const snapshot = await get(databaseRef);
        const imageData = snapshot.val();

        if (imageData) {
          const imageUri = `data:image/jpeg;base64,${imageData}`;
          await setCapturedImage(imageUri);

          const resizedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width: 600, height: 600 } }],
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
          );
  
          console.log('Resized Image URI:', resizedImage.uri);
  
          const resizedImageBase64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
  
          await setCapturedImage(resizedImage.uri);
          await makeApiRequest(resizedImage.uri, resizedImageBase64);
        } else {
          console.log('No base64 image found in the database');
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const takeSinglePhoto = async () => {
    if (cameraPermission && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        const resizedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 600, height: 600 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );
        console.log("==================================================================")  
        console.log('Resized Image URI:', resizedImage.uri);

        const resizedImageBase64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await setCapturedImage(resizedImage.uri);
        await makeApiRequest(resizedImage.uri, resizedImageBase64);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const makeApiRequest = async (processedImageUri, resizedImageBase64) => {
    if (processedImageUri) {
      const fetchToken = async () => {
        const accessTokenDocRef = doc(FIRESTORE_DB, 'tokens', 'inside');
        try {
          const docSnap = await getDoc(accessTokenDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAccessToken(data.token);
  
            console.log('Access Token Retrieved');
          } else {
            console.log('No such document!');
          }
        } catch (e) {
          console.error('Error fetching document:', e);
        }
      };
  
      await fetchToken();
  
      const user = FIREBASE_AUTH.currentUser;
      const userUID = user?.uid;
  
      if (userUID) {
        const ENDPOINT_ID = '2297937520609984512';
        const PROJECT_ID = '241313517878';
  
        const data = {
          instances: [
            {
              content: resizedImageBase64,
            },
          ],
          parameters: {
            confidenceThreshold: 0.3,
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
  
          if (predictions.length > 0) {
            // Find the prediction with the highest confidence
            const maxConfidencePrediction = predictions.reduce((max, prediction) => {
              const confidences = prediction.confidences;
              const maxConfidence = Math.max(...confidences);
  
              if (maxConfidence > max.confidences[0]) {
                const maxConfidenceIndex = confidences.indexOf(maxConfidence);
                return {
                  ...prediction,
                  confidences: [maxConfidence],
                  maxConfidenceIndex: maxConfidenceIndex,
                };
              } else {
                return max;
              }
            }, { confidences: [0] });
  
            if (maxConfidencePrediction.displayNames && maxConfidencePrediction.displayNames.length > 0) {
              const maxConfidenceIndex = maxConfidencePrediction.maxConfidenceIndex;
              let confidence = parseFloat(maxConfidencePrediction.confidences[0]).toFixed(2);
              let displayName = maxConfidencePrediction.displayNames[maxConfidenceIndex];
              console.log('Confidence to add:', confidence);
              console.log('Name to add:', displayName);
  
              // Map the display name to the desired format
              switch (displayName) {
                case 'GoodPosture':
                  displayName = 'Good Posture';
                  break;
                case 'BadPosture':
                  displayName = 'Bad Posture';
                  break;
                case 'NoPerson':
                  displayName = 'No Person';
                  break;
                case 'Standing':
                  displayName = 'Standing';
                  break;
                default:
                  // Handle other cases if needed
                  break;
              }
  
              // Save confidence and display name to the Realtime Database
              const confidenceRef = ref(REALTIME_DB, `UsersData/${userUID}/posture/confidence`);
              const displayNameRef = ref(REALTIME_DB, `UsersData/${userUID}/posture/displayName`);
              console.log('ConfidenceRef:', confidenceRef.toString());
              console.log('DisplayNameRef:', displayNameRef.toString());

              const confidenceObj = {
                confidenceData: confidence
              };
              const postureNameObj = {
                displayName: displayName
              };
              
              try {
                await update(confidenceRef, confidenceObj);
                console.log('Confidence data updated successfully.');
              } catch (error) {
                console.error('Error updating confidence data:', error);
                // Handle the error appropriately
              }
              update(displayNameRef, postureNameObj);
            }
          }
        } catch (error) {
          console.error(error);
          Alert.alert('API Request Error', error.message);
        }
      }
    }
  };
  
  

  // Toggle between front and back cameras
  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.front
        ? Camera.Constants.Type.back
        : Camera.Constants.Type.front
    );
  };

  // Start automatic capture at intervals
  const startAutoCapture = () => {
    setIsWatching(true);
    setAutoCaptureInterval(setInterval(() => {
      changeImageSource();
    }, 5000)); // Capture every 5 seconds
  };

  // Stop automatic capture
  const stopAutoCapture = () => {
    setIsWatching(false);
    clearInterval(autoCaptureInterval);
    setAutoCaptureInterval(null);
  };
  
  const switchImageSource = () => {
    setUseCamera((prevUseCamera) => !prevUseCamera);
    setShowCameraButtons(!useCamera);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.7 }}>
        {useCamera && (
          <Camera
            style={{ flex: 1 }}
            type={cameraType}
            ref={cameraRef}
            onCameraReady={() => console.log('Camera is ready')}
          />
        )}
      </View>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 5, alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', flexDirection: 'row' }}>
          {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={{ width: 80, height: 80, margin: 10 }}
            />
          )}
          {predictions.map((prediction, index) => (
            <View key={index} style={{ alignItems: 'center', marginTop: 10 }}>
              <Text>Predictions:</Text>
              <Text>Confidences: {prediction.confidences.join(', ')}</Text>
              <Text>Display Names: {prediction.displayNames.join(', ')}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal>
          <View style={{ alignItems: 'center' }}>
            {isWatching ? (
              <TouchableOpacity
                onPress={stopAutoCapture}
                style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, margin: 5, width: 140 }}
              >
                <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>Stop Auto Capture</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={startAutoCapture}
                style={{ padding: 10, backgroundColor: 'green', borderRadius: 5, margin: 5, width: 140 }}
              >
                <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>Start Auto Capture</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={switchImageSource}
              style={{ padding: 10, backgroundColor: 'purple', borderRadius: 5, margin: 5, width: 140 }}
            >
              <Text style={{ color: 'white', fontSize: 13, textAlign: 'center' }}>
                {useCamera ? 'Switch to Database' : 'Switch to Camera'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center' }}>
            {showCameraButtons && (
              <>
                <TouchableOpacity
                  onPress={toggleCameraType}
                  style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, margin: 5, width: 140 }}
                >
                  <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>Flip Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takeSinglePhoto}
                  style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5, margin: 5, width: 140 }}
                >
                  <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>Take Photo</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Test;