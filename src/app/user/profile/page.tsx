"use client";
import { Skeleton } from "@/components/ui/skeleton";
import useProfile from "@/hooks/useProfile";
import Profile from "@/utils/profile/Profile";
import React, { useEffect } from "react";

const page = () => {
  const { data, loading, error, fetchProfile } = useProfile();
  console.log(data)
  

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 font-semibold">⚠️ Error: {error}</div>
    );
  }

  if (!data) {
    return <div className="p-6 text-gray-600">No profile data available.</div>;
  }

  return (
    <>
      <Profile {...data} />
    </>
  );
};

export default page;
