import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { modulesS3 } from "./modulesS3";
import { styles } from "../../../../Styles";

export default function Semester3Table() {
  const [subjects, setSubjects] = useState(modulesS3);
  const [average, setAverage] = useState("0.00");
  const [ueAverages, setUeAverages] = useState({});

  useEffect(() => {
    AsyncStorage.getItem("S3_NOTES").then((data) => {
      if (data) setSubjects(JSON.parse(data));
    });
  }, []);

  const saveNotes = (updated) => {
    setSubjects(updated);
    AsyncStorage.setItem("S3_NOTES", JSON.stringify(updated));
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

  const calcAverages = () => {
    let totalWeighted = 0;
    let totalCoef = 0;
    const newUEAverages = {};

    subjects.forEach((m) => {
      const td = parseFloat(m.td || 0);
      const tp = parseFloat(m.tp || 0);
      const exam = parseFloat(m.exam || 0);
      let continuousNote = 0;
      let moy = 0;

      if (!m.hasTD && !m.hasTP) moy = exam;
      else if (m.hasTD && m.hasTP) {
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
      totalWeighted += moy * m.coef;
      totalCoef += m.coef;
    });

    // update UE averages (adjust slice ranges to your own S3 structure)
    const groupedByUE = [
      { title: "UE Fondamentale 1 (UEF31)", range: [0, 2] },
      { title: "UE Fondamentale 2 (UEF32)", range: [2, 4] },
      { title: "UE Méthodologique (UEM3)", range: [4, 6] },
      { title: "UE Transversale (UET3)", range: [6, 7] },
      { title: "UE Découverte (UED3)", range: [7, 8] },
    ];

    groupedByUE.forEach((ue) => {
      const ueData = subjects.slice(ue.range[0], ue.range[1]);
      let ueTotal = 0;
      let ueCoefSum = 0;
      ueData.forEach((m) => {
        ueTotal += parseFloat(m.moy) * m.coef;
        ueCoefSum += m.coef;
      });
      newUEAverages[ue.title] = (ueTotal / ueCoefSum).toFixed(2);
    });

    setUeAverages(newUEAverages);
    const moyenneGenerale = totalWeighted / totalCoef;
    setAverage(moyenneGenerale.toFixed(2));

    AsyncStorage.setItem("S3_AVERAGE", moyenneGenerale.toFixed(2));
  };

  useEffect(() => {
    calcAverages();
  }, [subjects]);

  const groupedByUE = [
    { title: "UE Fondamentale 1 (UEF31)", data: subjects.slice(0, 2) },
    { title: "UE Fondamentale 2 (UEF32)", data: subjects.slice(2, 4) },
    { title: "UE Méthodologique (UEM3)", data: subjects.slice(4, 6) },
    { title: "UE Transversale (UET3)", data: subjects.slice(6, 7) },
    { title: "UE Découverte (UED3)", data: subjects.slice(7, 8) },
  ];

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
                {ue.data.reduce((sum, m) => sum + m.coef, 0)}
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
            const globalIndex = subjects.indexOf(item);
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
                        style={styles.noteInput}
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
                        style={styles.noteInput}
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
                      style={styles.noteInput}
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
        <Text style={styles.average}>Moyenne Semestre 1: {average}</Text>
      </View>
    </ScrollView>
  );
}
