My very first job out of college was at a law firm with hundreds of paralegals. They were running an in-house workflow system to manage foreclosure and bankruptcy cases. I lucked into a boom industry when the housing bubble burst. At the peak, we were doing over 100K of each a year.

The work was broken down into finely sliced tasks. Paralegals worked out of a queue of tasks, mostly of the same flavor. It was an assembly line for court filings; Taylorism brought to legal work.

Before I started, a new executive had been brought in. One of her jobs was to streamline process. Her plan was simple. She was going to stand behind employees with a stopwatch and time how long it took them to complete tasks. KPIs would be set up based on those measurements.

This went as well as you would expect. People don't perform tasks the same way they normally do when an executive is standing behind them with a stopwatch. She quickly learned how worthless this was.

All that is a segue to the latest garbage KPI in software engineering, tokenmaxxing, and the AI policy I wrote for my team.

# WTF is Tokenmaxxing?
Tokenmaxxing is the latest fad to come out of management who still, in the Year of our Lord 2026, do not understand that every metric will be gamed. That executive with the stopwatch didn't understand 20+ years ago and there are clearly leaders today who have not received the memo.

The idea is that the company will encourage the adoption of AI tools by creating a leaderboard of who is using the most tokens. Much like any other naive metric , [engineers immediately game it](https://blog.pragmaticengineer.com/the-pulse-tokenmaxxing-as-a-weird-new-trend/). Just create a loop that wastes tokens and shoot to the top of the leaderboard. Or waste just enough to show that you're "using" AI, but not enough to explain your usage.

This is what passes for leadership apparently. Creating easily gamed metrics for your team that are quickly divorced from actually helping people. Because at the end of the day, that's what we're here for, right? You're here to help people, right? That's what I'm here for. I'm here to help our customers accomplish their goals. I'm not here to use a certain number of tokens. Tokenmaxxing is a vanity metric masquerading as leadership.

# Why an AI Policy?
I manage a team that is very skeptical of AI, and for good reason. I don't need to enumerate the ethical concerns here. There have been enough think pieces about that.

I also don't need to enumerate the productivity concerns. Depending on which way the wind blows and the position of Jupiter in the zodiac, your mileage will vary on how useful these tools are for you. You can find credible examples of anywhere from 0.1x -> 10x productivity depending on how you hold it.

But what I am confident of is that the current generation of LLMs is causing the biggest upheaval in software engineering in my almost twenty year career. And as the manager of a team, it's part of my job to have some position on that. So, after much discussion with the team, I quickly put together a guide describing our AI philosophy.

Since putting this together, I've been surprised by how many developers I've spoken with who have no such document at work. The mandate is simply to AI as hard as possible and hope it all works.

# TL;DR
- No AI mandate
- You must understand what your AI generated code does
- You must be able to do your job if your AI tooling disappears
- Care about your teammates and our customers

Let's go over these in more detail.

# When To Use AI Tools
> There is no mandate to use AI tools. You will not be reviewed based on how much you are using these tools.
> 
> That being said, these tools are the largest upheaval our industry has seen in decades. Even if you are not using them on a daily basis, you are well served to be aware of how they are evolving. This space is moving so fast that your experience from six months ago is likely no longer relevant. A side effect of this large turnover in skills is that any expertise you didn't gain six months ago is probably irrelevant today.
> 
> Senior+ engineers are encouraged to use these tools in whatever way works best for them. That could be as an integral part of your daily workflow or just an occasional tool for proof of concepts for non-production code.

There is an inherent contradiction in AI boosters.

1. If you don't get on the AI train now, you're going to be left behind.
2. AI is moving so fast that everything you know today will be worthless in six months.

It cannot be true that I have to be an AI maximalist at this very moment and also that everything I know today will be worthless in six months. [Why can't I just wait](https://www.ufried.com/blog/not_left_behind/) until six months from now and use the better models and techniques? I won't have to unlearn techniques that only exist to work around the immaturity of current tooling then. (I'm looking at you Ralph Loops.)

We hire smart people and we trust them to do the job. I don't care what OS they use. I don't care what editor they use. I don't care what LSP they use. And I don't care what AI tooling they use. I don't care if they're dipping their toe in for a prototype or if they're running a full-blown Gas Town. I care that they're delivering for our customers.

But as the policy says, the upheaval is real. You do have a professional duty to try these tools on occasion. The tooling I tried in June 2025 is much worse than the tooling I came back to in January 2026. I expect the tooling I'm using in June 2026 to be even better.

# It's Still Your Code
> Any code generated by AI tools is your code. It does not matter how much of your PR that AI wrote for you, you are expected to understand what the code does. It is expected that the code fits into our existing patterns. Our AGENTS.md file should help with this, but does not guarantee anything. You are responsible for making sure the code you submit for review is up to snuff.
> 
> Do not put undue burden on reviewers. We all submit questionable PRs at times. This could be because of time constraints around a incident level production bug or because we're in new design space. It is still the responsibility of the PR submitter to call this out. Using AI tools is not an excuse to call out all of your PRs as questionable.
> 
> Humans ultimately make our architecture decisions, not AI. When there is a choice between accepting code that makes it easier for machines vs. code that is easier for humans, we prefer humans. If AI tooling is constantly spitting out code that does not conform to our coding standards, the AI tooling is what needs to change, possibly by improving our AGENTS.md file.

AI maximalists will read this section and scoff. They're already vibe coding everything and have little to no idea what the generated code looks like. If we were a greenfield startup, I might take this approach as well. We are not a greenfield startup. We have a ten year old codebase full of contradicting styles brought in by different teams. Sometimes it's full-blown [code archaeology](https://speakerdeck.com/arthurdoler/digging-into-the-matrix-practicing-code-archaeology) to figure out why something is the way it is.

The AI maximalist bet is that models will improve at a rate that exceeds the tech debt they are accruing. This is similar to the bet that startups have made for years. It doesn't matter how bad the initial code is. The focus is on finding product-market fit and worrying about sustainability later. We have product-market fit though. We care about being able to work on this codebase for the next decade. Our customers care that our current features keep working.

If you are AI maximalist, where is the bottleneck shifting too? Is it code review? Is it knowing what your customers even want? Is it the rate of change your customers can absorb? Being able to theoretically write 10x more code does not mean that you are providing 10x more value to your customers.

If Claude goes down tomorrow, can you still do your job? Can you understand the code in front of you? If OpenAI goes bankrupt next week, will you gaze upon the horrors in your codebase and weep?

I spent a decade as a consultant. I've parachuted into some truly atrocious codebases. Your LLM of choice not working that day should not cause you to tremble in fear as you try to triangulate usage of the five different versions of date formatting functions in the AI slop you have wrought upon yourself.

# But What About Junior Engineers?
> No matter what you may think your learning style is, we all learn by doing. In software, this means writing code. You must think through the implications and nuances of the code you're writing at multiple levels of understanding to truly learn. AI coding tools short-circuit this learning by depriving you of reps.
> 
> For this reason, junior engineers should use these tools judiciously. Relying on AI tooling to write code for you will limit your growth in the long-term. You will not gain the deeper level of understanding you need to progress your career and take on larger projects.
> 
> That does not mean these tools are forbidden to junior engineers. However, if your AI tools disappear tomorrow and you find yourself unable to contribute, that is a problem. 

This might be part of the policy that I feel strongest about. Our industry is quickly pulling up the ladder on junior engineers. We are taking away the kind of work that you need to learn. You need reps in the kind of toil that AI excels at automating away.

The current generation of AI has quickly exposed that most people have no clue how learning works. Learning styles are a myth. You may have a preference in how you consume information, but you learn by doing. [Learning happens in the struggle](https://ergosphere.blog/posts/the-machines-are-fine/). You must wrestle with a concept. You must be confused at times. It is not optional. If you rely on an LLM to write most of your code, code that you do not have reps writing yourself, you will not learn. You will not gain a deeper understanding.

How much you feel that junior engineers should use these tools is dependent on what you feel the role of junior on your team are and what your responsibility is to their careers. I do not expect junior engineers to be productive. I expect them to learn how to be productive. I expect them to make mistakes. I expect them to learn how to learn a codebase. I expect them to learn how to learn a domain. And if they're outsourcing most of that to an LLM, they're not going to learn how to think through it themselves.

AI in its current form is far too leaky an abstraction for these details to not constantly bubble up in any codebase or domain of reasonable complexity. Until that changes, juniors must learn and learning happens by doing.

You should be able to articulate in some way the role of juniors on your team and your responsibility for their growth, if any. The role and goals you have for them may be different than mine. That should drive your philosophy on how much tooling they should use.

# We Care About People
> Ultimately, we deliver code to help our customers reach people. We care about our customers. At the same time, we work internally as team. We care about our teammates.
> 
> These two audiences are often in tension with each other. There can be pressure to deliver more features for our customers to help them reach people. This is fine in short bursts for good reasons. Too much can hurt our teammates as technical debt builds up.
> 
> This is relevant in our AI world. It can be tempting to ship as much AI-generated code as possible to make our customers happier. This cannot come at the expense of AI-slop in our codebase though. It hurts long-term productivity and happiness of the team. Engineers do not want to spend all day reviewing AI-slop PRs.

Tokenmaxxing is disconnected from caring about people. I care about people, not tokens. If using tokens helps you help people, then, by all means, use tokens. But tokens are not the end. Tokens are a means. My editor is a means. My programming language of choice is a means.

My team is a subset of the category of people. I care about people, therefore I care about my team too. And that means that forcing my team to use tools that actively piss them off on a daily basis is a Bad Thing.

I could be wrong on this. Maybe AI is going to be so good that we'll be buried by competitors. Or maybe it's so good that the current economic system collapses too. I don't know where any of this is going, but I do know that I care about people. AI is not people.

# Should This Apply To My Team?
Every team and company is different. This policy works for my team. It may or may not work for yours. We have an established ten year old code base that has gone through a lot of churn over the years. The regulatory environment we work in has gotten a lot more complicated over time. We have long-time customers who would not be happy if we started breaking things left-and-right in a rush to adopt AI tooling. You are probably not happy about tools you depend on doing that right now.

Your constraints are different, so your policy should probably also be different. I know if I was working in a greenfield startup with the same team, the constraints would be radically different, so the way we use AI would change accordingly.

But you should have some kind of coherent philosophy around what you're trying to accomplish. Tokenmaxxing is not coherent. It's just counting lines of code again, this time with the added privilege of paying a 3rd party thousands of dollars for your bullshit metric. If that's what qualifies for leadership, perhaps we can replace you with an AI agent next? You owe it to your team (and yourself) to be better than that.
