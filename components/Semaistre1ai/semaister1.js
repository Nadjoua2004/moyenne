import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { modulesS1 } from "./moduleS1";
import { styles } from '../../Styles';

export default function Semester1Table({ specialty = "AI" }) {
  const [subjects, setSubjects] = useState(modulesS1 || []);
  const [average, setAverage] = useState("0.00");
  const [ueAverages, setUeAverages] = useState({});
  const [invalidInputs, setInvalidInputs] = useState({});

  useEffect(() => {
    AsyncStorage.getItem(`${specialty}_S1_NOTES`).then((data) => {
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          setSubjects(parsedData || []);
        } catch (error) {
          console.error("Error parsing stored notes:", error);
          setSubjects(modulesS1 || []);
        }
      }
    });
  }, [specialty]);

  const saveNotes = (updated) => {
    setSubjects(updated);
    AsyncStorage.setItem(`${specialty}_S1_NOTES`, JSON.stringify(updated));
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

  const calcAverages = () => {
    if (!subjects || subjects.length === 0) {
      setAverage("0.00");
      setUeAverages({});
      return;
    }

    let totalWeighted = 0;
    let totalCoef = 0;
    const newUEAverages = {};

    subjects.forEach((m) => {
      const td = parseFloat(m.td || 0);
      const tp = parseFloat(m.tp || 0);
      const exam = parseFloat(m.exam || 0);
      let continuousNote = 0;
      let moy = 0;

      if (!m.hasTD && !m.hasTP) {
        moy = exam;
      } else if (m.hasTD && m.hasTP) {
        continuousNote = (td + tp) / 2;
        moy = continuousNote * 0.4 + exam * 0.6;
      } else if (m.hasTD && !m.hasTP) {
        continuousNote = td;
        moy = continuousNote * 0.4 + exam * 0.6;
      } else if (!m.hasTD && m.hasTP) {
        continuousNote = tp;
        moy = continuousNote * 0.4 + exam * 0.6;
      }

      m.moy = moy.toFixed(2);
      totalWeighted += parseFloat(m.moy) * m.coef;
      totalCoef += m.coef;
    });

    const groupedByUE = [
      { title: "UE Fondamentale (UEF1)", range: [0, 3] },
      { title: "UE Méthodologique (UEM1)", range: [3, 5] },
      { title: "UE Découverte (UED1)", range: [5, 6] },
      { title: "UE Transversale (UET1)", range: [6, 7] },
    ];

    groupedByUE.forEach((ue) => {
      const ueData = subjects.slice(ue.range[0], ue.range[1]);
      let ueTotal = 0;
      let ueCoefSum = 0;

      ueData.forEach((m) => {
        ueTotal += parseFloat(m.moy || 0) * m.coef;
        ueCoefSum += m.coef;
      });

      newUEAverages[ue.title] = ueCoefSum > 0 ? (ueTotal / ueCoefSum).toFixed(2) : "0.00";
    });

    setUeAverages(newUEAverages);
    const moyenneGenerale = totalCoef > 0 ? totalWeighted / totalCoef : 0;
    setAverage(moyenneGenerale.toFixed(2));
    AsyncStorage.setItem(`${specialty}_S1_AVERAGE`, moyenneGenerale.toFixed(2));
  };

  useEffect(() => {
    calcAverages();
  }, [subjects]);

  const runAutomaticTest = () => {
    // Test scenario 1: TD = 14, TP = 14, Exam = 15
    const testSubjects = [...subjects];
    testSubjects[0].td = "14";
    testSubjects[0].tp = "14";
    testSubjects[0].exam = "15";

    // Test scenario 2: TD = 12, TP = 12, Exam = 12
    testSubjects[1].td = "12";
    testSubjects[1].tp = "12";
    testSubjects[1].exam = "12";

    // Test scenario 3: Exam = 15 (No TD/TP)
    testSubjects[2].exam = "15";

    setSubjects(testSubjects);
    Alert.alert("Test Automatique", "Les notes de test ont été appliquées. Vérifiez les moyennes calculées.");
  };

  const groupedByUE = [
    { title: "UE Fondamentale (UEF1)", data: (subjects || []).slice(0, 3) },
    { title: "UE Méthodologique (UEM1)", data: (subjects || []).slice(3, 5) },
    { title: "UE Découverte (UED1)", data: (subjects || []).slice(5, 6) },
    { title: "UE Transversale (UET1)", data: (subjects || []).slice(6, 7) },
  ];

  const findSubjectIndex = (item) => {
    if (!subjects || !item) return -1;
    return subjects.findIndex(subject =>
      subject.module === item.module &&
      subject.coef === item.coef
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: "#fff" }]}>
      <TouchableOpacity style={{ padding: 10, backgroundColor: '#ddd', margin: 10, alignItems: 'center' }} onPress={runAutomaticTest}>
        <Text>Exécuter Test Automatique</Text>
      </TouchableOpacity>
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
          <Text style={{ fontWeight: "bold" }}>Notes</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Moyenne</Text>
        </View>
      </View>
      {groupedByUE.map((ue, i) => (
        <View key={i} style={{ marginBottom: 15 }}>
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
                {ue.title}
              </Text>
            </View>
            <View style={{ flex: 0.8, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold" }}>
                {ue.data.reduce((sum, m) => sum + (m.coef || 0), 0)}
              </Text>
            </View>
            <View style={{ flex: 2 }} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold" }}>
                {ueAverages[ue.title] || "0.00"}
              </Text>
            </View>
          </View>
          {ue.data.map((item, index) => {
            const globalIndex = findSubjectIndex(item);
            return (
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
                  <View style={{ alignItems: "center" }}>
                    {item.hasTD ? (
                      <TextInput
                        style={[
                          styles.noteInput,
                          invalidInputs[`${globalIndex}-td`] && { borderColor: 'red', borderWidth: 1 }
                        ]}
                        placeholder="TD"
                        keyboardType="decimal-pad"
                        value={item.td}
                        onChangeText={(text) =>
                          handleNoteChange(text, globalIndex, "td")
                        }
                      />
                    ) : (
                      <Text>—</Text>
                    )}
                    {item.hasTP ? (
                      <TextInput
                        style={[
                          styles.noteInput,
                          invalidInputs[`${globalIndex}-tp`] && { borderColor: 'red', borderWidth: 1 }
                        ]}
                        placeholder="TP"
                        keyboardType="decimal-pad"
                        value={item.tp}
                        onChangeText={(text) =>
                          handleNoteChange(text, globalIndex, "tp")
                        }
                      />
                    ) : (
                      <Text>—</Text>
                    )}
                    <TextInput
                      style={[
                        styles.noteInput,
                        invalidInputs[`${globalIndex}-exam`] && { borderColor: 'red', borderWidth: 1 }
                      ]}
                      placeholder="EXAM"
                      keyboardType="decimal-pad"
                      value={item.exam}
                      onChangeText={(text) =>
                        handleNoteChange(text, globalIndex, "exam")
                      }
                    />
                  </View>
                </View>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {item.moy || "0.00"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}
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
          Moyenne Semestre 1: {average}
        </Text>
      </View>
    </ScrollView>
  );
}
