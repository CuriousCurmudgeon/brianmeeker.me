---
title: "Redirects in ASP.NET Core With Both HTML and JSON Endpoints"
description: "This past week I ran into the problem of retrofitting an endpoint that returns JSON into an app that up until now has returned HTML from all endpoints. Luckily, ASP.NET Core makes it easy to customize the behavior."
date: "2021-08-28"
tags: 
  - "asp-net-core"
  - "c-sharp"
---

This past week I ran into the problem of retrofitting an endpoint that returns JSON into an app that up until now has returned HTML from all endpoints. It uses cookie authentication, so hitting any route requiring authentication while not logged in would redirect users to a login page, `/account/login` in this case. Similarly, hitting any route where you are not authorized would redirect users to `/account/forbidden`. We can see below that this is done by setting `LoginPath` and `AccessDeniedPath` on `CookieAuthenticationOptions`.

```csharp
public void ConfigureServices(IServiceCollection services) 
{
    ...
    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
            options =>
            {
                options.LoginPath = new PathString("/account/login/");
                options.AccessDeniedPath = new PathString("/account/forbidden/");
            });
    ...
}
```

The problem with this behavior when you start mixing in JSON endpoints is that you still get redirects. The endpoint I was adding requires authentication, so unauthenticated requests were still going through the redirect. Instead of getting back a JSON response with a 401 status code, I was getting redirected to the login page and getting HTML back.

After a brief moment of panic, I figured there had to be a way to solve this. I [quickly stumbled across](https://forums.asp.net/post/6202282.aspx) `CookieAuthenticationEvents`. These let us define functions to handle the same cases we were statically defining above.

```csharp
public void ConfigureServices(IServiceCollection services) 
{
    ...
    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme) 
        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, 
            options => 
            { 
                options.Events = new CookieAuthenticationEvents 
                { 
                    OnRedirectToLogin = SetupRedirect("/account/login/"), 
                    OnRedirectToAccessDenied = SetupRedirect("/account/forbidden/") 
                }; 
            });
    ...
}

Func<RedirectContext<CookieAuthenticationOptions>, Task> SetupRedirect(string redirectPath) 
{ 
    // All requests to /api are JSON API calls and should just return a 401. 
    // All other requests are assumed to use views and the user should 
    // be redirected appropriately. 
    return redirectContext => 
    { 
        if (redirectContext.Request.Path.StartsWithSegments("/api")) 
        { 
            redirectContext.HttpContext.Response.StatusCode = 401; 
        } 
        else 
        { 
            redirectContext.Response.Redirect(redirectPath); 
        } 
        return Task.CompletedTask; 
    }; 
}
```

Here we can see that we are controlling the behavior based on a convention now. All requests to a route beginning with `/api` will just return a 401. Requests to any other route will continue to use the same redirect behavior as before.

This was a nice reminder that ASP.NET Core is extremely pluggable. No matter what problem you're having, there is probably an API you can plug into to solve it.
