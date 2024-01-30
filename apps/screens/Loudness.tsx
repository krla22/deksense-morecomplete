import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { View, Text, FlatList, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
=======
import { View, Text, FlatList, ScrollView, ImageBackground } from 'react-native';
>>>>>>> c95f7c29e3bb42f06a781609d0d1006cceb3a94e
import styles from '../../stylesheets/datastyles';
import { FIREBASE_AUTH, FIRESTORE_DB, REALTIME_DB } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { off, onValue, ref, update } from 'firebase/database';

const Loudness = () => {
  const [loudnessRating, setLoudnessRating] = useState(0);
  const [loudnessComment, setLoudnessComment] = useState('');
  const [loudnessHistory, setLoudnessHistory] = useState(Array.from({ length: 10 }, () => ({ rating: 0, comment: '' })));
  const [averageRating, setAverageRating] = useState(0);
  const [averageComment, setAverageComment] = useState('');
  const [updateCounter, setUpdateCounter] = useState(0);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [userUID, setUserUID] = useState('');
  const hasZeroRating = loudnessHistory.some(item => item.rating === 0);

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
        averageLoudnessRating: averageRating,
        averageLoudnessComment: averageComment,
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
      const loudnessRef = ref(REALTIME_DB, `UsersData/${userUID}/readings/loudness`);

      const onDataChange = (snapshot) => {
        const loudnessValue = snapshot.val();
        if (loudnessValue !== null && !isNaN(loudnessValue)) {
          setLoudnessRating(loudnessValue);
        }
      };

      onValue(loudnessRef, onDataChange);

      return () => {
        off(loudnessRef, onDataChange);
      };
    }
  }, [user, username, userUID]);

  useEffect(() => {
    const foundComment = loudnessComments.find(
      (item) => item.range[0] <= loudnessRating && loudnessRating <= item.range[1]
    );
  
    setLoudnessComment(foundComment ? foundComment.comment : '');
  
    const newArray = Array.from({ length: 1 }, (_, index) => ({
      rating: loudnessRating,
      comment: foundComment ? foundComment.comment : '',
    }));
  
    setLoudnessHistory((prevHistory) => [...prevHistory.slice(1), ...newArray].slice(-10))
    setUpdateCounter((prevCounter) => prevCounter + 1);
  }, [loudnessRating]);
  
  useEffect(() => {
    const validRatings = loudnessHistory.map(item => ({...item,
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
  }, [loudnessHistory, updateCounter]);
  

  const loudnessComments = [
    { range: [0, 20], comment: 'The place is extremely quiet, but nothing bad' },
    { range: [21, 40], comment: 'The environment is quiet and great for concentration.' },
    { range: [41, 60], comment: 'The noise level is moderate; it will not cause issues.' },
    { range: [61, 80], comment: 'The environment is loud! Prolonged exposure leads to hearing issues' },
    { range: [81, 100], comment: 'The noise level will cause severe hearing damage!' },
  ]; 

  const averageRatingComments = [
    { range: [0, 20], comment: 'This is extremely quiet, but not a health risk' },
    { range: [21, 40], comment: 'Quiet rooms are relaxing and peaceful' },
    { range: [41, 60], comment: 'Normal loudness levels for busy places' },
    { range: [61, 80], comment: 'Long term exposure at this level causes hearing damage' },
    { range: [81, 100], comment: 'Health Risk: You will get hearing damage!' },
  ];

  return (
    <ImageBackground
    source={require('../../assets/bgimage.png')}
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView style={styles.outerContainer}>
<<<<<<< HEAD
        {hasZeroRating ? (
          // Loading view when there's a rating of zero in the history
          <View style={styles.loadingContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.historyText}>Current Loudness</Text>
                <Text style={styles.dataRating}>Rating: {loudnessRating}°C</Text>
                <Text style={styles.dataComment}>{loudnessComment}</Text>
              </View>
            <Text style={styles.loadingText}>Gathering temperature readings...</Text>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          // Display loudness data
          <>
            <View style={styles.middleContainer}>
              <View style={styles.innerContainer}>
                <Text style={styles.historyText}>Loudness Level</Text>
                <Text style={styles.dataRating}>Rating: {loudnessRating}%</Text>
                <Text style={styles.dataComment}>{loudnessComment}</Text>
              </View>
              <View style={styles.innerContainer}>
                <View style={styles.averageRatingContainer}>
                  <Text style={styles.dataRating}>Average Rating: {Math.round(averageRating)}%</Text>
                  <Text style={styles.dataComment}>{averageComment}</Text>
                </View>    
              </View>
            </View>

            <View style={styles.historyContainer}>
              <Text style={styles.historyText}>History</Text>
              <FlatList
                data={loudnessHistory.slice().reverse()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.historyDataContainer}>
                    <Text style={styles.dataRating}>{`Loudness Level: ${item.rating !== null ? `${item.rating}%` : 0}`}</Text>
                  </View>
                )}
              />
            </View>
          </>
        )}
=======
        <View style={styles.middleContainer}>
          <Text style={styles.dataTitle}>Loudness</Text>
        </View>

        <View style={styles.middleContainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.historyText}>Decibel Level</Text>
            <Text style={styles.dataRating}>Rating: {loudnessRating}dB</Text>
            <Text style={styles.dataComment}>{loudnessComment}</Text>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.averageRatingContainer}>
              <Text style={styles.dataRating}>Average Rating: {Math.round(averageRating)}dB</Text>
              <Text style={styles.dataComment}>{averageComment}</Text>
            </View>    
          </View>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyText}>History</Text>
          <FlatList
            data={loudnessHistory.slice().reverse()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.historyDataContainer}>
                <Text style={styles.dataRating}>{`Decible Levels: ${item.rating}dB`}</Text>
              </View>
            )}
          />
        </View>
        <View style={{ marginBottom: 20 }}></View>
>>>>>>> c95f7c29e3bb42f06a781609d0d1006cceb3a94e
      </ScrollView>
    </ImageBackground>
  );
};


export default Loudness;
