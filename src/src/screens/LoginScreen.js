import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { salvarNomeUsuario } from '../utils/storage';

export default function LoginScreen({ navigation }) {
  const [nome, setNome] = useState('');

  const handleEntrar = async () => {
    // Verifica se o nome foi preenchido
    if (!nome || nome.trim() === '') {
      alert("Por favor, digite seu nome!");
      return;
    }

    // Truque para acessar o Admin (Digite 'admin' no nome)
    if (nome.trim().toLowerCase() === 'admin') {
      navigation.navigate('Admin');
      return;
    }

    // Salva o nome do usuário e cria sessão
    const nomeNormalizado = nome.trim();
    await salvarNomeUsuario(nomeNormalizado);
    
    console.log('✅ Usuário salvo:', nomeNormalizado);
    
    // Redireciona para a Home
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png' }} 
        style={styles.logo} 
      />
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.subtitle}>Digite seu nome para começar</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Seu Nome</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: João Silva"
          value={nome} 
          onChangeText={setNome} 
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleEntrar}
        />

        <TouchableOpacity style={styles.btn} onPress={handleEntrar}>
          <Text style={styles.btnText}>ENTRAR</Text>
        </TouchableOpacity>

        <Text style={styles.info}>
          Seus dados serão salvos localmente neste dispositivo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C3E50', justifyContent: 'center', padding: 20, alignItems: 'center' },
  logo: { width: 80, height: 80, marginBottom: 20 },
  title: { fontSize: 24, color: '#FFF', fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#BDC3C7', marginBottom: 30, textAlign: 'center' },
  form: { width: '100%', backgroundColor: '#FFF', padding: 20, borderRadius: 15 },
  label: { fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { backgroundColor: '#F4F6F8', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#DDD', fontSize: 16 },
  btn: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  info: { fontSize: 12, color: '#7F8C8D', textAlign: 'center', marginTop: 15, fontStyle: 'italic' }
});