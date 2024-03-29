import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import styles from '../../stylesheets/datastyles';
import { FIREBASE_AUTH, FIRESTORE_DB, REALTIME_DB } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { off, onValue, ref, update } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';
import PushNotification from 'react-native-push-notification';

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
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

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
  }, [user, username, userUID]);

  useEffect(() => {
    const foundComment = temperatureComments.find(
      (item) => item.range[0] <= temperatureRating && temperatureRating <= item.range[1]
    );
  
    setTemperatureComment(foundComment ? foundComment.comment : '');
  
    const newArray = Array.from({ length: 1 }, (_, index) => ({
      rating: temperatureRating,
      comment: foundComment ? foundComment.comment : '',
    }));
  
    setTemperatureHistory((prevHistory) => [...prevHistory.slice(1), ...newArray].slice(-10))
    setUpdateCounter((prevCounter) => prevCounter + 1);
  }, [temperatureRating]);
  
  useEffect(() => {
    const validRatings = temperatureHistory.map(item => ({...item,
      rating: parseFloat(item.rating) || 0, // Convert to number, default to 0 if not a valid number
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
    { range: [0, 10], comment: 'Very cold. Ensure to keep warm to prevent cold-related issues.' },
    { range: [11, 20], comment: 'Cold weather. Dress warmly and stay comfortable.' },
    { range: [21, 30], comment: 'Mild temperatures. Enjoy the pleasant weather.' },
    { range: [31, 40], comment: 'Warm temperatures. Ideal for outdoor activities.' },
    { range: [41, 50], comment: 'Hot weather. Stay hydrated and protect yourself from the sun.' },
  ];
  

  const averageRatingComments = [
    { range: [0, 10], comment:  'Extreme coldness, please heat up.' },
    { range: [11, 20], comment: 'Cool conditions, but extra clothing is fine to wear too.' },
    { range: [21, 30], comment: 'Moderately warm temperatures, generally comfortable for most people.' },
    { range: [31, 40], comment: 'Warm temperatures, drink water and stay cool!' },
    { range: [41, 50], comment: 'Hot temperatures, cool yourself down to prevent overheating!' },
  ];  

  return (
    <ImageBackground
      source={require('../../assets/bgimage.png')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>  
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
          // Display temperature data
          <>
            <View style={styles.middleContainer}>
              <View style={styles.innerContainer}>
                <Text style={styles.historyText}>Temperature Level</Text>
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

            <View style={styles.historyContainer}>
              <Text style={styles.historyText}>History</Text>
              <FlatList
                data={temperatureHistory.slice().reverse()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.historyDataContainer}>
                    <Text style={styles.dataRating}>{`Temperature Level: ${item.rating !== null ? `${item.rating}°C` : 0}`}</Text>
                  </View>
                )}
              />
            </View>
              <View style={styles.historyContainer}>
                <Text style={styles.historyText}>History</Text>
                <LineChart
                  data={{
                    labels: [''],
                    datasets: [
                      {
                        data: temperatureHistory.map((item) => item.rating),
                      },
                    ],
                  }}
                  width={windowWidth - 100}
                  height={120}
                  chartConfig={{
                    backgroundGradientFrom: 'lightblue',
                    backgroundGradientTo: 'lightblue',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  style={{borderRadius: 20}}
                />
              </View>
              <View style={{margin:10}}>
              </View>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
};


export default Temperature;