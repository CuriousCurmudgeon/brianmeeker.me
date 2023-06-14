---
title: "Introducing LivePet for THAT Conference 2023"
description: "Upgrading to OTP 26 without also upgrading Ecto to >= 3.9.5 causes compilation errors"
date: "2023-06-13"
tags:
  - "elixir"
  - "live_view"
  - "otp"
---

In late July I'll be giving a new talk at THAT Conference called [It's a Live(View): Discover the Elixir of Life With a Virtual Pet](https://that.us/activities/2P8aHDB0t3hnZBOiTVkw). As part of that, I've been working on a demo app called [LivePet](https://github.com/CuriousCurmudgeon/live_pet), which you can try now at https://that-pet.fly.dev. It's extremely bare boned, but it works.

# What is LivePet?
LivePet is a demo app to show off aspects of [Elixir](https://elixir-lang.org/), OTP, and [LiveView](https://www.phoenixframework.org/) to go along with my talk. Each virtual pet is simulated with a GenServer process that a live view process communicates with to get and modify state. Currently, pets only get older and hungrier. Users can click a button to feed them, but no matter what their pet will eventually die.

Most of the work up until now has been in leveling up my OTP skills to simulate 100K+ pets at once. That was an arbitrary goal that I set for myself as a cool way to demonstrate the power of the BEAM. This past weekend, I was able to get an alpha version of it running 120K pets. It's nothing you would ever want to throw into production, but it works to illustrate the power of Elixir.

![Screenshot of a Phoenix LiveDashboard showing 120K processes running and using over 3GB of memory to do so.](/assets/2023-06-13_introducing-live-pet-for-that-conference-2023/120_000_pets.png)

# Current Architecture
On startup, the app starts a supervisor that will start up every pet and a [`Registry`](https://hexdocs.pm/elixir/1.14/Registry.html) for what processes are currently viewing a pet. Pets run under a [`PartitionSupervisor`](https://hexdocs.pm/elixir/1.14/PartitionSupervisor.html) that starts up [`DynamicSupervisors`](https://hexdocs.pm/elixir/1.14/DynamicSupervisor.html). `DynamicSupervisors` cannot be given a list of children on startup, so a separate task is started to start all the pet processes.

A lot of this is very naive and not optimized. The goal is to show off some of the power of Elixir, but leave it simple enough for an intro conference talk. For example, it shows how to create a `PartitionSupervisor`, but doesn't really take advantage of it. Starting every pet is still done in a single process. This becomes a bottleneck when simulating large numbers of pets. Starting 120K pets took over a half hour. I may end up just using a single `DynamicSupervisor` depending on how prep goes.

Each pet's state updates every five seconds. Persistence is handled by a separate process that persists every pet to the DB every minute. Moving the persistence out of the each pet process is a naive strategy to limit the number of DB connections. Allowing each pet to persist every X ticks can lead to DB connections being a bottleneck.

There are an enormous number of improvements that could be made to this setup. I may tackle some of those if I have time before the conference.

# Presentation Prep
I speak on July 25, which is six weeks from today. I'll be switching gears for now to prepping my slides and speaker notes. The rough outline is to spend the first half introducing the audience to Elixir and OTP. The second half will show LiveView through two lenses.

First, you don't have to write any JavaScript to create a slick, modern SPA. I don't mind writing JavaScript in the browser, but I feel there are many better options on the back end. LiveView lets me avoid context switching between languages.

Second, I want to show off how LiveView builds on top of all the OTP stuff from the first half of the talk. You're still just handling messages sent to GenServers. That ends up leading to HTML fragments sent over a web socket, but the lessons learned in setting up the architecture for pet simulation largely carry over to LiveView, just in a different context.

# Back to Public Speaking
I was just getting started with public speaking right before the pandemic started. I spoke for the first time at CodeMash 2020. I tried speaking virtually once, but did not enjoy the process at all.

In January, I gave a [lightning talk on Obsidian](https://brianmeeker.me/2023/04/03/obsidian-dataview-lightning-talk/) at CodeMash. That was a nice reminder of how much I enjoy getting up on stage and giving a presentation. I'm excited to be back speaking in person and look forward to seeing people at [THAT Conference 2023 in Wisconsin](https://that.us/events/wi/2023/)!