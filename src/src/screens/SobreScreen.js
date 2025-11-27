import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function SobreScreen({ navigation }) {
  
  const resetarTudo = async () => {
    await AsyncStorage.clear();
    alert('Dados limpos! O app vai parecer novo.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="code-slash" size={50} color="#2C3E50" />
        <Text style={styles.title}>Sobre o Projeto</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>EQUIPE DE DESENVOLVIMENTO</Text>
        <Text style={styles.member}>• Gabriel Holanda</Text>
        <Text style={styles.member}>• Victor Milito</Text>
        <Text style={styles.member}>• Pablo de Omena</Text>
        <Text style={styles.member}>• Breno Sadoke</Text>
        <Text style={styles.member}>• Paulo Sergio</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>DETALHES ACADÊMICOS</Text>
        <Text style={styles.info}>Turma: 2025.2 - 4º Período</Text>
        <Text style={styles.info}>Disciplina: Desenvolvimento Mobile</Text>
        <Text style={styles.info}>Professor: Victor Brunno</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 1.0.0</Text>
        <Button title="Resetar App (Debug)" onPress={resetarTudo} color="#E74C3C" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#F4F6F8' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50', marginTop: 10 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#95A5A6', marginBottom: 15, letterSpacing: 1 },
  member: { fontSize: 18, color: '#34495E', marginBottom: 8, fontWeight: '500' },
  info: { fontSize: 16, color: '#2C3E50', marginBottom: 5 },
  footer: { marginTop: 20, alignItems: 'center' },
  footerText: { color: '#BDC3C7', marginBottom: 10 }
});