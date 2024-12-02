async function startTests() {
    const baseUrl = document.getElementById("baseUrl").value;
    if (!baseUrl) {
        alert("Please enter a valid URL.");
        return;
    }

    document.getElementById("sqlResult").textContent = "SQL Injection: Testing...";
    document.getElementById("xssResult").textContent = "XSS: Testing...";
    document.getElementById("authResult").textContent = "Authentication: Testing...";

    // Perform tests
    const sqlInjectionResult = await testSqlInjection(baseUrl);
    const xssResult = await testXss(baseUrl);
    const authResult = await testInsecureAuth(baseUrl);

    // Update results
    document.getElementById("sqlResult").textContent = `SQL Injection: ${sqlInjectionResult}`;
    document.getElementById("xssResult").textContent = `XSS: ${xssResult}`;
    document.getElementById("authResult").textContent = `Authentication: ${authResult}`;
}

async function testSqlInjection(baseUrl) {
    const sqlPayloads = ["' OR '1'='1", "' UNION SELECT null, null--"];
    for (const payload of sqlPayloads) {
        try {
            const response = await fetch(`${baseUrl}?id=${encodeURIComponent(payload)}`);
            const text = await response.text();
            if (text.toLowerCase().includes("error") || text.toLowerCase().includes("syntax")) {
                return "Vulnerable";
            }
        } catch (error) {
            console.error("SQL Injection test failed:", error);
        }
    }
    return "Not Vulnerable";
}

async function testXss(baseUrl) {
    const xssPayloads = [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>"
    ];
    for (const payload of xssPayloads) {
        try {
            const response = await fetch(`${baseUrl}?input=${encodeURIComponent(payload)}`);
            const text = await response.text();
            if (text.includes(payload)) {
                return "Vulnerable";
            }
        } catch (error) {
            console.error("XSS test failed:", error);
        }
    }
    return "Not Vulnerable";
}

async function testInsecureAuth(baseUrl) {
    const loginUrl = `${baseUrl}/login`;
    const commonCredentials = [
        { username: "admin", password: "admin" },
        { username: "root", password: "password" }
    ];
    for (const creds of commonCredentials) {
        try {
            const response = await fetch(loginUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(creds)
            });
            if (response.ok || (await response.text()).toLowerCase().includes("welcome")) {
                return "Vulnerable";
            }
        } catch (error) {
            console.error("Authentication test failed:", error);
        }
    }
    return "Not Vulnerable";
}
