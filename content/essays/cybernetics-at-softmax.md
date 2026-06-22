---
title: Cybernetics at Softmax
date: 2024–2025
order: 6
---

Softmax sets out to discover the principles by which artificial systems learn within multi-agent environments, and so to build a foundation from which one might make meaningful statements about collective intelligence, about cooperation and competition, and about alignment.

## MettaGrid

To pursue this we built an artificial world called MettaGrid, designed to be open-ended, with a strategy space that evolves without ever settling. What makes it open-ended is that the environment is responsive to the agents within it: they can alter the states of the objects around them, and, more fundamentally, they form part of one another's environments. Once agents begin to learn from one another, the space of discoverable strategies grows vast, and the smallest change in behavior can cascade into an altogether different configuration of the world. This is the territory of game theory, of self-organization, of the emergence of something one is tempted to call society.

Within this world I trained deep reinforcement-learning policies. A single policy governs every agent, and yet each instantiation carries its own experience and memory, which allows for a diversity of behavior held together by a shared way of representing the world. The agents accumulate reward by learning to convert resources, the rewarding one among which we call hearts, and they are free as well to interact with one another and to take one another's resources.

## Learning to Learn

The conceptually interesting matter is what it takes to make such agents genuinely open-ended.

Reinforcement learning under sparse reward is notoriously difficult, for a policy will tend to find a single way of securing reward and hold to it, never exploring the affordances that surround it. We could train our agents to navigate varied terrain and to use objects reliably, and still they remained brittle; set down in a world with an unfamiliar converter, or in the company of another agent, they showed no instinct to grow curious and to probe what the novel thing might do. They had learned a fixed repertoire of skills, without acquiring the capacity to learn new ones.

And so, in place of enlarging that repertoire by hand, we set out to train the skill of acquiring skills, which goes by the name of in-context learning. At the start of each episode an agent wakes with a clean memory and a fresh task, a new chain of resources to discover, and must work out the rules of it by trial and error before exploiting them until the episode draws to its close. We can also scatter into the world a number of sinks, which consume resources and undo progress, and so make the problem of discovery harder still. A curriculum ordered by learning progress keeps the difficulty upon a gradient, so that the agents master short and simple chains before they are asked to generalize to longer ones.

The approach bore fruit. The policy learned to solve an arbitrary five-step chain in the presence of two distracting sinks, and to do so at very nearly optimal performance. The behavior carries the marks of something that looks like reasoning: the agent declines to reuse a sink, waits for a converter to refresh before turning to it, and, once it has identified the correct chain, repeats the cycle cleanly until the episode resets and a new world opens before it. The strategy of seeking out the rules of the game and then playing it has come to be encoded in the very weights of the policy.

## Where It Goes

Once agents are able to explore actively in search of information, to learn the rules of a world in context, and then to act upon them, the path opens toward richer country: toward longer and more intricate tasks, toward more difficult terrain, and, in time, toward the use of other agents themselves as signals that condition the rules of the game. It is there that the interesting dynamics live, where agents may at last take off into the space of cooperative and cumulative strategy.
