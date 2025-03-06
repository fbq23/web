// 验证码相关
let captchaValue = '';
let captchaLength = 4; // 验证码长度

// 生成随机验证码
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < captchaLength; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    captchaValue = captcha;
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '30px Arial';
    ctx.fillText(captcha, 10, 30);
    // 添加干扰线
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * canvas.height);
    ctx.lineTo(canvas.width, Math.random() * canvas.height);
    ctx.stroke();
    document.getElementById('captchaImg').src = canvas.toDataURL('image/png');
}

// 刷新验证码
function refreshCaptcha() {
    generateCaptcha();
}

// 登录验证
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const userCaptcha = document.getElementById('captcha').value;

    // 基础信息验证
    if (!username || !password || !userCaptcha) {
        alert('请填写完整的信息');
        refreshCaptcha();
        return;
    }

    // 验证用户名、密码和验证码
    if (userCaptcha.toUpperCase() !== captchaValue.toUpperCase()) {
        alert('验证码错误');
        refreshCaptcha();
        return;
    }

    // 使用 AJAX 请求验证用户名和密码
    fetch('./pages/name.json') // 替换为你的 JSON 文件路径
        .then(response => response.json())
        .then(data => {
            const user = data.find(item => item.name === username && item.password === password);
            if (user) {
                alert('登录成功');
                window.location.href = 'http://127.0.0.1:5500/pages/index.html'; // 替换为实验一的网页路径
            } else {
                if (!data.some(item => item.name === username)) {
                    alert('用户名不存在');
                    refreshCaptcha();
                } else {
                    alert('密码错误');
                    refreshCaptcha();
                }
            }
        })
        .catch(error => {
            console.error('请求失败:', error);
            alert('登录失败，请稍后重试');
            refreshCaptcha();
        });
});

// 页面加载时生成验证码
generateCaptcha();

// 自动刷新验证码
setInterval(refreshCaptcha, 30000); // 每30秒自动刷新验证码