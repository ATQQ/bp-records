import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatTime } from '@/utils/dateUtils';

const DeleteConfirmDialog = ({ isOpen, onConfirm, onCancel, record }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>确认删除</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              您确定要删除这条血压记录吗？此操作无法撤销。
            </p>
            
            {/* 显示要删除的记录信息 */}
            <div className="bg-gray-50 rounded-lg p-3 border">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">血压值:</span>
                  <span className="font-medium">
                    {record.systolic}/{record.diastolic} mmHg
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">记录时间:</span>
                  <span className="text-sm">
                    {formatDate(record.timestamp)} {formatTime(record.timestamp)}
                  </span>
                </div>
                {record.pulse && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">心率:</span>
                    <span className="text-sm">{record.pulse} bpm</span>
                  </div>
                )}
                {record.note && (
                  <div className="space-y-1">
                    <span className="text-sm text-gray-600">备注:</span>
                    <div className="text-sm bg-white rounded p-2 border">
                      {record.note}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                className="flex-1"
              >
                确认删除
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteConfirmDialog;
