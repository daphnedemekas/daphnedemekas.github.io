---
title: The Free Energy Principle and Emotion Recognition
date: 2020
order: 4
---

Before I worked on AI systems, I worked at the intersection of mathematics and theoretical neuroscience. As a student at UCL, I had the opportunity to work with Karl Friston and Thomas Parr in the Wellcome Trust Centre for Neuroimaging — the lab where the **free energy principle** was being developed as a unifying framework for brain function. The paper we wrote together, published in *Frontiers in Computational Neuroscience* in 2020, asked a question that has stayed with me since: what would it mean for machines to recognize emotions the way brains do?

## The Free Energy Principle

The free energy principle starts from a deceptively simple observation: biological systems persist. In a universe that tends toward disorder, living things maintain their structure. They do this, according to the theory, by minimizing **variational free energy** — a quantity that bounds the surprise of their sensory observations given an internal model of the world. A system that minimizes free energy is a system that maintains good models and acts to keep its predictions true.

Under this framework, perception is inference: updating your internal model to explain what you're sensing. Action is also inference, but in the other direction: changing the world to match what your model expects. Both are ways of closing the gap between expectation and reality. The mathematical framework that unifies them is called **active inference**.

## Three Waves of Emotion Recognition

In our paper, rather than building a specific emotion classifier, we proposed a theoretical framework for how emotion recognition systems should evolve. We described **three waves**.

The **first wave** is what most current systems do: passive classification. A camera observes a face, a model maps pixel patterns to emotion labels. This works, but it treats the person as an object to be read, not an agent to be understood. It cannot handle ambiguity — a furrowed brow could be anger, concentration, or confusion — and it has no way to resolve that uncertainty except by guessing.

The **second wave** introduces **emotional lexicons** and active uncertainty resolution. Instead of passively classifying, the system maintains a generative model of emotional states and can take actions to reduce its uncertainty — asking questions, seeking additional context, observing the person over time. This is active inference applied to emotion: the system doesn't just watch, it interacts, using the interaction itself as a source of information. It maintains beliefs about the other person's emotional state and updates those beliefs through a process of hypothesis testing.

The **third wave** is the most speculative and the most interesting. Here, the machine's generative model and the human's generative model become **synchronized**. The system doesn't just infer what the person is feeling — it develops a shared model of the emotional interaction itself. Both parties are engaged in active inference, each trying to predict and understand the other, and through that reciprocal process, something like genuine emotional attunement becomes possible. This is where the Markov blanket formalism becomes crucial: it provides a formal way to describe the boundary between two interacting systems and the information that flows across it.

## What I Took From It

This paper was, in many ways, my entry point into thinking about minds as prediction machines. The core intuition — that understanding another person's emotional state is not pattern-matching but active, model-based inference — shaped how I think about intelligence more broadly. A system that merely classifies is performing a lookup. A system that actively reduces its uncertainty through interaction is doing something closer to understanding.

Working with Friston taught me to think about systems in terms of their models: what they predict, what surprises them, how they respond to the gap between expectation and reality. That framing has proven remarkably durable — whether I'm thinking about RL agents learning to navigate, about the nature of self-awareness, or about what it would take to build AI systems that genuinely understand the humans they interact with.

The paper also planted a seed that grew into my later work on identity and self-modeling. If a system can build a generative model of another person's emotional state and actively seek to reduce uncertainty about it, what happens when you turn that capacity inward? What happens when the system builds a generative model of itself?
