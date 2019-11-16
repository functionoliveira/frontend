window.onload = function() {
    console.log('Ready');

    var buttons = document.querySelectorAll('.btn-colorful');
    var outline = document.querySelectorAll('.btn-outline');
    var accordion_cards = document.querySelectorAll('.accordion-card');

    new Utils();

    accordion_cards.forEach((card) => {
        new AccordionCard(card);
    });

    buttons.forEach((button) => {
        new RipleEffect(button, 'click');
    });

    outline.forEach((button) => {
        var effect = new RipleEffect(button, 'mouseenter');

        button.addEventListener('mouseleave', (evt) => {
            effect.off(evt);
        });
    });
}