import { useState } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBloodPressureStore } from '@/hooks/useBloodPressureStore';
import { getBloodPressureCategory } from '@/utils/bloodPressureUtils';

const BloodPressureForm = ({ onClose, onRecordAdded }) => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [note, setNote] = useState('');
  const [recordTime, setRecordTime] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addRecord, error } = useBloodPressureStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!systolic || !diastolic) {
      alert('请输入收缩压和舒张压');
      return;
    }

    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);

    if (systolicNum < 50 || systolicNum > 250 || diastolicNum < 30 || diastolicNum > 150) {
      alert('血压数值超出正常范围，请检查输入');
      return;
    }

    if (!recordTime) {
      alert('请选择记录时间');
      return;
    }

    setIsSubmitting(true);

    const record = {
      id: Date.now().toString(),
      systolic: systolicNum,
      diastolic: diastolicNum,
      pulse: pulse ? parseInt(pulse) : null,
      note: note.trim(),
      timestamp: new Date(recordTime).toISOString(),
      category: getBloodPressureCategory(systolicNum, diastolicNum),
    };

    try {
      await addRecord(record);
      if (onRecordAdded) {
        onRecordAdded();
      }
      onClose();
    } catch (error) {
      console.error('保存记录失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">记录血压</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recordTime" className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>记录时间</span>
              </Label>
              <Input
                id="recordTime"
                type="datetime-local"
                value={recordTime}
                onChange={(e) => setRecordTime(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolic">收缩压 (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  min="50"
                  max="250"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">舒张压 (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  min="30"
                  max="150"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pulse">心率 (次/分钟)</Label>
              <Input
                id="pulse"
                type="number"
                placeholder="72"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                min="40"
                max="200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">备注</Label>
              <Input
                id="note"
                placeholder="运动后、服药前等"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodPressureForm;
