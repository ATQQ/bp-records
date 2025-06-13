import { useState } from 'react';
import { Trash2, RotateCcw, X, Calendar, Clock, Heart, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBloodPressureStore } from '@/hooks/useBloodPressureStore';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { getCategoryColor, getCategoryLabel } from '@/utils/bloodPressureUtils';

const RecycleBin = () => {
  const { deletedRecords, restoreRecord, permanentDeleteRecord, cleanupDeletedRecords, isLoading } = useBloodPressureStore();
  const [processingId, setProcessingId] = useState(null);

  const handleRestore = async (id) => {
    setProcessingId(id);
    try {
      await restoreRecord(id);
    } catch (error) {
      console.error('恢复记录失败:', error);
      alert('恢复失败，请重试');
    } finally {
      setProcessingId(null);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!confirm('确定要永久删除这条记录吗？此操作无法撤销！')) {
      return;
    }

    setProcessingId(id);
    try {
      await permanentDeleteRecord(id);
    } catch (error) {
      console.error('永久删除记录失败:', error);
      alert('删除失败，请重试');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCleanup = async () => {
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

  if (isLoading && deletedRecords.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5 text-gray-500" />
            <span>回收站</span>
          </CardTitle>
          <CardDescription>
            已删除的血压记录，可以恢复或永久删除
          </CardDescription>
        </CardHeader>
      </Card>

      {deletedRecords.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  共有 {deletedRecords.length} 条已删除记录
                </span>
              </div>
              <Button
                onClick={handleCleanup}
                variant="outline"
                size="sm"
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              >
                清理30天前记录
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {deletedRecords.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Trash2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">回收站为空</p>
            <p className="text-sm text-gray-400">没有已删除的记录</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {deletedRecords.map((record) => (
            <Card key={record.id} className="overflow-hidden border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="text-lg font-semibold text-gray-700">
                        {record.systolic}/{record.diastolic}
                        <span className="text-sm text-gray-500 ml-1">mmHg</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(record.category)}`}>
                        {getCategoryLabel(record.category)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(record.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(record.timestamp)}</span>
                      </div>
                      {record.pulse && (
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{record.pulse} bpm</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-red-600 mb-2">
                      删除时间: {formatDate(record.deleted_at)} {formatTime(record.deleted_at)}
                    </div>

                    {record.note && (
                      <div className="text-sm text-gray-600 bg-white rounded p-2 border">
                        {record.note}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(record.id)}
                      disabled={processingId === record.id}
                      className="h-8 px-3 text-green-600 border-green-300 hover:bg-green-50"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      恢复
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePermanentDelete(record.id)}
                      disabled={processingId === record.id}
                      className="h-8 px-3 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="h-3 w-3 mr-1" />
                      永久删除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecycleBin;
