# Zentro Outreach Companion - Build Spec

## What We're Building

A single-page local web app that helps a 4-person team do fast, personalized LinkedIn outreach to SF interns looking for housing. No backend, no extension - just an HTML file that runs locally and calls OpenAI API.

## User Flow

1. User visits a LinkedIn profile manually
2. User copies profile info (name, company, school, headline) into the app
3. App generates a personalized message via GPT-4o-mini
4. User copies message, pastes into LinkedIn, sends
5. App logs the outreach to localStorage
6. App warns if someone on the team already messaged this person (dedup)
7. User can export all logs to CSV

## Tech Stack

- Single HTML file (no build process)
- Vanilla JS (no React/Vue)
- Tailwind via CDN
- OpenAI API (GPT-4o-mini) for message generation
- localStorage for persistence
- No backend

## Core Features

### 1. Profile Input Form
Fields:
- `linkedin_url` (text) - the profile URL, used as unique key for dedup
- `name` (text) - first and last name
- `company` (text) - where they're interning
- `role` (text) - their title/headline
- `school` (text) - university
- `signal` (textarea, optional) - any relevant context (recent post, mutual connection, etc.)
- `template` (dropdown) - which message template to use

### 2. Message Templates
Dropdown options:
- `faang` - For Google, Meta, Apple, Amazon, Microsoft interns
- `startup` - For Stripe, Notion, Figma, Airbnb, etc.
- `school` - Lead with school connection
- `high_intent` - When they've posted about housing/moving

### 3. Message Generation
On click "Generate":
- Call OpenAI API with profile data + selected template
- Display generated message in output area
- Show "Copy" button

### 4. Logging
On click "Log & Next":
- Save to localStorage array `zentro_outreach_log`
- Each entry:
```json
{
  "id": "uuid",
  "linkedin_url": "linkedin.com/in/sarah-chen",
  "name": "Sarah Chen",
  "company": "Stripe",
  "role": "SWE Intern",
  "school": "Stanford",
  "signal": "posted about SF move",
  "template": "startup",
  "message": "the generated message text",
  "messaged_by": "user's name from settings",
  "messaged_at": "2026-03-29T14:32:00Z",
  "status": "messaged"
}
```

### 5. Deduplication
Before generating:
- Check if `linkedin_url` exists in localStorage
- If yes, show warning banner: "⚠️ Already messaged by {name} on {date}"
- Allow override with confirmation

### 6. Stats Dashboard
Show at top of page:
- Total messaged (today)
- Total messaged (all time)
- Unique companies reached
- Reply rate (manual entry for now)

### 7. History Table
Scrollable table showing recent outreach:
- Name, Company, Template, Date, Status
- Click row to see full details
- Status dropdown: `messaged` → `replied` → `converted` → `no_response`

### 8. Export
Button to download all logs as CSV

### 9. Settings Panel
Collapsible section:
- `your_name` - Who is using the app (for "messaged_by" field)
- `openai_api_key` - Stored in localStorage (warn user to keep private)
- "Clear All Data" button with confirmation

## OpenAI API Integration

### Endpoint
```
POST https://api.openai.com/v1/chat/completions
```

### Headers
```
Authorization: Bearer {api_key}
Content-Type: application/json
```

### Request Body
```json
{
  "model": "gpt-4o-mini",
  "max_tokens": 150,
  "temperature": 0.7,
  "messages": [
    {
      "role": "system",
      "content": "You write short LinkedIn connection request messages for Zentro, an AI-native rental marketplace helping SF interns find housing. Keep messages under 50 words, casual tone, personalized to the recipient, end with low-friction ask (early access, not a call). Never use generic openers like 'I hope this finds you well'. Be direct and human."
    },
    {
      "role": "user", 
      "content": "Write a message for:\nName: {name}\nCompany: {company}\nRole: {role}\nSchool: {school}\nSignal: {signal}\nTemplate style: {template}\n\nContext: Zentro has placed 40+ interns already. Focus on their specific company/school."
    }
  ]
}
```

### Response Handling
Extract `choices[0].message.content` and display in output area.

## Message Templates (System Prompt Variations)

### FAANG (`faang`)
Emphasize: housing competition is brutal, we've helped FAANG interns specifically, proximity to their office

### Startup (`startup`)
Emphasize: budget-conscious options, roommate matching, startup-friendly pricing

### School (`school`)
Emphasize: "fellow {school} network", we've placed X interns from their school

### High Intent (`high_intent`)
Emphasize: reference their specific post/signal, "saw you're looking for housing"

## UI Design

### Layout
- Header with logo + stats
- Two-column layout on desktop:
  - Left: Input form + generate button
  - Right: Output message + action buttons
- Below: History table (full width)
- Footer: Settings panel (collapsible)

### Style
- Dark theme (near black background)
- Accent color: bright green (#00ff88)
- Monospace font for stats/data
- Clean sans-serif for UI (system font stack is fine)
- Minimal borders, use spacing and subtle backgrounds

### Responsive
- Stack to single column on mobile
- Table becomes card list on mobile

## File Structure

```
zentro-outreach/
├── index.html      # Everything in one file
└── CONTEXT.md      # This file
```

## localStorage Keys

- `zentro_outreach_log` - Array of all outreach entries
- `zentro_settings` - Object with `your_name`, `openai_api_key`

## Edge Cases to Handle

1. **No API key set** - Show setup prompt, don't allow generate
2. **API error** - Show error message, don't clear form
3. **Duplicate URL** - Warning banner but allow override
4. **Empty required fields** - Disable generate button
5. **localStorage full** - Show warning, offer export + clear

## Definition of Done

- [ ] Can enter profile details and select template
- [ ] Generates personalized message via OpenAI
- [ ] Shows dedup warning if URL already in log
- [ ] Logs outreach with timestamp and user name
- [ ] Displays stats (today count, total count)
- [ ] Shows history table with status updates
- [ ] Exports to CSV
- [ ] Settings panel for API key and name
- [ ] Works offline after initial load (except API calls)
- [ ] Looks good on desktop (mobile is bonus)

## Sample Test Data

```
Name: Sarah Chen
Company: Stripe
Role: Incoming SWE Intern
School: Stanford
Signal: Posted "so excited for my SF summer!"
Template: startup
```

Expected output (example):
```
Hey Sarah - congrats on Stripe! Saw your post about the SF move. I'm building Zentro to help interns find housing fast (we've placed 40+ already, mostly Stanford/Berkeley). Want early access? Takes 2 min to get matched.
```

## Future Enhancements (Not MVP)

- Chrome extension that auto-scrapes LinkedIn profile
- Team sync via shared Google Sheet or Supabase
- Reply tracking via LinkedIn scraping
- A/B testing different templates
- Bulk import from LinkedIn search export

## Notes for Claude Code

- Keep everything in ONE index.html file
- Use Tailwind CDN for styling
- No build step, no npm, no framework
- Test by opening index.html directly in browser
- API key is entered by user in settings, stored in localStorage
- Warn user not to share the HTML file (contains their key in localStorage)
