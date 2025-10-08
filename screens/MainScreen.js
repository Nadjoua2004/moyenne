import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// GL1
import Semester1Table from '../components/master/GL1/Semaistre1/Semester1Table';
import Semester2Table from '../components/master/GL1/Semaistre2/semester2Table';

// GL2
import Semester3Table from '../components/master/GL2/Semaistre1/Semester3Table';
import Semester4Table from '../components/master/GL2/Semaistre2/Semester4Table';

// AI1
import Semester1TableAI from '../components/master/AI1/Semaistre1/Semester1Table';
import Semester2TableAI from '../components/master/AI1/Semaistre2/Semester2Table';

// AI2
import Semester3TableAI from '../components/master/AI2/Semaistre1/Semester3Table';
import Semester4TableAI from '../components/master/AI2/Semaistre2/Semester2Table';

import SummaryTable from '../components/summaryTable';

export default function MainScreen() {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [semesterAverages, setSemesterAverages] = useState({ s1: "0.00", s2: "0.00" });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selectedSpecialty || showAbout) {
        handleBack();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [selectedSpecialty, showAbout]);

  useEffect(() => {
    loadAverages();
  }, []);

  useEffect(() => {
    let interval;
    if (selectedSpecialty) {
      interval = setInterval(() => loadAverages(), 2000);
    }
    return () => clearInterval(interval);
  }, [selectedSpecialty]);

  const loadAverages = async () => {
    try {
      const s1Avg = await AsyncStorage.getItem(`${selectedSpecialty}_S1_AVERAGE`);
      const s2Avg = await AsyncStorage.getItem(`${selectedSpecialty}_S2_AVERAGE`);
      if (s1Avg) setSemesterAverages(prev => ({ ...prev, s1: s1Avg }));
      if (s2Avg) setSemesterAverages(prev => ({ ...prev, s2: s2Avg }));
    } catch (error) {
      console.error('Error loading averages:', error);
    }
  };

  const handleSpecialtySelect = (specialty) => {
    setSelectedSpecialty(specialty);
    setShowAbout(false);
    loadAverages();
  };

  const handleBack = () => {
    setSelectedSpecialty(null);
    setShowAbout(false);
  };

  const handleAbout = () => {
    setShowAbout(true);
    setSelectedSpecialty(null);
  };

  // --- ABOUT SCREEN ---
  if (showAbout) {
    return (
      <View style={styles.container}>
        <View style={styles.fixedHeader}>
          <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.departmentTitle}>DÉPARTEMENT D'INFORMATIQUE</Text>
        </View>

        <ScrollView style={styles.scrollContent}>
          <Text style={styles.aboutTitle}>About</Text>
          <View style={styles.aboutContent}>
            <Text style={styles.aboutText}>
              Application de calcul des moyennes pour le Master Informatique
              {"\n\n"}Université de Boumerdes
              {"\n"}Faculté des Sciences — Département d'Informatique
              {"\n\n"}Année Universitaire: 2025 / 2026
            </Text>
          </View>

          <View style={styles.developersSection}>
            <Text style={styles.developersTitle}>Développeurs</Text>
            <Text style={styles.developersText}>
              • Nadjoua Sahnoune{"\n"}• Nesrine Tamourtbir
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // --- MASTERS ---
  const renderMaster = (title, Sem1, Sem2) => (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.specialtyTitle}>{title}</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.semesterSection}>
          <Text style={styles.semesterTitle}>Semestre 1</Text>
          <Sem1 />
        </View>
        <View style={styles.semesterSection}>
          <Text style={styles.semesterTitle}>Semestre 2</Text>
          <Sem2 />
        </View>

        <SummaryTable semester1Average={semesterAverages.s1} semester2Average={semesterAverages.s2} />
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );

  if (selectedSpecialty === 'GL1') return renderMaster("Master 1 Génie Logiciel", Semester1Table, Semester2Table);
  if (selectedSpecialty === 'AI1') return renderMaster("Master 1 Intelligence Artificielle", Semester1TableAI, Semester2TableAI);
  if (selectedSpecialty === 'GL2') return renderMaster("Master 2 Génie Logiciel", Semester3Table, Semester4Table);
  if (selectedSpecialty === 'AI2') return renderMaster("Master 2 Intelligence Artificielle", Semester3TableAI, Semester4TableAI);

  // --- MAIN MENU ---
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.departmentTitle}>DÉPARTEMENT D'INFORMATIQUE</Text>
      </View>

      <View style={styles.masterSection}>
        <Text style={styles.masterTitle}>Masters - Informatique</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.specialtyButton, styles.glButton]} onPress={() => handleSpecialtySelect('GL1')}>
            <Text style={styles.specialtyButtonText}>Master 1 - Génie Logiciel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.specialtyButton, styles.aiButton]} onPress={() => handleSpecialtySelect('AI1')}>
            <Text style={styles.specialtyButtonText}>Master 1 - Intelligence Artificielle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.specialtyButton, styles.glButton]} onPress={() => handleSpecialtySelect('GL2')}>
            <Text style={styles.specialtyButtonText}>Master 2 - Génie Logiciel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.specialtyButton, styles.aiButton]} onPress={() => handleSpecialtySelect('AI2')}>
            <Text style={styles.specialtyButtonText}>Master 2 - Intelligence Artificielle</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.aboutButton} onPress={handleAbout}>
        <Text style={styles.aboutButtonText}>About</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  
  fixedHeader: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  backArrow: {
  
    paddingTop: 20,
    marginRight: 10,
  },
  backArrowText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Scrollable content area
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40, 
    paddingTop: 20,
  },
  // Original header for main menu
  header: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 35,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  departmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    flex: 1,
    paddingTop: 20,
  },
  masterSection: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 80,
    padding: 25,
    paddingTop: 35,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  masterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: 25,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  specialtyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
    marginRight: 40, 
    paddingTop: 20,
  },
  buttonsContainer: {
    gap: 20,
    paddingBottom: 20,
  },
  specialtyButton: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  glButton: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  aiButton: {
    backgroundColor: '#60a5fa',
    borderColor: '#3b82f6',
  },
  specialtyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  aboutButton: {
    backgroundColor: '#64748b',
    paddingVertical: 14,
    paddingHorizontal: 130,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 78,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#475569',
  },
  aboutButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  semesterSection: {
    margin: 15,
    marginTop: 5,
  },
  semesterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
    padding: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e3a8a',
    marginVertical: 25,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  aboutContent: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 50, 
    
  },
  developersSection: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  developersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  developersText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#374151',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});