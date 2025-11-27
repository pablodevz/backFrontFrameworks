# 📱 Meu Diário de Hábitos (Projeto AV2)

Aplicação mobile desenvolvida em React Native (Expo) para gerenciamento de rotina e produtividade. O projeto foca na organização de tarefas diárias com persistência de dados local.

## 👥 Equipe de Desenvolvimento (Turma 2025.2)
- Gabriel Holanda
- Victor Milito
- Pablo de Omena
- Breno Sadoke
- Paulo Sergio

## 📋 Sobre o Projeto

Este aplicativo permite ao usuário criar, visualizar, editar e acompanhar hábitos diários. Foi desenvolvido para atender aos requisitos da avaliação da disciplina de Desenvolvimento Mobile, cobrindo componentes nativos, hooks e persistência de dados.

### 🚀 Funcionalidades Principais

- **Login e Cadastro:** Sistema de autenticação local com validação de e-mail e senha.
- **Dashboard Interativo:** Visualização de progresso diário e filtros por categoria (Saúde, Estudos, Trabalho, Lazer).
- **CRUD Completo:**
  - **C**riar novos hábitos com prioridade e notificações.
  - **R**ler lista de hábitos salvos.
  - **U**pdate (Editar) informações de hábitos existentes.
  - **D**elete (Excluir) hábitos com confirmação de segurança (Modal/Alert).
- **Persistência:** Dados salvos via `AsyncStorage` (não se perdem ao fechar o app).
- **Gamificação:** Modal de "Parabéns" ao concluir todas as tarefas do dia.
- **Painel Administrativo:** Visualização de todos os usuários cadastrados e estatísticas.

## 🛠 Tecnologias Utilizadas

- **React Native & Expo** (~54.0.25)
- **React Navigation** (Stack Navigation)
- **Async Storage** (@react-native-async-storage/async-storage)
- **Componentes Nativos:**
  - FlatList (lista de hábitos)
  - ScrollView (formulários e telas)
  - Modal (confirmações e parabéns)
  - Switch (notificações)
  - Slider (prioridade)
  - Picker (categorias)
- **Expo Vector Icons** (ícones)

## 📦 Como Rodar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo Go instalado no celular (para testar) OU emulador Android/iOS

### Passo a Passo

1. **Clone este repositório:**
   ```bash
   git clone https://github.com/pablodevz/backFrontFrameworks.git
   cd backFrontFrameworks/src
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor Expo:**
   ```bash
   npm start
   # ou
   npx expo start
   ```

4. **Execute no dispositivo:**
   - **Celular:** Escaneie o QR code com o app Expo Go (Android) ou Camera (iOS)
   - **Emulador Android:** Pressione `a` no terminal
   - **Emulador iOS:** Pressione `i` no terminal (apenas no macOS)
   - **Web:** Pressione `w` no terminal

### Comandos Disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run android    # Inicia no Android
npm run ios        # Inicia no iOS (macOS apenas)
npm run web        # Inicia na web
npm run lint       # Executa o linter
```

## 📁 Estrutura do Projeto

```
src/
├── screens/              # Telas da aplicação
│   ├── OnboardingScreen.js    # Tela inicial
│   ├── LoginScreen.js         # Tela de login
│   ├── RegisterScreen.js      # Tela de cadastro
│   ├── HomeScreen.js          # Tela principal (lista de hábitos)
│   ├── CadastroScreen.js      # Criar/Editar hábito
│   ├── DetalhesScreen.js      # Detalhes do hábito
│   ├── SobreScreen.js         # Configurações
│   └── AdminScreen.js         # Painel administrativo
├── components/           # Componentes reutilizáveis
│   ├── HabitoCard.js          # Card de hábito
│   └── ParabensModal.js       # Modal de parabéns
├── utils/                # Funções utilitárias
│   └── storage.js             # Funções de AsyncStorage
├── App.js                # Componente principal
└── package.json          # Dependências do projeto
```

## 🎯 Funcionalidades Detalhadas

### Sistema de Autenticação
- Cadastro com validação de email (domínios permitidos)
- Validação de senha (mínimo 8 caracteres)
- Login com verificação de credenciais
- Logout com limpeza de sessão
- Persistência de sessão (mantém logado)

### Gerenciamento de Hábitos
- **Criar:** Formulário com nome, categoria, prioridade (1-5) e notificações
- **Listar:** FlatList com filtros por categoria
- **Editar:** Modificar informações do hábito
- **Excluir:** Com confirmação via Alert
- **Marcar Conclusão:** Checkbox para marcar como concluído
- **Filtros:** Todos, Saúde, Estudos, Trabalho, Lazer

### Persistência de Dados
- Todos os dados são salvos localmente via AsyncStorage
- Dados persistem após fechar o app
- Banco de dados organizado com chaves separadas:
  - Usuários cadastrados
  - Sessão atual
  - Hábitos do usuário

## ✅ Checklist de Testes

Consulte o arquivo `CHECKLIST_ENTREGA.md` para a lista completa de testes manuais.

### Testes Principais:
1. ✅ Criar hábito
2. ✅ Marcar conclusão
3. ✅ Editar hábito
4. ✅ Apagar hábito
5. ✅ Persistência após fechar app
6. ✅ Filtros por categoria
7. ✅ Login/Cadastro

## 🐛 Tratamento de Erros

- Validação de campos obrigatórios
- Validação de email (domínios permitidos)
- Validação de senha (mínimo 8 caracteres)
- Confirmações antes de ações destrutivas
- Mensagens de erro claras para o usuário
- Logs de debug no console

## 📱 Compatibilidade

- ✅ Android (testado)
- ✅ iOS (testado)
- ✅ Web (parcial - algumas funcionalidades podem variar)

## 🔒 Segurança

- Senhas armazenadas localmente (sem criptografia - apenas para fins educacionais)
- Validação de email e senha
- Sessão local gerenciada via AsyncStorage
- Confirmações antes de ações destrutivas

## 📝 Notas Importantes

- **AsyncStorage é local:** Contas criadas em um dispositivo não aparecem em outro
- **Dados não sincronizam:** Cada dispositivo tem seu próprio banco de dados
- **Para produção:** Seria necessário implementar backend para sincronização

## 🚀 Próximas Melhorias (Futuro)

- [ ] Sincronização com backend
- [ ] Notificações push reais
- [ ] Estatísticas avançadas
- [ ] Exportação de dados
- [ ] Temas claro/escuro
- [ ] Modo offline completo

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da avaliação da disciplina de Desenvolvimento Mobile.

## 👨‍💻 Desenvolvido com

- React Native
- Expo
- React Navigation
- AsyncStorage
- Muito ☕ e 💻

---

**Repositório:** https://github.com/pablodevz/backFrontFrameworks

**Versão:** 1.0.0

**Última atualização:** Dezembro 2025
