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

## 🛠 Tecnologias Utilizadas
- **React Native & Expo**
- **React Navigation** (Stack Navigation)
- **Async Storage** (Banco de dados local)
- **Componentes:** FlatList, Modal, Switch, Slider, Picker.

## 📦 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.

### Passo a Passo
1. Clone este repositório ou baixe os arquivos.
2. Abra o terminal na pasta do projeto e instale as dependências:
   ```bash
   npm install