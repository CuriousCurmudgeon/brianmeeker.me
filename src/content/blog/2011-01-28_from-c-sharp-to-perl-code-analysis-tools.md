---
title: "From C# To Perl: Code Analysis Tools"
description: "A comparison of static code analysis tools in Perl and C#"
date: "2011-01-28"
tags: 
  - "c-sharp"
  - "fxcop"
  - "perl"
  - "perl-critic"
---

At my last job we ran a continuous integration server with [CruiseControl.NET](http://confluence.public.thoughtworks.org/display/CCNET/Welcome+to+CruiseControl.NET). As part of each build we did code analysis with FxCop. (We also ran StyleCop, but that was only to run one custom rule to address a problem we were having.) [FxCop](http://msdn.microsoft.com/en-us/library/bb429476.aspx) is a tool that analyzes .NET assemblies for potential design, localization, performance, and security problems. Most of these rules are pulled from [Framework Design Guidelines: Conventions, Idioms, and Patterns for Reusable .NET Libraries](http://www.amazon.com/Framework-Design-Guidelines-Conventions-Libraries/dp/0321545613), which serves as the de-facto style guidelines in many .NET shops. (We used it to avoid petty formatting arguments. Whatever FDG said was the decider unless we unanimously disagreed.)

So, what are the options in Perl and how do they compare to FxCop? Luckily the Perl community has an excellent tool for code analysis as well, [Perl::Critic](http://search.cpan.org/dist/Perl-Critic/). I am not aware of any other Perl code analysis tools. It too pulls many of its rules from a standard text, Damian Conway's [Perl Best Practices](http://www.amazon.com/Perl-Best-Practices-Damian-Conway/dp/0596001738). Let's look at how it stacks up.

One criticism of FxCop is its unwieldy XML files. Depending on the size of your code base and your configuration it is easy to end up with XML files running into the tens of megabytes. Perl::Critic, like most UNIX tools, disdains the use of XML (usually a plus) and instead outputs violations one to a line. Both tools let you configure which rules/policies to include with each run. FxCop throws these into the same massive .fxcop XML file while Perl::Critic looks for an INI-style file called .perlcriticrc in your home directory. Speaking of that massive XML file, FxCop also has a nasty habit of rewriting its XML results and configuration across runs, leading to some nasty conflicts if you have multiple developers committing changes simultaneously.

Why would you commit changes though? This is an area where FxCop comes out ahead. Both tools let you exclude violations. Perl::Critic does it through the use of ["no critic"](http://search.cpan.org/dist/Perl-Critic/lib/Perl/Critic.pm#BENDING_THE_RULES) annotations. FxCop gives you more flexibility. It allows you to use attributes to suppress specfic violations in any scope you can apply an attribute too. In addition, you can add exceptions directly to your XML through the GUI tool to avoid cluttering your code. You probably don't want to try editing the XML config yourself. It's a beast.

FxCop also has some advantages because it works on bytecode. Since all .NET languages compile to the same bytecode you can use FxCop on any .NET language. In Perl this would be similar to using Perl::Critic on Parrot bytecode to analyze any language that runs on Parrot. However, in practice this doesn't matter too much. Most .NET code bases are homogenous. It's still pretty awesome though.

Any advantages that FxCop has though are blown away by the fact that Perl::Critic is open source and FxCop isn't. FxCop doesn't even have a published API. This means you cannot write your own custom rules. Seriously. Someone explain to me why this is a good idea. There is someone trying to [document the API](http://www.binarycoder.net/fxcop/index.html), but it's a poor substitute for the real thing. Perl::Critic on the other hand is open source with each policy neatly organized into its own module. Install it from CPAN and you'll get a bunch of policies, all of which you can view the code for to learn how to write your own. And there a [lot more rules](http://search.cpan.org/dist/Perl-Critic/lib/Perl/Critic.pm#SEE_ALSO) just waiting for you to try out.

In the interest of fairness, [StyleCop](http://stylecop.codeplex.com/) is open source, but I don't have a lot of experience with it. We briefly looked at using the built-in rules, but decided we didn't really care for a lot of them. A number of these rules would fall into the type of style rules that Perl::Critic has though.

If Perl::Critic had the exclusion capabalities that FxCop has this wouldn't even be close, but even with those limitations I still prefer it. Point Perl.
