// 血压分类函数
export const getBloodPressureCategory = (systolic, diastolic) => {
  if (systolic < 120 && diastolic < 80) {
    return 'normal';
  } else if ((systolic >= 120 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return 'elevated';
  } else if ((systolic >= 140 && systolic <= 159) || (diastolic >= 90 && diastolic <= 99)) {
    return 'stage1';
  } else if ((systolic >= 160 && systolic <= 179) || (diastolic >= 100 && diastolic <= 109)) {
    return 'stage2';
  } else if (systolic >= 180 || diastolic >= 110) {
    return 'stage3';
  }
  return 'normal';
};

// 获取分类标签
export const getCategoryLabel = (category) => {
  const labels = {
    normal: '正常血压',
    elevated: '正常高值',
    stage1: '1级高血压',
    stage2: '2级高血压',
    stage3: '3级高血压'
  };
  return labels[category] || '未知';
};

// 获取分类颜色样式
export const getCategoryColor = (category) => {
  const colors = {
    normal: 'text-green-700 bg-green-100 border-green-200',
    elevated: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    stage1: 'text-orange-700 bg-orange-100 border-orange-200',
    stage2: 'text-red-700 bg-red-100 border-red-200',
    stage3: 'text-red-800 bg-red-200 border-red-300'
  };
  return colors[category] || 'text-gray-700 bg-gray-100 border-gray-200';
};

// 获取血压建议
export const getBloodPressureAdvice = (category) => {
  const advice = {
    normal: '血压正常，继续保持健康的生活方式。',
    elevated: '血压略高，建议调整生活方式，增加运动，控制饮食。',
    stage1: '轻度高血压，建议就医咨询，可能需要药物治疗。',
    stage2: '中度高血压，需要积极药物治疗和生活方式干预。',
    stage3: '重度高血压，需要紧急医疗干预。'
  };
  return advice[category] || '请咨询医生。';
};
