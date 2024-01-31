// Posture.tsx

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { onValue, ref } from 'firebase/database';
import { REALTIME_DB, FIREBASE_AUTH } from '../../firebaseConfig';

const Posture = () => {
  const [confidence, setConfidence] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [userUID, setUserUID] = useState('');
  
  useEffect(() => {
    setUserUID(FIREBASE_AUTH.currentUser.uid);
    const confidenceRef = ref(REALTIME_DB, `UsersData/${userUID}/posture/confidence/confidenceData`);
    const displayNameRef = ref(REALTIME_DB, `UsersData/${userUID}/posture/displayName/displayName`);

    // Listen for changes in confidence data
    const confidenceListener = onValue(confidenceRef, (snapshot) => {
      const confidenceData = snapshot.val();
      setConfidence(confidenceData);
    });

    // Listen for changes in display name data
    const displayNameListener = onValue(displayNameRef, (snapshot) => {
      const displayNameData = snapshot.val();
      setDisplayName(displayNameData);
    });

    // Cleanup listeners when the component unmounts
    return () => {
      confidenceListener();
      displayNameListener();
    };
  }, [userUID]);

  return (
    <View>
      {confidence !== null && displayName !== null && (
        <View>
          <Text>Confidence: {confidence}</Text>
          <Text>Display Name: {displayName}</Text>
        </View>
      )}
    </View>
  );
};

export default Posture;
