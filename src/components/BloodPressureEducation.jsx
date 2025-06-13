import { AlertTriangle, CheckCircle, Info, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BloodPressureEducation = () => {
  const categories = [
    {
      name: '正常血压',
      range: '< 120/80 mmHg',
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: CheckCircle,
      description: '血压处于理想范围，继续保持健康的生活方式。',
      tips: [
        '保持规律运动，每周至少150分钟中等强度运动',
        '维持健康体重，BMI控制在18.5-24之间',
        '限制钠盐摄入，每日不超过6克',
        '多吃新鲜蔬菜水果，保持均衡饮食'
      ]
    },
    {
      name: '正常高值',
      range: '120-139/80-89 mmHg',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      icon: Info,
      description: '血压略高于正常，需要注意生活方式调整。',
      tips: [
        '增加有氧运动，如快走、游泳、骑车',
        '减少高盐、高脂食物摄入',
        '戒烟限酒，避免过度饮酒',
        '学会放松技巧，减轻精神压力'
      ]
    },
    {
      name: '1级高血压',
      range: '140-159/90-99 mmHg',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      icon: AlertTriangle,
      description: '轻度高血压，建议就医咨询，可能需要药物治疗。',
      tips: [
        '定期监测血压，建议每日测量',
        '严格控制饮食，采用DASH饮食法',
        '规律服药，不可随意停药',
        '定期复查，调整治疗方案'
      ]
    },
    {
      name: '2级高血压',
      range: '160-179/100-109 mmHg',
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: AlertTriangle,
      description: '中度高血压，需要积极药物治疗和生活方式干预。',
      tips: [
        '立即就医，制定个性化治疗方案',
        '严格按医嘱服药，监测副作用',
        '密切监测血压变化',
        '控制并发症风险因素'
      ]
    },
    {
      name: '3级高血压',
      range: '≥ 180/110 mmHg',
      color: 'text-red-700 bg-red-100 border-red-300',
      icon: AlertTriangle,
      description: '重度高血压，需要紧急医疗干预。',
      tips: [
        '立即就医，可能需要住院治疗',
        '严格药物治疗，多种药物联合',
        '密切监测心脑血管并发症',
        '家属应学会急救知识'
      ]
    }
  ];

  const generalTips = [
    {
      title: '测量血压的最佳时间',
      content: '建议在早晨起床后1小时内和晚上睡前测量，每次测量2-3次，取平均值。'
    },
    {
      title: '测量前的准备',
      content: '测量前30分钟避免吸烟、饮咖啡，静坐休息5分钟，保持心情平静。'
    },
    {
      title: '正确的测量姿势',
      content: '坐位测量，上臂与心脏同高，袖带松紧适宜，能插入一指为宜。'
    },
    {
      title: '何时需要就医',
      content: '血压持续升高、出现头痛头晕、胸闷气短等症状时应及时就医。'
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>血压分级标准</span>
          </CardTitle>
          <CardDescription>
            了解不同血压水平的含义和应对措施
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card key={index} className={`border-2 ${category.color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span>{category.name}</span>
                  </CardTitle>
                  <span className="text-sm font-mono font-semibold">
                    {category.range}
                  </span>
                </div>
                <CardDescription className="text-sm">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">建议措施：</h4>
                  <ul className="space-y-1">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>血压测量小贴士</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {generalTips.map((tip, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-4">
              <h4 className="font-medium text-sm text-gray-900 mb-1">
                {tip.title}
              </h4>
              <p className="text-sm text-gray-600">
                {tip.content}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">重要提醒</h4>
              <p className="text-sm text-blue-800">
                本应用仅供记录和参考，不能替代专业医疗诊断。如有健康问题，请及时咨询医生。
                高血压是慢性疾病，需要长期管理和治疗。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodPressureEducation;
