import { View, Text, ScrollView, Dimensions, ImageBackground, Image, TouchableOpacity, BackHandler  } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Welcome = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const handleScrollToFirstView = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {

      BackHandler.exitApp();
      return true;
    });

    return () => backHandler.remove();

  }, []);
  
  return (
    <SafeAreaView>
          <ScrollView horizontal pagingEnabled snapToInterval={windowWidth} decelerationRate="fast" showsHorizontalScrollIndicator={false} ref={scrollViewRef}> 
          <ImageBackground 
          source={require('../assets/View1.png')}
          style={{width: windowWidth, height: windowHeight}}
          >
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent", overflow: 'hidden'}}>
              <Image 
              style={{width: windowWidth - 50, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 210}} 
              source={require('../assets/Title.png')} />
              <View style={{gap: 30, alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: 30}}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Home')}
                  style={{backgroundColor: "#97d6d9", padding: 10, width: 120, height: 60, alignItems: "center", borderRadius: 10, justifyContent: "center"}}>
                  <Text style={{color: "white", fontWeight: "bold", fontSize: 20}}>
                    Enter
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => BackHandler.exitApp()} // Close the app when the "Exit" button is pressed
                  style={{ backgroundColor: "#97d6d9", padding: 10, width: 120, height: 60, alignItems: "center", borderRadius: 10, justifyContent: "center" }}
                >
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
                    Exit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={require('../assets/View2.png')}>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}> 
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={require('../assets/Title.png')} />
              <TouchableOpacity
              onPress={handleScrollToFirstView}
              style={{ position: 'absolute', bottom: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, width: 30, height: 30, alignSelf: "center"}}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: "center", marginTop: 2 }}>⇐</Text>
              </TouchableOpacity> 
            </View>
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={require('../assets/View3.png') }>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}>
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={require('../assets/Title.png')} />
            </View>
            <TouchableOpacity
              onPress={handleScrollToFirstView}
              style={{ position: 'absolute', bottom: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, width: 30, height: 30, alignSelf: "center"}}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: "center", marginTop: 2 }}>⇐</Text>
              </TouchableOpacity> 
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={require('../assets/View4.png')}>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}>
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={require('../assets/Title.png')} />
            </View>
            <TouchableOpacity
              onPress={handleScrollToFirstView}
              style={{ position: 'absolute', bottom: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, width: 30, height: 30, alignSelf: "center"}}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: "center", marginTop: 2 }}>⇐</Text>
              </TouchableOpacity> 
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={require('../assets/View5.png')}>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}>
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={require('../assets/Title.png')} />
            </View>
            <TouchableOpacity
              onPress={handleScrollToFirstView}
              style={{ position: 'absolute', bottom: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, width: 30, height: 30, alignSelf: "center"}}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: "center", marginTop: 2 }}>⇐</Text>
              </TouchableOpacity> 
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={require('../assets/View6.png')}>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}>
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={require('../assets/Title.png')} />
            </View>
            <TouchableOpacity
              onPress={handleScrollToFirstView}
              style={{ position: 'absolute', bottom: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, width: 30, height: 30, alignSelf: "center"}}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: "center", marginTop: 2 }}>⇐</Text>
              </TouchableOpacity> 
          </ImageBackground>
          </ScrollView>
        
    </SafeAreaView>
  )
}

export default Welcome

