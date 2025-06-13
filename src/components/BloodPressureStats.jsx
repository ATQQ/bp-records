import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, BarChart3, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBloodPressureStore } from '@/hooks/useBloodPressureStore';
import { formatDate } from '@/utils/dateUtils';
import { getCategoryLabel, getCategoryColor } from '@/utils/bloodPressureUtils';

const BloodPressureStats = ({ dateFilter, onDateFilterChange }) => {
  const { records } = useBloodPressureStore();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

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

  const stats = useMemo(() => {
    if (filteredRecords.length === 0) return null;

    const sortedRecords = [...filteredRecords].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    const latest = sortedRecords[sortedRecords.length - 1];
    const previous = sortedRecords.length > 1 ? sortedRecords[sortedRecords.length - 2] : null;

    const systolicSum = filteredRecords.reduce((sum, r) => sum + r.systolic, 0);
    const diastolicSum = filteredRecords.reduce((sum, r) => sum + r.diastolic, 0);
    const avgSystolic = Math.round(systolicSum / filteredRecords.length);
    const avgDiastolic = Math.round(diastolicSum / filteredRecords.length);

    // 心率统计
    const recordsWithPulse = filteredRecords.filter(r => r.pulse);
    const pulseSum = recordsWithPulse.reduce((sum, r) => sum + r.pulse, 0);
    const avgPulse = recordsWithPulse.length > 0 ? Math.round(pulseSum / recordsWithPulse.length) : null;
    const maxPulse = recordsWithPulse.length > 0 ? Math.max(...recordsWithPulse.map(r => r.pulse)) : null;
    const minPulse = recordsWithPulse.length > 0 ? Math.min(...recordsWithPulse.map(r => r.pulse)) : null;

    const maxSystolic = Math.max(...filteredRecords.map(r => r.systolic));
    const minSystolic = Math.min(...filteredRecords.map(r => r.systolic));
    const maxDiastolic = Math.max(...filteredRecords.map(r => r.diastolic));
    const minDiastolic = Math.min(...filteredRecords.map(r => r.diastolic));

    const systolicTrend = previous ? latest.systolic - previous.systolic : 0;
    const diastolicTrend = previous ? latest.diastolic - previous.diastolic : 0;
    const pulseTrend = previous && latest.pulse && previous.pulse ? latest.pulse - previous.pulse : 0;

    const categoryCount = filteredRecords.reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + 1;
      return acc;
    }, {});

    // 修复图表数据格式，根据筛选类型调整横轴显示
    const chartData = sortedRecords.slice(-15).map((record, index) => {
      const date = new Date(record.timestamp);
      let xAxisLabel;
      
      if (dateFilter === 'day') {
        // 选择某一日时显示24小时制时间 HH:mm
        xAxisLabel = date.toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      } else {
        // 选择月份时显示日期 MM/dd
        xAxisLabel = formatDate(record.timestamp, 'MM/dd');
      }
      
      return {
        date: xAxisLabel,
        fullDate: formatDate(record.timestamp, 'yyyy-MM-dd'),
        fullTime: date.toLocaleTimeString('zh-CN', { hour12: false }),
        systolic: record.systolic,
        diastolic: record.diastolic,
        pulse: record.pulse || null,
        timestamp: record.timestamp,
        index: index
      };
    });

    return {
      latest,
      avgSystolic,
      avgDiastolic,
      avgPulse,
      maxSystolic,
      minSystolic,
      maxDiastolic,
      minDiastolic,
      maxPulse,
      minPulse,
      systolicTrend,
      diastolicTrend,
      pulseTrend,
      categoryCount,
      chartData,
      totalRecords: filteredRecords.length,
      pulseRecordsCount: recordsWithPulse.length
    };
  }, [filteredRecords, dateFilter]);

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
    if (value !== 'day') {
      setSelectedDate('');
    }
    if (value !== 'month') {
      setSelectedMonth('');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  if (!stats) {
    return (
      <div className="space-y-6 pb-20">
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
                  {getDateFilterLabel(dateFilter)} 0 条记录
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

        <Card>
          <CardContent className="py-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">{getDateFilterLabel(dateFilter)}暂无统计数据</p>
            <p className="text-sm text-gray-400">记录更多血压数据后查看统计</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const TrendIcon = ({ value }) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <div className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6 pb-20">
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
                {getDateFilterLabel(dateFilter)} {stats.totalRecords} 条记录
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span>血压统计</span>
          </CardTitle>
          <CardDescription>
            基于 {getDateFilterLabel(dateFilter)} {stats.totalRecords} 条记录的统计分析
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 最新记录 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">最新记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.latest.systolic}/{stats.latest.diastolic}
                <span className="text-sm text-gray-500 ml-1">mmHg</span>
              </div>
              {stats.latest.pulse && (
                <div className="text-lg text-gray-700 mt-1">
                  心率: {stats.latest.pulse} bpm
                </div>
              )}
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(stats.latest.category)}`}>
                {getCategoryLabel(stats.latest.category)}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(stats.latest.timestamp)}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <TrendIcon value={stats.systolicTrend} />
                    <span className={stats.systolicTrend > 0 ? 'text-red-500' : stats.systolicTrend < 0 ? 'text-green-500' : 'text-gray-500'}>
                      {stats.systolicTrend > 0 ? '+' : ''}{stats.systolicTrend}
                    </span>
                  </div>
                  <span className="text-gray-400">/</span>
                  <div className="flex items-center space-x-1">
                    <TrendIcon value={stats.diastolicTrend} />
                    <span className={stats.diastolicTrend > 0 ? 'text-red-500' : stats.diastolicTrend < 0 ? 'text-green-500' : 'text-gray-500'}>
                      {stats.diastolicTrend > 0 ? '+' : ''}{stats.diastolicTrend}
                    </span>
                  </div>
                </div>
                {stats.pulseTrend !== 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">心率:</span>
                    <TrendIcon value={stats.pulseTrend} />
                    <span className={stats.pulseTrend > 0 ? 'text-red-500' : stats.pulseTrend < 0 ? 'text-green-500' : 'text-gray-500'}>
                      {stats.pulseTrend > 0 ? '+' : ''}{stats.pulseTrend}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 统计数据 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">平均血压</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg font-semibold">
              {stats.avgSystolic}/{stats.avgDiastolic}
            </div>
            <div className="text-xs text-gray-500">mmHg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">平均心率</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg font-semibold">
              {stats.avgPulse ? stats.avgPulse : '--'}
            </div>
            <div className="text-xs text-gray-500">
              {stats.avgPulse ? 'bpm' : '暂无数据'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">收缩压范围</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg font-semibold">
              {stats.minSystolic}-{stats.maxSystolic}
            </div>
            <div className="text-xs text-gray-500">mmHg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">舒张压范围</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg font-semibold">
              {stats.minDiastolic}-{stats.maxDiastolic}
            </div>
            <div className="text-xs text-gray-500">mmHg</div>
          </CardContent>
        </Card>

        {stats.avgPulse && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">心率范围</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg font-semibold">
                  {stats.minPulse}-{stats.maxPulse}
                </div>
                <div className="text-xs text-gray-500">bpm</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">心率记录</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg font-semibold">{stats.pulseRecordsCount}</div>
                <div className="text-xs text-gray-500">
                  占总记录 {Math.round((stats.pulseRecordsCount / stats.totalRecords) * 100)}%
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 趋势图表 */}
      {stats.chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">血压心率趋势</CardTitle>
            <CardDescription>
              {dateFilter === 'day' ? '当日24小时趋势' : '最近15次测量记录'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                    interval={0}
                    angle={dateFilter === 'day' ? 0 : -45}
                    textAnchor={dateFilter === 'day' ? 'middle' : 'end'}
                    height={dateFilter === 'day' ? 40 : 60}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        const data = payload[0].payload;
                        if (dateFilter === 'day') {
                          return `时间: ${data.date}`;
                        } else {
                          return `日期: ${data.fullDate}`;
                        }
                      }
                      return `${dateFilter === 'day' ? '时间' : '日期'}: ${label}`;
                    }}
                    formatter={(value, name) => {
                      if (name === 'systolic') return [`${value} mmHg`, '收缩压'];
                      if (name === 'diastolic') return [`${value} mmHg`, '舒张压'];
                      if (name === 'pulse') return value ? [`${value} bpm`, '心率'] : ['--', '心率'];
                      return [value, name];
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="systolic" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    name="systolic"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="diastolic" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="diastolic"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pulse" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                    name="pulse"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>收缩压</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>舒张压</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>心率</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 分类统计 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">血压分类分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.categoryCount).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                  {getCategoryLabel(category)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{count} 次</span>
                  <span className="text-xs text-gray-500">
                    ({Math.round((count / stats.totalRecords) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodPressureStats;
