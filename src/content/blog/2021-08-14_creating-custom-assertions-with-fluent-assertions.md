---
title: "Creating Custom Assertions With Fluent.Assertions"
description: "Exploring creating custom assertions with Fluent.Assertions for the first time."
date: "2021-08-14"
heroImage: "/assets/2021-08-14_creating-custom-assertions-with-fluent-assertions/fluent_assertions_large_horizontal_logo.png"
heroImageAlt: "Logo for the Fluent.Assertions library"
tags: 
  - "c-sharp"
---

I've been using [Fluent.Assertions](https://fluentassertions.com/) for years .NET, but until this week I had never looked into the community extensions. I started adding unit tests to a new controller I was creating in an existing ASP.NET Core MVC project, so I decided to take a look at [FluentAssertions.AspNetCore.Mvc](https://github.com/fluentassertions/fluentassertions.aspnetcore.mvc).

The primary use case I was unit testing was a controller that returned a `ViewResult`, but with two different status codes. On the happy path it would return a `200 OK`, but if the user did not have the correct role it would return an error page with `401 Unauthorized`. Unfortunately, there was no built-in assertion for the status code of a `ViewResult`.

Luckily, with extension methods we can easily add our own! I cloned the repo for `FluentAssertions.AspNetCore.Mvc` locally and took a look at how [ViewResultAssertions](https://github.com/fluentassertions/fluentassertions.aspnetcore.mvc/blob/master/src/FluentAssertions.AspNetCore.Mvc/ViewResultAssertions.cs) worked. For example, here's the `WithViewName` assertion. It tests that the name of the view to render matches the expected view name.

```csharp
public ViewResultAssertions WithViewName(
    string expectedViewName,
    string reason = "",
    params object[] reasonArgs)
{
    var actualViewName = ViewResultSubject.ViewName;

    Execute.Assertion
        .BecauseOf(reason, reasonArgs)
        .ForCondition(string.Equals(expectedViewName, actualViewName, StringComparison.OrdinalIgnoreCase))
        .WithDefaultIdentifier("ViewResult.ViewName")
        .FailWith(FailureMessages.CommonFailMessage, expectedViewName, actualViewName);
    return this;
}
```

Using that as an example, it was straightforward to write an extension method to test the status code on a `ViewResult`. The highlighted lines show how to get the actual status code and then compare it using the `FluentAssertions` execution API.

```csharp
public static ViewResultAssertions WithStatusCode(
    this ViewResultAssertions assertions,
    HttpStatusCode expectedStatusCode,
    string reason = "",
    params object[] reasonArgs)
{
    var viewResultSubject = (ViewResult)assertions.Subject;
    var actualStatusCode = (HttpStatusCode)viewResultSubject.StatusCode.Value;

    Execute.Assertion
        .BecauseOf(reason, reasonArgs)
        .ForCondition(expectedStatusCode == actualStatusCode)
        .WithDefaultIdentifier("ViewResult.StatusCode")
        .FailWith("Expected status code {0}, but found {1}", expectedStatusCode, actualStatusCode);
    return assertions;
}
```

Nothing about this assertion is specific to my project, so I should take the time to submit it as a PR. After writing this, I even found that other result types, like [JsonResultAssertion](https://github.com/fluentassertions/fluentassertions.aspnetcore.mvc/blob/master/src/FluentAssertions.AspNetCore.Mvc/JsonResultAssertions.cs#L90), have almost this exact implementation to check status codes.

The most exciting part to me though was seeing how nice the `FluentAssertions` execution API is. I'll definitely be keeping an eye open towards creating my own custom assertion extension methods for repeated test patterns as I continue writing tests.
