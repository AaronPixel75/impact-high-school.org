# How to Deploy Your Website to GitHub

Your website files are **saved and ready** on your computer.
Since the automatic login failed (the key was expired), you just need to run one command to send it to GitHub.

### Step 1: Push the Code
Open your terminal (PowerShell or Command Prompt) and run:

```bash
git push origin main
```

*   It will ask for your **Username** (`AaronPixel75`) and **Password**.
*   **Note**: For the password, you must use a **valid Personal Access Token**, or sign in via the browser if it prompts you.

### Step 2: Enable Live Website
Once the push is successful:
1.  Go to your repository: [https://github.com/AaronPixel75/impacthighschool](https://github.com/AaronPixel75/impacthighschool)
2.  Click **Settings** (top right gear icon).
3.  Click **Pages** (on the left sidebar).
4.  Under **Branch**, select `main` and click **Save**.
5.  Wait about 1-2 minutes.
6.  Refresh the page, and it will give you your **Live Website URL** (e.g., `https://AaronPixel75.github.io/impacthighschool/`).

### Troubleshooting
If `git push` gives an error, try forcing it once:
```bash
git push -f origin main
```
