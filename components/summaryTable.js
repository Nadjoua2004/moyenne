import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryTable({ semester1Average, semester2Average }) {
  // Helper function to check if a value represents actual entered grades
  const isValidAverage = (value) => {
    if (!value || value === '-' || value === '0.00' || value === '0') return false;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  // Calculate annual average
  const calculateAnnualAverage = () => {
    const s1 = isValidAverage(semester1Average) ? parseFloat(semester1Average) : null;
    const s2 = isValidAverage(semester2Average) ? parseFloat(semester2Average) : null;

    // Only calculate if both semesters have valid grades
    if (s1 !== null && s2 !== null) {
      return ((s1 + s2) / 2).toFixed(2);
    }
    
    // If only one semester has grades, show dash (not the single semester average)
    // This is more accurate - annual average requires both semesters
    return '-';
  };

  const annualAverage = calculateAnnualAverage();

  // Format display values
  const displayS1 = isValidAverage(semester1Average) ? semester1Average : '-';
  const displayS2 = isValidAverage(semester2Average) ? semester2Average : '-';

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Semestre/Année</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Moyenne</Text>
        </View>
      </View>
      
      {/* Table Rows */}
      <View style={styles.tableRow}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Semestre 1</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{displayS1}</Text>
        </View>
      </View>
      
      <View style={styles.tableRow}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Semestre 2</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{displayS2}</Text>
        </View>
      </View>
      
      {/* Annual Average Row */}
      <View style={[styles.tableRow, styles.annualRow]}>
        <View style={styles.cell}>
          <Text style={[styles.cellText, styles.annualText]}>Année</Text>
        </View>
        <View style={styles.cell}>
          <Text style={[styles.cellText, styles.annualText]}>{annualAverage}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#2c3e50',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  annualRow: {
    backgroundColor: '#ecf0f1',
    borderTopWidth: 2,
    borderTopColor: '#2c3e50',
    borderBottomWidth: 0,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2c3e50',
  },
  cellText: {
    fontSize: 14,
    color: '#555',
  },
  annualText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2c3e50',
  },
});