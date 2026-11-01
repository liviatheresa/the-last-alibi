<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/73a1ae11-0132-4588-bac8-3350d20b9e9b

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```

2. *(Optional)* Add your Gemini API key in [.env](file:///C:/Users/Admin/Downloads/the-last-alibi/.env) or `.env.local`:
   ```bash
   GEMINI_API_KEY="your-api-key-here"
   ```
   > **Note:** The app includes a built-in procedural simulation engine, so it runs and is fully playable even without an API key!

3. Start the application:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
