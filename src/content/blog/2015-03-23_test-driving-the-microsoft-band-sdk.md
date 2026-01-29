---
title: "Test Driving the Microsoft Band SDK"
description: "TL;DR: The Band SDK is currently very much a preview and you should wait if you want to do anything serious with it. You're very limited in functionality."
date: "2015-03-23"
---

TL;DR: The Band SDK is currently very much a preview and you should wait if you want to do anything serious with it. You're very limited in functionality.

# Pairing

I use my Band on a day-to-day basis with my Nexus 5. I had never paired it to a Windows Phone. I had to factory reset my Band to get it to sync with my Lumia 635. I'm hopeful this is not a common issue when switching between platforms. I had no problem getting the band to pair back to my Nexus 5 when I was done. If it is an issue, then cross-platform development would be significantly easier if you had a separate Band for each platform. That may be true anyways to avoid constant re-pairing when testing multiple platforms at once.

# SDK

I was using the [1.3.10219-preview build from NuGet](https://www.nuget.org/packages/Microsoft.Band/1.3.10219-preview). Currently, you can

- Read sensor data in real-time
- Create tiles and send notifications to them
- Change themes
- Change the main tile background image

I was mainly interested in sensor data. My goal was to create a simple app that would post your steps for the day to Slack (I have a lot of Slack code from a Windows Phone Slack client I started and didn't finish). Ideally, the user would be able to tap a tile on the Band and a message would be sent to Slack. Unfortunately, the SDK does not support anything like that. You can send notifications to a tile, but you can't trigger code on the phone from a tile. My backup plan was to have a timer background task that read step data from the Band, but that didn't work either. Apparently, the SDK [does not work in background tasks right now](https://twitter.com/PhillipHoff/status/577532297886318593) . I settled for the user having to tap a button in the app.

# PCL Support

While I was working on Windows Phone, a co-worker was playing with the SDK on Android using Xamarin. We were disappointed to see that the NuGet package does not support Profile259, which would include iOS and Android. It only supports net45+win+wpa81. Long-term, I hope to see the interfaces separated into a separate assembly so that they can be referenced by the PCL. Otherwise, I would need to wrap almost the entire SDK myself to use it with MVVM. Or hope that Xamarin does it for them with their component.

# Pitfalls

- Bluetooth is flaky. You will get IO errors. Be ready for them.
- I was also surprised that the pedometer sensor gives the total number of steps the device has seen overall, not just for the current day. Since you can't run in a timer background task right now, there is no reliable way to get just your steps for the day.
- Be careful managing the lifetime of your IBandClient objects. When it gets disposed, all of your open connections to the Band will be closed. This is perfectly reasonable, but I wasn't thinking about it at first. If you're wondering why your ReadingChanged event never fires, this is probably why.
