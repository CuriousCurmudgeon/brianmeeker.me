---
title: "Porting From WordPress to Astro"
description: "Thoughts from porting my site form WordPress to Astro"
date: "2022-11-06"
heroImage: "/assets/2022-11-06_porting-from-wordpress-to-astro/astro_logo_light.svg"
heroImageAlt: "The logo for the Astro project"
tags: 
  - "astro"
  - "tailwind"
---
tl;dr: I was frustrated with the lack of customization available to me on the Personal plan through wordpress.com. I decided to port my site to [Astro](https://astro.build/) to get experience with static site generation. The Astro ecosystem was straight forward to work with and deploying to Netlify was very easy. Code is available on [GitHub](https://github.com/CuriousCurmudgeon/brianmeeker.me).

# Switching From WordPress
I've been hosting my personal site on WordPress since 2010. I think. I don't remember for sure and 2010 is the best I can piece together from my email history. But during all of that time I never learned how to customize WordPress in a meaningful way. I had no desire to learn PHP. I never wrote a plugin. I never customized a theme. I just used what I needed off-the-shelf.

And that was great for a long time, but recently the annoyances with my WordPress theme started to build. I didn't like how narrow the content window was, but there was no way to customize it with my Personal plan on WordPress.com. I hosted my site through Bluehost for years, which gave me more control over my WordPress installation, but had traded in managing that for WordPress.com. That was a great tradeoff when I didn't want to customize anything, but was coming back to bit me now. It was time to look at something else.

# Enter Astro
Astro advertises itself as an all-in-one web framework for building fast, content-focused websites. For me, the appeal is that it is a static site generator that has no Javascript runtime overhead by default. You can opt in to common frameworks like React, Vue, or Svelte, but are not required to. I like having the option to include one later where it makes sense. There have been various posts throughout the years where I would have liked to include some custom piece of interactivity, but couldn't easily do within the constraints of my plan on WordPress.com.

# Exporting From WordPress
Note that the export required a decent amount of manual intervention for each post. Luckily, I don't have that many posts.

# Improved Performance
![Lighthouse scores for new site showing 97 for performance, 100 for accessibility, 92 for best practices, and 100 for SEO](/assets/2022-11-06_porting-from-wordpress-to-astro/lighthouse_score.png)

I unfortunately don't have a Lighthouse score for my old WordPress site, but I'm confident that the numbers I'm seeing with the Astro version are superior. There are more improvements that could be made though. These include
- Pagination on the front page. Performance is still good enough for now, pagination would help long term. This will become more obvious as more posts include hero images.
- Improved image sizing. There are Astro integrations to improve image sizing. This is something I lost from WordPress that I want back.

# Going Forward
Beyond the todo list of improvements to this site, I'm happy to have Astro in my toolbox for content focused sites. I won't hesitate to use it again if the right content-focused use case pops up.
