'use client';
import React from 'react';

 interface UserProfile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}


const Profile: React.FC<UserProfile> = ({ _id, name, email, createdAt, updatedAt }) => {
  return (
    <div className="p-6 flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-indigo-100 text-indigo-700 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
            {name.charAt(0)}
          </div>
          <h2 className="text-2xl font-semibold text-indigo-700">Profile Overview</h2>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Full Name</span>
            <span>{name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Email Address</span>
            <span>{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">User ID</span>
            <span className="text-xs text-gray-500">{_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Joined On</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Last Updated</span>
            <span>{new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
