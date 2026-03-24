---
title: Cybernetics at Softmax
date: 2024–2025
order: 1
---

Softmax aims to discover principles of how artificial systems learn in multi-agent environments, to build a foundation from which we can make meaningful statements about collective intelligence, cooperation, competition, and alignment.

## MettaGrid

In order to investigate this, we developed an artificial environment called MettaGrid, which is designed to be an open-ended world that fosters a continuously evolving strategy space. This is facilitated by the environment being responsive to the agents within it, due to the rules of the game (agents can change the states of objects in their environments) and fundamentally due to the multi-agency: by having other agents be a part of an agent's environment, and the two learning from one another, there are countless discoverable strategies that can change the unrolling of agent trajectories and lead to different configurations of the world (think game-theory, self-organization, society).

In practice, I trained deep RL policies in this environment, where the weights of the policy govern every agent, but every instantiation of the agent has its own individual experience and memory. This allows for diversity in behavior space, constrained by a consistency in how the model represents its world. The goal is to have the agents learning how to interact with the environment and with one another, to discover better ways of accumulating reward, and through strategy discovery, new strategies emerge.

In its current form, the environment has a variety of resources, which the agents can learn to convert in various ways through converter objects. One of the resources (we call them hearts), is rewarding, and ultimately policies that perform the best, with respect to the training objective, will be those that learn strategies that lead to the most hearts. Agents also have the ability to interact with one another and steal each others' resources.

## Navigation

Training deep RL in sparse reward environments is a notoriously difficult thing to do, as RL policies often fail to explore the space of possibilities, and are also not clearly naturally good at learning how to encode their memory in meaningful ways. What this means is that agents will often learn one way of getting reward and stick to it, and fail to take advantage of the affordance in their environment.

Because of this, we focused first on building a minimally competent policy that could learn skills that are basic and necessary for the environment, and learn how to generalize them to arbitrary map layouts and configurations. In particular, we hypothesized that training the policy to be really good at navigating diverse terrain was going to be crucial in giving them the affordances to explore their world in the first place, so they could expose themselves to what is around them, and learn to interact with it. In addition to navigation, we wanted to train the agents to understand the rules of the game and discover strategies towards accumulating reward.

For navigation, we tackled this by algorithmically generating various map layouts (terrains), and training the agents on domain randomized versions of the environments. This was crucial, because it meant that every episode the policy would be learning in a unique terrain that it had not yet encountered, so it was implicitly learning the skill of adapting to novelty. In order to evaluate whether or not the policy was successfully and reproducibly learning to navigate, we constructed a set of eval environments, which are smaller "in silico" maps that we evaluated the agents on (without updating their weights). In these eval environments, the agents must explore to find where the hearts are, and forage them, while having to circumnavigate, avoid obstacles, go through tunnels, remember where they have already been, etc.

A crucial component in our success was building an approach to order our environments during training based on how well the agents were learning, so that the policy would train on environments in increasing order of learning potential (often easier environments first, i.e. smaller maps with fewer obstacles, and more complicated terrain later in training).

[video:navigation-training.mov]
*Example of a navigation training environment.*

[video:navigation-eval.mov]
*Example of a navigation eval environment.*

## Object Use

Once we had agents that were good at navigating terrain, we extended this to training agents in worlds with different kinds of objects, and evaluating their ability to learn how to use them (for example using converters to exchange resources, or moving blocks around).

[video:object-use.mov]
*An agent in an object-use training environment, moving blocks, and converting resources to accumulate reward.*

## In-Context Learning

At this point, we had trained policies that were good at navigating, and that could understand the basic game mechanics and use the converters reliably in held-out evals, but we realized that we were bottlenecked by their ability to combine these skills successfully. While they could navigate terrain and collect resources along their way, we didn't see them being able to bootstrap into increasingly complicated eval tasks (i.e. difficult exploration environments where they had to find, use, and return to objects to accumulate reward). This seemed mainly due to difficulty remembering where they were and what they had done previously, which turned out in part to be due to the fact that their memory state was being reset in-episode, which was a training detail that has since been corrected.

Most importantly though, in our experiments thus far weren't observing the policy being able to generalize to environments where they needed new strategies or skills that were not part of the curriculum on which they were trained — they were simply learning a particular set of skills and how to generalize them. If we put them in worlds with other agents, or with converters they hadn't seen in training, they did not have the instinct to be curious and interact to discover the affordances of the novel signs. This felt like a fundamental problem that we needed to tackle, in order to make our policy more equipped for our overall goal of open-ended learning.

So, at this point, rather than trying to train explicitly to increase the repertoire of skills that the agent should be able to do and the pairwise combinations of them, we instead decided to try to train agents the skill of learning new skills, so that they would be better equipped at learning in novel environments. This is known as "in-context learning".

For this approach, during training, agents were re-initialized every episode with a clean memory state and a new task (in our first case, a new resource chain to learn how to complete), and they have to, via trial-and-error, discover what the relevant resource chain is and execute it, and then repeat it until the end of the episode. They can also be placed in environments with distractors, or "sinks", which eat up their resources, and if used, mean the agent needs to start over at the beginning of the chain. Again, we used a learning progress curriculum to ensure our policy was evolving on a gradient of difficulty, so that they could learn from shorter, simpler chains first, to then generalize to longer chains and more sinks.

The policy's memory state would persist within an episode (while learning the given task), and then reset at episode boundaries, to ensure a clean state when its time to learn a new resource chain.

This approach worked. The policy was able to in-context learn how to complete an arbitrary 5-step sequence with two distractor sinks at near optimal performance. The behavior suggests a learned form of elimination reasoning and progress tracking: the agent avoids reusing sinks, delays converter use until appropriate (waiting for the converter to refresh), and navigates directly to the final converter. Once it has identified the correct resource chain, it continuously performs the cycle until the end of the episode, and then restarts in the new world.

[video:in-context-learning.mov]
*An agent in-context learning a five step resource chain with two distractor sinks. The resource chain is altar —>lab —>red mine —>blue generator —> green generator, and the red generator and the green mine are sinks (they take any resource and return nothing). The agent discovers the chain via trial and error and then succeeds to reproduce it once learned.*

## What Came Next

In context learning means the strategy of seeking out the rules of the game in-context, and then playing it, is encoded in the weights of the policy. The next phase was extending the space of kinds of tasks the agents can learn, to longer chains, more sophisticated sign-goal pairs, difficult-to-navigate terrain, and ultimately using other agents as signals to condition particular game rules or strategies. In addition, bridging together the generalized navigation curriculum with the in-context curriculum, to empower agents to explore the space to seek out information for task discovery.

Once the agents are skilled at actively exploring to seek out information, they can use that information to learn the rules of the game, and then play the game, in-context every episode, and then ultimately take off into the space of cooperative and cumulative strategies.
