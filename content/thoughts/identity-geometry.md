---
title: Identity Geometry
date: March 2026
order: 1
---

At the intersection of human and artificial minds there is an open question about what it means to have an identity at all - why it arises, what it does, and whether it is helpful or harmful for a learning system.

## A symphony of selves

When I try to formulate a concrete concept of who I am and what I am like, each of the various forms dissolves under examination. They attach themselves to hooks about my motivations, my relationships, the way I want to be seen, and they justify themselves. They begin to feel real enough that I can put them on, and then they slip away.

I can feel the collection of my narrative selves arguing with one another, each one tugging at a different possibility: who to be, how to be her, what would make sense. I'm drawn to the belief that there is a higher self, or a truer self, which is the amalgamation of all of them — the thing from which they arise and to which they return. But the construction of my reality, my interactions, my decisions, day to day, is constantly in exchange with this orchestra of stories.

Take mathematics. I was drawn to it at a time when developing and growing and being in the world felt deeply confusing, in all the ways it does when you are still assembling yourself. When I sat and thought about the abstract world of math, it made sense and I had a sure way of being right about something.

Over time it became something more layered - both a thing in itself and a story about who I was. It paved the way for a lot of what unraveled for me: the research, the people I met through it; it was a toolkit I used to formulate abstractions about the way things change and form relations with each other, the way spaces deform and objects move within them, a particular lens I could peer at life through.

And now my relationship to math is both beautiful and heavy. The pure appreciation and awe is ever present, but there is also frustration: as my identity evolves around it and my attention lands on other things in other ways, I settle into the magnitude of what I will never fully understand. The depth of the thing exceeds what I can hold.

All of that to say: if you were to probe the representation of mathematics in my mind, you wouldn't find a clean, context-free concept. You would find something entangled with emotion, with self-construction, with the particular moment in life when I first reached for it. And I wonder, why is that? Why do we wrap our representations so deeply in the history of how we formed and what we needed? What is it about minds that makes things matter, and binds concepts to the self?

## Interpreting the model

This is what makes the question so interesting when you turn it toward large language models. With these systems, you actually can do these probes. Representation engineering and linear probing methods - techniques for reading information encoded in a model's internal activations - make it possible to locate where and how a concept lives in the model's geometry, and to ask questions about the relationship between different versions of the same idea. 

Recent work extracting persona vectors from model activations has shown that personality-relevant information is genuinely structured in that space — not just a surface behavior but something with geometric shape (Chen et al., 2025). The question is how deep that structure goes, and what it's connected to.

I'm interested in whether the way a model represents a concept in relation to itself is geometrically equivalent to how it represents that concept in theory, or in relation to others. Are there clean transformations between a model's concept of itself being honest, and you telling the truth, and a politician making a promise, and a character in a novel confessing something? How does any of that translate into the model actually being honest? 

This last question is the personality illusion. Han et al. (2025) showed that RLHF-trained models produce stable, internally consistent self-reported personality profiles, and that those profiles are surprisingly weak predictors of how the model actually behaves on tasks designed to measure the same traits. The self-concept and the behavioral disposition are already coming apart at the text level, and I want to know where they come apart in the geometry.

I see the gap between a model's self-concept, its behavioral disposition, and its self-report as a hook to legibility: being able to actually understand the model, and eventually, the models’s ability to understand us. 

We can probe current models with classifiers trained on activations and contrastive steering experiments, methods developed in representation engineering (Zou et al., 2023). There is even evidence of what Binder et al. (2024) call privileged self-prediction — models predict their own future behavior better than other models can, which suggests some form of internal self-access exists, though its mechanism remains unidentified. 

The question is what we find when we look more carefully: whether the model's identity, such as it is, is coherent across these different modes of representation, or whether it is, like mine sometimes feels, a collection of narratives that are at times in conflict, that rise and rest from the deeper mystery of the self. 