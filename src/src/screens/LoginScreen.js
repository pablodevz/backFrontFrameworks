import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { loginUsuario } from '../utils/storage'; // Importa a função que verifica a senha

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    // 1. Truque para você acessar o Admin (Digite 'admin' no email)
    if (email === 'admin') {
      navigation.navigate('Admin');
      return;
    }

    if (!email || !senha) {
      alert("Digite seu email e senha!");
      return;
    }

    // 2. Verifica no "Banco de Dados" se o usuário existe
    const res = await loginUsuario(email, senha);
    
    if (res.sucesso) {
      // 3. Se deu certo, vai para a Home
      navigation.replace('Home');
    } else {
      // 4. Se deu errado, avisa
      alert(res.msg);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png' }} 
        style={styles.logo} 
      />
      <Text style={styles.title}>Bem-vindo!</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="seu@email.com"
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput 
          style={styles.input} 
          placeholder="********" 
          value={senha} 
          onChangeText={setSenha} 
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>ENTRAR</Text>
        </TouchableOpacity>

        {/* Botão que leva para o Cadastro */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{marginTop: 20}}>
          <Text style={styles.link}>Não tem conta? <Text style={{fontWeight: 'bold'}}>Crie agora</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C3E50', justifyContent: 'center', padding: 20, alignItems: 'center' },
  logo: { width: 80, height: 80, marginBottom: 20 },
  title: { fontSize: 24, color: '#FFF', fontWeight: 'bold', marginBottom: 30 },
  form: { width: '100%', backgroundColor: '#FFF', padding: 20, borderRadius: 15 },
  label: { fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { backgroundColor: '#F4F6F8', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#DDD' },
  btn: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  link: { color: '#4A90E2', textAlign: 'center' }
});