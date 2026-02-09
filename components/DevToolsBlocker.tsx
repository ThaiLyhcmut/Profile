"use client"

import { useEffect } from 'react'

export default function DevToolsBlocker() {
  useEffect(() => {
    // 1. Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // 2. Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        return false
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return false
      }

      // Cmd+Option+I (Mac DevTools)
      if (e.metaKey && e.altKey && e.key === 'i') {
        e.preventDefault()
        return false
      }

      // Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && e.key === 'j') {
        e.preventDefault()
        return false
      }

      // Cmd+Option+C (Mac Inspect)
      if (e.metaKey && e.altKey && e.key === 'c') {
        e.preventDefault()
        return false
      }
    }

    // 3. Detect DevTools open (check window size changes)
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160
      const heightThreshold = window.outerHeight - window.innerHeight > 160

      if (widthThreshold || heightThreshold) {
        // DevTools might be open
        document.body.innerHTML = `
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #0f172a;
            color: #00d4aa;
            font-family: monospace;
            font-size: 24px;
            text-align: center;
            padding: 20px;
          ">
            <div>
              <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
              <div>Developer Tools Detected</div>
              <div style="font-size: 14px; margin-top: 10px; color: #94a3b8;">
                Please close DevTools and refresh the page
              </div>
            </div>
          </div>
        `
      }
    }

    // 4. Clear console periodically
    const clearConsole = () => {
      if (typeof console !== 'undefined') {
        console.clear()
      }
    }

    // 5. Disable text selection (optional - might annoy users)
    // document.body.style.userSelect = 'none'

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    // Check for DevTools every 1 second
    const devToolsInterval = setInterval(detectDevTools, 1000)

    // Clear console every 5 seconds
    const consoleInterval = setInterval(clearConsole, 5000)

    // Initial check
    detectDevTools()

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      clearInterval(devToolsInterval)
      clearInterval(consoleInterval)
      // document.body.style.userSelect = 'auto'
    }
  }, [])

  return null
}
