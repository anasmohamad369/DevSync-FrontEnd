import api from "@/lib/httpCilent";
import React from "react";

// types/User.ts
 interface UserProfile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const useProfile = () => {
const [data, setData] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("api/auth/me"); // Adjust the endpoint as needed
      console.log(response)    
      setData(response?.data);
    } catch (err: any) {
      setError(err);
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
