import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { userId, fileName } = await request.json()

    if (!userId || !fileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user authentication
    const supabase = await createClient()
    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError || !user.user || user.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify active subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 403 })
    }

    // Get client IP and user agent for logging
    const headersList = await headers()
    const clientIP = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Log the download
    const downloadUrl = `/downloads/${fileName}`
    const { error: logError } = await supabase.from("downloads").insert({
      user_id: userId,
      download_url: downloadUrl,
      ip_address: clientIP,
      user_agent: userAgent,
    })

    if (logError) {
      console.error("Error logging download:", logError)
    }

    // In a real implementation, you would serve the actual file from a secure location
    // For this demo, we'll create a mock file response
    const mockExtensionContent = createMockExtension(fileName)

    return new NextResponse(mockExtensionContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function createMockExtension(fileName: string): Buffer {
  // In a real implementation, you would read the actual extension file from secure storage
  // This is a mock implementation for demonstration
  const isChrome = fileName.includes("chrome")

  const manifestContent = JSON.stringify(
    {
      manifest_version: isChrome ? 3 : 2,
      name: "Human Typer",
      version: "1.0.0",
      description: "Professional auto-typing extension with human-like cadence",
      permissions: ["activeTab", "storage"],
      ...(isChrome
        ? {
            action: {
              default_popup: "popup.html",
              default_title: "Human Typer",
            },
          }
        : {
            browser_action: {
              default_popup: "popup.html",
              default_title: "Human Typer",
            },
          }),
      content_scripts: [
        {
          matches: ["<all_urls>"],
          js: ["content.js"],
        },
      ],
    },
    null,
    2,
  )

  const popupHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { width: 300px; padding: 20px; font-family: Arial, sans-serif; }
    .header { text-align: center; margin-bottom: 20px; }
    .controls { display: flex; flex-direction: column; gap: 10px; }
    button { padding: 10px; border: none; border-radius: 5px; cursor: pointer; }
    .primary { background: #007bff; color: white; }
    .secondary { background: #6c757d; color: white; }
    textarea { width: 100%; height: 100px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>Human Typer</h2>
    <p>Professional Auto-Typing</p>
  </div>
  <textarea id="textInput" placeholder="Paste your text here..."></textarea>
  <div class="controls">
    <button id="startBtn" class="primary">Start Typing</button>
    <button id="pauseBtn" class="secondary">Pause</button>
    <button id="stopBtn" class="secondary">Stop</button>
  </div>
  <script src="popup.js"></script>
</body>
</html>`

  const popupJs = `
document.addEventListener('DOMContentLoaded', function() {
  const textInput = document.getElementById('textInput');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');

  startBtn.addEventListener('click', function() {
    const text = textInput.value;
    if (text) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'startTyping',
          text: text
        });
      });
    }
  });

  pauseBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'pauseTyping'});
    });
  });

  stopBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'stopTyping'});
    });
  });
});`

  const contentJs = `
let typingState = {
  isTyping: false,
  isPaused: false,
  currentText: '',
  currentIndex: 0,
  targetElement: null,
  typingSpeed: 50 // WPM
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startTyping') {
    startTyping(request.text);
  } else if (request.action === 'pauseTyping') {
    pauseTyping();
  } else if (request.action === 'stopTyping') {
    stopTyping();
  }
});

function startTyping(text) {
  const activeElement = document.activeElement;
  if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT' || activeElement.contentEditable === 'true')) {
    typingState.targetElement = activeElement;
    typingState.currentText = text;
    typingState.currentIndex = 0;
    typingState.isTyping = true;
    typingState.isPaused = false;
    typeNextCharacter();
  }
}

function typeNextCharacter() {
  if (!typingState.isTyping || typingState.isPaused || typingState.currentIndex >= typingState.currentText.length) {
    return;
  }

  const char = typingState.currentText[typingState.currentIndex];
  
  if (typingState.targetElement.tagName === 'TEXTAREA' || typingState.targetElement.tagName === 'INPUT') {
    typingState.targetElement.value += char;
  } else if (typingState.targetElement.contentEditable === 'true') {
    typingState.targetElement.textContent += char;
  }

  typingState.currentIndex++;
  
  // Calculate delay based on WPM (with some randomness for human-like typing)
  const baseDelay = 60000 / (typingState.typingSpeed * 5); // 5 characters per word average
  const randomDelay = baseDelay + (Math.random() * 50 - 25); // Add ±25ms randomness
  
  setTimeout(typeNextCharacter, Math.max(randomDelay, 10));
}

function pauseTyping() {
  typingState.isPaused = !typingState.isPaused;
  if (!typingState.isPaused) {
    typeNextCharacter();
  }
}

function stopTyping() {
  typingState.isTyping = false;
  typingState.isPaused = false;
  typingState.currentIndex = 0;
}`

  // Create a simple ZIP-like structure (in reality, you'd use a proper ZIP library)
  const files = {
    "manifest.json": manifestContent,
    "popup.html": popupHtml,
    "popup.js": popupJs,
    "content.js": contentJs,
  }

  // For demo purposes, return a simple text representation
  // In production, you'd create an actual ZIP file
  const mockZipContent = Object.entries(files)
    .map(([filename, content]) => `--- ${filename} ---\n${content}\n`)
    .join("\n")

  return Buffer.from(mockZipContent, "utf-8")
}
