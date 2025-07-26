import api from "@/lib/httpCilent";
import React from "react";

const useFetchMessage = () => {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = api.get("/api/chat"); // Adjust the endpoint as needed
      setMessages((await response).data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  return { messages, loading, error, fetchMessages };
};

export default useFetchMessage;
