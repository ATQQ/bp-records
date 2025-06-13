import { useState } from 'react';
import { Database, HardDrive, Copy, Download, Upload, TestTube, Check, X, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useStorageConfig } from '@/hooks/useStorageConfig';
import { useBloodPressureStore } from '@/hooks/useBloodPressureStore';

const StorageSettings = () => {
  const { config, saveConfig, exportConfig, importConfig, resetConfig } = useStorageConfig();
  const { testSupabaseConnection, deletedRecords, cleanupDeletedRecords } = useBloodPressureStore();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState(null);
  const [importText, setImportText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  const handleStorageTypeChange = (value) => {
    saveConfig({ storageType: value });
  };

  const handleSupabaseConfigChange = (field, value) => {
    saveConfig({ [field]: value });
  };

  const handleTestConnection = async () => {
    if (!config.supabaseUrl || !config.supabaseKey || !config.username) {
      setConnectionTestResult({ success: false, message: '请填写完整的 Supabase 配置信息' });
      return;
    }

    setIsTestingConnection(true);
    setConnectionTestResult(null);

    try {
      await testSupabaseConnection();
      setConnectionTestResult({ success: true, message: '连接成功！' });
    } catch (error) {
      setConnectionTestResult({ 
        success: false, 
        message: `连接失败: ${error.message}` 
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleCopyConfig = async () => {
    try {
      const configText = exportConfig();
      await navigator.clipboard.writeText(configText);
      alert('配置已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制');
    }
  };

  const handleImportConfig = () => {
    if (!importText.trim()) {
      alert('请粘贴配置内容');
      return;
    }

    const success = importConfig(importText);
    if (success) {
      alert('配置导入成功');
      setImportText('');
      setShowImportArea(false);
    } else {
      alert('配置导入失败，请检查格式');
    }
  };

  const handleResetConfig = () => {
    if (confirm('确定要重置所有配置吗？这将清除您的 Supabase 配置信息。')) {
      resetConfig();
      setConnectionTestResult(null);
    }
  };

  const handleCleanupDeleted = async () => {
    if (!confirm('确定要清理30天前的已删除记录吗？这些记录将被永久删除！')) {
      return;
    }

    try {
      await cleanupDeletedRecords(30);
      alert('清理完成');
    } catch (error) {
      console.error('清理失败:', error);
      alert('清理失败，请重试');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <span>存储设置</span>
          </CardTitle>
          <CardDescription>
            选择数据存储方式并配置相关参数
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 存储方式选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">存储方式</CardTitle>
          <CardDescription>
            选择您希望如何存储血压数据
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={config.storageType} 
            onValueChange={handleStorageTypeChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="local" id="local" />
              <div className="flex-1">
                <Label htmlFor="local" className="flex items-center space-x-2 cursor-pointer">
                  <HardDrive className="h-4 w-4" />
                  <span className="font-medium">本地存储</span>
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  数据存储在浏览器本地，完全私密，但不支持跨设备同步
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="supabase" id="supabase" />
              <div className="flex-1">
                <Label htmlFor="supabase" className="flex items-center space-x-2 cursor-pointer">
                  <Database className="h-4 w-4" />
                  <span className="font-medium">Supabase 云存储</span>
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  数据存储在云端，支持跨设备同步，需要配置 Supabase 参数
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* 软删除管理 */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-900">
            <Trash2 className="h-5 w-5" />
            <span>数据删除管理</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            本应用采用软删除机制，保护您的数据安全
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">软删除机制</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 删除的记录不会立即消失，而是移动到回收站</li>
                <li>• 可以随时从回收站恢复误删的记录</li>
                <li>• 只有手动永久删除才会真正清除数据</li>
                <li>• 支持批量清理超过30天的已删除记录</li>
              </ul>
            </div>

            {deletedRecords.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">回收站状态</h4>
                    <p className="text-sm text-green-700">
                      当前有 {deletedRecords.length} 条已删除记录
                    </p>
                  </div>
                  <Button
                    onClick={handleCleanupDeleted}
                    variant="outline"
                    size="sm"
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    清理旧记录
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Supabase 配置 */}
      {config.storageType === 'supabase' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supabase 配置</CardTitle>
            <CardDescription>
              请填写您的 Supabase 项目信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabaseUrl">Supabase URL</Label>
              <Input
                id="supabaseUrl"
                type="url"
                placeholder="https://your-project.supabase.co"
                value={config.supabaseUrl}
                onChange={(e) => handleSupabaseConfigChange('supabaseUrl', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
              <Input
                id="supabaseKey"
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={config.supabaseKey}
                onChange={(e) => handleSupabaseConfigChange('supabaseKey', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="请输入您的用户名"
                value={config.username}
                onChange={(e) => handleSupabaseConfigChange('username', e.target.value)}
              />
              <p className="text-sm text-gray-600">
                用户名用于数据隔离，不同用户名的数据互不影响
              </p>
            </div>

            {/* 连接测试 */}
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 mb-3">
                <Button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !config.supabaseUrl || !config.supabaseKey || !config.username}
                  size="sm"
                  variant="outline"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {isTestingConnection ? '测试中...' : '测试连接'}
                </Button>
              </div>

              {connectionTestResult && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  connectionTestResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {connectionTestResult.success ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${
                    connectionTestResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {connectionTestResult.message}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 配置管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">配置管理</CardTitle>
          <CardDescription>
            导出、导入或重置您的配置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCopyConfig} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              复制配置
            </Button>
            
            <Button 
              onClick={() => setShowImportArea(!showImportArea)} 
              variant="outline" 
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              导入配置
            </Button>

            <Button onClick={handleResetConfig} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              重置配置
            </Button>
          </div>

          {showImportArea && (
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <Label htmlFor="importConfig">粘贴配置内容</Label>
              <Textarea
                id="importConfig"
                placeholder="请粘贴配置 JSON 内容..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={6}
              />
              <div className="flex space-x-2">
                <Button onClick={handleImportConfig} size="sm">
                  导入
                </Button>
                <Button 
                  onClick={() => {
                    setShowImportArea(false);
                    setImportText('');
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  取消
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 数据库建表说明 */}
      {config.storageType === 'supabase' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">数据库表结构</CardTitle>
            <CardDescription className="text-blue-700">
              如果您还没有创建数据表，请在 Supabase 中执行以下 SQL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
{`-- 创建血压记录表（支持软删除）
CREATE TABLE blood_pressure_records (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  systolic INTEGER NOT NULL,
  diastolic INTEGER NOT NULL,
  pulse INTEGER,
  note TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_blood_pressure_username ON blood_pressure_records(username);
CREATE INDEX idx_blood_pressure_timestamp ON blood_pressure_records(timestamp);
CREATE INDEX idx_blood_pressure_deleted_at ON blood_pressure_records(deleted_at);

-- 创建复合索引用于软删除查询
CREATE INDEX idx_blood_pressure_username_deleted ON blood_pressure_records(username, deleted_at);

-- 如果需要启用行级安全策略，请执行以下命令
-- 注意：启用后需要配置相应的策略，否则可能导致插入失败
-- ALTER TABLE blood_pressure_records ENABLE ROW LEVEL SECURITY;

-- 如果启用了行级安全策略，可以创建允许所有操作的策略（仅用于测试）
-- CREATE POLICY "允许所有操作" ON blood_pressure_records FOR ALL USING (true);`}
              </pre>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>重要提示：</strong> 软删除功能说明：
              </p>
              <ul className="text-sm text-yellow-700 mt-2 ml-4 space-y-1">
                <li>• deleted_at 字段为 NULL 表示记录未删除</li>
                <li>• deleted_at 字段有值表示记录已被软删除</li>
                <li>• 查询时通过 WHERE deleted_at IS NULL 过滤已删除记录</li>
                <li>• 可以通过设置 deleted_at = NULL 来恢复记录</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StorageSettings;
