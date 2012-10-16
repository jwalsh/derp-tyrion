test('a test', function() {
  expect(2);

  function calc(x, operation ) {
    return operation(x);
  }

  var result = calc(2, function(x ) {
    ok(true, 'calc() calls operation function');
    return x * x;
  });

  equal(result, 4, '2 square equals 4');
});


asyncTest('asynchronous test', function() {
  expect(1);

  setTimeout(function() {
    ok(true, 'Passed and ready to resume!');
    start();
  }, 100);
});
