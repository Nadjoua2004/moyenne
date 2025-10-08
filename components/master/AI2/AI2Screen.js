import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Semester3Table from "./Semaisitre1/Semester3Table";
import Semester4Table from "./Semaisitre2/Semester4Table";
import SummaryTable from "../../summaryTable";

export default function AI2Screen() {
  const [averages, setAverages] = useState({
    s3: "0.00",
    s4: "0.00",
  });

  useEffect(() => {
    const loadAverages = async () => {
      // Try multiple key combinations for compatibility
      const s3 = await AsyncStorage.getItem("AI2_S1_AVERAGE") || 
                 await AsyncStorage.getItem("S3_AVERAGE");
      const s4 = await AsyncStorage.getItem("AI2_S2_AVERAGE") || 
                 await AsyncStorage.getItem("S4_AVERAGE");
      
      setAverages({
        s3: s3 || "0.00",
        s4: s4 || "0.00",
      });
    };
    
    loadAverages();
    
    // Set up interval to refresh averages
    const interval = setInterval(loadAverages, 1000);
    return () => clearInterval(interval);
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
        Master 2 (AI2) — Moyennes et Notes
      </Text>

      {/* Semester 3 */}
      <Semester3Table />

      {/* Semester 4 */}
      <Semester4Table />

      {/* Summary for Master 2 */}
      <SummaryTable
        semester1Average={averages.s3}
        semester2Average={averages.s4}
      />
    </ScrollView>
  );
}