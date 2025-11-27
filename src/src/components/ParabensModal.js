import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ParabensModal({ visivel, aoFechar }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visivel}
      onRequestClose={aoFechar}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Ionicons name="trophy" size={50} color="#F1C40F" />
          <Text style={styles.modalTitle}>Parabéns, Desenrolado!</Text>
          <Text style={styles.modalText}>Você completou todas as suas metas de hoje. Continue focado!</Text>

          <TouchableOpacity
            style={styles.buttonClose}
            onPress={aoFechar}
          >
            <Text style={styles.textStyle}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: "white", borderRadius: 20, padding: 35, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { marginBottom: 15, textAlign: "center", fontSize: 22, fontWeight: 'bold', color: '#2C3E50' },
  modalText: { marginBottom: 20, textAlign: "center", fontSize: 16, color: '#7F8C8D' },
  buttonClose: { backgroundColor: "#2196F3", borderRadius: 20, padding: 10, paddingHorizontal: 30, elevation: 2 },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center" }
});