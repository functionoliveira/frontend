window.onload = function() {
    console.log('Ready');

    var buttons = document.querySelectorAll('.btn-colorful');
    var outline = document.querySelectorAll('.btn-outline');
    var accordion_cards = document.querySelectorAll('.accordion-card');
    var carousel_0 = document.querySelector('#carousel_0');
    var carousel_1 = document.querySelector('#carousel_1');
    var cycle = document.querySelector('#cycle_carousel');

    new Utils();

    var oCarousel_0 = new Carousel(carousel_0);
    var oCarousel_1 = new Carousel(carousel_1);


    var oCycleCarousel = new CycleCarousel(cycle);

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