import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Semester1Table from "./Semaisitre1/Semester1Table";
import Semester2Table from "./Semaisitre2/Semester2Table";
import SummaryTable from "../../summaryTable";

export default function AI1Screen() {
  const [averages, setAverages] = useState({
    s1: "0.00",
    s2: "0.00",
  });

  useEffect(() => {
    const loadAverages = async () => {
      const s1 = await AsyncStorage.getItem("S1_AVERAGE");
      const s2 = await AsyncStorage.getItem("S2_AVERAGE");
      setAverages({
        s1: s1 || "0.00",
        s2: s2 || "0.00",
      });
    };
    loadAverages();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f4f6f7" }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 15,
          color: "#2c3e50",
        }}
      >
        Master 1 (AI1) — Moyennes et Notes
      </Text>

      {/* Semester 1 */}
      <Semester1Table />

      {/* Semester 2 */}
      <Semester2Table />

      {/* Summary for Master 1 */}
      <SummaryTable
        semester1Average={averages.s1}
        semester2Average={averages.s2}
      />
    </ScrollView>
  );
}
