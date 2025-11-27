import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'; // <--- Adicione useEffect
import { FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import HabitoCard from '../components/HabitoCard';
import ParabensModal from '../components/ParabensModal'; // <--- IMPORTANTE: Importe o Modal
import { getHabitos, getUsuarioLogado, logoutUsuario, toggleHabitoStatus } from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [habitos, setHabitos] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [nomeUsuario, setNomeUsuario] = useState('Desenrolado');
  const [modalVisivel, setModalVisivel] = useState(false); // <--- Estado do Modal

  const carregar = async () => {
    const dados = await getHabitos();
    setHabitos(dados);
    const usuario = await getUsuarioLogado();
    if (usuario && usuario.nome) {
      setNomeUsuario(usuario.nome);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  // <--- LÓGICA NOVA: Verificar se completou tudo
  useEffect(() => {
    const total = habitos.length;
    const concluidos = habitos.filter(h => h.concluido).length;
    
    // Se tiver pelo menos 1 hábito e todos estiverem feitos
    if (total > 0 && total === concluidos) {
      setModalVisivel(true);
    }
  }, [habitos]);
  // ---------------------------------------------

  const handleCheck = async (id) => {
    const novaLista = await toggleHabitoStatus(id);
    setHabitos(novaLista);
  };

  const handleLogout = async () => {
    try {
      // Remove a sessão
      await logoutUsuario();
      
      // Limpa o estado local
      setNomeUsuario('Desenrolado');
      setHabitos([]);
      
      // Navega para Onboarding resetando o stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, tenta navegar
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }
  };

  const habitosFiltrados = habitos.filter(h => 
    filtro === 'Todos' ? true : h.categoria === filtro
  );

  const FilterBadge = ({ label, icon }) => (
    <TouchableOpacity 
      style={[styles.filterBtn, filtro === label && styles.filterBtnActive]} 
      onPress={() => setFiltro(label)}
    >
      <Ionicons name={icon} size={16} color={filtro === label ? "#FFF" : "#2C3E50"} />
      <Text style={[styles.filterText, filtro === label && styles.filterTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      {/* <--- INSERIR O MODAL AQUI */}
      <ParabensModal 
        visivel={modalVisivel} 
        aoFechar={() => setModalVisivel(false)} 
      />
      {/* ----------------------- */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            Olá, {nomeUsuario.split(' ')[0]}!
          </Text>
          <Text style={styles.subtitle}>{habitos.filter(h => h.concluido).length} concluídos hoje</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Sobre')}
            style={styles.settingsButton}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 20}}>
          <FilterBadge label="Todos" icon="layers" />
          <FilterBadge label="Saúde" icon="fitness" />
          <FilterBadge label="Estudos" icon="book" />
          <FilterBadge label="Trabalho" icon="briefcase" />
          <FilterBadge label="Lazer" icon="game-controller" />
        </ScrollView>
      </View>

      <FlatList
        data={habitosFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <HabitoCard 
            data={item} 
            onPress={() => navigation.navigate('Detalhes', { habito: item })}
            onCheck={() => handleCheck(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={50} color="#BDC3C7" />
            <Text style={styles.empty}>Nenhum hábito encontrado.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Cadastro')}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: { 
    backgroundColor: '#2C3E50', 
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    minHeight: 110,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
    minWidth: 0,
  },
  headerButtons: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    flexShrink: 0,
  },
  logoutButton: { 
    padding: 10, 
    borderRadius: 8, 
    backgroundColor: 'rgba(231, 76, 60, 0.25)',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  settingsButton: { 
    padding: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FFF', 
    flexShrink: 1,
    maxWidth: '100%',
  },
  subtitle: { 
    color: '#BDC3C7', 
    marginTop: 4, 
    fontSize: 13,
  },
  filterContainer: { 
    marginTop: 0, 
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#F4F6F8',
  },
  filterBtn: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, alignItems: 'center', elevation: 2 },
  filterBtnActive: { backgroundColor: '#4A90E2' },
  filterText: { marginLeft: 5, fontWeight: 'bold', color: '#2C3E50' },
  filterTextActive: { color: '#FFF' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  empty: { textAlign: 'center', marginTop: 10, color: '#999', fontSize: 16 },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2C3E50', alignItems: 'center', justifyContent: 'center', elevation: 5 }
});