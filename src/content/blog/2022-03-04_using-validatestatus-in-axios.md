---
title: "Using validateStatus in Axios"
description: "This past week I was working with an API endpoint where a 404 response is expected for invalid user input. I didn't want Axios to treat this as an error"
date: "2022-03-04"
tags: 
  - "axios"
  - "javascript"
---

This past week I was working with an API endpoint where a 404 response is expected for invalid user input. I didn't want [Axios](https://axios-http.com/) to treat this as an error. It had been awhile since I last needed to do this, but reading through the [request configuration docs](https://axios-http.com/docs/req_config) I was reminded of `validateStatus`. By default, it will return true for all 2xx responses.

```javascript
validateStatus: (status) => {
  return status >= 200 && status < 300; // default
},
```

In this case, I want the promise to resolve for 404 responses as well.

```javascript
validateStatus: (status) => {
  return (status >= 200 && status < 300) || status == 404;
},
```

And that's it. When the user puts in invalid input, the promise will still resolve. This isn't something you often want to do, but it's good to keep in mind depending on what a 404 actually means for your use case.
