# UI Performance

**WARNING:** This repo is not done. I made it public to try to get help with [this](https://github.com/elm-lang/projects#compare-elms-virtual-dom-to-other-stuff). If you have the necessary skills, please share them. Would love to see how we stack up and if there are any tricks we can learn from!


## Methodology

There is one major rule: **Every project in a benchmark must schedule repaints the same way.**

In practice, this means:

  - No project can use `requestAnimationFrame`. This makes it possible to skip repaints, hiding the performance of the underlying virtual-dom implementation.

  - Each project must put repaints on the JavaScript event queue in the same way. Some projects can batch all the repaints into a single synchronous block of code. This usually means all the DOM updates result in a single repaint of the browser, saving a lot of time. Other projects put each repaint on the event queue, meaning the browser is able to interupt and do a repaint for every frame. This is slower, but probably the fairest test of a virtual-dom implementation because it exercises the entire rendering pipeline.

## Default Scheduling Strategies

  - **Elm** calls `requestAnimationFrame` whenever a new view is available. This means the app repaint is aligned with the browser repaint, making things more efficient. This also means we can drop frames if they were not going to be shown on screen anyway.

  - **React** does not use `requestAnimationFrame`. There may be side-effects in various parts of rendering, so to make this deterministic and predictable, they need to repaint every frame no matter what.

Now, if you compare these approaches when feeding in events very quickly, the Elm version will win every time. It can skip frames, so it is not a fair comparison of the renderers themselves.
