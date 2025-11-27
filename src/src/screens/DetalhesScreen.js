import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteHabito } from '../utils/storage';

export default function DetalhesScreen({ route, navigation }) {
  const { habito } = route.params;

  // --- FUNÇÃO UNIVERSAL (Resolve seu problema) ---
  // Ela detecta sozinha se é Web ou Mobile e mostra o alerta certo
  const confirmarAcao = (titulo, mensagem, acaoSim) => {
    if (Platform.OS === 'web') {
      // Na Web: Usa o confirm padrão do navegador
      if (window.confirm(mensagem)) {
        acaoSim();
      }
    } else {
      // No Celular: Usa o Alert bonito nativo
      Alert.alert(titulo, mensagem, [
        { text: "Cancelar", style: "cancel" },
        { text: "SIM", style: 'destructive', onPress: acaoSim }
      ]);
    }
  };
  // -----------------------------------------------

  const executarExclusao = async () => {
    const sucesso = await deleteHabito(habito.id);
    if (sucesso) {
      navigation.goBack();
    } else {
      alert('Erro ao excluir.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com cor dinâmica baseada na categoria (Opcional, mas fica bonito) */}
      <View style={[styles.header, { backgroundColor: '#2C3E50' }]}>
        <Ionicons name="ribbon" size={60} color="#FFF" />
        <Text style={styles.headerTitle}>{habito.categoria}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>HÁBITO</Text>
        <Text style={styles.value}>{habito.nome}</Text>

        <Text style={styles.label}>PRIORIDADE</Text>
        <Text style={styles.value}>Nível {habito.prioridade}</Text>
        
        <Text style={styles.label}>STATUS</Text>
        <Text style={[styles.value, { color: habito.concluido ? 'green' : 'orange' }]}>
          {habito.concluido ? 'Concluído ✅' : 'Pendente ⏳'}
        </Text>

        <Text style={styles.label}>NOTIFICAÇÕES</Text>
        <Text style={styles.value}>{habito.notificacao ? 'Ligado' : 'Desligado'}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btnEditar} 
          onPress={() => navigation.navigate('Cadastro', { habito: habito })}
        >
          <Text style={styles.btnText}>EDITAR</Text>
        </TouchableOpacity>

        {/* Aqui chamamos a função universal, servindo para os dois */}
        <TouchableOpacity 
          style={styles.btnExcluir} 
          onPress={() => confirmarAcao("Excluir", "Tem certeza que deseja apagar?", executarExclusao)}
        >
          <Ionicons name="trash" size={20} color="#FFF" />
          <Text style={[styles.btnText, { marginLeft: 5 }]}>EXCLUIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { height: 140, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  content: { padding: 30 },
  label: { color: '#95A5A6', fontSize: 12, fontWeight: 'bold', marginBottom: 5, marginTop: 15 },
  value: { color: '#2C3E50', fontSize: 18, fontWeight: 'bold' },
  footer: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  btnEditar: { flex: 1, backgroundColor: '#95A5A6', padding: 15, borderRadius: 10, alignItems: 'center', marginRight: 10 },
  btnExcluir: { flex: 1, backgroundColor: '#E74C3C', padding: 15, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});