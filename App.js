import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddRow } from "./components/AddRow";
import { CountableRow } from "./components/CountableRow";
import { loadCountables, saveCountables } from "./storage/Storage";

const intialCountables = [
  { name: "Crow", count: 0 },
  { name: "Woodpecker", count: 3 },
];

export default function App() {
  const [countables, setCountables] = useState(intialCountables);

  useEffect(() => {
    loadCountables().then((result) => setCountables(result));
  }, []);

  const changeCounts = (amount, index) => {
    const newState = [...countables];
    newState[index].count += amount;

    //this stops minus values from being put in
    if (newState[index].count < 0) {
      newState[index].count = 0;
      setCountables(newState);
      saveCountables(newState);
    } else if (newState[index].count >= 0) {
      setCountables(newState);
      saveCountables(newState);
    }
  };

  //we change to check for null names
  const addNewCountable = (name) => {
    //Lets also make a for loop to check for duplicate names when the function is called
    for (let j = 0; j < countables.length; j++) {
      if (countables[j].name === name) {
        return null;
      }
    }
    if (name === "") {
      console.log("No empty names");
    } else {
      //this means we passed all checks and can add it
      const newState = [...countables, { name, count: 0 }];
      setCountables(newState);
      saveCountables(newState);
    }
  };

  //here we define our const for deleting a iteam
  const deleteself = (name) => {
    //We use filter to filter away based on name, also since the name are uniques we don't have to worry about running in to issues with duplicate names
    const newState = countables.filter((item) => item.name !== name);
    setCountables(newState);
    saveCountables(newState);
  };

  // https://medium.com/@nickyang0501/keyboardavoidingview-not-working-properly-c413c0a200d4
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {countables.map((countable, index) => (
            <CountableRow
              countable={countable}
              key={countable.name}
              changeCounts={changeCounts}
              index={index}
              deleteself={deleteself}
            />
          ))}
          <View style={{ flex: 1 }} />
        </ScrollView>
        <AddRow addNewCountable={addNewCountable} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
});
