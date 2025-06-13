import { useState, useRef, useMemo } from 'react';
import { Calendar, Clock, Heart, Trash2, RefreshCw, ChevronLeft, ChevronRight, Settings, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBloodPressureStore } from '@/hooks/useBloodPressureStore';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { getCategoryColor, getCategoryLabel } from '@/utils/bloodPressureUtils';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

const BloodPressureList = ({ refreshTrigger, dateFilter, onDateFilterChange }) => {
  const { records, deleteRecord, isLoading, error, loadRecords } = useBloodPressureStore();
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const prevRefreshTrigger = useRef(refreshTrigger);

  // 当刷新触发器改变时，重新加载数据
  if (refreshTrigger !== prevRefreshTrigger.current) {
    prevRefreshTrigger.current = refreshTrigger;
    loadRecords();
  }

  // 根据日期筛选过滤记录
  const filteredRecords = useMemo(() => {
    if (dateFilter === 'all') {
      return records;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return records.filter(record => {
      const recordDate = new Date(record.timestamp);
      
      if (dateFilter === 'day') {
        if (selectedDate) {
          const targetDate = new Date(selectedDate);
          const recordDay = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
          const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
          return recordDay.getTime() === targetDay.getTime();
        } else {
          const recordDay = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
          return recordDay.getTime() === today.getTime();
        }
      } else if (dateFilter === 'month') {
        if (selectedMonth) {
          const [year, month] = selectedMonth.split('-');
          const targetMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
          const nextMonth = new Date(parseInt(year), parseInt(month), 1);
          return recordDate >= targetMonth && recordDate < nextMonth;
        } else {
          return recordDate >= thisMonth;
        }
      }
      
      return true;
    });
  }, [records, dateFilter, selectedDate, selectedMonth]);

  const sortedRecords = [...filteredRecords].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  // 分页计算
  const totalPages = Math.ceil(sortedRecords.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRecords = sortedRecords.slice(startIndex, endIndex);

  // 当页面大小改变时重置到第一页
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1);
  };

  // 当记录数量变化时，确保当前页面有效
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    
    setDeletingId(recordToDelete.id);
    try {
      await deleteRecord(recordToDelete.id);
      // 如果删除后当前页没有记录且不是第一页，则回到上一页
      if (currentRecords.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      setDeletingId(null);
      setShowDeleteDialog(false);
      setRecordToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setRecordToDelete(null);
  };

  const handleRefresh = () => {
    loadRecords();
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getDateFilterLabel = (filter) => {
    switch (filter) {
      case 'day': 
        if (selectedDate) {
          return `${formatDate(selectedDate, 'MM月dd日')}`;
        }
        return '今日';
      case 'month': 
        if (selectedMonth) {
          const [year, month] = selectedMonth.split('-');
          return `${year}年${month}月`;
        }
        return '本月';
      default: return '全部';
    }
  };

  const handleDateFilterChange = (value) => {
    onDateFilterChange(value);
    setCurrentPage(1);
    if (value !== 'day') {
      setSelectedDate('');
    }
    if (value !== 'month') {
      setSelectedMonth('');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  if (isLoading && records.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">加载中...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && records.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="text-red-500 mb-4">
            <p className="mb-2">加载失败</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            重试
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">还没有血压记录</p>
          <p className="text-sm text-gray-400">点击右上角的"记录"按钮开始记录</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            重新加载
          </Button>
        </div>
      )}

      {/* 日期筛选 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">筛选:</span>
                <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                  <SelectTrigger className="w-20 h-8 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="day">指定日</SelectItem>
                    <SelectItem value="month">指定月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-blue-700">
                {getDateFilterLabel(dateFilter)} {filteredRecords.length} 条记录
              </div>
            </div>
            
            {/* 日期选择器 */}
            {dateFilter === 'day' && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="dateSelect" className="text-sm text-blue-900">选择日期:</Label>
                <Input
                  id="dateSelect"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-auto h-8 bg-white"
                />
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDateChange('')}
                    className="h-8 px-2 text-blue-600"
                  >
                    重置
                  </Button>
                )}
              </div>
            )}

            {/* 月份选择器 */}
            {dateFilter === 'month' && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="monthSelect" className="text-sm text-blue-900">选择月份:</Label>
                <Input
                  id="monthSelect"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="w-auto h-8 bg-white"
                />
                {selectedMonth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMonthChange('')}
                    className="h-8 px-2 text-blue-600"
                  >
                    重置
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 分页设置 */}
      {filteredRecords.length > 5 && (
        <Card className="bg-gray-50">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPageSettings(!showPageSettings)}
                  className="h-8 px-2"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  分页设置
                </Button>
                {showPageSettings && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">每页显示:</span>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                共 {filteredRecords.length} 条记录
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 记录列表 */}
      {currentRecords.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">{getDateFilterLabel(dateFilter)}没有记录</p>
            <p className="text-sm text-gray-400">尝试选择其他时间范围或添加新记录</p>
          </CardContent>
        </Card>
      ) : (
        currentRecords.map((record) => (
          <Card key={record.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="text-lg font-semibold text-gray-900">
                      {record.systolic}/{record.diastolic}
                      <span className="text-sm text-gray-500 ml-1">mmHg</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(record.category)}`}>
                      {getCategoryLabel(record.category)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
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

                  {record.note && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                      {record.note}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(record)}
                    disabled={deletingId === record.id}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {deletingId === record.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* 分页控件 */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                  {/* 显示页码 */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                第 {currentPage} 页，共 {totalPages} 页
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        record={recordToDelete}
      />
    </div>
  );
};

export default BloodPressureList;
