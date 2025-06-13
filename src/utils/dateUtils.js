import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 格式化日期
export const formatDate = (dateString, formatStr = 'yyyy年MM月dd日') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr, { locale: zhCN });
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '无效日期';
  }
};

// 格式化时间
export const formatTime = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'HH:mm');
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '无效时间';
  }
};

// 格式化日期时间
export const formatDateTime = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  } catch (error) {
    console.error('日期时间格式化错误:', error);
    return '无效日期时间';
  }
};

// 获取相对时间描述
export const getRelativeTime = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小时前`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}天前`;
    
    return formatDate(dateString);
  } catch (error) {
    console.error('相对时间计算错误:', error);
    return '未知时间';
  }
};
