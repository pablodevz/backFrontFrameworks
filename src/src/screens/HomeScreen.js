import React, { useState, useCallback, useEffect } from 'react'; // <--- Adicione useEffect
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HabitoCard from '../components/HabitoCard';
import ParabensModal from '../components/ParabensModal'; // <--- IMPORTANTE: Importe o Modal
import { getHabitos, toggleHabitoStatus, getUsuarioLogado } from '../utils/storage'; 

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
        <View>
          <Text style={styles.title}>Olá, {nomeUsuario}!</Text>
          <Text style={styles.subtitle}>{habitos.filter(h => h.concluido).length} concluídos hoje</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Sobre')}>
          <Ionicons name="settings-outline" size={24} color="#FFF" />
        </TouchableOpacity>
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
  header: { backgroundColor: '#2C3E50', padding: 30, paddingTop: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  subtitle: { color: '#BDC3C7', marginTop: 5 },
  filterContainer: { marginTop: -20, height: 50 },
  filterBtn: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, alignItems: 'center', elevation: 2 },
  filterBtnActive: { backgroundColor: '#4A90E2' },
  filterText: { marginLeft: 5, fontWeight: 'bold', color: '#2C3E50' },
  filterTextActive: { color: '#FFF' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  empty: { textAlign: 'center', marginTop: 10, color: '#999', fontSize: 16 },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2C3E50', alignItems: 'center', justifyContent: 'center', elevation: 5 }
});