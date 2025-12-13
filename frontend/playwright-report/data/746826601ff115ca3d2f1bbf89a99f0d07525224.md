# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Doha Education Hub" [ref=e5] [cursor=pointer]:
          - /url: /
        - navigation [ref=e6]:
          - link "Schools" [ref=e7] [cursor=pointer]:
            - /url: /schools
          - link "Sign in" [ref=e8] [cursor=pointer]:
            - /url: /login
          - link "Sign up" [ref=e9] [cursor=pointer]:
            - /url: /register
    - generic [ref=e11]:
      - generic [ref=e12]:
        - heading "Doha Education Hub" [level=1] [ref=e13]
        - paragraph [ref=e14]: Sign in to your account
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]:
            - generic [ref=e18]: Email Address
            - textbox "Email Address" [ref=e19]:
              - /placeholder: you@example.com
              - text: test1765648362138@example.com
          - generic [ref=e20]:
            - generic [ref=e21]: Password
            - textbox "Password" [ref=e22]:
              - /placeholder: ••••••••
              - text: password123
          - paragraph [ref=e24]: Login failed. Please check your credentials.
          - button "Sign In" [ref=e25] [cursor=pointer]
        - link "Create an account" [ref=e27] [cursor=pointer]:
          - /url: /register
        - link "← Back to home" [ref=e29] [cursor=pointer]:
          - /url: /
  - alert [ref=e30]: Login | Doha Education Hub
```