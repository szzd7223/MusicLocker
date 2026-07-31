# Production Deployment Guide

This guide details how to deploy the Music Catalog Insights Platform to production:
1.  **Database:** Serverless PostgreSQL on **Neon.tech**.
2.  **Backend API:** Containerized Spring Boot on **Render.com**.
3.  **Frontend Dashboard:** Static/Serverless Next.js on **Vercel.com**.

---

## Part 1: Set up Neon PostgreSQL

Neon provides a free, serverless PostgreSQL database that starts and stops automatically.

1.  Go to **[neon.tech](https://neon.tech/)** and sign up for a free account.
2.  Create a new project. Select **PostgreSQL 16** (or newer) and choose the region closest to you or Render's region (typically US East).
3.  Once created, copy the **Connection String** from your dashboard. It will look like this:
    ```text
    postgresql://neondb_owner:npg_xY12AbCdEf@ep-cool-snowflake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
    ```
4.  **Extract the credentials** needed for Spring Boot:
    *   **JDBC URL:** Replace the `postgresql://` protocol prefix with `jdbc:postgresql://`.
        *   *Example:* `jdbc:postgresql://ep-cool-snowflake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require`
    *   **Username:** The username part (e.g., `neondb_owner`).
    *   **Password:** The password part (e.g., `npg_xY12AbCdEf`).

---

## Part 2: Deploy Backend to Render (via Docker)

Render supports containerized deployments. It will read our `backend/Dockerfile`, compile the Maven project inside it, and serve the application.

1.  Sign up or log in to **[Render.com](https://render.com/)**.
2.  Click **"New +"** (top-right) and select **"Web Service"**.
3.  Connect your GitHub repository containing this project.
4.  In the configuration page, set the following parameters:
    *   **Name:** `music-catalog-api` (or similar).
    *   **Root Directory:** `backend` *(Crucial: This tells Render to look inside the backend folder to find the pom.xml and Dockerfile)*.
    *   **Runtime:** Select **`Docker`**.
    *   **Instance Type:** Select **`Free`**.
5.  Click the **"Advanced"** button and add these **Environment Variables**:
    *   `SPRING_DATASOURCE_URL` : The PostgreSQL JDBC URL you extracted from Neon.
    *   `SPRING_DATASOURCE_USERNAME` : The Neon database username.
    *   `SPRING_DATASOURCE_PASSWORD` : The Neon database password.
    *   `GEMINI_API_KEY` : Your Google Gemini API Key (starting with `AIzaSy` or `AQ.Ab`).
    *   `ALLOWED_ORIGINS` : Set this to your frontend URL. *(Since we haven't deployed the frontend yet, set this to `https://*.vercel.app` or use a temporary placeholder like `http://localhost:3000`. You will update this value in Part 4)*.
    *   `JWT_SECRET` : A secure random string used to sign user tokens (e.g. `your-super-long-secure-and-randomly-generated-secret-key-12345`).
6.  Click **"Create Web Service"**. 
    *   *Render will build the Docker container (restoring Maven dependencies and compiling the jar) and start the server. Copy the live Web Service URL from the top of the Render screen (e.g., `https://music-catalog-api.onrender.com`).*

---

## Part 3: Deploy Frontend to Vercel

Vercel is the native platform for Next.js applications and handles building/deploying automatically.

1.  Sign up or log in to **[Vercel.com](https://vercel.com/)**.
2.  Click **"Add New"** -> **"Project"** and import your GitHub repository.
3.  Configure the project settings:
    *   **Root Directory:** Set this to **`frontend`** *(Crucial: This tells Vercel to build the Next.js app in the frontend subdirectory)*.
    *   **Framework Preset:** Select **`Next.js`** (should auto-detect).
4.  Expand the **"Environment Variables"** block and add:
    *   `NEXT_PUBLIC_API_BASE_URL` : The live URL of your Render backend API (e.g. `https://music-catalog-api.onrender.com`). *Do not add a trailing slash.*
5.  Click **"Deploy"**.
    *   *Vercel will compile the Next.js project and deploy it. Once complete, copy your live frontend URL (e.g., `https://your-project-name.vercel.app`).*

---

## Part 4: Secure CORS Permissions

To ensure your web app can communicate with the backend successfully, go back to your backend configuration and update the origin permissions:

1.  Open your **Render Dashboard** and select your backend Web Service.
2.  Navigate to **Settings** -> **Environment Variables**.
3.  Update the **`ALLOWED_ORIGINS`** variable, replacing your placeholder with your actual live Vercel URL:
    *   *Example:* `https://music-catalog-insights.vercel.app`
4.  Save the changes. Render will automatically perform a zero-downtime redeployment with the new CORS permissions.

---

## 🚦 Verification Checklist

Your live site is fully set up when:
-   Navigating to your Vercel URL displays the spinning vinyl login page.
-   Creating a new user registers a profile on your live Neon PostgreSQL database.
-   Adding a rating/notes to a track saves it securely.
-   Refreshing the page fetches your saved songs from your live database.
-   The **Overview** page successfully connects to the Gemini API to show your AI music curator profile.
