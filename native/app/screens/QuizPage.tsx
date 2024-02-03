import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ProgressBar from "./ProgressBar";
import Questions from "./Questions";
import TapRatingScreen from "./TapRatingScreen"
import { useQuestions } from "../hooks/useQuestions";
import { getAnswers, patchAnswer, putAnswer } from "../lib/api";
import { useUserStore } from "../hooks/zustand/useUserStore";

const QuizPage = ({ navigation, route }) => {
  const questionId = route.params?.index;
  const { questions } = useQuestions();
  const { user } = useUserStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(new Animated.Value(1));
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(1));

  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);

  useEffect(() => {
    if (!questionId || !questions)
      return
    const index = questions.findIndex((question) => question.id == questionId) ?? 0
    setCurrentQuestionIndex(index)
    updateProgressBar(index + 1)
  }, [questionId, questions])

  const updateRating = (value) => {
    setRatingValue(value);
    getAnswers({ user_id: user.id, question_id: questions[currentQuestionIndex]?.id }).then((res) => {
      if (res && res.length > 0) {
        // If we already have an answer, we update it
        patchAnswer(res[0].id, { answer: value, timestamp: new Date().getTime() })
      }
      else {
        putAnswer({ question_id: questions[currentQuestionIndex]?.id, answer: value, user_id: user.id, timestamp: new Date().getTime() })
      }
    })

  }

  useEffect(() => {
    getAnswers({ user_id: user.id, question_id: questions[currentQuestionIndex]?.id }).then((res) => {
      if (res != null && res.length > 0) {
        setRatingValue(Number(res[0].answer))
      }
    })
  }, [currentQuestionIndex])

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setCurrentOptionSelected(null);
    setRatingValue(null)
  };

  const updateProgressBar = (index) => {
    Animated.parallel([
      Animated.timing(progress, {
        toValue: index,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1900,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }

  const handleNext = (navigation) => {
    if (currentQuestionIndex == questions.length - 1) {
      navigation.navigate("Result", { restartQuiz: restartQuiz });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setRatingValue(0);
    }
    updateProgressBar(currentQuestionIndex + 2)
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <ProgressBar progress={progress} />
          <Questions
            index={currentQuestionIndex}
            question={questions[currentQuestionIndex]?.title}
          />
        </View>
        {/* {renderOptions(navigation)} */}
        <TapRatingScreen
          questionId={questions[currentQuestionIndex]?.id}
          rating={ratingValue}
          onRatingChange={updateRating} />
      </View>
      <View style={{ position: "absolute", bottom: 0, marginTop: 10, right: 20 }}>
        <TouchableOpacity
          style={[
            { ...styles.btnNext },
            {
              backgroundColor: !currentOptionSelected ? "#cfcdcc" : "#ffffff",
            },
          ]}
          // disabled={!currentOptionSelected}
          onPress={() => handleNext(navigation)}
        >
          <Text style={styles.btnNextText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { backgroundColor: "#38588b" },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  subContainer: {
    marginTop: 50,
    marginVertical: 10,
    padding: 40,
    borderTopRightRadius: 40,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  optionsText: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  btnNext: {
    borderRadius: 10,

    paddingVertical: 13,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  btnNextText: {
    color: "#333",
    fontSize: 17,
    letterSpacing: 1.1,
  },
});

export default QuizPage;