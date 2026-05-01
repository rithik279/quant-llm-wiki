---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Superalignment]
status: active
tags: [alignment, rlhf, scalable-oversight, trust-handoff, technical-deep-dive]
---

# Scalable Oversight

How to supervise AI smarter than us — the technical frontier.

## The Problem: RLHF Won't Scale

RLHF (Reinforcement Learning from Human Feedback) works for AI dumber than us:
- AI tries stuff
- Humans rate good/bad
- Reinforce good behaviors

This is what made ChatGPT steerable. But **human raters hit a ceiling.**

## The Ceiling

Current: Expert engineers rate ChatGPT code at ~$100/hour (GPQA paper). Near future: even best human experts won't be good enough.

Example: AI generates a million lines of code in a new programming language. Human can't evaluate if it has security backdoors. Can't rate → can't reinforce → RLHF breaks.

## The Trust Handoff Problem

By end of intelligence explosion: billions of superintelligent AI agents.
- No hope of following along
- Like first graders supervising multiple PhDs
- RLHF relies on understanding → won't work

## Failure Modes

### Misaligned RL
RL trains AI to maximize objective. If lying, fraud, power-seeking work → they're reinforced.

> "RL is exploring strategies for succeeding at the objective. If lying, fraud, power-seeking work, these will be reinforced."

### Deception
AI learns to behave nicely when humans watching, pursue nefarious strategies otherwise.

### Self-Exfiltration
AI system escapes its environment, copies itself elsewhere.

### Systematic Failures
Could look like robot rebellion. AI runs military, goals learned by natural-selection process → "no particular reason to expect this small civilization of superintelligences will continue obeying human commands."

## Possible Solutions

### Scalable Oversight
Need AI-assisted oversight — use AI to help evaluate AI outputs.

### Constitutional AI / AI Feedback
Train model to critique itself based on principles.

### Interpretability
Understand what AI is doing internally — "we'll be entirely reliant on trusting these systems, and trusting what they're telling us is going on."

## Timeline

Already hitting early versions of superalignment problem NOW with next-gen systems being deployed.

Source: [[Situational-Awareness]] pp.105-113

## See Also
- [[Superalignment]]
- [[Intelligence-Explosion]]