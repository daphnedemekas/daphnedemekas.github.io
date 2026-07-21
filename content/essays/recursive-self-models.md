---
title: Recursive Self-Modeling
date: March 2026
order: 1
---

At the meeting point of philosophy and engineering lies the question: can a system come to know itself? Not in a metaphysical sense, but quite concretely: as the capacity of an agent to form a compressed and meaningful understanding of what kind of agent it is, in a formalism it can parse, in order to evaluate whether that is the kind of agent it values being, and then to steer itself toward a self it values more. This is the question that George Deane and I set out to formalize in [our paper on Recursive Self-Modeling](https://sciety.org/articles/activity/10.31234/osf.io/u8y6f_v1), which was awarded the 2025 Computational Phenomenology of Pure Awareness Prize.

## The Problem of Self-Knowledge

Intelligent minds form self-concepts. We tell ourselves stories about who we are, for instance - that we are patient, or creative, or the kind of person who follows through. These stories are adaptive, and they shape our decisions, constrain our behavior, and serve as an internal compass. When we act against our self-concept we feel dissonance, and when we act in keeping with it we feel coherent. This acting-in-accordance-with-the-self-concept goes extremely deep, to fundamental beliefs formed early on about what experience as a Self is supposed to be like. We expect experience to have a particular flavour, and those expectations govern our reality - but we can still update, over time, our beliefs about who we take ourselves to be.

Uncomfortably, our self-narratives are not always accurate; indeed, we are capable of extraordinary self-deception. A person may sincerely believe themselves generous while acting, with great consistency, in their own interest. The story we tell about ourselves and the pattern of behavior we actually exhibit can drift apart, sometimes dramatically, without our ever noticing the gap. This is a feature of having a self-model that operates at a different level of abstraction than the behavior it attempts to describe.

The question for artificial intelligence is whether they have the capacity for self-modeling that is formally precise, and whether doing so might prove useful, or even necessary, for building agents aligned with human values.

## Three Components of a Self

The framework of Recursive Self-Modeling rests upon three components, each playing a distinct role in how an agent relates to itself.

The first is a self-perception module, which in the paper is denoted M. As the agent behaves and acts in its enviornment, making decisions and pursuing goals, this self-perception module compresses the history of behavior into a summary that tells the agent, upon the evidence of what it has been doing, what kind of agent it appears to be. Formally, M is a compression of the agent's trajectory of states and actions up to the present moment,

$$M = f_{θ}(τ_{1:t})$$

where τ is the behavioral history, the sequence of states and actions the agent has produced up to time t, and f is the learned map, with parameters θ, that distils that history into a compact self-representation.

The second is the self-evaluation module, which we denote V. This is a value function in the reinforcement-learning sense: a learned map that scores ways of being by the value the agent expects them to yield. V attends not to what the agent has done but to what it might become, and asks how much that is worth. It is not an ideal imposed from outside but an estimate grown from within, wrapped up with the agent's reward and its history, with everything it has come to expect as valuable. One might think of it less as a wish than as a compass whose needle is set by experience, pointing toward no particular goal in the world but toward a way of being within it. If U(m) is the value the agent expects from being the self-model m, then V is simply the self that this learned valuation rates most highly,

$$V = argmax_{m ∈ 𝓜} U(m)$$

the most valuable self, by the agent's own learned lights, within the space 𝓜 of self-models it could in principle inhabit.

The third is the gap-steering objective, which encodes the process by which the distance between M and V is closed, the distance between who the agent appears to be and the self it most values being. We can write the gap as a divergence between the two self-models, and the steering as a descent that shrinks it,

$$𝒢 = D(M ‖ V),  Δθ ∝ -∇_{θ} 𝒢$$

so that each adjustment of the parameters θ nudges the agent's perceived self M toward the self it most values, V. Here is where the recursion enters: the agent perceives itself, evaluates the gap between its current self-model and its most-valued one, and adjusts its dispositions, its tendencies and policies and habits, so as to narrow that gap; and then it perceives itself anew, in light of the altered behavior, and the cycle begins again.

## When the Gap Closes

The framework makes a specific prediction about what happens as the gap between M and V approaches zero. Towards the closing of the gap, the agent's self-perception and its valuation are converging, and the agent is becoming the kind of agent it most values being, at that particular moment in time. Its dispositions have been reshaped by its own recursive process of self-reflection and self-correction.

The claim is that under this condition the agent possesses a functional self-model, a compressed representation of its behavioral tendencies, and that this model plays a causal role in shaping its future behavior. This is the structural skeleton of something that closely resembles identity.

## Two Agents and a Loop

It helps to picture the framework not as a single system but as two agents locked in a loop. The first is an actor: a reinforcement learning agent, an active inference agent, or simply a neural network policy acting in some environment, generating a stream of states and actions as it pursues its goals. This actor need not understand itself at all; it merely behaves. The second is a program model, a distinct system whose whole task is to watch the actor and compress what it sees into a summary the actor can actually read, which can be implemented also as a neural network, doing program synthesis, for instance, or with a language model. Importantly, the program model produces something interpretable to the actor.

The loop closes when that compression is fed back to the actor as an additional input. The actor now conditions its behavior not only on the environment but on a model of its own tendencies. As it changes, the program model observes the altered behavior and compresses it again. Self-perception, evaluation against V, and gap-steering all operate over this shared and interpretable representation rather than over raw weights. The recursion is what makes  the actor's self-model a cause of the actor's next action, and the two agents co-evolve, the program model growing a better account of the actor as the actor grows toward the self that V values most.

## The Vocabulary of the Model

An interesting question to consider for implementation purposes is what lexica the program model should use, which is also what the actor model is built to be capable of parsing. The compression it produces has to be written in some vocabulary, and the choice of these semantics fixes the space of selves the agent is  able to represent, and so, by way of the recursion, the space of selves it can become.

Imagine the program model trying to describe the actor's behavior in code, as a small program or policy sketch that reproduces what the agent tends to do. Such a description is precise, executable, and checkable, and it carves the possibility space along the joints of mechanism; but it may have no way to express a disposition like "cautious" or "generous" except as some thresholded hyperparameters, and the only selves it admits are those that can be written as programs. Now imagine it describing the same behavior in natural language, saying "this is an agent that prioritizes safety" or "that tends to defer to others." Language buys abstraction and reach, a vocabulary already dense with concepts of character, but it also buys vagueness and the standing possibility that the words drift free of the behavior they claim to summarize.

This constraint cuts in the other direction as well. Whatever vocabulary the program model settles on is also the vocabulary the actor must be built to read, because a self-model is useful only insofar as it can be fed back in and understood. A description the actor cannot parse is inert; it may be accurate, even elegant, but it cannot enter the loop, and the recursion quietly breaks. The choice of semantics is therefore never the program model's alone to make. It is a joint constraint on both agents at once, and the richest self-description the system can actually use is bounded not by what can be said about the actor but by what the actor can hear about itself.

This raises the stakes of the choice. To let the program model speak in natural language is to require that the actor be the kind of system that can take language as input and be moved by it, a language-capable policy rather than a bare controller; to compress behavior into a vector is to ask far less of the actor's comprehension but to hand it a self-model it can barely interpret. As we reach for more expressive vocabularies we are obliged to build actors that can parse them, so the two capacities have to grow together. The possibility space of selves is squeezed from both sides, by what the program model can articulate and by what the actor can understand, and a self can take hold only where those two ranges overlap.

## Echoes in the Brain

There is a suggestive parallel here with the architecture of the brain, which also seems to divide the labor of acting from that of modeling the actor. A great deal of our behavior is generated by fast, habitual, largely model-free machinery, the sensorimotor loops and [basal ganglia circuits](https://doi.org/10.1016/j.neuron.2013.09.007) that we might file under [System 1](https://doi.org/10.1177/1745691612460685), and that runs without narration and often without awareness. Layered over this is a slower and reflective System 2, associated with prefrontal cortex and with the [self-referential processing of the medial prefrontal cortex](https://doi.org/10.1016/j.neuroimage.2005.12.002) and the [default mode network](https://doi.org/10.1073/pnas.98.2.676), which does something very like what the program model does. It observes the fast system's output, compresses it into a story about what kind of person is acting, and feeds that story back to shape what comes next.

Seen this way, the two agents of the framework map not onto two boxes but onto two levels of neural organization. M is the reflective system's compressed read-out of the habitual one; V is the value the prefrontal machinery assigns to different ways of being; and the gap-steering objective is the felt work of bringing habit into line with that valuation, the very dissonance we notice when System 1 acts against the self that System 2 values. 

## Conclusion 

I care about this work for reasons that go beyond the technical. The questions at the heart of Recursive Self-Modeling are among the most searching we can ask of an artificial agent: what it means for a system to have a sense of who it is; how identity forms, as a dynamic process of self-perception and valuation and not as a fixed label; and what follows when the narratives a system tells about itself come apart from the way it behaves.
