import api from "@/lib/httpCilent";
import React, {useState} from "react";

// types/User.ts
 interface UserProfile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const useProfile = () => {
const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("api/auth/me"); // Adjust the endpoint as needed
      console.log(response)    
      setData(response?.data);
    } catch {
      setError("error fetching profile");
    } finally {
      setLoading(false);
    }
  };
  return {
    data,
    loading,
    error,
    fetchProfile,
  };
};

export default useProfile;
