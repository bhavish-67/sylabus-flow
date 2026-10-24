# Install Syllabus Flow on Android — no coding needed

You do **not** need to understand Node.js. It is the small, secure part of the app that searches Tavily without showing your secret key to other people. Render runs it for you.

You need a Mac (for the initial setup), an Android phone, an internet connection, and free accounts for Tavily, GitHub, and Render. The whole setup normally takes around 15–25 minutes, plus any email verification time.

## 1. Unzip the app

1. Download `syllabus-flow-android-tavily.zip`.
2. Open Finder → **Downloads**.
3. Double-click the ZIP file. Finder creates a folder containing the app files.
4. Keep this Finder window open.

## 2. Create a free Tavily key

1. Visit [Tavily](https://tavily.com) and create an account.
2. Open the Tavily dashboard and find **API Keys**.
3. Create a new key, then copy the key that starts with `tvly-`.
4. Keep this key private. Do not email it, post it, or add it to GitHub.

## 3. Put the app files on GitHub

1. Visit [GitHub](https://github.com) and create a free account.
2. At the top-right, click **+** → **New repository**.
3. Name it `syllabus-flow`.
4. Choose **Private**.
5. Click **Create repository**.
6. Click **Add file** → **Upload files**.
7. Drag these files from the unzipped app folder into the browser:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.webmanifest`
   - `sw.js`
   - `app-icon.svg`
   - `server.mjs`
   - `package.json`
   - `SETUP.md`
   - `README.txt`
8. At the bottom, click **Commit changes**.

Never upload a file called `.env` containing your Tavily key. The `.env.example` file in the ZIP is only an example and does not contain a real key.

## 4. Put the app online with Render

1. Visit [Render](https://render.com) and create an account by choosing **Sign up with GitHub**.
2. Allow Render to access your GitHub account when it asks.
3. In Render, click **New** → **Web Service**.
4. Find the `syllabus-flow` repository and click **Connect**.
5. On the setup screen, enter these settings:

   - **Language:** Node
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.mjs`
   - **Instance Type:** Free

6. Open the **Environment Variables** section.
7. Click **Add Environment Variable**.
8. In **Key**, type exactly: `TAVILY_API_KEY`
9. In **Value**, paste the Tavily key you copied in step 2.
10. Click **Create Web Service**.
11. Wait until Render says the service is live. Copy the website address it gives you. It will look like `https://something.onrender.com`.

## 5. Install it on your Android phone

1. Send the `https://…onrender.com` address to your Android phone, such as in a message to yourself.
2. Open that address in **Google Chrome** on the phone—not inside another app’s mini browser.
3. Wait for the Syllabus Flow page to load.
4. Tap the app’s **Install** button. If it is not shown, tap Chrome’s three-dot menu `⋮` → **Install app**.
5. Tap **Install** to confirm.
6. Syllabus Flow now appears in your app drawer and on your Home Screen. Open it from there like any normal app.

## 6. Download a syllabus for offline use

1. Keep your phone connected to the internet.
2. Open Syllabus Flow → **Browse offline library** → **Web search**.
3. Type the syllabus you want, for example `CBSE Class 12 Physics syllabus 2026`.
4. Tap **Search online**.
5. Select a result and tap **Download for offline**.
6. When the download finishes, the syllabus becomes a card in **My syllabuses**.
7. Tap **Read saved syllabus**. This saved copy works without internet.

To test it, turn on Airplane Mode and open Syllabus Flow. Built-in syllabuses, your progress, and every syllabus you already downloaded will still work. Internet is only needed to search or download something new.

## If something goes wrong

- **“Search is unavailable” or “Tavily server key is not configured”:** In Render, open the Syllabus Flow service → **Environment**, check that `TAVILY_API_KEY` has your full key, then choose **Save, rebuild, and deploy**.
- **No Install option on Android:** Open the Render link directly in Google Chrome, make sure it starts with `https://`, then refresh and try Chrome’s `⋮` menu.
- **A source cannot download:** The source website may block readable text or provide only a protected document. Try another official syllabus result.
