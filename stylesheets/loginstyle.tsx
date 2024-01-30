import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
      },
      overallContainer: {
        backgroundColor: "transparent",
        width: windowWidth,
        height: windowHeight,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
      },
      authContainer: {
        width: '80%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 16,
        borderRadius: 50,
        elevation: 3,
      },
      title: {
        fontSize: 18,
        marginBottom: 12,
        textAlign: 'center',
      },
      input: {
        height: 40,
        borderColor: '#97d6d9',
        borderWidth: 2,
        marginBottom: 16,
        padding: 8,
        width: windowWidth - 140,
        borderRadius: 4,
        alignSelf: "center"
      },
      buttonContainer: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        justifyContent: "center"
      },
      toggleText: {
        color: '#3498db',
        textAlign: 'center',
      },
      bottomContainer: {
        marginTop: 20,
      },
      emailText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
      },
      welcome: {
        fontWeight: "bold",
        textAlign: "center", 
        fontSize: 20,
        marginBottom: 5,
      }
})

export default styles