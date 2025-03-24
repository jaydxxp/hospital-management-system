document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    // Check if user is already logged in
    checkAuthStatus();

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = '/dashboard.html';
            } else {
                showError(data.message);
            }
        } catch (error) {
            showError('An error occurred. Please try again.');
        }
    });

    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/check-auth');
            const data = await response.json();

            if (data.isAuthenticated) {
                window.location.href = '/dashboard.html';
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}); 