# PROMPT: How to Extract a Detailed Chat Transcript for Domain Wiki

**USE THIS PROMPT:** In a conversation you want to capture, paste this prompt at the END of the chat (or whenever you want to create a transcript).

**WHAT IT DOES:** Guides Claude to read back through the chat and create a comprehensive, detailed transcript suitable for ingestion as a raw source into your domain wiki.

---

## THE EXTRACTION PROMPT (Copy & Paste This)

```
You are helping me create a detailed, raw transcript of this entire chat 
for my domain wiki (Leopold trading system).

Please do the following:

1. READ the entire chat from beginning to end (scroll up, read everything)

2. CREATE a structured transcript with these sections:

   ✓ HEADER: Title, date, purpose, key participants
   ✓ OVERVIEW: 1-2 paragraph summary of what was discussed
   ✓ SECTIONS: Break chat into logical sections (5-10 sections)
   ✓ EACH SECTION: 
     - Section header (descriptive name)
     - Summary of discussion
     - Key quotes/paraphrases
     - Key decisions/insights
     - Any diagrams/frameworks discussed
   ✓ KEY DECISIONS: List all major decisions/conclusions
   ✓ ARTIFACTS: List any files/documents created
   ✓ ACTION ITEMS: What was decided to do next
   ✓ NOTES: Important caveats, assumptions, open questions
   ✓ FOOTER: Status, next steps, related topics

3. TONE: Raw, factual, minimal editorializing
   - Don't judge the ideas
   - Don't add analysis beyond what was said
   - Do capture nuance and context
   - Do note when decisions were uncertain

4. DETAIL: Be comprehensive
   - Include technical details if discussed
   - Include reasoning behind decisions
   - Include alternatives considered
   - Include trade-offs analyzed
   - Include metrics/targets discussed

5. FORMAT: Clean, readable, scannable
   - Use section breaks (===)
   - Use clear headers
   - Use bullet points where appropriate
   - Use bold for key terms
   - But avoid over-formatting

6. LENGTH: Don't worry about length
   - A 2-hour chat should be 2000-4000 words
   - A 30-min focused chat should be 1000-2000 words
   - More is better for raw sources
   - This is for ingestion into wiki, not for reading

7. OUTPUT: Plain text format (not markdown)
   - Simple, no fancy formatting
   - But organized clearly
   - Good for domain wiki raw sources

When you're done, show me:
- Total word count
- Number of sections
- Key decisions (bulleted list)
- Artifacts created (bulleted list)
- Next steps (bulleted list)

IMPORTANT: This transcript will be ingested into my domain wiki as a raw source.
Make it detailed, factual, and comprehensive.
```

---

## HOW TO USE THIS PROMPT

### **When to Use:**

1. **After an important decision chat** — When you've had a substantive discussion that shaped your thinking
2. **After a learning session** — When you've explored a new topic
3. **After a design session** — When you've planned something new
4. **After a problem-solving session** — When you've debugged or figured something out

### **Step by Step:**

**Step 1: Have your chat**
- Discuss whatever topic you want captured
- Let it develop naturally
- Don't worry about structure (you'll add it later)

**Step 2: At the end, paste the prompt above**
Just copy the entire "EXTRACTION PROMPT" section and paste it into the chat.

**Step 3: Wait for Claude to read & analyze**
Claude will scroll back, read entire chat, create transcript.

**Step 4: Review the output**
Read through what Claude created.
- Does it capture the key points?
- Are sections logical?
- Is anything missing?

**Step 5: Ask for revisions if needed**
```
Can you expand section X with more detail about Y?
Can you add a section about Z that we didn't explicitly discuss but came up?
Can you reorganize section X and Y?
```

**Step 6: Copy the final transcript**
Copy the entire transcript Claude created.

**Step 7: Save as raw source**
Create file: `raw/claude-chats/YYYY-MM-DD_TOPIC.txt`
Paste transcript content.
Save.

**Step 8: Tell me it's ready**
"I've created a new raw source, ready to ingest into wiki."

---

