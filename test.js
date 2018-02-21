const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const sampleCombine = require('./index');

test('it combines the sampled value with the original emission', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const listenable = makeMockCallbag('listenable', true);

  let pullableVals = ['foo','bar','baz'];
  const pullable = makeMockCallbag('pullable', (name,dir,t,d) => {
    t === 1 && pullable.emit(1, pullableVals.shift());
  }, true);

  const sink = makeMockCallbag('sink', report);

  sampleCombine(pullable)(listenable)(0, sink);

  listenable.emit(1, 'FOO');
  listenable.emit(1, 'BAR');

  t.deepEqual(history, [
    ['sink','body',1,['FOO','foo']],
    ['sink','body',1,['BAR','bar']],
  ], 'sink gets original and sample together');

  t.end();
});

test('it ends both listenable and sink when pullable ends', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const listenable = makeMockCallbag('listenable', report, true);
  const pullable = makeMockCallbag('pullable', true);
  const sink = makeMockCallbag('sink', report);

  sampleCombine(pullable)(listenable)(0, sink);

  pullable.emit(2);

  t.deepEqual(history, [
    ['listenable','talkback',2, undefined],
    ['sink','body',2, undefined],
  ], 'sink and listenables are ended by pullable');

  t.end();
});

test('it ends both pullable and sink when listenable ends', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const listenable = makeMockCallbag('listenable', true);
  const pullable = makeMockCallbag('pullable', report, true);
  const sink = makeMockCallbag('sink', report);

  sampleCombine(pullable)(listenable)(0, sink);

  listenable.emit(2);

  t.deepEqual(history, [
    ['pullable','talkback',2, undefined],
    ['sink','body',2, undefined],
  ], 'sink and pullable are ended by listenable');

  t.end();
});

test('it ends both pullable and listenable when sink ends', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const listenable = makeMockCallbag('listenable', report, true);
  const pullable = makeMockCallbag('pullable', report, true);
  const sink = makeMockCallbag('sink');

  sampleCombine(pullable)(listenable)(0, sink);

  sink.emit(2);

  t.deepEqual(history, [
    ['listenable','talkback',2, undefined],
    ['pullable','talkback',2, undefined],
  ], 'listenable and pullable are ended by sink');

  t.end();
});
