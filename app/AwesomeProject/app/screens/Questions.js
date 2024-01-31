import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useQuestions } from "../hooks/useQuestions";

const Questions = ({ index, question }) => {
  const { questions} = useQuestions()

  return (
    <View style={{}}>
      {/* Question Counter */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{ color: "#333", fontSize: 15, opacity: 0.6, marginRight: 2 }}
        >
          {index + 1}
        </Text>
        <Text style={{ color: "#333", fontSize: 13, opacity: 0.6 }}>
          / {questions.length}
        </Text>
      </View>

      {/* Question */}
      <Text
        style={{
          color: "#333",
          fontSize: 18,
          textAlign: "center",
        }}
      >
        {question}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
 
export default Questions;