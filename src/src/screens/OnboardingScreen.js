import React, { useEffect } from 'react'; // <--- Adicionei useEffect
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getUsuarioLogado } from '../utils/storage'; // <--- Importar função de checagem

export default function OnboardingScreen({ navigation }) {

  // --- NOVA LÓGICA DE AUTO-LOGIN ---
  useEffect(() => {
    const verificarSessao = async () => {
      // Pergunta pro banco de dados se tem alguém logado
      const usuario = await getUsuarioLogado();
      
      if (usuario) {
        // Se tiver, pula direto pra Home (sem pedir senha)
        navigation.replace('Home');
      }
    };
    
    verificarSessao();
  }, []);
  // ---------------------------------

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <Text style={styles.title}>Domine sua Rotina</Text>
        <Text style={styles.subtitle}>
          "O segredo do seu futuro está escondido na sua rotina diária."
        </Text>
        <Text style={styles.description}>
          Gerencie hábitos, acompanhe seu progresso e atinja seus objetivos com disciplina e organização.
        </Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.buttonText}>COMEÇAR JORNADA 🚀</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  image: { width: '100%', height: '55%', resizeMode: 'cover' },
  content: { flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center', marginTop: -30, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10 },
  subtitle: { fontSize: 16, fontStyle: 'italic', color: '#4A90E2', textAlign: 'center', marginBottom: 20 },
  description: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  button: { backgroundColor: '#2C3E50', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});