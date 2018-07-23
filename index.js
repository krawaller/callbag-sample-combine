/*
Slightly modified version of `callbag-sample` by André Staltz
https://github.com/staltz/callbag-sample/blob/master/index.js
*/

const sampleCombine = pullable => listenable => (start, sink) => {
  if (start !== 0) return;
  let ltalkback;
  let ptalkback;
  let origVals = [];
  listenable(0, (lt, ld) => {
    if (lt === 0) {
      ltalkback = ld;
      pullable(0, (pt, pd) => {
        if (pt === 0) ptalkback = pd;
        if (pt === 1) sink(1, [origVals.shift(), pd]);
        if (pt === 2) {
          ltalkback(2);
          sink(2);
        }
      });
      sink(0, t => {
        if (t === 2) {
          ltalkback(2);
          ptalkback(2);
        }
      });
    }
    if (lt === 1) {
      origVals.push(ld);
      ptalkback(1);
    }
    if (lt === 2) {
      ptalkback(2);
      sink(2);
    }
  });
};

export default sampleCombine;
