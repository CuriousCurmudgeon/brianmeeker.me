---
title: "Custom Model Binders in ASP.NET Core 6"
description: "This past week I was integrating with a third party service that passes back boolean values in the query string as Yes/No. The built-in ASP.NET Core 6 model binding can handle true/false or 1/0, but not Yes/No. Let's look at how to make our own custom model binder for this simple use case and how to unit test it."
date: "2022-02-13"
tags: 
  - "asp-net-core"
  - "c-sharp"
---

This past week I was integrating with a third party service that passes back boolean values in the query string as `Yes/No`. The built-in ASP.NET Core 6 model binding can handle `true/false` or `1/0`, but not `Yes/No`. Let's look at how to make our own custom model binder for this simple use case and how to unit test it.

# Implementing IModelBinder

The official documentation provides a good overview of [custom model binding](https://docs.microsoft.com/en-us/aspnet/core/mvc/advanced/custom-model-binding?view=aspnetcore-6.0). In this case, I implemented `IModelBinder` as follows

```csharp
/// <summary>
/// Binds "Yes" or "No" (ignoring case), to true and false respectively.
/// Does not bind anything on other values.
/// </summary>
public class YesNoBooleanModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if (bindingContext == null)
        {
            throw new ArgumentNullException(nameof(bindingContext));
        }

        var modelName = bindingContext.ModelName;

        var valueProviderResult = bindingContext.ValueProvider.GetValue(modelName);

        if (valueProviderResult == ValueProviderResult.None)
        {
            return Task.CompletedTask;
        }

        var value = valueProviderResult.FirstValue;
        if (string.Equals(value, "Yes", StringComparison.InvariantCultureIgnoreCase))
        {
            bindingContext.Result = ModelBindingResult.Success(true);
        }
        if (string.Equals(value, "No", StringComparison.InvariantCultureIgnoreCase))
        {
            bindingContext.Result = ModelBindingResult.Success(false);
        }

        return Task.CompletedTask;
    }
}
```

Even though my current use case is just for query strings, implementations of `IModelBinder` aren't specific to where the data is coming from. The data is gathered from a [variety of sources](https://docs.microsoft.com/en-us/aspnet/core/mvc/models/model-binding?view=aspnetcore-6.0#sources). By the time the custom `IModelBinder` executes, the data has already been gathered and added to the `ModelBindingContext`, along with the name being bound to.

# How It Works

```csharp
var modelName = bindingContext.ModelName;
var valueProviderResult = bindingContext.ValueProvider.GetValue(modelName);

if (valueProviderResult == ValueProviderResult.None)
{
    return Task.CompletedTask;
}
```

First, I pull the data out of the `bindingContext` by name and confirm that a match was found. If not, don't set any result on the `bindingContext` and just return `Task.CompletedTask`.

```csharp
var value = valueProviderResult.FirstValue;
if (string.Equals(value, "Yes", StringComparison.InvariantCultureIgnoreCase))
{
    bindingContext.Result = ModelBindingResult.Success(true);
}
else if (string.Equals(value, "No", StringComparison.InvariantCultureIgnoreCase))
{
    bindingContext.Result = ModelBindingResult.Success(false);
}

return Task.CompletedTask;
```

Next, pull out the first value in the result. Binding works with [collections](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/model-binding?view=aspnetcore-6.0#collections-1), but in this case there should only be a single value. Then make case-insensitive comparisons against the bound value looking for `Yes/No` and only set a result for `Yes/No` values. Anything else will not bind at all.

# Usage

If your use case is better handled without an attribute, then you can [implement `IModelBinderProvider`](https://learn.microsoft.com/en-us/aspnet/core/mvc/advanced/custom-model-binding?view=aspnetcore-6.0#implementing-a-modelbinderprovider). This is a good idea if you always want the custom binder to be applied. In this case, I want to opt-in to the binding with an attribute.

```csharp
[HttpGet]
public IActionResult Index([ModelBinder(BinderType = typeof(YesNoBooleanModelBinder))] bool isValid)
{
    ...
}
```

When executing the binder `bindingContext.ModelName` will be `isValid`.

# Unit Testing

The next step was to figure out how to setup `ModelBindingContext` for unit tests. I ended up with this. Assertions are handled with [FluentAssertions](https://fluentassertions.com/)

```csharp
public class YesNoBooleanModelBinderTests
{
    [Theory]
    [InlineData("Yes", true)]
    [InlineData("yes", true)]
    [InlineData("No", false)]
    [InlineData("no", false)]
    public async Task BindModelAsync_returns_success_with_with_expected_value(
        string modelValue, bool expectedResult)
    {
        // Arrange
        var modelBinder = new YesNoBooleanModelBinder();
        var bindingContext = BuildBindingContext(modelValue);

        // Act
        await modelBinder.BindModelAsync(bindingContext);

        // Assert
        bindingContext.Result.IsModelSet.Should().Be(true);
        var model = bindingContext.Result.Model as bool?;
        model.Value.Should().Be(expectedResult);
    }

    [Fact]
    public async Task BindModelAsync_does_not_bind_if_model_value_is_not_yes_or_no()
    {
        // Arrange
        var modelBinder = new YesNoBooleanModelBinder();
        var bindingContext = BuildBindingContext("invalid");

        // Act
        await modelBinder.BindModelAsync(bindingContext);

        // Assert
        bindingContext.Result.IsModelSet.Should().Be(false);
    }

    private ModelBindingContext BuildBindingContext(string modelValue)
    {
        const string ModelName = "test";
        var bindingContext = new DefaultModelBindingContext
        {
            ModelName = ModelName
        };

        var bindingSource = new BindingSource("", "", false, false);
        var queryCollection = new QueryCollection(new Dictionary<string, StringValues>
        {
            { ModelName, new StringValues(modelValue) }
        });
        bindingContext.ValueProvider = new QueryStringValueProvider(bindingSource, queryCollection, null);

        return bindingContext;
    }
}
```

The important bits are in `BuildBindingContext`. `ModelBindingContext` is abstract, but the framework provides a `DefaultModelBindingContext` that we can instantiate. The `BindingSource` is not relevant for our tests, but must be provided. The `QueryCollection` will feed into the `QueryStringValueProvider` that we pull values out of in the `YesNoBooleanModelBinder` implementation. In this case we're saying the data came from a query string, but you could use another implementation of `IValueProvider`, such as `RouteValueProvider`. You can see an example of that at [https://stackoverflow.com/a/55387164/235145](https://stackoverflow.com/a/55387164/235145)
