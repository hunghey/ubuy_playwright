---
name: user-lifecycle-flow
app_url: https://automationexercise.com
browser: chromium
viewport: 1280x720
timeout: 30000
screenshot: on-failure
---

# Test Suite: User Lifecycle — Register → Login → Delete Account

## TC-001: Register a new user account

**Priority:** High
**Tags:** smoke, registration, auth

### Preconditions

- User does not already exist with the email being registered
- Browser is not logged in

### Steps

1. navigate to /login
2. wait for "New User Signup!"
3. fill "Name" with "QA TestUser"
4. fill "Email Address" in signup section with "qa_testuser_auto@mailinator.com"
5. click "Signup"
6. wait for "Enter Account Information"
7. click radio "Mr."
8. fill "Password \*" with "Test@1234"
9. select "15" from Day dropdown
10. select "March" from Month dropdown
11. select "1995" from Year dropdown
12. check "Sign up for our newsletter!"
13. fill "First name \*" with "QA"
14. fill "Last name \*" with "TestUser"
15. fill "Address \* (Street address, P.O. Box, Company name, etc.)" with "123 Automation Street"
16. select "United States" from "Country \*"
17. fill "State \*" with "California"
18. fill "City _ Zipcode _" with "Los Angeles"
19. fill zipcode field with "90001"
20. fill "Mobile Number \*" with "0987654321"
21. click "Create Account"
22. wait for "Account Created!"

### Expected Results

- [ ] URL contains "/account_created"
- [ ] Page contains text "Account Created!"
- [ ] Page contains text "Congratulations"
- [ ] Element "b" contains text "Account Created!"

---

## TC-002: Continue to home page after account creation

**Priority:** High
**Tags:** smoke, registration

### Preconditions

- TC-001 has been executed successfully
- Current page is /account_created

### Steps

1. click "Continue"
2. wait for "Logged in as"

### Expected Results

- [ ] URL is "https://automationexercise.com/"
- [ ] Page contains text "Logged in as QA TestUser"
- [ ] Element "a" contains text "Logout"
- [ ] Element "a" contains text "Delete Account"

---

## TC-003: Logout after registration

**Priority:** Medium
**Tags:** smoke, auth

### Preconditions

- User is currently logged in as QA TestUser

### Steps

1. click "Logout"
2. wait for "Login to your account"

### Expected Results

- [ ] URL contains "/login"
- [ ] Page contains text "Login to your account"
- [ ] Page contains text "New User Signup!"

---

## TC-004: Login with registered account

**Priority:** High
**Tags:** smoke, auth, login

### Preconditions

- User account exists: email=qa_testuser_auto@mailinator.com, password=Test@1234
- User is not logged in

### Steps

1. navigate to /login
2. wait for "Login to your account"
3. fill "Email Address" in login section with "qa_testuser_auto@mailinator.com"
4. fill "Password" with "Test@1234"
5. click "Login"
6. wait for "Logged in as"

### Expected Results

- [ ] URL is "https://automationexercise.com/"
- [ ] Page contains text "Logged in as QA TestUser"
- [ ] Element "a" contains text "Logout"
- [ ] Element "a" contains text "Delete Account"
- [ ] Page does not contain "Your email or password is incorrect!"

---

## TC-005: Delete account while logged in

**Priority:** High
**Tags:** smoke, account-management, destructive

### Preconditions

- User is currently logged in as QA TestUser (email=qa_testuser_auto@mailinator.com)

### Steps

1. click "Delete Account"
2. wait for "Account Deleted!"

### Expected Results

- [ ] URL contains "/delete_account"
- [ ] Page contains text "Account Deleted!"
- [ ] Page contains text "permanently deleted"
- [ ] Element "b" contains text "Account Deleted!"

---

## TC-006: Confirm account no longer exists after deletion

**Priority:** High
**Tags:** regression, auth, negative

### Preconditions

- TC-005 has been executed successfully — account has been deleted

### Steps

1. click "Continue"
2. navigate to /login
3. wait for "Login to your account"
4. fill "Email Address" in login section with "qa_testuser_auto@mailinator.com"
5. fill "Password" with "Test@1234"
6. click "Login"
7. wait for "incorrect"

### Expected Results

- [ ] URL contains "/login"
- [ ] Page contains text "Your email or password is incorrect!"
- [ ] Page does not contain "Logged in as"
