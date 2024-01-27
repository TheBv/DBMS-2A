import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const Result = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image style={styles.image} source={require("../../assets/faultier_soccer.png")} />
        <Text style={styles.innerText}>Thank you for your informations.</Text>
        <Text style={styles.innerText}>Keep up with the work!</Text>
        {/* Retry Quiz button */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Homepage");
          }}
          style={styles.btnReset}
        >
          <Text style={styles.btnText}>Back to Homepage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38588b",
    alignItems: "center",
    justifyContent: "center",
  },
  subContainer: {
    backgroundColor: "#38588b",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 30,
  },
  btnReset: {
    backgroundColor: "#333",
    paddingHorizontal: 5,
    paddingVertical: 15,
    width: "50%",
    borderRadius: 15,
  },
  btnText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 20,
    letterSpacing: 1,
  },
    baseText: {
      fontWeight: 'bold',
    },
    innerText: {
      color: 'white',
      fontSize: 50,
    },
});

export default Result;