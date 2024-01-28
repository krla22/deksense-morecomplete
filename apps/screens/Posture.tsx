import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import styles from '../../stylesheets/datastyles';
import { FIREBASE_AUTH, FIRESTORE_DB, REALTIME_DB } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';

const Posture = () => {
  const [postureRating, setPostureRating] = useState(0);
  const [postureComment, setPostureComment] = useState('');
  const [postureHistory, setPostureHistory] = useState(Array.from({ length: 10 }, () => ({ rating: 0, comment: '' })));
  const [averageRating, setAverageRating] = useState(0);
  const [averageComment, setAverageComment] = useState('');
  const [updateCounter, setUpdateCounter] = useState(0);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const windowWidth = Dimensions.get('window').width;
  const hasZeroRating = postureHistory.some(item => item.rating === 0);

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
      const userDataRef = ref(REALTIME_DB, `/${username}`);
      const averageData = {
        averagePostureRating: averageRating,
        averagePostureComment: averageComment,
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
    const updatePostureData = () => {
      const newPostureRating = Math.floor(Math.random() * 10) + 1;
      setPostureRating(newPostureRating);
      setUpdateCounter((prevCounter) => prevCounter + 1);
    };

    const intervalId = setInterval(updatePostureData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const foundComment = postureComments.find(
      (item) => item.range[0] <= postureRating && postureRating <= item.range[1]
    );
  
    setPostureComment(foundComment ? foundComment.comment : '');
  
    const newArray = Array.from({ length: 10 }, (_, index) => ({
      rating: postureRating,
      comment: foundComment ? foundComment.comment : '',
    }));
    
    
    setPostureHistory((prevHistory) => [...prevHistory.slice(-9), newArray[0]]);
    setUpdateCounter((prevCounter) => prevCounter + 1);
  }, [postureRating]);
  
  useEffect(() => {
    const lastTenRatings = postureHistory.slice(-10);
    const sumRating = lastTenRatings.reduce((sum, item) => sum + item.rating, 0);
    const avgRating = sumRating / Math.max(lastTenRatings.length, 1);

    const foundAvgComment = averageRatingComments.reduce((closest, current) => {
        const currentDiff = Math.abs(avgRating - (current.range[0] + current.range[1]) / 2);
        const closestDiff = Math.abs(avgRating - (closest.range[0] + closest.range[1]) / 2);

        return currentDiff < closestDiff ? current : closest;
    });

    setAverageRating(parseFloat(avgRating.toFixed(2)));
    setAverageComment(foundAvgComment.comment);
}, [postureHistory, updateCounter]);

  const postureComments = [
    { range: [1, 2], comment: 'Your posture is horrible! This is bad for your back!' },
    { range: [3, 4], comment: 'Your posture could definitely do better' },
    { range: [5, 6], comment: 'Your posture looks okay' },
    { range: [7, 8], comment: 'Your posture is good' },
    { range: [9, 10], comment: 'Your posture is excellent!' },
  ];

  const averageRatingComments = [
    { range: [0, 2], comment: 'This is a health risk! Please care for your posture' },
    { range: [3, 4], comment: 'Your posture is unhealthy and can cause health risks' },
    { range: [5, 6], comment: 'Sit straight, you could do better' },
    { range: [7, 8], comment: 'Good! Your back will thank you!' },
    { range: [9, 10], comment: 'Your posture is perfect!' },
  ];

  return (
    <ScrollView style={styles.outerContainer}>
      {hasZeroRating ? (
        // Loading view when there's a rating of zero in the history
        <View style={styles.loadingContainer}>
          <View style={styles.innerContainer}>
              <Text style={styles.historyText}>Current Posture</Text>
              <Text style={styles.dataRating}>Rating: {postureRating}/10</Text>
              <Text style={styles.dataComment}>{postureComment}</Text>
            </View>
          <Text style={styles.loadingText}>Gathering posture readings...</Text>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        // Display data
        <>
          <View style={styles.middleContainer}>
            <View style={styles.innerContainer}>
              <Text style={styles.historyText}>Current Posture</Text>
              <Text style={styles.dataRating}>Rating: {postureRating}/10</Text>
              <Text style={styles.dataComment}>{postureComment}</Text>
            </View>
            <View style={styles.innerContainer}>
              <View style={styles.averageRatingContainer}>
                <Text style={styles.dataRating}>Average Rating: {Math.round(averageRating)}/10</Text>
                <Text style={styles.dataComment}>{averageComment}</Text>
              </View>    
            </View>
          </View>

          <View style={styles.historyContainer}>
              <Text style={styles.historyText}>History List</Text>
              <FlatList
                data={postureHistory.slice().reverse()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.historyDataContainer}>
                    <Text style={styles.dataRating}>{`Posture Readings: ${item.rating !== null ? `${item.rating}/10` : 0}`}</Text>
                  </View>
                )}
              />
          </View>

          {postureHistory.length >= 10 && (
              <View style={{ marginBottom: 20, borderRadius: 20 }}>
                <LineChart
                  data={{
                    labels: [], // Empty array for blank labels
                    datasets: [
                      {
                        data: postureHistory.map((item) => item.rating),
                      },
                    ],
                  }}
                  width={windowWidth - 84}
                  height={200}
                  chartConfig={{
                    backgroundGradientFrom: 'lightblue',
                    backgroundGradientTo: 'lightblue',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    formatYLabel: (value) => `${value}`,
                    decimalPlaces: 0,
                  }}
                  style={{ paddingRight: 30, borderColor: "black", borderWidth: 1, borderRadius: 20 }}
                />
              </View>
            )}
        </>
      )}
    </ScrollView>
  );
};


export default Posture;
