# 🤖 FakeGPT — Lightweight Node.js AI Streaming Engine

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![OpenAI API](https://img.shields.io/badge/OpenAI_API-Compatible-412991?style=for-the-badge&logo=openai&logoColor=white)](https://platform.openai.com/)
[![SSE Streaming](https://img.shields.io/badge/Protocol-Server--Sent_Events-00C7B7?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>A high-efficiency, zero-framework Node.js conversational AI streaming server.</strong><br>
  Built with native HTTP modules, asynchronous stream chunk iterators, and zero external web framework overhead.
</p>

</div>

---

## 📌 Architectural Overview

Instead of buffering entire LLM completions in memory before sending a payload to the client, **FakeGPT** pipes tokens directly from the model stream into the outgoing HTTP response stream as they arrive.

`mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant NodeHTTP as Native Node.js HTTP Server
    participant LLM as OpenRouter / OpenAI API Engine

    User->>NodeHTTP: POST / (JSON prompt payload)
    Note over NodeHTTP: Parses request stream with async iterators
    NodeHTTP->>LLM: client.chat.completions.create(stream: true)
    
    loop Token Streaming (Zero Buffering)
        LLM-->>NodeHTTP: Yield delta token chunk
        NodeHTTP-->>User: res.write(token) in real-time
    end
    
    NodeHTTP->>User: res.end()
`

---

## ⚡ Key Technical Highlights

- **Zero-Framework Lightweight Server:** Built entirely on Node.js core http, s, and path modules without Express or heavy dependencies.
- **Asynchronous Chunk Iterators:** Implements or await (const chunk of req) and or await (const part of stream) for memory-safe backpressure handling.
- **Static Asset Streaming:** Serves HTML, CSS, and client-side JavaScript via s.createReadStream().pipe(res) with accurate MIME type mapping.
- **Streaming UI:** Real-time typewriter effect in the frontend using standard etch() and ReadableStream decoding.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules)
- **API Client:** OpenAI SDK (OpenRouter API integration)
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (Fetch Streams)

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js >= 18.0.0
- An API Key (OpenAI or OpenRouter)

### Installation
`ash
# 1. Clone the repository
git clone https://github.com/adarshbam/fakegpt.git
cd fakegpt

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file:
OPENAI_API_KEY=your_api_key_here

# 4. Start the streaming server
npm start
`

Open http://localhost:4000 in your browser.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
