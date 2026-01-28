// Hardcoded credentials (SAST should find this)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const API_KEY = "sk-1234567890abcdef";
const DATABASE_URL = "mongodb://admin:SuperSecret123!@localhost:27017";

// Fake user database
const fakeUsers = {
    1: { id: 1, name: "Jan Kowalski", email: "jan@example.com", role: "user", salary: "5000 PLN" },
    2: { id: 2, name: "Anna Nowak", email: "anna@example.com", role: "user", salary: "6000 PLN" },
    3: { id: 3, name: "Admin", email: "admin@example.com", role: "admin", salary: "10000 PLN" }
};

// Page navigation
function showPage(pageId) {
    // Remove active class from all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Add active class to selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
}

// XSS Vulnerability - Intentionally insecure!
function executeXSS() {
    const input = document.getElementById('xss-input').value;
    const output = document.getElementById('xss-output');
    
    // VULNERABILITY: Direct innerHTML injection without sanitization
    output.innerHTML = "<p>Wyświetlam: " + input + "</p>";
    
    // This allows XSS attacks like: <img src=x onerror="alert('XSS!')">
}

// SQL Injection Simulation
function simulateSQL() {
    const input = document.getElementById('sql-input').value;
    const output = document.getElementById('sql-output');
    
    // VULNERABILITY: String concatenation in SQL query
    const query = "SELECT * FROM users WHERE username = '" + input + "'";
    
    output.innerHTML = `
        <div class="code-example">
            <h4>Wykonano zapytanie:</h4>
            <code>${query}</code>
        </div>
        <p>⚠️ To zapytanie jest podatne na SQL Injection!</p>
        <p>Spróbuj: <code>' OR '1'='1</code></p>
    `;
    
    // Simulate SQL injection success
    if (input.includes("'") || input.toLowerCase().includes("or")) {
        output.innerHTML += `
            <div style="background: #ff6b6b; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <h4>🚨 SQL Injection wykryty!</h4>
                <p>Zwrócono wszystkich użytkowników z bazy!</p>
                <pre>${JSON.stringify(fakeUsers, null, 2)}</pre>
            </div>
        `;
    }
}

// IDOR Vulnerability - Insecure Direct Object Reference
function getUserData() {
    const userId = document.getElementById('user-id').value;
    const output = document.getElementById('user-output');
    
    // VULNERABILITY: No authorization check, direct access by ID
    const user = fakeUsers[userId];
    
    if (user) {
        output.innerHTML = `
            <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h4>Dane użytkownika #${userId}:</h4>
                <p><strong>Imię:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Rola:</strong> ${user.role}</p>
                <p><strong>Pensja:</strong> ${user.salary}</p>
            </div>
            <p style="color: #ff6b6b; margin-top: 1rem;">⚠️ Brak autoryzacji! Każdy może zobaczyć dane każdego użytkownika!</p>
        `;
    } else {
        output.innerHTML = "<p>Nie znaleziono użytkownika</p>";
    }
}

// Command Injection Simulation
function executeCommand() {
    const cmd = document.getElementById('cmd-input').value;
    const output = document.getElementById('cmd-output');
    
    // VULNERABILITY: No input validation for system commands
    output.innerHTML = `
        <div class="code-example">
            <h4>Wykonywanie polecenia:</h4>
            <code>$ ${cmd}</code>
        </div>
    `;
    
    // Simulate command injection
    if (cmd.includes(";") || cmd.includes("&&") || cmd.includes("|")) {
        output.innerHTML += `
            <div style="background: #ff6b6b; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <h4>🚨 Command Injection wykryty!</h4>
                <p>Wykryto próbę wykonania wielu poleceń!</p>
                <p>Przykład: <code>ping 127.0.0.1; cat /etc/passwd</code></p>
            </div>
        `;
    } else {
        output.innerHTML += `
            <div style="background: #50fa7b; color: #2d2d2d; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <pre>PING ${cmd}
64 bytes from ${cmd}: icmp_seq=1 ttl=64 time=0.043 ms
64 bytes from ${cmd}: icmp_seq=2 ttl=64 time=0.052 ms
64 bytes from ${cmd}: icmp_seq=3 ttl=64 time=0.048 ms</pre>
            </div>
        `;
    }
}

// Weak Authentication
function adminLogin() {
    const username = document.getElementById('admin-user').value;
    const password = document.getElementById('admin-pass').value;
    const result = document.getElementById('admin-result');
    
    // VULNERABILITY: Hardcoded credentials, no hashing, client-side validation
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        result.innerHTML = "<p style='color: green; font-weight: bold;'>✅ Zalogowano!</p>";
        document.getElementById('admin-panel').style.display = 'block';
        
        // VULNERABILITY: Storing sensitive data in localStorage
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', btoa(username + ':' + password));
    } else {
        result.innerHTML = "<p style='color: red; font-weight: bold;'>❌ Nieprawidłowe dane!</p>";
    }
}

