"use client"

import type React from "react"

import { useEffect, useRef, useCallback, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ArrowUpIcon, Paperclip, MessageSquarePlus, MessageSquare, Minimize2, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TextShimmer } from "@/components/ui/text-shimmer"

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
  const messagesContainerRef = useRef<HTMLDivElement>(null); // Ref for message container

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

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

  // Add useEffect for scrolling
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      // Use scrollTop for smooth scrolling to the bottom
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [currentSession?.messages]); // Trigger when messages change

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
    <div className="flex flex-col items-center w-full h-[calc(100vh-5rem)] overflow-hidden">
      <AnimatePresence mode="wait">
        {initialState && !inSession ? (
          <motion.div
            key="chat-input"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
            className="flex flex-col justify-start items-center w-full max-w-4xl h-full mx-auto p-4 mt-40 space-y-4 overflow-hidden"
          >
            <TextShimmer as="h1" className="text-4xl font-bold mb-0">
              Everything Counter Strike
            </TextShimmer>
            <p className="text-gray-400 text-center max-w-2xl">
              Ask about skin prices, market trends, or anything else.
            </p>

            <div className="w-3/4 mx-auto mt-auto">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex w-full h-[calc(100vh-5rem)]"
          >
            {/* Sidebar */}
            <motion.div
              className={cn(
                "bg-neutral-900 border-r border-neutral-800 h-full transition-all duration-300 flex flex-col",
                sidebarOpen ? "w-64" : "w-20",
              )}
              initial={{ width: sidebarOpen ? 256 : 80 }}
              animate={{ width: sidebarOpen ? 256 : 80 }}
            >
              <div className="p-3 flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={startNewChat}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-800 text-white"
                  >
                    <MessageSquarePlus className="h-5 w-5" />
                    {sidebarOpen && <span>New Chat</span>}
                  </button>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 -ml-1 rounded-md hover:bg-neutral-800">
                  <Minimize2
                    className={cn("h-5 w-5 text-neutral-400 transition-transform", !sidebarOpen && "rotate-180")}
                  />
                </button>
              </div>

              <div className="flex-1 p-2 overflow-y-auto">
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
                      {sidebarOpen && (
                        <span className="truncate text-sm">
                          {session.messages[0]?.content.split(' ').slice(0, 3).join(' ')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Profile Section */}
              {sidebarOpen && (
                <div className="p-3 border-t border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">Guest</span>
                      <span className="text-xs text-neutral-400">Free Account</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4" ref={messagesContainerRef}>
                <AnimatePresence mode="wait">
                  {!inSession && backgroundVisible && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full gap-4 mt-40"
                    >
                      <TextShimmer as="h1" className="text-4xl font-bold mb-0">
                        Everything Counter Strike
                      </TextShimmer>
                      <p className="text-gray-400 text-center max-w-2xl">
                        Ask about skin prices, market trends, or anything else.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {currentSession && (
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
                )}
              </div>
              <div className="flex-none p-4">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
