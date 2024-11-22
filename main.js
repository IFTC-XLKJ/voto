const express = require('express');
const app = express();
const port = 3000;

// 定义一个简单的路由
app.get('/', (req, res) => {
    res.json({ code: 200, msg: '连接成功' });
});

// 创建一个API端点
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from API!' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});