window.onload = function() {
    console.log('Ready');
    new Utils();

    var buttons = document.querySelectorAll('.btn-colorful');
    var outline = document.querySelectorAll('.btn-outline');
    var accordion_cards = document.querySelectorAll('.accordion-card');
    var carousel_0 = document.querySelector('#carousel_0');
    var carousel_1 = document.querySelector('#carousel_1');
    var carousel_custom = document.querySelector('#carousel_custom');
    var carousel_custom_1 = document.querySelector('#carousel_custom_1');
    var cycle = document.querySelector('#cycle_carousel');cycle_carousel_autoslide
    var cycle_autoslide = document.querySelector('#cycle_carousel_autoslide');

    // Carrossel 
    var oCarousel_0 = new Carousel(carousel_0);
    var oCarousel_1 = new Carousel(carousel_1);
    var oCarousel_custom = new Carousel(carousel_custom, { show_indexes : false, qtd_items : 1, animation_left : null, animation_right : null });
    var oCarousel_custom_1 = new Carousel(carousel_custom_1);
    var oCycleCarousel = new CycleCarousel(cycle);
    var oCycleCarouselAutoSlide = new CycleCarousel(cycle_autoslide);
    oCycleCarouselAutoSlide.autoSlide(2500);

    // Campos
    var text_field = document.querySelector('.text-field');
    var select_field = document.querySelector('.select-field');
    var checkbox_field = document.querySelector('.checkbox-field');
    var textarea_field = document.querySelector('.textarea-field');

    new TextField(text_field);
    new SelectField(select_field);
    new CheckboxField(checkbox_field);
    new TextareaField(textarea_field);

    accordion_cards.forEach((card) => {
        new AccordionCard(card);
    });

    buttons.forEach((button) => {
        new RipleEffect(button, 'click');
    });

    outline.forEach((button) => {
        var effect = new RipleEffect(button, 'click');
    });
} 