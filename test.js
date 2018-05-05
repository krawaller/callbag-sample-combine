const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const sampleCombine = require('./index');
const fromIter = require('callbag-from-iter');

test('it combines the sampled value with the original emission', t => {
  const listenable = makeMockCallbag(true);
  const pullable = fromIter(['foo','bar','baz']);
  const sink = makeMockCallbag();

  sampleCombine(pullable)(listenable)(0, sink);

  listenable.emit(1, 'FOO');
  listenable.emit(1, 'BAR');

  t.deepEqual(
    sink.getReceivedData(),
    [['FOO','foo'],['BAR','bar']],
    'sink gets original and sample together'
  );
  t.end();
});

test('it ends both listenable and sink when pullable ends', t => {
  const listenable = makeMockCallbag(true);
  const pullable = makeMockCallbag(true);
  const sink = makeMockCallbag();

  sampleCombine(pullable)(listenable)(0, sink);

  pullable.emit(2);

  t.ok(!listenable.checkConnection(), 'listenable was ended by pullable');
  t.ok(!sink.checkConnection(), 'sink was ended by pullable');
  t.end();
});

test('it ends both pullable and sink when listenable ends', t => {
  const listenable = makeMockCallbag(true);
  const pullable = makeMockCallbag(true);
  const sink = makeMockCallbag();

  sampleCombine(pullable)(listenable)(0, sink);

  listenable.emit(2);

  t.ok(!pullable.checkConnection(), 'pullable was ended by listenable');
  t.ok(!sink.checkConnection(), 'sink was ended by listenable');
  t.end();
});

test('it ends both pullable and listenable when sink ends', t => {
  const listenable = makeMockCallbag(true);
  const pullable = makeMockCallbag(true);
  const sink = makeMockCallbag();

  sampleCombine(pullable)(listenable)(0, sink);

  sink.emit(2);

  t.ok(!listenable.checkConnection(), 'listenable was ended by sink');
  t.ok(!pullable.checkConnection(), 'sink was ended by sink');
  t.end();
});
