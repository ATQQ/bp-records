import { useState } from 'react';
import { Plus, Heart, BookOpen, TrendingUp, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BloodPressureForm from '@/components/BloodPressureForm';
import BloodPressureList from '@/components/BloodPressureList';
import BloodPressureEducation from '@/components/BloodPressureEducation';
import BloodPressureStats from '@/components/BloodPressureStats';
import StorageSettings from '@/components/StorageSettings';
import RecycleBin from '@/components/RecycleBin';

const Index = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'day', 'month'

  const tabs = [
    { id: 'records', label: '记录', icon: Heart },
    { id: 'stats', label: '统计', icon: TrendingUp },
    { id: 'education', label: '科普', icon: BookOpen },
    { id: 'recycle', label: '回收站', icon: Trash2 },
    { id: 'settings', label: '设置', icon: Settings },
  ];

  const handleRecordAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <h1 className="text-xl font-bold text-gray-900">血压管家</h1>
            </div>
            {activeTab === 'records' && (
              <Button
                onClick={() => setShowForm(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                记录
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'records' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">血压记录</CardTitle>
                <CardDescription>
                  记录您的血压数据，追踪健康状况
                </CardDescription>
              </CardHeader>
            </Card>
            <BloodPressureList 
              refreshTrigger={refreshTrigger} 
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <BloodPressureStats 
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
        )}
        {activeTab === 'education' && <BloodPressureEducation />}
        {activeTab === 'recycle' && <RecycleBin />}
        {activeTab === 'settings' && <StorageSettings />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <BloodPressureForm 
          onClose={() => setShowForm(false)} 
          onRecordAdded={handleRecordAdded}
        />
      )}
    </div>
  );
};

export default Index;
