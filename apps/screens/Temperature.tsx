import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { View, Text, FlatList, ScrollView, ActivityIndicator, AppState, ImageBackground  } from 'react-native';
=======
import { View, Text, FlatList, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
>>>>>>> c95f7c29e3bb42f06a781609d0d1006cceb3a94e
import styles from '../../stylesheets/datastyles';
import { FIREBASE_AUTH, FIRESTORE_DB, REALTIME_DB } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, update, onValue, off } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';

const Temperature = () => {
  const [temperatureRating, setTemperatureRating] = useState(0);
  const [temperatureComment, setTemperatureComment] = useState('');
  const [temperatureHistory, setTemperatureHistory] = useState(Array.from({ length: 10 }, () => ({ rating: 0, comment: '' })));
  const [averageRating, setAverageRating] = useState(0);
  const [averageComment, setAverageComment] = useState('');
  const [updateCounter, setUpdateCounter] = useState(0);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [userUID, setUserUID] = useState('');
  const hasZeroRating = temperatureHistory.some(item => item.rating === 0);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      setAppState(nextAppState);
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const getUsername = async (user: string) => {
    if (user) {
        const userEmail = user.email;
        const retrieveDoc = doc(FIRESTORE_DB, 'users', userEmail);

        const docSnapshot = await getDoc(retrieveDoc);
        const userData = docSnapshot.data();

        const retrievedUsername = userData.username;
        setUsername(retrievedUsername);
    } else {
        console.log(error)
    }
  }

  useEffect(() => {
    const setAuth = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      setUser(user);
      getUsername(user);
    });
  }, []);

  useEffect(() => {
    if (user && username) {
      const userDataRef = ref(REALTIME_DB, `UsersData/${userUID}/average`);
      const averageData = {
        averageTemperatureRating: averageRating,
        averageTemperatureComment: averageComment,
      };

      update(userDataRef, averageData)
        .then(() => {
          console.log('Average data sent to Firebase successfully');
        })
        .catch((error) => {
          console.error('Error sending average data to Firebase: ', error);
        });
    }
  }, [user, username, averageRating, averageComment]);

  useEffect(() => {
    if (user && username) {
      setUserUID(FIREBASE_AUTH.currentUser.uid);
      const temperatureRef = ref(REALTIME_DB, `UsersData/${userUID}/readings/temperature`);

      const onDataChange = (snapshot) => {
        const temperatureValue = snapshot.val();
        if (temperatureValue !== null && !isNaN(temperatureValue)) {
          setTemperatureRating(temperatureValue);
        }
      };

      onValue(temperatureRef, onDataChange);

      return () => {
        off(temperatureRef, onDataChange);
      };
    }
  }, [user, username, userUID, appState]);

  useEffect(() => {
    console.log(temperatureRating)
    const foundComment = temperatureComments.reduce((closest, current) => {
      const currentDiff = Math.min(
        Math.abs(temperatureRating - current.range[0]),
        Math.abs(temperatureRating - current.range[1])
      );
      const closestDiff = Math.min(
        Math.abs(temperatureRating - closest.range[0]),
        Math.abs(temperatureRating - closest.range[1])
      );
  
      return currentDiff < closestDiff ? current : closest;
    }, temperatureComments[0]);
    console.log('Found Comment:', foundComment);
  
    setTemperatureComment(foundComment ? foundComment.comment : '');
    console.log(temperatureComment)
  
    const newArray = Array.from({ length: 1 }, (_, index) => ({
      rating: temperatureRating,
      comment: foundComment ? foundComment.comment : '',
      time: new Date().toLocaleTimeString(),
    }));
  
    setTemperatureHistory((prevHistory) => [...prevHistory, ...newArray]);
    setUpdateCounter((prevCounter) => prevCounter + 1);
  }, [temperatureRating]);
  
  useEffect(() => {
    const lastTenRatings = temperatureHistory.slice(-10);
  
    const validRatings = lastTenRatings.map(item => ({...item,
      rating: parseFloat(item.rating) || 0,
    }));
  
    const sumRating = validRatings.reduce((sum, item) => sum + item.rating, 0);
    const numRatings = Math.max(validRatings.length, 1); // Ensure a minimum of 1 rating
  
    const avgRating = sumRating / numRatings; // Calculate average
    console.log('Avg Rating:', avgRating);
  
    const foundAvgComment = averageRatingComments.reduce((closest, current) => {
      const currentDiff = Math.abs(avgRating - (current.range[0] + current.range[1]) / 2);
      const closestDiff = Math.abs(avgRating - (closest.range[0] + closest.range[1]) / 2);
  
      return currentDiff < closestDiff ? current : closest;
    });
  
    setAverageRating(parseFloat(avgRating.toFixed(2)));
    setAverageComment(foundAvgComment.comment);
  }, [temperatureHistory, updateCounter]);

  const temperatureComments = [
    { range: [20, 25], comment: 'It is too cold, consider warming up.' },
    { range: [26, 30], comment: 'The temperature is comfortable.' },
    { range: [31, 35], comment: 'It is getting warm, stay cool.' },
    { range: [36, 40], comment: 'It is hot, make sure to stay hydrated.' },
    { range: [41, 50], comment: 'It is extremely hot, take necessary precautions.' },
  ];

  const averageRatingComments = [
    { range: [20, 25], comment: 'Consider warming yourself up!' },
    { range: [26, 30], comment: 'The temperatures are comfortable and good!' },
    { range: [31, 35], comment: 'The room is getting hotter' },
    { range: [36, 40], comment: 'Consider cooling your room to prevent health risks!' },
    { range: [41, 50], comment: 'Health Risk! Please get out of the room!' },
  ];
  
  return (
    <ImageBackground
<<<<<<< HEAD
      source={require('../../assets/bgimage.png')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
=======
    source={require('../../assets/bgimage.png')}
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
>>>>>>> c95f7c29e3bb42f06a781609d0d1006cceb3a94e
      <ScrollView style={styles.outerContainer}>
        {hasZeroRating ? (
          // Loading view when there's a rating of zero in the history
          <View style={styles.loadingContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.historyText}>Current Temperature</Text>
                <Text style={styles.dataRating}>Rating: {temperatureRating}°C</Text>
                <Text style={styles.dataComment}>{temperatureComment}</Text>
              </View>
            <Text style={styles.loadingText}>Gathering temperature readings...</Text>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          // Display humidity data
          <>
            <View style={styles.middleContainer}>
              <View style={styles.innerContainer}>
                <Text style={styles.historyText}>Current Temperature</Text>
                <Text style={styles.dataRating}>Rating: {temperatureRating}°C</Text>
                <Text style={styles.dataComment}>{temperatureComment}</Text>
              </View>
              <View style={styles.innerContainer}>
                <View style={styles.averageRatingContainer}>
                  <Text style={styles.dataRating}>Average Rating: {Math.round(averageRating)}°C</Text>
                  <Text style={styles.dataComment}>{averageComment}</Text>
                </View>    
              </View>
            </View>

            <ScrollView horizontal>
              <View style={styles.historyContainer}>
                <Text style={styles.historyText}>History</Text>
                <LineChart
                  data={{
                    labels: temperatureHistory.map((item) => item.time),
                    datasets: [
                      {
                        data: temperatureHistory.map((item) => item.rating),
                      },
                    ],
                  }}
                  width={350}
                  height={220}
                  chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                />
              </View>

              <View style={styles.historyContainer}>
                <Text style={styles.historyText}>History List</Text>
                <FlatList
                  data={temperatureHistory.slice().reverse()}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.historyDataContainer}>
                      <Text style={styles.dataRating}>{`Temperature Readings: ${item.rating !== null ? `${item.rating}°C` : 0}`}</Text>
                    </View>
                  )}
                />
              </View>
            </ScrollView>

          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default Temperature;
