---
title: "Combining the Default Policy in ASP.NET Core"
description: "ASP.NET Core's policy-based authorization allows you to combine policies. Using this in combination with the default policy can reduce duplication."
date: "2022-04-27"
heroImage: "/assets/2022-04-28-combining-the-default-policy-in-asp-net-core/fix_all_the_things.jpg"
heroImageAlt: "A version of the 'all the things' meme that says 'fix all the things'"
tags: 
  - "c-sharp"
  - "asp-net-core"
---

Over the course of my career it seems that every ASP.NET (Core or otherwise) project I've inherited ignores the [built-in policy-based authorization](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-6.0) support. The codebase I inherited at Husmus is no exception. But this time I have the power to fix it!

Policy-based authorization allows you to [define a default policy](https://andrewlock.net/setting-global-authorization-policies-using-the-defaultpolicy-and-the-fallbackpolicy-in-aspnet-core-3/#changing-the-defaultpolicy-for-an-application). This policy will be applied to any endpoint that has the `[Authorize]` attribute, but no explicit policy.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...

    services.AddAuthorization(options =>
    {
        options.DefaultPolicy = new AuthorizationPolicyBuilder()
            .RequireClaim("AccountActivated")
            .Build();
    });

    ...
}
```

For example, the default policy will be applied to `Index`, but not to `New`.

```csharp
// Uses the default policy
[Authorize]
public IActionResult Index()
{
    return Ok();
}

// Only users who satisfy this policy
// are authorized. The default policy
// is not applied.
[Authorize("CanCreateWidget")]
public IActionResult New()
{
    return Ok();
}
```

That's not what we want here though. We want `CanCreateWidget` and the default policy to both be applied. We want to build on top of the default policy so that the user is required to have activated their account and be able to create a widget. One ugly way around this is to add multiple `[Authorize]` attributes. The framework will treat these as a logical `AND`, requiring each one to be satisfied.

```csharp
// The user must satisfy both the default policy
// and CanCreateWidget
[Authorize]
[Authorize("CanCreateWidget")]
public IActionResult New()
{
    return Ok();
}
```

This duplication will quickly get out of control though. Every time we want the default policy to be applied in addition to another policy, we'll need to add multiple `[Authorize]` attributes to the controller and/or action. A better alternative is using [AuthorizationPolicyBuilder.Combine](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.authorizationpolicybuilder.combine?view=aspnetcore-6.0). `Combine` lets us combine one policy into another. We can use that to combine our default policy into the `CanCreateWidget` policy. Now, any changes we make to our default policy will always be applied to `CanCreateWidget` without duplication.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...

    services.AddAuthorization(options =>
    {
        options.DefaultPolicy = new AuthorizationPolicyBuilder()
            .RequireClaim("AccountActivated")
            .Build();

        options.AddPolicy("CanCreateWidget", policyBuilder =>
        {
            policyBuilder
                .Combine(options.DefaultPolicy)
                ... setup your policy
                .Build();
        });
    });

    ...
}
```

I'm pretty happy with how this works now. Our default policy at Husmus is moderately complicated and we almost always want it applied when adding a more specific policy. `Combine` allows us to do that and still keep our policy configuration centralized in one location.