## WHAT THE OUTPUT LOOKS LIKE

Claude will create something like this structure:

```
================================================================================
[TITLE OF CHAT]
Date, participants, purpose
================================================================================

OVERVIEW
[2-3 paragraphs summarizing what was discussed]

================================================================================
SECTION 1: [Topic Name]
================================================================================

[Summary of discussion]

Key points:
- Point 1
- Point 2
- Point 3

Relevant quote/paraphrase: [what was actually said]

Decision/Insight: [what was concluded]

================================================================================
SECTION 2: [Topic Name]
================================================================================

[Same structure]

...

================================================================================
KEY DECISIONS MADE
================================================================================

- Decision 1: [details]
- Decision 2: [details]
- Decision 3: [details]

================================================================================
ARTIFACTS CREATED
================================================================================

- Artifact 1: [description]
- Artifact 2: [description]

================================================================================
NEXT STEPS
================================================================================

- Step 1: [what's next]
- Step 2: [what's next]

================================================================================
```

---

## EXAMPLES: What Chats to Capture

**Good candidates:**
✓ Chat about Leopold thesis refinement
✓ Chat about regime modeling strategy
✓ Chat about tool design for RocketShip
✓ Chat about RL training approach
✓ Chat about backtesting strategy
✓ Chat about portfolio construction
✓ Chat about mentorship feedback
✓ Chat about any major decision

**Not necessary:**
✗ Quick fact-checking chats
✗ Debugging sessions (unless they led to insights)
✗ Casual "how do I do X" chats
✗ Questions already answered elsewhere

**Rule of thumb:** If you spent >30 min on it and it shaped your thinking → capture it as raw source.

---

## WHY THIS MATTERS FOR YOUR WIKI

**When you ingest transcripts:**

Claude reads your actual reasoning in the moment.
- Not reconstructed later (memory can be unreliable)
- Not edited/cleaned up (raw thinking)
- With context and alternatives considered
- With actual quotes and reasoning

**Your wiki can then show:**
- When you first thought about X
- How your thinking evolved
- What alternatives you considered
- Why you chose one direction over another
- What constraints you discovered

**This creates an audit trail:**
- Month 1: "I thought regime detection required 3 dimensions"
- Month 2: "Actually, 4 dimensions worked better"
- Month 3: "Here's why: [evidence from chat transcript]"
- Month 4: "Evolution of thinking showed in wiki"

---

## TIPS FOR USING THIS PROMPT

**TIP 1: Use immediately**
- Paste the prompt right at the end of a good chat
- Don't wait days (memory of what was discussed fades)

