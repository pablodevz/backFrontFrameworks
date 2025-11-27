import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_USERS = '@meu_diario_users';
const KEY_SESSION = '@meu_diario_session';
const KEY_HABITOS = '@meu_diario_habitos';

// --- FUNÇÕES DE USUÁRIO (BANCO DE DADOS ORGANIZADO) ---

/**
 * Cadastra um novo usuário no banco de dados
 * @param {string} nome - Nome completo do usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<{sucesso: boolean, msg?: string}>}
 */
export const cadastrarUsuario = async (nome, email, senha) => {
  try {
    // Normaliza o email (remove espaços e converte para minúsculo)
    const emailNormalizado = email.trim().toLowerCase();
    
    console.log('📝 Tentando cadastrar:', { nome, email: emailNormalizado });
    
    // 1. Pega os usuários que já existem
    const usersJson = await AsyncStorage.getItem(KEY_USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];
    
    console.log('👥 Usuários existentes:', users.length);

    // 2. Verifica se o email já existe
    const existe = users.find(u => u.email === emailNormalizado);
    if (existe) {
      console.log('❌ Email já cadastrado');
      return { sucesso: false, msg: 'Este email já está cadastrado!' };
    }

    // 3. Cria o novo usuário com dados completos
    const novoUsuario = { 
      id: Date.now().toString(), 
      nome: nome.trim(), 
      email: emailNormalizado, 
      senha: senha.trim(),
      dataCadastro: new Date().toISOString(),
      ultimoAcesso: new Date().toISOString(),
      totalHabitos: 0,
      habitosConcluidos: 0
    };
    
    users.push(novoUsuario);
    
    // 4. Salva a lista atualizada
    await AsyncStorage.setItem(KEY_USERS, JSON.stringify(users));
    
    // Verifica se foi salvo corretamente
    const verificar = await AsyncStorage.getItem(KEY_USERS);
    const usuariosSalvos = verificar ? JSON.parse(verificar) : [];
    console.log('✅ Usuário salvo! Total de usuários:', usuariosSalvos.length);
    console.log('📋 Último usuário:', usuariosSalvos[usuariosSalvos.length - 1]);
    
    return { sucesso: true, usuario: novoUsuario };
  } catch (e) {
    console.error("❌ Erro no cadastro:", e);
    return { sucesso: false, msg: 'Erro ao salvar no banco de dados.' };
  }
};

/**
 * Realiza login do usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<{sucesso: boolean, usuario?: object, msg?: string}>}
 */
export const loginUsuario = async (email, senha) => {
  try {
    // Normaliza o email (remove espaços e converte para minúsculo)
    const emailNormalizado = email.trim().toLowerCase();
    const senhaNormalizada = senha.trim();
    
    console.log('🔐 Tentando fazer login:', { email: emailNormalizado });
    
    const usersJson = await AsyncStorage.getItem(KEY_USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];
    
    console.log('👥 Total de usuários no banco:', users.length);
    console.log('📋 Emails cadastrados:', users.map(u => u.email));

    const user = users.find(u => 
      u.email === emailNormalizado && u.senha === senhaNormalizada
    );
    
    if (user) {
      console.log('✅ Login bem-sucedido!', { nome: user.nome, email: user.email });
      
      // Atualiza último acesso
      user.ultimoAcesso = new Date().toISOString();
      const updatedUsers = users.map(u => 
        u.id === user.id ? user : u
      );
      await AsyncStorage.setItem(KEY_USERS, JSON.stringify(updatedUsers));
      
      // Salva sessão
      await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(user));
      return { sucesso: true, usuario: user };
    }
    
    console.log('❌ Email ou senha incorretos');
    return { sucesso: false, msg: 'Email ou senha incorretos.' };
  } catch (e) {
    console.error("❌ Erro no login:", e);
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

/**
 * Realiza logout do usuário (remove sessão)
 * @returns {Promise<void>}
 */
export const logoutUsuario = async () => {
  try {
    console.log('Removendo sessão do AsyncStorage...');
    // Remove a sessão do AsyncStorage
    await AsyncStorage.removeItem(KEY_SESSION);
    console.log('Sessão removida com sucesso');
    
    // Verifica se foi removido
    const session = await AsyncStorage.getItem(KEY_SESSION);
    if (session !== null) {
      console.warn('Aviso: Sessão ainda existe após remoção');
      // Tenta remover novamente
      await AsyncStorage.removeItem(KEY_SESSION);
    }
  } catch (e) {
    console.error("Erro ao fazer logout:", e);
    throw e;
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

// --- FUNÇÕES DE ADMIN E ESTATÍSTICAS ---

/**
 * Retorna todos os usuários cadastrados
 * @returns {Promise<Array>}
 */
export const getTodosUsuarios = async () => {
  try {
    const json = await AsyncStorage.getItem(KEY_USERS);
    const users = json ? JSON.parse(json) : [];
    // Ordena por data de cadastro (mais recentes primeiro)
    return users.sort((a, b) => 
      new Date(b.dataCadastro) - new Date(a.dataCadastro)
    );
  } catch (e) {
    console.error("Erro ao buscar usuários:", e);
    return [];
  }
};

/**
 * Retorna estatísticas do banco de dados
 * @returns {Promise<{totalUsuarios: number, totalHabitos: number, usuariosAtivos: number}>}
 */
export const getEstatisticas = async () => {
  try {
    const users = await getTodosUsuarios();
    const habitos = await getHabitos();
    
    // Usuários que acessaram nos últimos 30 dias
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    
    const usuariosAtivos = users.filter(u => {
      const ultimoAcesso = new Date(u.ultimoAcesso);
      return ultimoAcesso >= trintaDiasAtras;
    }).length;
    
    return {
      totalUsuarios: users.length,
      totalHabitos: habitos.length,
      usuariosAtivos
    };
  } catch (e) {
    console.error("Erro ao buscar estatísticas:", e);
    return { totalUsuarios: 0, totalHabitos: 0, usuariosAtivos: 0 };
  }
};

/**
 * Deleta um usuário do banco de dados
 * @param {string} email - Email do usuário a ser deletado
 * @returns {Promise<boolean>}
 */
export const deletarUsuario = async (email) => {
  try {
    const users = await getTodosUsuarios();
    const novosUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    await AsyncStorage.setItem(KEY_USERS, JSON.stringify(novosUsers));
    return true;
  } catch (e) {
    console.error("Erro ao deletar usuário:", e);
    return false;
  }
};

/**
 * Atualiza estatísticas do usuário
 * @param {string} userId - ID do usuário
 * @returns {Promise<void>}
 */
export const atualizarEstatisticasUsuario = async (userId) => {
  try {
    const users = await getTodosUsuarios();
    const habitos = await getHabitos();
    const habitosDoUsuario = habitos.filter(h => h.userId === userId);
    
    const usuario = users.find(u => u.id === userId);
    if (usuario) {
      usuario.totalHabitos = habitosDoUsuario.length;
      usuario.habitosConcluidos = habitosDoUsuario.filter(h => h.concluido).length;
      
      const updatedUsers = users.map(u => u.id === userId ? usuario : u);
      await AsyncStorage.setItem(KEY_USERS, JSON.stringify(updatedUsers));
    }
  } catch (e) {
    console.error("Erro ao atualizar estatísticas:", e);
  }
};