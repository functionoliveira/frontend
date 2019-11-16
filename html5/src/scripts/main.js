window.onload = function() {
    console.log('Ready');

    var accordion_cards = document.querySelectorAll('.accordion-card');

    new Utils();

    accordion_cards.forEach((card) => {
        new AccordionCard(card);
    });
}