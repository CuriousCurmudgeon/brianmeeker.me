---
title: "From C# To Perl: Performance"
description: "A superficial performance comparison of C# and Perl"
date: "2011-03-21"
tags: 
  - "c-sharp"
  - "performance"
  - "perl"
---

#### Caveats

Let's talk about the performance of C# vs. Perl. First, let me just say that a performance comparison of a staticly-typed, pre-compiled language vs. a dynamically-typed, scripting language is inherently unfair. Yes, .NET does not compile to native code, but the comparison is still unfair. A static, type-safe language avoids the overhead of compilation on startup and allows for more optimization, particularly removing virtual calls when not needed.

#### Comparison

With that being said, how much faster is C# in benchmarks? My usual source when comparing the performance of programming languages is the [The Computer Language Benchmarks Game](http://shootout.alioth.debian.org/). [Here](http://shootout.alioth.debian.org/u32/benchmark.php?test=all&lang=csharp&lang2=perl) you can see the comparison of C# vs. Perl. One thing to note is that I am comparing the performance of the Mono implementation of C# vs. Perl, not the Microsoft .NET implementation. The performance of Mono is comparable to that of .NET these days and the benchmark game runs the benchmarks on Ubuntu, so I'm just going to run with it. Also, while small benchmarks have [severe limitations](http://shootout.alioth.debian.org/dont-jump-to-conclusions.php), they will serve the purpose here.

We can see three metrics in the comparison: time, memory, and code size. Various benchmarks stress each differently, but the trends are clear. First, C# is a hell of a lot faster than Perl. As I stated above, this shouldn't surprise anybody.

The more interesting comparisons are memory and code. We can see that Mono uses 13x more memory on the mandelbrot benchmark, but is anywhere from even to 3x more on every other. It also requires up to 5x more code than Perl. You can see the source code for the benchmarks that required much more code in C# below.

k-nucleotide: [C#](http://shootout.alioth.debian.org/u32/program.php?test=knucleotide&lang=csharp&id=4) [Perl](http://shootout.alioth.debian.org/u32/program.php?test=knucleotide&lang=perl&id=2) reverse-complement: [C#](http://shootout.alioth.debian.org/u32/program.php?test=revcomp&lang=csharp&id=1) [Perl](http://shootout.alioth.debian.org/u32/program.php?test=revcomp&lang=perl&id=4)

You can see that the code for the k-nucelotide benchmark is much more concise in Perl. The verboseness of C# in this case hinders the ablity to quickly understand the algorithm. The same is true for reverse-complement, though not quite as bad, with Perl's concise file-handling operations being the main difference.

You can also see the same comparison made on a [quad-core 32-bit machine](http://shootout.alioth.debian.org/u32q/benchmark.php?test=all&lang=csharp&lang2=perl). The same trend holds and you can also see that Mono makes better use of multiple cores. Unfortunately, benchmarks are not available for Perl on 64-bit processors.

#### Does It Matter

So what? C# is faster. How often does it really matter? If you aren't doing heavy number crunching, it probably doesn't. These days performance is often limited by outside factors, such as network latency or database performance. But let's say you have identified a bottleneck in your code and it is definitely _your_ code that is the bottleneck. How would you go about improving performance in each language?

You have similar options for both languages. In C# you can link to native code (usually a compiled C/C++ binary) or you can declare your code to be [unsafe](http://msdn.microsoft.com/en-us/library/aa288474(VS.71).aspx) to get direct access to pointers. Either way, it's going to introduce some pain. Integrating C# with native code always made me feel dirty and I usually ended up putting a wrapper class around it to hide the ugliness. Declaring your code to be unsafe isn't much better. Most of its speed benefits come from getting the runtime out of the way, meaning you lose most of the benefits of C# over C/C++.

Perl gives you a few options that are mostly equivalent to those in C#. First, you can inline C code with the [Inline](http://search.cpan.org/~sisyphus/Inline-0.47/Inline.pod) module. This is admittedly pretty sweet for simple cases. You don't have to use C, but if you are doing it for performance reasons you probably will. This is great if you have a single performance sensitive algorithm in your module, because, as the name implies, you can do it inline. However, there are limitations to what you can do with this method. If you need to improve the performance of a whole module, you are best served by using [XS](http://perldoc.perl.org/perlxs.html). This is not for the faint at heart, but will allow you to transparently call C code within Perl.

#### Conclusion

What we have found is pretty much what was expected. C# is much faster, but uses more memory than Perl and is more verbose. They both have similar options to improve performance by integrating with code written in C, although Perl's seem slightly more natural to me.

Once again though, does it really matter? Most programmers are not tackling performance sensitive problems and hardware is cheap. If performance does matter, you're probably better off with C#, but in the grand scheme of things, whatever tools your team is familiar with is the far more important factor.
