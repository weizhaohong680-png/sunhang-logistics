const SENDKEY = 'SCT334813TKfVxQ9YFtcRZItWM4cbnjWIZ';

exports.handler = async (event, context) => {
  // 允许跨域
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // 只接受 POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // 解析表单数据
    const body = JSON.parse(event.body);
    const { name, company, email, phone, service, destination } = body;
    
    // 服务类型映射
    const serviceMap = {
      'air': '空运',
      'sea': '海运',
      'express': '国际快递',
      'ddp': 'DDP服务',
      'ecommerce': '跨境电商物流'
    };
    
    // 目的国映射
    const destMap = {
      'thailand': '泰国',
      'malaysia': '马来西亚',
      'singapore': '新加坡',
      'cambodia': '柬埔寨',
      'philippines': '菲律宾',
      'indonesia': '印尼',
      'vietnam': '越南',
      'myanmar': '缅甸'
    };
    
    // 构建消息内容
    const title = '📦 【新询价通知】';
    const content = `**姓名：** ${name || '-'}
**公司：** ${company || '未填写'}
**邮箱：** ${email || '-'}
**电话：** ${phone || '未填写'}
**服务类型：** ${serviceMap[service] || service}
**目的国：** ${destMap[destination] || destination}

⏰ 时间：${new Date().toLocaleString('zh-CN')}

---
🔗 请尽快联系客户！`;

    // 发送到 Server 酱
    const apiUrl = `https://sctapi.ftqq.com/${SENDKEY}.send`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        content: content,
        channel: 9
      })
    });

    const result = await response.json();

    // Server 酱成功返回 code: 0 或 200
    if (result.code !== 0 && result.code !== 200) {
      console.error('Server 酱错误:', result);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: result.message || '发送失败' 
        })
      };
    }

    // 成功
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: '询价已提交'
      })
    };

  } catch (error) {
    console.error('处理错误:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};
