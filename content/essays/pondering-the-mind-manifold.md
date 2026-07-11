---
title: Pondering the Mind Manifold
date: July 2025
order: 5
---

## Latent Space of Mind

Lately I have taken pleasure in imagining the space of my mind as the latent space of a neural network: a high-dimensional manifold, folded in such a way that every concept I hold can be unfurled to reveal further hidden associations, so that two ideas might lie close together along some axes and far apart along others. This lets me conceive of experience as something other than a flat sequence of thoughts and feelings; it becomes instead a set of trajectories through a richly structured geometry.

This manifold of mind is not filled only with concepts themselves, but in addition it holds the components that drive the formation of the concepts:  habits, intuitions, tendencies, and methods of making meaning. Every moment of experience invokes a hierarchical and intricate traversal of this space, through the representation of what I am seeing, of how I am seeing it, of what it means to me, and of how I am holding myself throughout that moment, in my body and in the seat of my mind. Sensation, thought, and action become a continuous and interconnected choreography, in which the activation of one region inevitably excites a constellation of others, in a never-ending cosmic dance of the brain.

Given the mind as a manifold, one begins naturally to wonder how this space is structured, how it changes as I gather new experience, and what it is that makes one explanation feel coherent, useful, and satisfying while another falls flat.

## Latent Space of AI

The structure of this manifold of mind is a near-perfect analogy for the modern neural network, which likewise stores what it knows as geometry: a vast space of learned vectors in which nearness stands for likeness of meaning. In this paper by Kumar, Clune, Lehman, and Stanley, [Questioning Representational Optimism in Deep Learning](https://arxiv.org/abs/2505.11581), they make the stakes of that geometry vivid by setting two possibilities against one another. In the first, which they call the Unified Factored Representation, the internal space is clean, compositional, and coherent: related things cluster together, and knowledge generalizes smoothly because moving one concept moves the others that ought to move with it. In the second, the Fractured Entangled Representation, the same space is messy and inconsistent; concepts that belong together are scattered far apart, and the network's capacity to generalize, to keep learning, and to be creative is degraded accordingly. Most strikingly, they show that two networks can produce identical outputs while differing utterly in this respect, so that competence at a task tells you almost nothing about whether the representation beneath it is coherent or fractured.

The same question, whether knowledge is held in a connected or an isolated way, drives a strand of mechanistic interpretability that tries to read the answer off the curvature of a model's loss landscape. [Recent work from Goodfire](https://arxiv.org/abs/2510.24256) uses that curvature to tell apart what a network merely memorizes from what it genuinely computes, and finds that a model's capabilities fall along a spectrum, with rote recitation at one end and logical reasoning at the other. The intuition I take from it is that a concept stored generally is entangled with everything around it, so that disturbing it sends a shift rippling outward through the representation; a concept stored in isolation can be disturbed and nothing else moves. On this picture a model might memorize its arithmetic, each fact sitting apart in its own pocket, while reasoning through something like Boolean logic, where the meaning of a word like "if" is so bound up with everything else that to perturb it is to perturb the whole.

## Reinforcement Learning as Compression

If competence at a task can conceal a fractured representation, it is worth asking how these representations come to be in current AI systems, and whether the way we build models tends toward coherence or toward fragmentation. Language models begin life [trained to predict the next token](https://arxiv.org/abs/2005.14165) in a sequence, which is to say to autocomplete text, across the whole of the internet. The model is vast, its space enormous, and in time it becomes extraordinarily good at knowing what comes next. As a consequence it becomes good, for the most part, at being right as well, since a great deal of the time the most likely continuation happens also to be the correct one; ask it a question, let it begin to simulate its own answer, and it arrives somewhere reasonable. But fluency of this kind does not guarantee a coherent space beneath it.

We then began to ask how to make these models represent the soundest way of thinking about a question, and not merely grow fluent in the appearance of it. So we turned to [reinforcement learning](https://arxiv.org/abs/2501.12948), rewarding the paths of reasoning that arrive at good answers, as a way of compressing that sprawling predictive space into something that reasons, much as one might take a person who has seen and heard everything and help them make sense of it all.

But I wonder whether applying reinforcement learning to an already fractured space is more like hammering a tangle into a squeezed-up shape than refactoring it into a coherent geometry. If so, I wonder whether there might be a way to train these models from the beginning so that they only ever form concepts that logically follow from one another, and would be the better suited to guide us toward coherent truths. But what would such a model be like?

## Geometry of the Self

This makes me curious about the way our own human minds represent concepts, and to what extent our inner worlds are fractured and entangled, and how years of evolution and adaptation may have hammered a messy space into some functional form. 

I wonder, in particular, about the representation I hold of myself within the manifold of my mind. If I perturbed that vector, how much else would move with it? If I perturbed it enough, would I become someone else entirely? Would I begin to believe things I had never believed, because who I take myself to be had shifted, and with it everything that follows?

