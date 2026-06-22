---
title: Identity Geometry
date: March 2026
order: 4
---

At the meeting point of human and artificial minds there sits an open question about what it means to have an identity at all: why it arises, what work it does, and whether it serves or hinders a learning system.

## A symphony of selves

Whenever I try to settle upon a concrete account of who I am and what I am like, each of the forms I reach for dissolves under examination. They fasten themselves to my motivations, my relationships, the way I wish to be seen, and they offer their justifications; they grow vivid enough that I can wear them for a while, and then they slip away again.

I can feel the collection of my narrative selves in conversation with one another, each tugging toward a different possibility of who to be, how to be her, what would make sense. I am drawn to the belief that there is a higher self, or a truer one, an amalgamation of them all, the thing from which they arise and to which they return; and yet the construction of my reality, of my interactions and my small daily decisions, is carried out in constant exchange with this orchestra of stories.

Take mathematics. I was drawn to it at a time when growing and being in the world felt deeply confusing, in all the ways it does when one is still assembling oneself. When I sat and thought inside the abstract world of mathematics, things made sense, and I had a sure way of being right about something.

Over time it became more layered, at once a thing in itself and a story about who I was. It paved the way for much of what later unfolded for me, the research and the people I met through it; it was a toolkit with which I formulated abstractions about the way things change and form relations with one another, the way spaces deform and objects move within them, a particular lens through which I could peer at life.

My relationship to mathematics is now both beautiful and heavy. The pure appreciation and awe remain ever present, and yet there is frustration in it too, for as my identity evolves around it and my attention turns to other things in other ways, I come to feel the magnitude of what I will never fully understand. The depth of the thing exceeds what I can hold.

All of which is to say that were you to probe the representation of mathematics in my mind, you would not find a clean, context-free concept. You would find something entangled with emotion, with self-construction, with the particular moment in my life when I first reached for it. And I wonder why that should be. Why do we wrap our representations so deeply in the history of how we formed and what we needed? What is it about minds that makes things matter, that binds concepts to the self?

## Interpreting the model

This is what makes the question so interesting when one turns it toward large language models, where the probes can actually be carried out. Representation engineering and linear probing, techniques for reading the information encoded in a model's internal activations, make it possible to locate where and how a concept lives within the model's geometry, and to ask after the relationship between different versions of the same idea.

Recent work extracting persona vectors from model activations has shown that personality-relevant information is genuinely structured in that space, possessed of a geometric shape and not confined to the surface of behavior (Chen et al., 2025). The question is how deep that structure goes, and what it is bound to.

I am interested in whether the way a model represents a concept in relation to itself is geometrically equivalent to the way it represents that concept in the abstract, or in relation to others. Are there clean transformations between a model's concept of its own honesty, and your telling the truth, and a politician making a promise, and a character in a novel confessing something? And how does any of that translate into the model's actually being honest?

This last question is the personality illusion. Han et al. (2025) showed that RLHF-trained models produce stable, internally consistent self-reported personality profiles, and that those profiles are surprisingly weak predictors of how the model actually behaves on tasks designed to measure the very same traits. The self-concept and the behavioral disposition are already coming apart at the level of text, and I want to know where they come apart in the geometry.

I see the gap between a model's self-concept, its behavioral disposition, and its self-report as a hook toward legibility: toward being able genuinely to understand the model, and eventually toward the model's own capacity to understand us.

We can probe current models with classifiers trained upon their activations and with contrastive steering experiments, methods developed in representation engineering (Zou et al., 2023). There is even evidence of what Binder et al. (2024) call privileged self-prediction, the finding that models predict their own future behavior better than other models can, which suggests that some form of internal self-access exists, though its mechanism remains unidentified.

The question is what we find when we look more carefully: whether the model's identity, such as it is, holds coherent across these different modes of representation, or whether it is, as mine sometimes feels, a collection of narratives at times in conflict, rising and resting from the deeper mystery of the self.
