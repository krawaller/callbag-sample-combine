# callbag-sample-combine

[Callbag](https://github.com/callbag/callbag) operator behaving exactly like [callbag-sample](https://github.com/staltz/callbag-sample) by [André Staltz](https://staltz.com/) except the return source emits *both* the original listenable and the sampled pullable values together.

`npm install callbag-sample-combine`

## example

```js
const sampleCombine = require('callbag-sample-combine');
const fromIter = require('callbag-from-iter');
const fromInterval = require('callbag-interval');
const forEach = require('callbag-for-each');

const listenable = fromInterval(1000);
const pullable = fromIter(['foo', 'bar', 'baz']);

const source = sampleCombine(pullable)(listenable);
const sink = forEach(d => console.log(d));

source(0, sink);   // [1, 'foo']
                   // [2, 'bar']
                   // [3, 'baz']
```
