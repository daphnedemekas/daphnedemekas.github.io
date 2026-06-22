---
title: The Free Energy Principle and Emotion Recognition
date: 2020
order: 3
---

Before I came to work on artificial systems, I worked at the intersection of mathematics and theoretical neuroscience. As a student at UCL I had the good fortune to work with Karl Friston and Thomas Parr at the Wellcome Trust Centre for Neuroimaging, the laboratory in which the free energy principle was then being developed as a unifying framework for the workings of the brain. The paper we wrote together, published in Frontiers in Computational Neuroscience in 2020, posed a question that has stayed with me ever since: what would it mean for a machine to recognize emotion in the way that a brain does?

## The Free Energy Principle

The free energy principle begins from an observation that seems almost too simple to bear its weight: biological systems persist. In a universe forever tending toward disorder, living things hold their structure together, and they do so, the theory proposes, by minimizing a quantity called variational free energy, which bounds the surprise of their sensory observations given an internal model of the world. A system that minimizes free energy is one that keeps good models of its surroundings and acts so as to keep its predictions true.

Within this framework perception becomes a form of inference, the updating of an internal model so as to explain what is being sensed; and action becomes inference run in the other direction, the changing of the world so that it conforms to what the model expects. Both are ways of closing the distance between expectation and reality, and the mathematics that unifies them goes by the name of active inference.

## Three Waves of Emotion Recognition

In our paper we set aside the building of any particular emotion classifier and proposed instead a theoretical account of how systems for recognizing emotion ought to evolve. We described three waves.

The first wave is what most present-day systems do, which is passive classification. A camera observes a face, and a model maps the pattern of pixels onto a label of emotion. This works, after a fashion, yet it treats the person as an object to be read off and not as an agent to be understood, and it has no purchase upon ambiguity; a furrowed brow might signify anger, or concentration, or confusion, and the system has no recourse for resolving that uncertainty save to guess.

The second wave introduces emotional lexicons and the active resolution of uncertainty. Here the system maintains a generative model of emotional states and may take action to reduce its own uncertainty, asking questions, gathering further context, observing the person over time. This is active inference brought to bear upon emotion: the system interacts where before it merely watched, and it uses the interaction itself as a source of information, holding beliefs about another's emotional state and refining them through a process of hypothesis and test.

The third wave is at once the most speculative and the most interesting. Here the generative model of the machine and the generative model of the human become synchronized, and the system comes to develop a shared model of the emotional interaction itself. Both parties are engaged in active inference, each attempting to predict and to understand the other, and through that reciprocal process something resembling genuine emotional attunement becomes possible. It is here that the formalism of the Markov blanket grows crucial, for it gives a precise way to describe the boundary between two interacting systems and the information that passes across it.

## What I Took From It

This paper was, in many ways, my entry into thinking of minds as machines for prediction. Its central intuition, that to understand another's emotional state is a matter of active, model-based inference and not of mere pattern-matching, has shaped the way I think about intelligence at large. A system that only classifies is performing a lookup; a system that actively reduces its uncertainty through interaction is doing something nearer to understanding.

Working with Friston taught me to think about systems in terms of their models, in terms of what they predict, what surprises them, and how they respond to the gap between expectation and reality. That framing has proved remarkably durable, whether I find myself thinking about reinforcement-learning agents learning to navigate, about the nature of self-awareness, or about what it might take to build artificial systems that genuinely understand the people with whom they interact.

The paper also planted a seed that would later grow into my work on identity and self-modeling. If a system can build a generative model of another person's emotional state and actively work to reduce its uncertainty about it, what happens when that same capacity is turned inward? What happens when a system builds a generative model of itself?
