---
title: "Switching From Evernote To Obsidian With Yarle"
description: "How I exported 5,408 notes from Evernote and converted them into Markdown for Obsidian"
date: "2022-08-09"
heroImage: "/assets/2022-08-10_switching-from-evernote-to-obsidian-with-yarle/obsidian_logo.png"
heroImageAlt: "Logo for Obsidian"
tags: 
  - "evernote"
  - "obsidian"
---

I've been taking digital notes for a very long time.

In 2009 I started using [TiddlyWiki](https://tiddlywiki.com/). I really liked the idea of a self-contained personal wiki. And for three years it worked really well. I consistently took both personal and work notes in a unified system. Combined with Dropbox to sync changes, I was able to have access to my second brain anytime I was near my computer.

Times change though, and in 2012 I switched from TiddlyWiki to Evernote. More accurately, computing had changed. TiddlyWiki did not handle the transition to a mobile-first world well. I had already suffered through a decent amount of pain as browser security tightened up. Browsers were tightening down the ability to modify local files. There were some hosting options, but the appeal had always been its simplicity. Just a personal wiki in single HTML file. The combined pain from browser security and the new mobile world was too much.

For many years Evernote was great. I used it more and more, eventually settling into consistent note taking habits for my day-to-day work. Over time I developed good personal journaling habits as well. It's very satisfying (and often helpful) to be able to reach back into my thoughts from three, six, or twelve months ago.

Unfortunately, in recent years Evernote has seriously stagnated. Instead of improving what I care about, notetaking, they shifted focus to adding things like calendar integration and tasks. I already have tools for those things. I don't need them in my notetaking app. I need to take notes.

And Evernote's shortcomings were increasingly showing up there. The biggest pain point for me was the inability to quickly link notes together. My eyes were opened when I started a new job that was using Notion. The ability to easily link items together was addicting. Unfortunately, Notion's import functionality from Evernote was (and still is as of writing) incredibly broken. Add in the fact that Notion doesn't work without an internet connection and it ceased to be feasible alternative to Evernote for me.

After repeated recommendations in [Virtual Coffee](https://virtualcoffee.io/), I gave in and took a look at [Obsidian](https://obsidian.md/). It was love at first sight. It was just local Markdown files that could be easily linked together. Simple editing with all the power I wanted to link my thoughts together.

Now I just needed to export 5,408 notes from Evernote to Markdown.

# Enter Yarle

It didn't take me long to stumble across [Yarle](https://github.com/akosbalasko/yarle) (Yet Another Rope Ladder From Evernote). After downloading the executable, I started experimenting.

First, I [exported a single notebook from Evernote](https://help.evernote.com/hc/en-us/articles/209005557-Export-notes-and-notebooks-as-ENEX-or-HTML) by right-clicking on it and selecting _Export notebook…_.

![Context menu in Evernote showing how to export a notebook](/assets/2022-08-10_switching-from-evernote-to-obsidian-with-yarle/evernote_export_screenshot.png)

I kept the defaults and exported as `.enex`. This exported the entire notebook in one file. Opening this file up in my text editor of choice, revealed that it was a very simple XML file. The content of each note is HTML that Yarle is going to convert to Markdown.

Next, I executed Yarle. In the first step I imported the `.enex` file I exported from Evernote. Multiple notebooks can be converted at once, but I wanted to keep it simple and experiment with just one to start.

And that's because the second step is where the complexity lies. Even after repeated testing of options I'm not sure what some of the do. The repo does explain what each one does, but deciphering exactly what some of them mean is an adventure. It doesn't help that the language used in the `config.json` format doesn't exactly match the language used in the Yarle GUI.

Step three offered a default template, but I found it too complicated for my needs. I simplified it to only include tags, created and modified dates, and the actual note content.

```
{tags-block}
---
tags: {tags}
---
{end-tags-block}
{content-block}{content}{end-content-block}

{created-at-block}    Created at: {created-at}{end-created-at-block}
{updated-at-block}    Updated at: {updated-at}{end-updated-at-block}
```

Finally, I chose to output directly into my existing Obsidian vault and started the conversion. Conversion was very fast unless there were a large number of images. Notes from [Evernote Web Clipper](https://evernote.com/features/webclipper) were significantly slower than anything else.

And then I repeated these steps over and over until landing on output that was reasonable for me. Your milage will vary here. You may be perfectly happy with the defaults or you may end up tweaking settings for hours.

# Conversion Issues

For purely text notes, conversion was seamless. Heavily formatted notes were hit and miss though depending on what Evernote features were being used.

I was making heavy use of Evernote's tables, specifically its ability to add background colors to cells. Markdown tables are very limited and I haven't found any existing plugins that add this. The tables converted fine, but without color coding, many of them don't serve the purpose they used to.

I also was an intermittent user of Evernote Web Clipper, especially for recipes. The conversion on those was very hit and miss. Some converted over fine, but others were a formatting disaster that I'm slowly cleaning up.

Good luck and may your second brain prove to be clever and insightful.

