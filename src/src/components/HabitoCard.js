import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HabitoCard({ data, onPress, onCheck }) {
  
  const getIcone = (categoria) => {
    switch(categoria) {
      case 'Saúde': return 'fitness';
      case 'Estudos': return 'book';
      case 'Trabalho': return 'briefcase';
      case 'Lazer': return 'game-controller';
      default: return 'star';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, data.concluido && styles.cardConcluido]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIcone(data.categoria)} size={24} color="#FFF" />
      </View>

      <View style={styles.content}>
        <Text style={styles.titulo}>{data.nome}</Text>
        <Text style={styles.subtitulo}>{data.categoria} • Prioridade {data.prioridade}</Text>
      </View>

      <TouchableOpacity onPress={onCheck} style={styles.checkBtn}>
        <Ionicons 
          name={data.concluido ? "checkbox" : "square-outline"} 
          size={32} 
          color={data.concluido ? "#27AE60" : "#BDC3C7"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 2, marginHorizontal: 20 },
  cardConcluido: { opacity: 0.6, backgroundColor: '#F8F9F9' },
  iconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#4A90E2', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, marginLeft: 15 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  subtitulo: { fontSize: 12, color: '#7F8C8D', marginTop: 2 },
  checkBtn: { padding: 5 }
});