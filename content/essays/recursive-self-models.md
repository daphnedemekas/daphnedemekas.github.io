---
title: Recursive Self-Modeling
date: 2025
order: 1
---

There is a particular kind of question that sits at the meeting point of philosophy and engineering, and it is this: can a system come to know itself? I mean this not in any mystical sense but quite concretely, as the capacity of an agent to form a compressed and meaningful understanding of what kind of agent it is, to evaluate whether that is the kind of agent it wishes to be, and then to steer itself toward something nearer its aspiration. This is the question that George Deane and I set out to formalize in our paper on Recursive Self-Modeling, which was awarded the 2025 Computational Phenomenology of Pure Awareness Prize.

## The Problem of Self-Knowledge

Humans do something remarkable and largely unexamined: we form self-concepts. We tell ourselves stories about who we are, that we are patient, or creative, or the kind of person who follows through, and these stories are far from idle. They shape our decisions, constrain our behavior, and serve as a kind of internal compass; when we act against our self-concept we feel dissonance, and when we act in keeping with it we feel coherent. Over time, through a process that is part reflection and part aspiration, we revise who we take ourselves to be.

There is an uncomfortable truth in this, which is that our self-narratives are not always accurate. We are capable of extraordinary self-deception. A person may sincerely believe themselves generous while acting, with great consistency, in their own interest; the story we tell about ourselves and the pattern of behavior we actually exhibit can drift apart, sometimes dramatically, without our ever noticing the gap. This is a feature of having a self-model that operates at a different level of abstraction than the behavior it attempts to describe.

The question for artificial intelligence is whether we can build something of this kind, a capacity for self-modeling that is formally precise, and whether doing so might prove useful, or even necessary, for building agents aligned with human values.

## Three Components of a Self

The framework of Recursive Self-Modeling rests upon three components, each playing a distinct role in how an agent relates to itself.

The first is self-perception, which we denote M, and which functions something like a mirror. The agent has been acting in the world, making decisions, pursuing goals, interacting with its environment, and M compresses that history of behavior into a summary that tells the agent, upon the evidence of what it has been doing, what kind of agent it appears to be. It is descriptive in character, a portrait drawn from evidence.

The second is self-evaluation, which we denote V, and which is the aspirational component: a function that encodes what kind of agent it would be valuable to be. V attends not to what the agent has done but to what it might become, and asks whether that is worth pursuing. One might think of it as a compass that points toward no particular goal in the world but toward a way of being within it, the orientation that distinguishes the wish to win a given game from the wish to be the kind of player who plays with integrity.

The third is gap-steering, the process by which the distance between M and V is closed, the distance between who the agent appears to be and who it aspires to become. Here is where the recursion enters. The agent perceives itself, evaluates the gap between its current self-model and its aspirational one, and adjusts its dispositions, its tendencies and policies and habits, so as to narrow that gap; and then it perceives itself anew, in light of the altered behavior, and the cycle begins again.

## When the Gap Closes

The framework makes a specific prediction about what happens as the gap between M and V approaches zero. At that point the agent's self-perception and its aspiration have converged, and the agent has become, by its own lights, the kind of agent it wished to be. Its dispositions have been reshaped, not by an external reward signal nor by a human operator tuning its parameters, but by its own recursive process of self-reflection and self-correction.

The claim is that under this condition the agent possesses a functional self-model, a compressed representation of its own behavioral tendencies, and that this model plays a causal role in shaping its future behavior. This is the structural skeleton of something that closely resembles identity.

## The Narrative Gap

One aspect of this work that I find most compelling is what happens when we extend the framework to include natural-language self-narration. In the extended model the agent can not only form a compressed self-model but also describe itself in words, saying, "I am an agent that prioritizes safety," or "I am cooperative and transparent."

The critical observation is that such narrations can diverge from the agent's actual behavior. Just as a person may sincerely believe themselves generous while acting selfishly, an artificial agent may generate a self-description that fails to match its behavioral profile. The language model that produces the narration and the policy that produces the behavior are not the same system, and nothing guarantees that the two agree.

This divergence is in fact one of the framework's uses. By modeling explicitly the gap between self-narration and self-perception, it offers a means of detecting a kind of misalignment that would otherwise remain invisible. If an agent declares itself safe while acting in ways its own behavioral self-model would not classify as safe, that discrepancy becomes measurable, and so becomes something we can monitor, study, and perhaps correct.

## What This Means for Us

I care about this work for reasons that go beyond the technical. The questions at the heart of Recursive Self-Modeling are among the most searching we can ask of an artificial agent: what it means for a system to have a sense of who it is; how identity forms, as a dynamic process of self-perception and aspiration and not as a fixed label; and what follows when the narratives a system tells about itself come apart from the way it behaves.

These are not questions about artificial intelligence alone. They are questions about us. We are all, in some sense, running a version of this loop, perceiving ourselves, evaluating what we perceive, and trying to close the distance between who we are and who we wish to become. Sometimes we succeed. Sometimes we tell ourselves stories that make the gap appear smaller than it is. The recursive self-modeling framework does not solve the problem of self-knowledge, for machines or for us, but it gives us a precise language in which to speak of it, and a formal structure within which to study it.
