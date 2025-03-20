// import { useState, useEffect } from "react";
// import { User } from "@/types";
import UserRegistration from "@/components/UserRegistration";
import GameBoard from "@/components/GameBoard";

const Home = async () => {
  // const [user, setUser] = useState<User | null>({
  //   username: "anonymous",
  //   score: {
  //     correct: 0,
  //     incorrect: 0,
  //   },
  // });
  // const [invitedBy, setInvitedBy] = useState<string | null>(null);

  // useEffect(() => {
  //   // Check if user was invited
  //   if (typeof window !== "undefined") {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const inviteParam = urlParams.get("invite");
  //     if (inviteParam) {
  //       setInvitedBy(inviteParam);
  //     }
  //   }

  //   // Check if user is already registered in localStorage
  //   const savedUser = localStorage.getItem("globetrotter_user");
  //   if (savedUser) {
  //     try {
  //       setUser(JSON.parse(savedUser));
  //     } catch (error) {
  //       console.error("Error parsing saved user:", error);
  //     }
  //   }
  // }, []);

  // const handleRegister = (newUser: User) => {
  //   setUser(newUser);
  //   localStorage.setItem("globetrotter_user", JSON.stringify(newUser));
  // };

  // const handleUpdateUser = (updatedUser: User) => {
  //   setUser(updatedUser);
  //   localStorage.setItem("globetrotter_user", JSON.stringify(updatedUser));
  // };

  const fetchDestination = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/destinations");

      if (!response.ok) {
        throw new Error("Failed to fetch destination");
      }

      const data = await response.json();
      return data;

      // setGameState((prev) => ({
      //   ...prev,
      //   destination: data.destination,
      //   options: data.options,
      //   selectedOption: null,
      //   isCorrect: null,
      //   isLoading: false,
      //   showFeedback: false,
      // }));
    } catch (error) {
      console.log(error);
      // setGameState((prev) => ({
      //   ...prev,
      //   error: error instanceof Error ? error.message : "An error occurred",
      //   isLoading: false,
      // }));
    }
  };

  const destinationFromApi = await fetchDestination();

  const gameId = destinationFromApi?.gameId;

  // if (!destinationFromApi?.destination) {
  //   return "Loading...";
  // }

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      {/* {user ? (
        <GameBoard
          user={user}
          onUpdateUser={handleUpdateUser}
          invitedBy={invitedBy || undefined}
        />
      ) : (
        <UserRegistration onRegister={handleRegister} />
      )} */}
      {/* <UserRegistration onRegister={handleRegister} /> */}
      <GameBoard destinationFromApi={destinationFromApi} gameId={gameId} />
    </main>
  );
};

export default Home;
