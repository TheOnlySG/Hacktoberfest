# Passage Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide walks you through deploying **Passage v2.0** to production using **Render** for the FastAPI backend and **Vercel** for the React frontend.

---

## 1. Deploy Backend to Render

### Option A: Via Blueprint (Recommended)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** $\to$ **Blueprint**.
3. Connect your repository: `TheOnlySG/Hacktoberfest`.
4. Render will automatically detect [`render.yaml`](./render.yaml).
5. In the environment variables prompt, enter your `GROQ_API_KEY`:
   - `GROQ_API_KEY`: `gsk_...`
6. Click **Apply**.
7. Once deployed, note down your Render service URL (e.g. `https://passage-api.onrender.com`).

### Option B: Manual Web Service
1. In Render Dashboard, click **New +** $\to$ **Web Service**.
2. Connect `TheOnlySG/Hacktoberfest`.
3. Configure the service:
   - **Name:** `passage-api`
   - **Language:** `Python 3`
   - **Branch:** `main`
   - **Region:** Any (e.g., Oregon or Frankfurt)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:
   - `PYTHON_VERSION`: `3.11.9`
   - `USE_CACHED_AI`: `false`
   - `GROQ_MODEL`: `openai/gpt-oss-120b`
   - `GROQ_API_KEY`: `<your_groq_api_key>`
5. Click **Create Web Service**.
6. Verify deployment by visiting `https://<your-render-subdomain>.onrender.com/health` $\to$ `{"status": "ok"}`.

---

## 2. Deploy Frontend to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** $\to$ **Project**.
3. Import your GitHub repository: `TheOnlySG/Hacktoberfest`.
4. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** If you leave it as `./`, the root [`vercel.json`](./vercel.json) will automatically run `npm --prefix frontend run build` and output to `frontend/dist`. (Alternatively, you can select `frontend` as the Root Directory).
5. Expand **Environment Variables**:
   - **Key:** `VITE_API_URL`
   - **Value:** Your Render backend URL (e.g., `https://passage-api.onrender.com`).
6. Click **Deploy**.

---

## 3. Post-Deployment Verification

1. Open your live Vercel URL (e.g. `https://passage-omega.vercel.app`).
2. Check the top header badge: It should show **`FastAPI Live`** in emerald green once it connects to your Render backend.
3. Test a full flow:
   - Click **"Compile Narrative & Trace Route"** $\to$ Watch real-time AI extraction on Groq.
   - Review the tripartite routing architecture on the **Resolution Plan** screen.
   - Adjust segmented `[On | Off]` permission buttons on **Consents & Drafts**.
   - Click **"Send Passage"** $\to$ Verify tickets are registered in the custody chain.
