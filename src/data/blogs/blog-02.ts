import type { BlogPost } from "../blogs";

export const blog02: BlogPost = {
  id: "blog-02",
  title: "Inside MockMate AI: Designing a Real-Time Audio & Speech Analytics Pipeline",
  slug: "inside-mockmate-ai-speech-analytics-pipeline",
  date: "June 2, 2026",
  readTime: "12 min read",
  excerpt: "A technical breakdown of capturing high-fidelity audio chunks, streaming base64 payloads, and analyzing speech metrics using Google Gemini.",
  category: "AI",
  tags: ["React 19", "Web Audio API", "Gemini API", "SaaS", "MockMate AI", "Audio Capture"],
  metaDescription: "Step-by-step breakdown of building a browser-to-LLM audio streaming pipeline using Web Audio API and Google Gemini 1.5 for speech diagnostics.",
  metaKeywords: "Web Audio API, MediaRecorder, audio base64 streaming, Google Gemini audio input, speech analytics, acoustic diagnostics, MockMate AI",
  content: `
### Introduction

Voice interfaces represent the next generation of user experience. Whether it is virtual speech coaches, real-time translations, or AI-driven interview tools, systems that analyze human voice are in high demand. Historically, building a speech analysis tool was incredibly complex and expensive. Developers had to record audio in the browser, send it to a server, run it through an Automatic Speech Recognition (ASR) engine to get a transcription, run NLP on that text to calculate pacing and vocabulary, and utilize a separate digital signal processing (DSP) library to analyze vocal tone. The latency was high, the architecture was fragile, and the servers were expensive.

When I designed **MockMate AI** (my automated technical interview preparation platform), I wanted a modern, fast, and simple solution.

Instead of running heavy speech pipelines on the backend, we can leverage the **Web Audio API** in the browser to capture mic inputs, compress the stream on-the-fly, serialize the audio chunks to base64, and transmit them to **Google Gemini**. Gemini is natively multimodal: it does not just read text; it directly listens to audio waveforms. It can identify speech pacing, filler words (like "um", "uh", "like"), evaluate logical structure (such as the STAR method in interviews), and extract transcription details in a single step.

This guide details how to build this complete browser-to-model speech pipeline.

---

### The Real-Time Speech Analysis Pipeline

The following ASCII diagram outlines the complete sequence, from the initial microphone request in the React frontend to the structured JSON metrics returned by Gemini:

\`\`\`
  +------------------+
  |  User Microphone  |
  +--------+---------+
           |
           v (Raw Analog Audio)
  +--------+---------+      +-----------------------------------------+
  |  Web Audio API   | ---> | AudioContext & Analyser (Visualizer)    |
  +--------+---------+      +-----------------------------------------+
           |
           v (44.1kHz PCM Stream)
  +--------+---------+
  |  MediaRecorder   | (WebM container, Opus codec)
  +--------+---------+
           |
           v (Blobs of 250ms chunks)
  +--------+---------+
  |  ArrayBuffer &   |
  |  FileReader API  | (Base64 ASCII serialization)
  +--------+---------+
           |
           v (JSON Payload with Inline Audio Data)
  +--------+---------+
  | Backend Gateway  | (Validates request / shields API keys)
  +--------+---------+
           |
           v (Forward to Google GenAI API)
  +--------+---------+
  | Google Gemini    | (Multimodal reasoning / Tokenizer)
  +--------+---------+
           |
           v (Structured JSON output)
  +--------+---------+
  | Speech Metrics   | -> Transcript, Filler counts, STAR evaluation
  +------------------+
\`\`\`

By avoiding manual server-side transcribing, we reduce pipeline latency and avoid the cost of managing heavy file storage servers.

---

### Step 1: Capturing High-Fidelity Audio in React 19

We start by building a custom React hook that requests microphone permissions, starts recording using the browser's \`MediaRecorder\` API, and outputs compressed audio blobs.

\`\`\`typescript
// filepath: src/hooks/useSpeechCapture.ts
import { useState, useRef, useCallback } from "react";

export interface SpeechCaptureControls {
  isRecording: boolean;
  audioUrl: string | null;
  startSpeechCapture: () => Promise<void>;
  stopSpeechCapture: () => void;
  getAudioBlob: () => Blob | null;
  resetCapture: () => void;
}

export function useSpeechCapture(): SpeechCaptureControls {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startSpeechCapture = useCallback(async () => {
    // Reset any previous recording data
    audioChunksRef.current = [];
    setAudioUrl(null);

    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;

      // 2. Select codec - WebM Opus is highly compressed and natively understood by Gemini
      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        // Fallback for browsers without Opus WebM support (like Safari)
        mimeType = "audio/mp4";
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      
      // 3. Store incoming audio fragments
      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 4. Compile chunks into a single audio source on stop
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const localUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localUrl);
      };

      // Slice the audio stream into 250ms chunks to prevent large memory overheads
      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone hardware access was denied or failed:", error);
      throw new Error("Could not access microphone. Please check permissions.");
    }
  }, []);

  const stopSpeechCapture = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      
      // 5. Clean up stream tracks to turn off the hardware recording indicator light
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsRecording(false);
    }
  }, []);

  const getAudioBlob = useCallback((): Blob | null => {
    if (audioChunksRef.current.length === 0) return null;
    const type = mediaRecorderRef.current?.mimeType || "audio/webm";
    return new Blob(audioChunksRef.current, { type });
  }, []);

  const resetCapture = useCallback(() => {
    audioChunksRef.current = [];
    setAudioUrl(null);
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    audioUrl,
    startSpeechCapture,
    stopSpeechCapture,
    getAudioBlob,
    resetCapture
  };
}
\`\`\`

This hook handles system permissions and ensures that recording hardware is properly turned off when done.

---

### Step 2: Base64 Serializing & Gemini Analysis

Next, we convert the audio blob into a base64 string and send it to Google Gemini for processing. 

Note that we use a structured JSON schema to guarantee that the response from the model fits the dashboard UI fields exactly.

\`\`\`typescript
// filepath: src/services/speechAnalyzer.ts
import { genAI } from "../config/gemini";

export interface SpeechDiagnostics {
  transcript: string;
  fillerWordsCount: {
    like: number;
    um: number;
    uh: number;
    youKnow: number;
  };
  pacingWpm: number;
  technicalRating: number;
  starCompliance: string;
  speechSpeed: "Slow" | "Average" | "Fast";
  actionableFeedback: string[];
}

/**
 * Converts a browser Blob to a raw base64 string (stripping metadata headers).
 */
function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        // Extract only the base64 content from the data URL: data:*/*;base64,...
        const base64Data = reader.result.split(",")[1];
        resolve(base64Data);
      } else {
        reject(new Error("Failed to serialize audio blob to base64 string."));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function analyzeCandidateSpeech(
  audioBlob: Blob, 
  questionPrompt: string
): Promise<SpeechDiagnostics> {
  try {
    const base64Audio = await convertBlobToBase64(audioBlob);
    
    // Use gemini-1.5-flash for rapid, cost-effective multimodal analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = 
      "You are an expert voice coach and technical interviewer. " +
      "Listen carefully to the audio response. Count every filler word, " +
      "assess verbal pacing (words per minute), grade the technical accuracy, " +
      "and verify how well the candidate used the STAR method (Situation, Task, Action, Result)." +
      "Provide constructive, actionable improvement points.";

    const promptText = \`
      Analyze the attached audio clip in reference to this question: "\${questionPrompt}".
      
      You must respond strictly in JSON using the following interface:
      {
        "transcript": "Full literal transcription",
        "fillerWordsCount": { "like": 0, "um": 0, "uh": 0, "youKnow": 0 },
        "pacingWpm": 130,
        "technicalRating": 8,
        "starCompliance": "Detailed breakdown of how S, T, A, R components were addressed",
        "speechSpeed": "Slow" | "Average" | "Fast",
        "actionableFeedback": ["point 1", "point 2"]
      }
    \`;

    const response = await model.generateContent([
      {
        inlineData: {
          mimeType: audioBlob.type || "audio/webm",
          data: base64Audio
        }
      },
      { text: promptText }
    ]);

    const resultText = response.response.text();
    
    # Clean JSON response (strip markdown wrappers if model ignores instructions)
    const sanitizedJson = resultText.replace(/^\`\`\`json\\s*|\`\`\`\$/g, "");
    return JSON.parse(sanitizedJson) as SpeechDiagnostics;
  } catch (error) {
    console.error("Speech pipeline analysis execution failed:", error);
    throw new Error("Could not generate speech diagnostics. Please try again.");
  }
}
\`\`\`

---

### Technical Deep Dive: Web Audio API & Multimodal Mechanics

#### 1. The Power of Multimodal Inputs
Traditional systems utilize ASR tools like Whisper to convert voice to text, and then run NLP models. This drops crucial auditory information. Gemini is built from the ground up with a shared attention space for audio and text. It learns to read features like spectrogram amplitude, frequency shifts, pauses, and pitch variations directly. This lets it determine if a user sounds nervous or has long pauses without relying on a transcription step.

#### 2. Security & Privacy Guardrails
- **Key Protection**: Never call the Google Gemini API directly from browser code in public production environments. This exposes your private API keys. Implement a backend proxy (e.g., using FastAPI) that receives the base64 payload, attaches the API credentials securely, and calls Gemini.
- **Explicit Micro Consent**: Browsers require user approval to access input devices. Manage permission errors gracefully:
  \`\`\`typescript
  navigator.permissions.query({ name: "microphone" as PermissionName })
    .then((result) => {
      if (result.state === "denied") {
        // Trigger alert prompting the user to click the lock icon and enable mic
      }
    });
  \`\`\`

#### 3. Performance Engineering & Resource Optimization
- **Preventing Browser Memory Leaks**: When calling \`getUserMedia\`, the browser spawns background processes. If you stop the recorder but do not stop the tracks in the stream, the microphone stays active, draining battery and raising security concerns. Always clean up active tracks:
  \`\`\`typescript
  stream.getTracks().forEach(track => track.stop());
  \`\`\`
- **Base64 Overhead Mitigation**: Encoding binary data to base64 increases payload size by roughly 33%. For long audio clips, this can block the browser's main thread. Limit recordings to 3 minutes in the UI to prevent large memory spikes.
- **Handling Codec Incompatibilities**: Safari struggles with native WebM creation. Always test capabilities and use a fallback format like MP4 (\`audio/mp4\` or \`audio/aac\`) to support both iOS and Android users.

---

### Cross-Reading Recommendations

To improve your frontend state management and backend concurrency, check out these related posts:
* **[React 19 in Production: Practical Guide to Actions, useActionState, and the Compiler](/?blog=react-19-production-actions-transitions)**: Learn how to manage loading spinners and API states cleanly while waiting for Gemini's analysis response.
* **[Taming Asyncio: Handling 10k+ Concurrent LLM Requests with Tornado & FastAPI](/?blog=taming-asyncio-tornado-fastapi-concurrency)**: Learn how to handle thousands of concurrent base64 audio uploads without blocking your Python servers.

---

### References & Official Documentation
* Web API Standard: **[MDN Web Audio API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)**
* Developer SDK: **[Google GenAI Multimodal Capabilities](https://ai.google.dev/)**
* Component Lifecycles: **[React 19 Custom Hooks and Refs](https://react.dev/)**

---

### Feedback & Collaboration

Capturing and processing voice inputs efficiently in web applications requires careful optimization. Have you built speech analysis tools in the browser? How do you manage iOS Safari audio encoding issues?

I would love to exchange performance tips. Share your thoughts on my [Resume Portal](https://samadshaikh.me) or write a note via the Connect page on my [Portfolio Portal](https://samadshaikh.dev).
`
};
