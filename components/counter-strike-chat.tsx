"use client"

import type React from "react"

import { useEffect, useRef, useCallback, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ArrowUpIcon, Paperclip, PlusCircle, MessageSquare, ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current
      if (!textarea) return

      if (reset) {
        textarea.style.height = `${minHeight}px`
        return
      }

      // Temporarily shrink to get the right scrollHeight
      textarea.style.height = `${minHeight}px`

      // Calculate new height
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY))

      textarea.style.height = `${newHeight}px`
    },
    [minHeight, maxHeight],
  )

  useEffect(() => {
    // Set initial height
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = `${minHeight}px`
    }
  }, [minHeight])

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [adjustHeight])

  return { textareaRef, adjustHeight }
}

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatSession {
  id: string
  messages: Message[]
  createdAt: Date
}

export function CounterStrikeChat() {
  const [value, setValue] = useState("")
  const [inSession, setInSession] = useState(false)
  const [initialState, setInitialState] = useState(true) // Track if we're in the very first state
  const [activeChat, setActiveChat] = useState(false) // Track if we have an active chat with messages
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [backgroundVisible, setBackgroundVisible] = useState(true)

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  })

  // Notify parent component about session state
  useEffect(() => {
    // Use a custom event to communicate with parent component
    const event = new CustomEvent("sessionStateChange", {
      detail: { inSession, backgroundVisible },
    })
    window.dispatchEvent(event)
  }, [inSession, backgroundVisible])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = () => {
    if (!value.trim()) return

    if (initialState || !currentSession) {
      // Start a new session
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        messages: [
          {
            id: `msg-${Date.now()}`,
            content: value,
            isUser: true,
            timestamp: new Date(),
          },
        ],
        createdAt: new Date(),
      }

      setSessions((prev) => [...prev, newSession])
      setCurrentSession(newSession)
      setInSession(true)
      setInitialState(false)
      setActiveChat(true)

      // Fade out background after a short delay
      setTimeout(() => {
        setBackgroundVisible(false)
      }, 300)
    } else {
      // Add message to current session
      const newMessage = {
        id: `msg-${Date.now()}`,
        content: value,
        isUser: true,
        timestamp: new Date(),
      }

      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, newMessage],
      }

      setSessions((prev) => prev.map((session) => (session.id === currentSession.id ? updatedSession : session)))

      setCurrentSession(updatedSession)
      setActiveChat(true)

      // Fade out background if it's visible (new chat state)
      if (backgroundVisible) {
        setTimeout(() => {
          setBackgroundVisible(false)
        }, 300)
      }

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: `msg-${Date.now() + 1}`,
          content:
            "This is a simulated response about Counter Strike. I can provide information about weapons, maps, strategies, and more.",
          isUser: false,
          timestamp: new Date(),
        }

        const updatedWithAiSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, aiResponse],
        }

        setSessions((prev) =>
          prev.map((session) => (session.id === currentSession.id ? updatedWithAiSession : session)),
        )

        setCurrentSession(updatedWithAiSession)
      }, 1000)
    }

    setValue("")
    adjustHeight(true)
  }

  const startNewChat = () => {
    // Clear the current session but keep the sidebar
    setCurrentSession(null)
    setActiveChat(false)

    // Show background animations
    setBackgroundVisible(true)

    // Keep inSession true if we've already had at least one session
    if (!initialState) {
      setInSession(true)
    }
  }

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session)
    setInSession(true)
    setInitialState(false)
    setActiveChat(true)
    setBackgroundVisible(false)
  }

  // Helper function to determine bubble size class based on content length
  const getBubbleSizeClass = (content: string) => {
    const length = content.length
    if (length < 50) return "max-w-[40%]"
    if (length < 100) return "max-w-[60%]"
    return "max-w-[80%]"
  }

  // Function to exit chat completely and return to initial state
  const exitChat = () => {
    setInSession(false)
    setInitialState(true)
    setCurrentSession(null)
    setActiveChat(false)
    setBackgroundVisible(true)
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <AnimatePresence>
        {initialState && !inSession ? (
          <motion.div
            key="chat-input"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 100, transition: { duration: 0.5, ease: "easeInOut" } }}
            className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-4"
          >
            <h1 className="text-4xl font-bold text-white mb-0">Everything Counter Strike</h1>
            <p className="text-gray-400 text-center max-w-2xl">
              Ask about skin prices, market trends, or anything else.
            </p>

            <div className="w-3/4 mx-auto">
              <div className="relative bg-neutral-900 rounded-xl border border-neutral-800">
                <div className="overflow-y-auto">
                  <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value)
                      adjustHeight()
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Counter Strike..."
                    className={cn(
                      "w-full px-4 py-3",
                      "resize-none",
                      "bg-transparent",
                      "border-none",
                      "text-white text-sm",
                      "focus:outline-none",
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      "placeholder:text-neutral-500 placeholder:text-sm",
                      "min-h-[60px]",
                    )}
                    style={{
                      overflow: "hidden",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Paperclip className="w-4 h-4 text-white" />
                      <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">Attach</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      className={cn(
                        "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1",
                        value.trim() ? "bg-white text-black" : "text-zinc-400",
                      )}
                    >
                      <ArrowUpIcon className={cn("w-4 h-4", value.trim() ? "text-black" : "text-zinc-400")} />
                      <span className="sr-only">Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat-session"
            initial={{ opacity: 0, y: 100, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex w-full h-screen"
          >
            {/* Sidebar */}
            <motion.div
              className={cn(
                "bg-neutral-900 border-r border-neutral-800 h-full transition-all duration-300",
                sidebarOpen ? "w-64" : "w-16",
              )}
              initial={{ width: sidebarOpen ? 256 : 64 }}
              animate={{ width: sidebarOpen ? 256 : 64 }}
            >
              <div className="p-3 flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={startNewChat}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-800 text-white"
                  >
                    <PlusCircle className="h-5 w-5" />
                    {sidebarOpen && <span>New Chat</span>}
                  </button>

                  {sidebarOpen && (
                    <button
                      onClick={exitChat}
                      className="p-2 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white"
                    >
                      Exit
                    </button>
                  )}
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-md hover:bg-neutral-800">
                  <ChevronLeft
                    className={cn("h-5 w-5 text-neutral-400 transition-transform", !sidebarOpen && "rotate-180")}
                  />
                </button>
              </div>

              <div className="p-2">
                <div className="mt-2 space-y-1">
                  {sessions.map((session, index) => (
                    <button
                      key={session.id}
                      onClick={() => selectSession(session)}
                      className={cn(
                        "flex items-center gap-2 w-full p-2 rounded-md text-left truncate",
                        currentSession?.id === session.id
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                      )}
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      {sidebarOpen && <span className="truncate text-sm">Chat {index + 1}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentSession ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="w-3/4 mx-auto">
                      {currentSession.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn("flex mb-4", message.isUser ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "p-3 rounded-lg inline-block",
                              getBubbleSizeClass(message.content),
                              message.isUser ? "bg-primary text-primary-foreground" : "bg-neutral-800 text-white",
                            )}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-4">
                    <div className="relative bg-neutral-900 rounded-xl border border-neutral-800 w-3/4 mx-auto">
                      <div className="overflow-y-auto">
                        <Textarea
                          ref={textareaRef}
                          value={value}
                          onChange={(e) => {
                            setValue(e.target.value)
                            adjustHeight()
                          }}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask about Counter Strike..."
                          className={cn(
                            "w-full px-4 py-3",
                            "resize-none",
                            "bg-transparent",
                            "border-none",
                            "text-white text-sm",
                            "focus:outline-none",
                            "focus-visible:ring-0 focus-visible:ring-offset-0",
                            "placeholder:text-neutral-500 placeholder:text-sm",
                            "min-h-[60px]",
                          )}
                          style={{
                            overflow: "hidden",
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Paperclip className="w-4 h-4 text-white" />
                            <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                              Attach
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSendMessage}
                            className={cn(
                              "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1",
                              value.trim() ? "bg-white text-black" : "text-zinc-400",
                            )}
                          >
                            <ArrowUpIcon className={cn("w-4 h-4", value.trim() ? "text-black" : "text-zinc-400")} />
                            <span className="sr-only">Send</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Empty state when no session is selected but sidebar is visible
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-white">What can I help you with?</h2>
                    <p className="text-neutral-400">
                    Ask about skin prices, market trends, or anything else.
                    </p>

                    <div className="relative bg-neutral-900 rounded-xl border border-neutral-800 w-full max-w-3xl mx-auto mt-6">
                      <div className="overflow-y-auto">
                        <Textarea
                          ref={textareaRef}
                          value={value}
                          onChange={(e) => {
                            setValue(e.target.value)
                            adjustHeight()
                          }}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask about Counter Strike..."
                          className={cn(
                            "w-full px-4 py-3",
                            "resize-none",
                            "bg-transparent",
                            "border-none",
                            "text-white text-sm",
                            "focus:outline-none",
                            "focus-visible:ring-0 focus-visible:ring-offset-0",
                            "placeholder:text-neutral-500 placeholder:text-sm",
                            "min-h-[60px]",
                          )}
                          style={{
                            overflow: "hidden",
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Paperclip className="w-4 h-4 text-white" />
                            <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                              Attach
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSendMessage}
                            className={cn(
                              "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1",
                              value.trim() ? "bg-white text-black" : "text-zinc-400",
                            )}
                          >
                            <ArrowUpIcon className={cn("w-4 h-4", value.trim() ? "text-black" : "text-zinc-400")} />
                            <span className="sr-only">Send</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
