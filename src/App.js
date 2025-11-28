import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import React from 'react';

import AdminScreen from './src/screens/AdminScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SobreScreen from './src/screens/SobreScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Onboarding"
        screenOptions={{
          headerStyle: { backgroundColor: '#2C3E50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Painel Admin' }} /> 
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Gerenciar Hábito' }} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes do Hábito' }} />
        <Stack.Screen name="Sobre" component={SobreScreen} options={{ title: 'Configurações' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);