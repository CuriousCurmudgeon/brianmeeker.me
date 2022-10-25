---
title: "Setting Expectations With the Cone of Uncertainty"
description: "I've been doing a lot of planning and estimating at work the past couple weeks. This led me to brush off an estimation technique I hadn't used in a long time, the cone of uncertainty."
date: "2021-11-11"
heroImage: "/assets/2021-11-11_setting-expectations-with-the-cone-of-uncertainty/cone_of_uncertainty_whiteboard.jpg"
heroImageAlt: "Hand drawn image of the cone of uncertainty on a whiteboard"
tags: 
  - "agile"
  - "estimating"
---

I've been doing a lot of planning and estimating at work the past couple weeks. The goal has been to figure out what project can get us the most bang for the buck while working around some other deadlines.

To make this happen, I've been going through a lot of requirements, writing a lot of stories, and doing a lot of estimating with story points. While the requirements gathering has been collaborative, the writing of stories and estimation has been a one man operation. Such is the nature of early start up life. At the end of this though, I need to provide an estimate of how long a feature will take to develop. Reaching into my bag of tricks, I've gone back to using the [cone of uncertainty](https://en.wikipedia.org/wiki/Cone_of_Uncertainty) a lot.

The cone of uncertainty is a tool to provide error bars on your estimate based on where you are in the planning and implementation process. The key is to accept that your estimate is going to be wrong and to communicate an appropriate amount of uncertainty around it.

For example, during project inception the range of outcomes is very large. This makes sense because you don't actually know a lot yet. There is probably an end business goal in mind, but nobody has started to look into the details yet. If you give a gut feel estimate of 4 weeks, the cone says that the range of uncertainty at this point is from 1-16 weeks. This range is absurd and not helpful to a product owner, but it helps communicate that even asking for an estimate at this point is unrealistic.

As you begin to gather and refine requirements, the cone narrows. The exact numbers of the curve (and even the categories) are pretty poorly defined. You'll find varying numbers of categories and specificity, but in general you'll find ranges like the curve above.

- Inception - 0.25 - 4x
- Elaboration - 0.5 - 2x
- Construction - 0.8 - 1.25x

# An Example

To make things more concrete, I just finished estimating a project that came out to 82 points. Our sustainable velocity over two week sprints is currently 30 points. We're firmly in the _elaboration_ part of the curve, which gives a multiplier of 0.5 - 2.0x. This gives us the following range

```
Lower range: 82 points * 0.5 / 30 points per sprint * 2 weeks per sprint = 2.73 weeks
Upper range: 82 points * 2 / 30 points per sprint * 2 weeks per sprint = 10.9 weeks
```

A range of of 2.73- 10.9 weeks is large, but I think it accurately reflects the reality of many software projects where implementation hasn't even started yet. We're bad at estimating and using a tool to communicate that can help.

# Narrowing With Iterations Instead

In _[Agile Estimating and Planning](https://www.mountaingoatsoftware.com/books/agile-estimating-and-planning),_ Mike Cohn suggests an alternative way to narrow your cone by using the number of completed iterations instead of stages like _Inception_, _Elaboration_, and _Construction_. In this model, the range of your estimate tightens with each completed sprint until you have completed 4 or more. Obviously, the usefulness of this technique can be limited if your project is too small to have that many iterations, but it can be a useful technique to fall back on for a medium sized project. I use 2 week sprints, so if the project is less then 8 weeks long, I won't even finish 4 sprints.

# Summary

Overall, the cone of uncertainty as presented here is not a formalized construct with a lot of data behind it. However, throughout my career, I have found it to be a useful tool to guide discussion and expectation with product owners. It's an easy to understand concept that lends itself to quick explanation and provides a reasonable framework when you need an estimate for how long a project takes.
