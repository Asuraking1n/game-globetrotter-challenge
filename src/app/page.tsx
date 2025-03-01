"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import UserRegistration from "@/components/UserRegistration";
import GameBoard from "@/components/GameBoard";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [invitedBy, setInvitedBy] = useState<string | null>(null);

  useEffect(() => {
    // Check if user was invited
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const inviteParam = urlParams.get("invite");
      if (inviteParam) {
        setInvitedBy(inviteParam);
      }
    }

    // Check if user is already registered in localStorage
    const savedUser = localStorage.getItem("globetrotter_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
      }
    }
  }, []);

  const handleRegister = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("globetrotter_user", JSON.stringify(newUser));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("globetrotter_user", JSON.stringify(updatedUser));
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      {user ? (
        <GameBoard
          user={user}
          onUpdateUser={handleUpdateUser}
          invitedBy={invitedBy || undefined}
        />
      ) : (
        <UserRegistration onRegister={handleRegister} />
      )}
    </main>
  );
}
