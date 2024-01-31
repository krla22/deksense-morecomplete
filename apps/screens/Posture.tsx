import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import styles from '../../stylesheets/datastyles';
import { FIREBASE_AUTH, REALTIME_DB } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { get, off, onValue, ref, update } from 'firebase/database';
import { BarChart, LineChart } from 'react-native-chart-kit';

const Posture = () => {
  const [postureRating, setPostureRating] = useState(0);
  const [postureComment, setPostureComment] = useState('');
  const [postureHistory, setPostureHistory] = useState(Array.from({ length: 10 }, () => ({ rating: 0, comment: '' })));
  const [averageRating, setAverageRating] = useState(0);
  const [averageComment, setAverageComment] = useState('');
  const [updateCounter, setUpdateCounter] = useState(0);
  const [user, setUser] = useState(null);
  const [userUID, setUserUID] = useState('');
  const hasZeroRating = postureHistory.some(item => item.comment === '');

  useEffect(() => {
    const setAuth = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      setUser(user);
      if (user) {
        setUserUID(FIREBASE_AUTH.currentUser.uid);
      }
    });
  }, [userUID]);

  useEffect(() => {
    if (user && userUID) {
      const userDataRef = ref(REALTIME_DB, `UsersData/${userUID}/average`);
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
  }, [user, userUID, averageRating, averageComment]);

  useEffect(() => {
    setUserUID(FIREBASE_AUTH.currentUser.uid);
    const confidenceRef = ref(REALTIME_DB, `UsersData/${userUID}/posture/confidence/confidenceData`);
    const displayNameRef = ref(REALTIME_DB, `UsersData/${userUID}/posture/displayName/displayName`);

    const confidenceCallback = (snapshot) => {
      const confidence = snapshot.val();
      setPostureRating((confidence * 10).toFixed(2));
    };

    const displayNameCallback = (snapshot) => {
      const displayName = snapshot.val();
      setPostureComment(displayName);
    };

    onValue(confidenceRef, confidenceCallback);
    onValue(displayNameRef, displayNameCallback);

    return () => {
      off(confidenceRef, confidenceCallback);
      off(displayNameRef, displayNameCallback);
    };
  }, [user, userUID]);

  useEffect(() => {
    if (user && userUID) {
      const newArray = Array.from({ length: 1 }, (_, index) => ({
        rating: postureRating,
        comment: postureComment,
      }));

      setPostureHistory((prevHistory) => [...prevHistory.slice(1), ...newArray].slice(-10))
      setUpdateCounter((prevCounter) => prevCounter + 1);
    }
  }, [postureRating, postureComment]);

  useEffect(() => {
    const validRatings = postureHistory
      .filter(item => item.comment === 'Good_Posture')
      .map(item => ({
        ...item,
        rating: parseFloat(item.rating) || 0,
      }));
  
    const sumRating = validRatings.reduce((sum, item) => sum + item.rating, 0);
    const numRatings = Math.max(validRatings.length, 1);
  
    const avgRating = sumRating / numRatings;
    console.log('Avg Rating:', avgRating);
  
    const averagePostureComments = [
      { range: [0, 1], comment: 'Horrible posture. Please correct it.' },
      { range: [1.1, 2], comment: 'Work on improving your posture.' },
      { range: [2.1, 3], comment: 'Not bad! Keep maintaining a good posture.' },
      { range: [3.1, 4], comment: 'Excellent posture! Keep it up.' },
      { range: [4.1, 5], comment: 'Great posture. You are doing well.' },
      { range: [5.1, 6], comment: 'Fantastic posture. Keep maintaining.' },
      { range: [6.1, 7], comment: 'Outstanding posture! Well done.' },
      { range: [7.1, 8], comment: 'Exceptional posture. Impressive.' },
      { range: [8.1, 9], comment: 'Perfect posture! Maintain this.' },
      { range: [9.1, 10], comment: 'Flawless posture! You are a posture master.' },
    ];
  
    const foundAvgComment = averagePostureComments.find(item => avgRating >= item.range[0] && avgRating <= item.range[1]);
  
    setAverageRating(parseFloat(avgRating.toFixed(2)));
    setAverageComment(foundAvgComment ? foundAvgComment.comment : '');
  }, [postureHistory, updateCounter]);

  const goodPostureCount = postureHistory.filter(item => item.comment === 'Good_Posture').length;
  const badPostureCount = postureHistory.filter(item => item.comment === 'Bad_Posture').length;
  const noPersonCount = postureHistory.filter(item => item.comment === 'No_Person').length;
  const standingCount = postureHistory.filter(item => item.comment === 'Standing').length;

  return (
    <ImageBackground
      source={require('../../assets/bgimage.png')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView style={styles.outerContainer}>
        {hasZeroRating ? (
          // Loading view when there's a rating of zero in the history
          <View style={styles.loadingContainer}>
            <View style={styles.innerContainer}>
              <Text style={styles.historyText}>Current Posture</Text>
              <Text style={styles.dataRating}>Rating: {postureRating}</Text>
              <Text style={styles.dataComment}>{getDisplayText(postureComment)}</Text>
            </View>
            <Text style={styles.loadingText}>Gathering posture readings...</Text>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          // Display posture data
          <>
            <View style={styles.middleContainer}>
              <View style={styles.innerContainer}>
                <Text style={styles.historyText}>Current Posture</Text>
                <Text style={styles.dataRating}>{getDisplayText(postureComment)}</Text>
              </View>
              <View style={styles.innerContainer}>
                <View style={styles.averageRatingContainer}>
                  <Text style={styles.dataRating}>Posture Rating: {Math.round(averageRating)}/10</Text>
                  <Text style={styles.dataComment}>{averageComment}</Text>
                </View>
              </View>
            </View>

            <View style={styles.historyContainer}>
              <Text style={styles.historyText}>History</Text>
              <FlatList
                data={postureHistory.slice().reverse()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.historyDataContainer}>
                    <Text style={styles.dataRating}>{`Previous Posture: ${getDisplayText(item.comment)}`}</Text>
                  </View>
                )}
              />
            </View>

            {/* Assuming you want to display a line chart for posture history as well */}
            <View style={styles.historyContainer}>
            <Text style={styles.historyText}>History</Text>
            <BarChart
              data={{
                labels: ['Good', 'Bad', 'No Person', 'Standing'],
                datasets: [
                  {
                    data: [goodPostureCount, badPostureCount, noPersonCount, standingCount],
                  },
                ],
              }}
              width={310}
              height={220}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: 'lightblue',
                backgroundGradientTo: 'lightblue',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{ borderRadius: 20 }}
            />
          </View>
          <View style={{margin:10}}></View>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const getDisplayText = (displayName) => {
  switch (displayName) {
    case 'Bad_Posture':
      return 'Bad Posture';
    case 'Good_Posture':
      return 'Good Posture';
    case 'No_Person':
      return 'No Person';
    case 'Standing':
      return 'Standing';
    default:
      return '';
  }
};

export default Posture;
