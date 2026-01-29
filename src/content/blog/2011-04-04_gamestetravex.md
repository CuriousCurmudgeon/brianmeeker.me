---
title: "Games::Tetravex"
description: "Experimentation with building Tetravex in Perl using SDL and Moose."
date: "2011-04-04"
heroImage: "/assets/2011-04-04_gamestetravex/tetravex.png"
heroImageAlt: "Demo of clicking square tiles to flip them over with a nice animation"
tags: 
  - "perl"
  - "sdl"
  - "tetravex"
---

After much gnashing of teeth, I got [Games::Tetravex](https://github.com/CuriousCurmudgeon/Games--Tetravex) working earlier this week. This a Perl implementation of [tetravex](http://en.wikipedia.org/wiki/TetraVex) using [SDL](http://sdl.perl.org/) and [MooseX::Declare](http://search.cpan.org/~flora/MooseX-Declare-0.34/lib/MooseX/Declare.pm). As my first foray into both SDL and [Moose](http://search.cpan.org/~drolsky/Moose-1.24/lib/Moose.pm), as well as the first game programming I have done since college, I thought it would be useful to lay out my impressions.

#### SDL

I'm pretty ignorant when it comes to graphics libraries. I did a little bit of game design in college in Java, but nothing with any depth. My crowning achievement was a half-working, four player, networked pong that I wrote in a two night code flurry. Then we got our grade and I never looked at the code again. With such little experience my first task was locating some tutorials. Luckily, I stumbled on [SDL\_Manual](https://github.com/PerlGameDev/SDL_Manual) which, while not great, gave me enough of a primer to get started.

As far as actually using SDL for Games::Tetravex, it was pretty easy. It required me to start thinking in terms of (x, y) coordinates again, but, armed with some scrap paper, I was able plot out most of my canvas fairly quickly. It's by no means pretty, but it does the job. I was quite happy with the [SDLx::App](http://search.cpan.org/~kthakore/SDL-2.532/lib/pods/SDLx/App.pod) and [SDLx::Controller](http://search.cpan.org/~kthakore/SDL-2.532/lib/pods/SDLx/Controller.pod) wrapper modules, as these made writing the actual game loop a piece cake. It becomes as simple as creating the app, registering some event callbacks, and calling run. Very nice.

#### Moose

To me, Moose is what gives Perl a future. Without a full featured OO framework it will be difficult to attract young developers to the language and Moose delivers the goods. My usage in this project is primitive, but I still came away with a good impression. I started the project as just one big script until I got a handle on what exactly I wanted to do. At that point I started refactoring using MooseX::Declare and was very pleased with the final result. In truth, the use of MooseX::Declare was complete overkill for a project of this size, but I figured I might as well jump into the deep end of the pool and see what happens.

It wasn't all fun though. The big issue is the stack traces MooseX::Declare returns whenever you have some sort of parse error. They're awful. Very rarely did they give any information about where the parse failed. I had to resort to commenting out large blocks of code until the program would run again. That was the only pain point I ran into, but it was a doozy. I'm sure there is useful information buried in there, but a stack trace of over a hundred lines with no useful summary is a problem.

#### To Do

There is still a lot left to do. The big one is that you can only play a 3x3 grid. After that it needs a lot of spit and polish, such as

- timers
- configuration
- top times
- better piece swapping animations
- improved graphics

and a bunch more I'm forgetting right now. We'll see how much I actually get to before my eye starts wandering to some new piece of shiny I want to learn.

Code available on github at [https://github.com/CuriousCurmudgeon/Games--Tetravex](https://github.com/CuriousCurmudgeon/Games--Tetravex).
