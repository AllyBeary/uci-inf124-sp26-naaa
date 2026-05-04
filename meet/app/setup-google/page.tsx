"use client";

import { useState } from "react";
import Link from "next/link";

export default function GoogleCalendarSetup() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production, you'd send this securely to your backend
    // For now, just validate the format
    if (clientId.includes("googleusercontent.com") && clientSecret.length > 0) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Please enter valid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Calendar
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Google Calendar Setup</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">1. Create Google Cloud Project</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Google Cloud Console</a></li>
                <li>Create a new project</li>
                <li>Enable the Google Calendar API</li>
                <li>Create OAuth 2.0 credentials (OAuth client ID)</li>
                <li>Add authorized redirect URIs:
                  <div className="mt-2 p-2 bg-gray-100 rounded font-mono text-sm">
                    http://localhost:3001/api/auth/callback/google
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">2. Configure Environment Variables</h2>
              <p className="text-gray-700 mb-4">
                Add these to your <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file:
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NEXT_PUBLIC_GOOGLE_CLIENT_ID
                  </label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Your Google Client ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GOOGLE_CLIENT_SECRET
                  </label>
                  <input
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="Your Google Client Secret"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The Google OAuth integration requires you to set up a Google Cloud project first. 
                Once configured, users can authorize the calendar to access their Google Calendar events.
              </p>
            </div>

            <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Return to Calendar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
