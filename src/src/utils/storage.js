import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_SESSION = '@meu_diario_session';

// Função auxiliar para obter a chave de hábitos baseada no nome do usuário
const getKeyHabitos = (nomeUsuario) => {
  return `@meu_diario_habitos_${nomeUsuario}`;
};

// --- FUNÇÕES DE USUÁRIO SIMPLIFICADAS ---

/**
 * Salva o nome do usuário e cria uma sessão
 * Cada nome terá seus próprios hábitos salvos localmente
 * @param {string} nome - Nome do usuário
 * @returns {Promise<void>}
 */
export const salvarNomeUsuario = async (nome) => {
  try {
    const nomeNormalizado = nome.trim();
    const usuario = {
      nome: nomeNormalizado,
      dataEntrada: new Date().toISOString(),
      ultimoAcesso: new Date().toISOString()
    };
    
    // Salva a sessão
    await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(usuario));
    console.log('✅ Nome do usuário salvo:', nomeNormalizado);
  } catch (e) {
    console.error("❌ Erro ao salvar nome:", e);
    throw e;
  }
};

// Funções antigas de login/cadastro removidas - sistema agora usa apenas nome de usuário

/**
 * Retorna o usuário logado (apenas nome)
 * @returns {Promise<{nome: string} | null>}
 */
export const getUsuarioLogado = async () => {
  try {
    const json = await AsyncStorage.getItem(KEY_SESSION);
    if (json) {
      const usuario = JSON.parse(json);
      // Atualiza último acesso
      usuario.ultimoAcesso = new Date().toISOString();
      await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(usuario));
      return usuario;
    }
    return null;
  } catch (e) {
    console.error("Erro ao buscar usuário logado:", e);
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

// --- FUNÇÕES DE HÁBITOS (SALVOS POR NOME DE USUÁRIO) ---

/**
 * Obtém a chave de hábitos do usuário atual
 * @param {string} nomeUsuario - Nome do usuário (opcional, busca da sessão se não fornecido)
 * @returns {Promise<string>}
 */
const getChaveHabitosUsuario = async (nomeUsuario = null) => {
  let nome = nomeUsuario;
  if (!nome) {
    const usuario = await getUsuarioLogado();
    nome = usuario?.nome || 'default';
  }
  if (!nome || nome === 'default') {
    console.warn('⚠️ Nenhum usuário logado, usando chave padrão');
  }
  return getKeyHabitos(nome);
};

/**
 * Retorna todos os hábitos do usuário atual
 * Cada nome de usuário tem seus próprios hábitos salvos
 * @returns {Promise<Array>}
 */
export const getHabitos = async () => {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario || !usuario.nome) {
      console.warn('⚠️ Nenhum usuário logado, retornando lista vazia');
      return [];
    }
    const chave = getKeyHabitos(usuario.nome);
    const dados = await AsyncStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (e) {
    console.error("Erro ao buscar hábitos:", e);
    return [];
  }
};

/**
 * Salva um hábito (cria ou atualiza)
 * @param {Object} novoHabito - Objeto do hábito
 * @returns {Promise<boolean>}
 */
export const saveHabito = async (novoHabito) => {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario || !usuario.nome) {
      console.error('❌ Nenhum usuário logado para salvar hábito');
      return false;
    }
    const chave = getKeyHabitos(usuario.nome);
    const habitos = await getHabitos();
    const index = habitos.findIndex(h => h.id === novoHabito.id);
    let novaLista = index !== -1 
      ? habitos.map(h => h.id === novoHabito.id ? novoHabito : h) 
      : [...habitos, novoHabito];
    await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
    return true;
  } catch (e) {
    console.error("Erro ao salvar hábito:", e);
    return false;
  }
};

/**
 * Deleta um hábito
 * @param {string} id - ID do hábito
 * @returns {Promise<boolean>}
 */
export const deleteHabito = async (id) => {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario || !usuario.nome) {
      console.error('❌ Nenhum usuário logado para deletar hábito');
      return false;
    }
    const chave = getKeyHabitos(usuario.nome);
    const habitos = await getHabitos();
    const nova = habitos.filter(h => h.id !== id);
    await AsyncStorage.setItem(chave, JSON.stringify(nova));
    return true;
  } catch (e) {
    console.error("Erro ao deletar hábito:", e);
    return false;
  }
};

/**
 * Alterna o status de conclusão de um hábito
 * @param {string} id - ID do hábito
 * @returns {Promise<Array>}
 */
export const toggleHabitoStatus = async (id) => {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario || !usuario.nome) {
      console.error('❌ Nenhum usuário logado para alternar status');
      return [];
    }
    const chave = getKeyHabitos(usuario.nome);
    const habitos = await getHabitos();
    const nova = habitos.map(h => h.id === id ? { ...h, concluido: !h.concluido } : h);
    await AsyncStorage.setItem(chave, JSON.stringify(nova));
    return nova;
  } catch (e) {
    console.error("Erro ao alternar status:", e);
    return [];
  }
};

// --- FUNÇÕES DE ADMIN (SIMPLIFICADAS) ---

/**
 * Retorna todos os nomes de usuários que já usaram o app neste dispositivo
 * Busca todas as chaves de hábitos no AsyncStorage
 * @returns {Promise<Array>}
 */
export const getTodosUsuarios = async () => {
  try {
    // Busca todas as chaves do AsyncStorage
    const todasChaves = await AsyncStorage.getAllKeys();
    const chavesHabitos = todasChaves.filter(chave => chave.startsWith('@meu_diario_habitos_'));
    
    // Extrai os nomes dos usuários das chaves
    const nomesUsuarios = chavesHabitos.map(chave => {
      return chave.replace('@meu_diario_habitos_', '');
    });
    
    // Para cada nome, busca os hábitos para contar
    const usuarios = await Promise.all(nomesUsuarios.map(async (nome) => {
      const chave = getKeyHabitos(nome);
      const habitosJson = await AsyncStorage.getItem(chave);
      const habitos = habitosJson ? JSON.parse(habitosJson) : [];
      
      return {
        nome: nome,
        totalHabitos: habitos.length,
        habitosConcluidos: habitos.filter(h => h.concluido).length,
        dataUltimoAcesso: new Date().toISOString() // Aproximação
      };
    }));
    
    return usuarios;
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
    const usuarios = await getTodosUsuarios();
    const habitos = await getHabitos();
    
    return {
      totalUsuarios: usuarios.length,
      totalHabitos: habitos.length,
      usuariosAtivos: usuarios.length // Todos são considerados ativos no sistema simplificado
    };
  } catch (e) {
    console.error("Erro ao buscar estatísticas:", e);
    return { totalUsuarios: 0, totalHabitos: 0, usuariosAtivos: 0 };
  }
};

/**
 * Deleta todos os dados de um usuário (hábitos)
 * @param {string} nome - Nome do usuário a ser deletado
 * @returns {Promise<boolean>}
 */
export const deletarUsuario = async (nome) => {
  try {
    const chave = getKeyHabitos(nome);
    await AsyncStorage.removeItem(chave);
    return true;
  } catch (e) {
    console.error("Erro ao deletar usuário:", e);
    return false;
  }
};