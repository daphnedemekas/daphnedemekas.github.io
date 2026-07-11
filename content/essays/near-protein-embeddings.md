---
title: Proteins as Language
date: January 2026
order: 2
---

There is something deeply satisfying in the moment one realizes that two distant fields have been asking the same underlying question. For me that moment arrived in a bioinformatics laboratory at the University of Arizona, where I sat staring at protein sequences and thinking, all the while, about words.

## Sequences That Mean Something

A protein is, at bottom, a string of amino acids. There are twenty of them, drawn from a small alphabet and strung together into long chains that may run to hundreds or thousands of residues, and everything depends upon their arrangement. Just as the meaning of a sentence lives in the order its words take and the relations they have with one another, so the function of a protein follows from the particular sequence and structure of its chain. Two proteins may share almost nothing upon the surface and yet remain homologs, evolutionary relatives that fold into similar shapes and carry out similar work within the cell, and the finding of these hidden kinships is among the central problems of bioinformatics.

The traditional approach is to compare sequences directly, lining them up, scoring how well the letters match, and inferring relatedness from the quality of the alignment. For close relatives this works beautifully. But evolution is a long game, and over millions of years mutations accumulate until the sequences of distant cousins have diverged so far that they appear at first glance to be strangers. The question is whether we can build a representation of amino acids that can recognize where in the sequence lie the similarities that encode the deep ancestry.

## What Word Embeddings Taught Us

The revolution in natural language processing arrived when researchers found that a word might be represented as a point in a geometric space, in place of an arbitrary symbol. Within such a space, words that behave alike, that appear in similar contexts and stand in for one another, come to lie close together; "king" settles near "queen," and "running" near "walking." These word embeddings capture something real about meaning, and they do so purely from the patterns of how words co-occur.

The analogy to proteins is almost uncanny. Amino acids, like words, take their meaning from context. An alanine in one position of a protein may be functionally interchangeable with a valine, both small, both hydrophobic, both tolerated by the surrounding structure, while in another position that same substitution would prove catastrophic. What we needed was a way to learn, from the data itself, which amino acids resemble one another in the ways that matter for the functioning of a protein.

## NEAR: Learning the Geometry of Amino Acids

This is the task that [NEAR, Neural Embeddings for Amino Acid Relationships](https://academic.oup.com/bioinformatics/article/41/Supplement_1/i449/8199346), sets out to accomplish. The work was carried out at the Wheeler Lab at the University of Arizona, with Daniel Olson, Thomas Colligan, Jack Roddy, Ken Youens-Clark, and Travis Wheeler.

NEAR uses a ResNet embedding model trained by contrastive learning upon trusted sequence alignments, and the idea has an elegance to it. One takes pairs of amino acid sequences already known to be related, drawn from curated alignment databases, and trains the network to embed them such that related sequences come to rest close together in the learned space while unrelated ones are driven apart. Through this process the network arrives at a vector representation for each of the twenty amino acids, a compact and learned geometry that encodes which of them are functionally interchangeable.

What makes this compelling is that the embeddings are not designed by hand. The traditional substitution matrices, BLOSUM and PAM among them, are built from curated alignments of known protein families; they have been the workhorses of the field for decades, and yet they are static, fixed summaries of average substitution rates across a particular dataset. NEAR's embeddings are instead learned end to end from the data and optimized for the specific task of recognizing evolutionary relationships, which lets them capture subtleties that a fixed matrix is liable to miss.

## Finding Distant Relatives, Fast

The real test of any method for comparing proteins lies in how well it detects remote homologs, proteins that diverged so long ago that their sequences have drifted far apart even as their structures and functions endure. These are precisely the cases in which the matching of sequences alone begins to fail, where the signal sinks into the noise and only a richer representation can recover the connection.

NEAR's learned embeddings substantially improve accuracy relative to state-of-the-art protein language models, and they do so with lower memory requirements; but what makes them especially practical is their speed. The embeddings serve as a pre-filter for homology search, running at least five times faster than the pre-filter currently used in HMMER3, one of the most widely used tools in the field. This matters because protein databases are enormous and forever growing, and any gain in the speed of the initial filtering step translates directly into the capacity to search larger databases, more often, and at greater scale.

That speed follows from the compactness of the learned representations. In place of an expensive full alignment run upon every candidate pair, one first embeds both sequences into the learned space and checks whether they lie close enough to warrant a fuller comparison. The embedding step is cheap, a single forward pass through the ResNet, and the geometry does the heavy work of filtering away the pairs that are plainly unrelated.

This is, in a sense, the same trick that lends word embeddings their power in language. A search engine that understands "car" and "automobile" to be near neighbors in meaning will return better results than one that treats them as unrelated strings, and a homology system that understands the functional relations among amino acids will find connections that no literal matcher of characters could.

## The Shape of Biological Meaning

What I find most beautiful in this work is the intuition that lies beneath it, that meaning, whether linguistic or biological, has a geometry, and that when the right representation is learned, the structure of the space itself comes to encode the relationships one cares about. Words of similar meaning cluster together; amino acids of similar role in the architecture of proteins cluster together; and in both cases the geometry is discovered from within, emerging from the patterns of how these symbols are used in their contexts, a structure the data gives up of its own accord.

Working on NEAR was formative for me. It was an exercise in the power of learned representations, in the idea that a model given the right task and the right data will find structure one never explicitly told it to seek. That intuition, that the geometry of a learned space can disclose something true about the world, has shaped the way I think about representation learning more broadly, from the structure of biological sequences to the structure of minds.
