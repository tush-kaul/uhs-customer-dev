"use client";

import React, { createContext, useContext, useState } from "react";

// Define the shape of our user data
interface UserData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  [key: string]: any;
}

// Define the context type
interface UserDataContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  updateUserData: (data: Partial<UserData>) => void;
  resetUserData: () => void;
  dataLoading: boolean;
  setDataLoading: (isLoading: boolean) => void;
}

// Create the context with a default value
const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

// Provider component that will wrap your signup flow
export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userData, setUserData] = useState<UserData>({});
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  // Helper function to update user data
  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  // Helper function to reset user data
  const resetUserData = () => {
    setUserData({});
  };

  return (
    <UserDataContext.Provider
      value={{
        userData,
        setUserData,
        updateUserData,
        resetUserData,
        dataLoading,
        setDataLoading,
      }}>
      {children}
    </UserDataContext.Provider>
  );
};

// Custom hook for accessing the user data context
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
