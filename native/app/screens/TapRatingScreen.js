import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  StyleSheet,
  StatusBar,
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import Card from "./Card";

const TapRatingScreen = ({ rating, onRatingChange }) => {
  const ratingCompleted = (newRating) => {
    onRatingChange(newRating); // Update the rating value state when rating changes
  };

  const styles = StyleSheet.create({
    flex: {
      flex: 1,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    headingContainer: {
      paddingBottom: 30,
    },
    titleText: {
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      paddingVertical: 5,
      fontFamily: Platform.OS === "ios" ? "Menlo-Bold" : null,
      color: "white",
    },
    subtitleText: {
      fontSize: 18,
      fontWeight: "400",
      textAlign: "center",
      fontFamily: Platform.OS === "ios" ? "Trebuchet MS" : null,
      color: "#34495e",
    },
    card: {
      width: "85%",
      marginBottom: 20,
    },
  });

  return (
    <SafeAreaView style={styles.flex}>
      {Platform.OS === "android" ? <StatusBar /> : null}
      <View style={styles.headingContainer}>
        <Text style={styles.titleText}>Start your Rating!</Text>
      </View>
      <ScrollView style={styles.flex} contentContainerStyle={styles.center}>
        <Card containerStyle={styles.card}>
          <AirbnbRating
            count={5}
            reviews={["Poor", "Very Bad", "Acceptable", "Very Good", "Excellent"]}
            defaultRating={rating} // Set the default rating to the value passed as prop
            onFinishRating={ratingCompleted}
            selectedColor="green"
            unSelectedColor="lightgrey"
            reviewColor="green"
            showRating={true}
          />
          <Text>Selected rating: {rating}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TapRatingScreen;
