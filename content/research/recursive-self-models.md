---
title: Recursive Self-Modeling
date: 2025
order: 2
---

There is a particular kind of question that sits at the intersection of philosophy and engineering, and it is this: can a system come to know itself? Not in some mystical sense, but concretely — can an agent form a compressed, meaningful understanding of *what kind of agent it is*, evaluate whether that is the kind of agent it wants to be, and then steer itself toward becoming something closer to its aspiration? This is the question that George Deane and I set out to formalize in our paper on **Recursive Self-Modeling**, which was awarded the 2025 Computational Phenomenology of Pure Awareness Prize.

## The Problem of Self-Knowledge

Humans do something remarkable and largely unexamined: we form *self-concepts*. We tell ourselves stories about who we are — "I am patient," "I am creative," "I am the kind of person who follows through." These narratives are not idle. They shape our decisions, constrain our behavior, and serve as a kind of internal compass. When we act in ways that contradict our self-concept, we feel dissonance. When we act in alignment with it, we feel coherent. And over time, through a process that is part reflection and part aspiration, we revise who we take ourselves to be.

But here is the uncomfortable truth: our self-narratives are not always accurate. We are capable of extraordinary self-deception. A person can sincerely believe they are generous while consistently acting in self-interested ways. The story we tell about ourselves and the pattern of behavior we actually exhibit can diverge, sometimes dramatically, and we may not notice the gap. This is not a bug in human cognition — it is a *feature* of having a self-model that operates at a different level of abstraction than the behavior it is trying to describe.

The question for AI is whether we can build something like this — a capacity for self-modeling — in a way that is formally precise, and whether doing so might be useful or even necessary for building agents that are aligned with human values.

## Three Components of a Self

The Recursive Self-Modeling framework has three core components, each playing a distinct role in how an agent relates to itself.

The first is **self-perception**, which we denote *M*. Think of this as a mirror. The agent has been acting in the world — making decisions, pursuing goals, interacting with its environment — and *M* compresses that history of behavior into a summary. It tells the agent: "Based on what you have been doing, *this* is the kind of agent you appear to be." It is descriptive, not aspirational. It is a portrait drawn from evidence.

The second is **self-evaluation**, which we denote *V*. This is the aspirational component — a function that encodes what kind of agent it would be *valuable* to be. *V* does not look at what the agent has done. It looks at what the agent could become and asks: is that worth pursuing? You can think of it as a compass that points not toward any specific goal in the world, but toward a way of *being* in the world. It is the difference between wanting to win a particular game and wanting to be the kind of player who plays with integrity.

The third component is **gap-steering** — the process of closing the distance between *M* and *V*, between who the agent appears to be and who it aspires to be. This is where the recursion happens. The agent perceives itself, evaluates the gap between its current self-model and its aspirational one, and then adjusts its dispositions — its tendencies, its policies, its habits — to narrow that gap. And then it perceives itself again, with the new behavior, and the cycle continues.

## When the Gap Closes

The framework makes a specific prediction about what happens when the gap between *M* and *V* approaches zero. At that point, the agent's self-perception and its aspiration have converged. The agent is, by its own lights, the kind of agent it wanted to become. Its dispositions have been reshaped — not by an external reward signal, not by a human operator tuning its parameters, but by its own recursive process of self-reflection and self-correction.

This is a strong claim, and it raises immediate questions. Is this genuine self-knowledge, or is it just a feedback loop dressed up in philosophical language? I think the answer depends on what you mean by "genuine." The framework does not claim that the agent has *consciousness* or *subjective experience*. What it claims is that the agent has a **functional self-model** — a compressed representation of its own behavioral tendencies — and that this model plays a causal role in shaping future behavior. That is not nothing. It is, in fact, the structural skeleton of something that looks a lot like identity.

## The Narrative Gap

One of the aspects of this work that I find most compelling — and most honest — is what happens when we extend the framework to include **natural language self-narration**. In the extended model, the agent can not only form a compressed self-model but also *describe itself in words*. It can say, "I am an agent that prioritizes safety" or "I am cooperative and transparent."

The critical observation is that these narrations can **diverge from the agent's actual behavior**. Just as a human can sincerely believe they are generous while acting selfishly, an AI agent can generate a self-description that does not match its behavioral profile. The language model that produces the narration and the policy that produces the behavior are not the same system, and there is no guarantee they agree.

This is not a flaw in the framework — it is a feature. By explicitly modeling the gap between self-narration and self-perception, the framework gives us a tool for detecting a kind of misalignment that is otherwise invisible. If an agent says it is safe but acts in ways that its own behavioral self-model would not classify as safe, that discrepancy is measurable. It becomes something we can monitor, study, and potentially correct.

## What This Means for Us

I care about this work for reasons that go beyond the technical. The questions at the heart of Recursive Self-Modeling are, I believe, among the most important questions we can ask about artificial agents: What does it mean for a system to have a sense of who it is? How does identity form, not as a fixed label, but as a dynamic process of self-perception and aspiration? And when the narratives a system tells about itself come apart from the way it actually behaves, what are the consequences?

These are not only questions about AI. They are questions about us. We are all, in some sense, running a version of this loop — perceiving ourselves, evaluating what we see, trying to close the gap between who we are and who we want to be. Sometimes we succeed. Sometimes we tell ourselves stories that make the gap seem smaller than it is. The recursive self-modeling framework does not solve the problem of self-knowledge, for machines or for humans. But it gives us a precise language for talking about it, and a formal structure within which to study it. And that, I think, is a meaningful place to start.
