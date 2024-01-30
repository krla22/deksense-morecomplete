import { View, Text, ScrollView, Dimensions, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
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
  return (
    <SafeAreaView>
          <ScrollView horizontal pagingEnabled snapToInterval={windowWidth} decelerationRate="fast" showsHorizontalScrollIndicator={false} ref={scrollViewRef}> 
          <ImageBackground 
          source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201757729581182976/View1.png?ex=65cafb1a&is=65b8861a&hm=a07c25b27284cab1611767623d842d5ad356f295a15d3375395c9c02ff5dc250&=&format=webp&quality=lossless&width=602&height=935"}}
          style={{width: windowWidth, height: windowHeight}}
          >
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent", overflow: 'hidden'}}>
              <Image 
              style={{width: windowWidth - 50, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 210}} 
              source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201548970288234496/Title.png?ex=65ca38ae&is=65b7c3ae&hm=3ee58c2d1cd5481ac6d333892add523317133e860a045909d6037b2bdb0550ef&=&format=webp&quality=lossless&width=772&height=145"}} />
              <View style={{gap: 30, alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: 30}}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Home')}
                  style={{backgroundColor: "#97d6d9", padding: 10, width: 120, height: 60, alignItems: "center", borderRadius: 10, justifyContent: "center"}}>
                  <Text style={{color: "white", fontWeight: "bold", fontSize: 20}}>
                    Enter
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: "#97d6d9", padding: 10, width: 120, height: 60, alignItems: "center", borderRadius: 10, justifyContent: "center"}}>
                  <Text style={{color: "white", fontWeight: "bold", fontSize: 20}}>
                    Exit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201562999425617980/View2.png?ex=65ca45bf&is=65b7d0bf&hm=bcde910931d11880a8f21d34cc291a556c8feeac729673bfc592e2017bb9b0f4&=&format=webp&quality=lossless&width=602&height=936"}}>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}> 
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201566866926223450/TitleOutline.png?ex=65ca4959&is=65b7d459&hm=61c484447616db9b8d2edea0ddcf83b051df0e2ebb07cf72bcd7e4d39b63a3ff&=&format=webp&quality=lossless&width=768&height=142"}} />
              <TouchableOpacity
              onPress={handleScrollToFirstView}
              style={{ position: 'absolute', bottom: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, width: 30, height: 30, alignSelf: "center"}}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: "center", marginTop: 2 }}>⇐</Text>
              </TouchableOpacity> 
            </View>
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201573001964044318/View3.png?ex=65ca4f0f&is=65b7da0f&hm=88aa111737bdcc60e70f81f3b95dc1961ac01f742660349072e625a5119d65b9&=&format=webp&quality=lossless&width=602&height=936"}}>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}>
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201566866926223450/TitleOutline.png?ex=65ca4959&is=65b7d459&hm=61c484447616db9b8d2edea0ddcf83b051df0e2ebb07cf72bcd7e4d39b63a3ff&=&format=webp&quality=lossless&width=768&height=142"}} />
            </View>
            <TouchableOpacity
              onPress={handleScrollToFirstView}
              style={{ position: 'absolute', bottom: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, width: 30, height: 30, alignSelf: "center"}}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: "center", marginTop: 2 }}>⇐</Text>
              </TouchableOpacity> 
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201577835811311637/View4.png?ex=65ca5390&is=65b7de90&hm=02b618b2ec4d64db0c163b7ce1269b91b0bda64f1812b7ba41254a75fce94c1a&=&format=webp&quality=lossless&width=530&height=936"}}>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}>
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201566866926223450/TitleOutline.png?ex=65ca4959&is=65b7d459&hm=61c484447616db9b8d2edea0ddcf83b051df0e2ebb07cf72bcd7e4d39b63a3ff&=&format=webp&quality=lossless&width=768&height=142"}} />
            </View>
            <TouchableOpacity
              onPress={handleScrollToFirstView}
              style={{ position: 'absolute', bottom: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, width: 30, height: 30, alignSelf: "center"}}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: "center", marginTop: 2 }}>⇐</Text>
              </TouchableOpacity> 
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201580302762508419/View5.png?ex=65ca55dc&is=65b7e0dc&hm=890486afef541c60b40385f64b61803a1a530f9f7f4cf56b87d558d53c07b57c&=&format=webp&quality=lossless&width=530&height=936"}}>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}>
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201566866926223450/TitleOutline.png?ex=65ca4959&is=65b7d459&hm=61c484447616db9b8d2edea0ddcf83b051df0e2ebb07cf72bcd7e4d39b63a3ff&=&format=webp&quality=lossless&width=768&height=142"}} />
            </View>
            <TouchableOpacity
              onPress={handleScrollToFirstView}
              style={{ position: 'absolute', bottom: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 50, width: 30, height: 30, alignSelf: "center"}}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: "center", marginTop: 2 }}>⇐</Text>
              </TouchableOpacity> 
          </ImageBackground>

          <ImageBackground style={{width: windowWidth, height: windowHeight}} source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201583143996624896/View6.png?ex=65ca5881&is=65b7e381&hm=8129aca8f97ba8c6dee8a824bcad752bfbb665b18415f783996145b7fead3f7b&=&format=webp&quality=lossless&width=530&height=936"}}>
            <View style={{width: windowWidth, height: windowHeight, backgroundColor: "transparent"}}>
              <Image 
              style={{width: windowWidth - 200, height: 110, resizeMode: 'contain', alignSelf: "center", marginTop: 750}} 
              source={{ uri: "https://media.discordapp.net/attachments/1194934283433943050/1201566866926223450/TitleOutline.png?ex=65ca4959&is=65b7d459&hm=61c484447616db9b8d2edea0ddcf83b051df0e2ebb07cf72bcd7e4d39b63a3ff&=&format=webp&quality=lossless&width=768&height=142"}} />
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

