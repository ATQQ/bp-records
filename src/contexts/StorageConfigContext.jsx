import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_CONFIG_KEY = 'bloodPressureStorageConfig';

const StorageConfigContext = createContext();

export const StorageConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    storageType: 'local',
    supabaseUrl: '',
    supabaseKey: '',
    username: '',
  });

  // 从本地存储加载配置
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        setConfig(prev => ({ ...prev, ...parsedConfig }));
      }
    } catch (error) {
      console.error('加载存储配置失败:', error);
    }
  }, []);

  // 保存配置到本地存储
  const saveConfig = (newConfig) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(updatedConfig));
      return true;
    } catch (error) {
      console.error('保存存储配置失败:', error);
      return false;
    }
  };

  // 导出配置
  const exportConfig = () => {
    return JSON.stringify(config, null, 2);
  };

  // 导入配置
  const importConfig = (configString) => {
    try {
      const importedConfig = JSON.parse(configString);
      return saveConfig(importedConfig);
    } catch (error) {
      console.error('导入配置失败:', error);
      return false;
    }
  };

  // 重置配置
  const resetConfig = () => {
    const defaultConfig = {
      storageType: 'local',
      supabaseUrl: '',
      supabaseKey: '',
      username: '',
    };
    setConfig(defaultConfig);
    localStorage.removeItem(STORAGE_CONFIG_KEY);
  };

  const value = {
    config,
    saveConfig,
    exportConfig,
    importConfig,
    resetConfig,
  };

  return (
    <StorageConfigContext.Provider value={value}>
      {children}
    </StorageConfigContext.Provider>
  );
};

export const useStorageConfig = () => {
  const context = useContext(StorageConfigContext);
  if (context === undefined) {
    throw new Error('useStorageConfig must be used within a StorageConfigProvider');
  }
  return context;
};