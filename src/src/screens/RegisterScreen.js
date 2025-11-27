import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cadastrarUsuario } from '../utils/storage';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    // 1. Verifica campos vazios
    if (!nome || !email || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    // --- NOVA VALIDAÇÃO DE EMAIL (Domínios Específicos) ---
    const dominiosPermitidos = ['@gmail.com', '@hotmail.com', '@outlook.com', '@yahoo.com', '@live.com', '@icloud.com'];
    
    // Converte para minúsculo e verifica se TERMINA com algum dos domínios acima
    const emailValido = dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio));

    if (!emailValido) {
      alert("Email inválido! Aceitamos apenas: Gmail, Hotmail, Outlook, Yahoo, Live ou iCloud.");
      return;
    }
    // -------------------------------------------------------

    // 3. Validação de SENHA (Mínimo 8 dígitos)
    if (senha.length < 8) {
      alert("Senha muito curta! Ela precisa ter no mínimo 8 caracteres.");
      return;
    }

    // Se passou por tudo, tenta cadastrar
    const res = await cadastrarUsuario(nome, email, senha);
    
    if (res.sucesso) {
      alert("Conta criada com sucesso!");
      navigation.navigate('Login'); 
    } else {
      alert(res.msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* BOTÃO DE VOLTAR NO TOPO */}
      <TouchableOpacity 
        style={styles.backButtonTop} 
        onPress={() => navigation.navigate('Login')}
      >
        <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        <Text style={styles.backText}>Voltar para Login</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Criar Conta</Text>
      <Text style={styles.subTitle}>Preencha seus dados para começar</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: João Silva" 
          value={nome} 
          onChangeText={setNome} 
        />

        <Text style={styles.label}>E-mail (Gmail, Hotmail, Outlook...)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="seu@gmail.com" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha (Mín. 8 caracteres)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="********" 
          value={senha} 
          onChangeText={setSenha} 
          secureTextEntry 
        />

        <TouchableOpacity style={styles.btnCadastrar} onPress={handleCadastro}>
          <Text style={styles.btnText}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
      
      {/* LINK NO RODAPÉ */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')} 
        style={styles.btnVoltarBottom}
      >
        <Text style={styles.textVoltar}>Já tenho conta? <Text style={{fontWeight: 'bold'}}>Fazer Login</Text></Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 25, backgroundColor: '#F4F6F8' },
  backButtonTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start', padding: 10 },
  backText: { fontSize: 16, color: '#2C3E50', marginLeft: 5, fontWeight: 'bold' },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#2C3E50', marginBottom: 5 },
  subTitle: { fontSize: 16, color: '#7F8C8D', marginBottom: 30 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#34495E', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E1E8ED', fontSize: 16 },
  btnCadastrar: { backgroundColor: '#27AE60', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30, elevation: 3 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  btnVoltarBottom: { marginTop: 30, padding: 15, alignItems: 'center' },
  textVoltar: { color: '#4A90E2', fontSize: 16 }
});