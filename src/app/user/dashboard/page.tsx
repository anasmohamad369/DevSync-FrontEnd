"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useProfile from "@/hooks/useProfile";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, MessageCircle, Users, Wifi, WifiOff } from "lucide-react";
import useFetchMessage from "@/hooks/useFetchMessage";

const socket = io("http://localhost:5000"); // your backend URL

interface ChatMessage {
  username: string;
  message: string;
  timestamp?: Date;
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const { data: Profiledata, loading, error, fetchProfile } = useProfile();
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    fetchMessages,
  } = useFetchMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchProfile();
    fetchMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setChatLog(
        messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp), // use actual timestamp from DB
        }))
      );
    }
  }, [messages]);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("chatMessage", (data: ChatMessage) => {
      setChatLog((prev) => [...prev, { ...data, timestamp: new Date() }]);
    });

    socket.on("userCount", (count: number) => {
      setOnlineCount(count);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("userCount");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const data = {
      username: Profiledata?.name || "Anonymous",
      message: message.trim(),
    };
    socket.emit("chatMessage", data);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">Error loading profile: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="flex flex-col h-[calc(100vh-2rem)] max-w-7xl mx-auto">
        <Card className="flex-1 flex flex-col shadow-lg">
          {/* Header */}
          <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r  from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    DevSync Chat
                  </CardTitle>
                  <p className="text-blue-100 text-sm">
                    Welcome, {Profiledata?.name || "Anonymous"}!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={isConnected ? "secondary" : "destructive"}
                  className="bg-white/20 text-white border-white/30"
                >
                  {isConnected ? (
                    <>
                      <Wifi className="h-3 w-3 mr-1" />
                      Connected
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 mr-1" />
                      Disconnected
                    </>
                  )}
                </Badge>

                <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                  <Users className="h-4 w-4" />
                  <span>{onlineCount}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-4">
                {chatLog.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      No messages yet
                    </h3>
                    <p className="text-slate-500">
                      Be the first to start the conversation!
                    </p>
                  </div>
                ) : (
                  chatLog.map((entry, index) => {
                    const isOwnMessage = entry.username === Profiledata?.name;
                    const showAvatar =
                      index === 0 ||
                      chatLog[index - 1].username !== entry.username;

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${
                          isOwnMessage ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {showAvatar ? (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="text-xs font-medium">
                              {getInitials(entry.username)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8 flex-shrink-0" />
                        )}

                        <div
                          className={`flex flex-col ${
                            isOwnMessage ? "items-end" : "items-start"
                          } max-w-[75%]`}
                        >
                          {showAvatar && (
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs font-medium text-slate-600 ${
                                  isOwnMessage ? "order-2" : "order-1"
                                }`}
                              >
                                {isOwnMessage ? "You" : entry.username}
                              </span>
                              {entry.timestamp && (
                                <span
                                  className={`text-xs text-slate-400 ${
                                    isOwnMessage ? "order-1" : "order-2"
                                  }`}
                                >
                                  {formatTime(entry.timestamp)}
                                </span>
                              )}
                            </div>
                          )}

                          <div
                            className={`rounded-2xl px-4 py-2 text-sm break-words shadow-sm ${
                              isOwnMessage
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                : "bg-white border border-slate-200 text-slate-800"
                            } ${!showAvatar ? "mt-1" : ""}`}
                          >
                            {entry.message}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator />

            {/* Message Input */}
            <div className="p-6 bg-slate-50/50">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="pr-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-slate-400">
                      {message.length}/500
                    </span>
                  </div>
                </div>

                <Button
                  onClick={sendMessage}
                  disabled={!message.trim() || !isConnected}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <span>Press Enter to send • Shift + Enter for new line</span>
                <span
                  className={isConnected ? "text-green-600" : "text-red-500"}
                >
                  {isConnected ? "● Online" : "● Offline"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
