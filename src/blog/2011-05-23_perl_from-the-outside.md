---
title: "Perl From The Outside"
description: "Reflections on Perl and the Perl community after six months as a full-time Perl dev."
date: "2011-05-23"
tags: 
  - "c-sharp"
  - "perl"
---

I've been a Perl developer for almost 6 months now, so I thought it would be good to step back and document what the community looks like to an outsider. Before moving to Perl I worked professionally with C# as my primary language for 3+ years, so I have a bit of a different background compared to the average Perl monger. I also have varying amounts of experience with JavaScript, Python, Scala, Ruby, Java, and C/C++. Keep that in mind. You're journey to Perl has probably been different then mine. Also keep in mind that this is what the community looks like to an outsider, not what it actually is.

# People Still Write Web Sites in Perl?

If you're heavily invested in Perl and the surrounding community, I probably already angered you with that statement. Unfortunately, that is the prevailing view of amongst my developer friends. Most of them use C# as their primary language on the job, but have also used VB6, Java, C++, JavaScript, Python, and PHP (and probably more I don't know about) at some point in their professional career. It was also the first thought I had when I saw a job posting for a Perl web developer. I had been looking for two months and that was the first one I could remember coming across. I didn't match the requirements, but it was local and I knew I could learn a language quickly. I didn't know any C# before my first job. Why not go into my second not knowing any Perl?

One rebuttal to the "nobody writes web sites in Perl" argument among Perl mongers is that pigeon holing the use of the language to only how prevalent they are in web programming is unfair. I sympathize with them, but that doesn't change the fact that the perception of a language among young developers is almost entirely driven by its adoption (and the visiblity of that adoption) on the web. Currently, when a fresh graduate enters the workforce most job postings are very web-centric. The hobby projects most students have usually involve games or web programming, two areas where Perl has struggled to gain traction.

# The Learning Process

Back to my learning process, I got an interview and afterwards drove straight to the library to pick up Programming Perl (the camel book). I didn't know anything about Perl, but I knew the camel book was the de facto guide. Unfortunately, the camel book hasn't been updated since 2000, but outside the Perl community it is really the only book anybody is familiar with. Combined with the lack of new Perl books in general and their absence from bookstore shelves, this is a big contributor to Perl appearing dead to an outsider. I have heard rumors that an update is on the way, but I couldn't find any confirmation on O'Reilly's website.

So, beyond the camel book, what other resources does a newbie come across? Coming from C#, StackOverflow had become my standard reference for any .NET question. The site is written in .NET and the team behind it is well known in the .NET community. Unfortunately, the Perl community hasn't been as enthusiastic in its embrace of StackOverflow. There are several good reasons for this, most having to do with the community already having established mailing lists and the prior existence of PerlMonks. For the outside developer though who already uses StackOverflow as a standard reference for a multitude of languages and tools, the dearth of Perl questions gives the impression of little use. A quick glance at the [StackOverflow tags page](http://stackoverflow.com/tags) lets us see that there are ~17x more questions tagged with C# then Perl. Is C# usage really 17x greater than Perl? Probably not, but the initial perception it gives is not good.

# The Pain of TIMTOWTDI

Perl has embraced the motto "there's more than way to do it" since it's beginnings and in many ways the philosophy has served it well. The language itself is very extensible and that extensibility has encouraged many developers to have the hubris to think "I can do X better". This philosophy has given us diversity in things like OO frameworks, where you are free to choose from several excellent choices depending on your needs. However, it also creates a sense of chaos and the lack of any sort of ranking system on CPAN makes it difficult to know which modules to actually use. The worst example I have seen with this is error handling.

Perl predates the widespread adoption of exceptions as the de facto way to handle errors and many developers have stepped forward with modules to fill this void. The problem for the Perl newbie is that there is no easy way to determine which one to use. The fact that such a fundamental, and in other languages simple, question is complicated by so many choices is overwhelming when learning the language. A newbie is confronted with at least the following choices:

