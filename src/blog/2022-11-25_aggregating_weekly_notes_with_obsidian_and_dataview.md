---
title: "Aggregating Weekly Notes With Obsidian and Dataview"
description: "I like to end my work week with a weekly summary of what I worked, accomplishments, and other thoughts. This is how I pull that together with Obsidian and Dataview."
date: "2022-11-25"
tags:
  - "obsidian"
  - "dataview"
---

I've done two very smart things with my personal note taking over the past six months.
- Switch from Evernote to Obsidian
- Make a clean start with a new Obsidian vault for my new job

It's hard to overstate how freeing it's been to first switch to Obsidian, but then to also create a brand new empty vault without the baggage of over a decade of notes. This has helped me to be more proactive in structuring my metadata (frontmatter in Obsidian terms) more intelligently and using that to automate parts of my note taking.

# Enter Dataview
When I was looking to switch from Evernote to Obsidian, [Dataview](https://blacksmithgu.github.io/obsidian-dataview/) was one of the features that sealed the deal for me. The ability to query and automate parts of my note taking was irresistible. But how was I going to actually put that into practice?

Five weeks ago I started a new job at [Online Rewards](https://online-rewards.com/). I took this as an opportunity for a clean start in Obsidian. After a couple of weeks of daily and task notes, I started to figure out the basics of how I wanted my Obsidian frontmatter to work so I could pull together weekly summaries. This has then fed into improvements in how I track frontmatter so I can more easily query through Dataview. Virtuous cycles FTW!

# Weekly Summaries
This is my current weekly summary note in Obsidian

````
---
date: {{date:YYYY-MM-DD}}
tag: weekly_summary
---

# Daily Notes
```dataviewjs
let currentWeekNumber = dv.current().date.weekNumber;
dv.list(dv
	.pages("#daily_note")
	.where(n => n.date.weekNumber == currentWeekNumber)
	.sort(n => n.date)
	.file.link)
```

# Meetings
```dataviewjs
let currentWeekNumber = dv.current().date.weekNumber;
dv.list(dv
	.pages("#meeting")
	.where(n => n.date.weekNumber == currentWeekNumber)
	.sort(n => n.date)
	.file.link)
```

# Issues
```dataviewjs
let currentWeekNumber = dv.current().date.weekNumber;
dv.table(["Link", "Start Date", "Finish Date"], dv
	.pages("#issue")
	.where(n => currentWeekNumber >= n.start_date.weekNumber)
	.where(n => !n.finish_date || currentWeekNumber <= n.finish_date.weekNumber)
	.sort(n => [n.start_date, n.finish_date])
	.map(n => [n.file.link, n.start_date, n.finish_date]))
```

# Guides
```dataviewjs
let currentWeekNumber = dv.current().date.weekNumber;
dv.list(dv
	.pages("#guide")
	.where(n => n.date.weekNumber == currentWeekNumber)
	.sort(n => n.date)
	.file.link)
```
````

Let's walk through what each part does and the frontmatter it relies on.

# Daily Notes
Every day I create a daily note to pull together everything I worked on that day. The template includes the following frontmatter

```
---
date: {{date:YYYY-MM-DD}}
tag: daily_note
---
```

This inserts the current day for the date in using the given format. Then I query all daily notes for the week using

```
let currentWeekNumber = dv.current().date.weekNumber;
dv.list(dv
	.pages("#daily_note")
	.where(n => n.date.weekNumber == currentWeekNumber)
	.sort(n => n.date)
	.file.link)
```

Dataview uses [Luxon](https://moment.github.io/luxon/#/) for dates. [dv.current()](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#dvcurrent) pulls in data about the current page, the instance of the weekly summary note in this case. `pages("#daily_note")` pulls in all notes with that tag and [`weekNumber`](https://moment.github.io/luxon/api-docs/index.html#datetimeweeknumber) filters to just the notes with a `date` of this week in their frontmatter. This gives a list of all daily notes I created this week.

# Meeting Notes
I have some daily meetings that I attend and ad-hoc meetings too. These all get the `#meetings` tag in their frontmatter, which lets me execute an almost identical query to daily notes. The only difference is that I look for the `#meetings` tag instead of `#daily_note`

```
dv.list(dv
	.pages("#meeting")
	.where(n => n.date.weekNumber == currentWeekNumber)
	.sort(n => n.date)
	.file.link)
```

# Issue Notes
We use Jira for issue tracking and I take notes on each issue I work on. This query is slightly more complicated. I format them as a [table](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#dvtableheaders-elements) instead of a [list](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#dvlistelements). This means I need to define the column for the table.

Also, the frontmatter is slightly different. I want to track Jira items that I'm working on that haven't been fully completed and deployed yet. I use both `start_date` and `finish-date` in my frontmatter to account for this and look for items that are not finished or finished this week.

```
---
start_date: {{date:YYYY-MM-DD}}
finish_date: 
tag: issue
jira: 
pr: 
---
```

```
let currentWeekNumber = dv.current().date.weekNumber;
dv.table(["Link", "Start Date", "Finish Date"], dv
	.pages("#issue")
	.where(n => currentWeekNumber >= n.start_date.weekNumber)
	.where(n => !n.finish_date || currentWeekNumber <= n.finish_date.weekNumber)
	.sort(n => [n.start_date, n.finish_date])
	.map(n => [n.file.link, n.start_date, n.finish_date]))
```

# Guides
Finally, I pull out guides to various tasks from my other notes. Many of these will eventually end up available to the rest of the company through our internal wiki or other mechanisms, but it's easier to pull them out in Obsidian to start and then figure out where they should live later. Once again, this is the same query as `#daily_note` or `#meetings`, only using the `#guide` tag. A nice improvement would be to pull out the guides that I improved this week instead of just the ones I started. That's a problem for the future though.

```
let currentWeekNumber = dv.current().date.weekNumber;
dv.list(dv
	.pages("#guide")
	.where(n => n.date.weekNumber == currentWeekNumber)
	.sort(n => n.date)
	.file.link)
```

# Summary
This is a really nice validation of my initial excitement for Dataview. It took creating an entirely new Obsidian vault to pull back and see how I could structure my metadata to easily pull this data together. I had been hesitant to do so when I ported from Evernote because it was nice to see over a decade's worth of notes in one place. Sometimes it's nice to start fresh though to rid yourself of preconceived notions of how your notes need to be organized.