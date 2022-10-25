---
title: "Lessons Learned With Stripe Subscriptions"
description: "So, you've got a new product or business idea and you think selling subscriptions is the way to go. Here are some issues to keep in mind as you get started."
date: "2021-11-12"
heroImage: "/assets/2021-11-13_lessons-learned-with-stripe-subscriptions/stripe_wordmark.png"
heroImageAlt: "Wordmark for Stripe"
tags: 
  - "stripe"
---

So, you've got a new product or business idea and you think selling subscriptions is the way to go. After doing some research, you've decided that Stripe is pretty popular for handling payments, so you're going to give it a shot.

First, that's a good idea. Stripe is very popular for good reason. Their feature set is impressive and their API is excellent. They've clearly had a lot of very talented people put a lot of thought into a lot of different use cases.

Now for the bad news. Stripe having put all of that thought into different use cases is going to expose the fact that you haven't done the same for your business yet.

We're going to get through this though. My pain is your gain. I come with tales of pain and woe in the hope that you avoid some of the same.

# Terminology

One of the most important things to understand about Stripe subscriptions is that your users will never pay for them. Rather, they will pay invoices that are generated from subscriptions at some point before the payment is due. This isn't that important of a distinction for the very straightforward use case of somebody purchasing a subscription that becomes active immediately. As we'll see though, it's very important in other use cases.

Stripe subscriptions involve, at minimum, the following resources

- Subscriptions
- Subscription items
- Invoices
- Invoice items

Subscriptions have many invoice items. Invoices are generated from subscriptions and contain many invoice items. An invoice can be thought of as a snapshot of the subscription at a point in time. The contents of the subscription will change over time, but past invoices will not. When an invoice is created, you will have a brief window of one hour to modify it before it gets finalized.

Luckily, the Stripe documentation is often excellent. You'll do yourself a huge favor by carefully reading their [guide to how subscriptions work](https://stripe.com/docs/billing/subscriptions/overview) multiple times. The rest of this post is going to assume that you have made yourself moderately familiar with the basics of how subscriptions work in Stripe.

That being said...

# How Are You Going to Sync With Your System?

