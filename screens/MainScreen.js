import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, BackHandler , Linking  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// GL 
import Semester1GL from '../components/Semaistre1gl/Semester1Table.js';
import Semester2GL from '../components/Semaistre2gl/semaister2Table.js';
import Semester3GL from '../components/Semaistre3gl/Semester3Table.js';
import Semester4GL from '../components/Semaistre4gl/semaister4Table.js';

// AI
import Semester1AI from '../components/Semaistre1ai/semaister1.js';
import Semester2AI from '../components/Semaistre2ai/semaister2.js';
import Semester3AI from '../components/Semaistre3ai/semaister3.js';
import Semester4AI from '../components/Semaistre4ai/semaister4.js';

import SummaryTable from '../components/summaryTable.js';

export default function MainScreen() {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  const [semesterAverages, setSemesterAverages] = useState({
    s1: "0.00",
    s2: "0.00",
    s3: "0.00", 
    s4: "0.00"
  });

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

  // Load averages from storage when component mounts or specialty changes
  useEffect(() => {
    if (selectedSpecialty) {
      loadAverages();
    }
  }, [selectedSpecialty]);

  // Set up interval to refresh averages every 2 seconds when in specialty view
  useEffect(() => {
    let interval;
    if (selectedSpecialty) {
      interval = setInterval(() => {
        loadAverages();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [selectedSpecialty]);

  const loadAverages = async () => {
    if (!selectedSpecialty) return;
    
    try {
      const s1Avg = await AsyncStorage.getItem(`${selectedSpecialty}_S1_AVERAGE`);
      const s2Avg = await AsyncStorage.getItem(`${selectedSpecialty}_S2_AVERAGE`);
      const s3Avg = await AsyncStorage.getItem(`${selectedSpecialty}_S3_AVERAGE`);
      const s4Avg = await AsyncStorage.getItem(`${selectedSpecialty}_S4_AVERAGE`);
      
      setSemesterAverages({
        s1: s1Avg || "0.00",
        s2: s2Avg || "0.00", 
        s3: s3Avg || "0.00",
        s4: s4Avg || "0.00"
      });
    } catch (error) {
      console.error('Error loading averages:', error);
    }
  };

  const handleSpecialtySelect = (master, specialty) => {
    setSelectedMaster(master);
    setSelectedSpecialty(specialty);
    setShowAbout(false);
  };

  const handleBack = () => {
    setSelectedSpecialty(null);
    setSelectedMaster(null);
    setShowAbout(false);
  };

  const handleAbout = () => {
    setShowAbout(true);
    setSelectedSpecialty(null);
    setSelectedMaster(null);
  };

  const renderSpecialtyContent = (masterLevel, specialtyName, semesters) => {
    return (
      <View style={styles.container}>
        <View style={styles.fixedHeader}>
          <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.specialtyTitle}>Master {masterLevel} - {specialtyName}</Text>
        </View>
        
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          {semesters.map((semester, index) => (
            <View key={index} style={styles.semesterSection}>
              <Text style={styles.semesterTitle}>Semestre {semester.number}</Text>
              {semester.component}
            </View>
          ))}

          <SummaryTable 
            semester1Average={semesterAverages.s1}
            semester2Average={semesterAverages.s2}
            semester3Average={semesterAverages.s3}
            semester4Average={semesterAverages.s4}
            masterLevel={masterLevel}
          />
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    );
  };

  if (showAbout) {
    return (
      <View style={styles.container}>
        <View style={styles.fixedHeader}>
          <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.departmentTitle}>DÉPARTEMENT D'INFORMATIQUE</Text>
        </View>
        
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          <Text style={styles.aboutTitle}>À Propos</Text>
          <View style={styles.aboutContent}>
            <Text style={styles.aboutText}>
              Application de calcul des moyennes pour les Masters
              {"\n\n"}
              Université de Boumerdes
              {"\n"}
              Faculté des Sciences
              {"\n"}
              Département d'Informatique
              {"\n\n"}
              Année Universitaire: 2025/2026
            </Text>
          </View>
          
          <View style={styles.developersSection}>
  <Text style={styles.developersTitle}>Développeurs</Text>
  <View style={styles.developersContent}>
    <Text style={styles.developersText}>
      •
      <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/nadjoua-sahnoune-855462223?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app')}>
        <Text style={{ color: '#0077b5' }}> Nadjoua Sahnoune </Text>
      </TouchableOpacity>
      {"\n"}
      •
      <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/nesrine-tamourtbir-2a21b1336/')}>
        <Text style={{ color: '#0077b5' }}> Nesrine Tamourtbir </Text>
      </TouchableOpacity>
    </Text>
  </View>
</View>

        </ScrollView>
      </View>
    );
  }

  // Master 1 - GL (S1 & S2)
  if (selectedMaster === 1 && selectedSpecialty === 'GL') {
    return renderSpecialtyContent(1, 'Génie Logiciel', [
      { number: 1, component: <Semester1GL specialty="GL" /> },
      { number: 2, component: <Semester2GL specialty="GL" /> }
    ]);
  }

  // Master 1 - AI (S1 AI & S2 AI)
  if (selectedMaster === 1 && selectedSpecialty === 'AI') {
    return renderSpecialtyContent(1, 'Intelligence Artificielle', [
      { number: 1, component: <Semester1AI specialty="AI" /> },
      { number: 2, component: <Semester2AI specialty="AI" /> }
    ]);
  }

  // Master 2 - GL (S3 & S4)
  if (selectedMaster === 2 && selectedSpecialty === 'GL') {
    return renderSpecialtyContent(2, 'Génie Logiciel', [
      { number: 3, component: <Semester3GL specialty="GL" /> },
      { number: 4, component: <Semester4GL specialty="GL" /> }
    ]);
  }

  // Master 2 - AI (S3 AI & S4 AI)
  if (selectedMaster === 2 && selectedSpecialty === 'AI') {
    return renderSpecialtyContent(2, 'Intelligence Artificielle', [
      { number: 3, component: <Semester3AI specialty="AI" /> },
      { number: 4, component: <Semester4AI specialty="AI" /> }
    ]);
  }

  // Main Menu
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.departmentTitle}>DÉPARTEMENT D'INFORMATIQUE</Text>
      </View>

      {/* Master 1 Section */}
      <View style={styles.masterSection}>
        <Text style={styles.masterTitle}>Master 1</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.specialtyButton, styles.glButton]}
            onPress={() => handleSpecialtySelect(1, 'GL')}
          >
            <Text style={styles.specialtyButtonText}>Génie Logiciel (GL)</Text>
            
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.specialtyButton, styles.aiButton]}
            onPress={() => handleSpecialtySelect(1, 'AI')}
          >
            <Text style={styles.specialtyButtonText}>Intelligence Artificielle (AI)</Text>
            
          </TouchableOpacity>
        </View>
      </View>

      {/* Master 2 Section */}
      <View style={styles.masterSection}>
        <Text style={styles.masterTitle}>Master 2</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.specialtyButton, styles.glButton]}
            onPress={() => handleSpecialtySelect(2, 'GL')}
          >
            <Text style={styles.specialtyButtonText}>Génie Logiciel (GL)</Text>
            
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.specialtyButton, styles.aiButton]}
            onPress={() => handleSpecialtySelect(2, 'AI')}
          >
            <Text style={styles.specialtyButtonText}>Intelligence Artificielle (AI)</Text>
            
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.aboutButton} onPress={handleAbout}>
        <Text style={styles.aboutButtonText}>À Propos</Text>
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
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40, 
    paddingTop: 20,
  },
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
    marginBottom: 18,
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
    marginTop: 25,
    padding: 25,
    paddingTop: 25,
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
    marginBottom: 20,
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
    gap: 15,
  },
  specialtyButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
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
  semesterSubtitle: {
    color: '#e0f2fe',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  aboutButton: {
    backgroundColor: '#64748b',
    paddingVertical: 14,
    paddingHorizontal: 130,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 40,
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
  errorContainer: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});