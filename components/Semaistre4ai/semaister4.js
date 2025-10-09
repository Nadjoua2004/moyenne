import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { modulesS4 } from "./moduleS4";
import { styles } from '../../Styles';

export default function Semester4Table({ specialty = "AI" }) {
  const [subjects, setSubjects] = useState(modulesS4 || []);
  const [average, setAverage] = useState("0.00");
  const [invalidInputs, setInvalidInputs] = useState({});

  useEffect(() => {
    AsyncStorage.getItem(`${specialty}_S4_NOTES`).then((data) => {
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          setSubjects(parsedData || []);
        } catch (error) {
          console.error("Error parsing stored notes:", error);
          setSubjects(modulesS4 || []);
        }
      }
    });
  }, [specialty]);

  const saveNotes = (updated) => {
    setSubjects(updated);
    AsyncStorage.setItem(`${specialty}_S4_NOTES`, JSON.stringify(updated));
  };

  const validateNote = (text) => {
    const regex = /^(\d{1,2})(\.\d{0,2})?$/;
    const num = parseFloat(text);
    return text === "" || (regex.test(text) && num >= 0 && num <= 20);
  };

  const handleNoteChange = (text, index, field) => {
    const isValid = validateNote(text);
    setInvalidInputs(prev => ({ ...prev, [`${index}-${field}`]: !isValid }));

    if (!isValid && text !== "") {
      return;
    }

    if (index < 0 || index >= subjects.length) {
      console.error("Invalid index:", index);
      return;
    }

    const updated = [...subjects];
    updated[index][field] = text;
    saveNotes(updated);
  };

  const calcAverage = () => {
    if (!subjects || subjects.length === 0) {
      setAverage("0.00");
      return;
    }
    let totalWeighted = 0;
    let totalCoef = 0;

    subjects.forEach((m) => {
      const exam = parseFloat(m.exam || 0);
      const moy = exam;
      m.moy = moy.toFixed(2);
      totalWeighted += moy * m.coef;
      totalCoef += m.coef;
    });

    const moyenneGenerale = totalCoef > 0 ? totalWeighted / totalCoef : 0;
    setAverage(moyenneGenerale.toFixed(2));
    AsyncStorage.setItem(`${specialty}_S4_AVERAGE`, moyenneGenerale.toFixed(2));
  };

  useEffect(() => {
    calcAverage();
  }, [subjects]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: "#fff" }]}>
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
              {(subjects || []).reduce((sum, m) => sum + (m.coef || 0), 0)}
            </Text>
          </View>
          <View style={{ flex: 2 }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>{average}</Text>
          </View>
        </View>
        {(subjects || []).map((item, index) => (
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
            <View style={{ flex: 2.5, paddingLeft: 8 }}>
              <Text style={{ fontSize: 13 }}>{item.module}</Text>
            </View>
            <View style={{ flex: 0.8, alignItems: "center" }}>
              <Text>{item.coef}</Text>
            </View>
            <View style={{ flex: 2, alignItems: "center" }}>
              <TextInput
                style={[
                  styles.noteInput,
                  invalidInputs[`${index}-exam`] && { borderColor: 'red', borderWidth: 1 }
                ]}
                placeholder="Note Finale"
                keyboardType="decimal-pad"
                value={item.exam}
                onChangeText={(text) => handleNoteChange(text, index, "exam")}
              />
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold" }}>{item.moy || "0.00"}</Text>
            </View>
          </View>
        ))}
      </View>
      <View
        style={{
          borderTopWidth: 2,
          borderColor: "#000",
          paddingTop: 15,
          marginTop: 10,
          paddingBottom: 20,
        }}
      >
        <Text
          style={[
            styles.average,
            { color: average >= 10 ? "green" : "red" }
          ]}
        >
          Moyenne Semestre 4: {average}
        </Text>
      </View>
    </ScrollView>
  );
}
