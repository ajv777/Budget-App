// IIFE
var budgetController = (function () {
  var x = 23;
  var add = function (a) {
    return x + a;
  };

  return {
    publicTest: function (b) {
      // console.log(add(b));
      return add(b);
    },
  };
})();

var UIController = (function () {
  // Some code
})();

// Connect the controllers: pass the other two modules as arguments
var controller = (function (budgetCtl, UICtl) {
  // Some code
  var z = budgetCtl.publicTest(5);

  return {
    anotherPublicTest: function () {
      console.log(z);
    },
  };
})(budgetController, UIController);
