import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryTable({ semester1Average, semester2Average }) {
  // Calculate annual average
  const annualAverage = ((parseFloat(semester1Average) + parseFloat(semester2Average)) / 2).toFixed(2);

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
          <Text style={styles.cellText}>{semester1Average}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.cell}>
          <Text style={styles.cellText}>Semestre 2</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{semester2Average}</Text>
        </View>
      </View>

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
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2c3e50',
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