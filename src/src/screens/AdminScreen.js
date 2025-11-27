import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTodosUsuarios, deletarUsuario } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function AdminScreen() {
  const [users, setUsers] = useState([]);

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const carregar = async () => {
    const dados = await getTodosUsuarios();
    setUsers(dados);
  };

  const confirmarExclusao = (email) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Apagar este usuário?")) apagar(email);
    } else {
      Alert.alert("Apagar", "Tem certeza?", [{text: "Sim", onPress: () => apagar(email)}, {text: "Não"}]);
    }
  };

  const apagar = async (email) => {
    await deletarUsuario(email);
    carregar();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Admin (BD)</Text>
      <Text style={styles.sub}>Total: {users.length} usuários</Text>

      <FlatList
        data={users}
        keyExtractor={item => item.email}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.senha}>Senha: {item.senha}</Text>
            </View>
            <TouchableOpacity onPress={() => confirmarExclusao(item.email)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold' },
  sub: { marginBottom: 20, color: '#666' },
  card: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', marginBottom: 10, borderRadius: 8, elevation: 2, alignItems: 'center' },
  nome: { fontWeight: 'bold', fontSize: 16 },
  email: { color: '#555' },
  senha: { fontSize: 10, color: '#999' }
});