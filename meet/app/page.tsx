"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";

export default function Home() {
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [processedGoogleEvents, setProcessedGoogleEvents] = useState<Array<{
    dayIndex: number;
    startHour: number;
    endHour: number;
    duration: number;
    event: {
      id: string;
      summary: string;
    };
  }>>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Check for stored authentication on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("google_access_token");
    const storedEmail = localStorage.getItem("google_user_email");

    if (storedToken && storedEmail) {
      setIsLoggedIn(true);
      setAccessToken(storedToken);
      fetchGoogleEvents(storedToken, currentDate);
    }
  }, []);

  // Fetch Google Calendar events when date changes
  useEffect(() => {
    if (isLoggedIn && accessToken) {
      fetchGoogleEvents(accessToken, currentDate);
    }
  }, [currentDate, isLoggedIn, accessToken]);

  const fetchGoogleEvents = async (token: string, date: Date) => {
    try {
      // Get week start and end
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1); // Monday
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // Sunday

      const timeMin = weekStart.toISOString();
      const timeMax = weekEnd.toISOString();

      const response = await fetch("/api/google-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken: token, timeMin, timeMax }),
      });

      if (response.ok) {
        const data = await response.json();
        setProcessedGoogleEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
    }
  };

  const handleAccessTokenChange = (token: string | null) => {
    setAccessToken(token);
    if (token) {
      setIsLoggedIn(true);
      // Don't call fetchGoogleEvents here - the useEffect will handle it
    } else {
      setIsLoggedIn(false);
      setProcessedGoogleEvents([]);
    }
  };

  const handleUserChange = (user: { name: string; email: string } | null) => {
    if (!user) {
      setIsLoggedIn(false);
      setAccessToken(null);
      setProcessedGoogleEvents([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header
        onAccessTokenChange={handleAccessTokenChange}
        onUserChange={handleUserChange}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedPeople={[]}
          onSelectedPeopleChange={() => {}}
          currentDate={currentDate}
          onCurrentDateChange={setCurrentDate}
          showAvailability={false}
        />
        <Calendar
          selectedPeople={[]}
          currentDate={currentDate}
          googleEvents={processedGoogleEvents}
          isLoggedIn={isLoggedIn}
          showAvailability={false}
        />
      </div>
    </div>
  );
}