Stripe provides an [extensive set of events](https://stripe.com/docs/api/events/types) that you can subscribe to through [webhooks](https://stripe.com/docs/billing/subscriptions/webhooks). Deciding what webhooks you need to care about is important. At a minimum, you need to care about the `[invoice.paid](https://stripe.com/docs/api/events/types#event_types-invoice.paid)` event. This covers the happy path of your customer choosing a subscription plan and checking out. After their card (or other payment method) is successfully charged, you will receive the `invoice.paid` event. You handle this event to activate their subscription in your system.

But what do you do with the rest of the information from that event? Do you toss it aside? Persist it somewhere? As with just about anything in software engineering, it depends.

Do you need to show payment history to the user? If so, do you want to query the Stripe API every time or your own database?

Do you have any reporting requirements around revenue? Is that best handled through the Stripe dashboard or your own database?

If saving information in your own database, how much? Do you need everything on the invoice and each invoice item? Just a subset?

In my case, I've decided to persist a subset of this information in a relational database. We have some monthly reporting requirements that are easier to manage when we can query the Stripe data alongside non-Stripe data in our database. This does introduce overhead though and I have concerns about the number of Stripe events we'll need to subscribe to over time. Time will tell if it was the correct choice.

# Do You Offer Trials?

I mentioned above that on the happy path your customer will choose a subscription plan and immediately be charged. As soon as you decide to offer trials, you're off this happy path.

In the happy path use case, you create a subscription through the Stripe API and an invoice is immediately generated. That invoice has a [payment intent](https://stripe.com/docs/api/payment_intents) associated with it. If you specifically ask for the latest invoice and it's payment intent by using [expanded responses](https://stripe.com/docs/expand), you can get the ID for this payment intent in the response when creating the subscription. You can then use this payment intent when the user submits their payment information.

In trials, that is no longer true. When you create the subscription, you will not get a latest invoice back with the payment intent. Stripe will initially create an invoice for $0 that it will be immediately marked as paid for the trial. The first invoice for actual payment won't be generated until an hour before the trial expires.

I haven't actually implemented this yet, but, from what I can tell as of writing, this means you need to [collect a payment method](https://stripe.com/docs/payments/save-and-reuse) and associate that with the customer in Stripe. When the trial expires and the next invoice needs to be paid, you can then specify that payment method.

# Do You Want To Start Subscriptions on a Future Date?

Suppose trials don't make sense for your use case. For [Husmus](https://husmus.net/), this is true. We sell subscriptions for insurance. A standard use case is for a tenant to buy insurance that they want to become active when they move into their new home. Trials don't make sense here.

Solving this is actually what I'm working on now, so I don't have a full solution yet. It involves using [subscription schedules](https://stripe.com/docs/billing/subscriptions/subscription-schedules) though. The documentation has a [guide for starting a subscription in the future](https://stripe.com/docs/billing/subscriptions/subscription-schedules/use-cases#start-subscription-future). Given how trials work, it's safe to assume (I can't wait to eat these words) that the same rules for invoice generation apply. You will need to collect payment information in advance and then charge the user when the subscription actually starts.

# Do You Want To Remind Users of Renewal?

Thankfully, this one is a bit easier to handle. In your [account billing settings](https://dashboard.stripe.com/settings/billing/automatic), you can set the number of days in advance to send an `[invoice.upcoming](https://stripe.com/docs/api/events/types#event_types-invoice.upcoming)` event. You will need to handle this webhook event and remind your users in whatever way is appropriate for your app.

![Stripe renewal event settings screenshot](https://brianmeekerme.files.wordpress.com/2021/11/stripe_upcoming_renwal_setting.png?w=1024)

# What Taxes Do You Need to Collect?

Are you assessing sales tax or VAT? Good news! [Stripe will handle that for you](https://stripe.com/docs/tax). Anything else though, and you'll want to start reading up on [Stripe tax rates](https://stripe.com/docs/billing/taxes/tax-rates).

Husmus currently operates in the UK, which mean means we have to deal with IPT (Insurance Premium Tax). This is a tax that applies to all insurance products sold in the UK. Stripe doesn't attempt to handle tax rates like this itself, so we need to define the tax ourselves and make sure it is added to all insurance products that the user is subscribed to. As long as it is attached to the subscription item, then when the invoice is generated it will be attached to the corresponding invoice item and users will be charged the correct tax.

Stripe supports up to five tax rates per line item, so go nuts. Chances are Stripe can handle the tax rates in your jurisdiction.

# Are You Going To Sync Up Subscription Renewal Dates?

Another issue we're dealing with is if we should sync up subscription renewal dates. Let's say that you purchase a subscription for one insurance product on the 3rd of the month. Then you purchase another one two weeks later on the 17th. Should these subscriptions be treated independently or not? In our case, we haven't definitively answered this question. There is a tension between the simplicity of a single subscription vs. most insurance being sold with annual subscriptions. Should the second subscription be independent or sync up with first? Or should it be dependent of if the insurance is for the same property? Your business may have similar questions.

If you decide to sync up to existing subscriptions, then you get into [proration](https://stripe.com/docs/billing/subscriptions/prorations). Luckily, this is another thing that Stripe had good support for, but it's yet another detail you will need to handle properly.

# How Do You Handle Renewal Failures?

I haven't implemented this yet. That's a problem for future Brian when subscriptions start to renew. However, it is something on my mind. Once again, Stripe will send you an event when this happens, `[invoice.payment_failed](https://stripe.com/docs/api/events/types#event_types-invoice.payment_failed)` in this case. Handle the event and prod your user to update their payment method.

Of course, that opens another issue. If you've been handling trials or subscriptions that start in the future, chances are that you already have a way for users to enter payment methods. In this case, they probably need to update their payment method. If you haven't care about this yet, you need to now.

# Summary

Stripe is complicated because payments are complicated. I've only scratched the surface on use cases for Stripe subscriptions. The good news is that if you have a simple subscription product, you can probably punt on a lot of these questions. You don't have to have firm answers to all of these questions up front, but the more you can answer, the better your Stripe experience will be for both you and your customers.