- [Error](http://search.cpan.org/~shlomif/Error-0.17016/lib/Error.pm)
- [Exception::Class](http://search.cpan.org/~drolsky/Exception-Class-1.32/lib/Exception/Class.pm)
- [Error::Exception](http://search.cpan.org/~srvance/Error-Exception-1.1/lib/Error/Exception.pm)
- [Try::Tiny](http://search.cpan.org/~doy/Try-Tiny-0.09/lib/Try/Tiny.pm)
- [TryCatch](http://search.cpan.org/~ash/TryCatch-1.003000/lib/TryCatch.pm)

There is no easy way for someone just learning Perl to choose between them. The first result from Google for the search ["perl error handling"](http://www.google.com/search?sourceid=chrome&client=ubuntu&channel=cs&ie=UTF-8&q=perl+error+handling) is an [article](http://www.perl.com/pub/2002/11/14/exception.html) from 2002 for the now deprecated Error module. It's a shame that such a concept that is so easy to pick up in other languages can be so frustrating to a new Perl monger. I ended up just using the built-in handling, which felt (and continues to feel) clunky compared to the ease of exception management I was used to.

# They Can't Even Ship a New Version!

At some early point in my learning process I started hearing about Perl 6, a subject that seems to cause confusion even within the Perl community. Unsurprisingly, this confusion is magnified for newbies. I now know that Perl 6 is to be treated as an entirely separate language, but outsiders do not know this. To them the decade long (and still going) process to create a production quality implementation seems like a joke. When an outsider sees the names "Perl 5" and "Perl 6", the completly natural assumption is that "Perl 6" is the next version of Perl. And the natural conclusion after seeing that Perl 6 was announced over a decade ago and has very little adoption, is that Perl is a dead language. I have read that Larry has spoken the final word on this issue, but that doesn't mean it was the correct word. It just means the issue has been closed for debate. The name Perl 6 will continue to hurt the perception of the community from the outside.

# Beating the Java Strawman

Most developer communities have a favorite whipping boy. Perl (like many) has chosen Java, but seems to have thrown the baby out with the bath water by vilifying everything associated with Java as well. Now, I'm not here to defend Java. The language has serious warts (crippled generics anybody?) and the late 90's "enterprise" framework rush crippled the Java community in ways it is still struggling to break away from. But I found the wholesale rejection of everything associated with Java distasteful in many ways. First, it felt childish, but more importantly it has left the community behind the curve in many ways, most notably in object oriented architecture and standard design patterns. As a developer with a strong background in these areas this was a bit of shock. My fears were at least partially eased when I discovered Moose, but overall the Perl community comes off as too cavalier in its dismissal of these ideas.

On a related note, yes, I know that many important OO design principles did not originate in the Java community, but it's status as the dominant enterprise language at the time the internet took off put it in a unique position to be a test bed for many design ideas on large projects as businesses rushed to retool their infrastructure. Consequently, most influential architecture and design books released in that time period generally assume Java.

# Shaking Things Up

At this point, outside developers have little interest in learning Perl. Any exciting new developments tend not to break out of the Perl echo chamber. For example, the fact that Perl now has several nice [OO](http://www.iinteractive.com/moose/) [framework](http://search.cpan.org/~gfuji/Mouse-0.93/lib/Mouse.pm) [implementations](http://search.cpan.org/~gfuji/Mouse-0.93/lib/Mouse.pm) is nice, but doesn't attract any new Perl developers (although it does seem to have brought some old Perl developers back into the fold).

Looking in from the outside, I see two possibilities for attracting widespread interest in Perl again. One is widespread adoption of Perl 6. It doesn't really matter if anything is gained technically from this. As I stated above it would remove the specter of decay that surrounds the community. The buzz from some notable adoption of Perl 6 could be the push some developers need to take a look at Perl. In a similar fashion, for the lack of a better comparison, Perl needs it's killer app/framework. The best example of this in the past decade has been Ruby on Rails. Ruby is a very nice language, but Rails gave it the momentum it needed. I, and many others, would never have given it a chance without Rails. I have no idea what this project would be for Perl, but it wouldn't hurt to take chromatic's [recent advice](http://www.modernperlbooks.com/mt/2011/05/show-it-off.html) and brag about interesting Perl projects.

# Conclusion

Overall, my journey to Perl has been worthwhile. I had been concerned about being typecast as a .NET programmer and getting stuck in Microsoft-land for my entire career. Being able to program in multiple paradigms (static vs. dynamic in this case) has certainly made me a better programmer and expanded how I approach certain problems. Plus, it confirmed to me that I can learn and become productive in a new language in a very short period.

However, the problems with the perception of the Perl community aren't going away and at this point it is probably too much to hope that they ever will. The community itself is too fragmented and pulled in too many different directions to expand it's core niche as a text processing language. Perl certainly isn't dead and does seem to be gaining some momentum internally, but none of this has reached the outside world. Until it does the community will not grow in any significant way
