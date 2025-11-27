import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deletarUsuario, getEstatisticas, getTodosUsuarios } from '../utils/storage';

export default function AdminScreen() {
  const [users, setUsers] = useState([]);
  const [estatisticas, setEstatisticas] = useState({ totalUsuarios: 0, totalHabitos: 0, usuariosAtivos: 0 });

  useFocusEffect(useCallback(() => { 
    carregar(); 
  }, []));

  const carregar = async () => {
    const dados = await getTodosUsuarios();
    setUsers(dados);
    const stats = await getEstatisticas();
    setEstatisticas(stats);
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

  const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com Estatísticas */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Painel Administrativo</Text>
          <Text style={styles.subtitle}>Banco de Dados de Usuários</Text>
        </View>

        {/* Cards de Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#4A90E2' }]}>
            <Ionicons name="people" size={32} color="#FFF" />
            <Text style={styles.statNumber}>{estatisticas.totalUsuarios}</Text>
            <Text style={styles.statLabel}>Total de Usuários</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#27AE60' }]}>
            <Ionicons name="checkmark-circle" size={32} color="#FFF" />
            <Text style={styles.statNumber}>{estatisticas.usuariosAtivos}</Text>
            <Text style={styles.statLabel}>Usuários Ativos</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#E74C3C' }]}>
            <Ionicons name="list" size={32} color="#FFF" />
            <Text style={styles.statNumber}>{estatisticas.totalHabitos}</Text>
            <Text style={styles.statLabel}>Total de Hábitos</Text>
          </View>
        </View>

        {/* Lista de Usuários */}
        <Text style={styles.sectionTitle}>Usuários Cadastrados ({users.length})</Text>
        
        <FlatList
          data={users}
          keyExtractor={item => item.id || item.email}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.nome ? item.nome.charAt(0).toUpperCase() : 'U'}
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.nome}>{item.nome || 'Sem nome'}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <View style={styles.metaInfo}>
                      <Text style={styles.metaText}>
                        📅 Cadastrado: {formatarData(item.dataCadastro)}
                      </Text>
                      {item.ultimoAcesso && (
                        <Text style={styles.metaText}>
                          🔄 Último acesso: {formatarData(item.ultimoAcesso)}
                        </Text>
                      )}
                      {item.totalHabitos !== undefined && (
                        <Text style={styles.metaText}>
                          ✅ Hábitos: {item.totalHabitos} | Concluídos: {item.habitosConcluidos || 0}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => confirmarExclusao(item.email)}
                >
                  <Ionicons name="trash-outline" size={22} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F6F8',
    paddingTop: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#2C3E50',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#ECF0F1',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 25,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#FFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  userDetails: {
    flex: 1,
  },
  nome: { 
    fontWeight: 'bold', 
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
  },
  email: { 
    color: '#7F8C8D',
    fontSize: 14,
    marginBottom: 8,
  },
  metaInfo: {
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#95A5A6',
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFE5E5',
  },
});