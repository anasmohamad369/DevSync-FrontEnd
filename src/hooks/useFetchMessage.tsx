
import api from "@/lib/httpCilent";
import  {useState} from "react";

interface ChatMessage {
  username: string;
  message: string;
  timestamp: Date;
}

const useFetchMessage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = api.get("/api/chat"); // Adjust the endpoint as needed
      setMessages((await response).data);
    } catch (err) {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };
  return { messages, loading, error, fetchMessages };
};

export default useFetchMessage;
