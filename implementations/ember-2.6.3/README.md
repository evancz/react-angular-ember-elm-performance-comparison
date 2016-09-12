# Ember.js TodoMVC for Benchmarking

This is an update of the
_[Ember.js TodoMVC example](https://github.com/tastejs/todomvc/tree/gh-pages/examples/emberjs)_
with the following changes:

* Upgrade to Ember 2.9.0-beta.1
* Configure router to support relative URLs
  (config/environment.js locationType: 'none' (as opposed to the default 'auto'))
* Remove localStorage functionality - not relevant to measuring render performance

# Building

```
npm install -g bower;
npm install -g ember-cli@2.9.0-beta.1;
npm i; bower i;
ember build -prod;
open dist/index.html;
```