**TIP 2: Be honest in your chats**
- Don't sanitize or edit your thinking beforehand
- Let conversations be messy (that's reality)
- Claude will extract the signal from noise

**TIP 3: Deep chats work best**
- 30-min surface-level chat → shorter transcript
- 2-hour deep dive → much richer transcript
- Prompt works best with substantial content

**TIP 4: Ask Claude to expand**
- If important points are glossed over, ask Claude to elaborate
- "Can you expand on the regime modeling section?"
- "What alternatives did we discuss that aren't captured?"

**TIP 5: Save everything**
- Even seemingly minor chats might be important later
- Wiki can always filter, but can't create missing history
- Better to have too much than too little

**TIP 6: Name files clearly**
- `raw/claude-chats/2026-05-02_tool-design-discussion.txt`
- Not: `raw/chat-2.txt`
- Filename helps organize and remember later

---

## ADVANCED: Customizing the Prompt

The prompt above is general-purpose. You can customize it:

**For technical chats:**
Add to prompt:
```
Also include:
- Technical details and specifications
- Code snippets discussed (if any)
- Algorithm/formula discussions
- Performance considerations
```

**For decision-making chats:**
Add to prompt:
```
Also include:
- Alternatives explicitly considered
- Trade-offs analyzed
- Risks identified
- Constraints that shaped decision
- When decision felt certain vs. uncertain
```

**For brainstorming chats:**
Add to prompt:
```
Also include:
- All ideas discussed (even ones rejected)
- Why ideas were rejected
- Connections between ideas
- Patterns in thinking
- Emerging themes
```

**For research/learning chats:**
Add to prompt:
```
Also include:
- Sources/references mentioned
- Key concepts explained
- Analogies used
- Assumptions made
- Open questions
```

---

## WORKFLOW: Creating Multiple Transcripts

**If you want to capture multiple chats:**

1. **Chat 1:** Have discussion → Use extraction prompt → Save transcript
2. **Chat 2:** Have discussion → Use extraction prompt → Save transcript
3. **Chat 3:** Have discussion → Use extraction prompt → Save transcript
4. **Then:** Ingest all 3 transcripts to wiki at once
   - Claude reads all 3
   - Finds connections between them
   - Creates pages that link them together
   - Shows evolution of thinking across sessions

This is powerful because wiki can show:
- When you first thought about X (Chat 1)
- How you refined it (Chat 2)
- How it connected to Y (Chat 3)
- Full evolution traced

---

## FILE NAMING CONVENTION

When you save transcripts, use this format:

`raw/claude-chats/YYYY-MM-DD_TOPIC-KEYWORDS.txt`

Examples:
```
raw/claude-chats/2026-05-02_tool-design-discussion.txt
raw/claude-chats/2026-05-03_regime-logic-refinement.txt
raw/claude-chats/2026-05-05_rl-training-strategy.txt
raw/claude-chats/2026-05-10_bottleneck-severity-metrics.txt
```

This makes it easy to:
- Find transcripts by date
- Find transcripts by topic
- See timeline of when you discussed what
- Batch ingest related transcripts

---

## WHAT TO DO WITH FINISHED TRANSCRIPT

1. **Save locally**
   - `raw/claude-chats/YYYY-MM-DD_TOPIC.txt`

2. **When ready to ingest to wiki:**
   - Tell master prompt: "Ingest this source: [filename]"
   - Paste or upload the transcript file
   - Claude reads it, creates wiki pages
   - Links it to other related pages

3. **Track in log.md**
   - Wiki log will note: "ingested 2026-05-02_tool-design.txt"
   - Shows when you captured this knowledge
   - Shows in timeline

---

## EXAMPLE: Using the Prompt (Real Workflow)

**What you do:**

```
[Have a 1-hour chat about regime detection logic with Claude]

Claude, we just had a long discussion. 
Can you create a detailed transcript for my wiki?

[Paste the EXTRACTION PROMPT above]
```

**What Claude does:**

```
I'll read through our entire chat and create a comprehensive transcript.

[Reads whole chat]

================================================================================
REGIME DETECTION LOGIC: Deep Design Discussion
2026-05-05, user + Claude
================================================================================

OVERVIEW
This chat explored the design of regime detection for Leopold trading system...

[Full transcript with 8 sections, key decisions, artifacts, etc.]

================================================================================
SUMMARY
[Bullet points]
```

**What you do:**

```
Copy transcript
Save as: raw/claude-chats/2026-05-05_regime-detection-logic.txt
Later: Tell master prompt to ingest this source
```

---

## READY?

You now have a prompt you can:
- Paste into any chat
- At the end of substantive discussions
- To create detailed raw sources
- For your domain wiki

**Next time you have a good chat about something important:**

1. Let chat finish naturally
2. Paste this extraction prompt
3. Claude creates detailed transcript
4. You save to `raw/`
5. Later, ingest to wiki

Your wiki grows with actual decision-making transcripts, not reconstructed memories.

This is powerful because it captures:
- Your actual reasoning
- Alternatives considered
- Evolution of thinking
- Exact timing of decisions
- Context that shaped choices

**Use this to build a complete audit trail of your 4-month internship.**

---

## Questions?

This prompt is designed to be self-explanatory.
Just paste it at the end of any good chat.
Claude will know what to do.

If Claude's output is missing something, just ask:
"Can you add a section about X?"
"Can you expand on Y?"
"Can you reorganize Z?"

Good luck! 🚀
