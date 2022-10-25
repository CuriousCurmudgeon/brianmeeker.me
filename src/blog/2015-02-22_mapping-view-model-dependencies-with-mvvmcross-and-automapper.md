---
title: "Mapping View Model Dependencies with MvvmCross and AutoMapper"
description: "
AutoMapper is one of those amazing tools that I wish I was better with. It's incredibly flexible, but I often throw in the towel and map things myself when it starts getting complicated. A recent pain point has been view models in a MvvmCross project."
date: "2015-02-22"
tags:
  - "c-sharp"
  - "automapper"
  - "mvvmcross"
---

[AutoMapper](http://automapper.org/ "AutoMapper") is one of those amazing tools that I wish I was better with. It's incredibly flexible, but I often throw in the towel and map things myself when it starts getting complicated. A recent pain point has been view models in a MvvmCross project.

[MvvmCross](https://github.com/MvvmCross/MvvmCross "MvvmCross") is a nice C# implementation of the [MVVM pattern](http://en.wikipedia.org/wiki/Model_View_ViewModel "MVVM pattern"). I use it on a daily basis to write mobile apps. It's very common to use it with AutoMapper to map from Model -> View Model. However, my view models often have constructor dependencies, which AutoMapper can't handle with the default configuration.

# Solution ([On GitHub](https://github.com/CuriousCurmudgeon/MvvmCrossAutoMapperSample "On GitHub"))

MvvmCross is able to supply these dependencies. We just need to make sure everything is registered and tell AutoMapper how to get them. My demo is a simple app that displays different types of tiles.

```csharp
public class TileViewModel : MvxViewModel
{
    private readonly ITileService _tileService;

    public TileViewModel(ITileService tileService)
    {
        _tileService = tileService;
    }

    private string _color;
    public string Color
    {
        get { return _color; }
        set { _color = value; RaisePropertyChanged(() => Color); } 
    }

    public IMvxCommand UpdateState
    {
        get
        {
            return new MvxCommand(async () =>
            {
                await _tileService.UpdateStateAsync(this);
            });
        }
    }
}
```

You can see that TileViewModel has a dependency on ITileService. Because of this, AutoMapper can't instantiate a TileViewModel. We need to let AutoMapper know how to supply this dependency, which we can do through configuration.

```csharp
// Tell AutoMapper to resolve dependencies using MvvmCross's service locator.
Mapper.Configuration.ConstructServicesUsing(Mvx.Resolve);
```

The default App.cs for MvvmCross already registers all interfaces that end with "Service", so we just need to register the view model.

```csharp
Mvx.RegisterType<TileViewModel, TileViewModel>();
```

Now, we just need to tell AutoMapper to use the service locator when mapping to TileViewModel

```csharp
Mapper.CreateMap<Tile, TileViewModel>()
    .ConstructUsingServiceLocator();
```

And the magic is complete. Now, we can use AutoMapper as usual.

```csharp
var tiles = await _tileService.LoadTilesAsync();
var tileViewModels = Mapper.Map<IList<TileViewModel>>(tiles);
```

When we map to TileViewModel, each instance is resolved with Mvx.Resolve, which knows how to supply an implementation of ITileService. You can see a complete demo app on [GitHub](https://github.com/CuriousCurmudgeon/MvvmCrossAutoMapperSample "Demo App")
