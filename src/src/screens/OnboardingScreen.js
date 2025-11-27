import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getUsuarioLogado } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Verifica se há usuário logado
    const verificarSessao = async () => {
      const usuario = await getUsuarioLogado();
      if (usuario) {
        navigation.replace('Home');
      }
    };
    
    verificarSessao();

    // Animações de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(iconAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const iconRotation = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const features = [
    { icon: 'checkmark-circle', title: 'Progresso', color: '#27AE60' },
    { icon: 'notifications', title: 'Lembretes', color: '#4A90E2' },
    { icon: 'stats-chart', title: 'Estatísticas', color: '#E74C3C' },
    { icon: 'trophy', title: 'Conquistas', color: '#F39C12' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background com imagem */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200' }}
        style={styles.backgroundImage}
        blurRadius={2}
      >
        {/* Overlay */}
        <View style={styles.overlay} />
        
        {/* Conteúdo Principal - Centralizado */}
        <View style={styles.content}>
          {/* Logo/Ícone Animado */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.iconWrapper,
                {
                  transform: [
                    { rotate: iconRotation },
                    { scale: pulseAnim },
                  ],
                },
              ]}
            >
              <View style={styles.iconInner}>
                <Ionicons name="checkmark-done-circle" size={60} color="#FFF" />
              </View>
              <View style={styles.iconGlow} />
            </Animated.View>
          </Animated.View>

          {/* Título Principal */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>Domine sua Rotina</Text>
            <Text style={styles.subtitle}>
              Transforme objetivos em hábitos duradouros
            </Text>
          </Animated.View>

          {/* Features em Grid 2x2 */}
          <Animated.View
            style={[
              styles.featuresContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <Ionicons name={feature.icon} size={28} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Informações Compactas */}
          <Animated.View
            style={[
              styles.infoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark" size={16} color="#27AE60" />
              <Text style={styles.infoText}>Seguro</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cloud-done" size={16} color="#4A90E2" />
              <Text style={styles.infoText}>Sincronizado</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="phone-portrait" size={16} color="#E74C3C" />
              <Text style={styles.infoText}>Offline</Text>
            </View>
          </Animated.View>

          {/* Botões de Ação - Sempre Visíveis */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Botão de Login */}
            <TouchableOpacity 
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => navigation.replace('Login')}
              activeOpacity={0.8}
            >
              <Ionicons name="log-in" size={20} color="#FFF" />
              <Text style={styles.buttonTextPrimary}>ENTRAR</Text>
            </TouchableOpacity>

            {/* Botão de Criar Conta */}
            <TouchableOpacity 
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add" size={20} color="#2C3E50" />
              <Text style={styles.buttonTextSecondary}>CRIAR CONTA</Text>
            </TouchableOpacity>
            
            <Text style={styles.disclaimer}>
              Ao continuar, você concorda com nossos termos
            </Text>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 62, 80, 0.88)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 25,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  iconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 2,
  },
  iconGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(39, 174, 96, 0.25)',
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ECF0F1',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    opacity: 0.95,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  featureCard: {
    width: (width - 70) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    padding: 12,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 11,
    color: '#ECF0F1',
    marginLeft: 6,
    opacity: 0.9,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: '#27AE60',
  },
  buttonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#2C3E50',
  },
  buttonTextPrimary: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  buttonTextSecondary: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  disclaimer: {
    fontSize: 10,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
});