// Show sensitive data without proper authorization
function showSecretData() {
    const secretDiv = document.getElementById('secret-data');
    
    // VULNERABILITY: No server-side authorization check
    secretDiv.innerHTML = `
        <h4>🔐 Poufne dane systemu:</h4>
        <pre>
API Key: ${API_KEY}
Database URL: ${DATABASE_URL}
Admin Password: ${ADMIN_PASSWORD}

Dane klientów:
${JSON.stringify(fakeUsers, null, 2)}

Klucze szyfrowania:
AES Key: 3c9f8a7b6e5d4c3b2a1f0e9d8c7b6a5f
RSA Private Key: -----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890...
        </pre>
    `;
}

// Dangerous function without confirmation
function deleteEverything() {
    // VULNERABILITY: No confirmation, no authorization
    alert('💥 BOOM! Wszystko usunięte! (na szczęście to tylko symulacja 😅)');
    
    // In real app this would be devastating
    console.log('DELETE FROM users;');
    console.log('DROP DATABASE production;');
}

// DAST Simulation
function simulateDAST() {
    const resultsDiv = document.getElementById('dast-results');
    resultsDiv.innerHTML = '<h4>🔍 Skanowanie DAST w toku...</h4>';
    
    const vulnerabilities = [
        { severity: 'HIGH', type: 'XSS', location: '/vulnerabilities - XSS Input', description: 'Wykryto Cross-Site Scripting' },
        { severity: 'CRITICAL', type: 'SQL Injection', location: '/vulnerabilities - SQL Input', description: 'Podatność SQL Injection' },
        { severity: 'HIGH', type: 'IDOR', location: '/vulnerabilities - User Data', description: 'Insecure Direct Object Reference' },
        { severity: 'MEDIUM', type: 'Command Injection', location: '/vulnerabilities - Command Input', description: 'Możliwość wykonania poleceń systemowych' },
        { severity: 'CRITICAL', type: 'Weak Auth', location: '/admin', description: 'Słabe uwierzytelnianie (hardcoded credentials)' },
        { severity: 'HIGH', type: 'Sensitive Data', location: '/admin', description: 'Ekspozycja wrażliwych danych' },
        { severity: 'MEDIUM', type: 'Missing CSRF', location: 'All forms', description: 'Brak tokenów CSRF' },
        { severity: 'LOW', type: 'Missing Headers', location: 'Global', description: 'Brak nagłówków bezpieczeństwa (CSP, X-Frame-Options)' }
    ];
    
    let delay = 1000;
    vulnerabilities.forEach((vuln, index) => {
        setTimeout(() => {
            const severityColor = {
                'CRITICAL': '#ff0000',
                'HIGH': '#ff6b6b',
                'MEDIUM': '#ffa500',
                'LOW': '#ffeb3b'
            };
            
            const result = document.createElement('div');
            result.className = 'scan-result';
            result.style.borderLeft = `5px solid ${severityColor[vuln.severity]}`;
            result.innerHTML = `
                [${vuln.severity}] ${vuln.type}
                Location: ${vuln.location}
                Description: ${vuln.description}
            `;
            resultsDiv.appendChild(result);
            
            if (index === vulnerabilities.length - 1) {
                setTimeout(() => {
                    const summary = document.createElement('div');
                    summary.style.background = '#ff6b6b';
                    summary.style.color = 'white';
                    summary.style.padding = '1rem';
                    summary.style.borderRadius = '8px';
                    summary.style.marginTop = '1rem';
                    summary.innerHTML = `
                        <h4>📊 Podsumowanie skanowania:</h4>
                        <p>Znaleziono ${vulnerabilities.length} podatności!</p>
                        <p>CRITICAL: 2 | HIGH: 3 | MEDIUM: 2 | LOW: 1</p>
                        <p>🚨 Aplikacja wymaga natychmiastowych poprawek!</p>
                    `;
                    resultsDiv.appendChild(summary);
                }, 500);
            }
        }, delay * (index + 1));
    });
}

// Insecure random number generation
function generateToken() {
    // VULNERABILITY: Math.random() is not cryptographically secure
    return Math.random().toString(36).substring(2);
}

// Path traversal vulnerability
function loadFile(filename) {
    // VULNERABILITY: No validation of filename
    // Could be exploited with: ../../../../etc/passwd
    const path = "/uploads/" + filename;
    console.log("Loading file from: " + path);
}

// Eval usage - extremely dangerous
function executeUserCode(code) {
    // VULNERABILITY: Never use eval with user input!
    try {
        eval(code);
    } catch (e) {
        console.error("Error executing code:", e);
    }
}

// Insecure deserialization simulation
function deserializeData(jsonString) {
    // VULNERABILITY: No validation before parsing
    const data = JSON.parse(jsonString);
    return data;
}

// Cookie without security flags
function setInsecureCookie(name, value) {
    // VULNERABILITY: No HttpOnly, Secure, or SameSite flags
    document.cookie = name + "=" + value + ";";
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔓 Vulnerable App Started!");
    console.log("API Key:", API_KEY);
    console.log("Database URL:", DATABASE_URL);
    
    // Set an insecure cookie
    setInsecureCookie('sessionId', generateToken());
});

// Exposed sensitive functions (should be private)
window.adminFunctions = {
    deleteUser: function(id) {
        console.log("Deleting user:", id);
    },
    promoteToAdmin: function(id) {
        console.log("Promoting user to admin:", id);
    },
    resetAllPasswords: function() {
        console.log("Resetting all passwords to 'Password123'");
    }
};
