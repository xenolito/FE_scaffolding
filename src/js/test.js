"use strict";

//block scoped "let" declaration
const sentences = [
  { subject: "Javascript", verb: "is", adj: "great" },
  { subject: "Dinosaurs", verb: "are", adj: "Gooone" }
];

//object destructuring
function say({ subject, verb, adj }) {
  return `${subject} ${verb} ${adj}`;
}

for (let s of sentences) {
  say(s);
}

(function() {
  $(window).on("load", function() {
    const pp = (str, sufix) => `Hola que ASE= ${str} con sufijo= ${sufix}`;

    console.log(
      "%c" + `\ud83e\uddf2 hola que ase jquery: ${$(".testing").attr("class")}`,
      "color:#343434;font-size:16px;font-family:Helvetica,Arial;"
    );
    let r = say(sentences[0]);
    $("#result").html(pp("NAMCO", "SL"));
  });
})();
