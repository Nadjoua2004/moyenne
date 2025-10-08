import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { modulesS4 } from "./modulesS4";
import { styles } from "../../../../Styles";

export default function Semester4Table() {
  const [subjects, setSubjects] = useState(modulesS4);
  const [average, setAverage] = useState("0.00");

  useEffect(() => {
    AsyncStorage.getItem("S4_NOTES").then((data) => {
      if (data) setSubjects(JSON.parse(data));
    });
  }, []);

  const saveNotes = (updated) => {
    setSubjects(updated);
    AsyncStorage.setItem("S4_NOTES", JSON.stringify(updated));
  };

  const validateNote = (text) => {
    const regex = /^(\d{1,2})(\.\d{0,2})?$/;
    const num = parseFloat(text);
    return text === "" || (regex.test(text) && num >= 0 && num <= 20);
  };

  const handleNoteChange = (text, index, field) => {
    if (!validateNote(text)) {
      Alert.alert("⚠️ Invalid Note", "Note must be between 0.00 and 20.00");
      return;
    }
    const updated = [...subjects];
    updated[index][field] = text;
    saveNotes(updated);
  };

  const calcAverage = () => {
    let totalWeighted = 0;
    let totalCoef = 0;

    subjects.forEach((m) => {
      const exam = parseFloat(m.exam || 0);
      const moy = exam;
      m.moy = moy.toFixed(2);
      totalWeighted += moy * m.coef;
      totalCoef += m.coef;
    });

    const moyenneGenerale = totalWeighted / totalCoef;
    setAverage(moyenneGenerale.toFixed(2));
    AsyncStorage.setItem("S4_AVERAGE", moyenneGenerale.toFixed(2));
  };

  useEffect(() => {
    calcAverage();
  }, [subjects]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: "#fff" }]}>
      {/* Table Header */}
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 2,
          borderColor: "#000",
          backgroundColor: "#f5f5f5",
          paddingVertical: 10,
        }}
      >
        <View style={{ flex: 2.5, paddingLeft: 8 }}>
          <Text style={{ fontWeight: "bold" }}>Module</Text>
        </View>
        <View style={{ flex: 0.8, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Coef</Text>
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Note</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Moyenne</Text>
        </View>
      </View>

      {/* UE Professionnelle */}
      <View style={{ marginBottom: 15 }}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#e0e0e0",
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: "#aaa",
          }}
        >
          <View style={{ flex: 2.5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              UE Professionnelle (UEP4)
            </Text>
          </View>
          <View style={{ flex: 0.8, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>
              {subjects.reduce((sum, m) => sum + m.coef, 0)}
            </Text>
          </View>
          <View style={{ flex: 2 }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>{average}</Text>
          </View>
        </View>

        {/* Modules */}
        {subjects.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderColor: "#ccc",
              minHeight: 50,
              alignItems: "center",
              paddingVertical: 8,
            }}
          >
            {/* Module Name */}
            <View style={{ flex: 2.5, paddingLeft: 8 }}>
              <Text style={{ fontSize: 13 }}>{item.module}</Text>
            </View>
            {/* Coef */}
            <View style={{ flex: 0.8, alignItems: "center" }}>
              <Text>{item.coef}</Text>
            </View>
            {/* Note */}
            <View style={{ flex: 2, alignItems: "center" }}>
              <TextInput
                style={styles.noteInput}
                placeholder="Note Finale"
                keyboardType="decimal-pad"
                value={item.exam}
                onChangeText={(text) => handleNoteChange(text, index, "exam")}
              />
            </View>
            {/* Moyenne */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold" }}>{item.moy || "0.00"}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Semester Average */}
      <View
        style={{
          borderTopWidth: 2,
          borderColor: "#000",
          paddingTop: 15,
          marginTop: 10,
          paddingBottom: 20,
        }}
      >
        <Text style={styles.average}>Moyenne Semestre 2: {average}</Text>
      </View>
    </ScrollView>
  );
}
