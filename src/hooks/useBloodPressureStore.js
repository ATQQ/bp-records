import { useState, useEffect } from 'react';
import { useStorageConfig } from './useStorageConfig';
import { SupabaseStorageService } from '@/services/supabaseStorage';

const LOCAL_STORAGE_KEY = 'bloodPressureRecords';
const LOCAL_DELETED_KEY = 'bloodPressureDeletedRecords';

export const useBloodPressureStore = () => {
  const { config } = useStorageConfig();
  const [records, setRecords] = useState([]);
  const [deletedRecords, setDeletedRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supabaseService, setSupabaseService] = useState(null);

  // 初始化存储服务
  useEffect(() => {
    if (config.storageType === 'supabase' && config.supabaseUrl && config.supabaseKey && config.username) {
      try {
        const service = new SupabaseStorageService(config.supabaseUrl, config.supabaseKey, config.username);
        setSupabaseService(service);
      } catch (error) {
        console.error('初始化 Supabase 服务失败:', error);
        setError('Supabase 配置错误');
      }
    } else {
      setSupabaseService(null);
    }
  }, [config]);

  // 加载数据
  useEffect(() => {
    loadRecords();
  }, [config, supabaseService]);

  // 从存储加载数据
  const loadRecords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.storageType === 'supabase' && supabaseService) {
        const data = await supabaseService.getRecords();
        setRecords(data);
        // 同时加载已删除的记录
        const deletedData = await supabaseService.getDeletedRecords();
        setDeletedRecords(deletedData);
      } else {
        // 本地存储
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsedRecords = JSON.parse(stored);
          // 过滤掉已软删除的记录
          const activeRecords = parsedRecords.filter(record => !record.deleted_at);
          setRecords(activeRecords);
        } else {
          setRecords([]);
        }

        // 加载本地已删除的记录
        const deletedStored = localStorage.getItem(LOCAL_DELETED_KEY);
        if (deletedStored) {
          const parsedDeletedRecords = JSON.parse(deletedStored);
          setDeletedRecords(parsedDeletedRecords);
        } else {
          setDeletedRecords([]);
        }
      }
    } catch (error) {
      console.error('加载血压记录失败:', error);
      setError('加载数据失败');
      setRecords([]);
      setDeletedRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 保存数据到本地存储
  const saveToLocalStorage = (newRecords, newDeletedRecords = null) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecords));
      if (newDeletedRecords !== null) {
        localStorage.setItem(LOCAL_DELETED_KEY, JSON.stringify(newDeletedRecords));
      }
    } catch (error) {
      console.error('保存血压记录到本地失败:', error);
      throw error;
    }
  };

  // 添加记录
  const addRecord = async (record) => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.storageType === 'supabase' && supabaseService) {
        const newRecord = await supabaseService.addRecord(record);
        setRecords(prev => [newRecord, ...prev]);
      } else {
        // 本地存储
        const recordWithoutDeletedAt = { ...record, deleted_at: null };
        const newRecords = [recordWithoutDeletedAt, ...records];
        setRecords(newRecords);
        saveToLocalStorage(newRecords);
      }
    } catch (error) {
      console.error('添加血压记录失败:', error);
      setError('添加记录失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 软删除记录
  const deleteRecord = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.storageType === 'supabase' && supabaseService) {
        const deletedRecord = await supabaseService.deleteRecord(id);
        setRecords(prev => prev.filter(record => record.id !== id));
        setDeletedRecords(prev => [deletedRecord, ...prev]);
      } else {
        // 本地存储软删除
        const recordToDelete = records.find(record => record.id === id);
        if (recordToDelete) {
          const deletedRecord = {
            ...recordToDelete,
            deleted_at: new Date().toISOString()
          };

          const newRecords = records.filter(record => record.id !== id);
          const newDeletedRecords = [deletedRecord, ...deletedRecords];

          setRecords(newRecords);
          setDeletedRecords(newDeletedRecords);
          saveToLocalStorage(newRecords, newDeletedRecords);
        }
      }
    } catch (error) {
      console.error('删除血压记录失败:', error);
      setError('删除记录失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 恢复已删除的记录
  const restoreRecord = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.storageType === 'supabase' && supabaseService) {
        const restoredRecord = await supabaseService.restoreRecord(id);
        setDeletedRecords(prev => prev.filter(record => record.id !== id));
        setRecords(prev => [restoredRecord, ...prev]);
      } else {
        // 本地存储恢复
        const recordToRestore = deletedRecords.find(record => record.id === id);
        if (recordToRestore) {
          const restoredRecord = {
            ...recordToRestore,
            deleted_at: null
          };

          const newDeletedRecords = deletedRecords.filter(record => record.id !== id);
          const newRecords = [restoredRecord, ...records];

          setDeletedRecords(newDeletedRecords);
          setRecords(newRecords);
          saveToLocalStorage(newRecords, newDeletedRecords);
        }
      }
    } catch (error) {
      console.error('恢复血压记录失败:', error);
      setError('恢复记录失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 永久删除记录
  const permanentDeleteRecord = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.storageType === 'supabase' && supabaseService) {
        await supabaseService.permanentDeleteRecord(id);
        setDeletedRecords(prev => prev.filter(record => record.id !== id));
      } else {
        // 本地存储永久删除
        const newDeletedRecords = deletedRecords.filter(record => record.id !== id);
        setDeletedRecords(newDeletedRecords);
        saveToLocalStorage(records, newDeletedRecords);
      }
    } catch (error) {
      console.error('永久删除血压记录失败:', error);
      setError('永久删除记录失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 更新记录
  const updateRecord = async (id, updatedRecord) => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.storageType === 'supabase' && supabaseService) {
        const updated = await supabaseService.updateRecord(id, updatedRecord);
        setRecords(prev => prev.map(record =>
          record.id === id ? updated : record
        ));
      } else {
        // 本地存储
        const newRecords = records.map(record =>
          record.id === id ? { ...record, ...updatedRecord } : record
        );
        setRecords(newRecords);
        saveToLocalStorage(newRecords);
      }
    } catch (error) {
      console.error('更新血压记录失败:', error);
      setError('更新记录失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 软删除所有记录
  const clearAllRecords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.storageType === 'supabase' && supabaseService) {
        await supabaseService.clearAllRecords();
        const allDeletedRecords = records.map(record => ({
          ...record,
          deleted_at: new Date().toISOString()
        }));
        setDeletedRecords(prev => [...allDeletedRecords, ...prev]);
        setRecords([]);
      } else {
        // 本地存储软删除所有
        const allDeletedRecords = records.map(record => ({
          ...record,
          deleted_at: new Date().toISOString()
        }));
        const newDeletedRecords = [...allDeletedRecords, ...deletedRecords];
        setRecords([]);
        setDeletedRecords(newDeletedRecords);
        saveToLocalStorage([], newDeletedRecords);
      }
    } catch (error) {
      console.error('清空血压记录失败:', error);
      setError('清空记录失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 永久删除所有记录
  const permanentClearAllRecords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.storageType === 'supabase' && supabaseService) {
        await supabaseService.permanentClearAllRecords();
        setRecords([]);
        setDeletedRecords([]);
      } else {
        // 本地存储永久删除所有
        setRecords([]);
        setDeletedRecords([]);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_DELETED_KEY);
      }
    } catch (error) {
      console.error('永久清空血压记录失败:', error);
      setError('永久清空记录失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 清理已删除的记录
  const cleanupDeletedRecords = async (daysOld = 30) => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.storageType === 'supabase' && supabaseService) {
        await supabaseService.cleanupDeletedRecords(daysOld);
        // 重新加载已删除的记录
        const deletedData = await supabaseService.getDeletedRecords();
        setDeletedRecords(deletedData);
      } else {
        // 本地存储清理
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const filteredDeletedRecords = deletedRecords.filter(record => {
          const deletedAt = new Date(record.deleted_at);
          return deletedAt > cutoffDate;
        });

        setDeletedRecords(filteredDeletedRecords);
        saveToLocalStorage(records, filteredDeletedRecords);
      }
    } catch (error) {
      console.error('清理已删除记录失败:', error);
      setError('清理记录失败');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 测试 Supabase 连接 - 使用最新配置创建临时服务
  const testSupabaseConnection = async () => {
    if (!config.supabaseUrl || !config.supabaseKey || !config.username) {
      throw new Error('Supabase 配置不完整');
    }

    console.log('testSupabaseConnection', config);
    
    try {
      // 使用最新配置创建临时服务进行测试
      const testService = new SupabaseStorageService(config.supabaseUrl, config.supabaseKey, config.username);
      await testService.testConnection();
      return true;
    } catch (error) {
      console.error('Supabase 连接测试失败:', error);
      throw error;
    }
  };

  return {
    records,
    deletedRecords,
    isLoading,
    error,
    addRecord,
    deleteRecord,
    restoreRecord,
    permanentDeleteRecord,
    updateRecord,
    clearAllRecords,
    permanentClearAllRecords,
    cleanupDeletedRecords,
    loadRecords,
    testSupabaseConnection,
  };
};
