const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const btnText = loginBtn.querySelector('.btn-text');
const btnLoading = loginBtn.querySelector('.btn-loading');
const errorMessage = document.getElementById('errorMessage');
const rememberMe = document.getElementById('rememberMe');

const eyeIcon = togglePassword.querySelector('.eye-icon');
const eyeOffIcon = togglePassword.querySelector('.eye-off-icon');

const savedUsername = localStorage.getItem('admin_username');
if (savedUsername) {
    usernameInput.value = savedUsername;
    rememberMe.checked = true;
}

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    if (type === 'text') {
        eyeIcon.style.display = 'none';
        eyeOffIcon.style.display = 'block';
    } else {
        eyeIcon.style.display = 'block';
        eyeOffIcon.style.display = 'none';
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

function setLoading(loading) {
    loginBtn.disabled = loading;
    btnText.style.display = loading ? 'none' : 'block';
    btnLoading.style.display = loading ? 'block' : 'none';
}

async function login(username, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'admin' && password === '123456') {
                resolve({ success: true, token: 'mock_token_' + Date.now() });
            } else {
                reject(new Error('账号或密码错误'));
            }
        }, 1000);
    });
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
        showError('请输入账号');
        usernameInput.focus();
        return;
    }

    if (!password) {
        showError('请输入密码');
        passwordInput.focus();
        return;
    }

    setLoading(true);

    try {
        const result = await login(username, password);
        
        if (result.success) {
            sessionStorage.setItem('admin_token', result.token);
            sessionStorage.setItem('admin_username', username);
            
            if (rememberMe.checked) {
                localStorage.setItem('admin_username', username);
            } else {
                localStorage.removeItem('admin_username');
            }
            
            window.location.href = 'index.html';
        }
    } catch (error) {
        showError(error.message);
        passwordInput.value = '';
        passwordInput.focus();
    } finally {
        setLoading(false);
    }
});

usernameInput.addEventListener('input', hideError);
passwordInput.addEventListener('input', hideError);

const savedTheme = localStorage.getItem('admin-theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}