# StepUpApplication
A networking app for like-minded professionals

## Technology

This project uses plain HTML, CSS/CSS3, and vanilla JavaScript. It does not use
React, jQuery, PHP, MySQL, or a build tool.

## Run the app

Open `index.html` in a web browser.

You can also run it from a simple local web server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://127.0.0.1:8080
```

## Manual demo steps

1. Open the app.
2. Sign up with any email, for example `a.b@c.com`.
3. Use any password, for example `asd`.
4. Confirm the welcome screen shows the signed-in email.
5. Click `Logout`.
6. Log back in with the same email and password.
7. Confirm the welcome screen appears again.

The app keeps demo accounts in memory only. Refreshing the page or restarting the
server clears the demo accounts, so each demo can start fresh.

## Simple code check

If Node.js is installed, run this optional syntax check:

```bash
node --check src/app.js
```
