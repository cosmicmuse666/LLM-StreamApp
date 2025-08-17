# PowerLearn - AI Chat Application

PowerLearn is a web application built with Next.js that demonstrates how to integrate with the OpenAI API to create an interactive chat experience. It includes examples of both standard (full response) and streaming chat functionalities.

## Features

- **Standard Chat**: Send a message and receive a complete response from the AI.
- **Streaming Chat**: Receive the AI's response token-by-token for a real-time, "typing" effect.
- **Modern Tech Stack**: Built with the Next.js App Router, React Server Components, and styled with Tailwind CSS.
- **Robust API Routes**: Clear separation of concerns with dedicated API routes for chat and streaming.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18.17 or later)
- A package manager like `npm`, `yarn`, `pnpm`, or `bun`.
- An OpenAI API key.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/cosmicmuse666/LLM-StreamApp.git
    cd LLM-StreamApp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add your OpenAI API key:
    ```
    # .env.local
    OPENAI_API_KEY="your-openai-api-key-here"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open http://localhost:3000 with your browser to see the result. You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## How It Works

-   **Frontend (`app/page.js`):** A client component that manages state for the user's message and the AI's response. It contains two primary functions, `handleChat` and `handleStreamChat`, which make `fetch` requests to the backend API routes.
-   **Standard API (`app/api/chat/route.ts`):** This route receives the user's message, calls the OpenAI Chat Completions API, awaits the full response, and sends it back to the frontend as a single JSON object.
-   **Streaming API (`app/api/stream/route.js`):** This route also calls the OpenAI API but with the `stream: true` option. It pipes the resulting `ReadableStream` from OpenAI directly to the client as Server-Sent Events (SSE), allowing the frontend to display the response as it's generated.

This project uses `next/font` to automatically optimize and load Geist, a font family for Vercel.

