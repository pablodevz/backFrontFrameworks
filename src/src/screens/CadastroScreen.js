import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
// IMPORTANTE: Importando a função do nosso arquivo utils
import { saveHabito } from '../utils/storage';

export default function CadastroScreen({ navigation, route }) {
  const habitoParaEditar = route.params?.habito;

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Saúde');
  const [prioridade, setPrioridade] = useState(1);
  const [notificacao, setNotificacao] = useState(false);

  // Esse useEffect garante que os dados carreguem quando clicamos em "Editar"
  useEffect(() => {
    if (habitoParaEditar) {
      setNome(habitoParaEditar.nome);
      setCategoria(habitoParaEditar.categoria);
      setPrioridade(habitoParaEditar.prioridade);
      // Aqui estava o erro das notificações: garantindo que seja booleano
      setNotificacao(Boolean(habitoParaEditar.notificacao)); 
      navigation.setOptions({ title: 'Editar Hábito' });
    }
  }, [habitoParaEditar]);

  const handleSalvar = async () => {
    if (nome.trim() === '') {
      Alert.alert('Erro', 'O nome é obrigatório!');
      return;
    }

    const novoHabito = {
      id: habitoParaEditar ? habitoParaEditar.id : Date.now().toString(),
      nome,
      categoria,
      prioridade,
      notificacao,
      concluido: habitoParaEditar ? habitoParaEditar.concluido : false
    };

    const sucesso = await saveHabito(novoHabito);
    
    if (sucesso) {
      Alert.alert('Sucesso', 'Hábito salvo!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Falha ao salvar no armazenamento.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome do Objetivo</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Ler 10 páginas" />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.box}>
        <Picker 
          selectedValue={categoria} 
          onValueChange={setCategoria}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Saúde" value="Saúde" color="#34495E" />
          <Picker.Item label="Estudos" value="Estudos" color="#34495E" />
          <Picker.Item label="Trabalho" value="Trabalho" color="#34495E" />
          <Picker.Item label="Lazer" value="Lazer" color="#34495E" />
        </Picker>
      </View>

      <Text style={styles.label}>Prioridade: {prioridade}</Text>
      <View style={styles.sliderContainer}>
        <Slider 
          style={styles.slider} 
          minimumValue={1} 
          maximumValue={5} 
          step={1} 
          value={prioridade} 
          onValueChange={setPrioridade} 
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#4A90E2"
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>🔔 Notificações</Text>
        <Switch 
          value={notificacao} 
          onValueChange={setNotificacao}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificacao ? "#4A90E2" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSalvar}>
        <Text style={styles.btnText}>SALVAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F4F6F8', flexGrow: 1 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#34495E', marginTop: 15, marginBottom: 5 },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#DDD' },
  box: { backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#DDD', overflow: 'hidden' },
  picker: { width: '100%', color: '#34495E' },
  pickerItem: { color: '#34495E', fontSize: 16 },
  sliderContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 },
  slider: { width: '100%', height: 40 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 30, backgroundColor: '#FFF', padding: 15, borderRadius: 10 },
  btn: { backgroundColor: '#2C3E50', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});