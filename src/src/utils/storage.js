import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_USERS = '@meu_diario_users';
const KEY_SESSION = '@meu_diario_session';
const KEY_HABITOS = '@meu_diario_habitos';

// --- FUNÇÕES DE USUÁRIO ---

export const cadastrarUsuario = async (nome, email, senha) => {
  try {
    console.log("Tentando cadastrar:", nome, email); // LOG PARA DEBUG

    // 1. Pega os usuários que já existem
    const usersJson = await AsyncStorage.getItem(KEY_USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    // 2. Verifica se o email já existe
    const existe = users.find(u => u.email === email);
    if (existe) {
      return { sucesso: false, msg: 'Este email já está cadastrado!' };
    }

    // 3. Cria o novo usuário
    const novoUsuario = { id: Date.now().toString(), nome, email, senha };
    users.push(novoUsuario);
    
    // 4. Salva a lista atualizada
    await AsyncStorage.setItem(KEY_USERS, JSON.stringify(users));
    console.log("Usuário salvo com sucesso!"); // LOG PARA DEBUG
    
    return { sucesso: true };
  } catch (e) {
    console.error("Erro no cadastro:", e);
    return { sucesso: false, msg: 'Erro ao salvar no banco de dados.' };
  }
};

export const loginUsuario = async (email, senha) => {
  try {
    const usersJson = await AsyncStorage.getItem(KEY_USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    const user = users.find(u => u.email === email && u.senha === senha);
    
    if (user) {
      await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(user));
      return { sucesso: true, usuario: user };
    }
    return { sucesso: false, msg: 'Email ou senha incorretos.' };
  } catch (e) {
    return { sucesso: false, msg: 'Erro ao tentar logar.' };
  }
};

export const getUsuarioLogado = async () => {
  try {
    const json = await AsyncStorage.getItem(KEY_SESSION);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    return null;
  }
};

// --- FUNÇÕES DE HÁBITOS ---
// (Essas você já tinha, mas vou deixar aqui para garantir que não quebre nada)

export const getHabitos = async () => {
  const dados = await AsyncStorage.getItem(KEY_HABITOS);
  return dados ? JSON.parse(dados) : [];
};

export const saveHabito = async (novoHabito) => {
  const habitos = await getHabitos();
  const index = habitos.findIndex(h => h.id === novoHabito.id);
  let novaLista = index !== -1 
    ? habitos.map(h => h.id === novoHabito.id ? novoHabito : h) 
    : [...habitos, novoHabito];
  await AsyncStorage.setItem(KEY_HABITOS, JSON.stringify(novaLista));
  return true;
};

export const deleteHabito = async (id) => {
  const habitos = await getHabitos();
  const nova = habitos.filter(h => h.id !== id);
  await AsyncStorage.setItem(KEY_HABITOS, JSON.stringify(nova));
  return true;
};

export const toggleHabitoStatus = async (id) => {
  const habitos = await getHabitos();
  const nova = habitos.map(h => h.id === id ? { ...h, concluido: !h.concluido } : h);
  await AsyncStorage.setItem(KEY_HABITOS, JSON.stringify(nova));
  return nova;
};

// --- FUNÇÕES DE ADMIN ---
export const getTodosUsuarios = async () => {
  const json = await AsyncStorage.getItem(KEY_USERS);
  return json ? JSON.parse(json) : [];
};

export const deletarUsuario = async (email) => {
  const users = await getTodosUsuarios();
  const novosUsers = users.filter(u => u.email !== email);
  await AsyncStorage.setItem(KEY_USERS, JSON.stringify(novosUsers));
  return true;
};