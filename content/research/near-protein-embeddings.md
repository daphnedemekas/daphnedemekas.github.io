---
title: Proteins as Language
date: January 2025
order: 3
---

There is something deeply satisfying about the moment you realize two fields are asking the same question in different clothes. For me, that moment came in a bioinformatics lab at the University of Arizona, staring at protein sequences and thinking about words.

## Sequences That Mean Something

A protein is, at its most basic, a string of amino acids. There are twenty of them, drawn from a small alphabet, and they are strung together in long chains — sometimes hundreds or thousands of residues long. The magic is in the arrangement. Just as the meaning of a sentence depends not on which letters appear, but on the order they come in and the relationships between words, the function of a protein depends on the specific sequence and structure of its amino acid chain. Two proteins can share very little surface-level similarity and still be *homologs* — evolutionary relatives that fold into similar shapes and carry out similar work in the cell. Finding those hidden kinships is one of the central problems in bioinformatics.

The traditional approach is to compare sequences directly: line them up, score how well the letters match, and infer relatedness from alignment quality. This works beautifully for close relatives. But evolution is a long game. Over millions of years, mutations accumulate, and the sequences of distant cousins can diverge until they look, on the surface, like strangers. The question is: can we build a representation of amino acids that sees past the surface?

## What Word Embeddings Taught Us

In natural language processing, a revolution happened when researchers realized that you could represent words not as arbitrary symbols, but as points in a **geometric space**. In this space, words that behave similarly — that appear in similar contexts, that substitute for each other — end up close together. The word "king" lives near "queen"; "running" lives near "walking." These are called *word embeddings*, and they capture something real about meaning, purely from patterns of co-occurrence.

The analogy to proteins is almost uncanny. Amino acids, like words, derive their meaning from context. An alanine in one position of a protein might be functionally interchangeable with a valine — both small, both hydrophobic, both tolerated by the local structure. In another context, that same substitution could be catastrophic. What we needed was a way to learn, from data, which amino acids are similar *in the ways that matter for protein function*.

## NEAR: Learning the Geometry of Amino Acids

This is what **NEAR** — *Neural Embeddings for Amino Acid Relationships* — sets out to do. The work was done at the Wheeler Lab at the University of Arizona, with Daniel Olson, Thomas Colligan, Jack Roddy, Ken Youens-Clark, and Travis Wheeler.

NEAR uses a **ResNet embedding model** trained via **contrastive learning** from trusted sequence alignments. The idea is elegant: take pairs of amino acid sequences that are known to be related (from curated alignment databases), and train the network to embed them so that related sequences end up close together in the learned space, while unrelated sequences are pushed apart. Through this process, the network learns a vector representation for each of the twenty amino acids — a compact, learned geometry that encodes which amino acids are functionally interchangeable.

What makes this compelling is that the embeddings are not hand-designed. Traditional substitution matrices, like **BLOSUM** or **PAM**, are constructed from curated alignments of known protein families. They are powerful and have been workhorses of the field for decades. But they are static — fixed summaries of average substitution rates across a particular dataset. NEAR's embeddings, by contrast, are learned end-to-end from the data, optimized for the specific task of recognizing evolutionary relationships. This means they can capture subtleties that a fixed matrix might miss.

## Finding Distant Relatives, Fast

The real test of any protein comparison method is how well it detects *remote homologs* — proteins that diverged so long ago that their sequences have drifted far apart, even though their structures and functions remain similar. These are the cases where sequence-matching alone starts to fail, where the signal-to-noise ratio drops and you need a richer representation to see the connection.

NEAR's learned embeddings substantially improve accuracy relative to state-of-the-art protein language models (PLMs), and with lower memory requirements. But what makes it especially practical is **speed**: the learned embeddings serve as a pre-filter for homology search, running at least **5x faster** than the pre-filter currently used in HMMER3 — one of the most widely used tools in the field. This matters because protein databases are enormous and growing. Any improvement in the speed of the initial filtering step translates directly into the ability to search larger databases, more frequently, at scale.

The speed comes from the compactness of the learned representations. Instead of running expensive full alignments on every candidate pair, you first embed both sequences into the learned space and check whether they are close enough to warrant a full comparison. The embedding step is cheap — a forward pass through the ResNet — and the geometry does the heavy lifting of filtering out the obviously unrelated pairs.

This is, in a sense, the same trick that makes word embeddings so powerful in NLP. A search engine that understands that "car" and "automobile" are semantically close will return better results than one that treats them as unrelated strings. Similarly, a homology detection system that understands the functional relationships between amino acids will find connections that a literal string-matcher cannot.

## The Shape of Biological Meaning

What I find most beautiful about this work is the underlying intuition: that meaning — whether linguistic or biological — has a **geometry**. That when you learn the right representation, the structure of the space itself encodes the relationships you care about. Words that mean similar things cluster together. Amino acids that play similar roles in the architecture of proteins cluster together. And in both cases, the geometry is not imposed from outside but *discovered* from the data, emerging from the patterns of how these symbols are used in context.

Working on NEAR was formative for me. It was an exercise in the power of learned representations, in the idea that if you give a model the right task and the right data, it will find structure you did not explicitly tell it to look for. That intuition — that the geometry of a learned space can reveal something true about the world — has shaped how I think about representation learning more broadly, from the structure of biological sequences to the structure of minds.
