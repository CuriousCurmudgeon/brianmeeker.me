---
title: "From C# To Perl: Garbage Collection"
description: "A quick, surface level comparison of garbage collection in C# and Perl."
date: "2011-02-19"
tags: 
  - "c-sharp"
  - "perl"
---

I don't think that it is a stretch to say that every modern language that isn't built especially for peformance or system programming uses a garbage collector. The programmer productivity gains that you get by lifting the burden of manual memory management can be large. Sure, you lose some control, but most tasks don't require that level of control. C/C++ is always there if by chance you actually do. With that being said, let's look at how the Perl and C# garbage collectors compare.

Perl employs a simple [reference counting garbage collector](http://en.wikipedia.org/wiki/Reference_counting). A reference counting garbage collector works exactly as the name implies. It keeps a count of the number of references to a piece of data on the heap. When the number of references to an object reaches zero the collector knows that it can reclaim the data. The major limitation of this algorithm is that it cannot handle circular references because the reference count will never reach zero. Even if your application can no longer access the data, the collector will never reclaim it, leading to a memory leak. Fortunately, circular data structures don't come up in most applications, but you must be aware when they do. Perl allows you to get around this by [weakening a reference](http://perldoc.perl.org/Scalar/Util.html). A reference that has been weakened does not increment the reference count for the garbage collector, allowing the it to reclaim circular data structures when used properly.

Coming from C# the simplicity of the Perl garbage collector was a bit of a surprise, because, quite frankly, I find the .NET garbage collector to be amazing. It uses [generational collection](http://en.wikipedia.org/wiki/Tracing_garbage_collection#Generational_GC_.28ephemeral_GC.29), allowing for faster collection cycles that get most objects, with periodic longer collections to check older generations. The longer collection cycles use a simple mark and sweep algorithm. There are even [different modes](http://msdn.microsoft.com/en-us/library/bb384202.aspx) depending on if you have a desktop or web application. It also allows you to [weaken references](http://msdn.microsoft.com/en-us/library/ms404247.aspx), [manage non-memory resources with finalizers](http://msdn.microsoft.com/en-us/library/system.object.finalize.aspx) (although you should be implementing the IDisposable pattern), [induce collections](http://msdn.microsoft.com/en-us/library/bb384155.aspx), or get [notifications](http://msdn.microsoft.com/en-us/library/cc713687.aspx) when the runtime senses a full garbage collection is approaching. This is a massive topic, but if you want to learn more about .NET garbage collection then you ever wanted to, a good place to start is the blog of [Maoni Stephens](http://blogs.msdn.com/b/maoni/), who spends her days actually working on it.

Put simply, C# collector puts Perl's to shame. Unfortunately, the [programming language shootout](http://shootout.alioth.debian.org/) uses the Mono implementation of C#, so a quick comparison against Perl isn't feasible. Quick benchmarks most likely won't exercise the generational collector very well anyways. If Perl 6 ever gets around to being ready (I'm not counting on it), Parrot will allow for pluggable garbage collection engines. I would fully expect for something better than the current Perl 5 garbage collector to be an option. For now though, C# has a clear edge.