# Google Calendar Integration Setup Guide

## Overview
Your calendar application now includes Google Calendar API integration. This guide will help you set up the integration.

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top and select "NEW PROJECT"
3. Enter a project name (e.g., "Shared Calendar App")
4. Click "Create"

## Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on the result and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, create an OAuth consent screen first:
   - Select "External" user type
   - Fill in the required fields (app name, user support email, etc.)
   - Add your email as a test user
   - Save and continue
4. Back on the credentials page, click "Create Credentials" > "OAuth client ID" again
5. Select "Web application"
6. Under "Authorized redirect URIs", add:
   ```
   http://localhost:3001/api/auth/callback/google
   ```
7. Click "Create"
8. Copy your Client ID and Client Secret

## Step 4: Configure Environment Variables

1. Open `.env.local` in your project root
2. Update these values with your credentials:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   NEXTAUTH_URL=http://localhost:3001
   ```

## Step 5: Restart the Development Server

```bash
npm run dev
```

## Step 6: Access the Setup Page

1. Navigate to `http://localhost:3001/setup-google`
2. You should see instructions for completing the setup
3. Users can now authorize their Google Calendar

## Integration Features

### Current Implementation
- Users can sign in with their Google account
- The app stores user information for authenticated requests
- Events are synced from Google Calendar

### How It Works
1. Users click "Setup Google Calendar" in the header
2. They authenticate with their Google account
3. The app receives their authorization
4. Calendar events are fetched and displayed

## API Endpoints

### GET /api/google-events
Fetches events from Google Calendar for a specified time range.

**Request Body:**
```json
{
  "accessToken": "user_access_token",
  "timeMin": "2026-04-01T00:00:00Z",
  "timeMax": "2026-04-30T23:59:59Z"
}
```

**Response:**
```json
{
  "events": [
    {
      "id": "event_id",
      "summary": "Event Title",
      "start": { "dateTime": "2026-04-15T10:00:00Z" },
      "end": { "dateTime": "2026-04-15T11:00:00Z" }
    }
  ]
}
```

## Troubleshooting

### "Invalid Client ID"
- Verify your `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is correct in `.env.local`
- Make sure the Client ID is for a Web application type
- Restart the dev server after updating `.env.local`

### "Redirect URI Mismatch"
- Check that your authorized redirect URI matches exactly
- Make sure you're testing on `http://localhost:3001` (not 3000)
- Update the redirect URI in Google Cloud Console if needed

### Events Not Showing
- Verify the user is properly authenticated
- Check browser console for error messages
- Ensure the Google Calendar API is enabled in your project

## Additional Resources
- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
