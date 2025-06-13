import { Database, HardDrive, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DataStorageInfo = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-500" />
            <span>数据存储位置</span>
          </CardTitle>
          <CardDescription>
            了解您的血压数据存储在哪里
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900">
            <HardDrive className="h-5 w-5" />
            <span>本地浏览器存储</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">存储方式</h4>
              <p className="text-sm text-blue-800">
                您的血压数据使用浏览器的 <code className="bg-blue-100 px-1 rounded">localStorage</code> 技术存储在您的设备本地。
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">存储位置</h4>
              <p className="text-sm text-blue-800 mb-2">
                数据存储在您当前使用的浏览器中，具体位置：
              </p>
              <ul className="text-sm text-blue-700 space-y-1 ml-4">
                <li>• 存储键名：<code className="bg-blue-100 px-1 rounded">bloodPressureRecords</code></li>
                <li>• 存储格式：JSON 格式</li>
                <li>• 存储容量：通常可存储数千条记录</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">数据安全性</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm text-blue-800">数据完全存储在您的设备上，不会上传到服务器</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm text-blue-800">只有您可以访问这些数据</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm text-blue-800">数据不会被第三方收集或分析</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-900">
            <Smartphone className="h-5 w-5" />
            <span>重要提醒</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">数据备份建议</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• 定期截图保存重要数据</li>
                <li>• 可以手动记录关键血压数值</li>
                <li>• 重要数据建议同时记录在纸质记录本上</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">数据丢失情况</h4>
              <p className="text-sm text-yellow-800 mb-2">
                以下情况可能导致数据丢失：
              </p>
              <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                <li>• 清除浏览器数据/缓存</li>
                <li>• 卸载或重装浏览器</li>
                <li>• 更换设备</li>
                <li>• 使用隐私模式/无痕模式</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">跨设备同步</h4>
              <p className="text-sm text-yellow-800">
                由于数据存储在本地，不同设备间的数据不会自动同步。如需在多个设备上使用，需要分别在每个设备上记录数据。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">技术实现详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">代码实现</h4>
            <p className="text-sm text-gray-700 mb-2">
              数据存储通过 <code className="bg-gray-200 px-1 rounded">useBloodPressureStore</code> 自定义 Hook 实现：
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• 使用 <code className="bg-gray-200 px-1 rounded">localStorage.setItem()</code> 保存数据</li>
              <li>• 使用 <code className="bg-gray-200 px-1 rounded">localStorage.getItem()</code> 读取数据</li>
              <li>• 数据格式化为 JSON 字符串存储</li>
              <li>• 应用启动时自动加载本地数据</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataStorageInfo;
