"use strict";

//block scoped "let" declaration
const sentences = [
  { subject: "Javascript", verb: "is", adj: "great" },
  { subject: "Dinosaurs", verb: "are", adj: "Gooone" }
];

//object destructuring
function say({ subject, verb, adj }) {
  console.log(`${subject} ${verb} ${adj}`);
}

for (let s of sentences) {
  say(s);
}

console.log("FOLLOW THE WHITE RABBIT NEO " + add(0.2, 0.1));

function add(x, y) {
  return x + y;
}

(function($) {
  console.log("hola aquí estamos con jQurey");

  $(window).on("load", function() {
    console.log("todo cargado");

    $(".testing").css({
      background: "##fff"
    });

    console.log($(".testing"));
  });
})(jQuery);
