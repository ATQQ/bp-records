import { initializeSupabase, getSupabaseClient } from '@/utils/supabase';

export class SupabaseStorageService {
  constructor(url, key, username) {
    this.username = username;
    this.client = initializeSupabase(url, key);
  }

  // 获取用户的所有未删除记录
  async getRecords() {
    try {
      const { data, error } = await this.client
        .from('blood_pressure_records')
        .select('*')
        .eq('username', this.username)
        .is('deleted_at', null)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 获取用户的所有记录（包括已删除的）
  async getAllRecords() {
    try {
      const { data, error } = await this.client
        .from('blood_pressure_records')
        .select('*')
        .eq('username', this.username)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取所有 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 获取用户的已删除记录
  async getDeletedRecords() {
    try {
      const { data, error } = await this.client
        .from('blood_pressure_records')
        .select('*')
        .eq('username', this.username)
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取已删除 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 添加记录
  async addRecord(record) {
    try {
      // 确保记录包含用户名和正确的时间戳格式
      const recordWithUser = {
        id: record.id,
        username: this.username,
        systolic: record.systolic,
        diastolic: record.diastolic,
        pulse: record.pulse,
        note: record.note || '',
        timestamp: record.timestamp,
        category: record.category,
        deleted_at: null,
      };

      const { data, error } = await this.client
        .from('blood_pressure_records')
        .insert([recordWithUser])
        .select()
        .single();

      if (error) {
        console.error('Supabase 插入错误:', error);
        throw new Error(`数据库插入失败: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('添加 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 软删除记录
  async deleteRecord(id) {
    try {
      const { data, error } = await this.client
        .from('blood_pressure_records')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('username', this.username)
        .is('deleted_at', null)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('软删除 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 恢复已删除的记录
  async restoreRecord(id) {
    try {
      const { data, error } = await this.client
        .from('blood_pressure_records')
        .update({ deleted_at: null })
        .eq('id', id)
        .eq('username', this.username)
        .not('deleted_at', 'is', null)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('恢复 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 永久删除记录
  async permanentDeleteRecord(id) {
    try {
      const { error } = await this.client
        .from('blood_pressure_records')
        .delete()
        .eq('id', id)
        .eq('username', this.username);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('永久删除 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 更新记录
  async updateRecord(id, updatedRecord) {
    try {
      const { data, error } = await this.client
        .from('blood_pressure_records')
        .update(updatedRecord)
        .eq('id', id)
        .eq('username', this.username)
        .is('deleted_at', null)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('更新 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 软删除用户的所有记录
  async clearAllRecords() {
    try {
      const { error } = await this.client
        .from('blood_pressure_records')
        .update({ deleted_at: new Date().toISOString() })
        .eq('username', this.username)
        .is('deleted_at', null);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('软删除所有 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 永久删除用户的所有记录
  async permanentClearAllRecords() {
    try {
      const { error } = await this.client
        .from('blood_pressure_records')
        .delete()
        .eq('username', this.username);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('永久删除所有 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 清理已删除的记录（永久删除超过指定天数的软删除记录）
  async cleanupDeletedRecords(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error } = await this.client
        .from('blood_pressure_records')
        .delete()
        .eq('username', this.username)
        .not('deleted_at', 'is', null)
        .lt('deleted_at', cutoffDate.toISOString());

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('清理已删除 Supabase 记录失败:', error);
      throw error;
    }
  }

  // 测试连接
  async testConnection() {
    try {
      const { data, error } = await this.client
        .from('blood_pressure_records')
        .select('count')
        .eq('username', this.username)
        .limit(1);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Supabase 连接测试失败:', error);
      throw error;
    }
  }
}
