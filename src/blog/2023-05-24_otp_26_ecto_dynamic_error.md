---
title: "Ecto dynamic/0 Compile Error"
description: "Upgrading to OTP 26 without also upgrading Ecto to >= 3.9.5 causes compilation errors"
date: "2023-05-24"
tags:
  - "elixir"
  - "ecto"
---

tl;dr; OTP 26 has a breaking change against versions of Ecto before [3.9.5](https://github.com/elixir-ecto/ecto/blob/master/CHANGELOG.md#v395-2023-03-22). Upgrade to 3.9.5 or higher if using OTP 26.

---

Imagine my surprise today when our CI process ran for the first time and I got the following build error.

```
== Compilation error in file lib/ecto/query.ex ==
** (CompileError) lib/ecto/query.ex:430: type dynamic/0 is a built-in type and it cannot be redefined
    (elixir 1.14.5) lib/kernel/typespec.ex:936: Kernel.Typespec.compile_error/2
    (stdlib 5.0) lists.erl:1599: :lists.foldl_1/3
    (elixir 1.14.5) lib/kernel/typespec.ex:226: Kernel.Typespec.translate_typespecs_for_module/2
could not compile dependency :ecto, "mix compile" failed. Errors may have been logged above. You can recompile this dependency with "mix deps.compile ecto", update it with "mix deps.update ecto" or clean it with "mix deps.clean ecto"
```

I hadn't changed anything related to Ecto in my PR. As a sanity check, I ran the CI process on another open PR that had succeeded yesterday and hadn't been updated at all. It failed with the same error. Something weird was going on.

I next realized that our mix dependencies hadn't changed, so it was unclear why these were even being compiled instead of pulled from the cache. I was baffled so searched for the error message in the Elixir Slack and quickly found an answer. But there was no explanation to go with that answer. For posterity, here are the details about why this error happens.

Our builds were using the `elixir:1.14-alpine` Docker image. This was [updated to Elixir 1.14.5 on May 23](https://github.com/erlef/docker-elixir/commit/b8a45e284e0032a25e993ff60a8c6ea733848ad1). The change also updated Erlang to use OTP 26. The [release notes](https://github.com/erlang/otp/releases/tag/OTP-26.0) highlight a change to help Dialyzer.

> Added the new built-in type dynamic() introduced in [EEP 61](https://www.erlang.org/eeps/eep-0061), [PR introducing EEP 61](https://github.com/erlang/eep/pull/44) improving support for gradual type checkers.

When the build ran today, it pulled in the new Docker image for 1.14.5 and OTP 26. Before Ecto 3.9.5, they defined their own `dynamic/0` type. The [release notes for 3.9.5](https://github.com/elixir-ecto/ecto/blob/master/CHANGELOG.md#v395-2023-03-22) read

> [Ecto.Query] Rename @opaque dynamic type to @opaque dynamic_expr to avoid conflicts with Erlang/OTP 26

I didn't want to blindly upgrade Ecto and OTP, so I decided to switch to the `elixir:1.14-otp-25-alpine` image. I'm fine with automatically getting patch versions, but I don't want OTP upgraded without warning. I should have been using the image to begin with, but it was an oversight.