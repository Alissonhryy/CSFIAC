/**
 * Configurações gerais da aplicação
 */

export const appConfig = {
  name: 'CSF + Qualificação e Renda',
  version: '2.0.0',
  defaultUsers: [
    { 
      id: 'admin1', 
      name: 'Administrador', 
      username: 'Csfiac', 
      password: '032147', // TODO: Implementar hash de senha
      role: 'admin' 
    },
    { 
      id: 'editor1', 
      name: 'Editor', 
      username: 'Iac', 
      password: 'Iac@123', // TODO: Implementar hash de senha
      role: 'editor' 
    },
    { 
      id: 'viewer1', 
      name: 'Visualizador', 
      username: 'viewer', 
      password: 'viewer123', // TODO: Implementar hash de senha
      role: 'viewer' 
    }
  ],
  
  // Configurações de storage
  storageKeys: {
    cursos: 'cursos',
    instrutores: 'instrutores',
    usuarios: 'usuarios',
    activityLogs: 'activityLogs',
    auditLogs: 'auditLogs',
    hasSeenOnboarding: 'hasSeenOnboarding',
    pwaInstalled: 'pwaInstalled'
  },
  
  // Configurações de notificações
  notifications: {
    expiryDays: [30, 15, 7, 3, 1],
    checkInterval: 1000 * 60 * 60 // 1 hora
  },
  
  // Configurações de paginação
  pagination: {
    itemsPerPage: 20
  }
};

