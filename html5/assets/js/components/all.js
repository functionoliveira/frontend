class AccordionCard {
    constructor(html) { 
        this.self = html;
        this.content = html.querySelector('.accordion-card__content');
        this.btn_open = html.querySelector('.accordion-card__open');

        this.self.addEventListener('click', () => {
            this.content.toggleClass('open');
            this.btn_open.toggleClass('hide');
            this.setContentHeight();
        });
    } 

    getContentHeight() {
        var height = this.content.offsetHeight;
        return height;
    }

    setContentHeight() {
        if(this.content.hasClass('open')){
            var height = this.getContentHeight();
            this.self.css({ 'height' : 'calc(31.25vw + ' + height + 'px)' });
        }else{
            this.self.clearStyle();
        }
    }
}
class CarouselOptions {
    constructor(options) {
        if(options.animation_left) { this.constructor.prototype.slideToLeft = options.animation_left; }
        if(options.animation_right) { this.constructor.prototype.slideToRight = options.animation_right; }
        this.show_indexes = options.show_indexes ? options.show_indexes : null;
        this.show_timer = options.show_timer ? options.show_timer : null;
        this.qtd_items = options.qtd_items ? options.qtd_items : null;
    }
}

/** Class representa um carrossel html. */
class Carousel extends CarouselOptions {
    /**
     * Cria uma instancia de carrossel.
     * @param {HTMLElement} carousel - O elemento html base do carrossel.
     * @param {JSON} options - JSON com opções para o carrossel, { show_indexes : Boolean, qtd_items : Number, animation_left : function, animation_right : function }.
     */ 
    constructor(carousel, options={ show_indexes : true, qtd_items : 1, animation_left : null, animation_right : null }){
        super(options);

        // flag controla bloqueio em meio a animação
        this.blocked = false;
        // conteúdos html do carrossel
        this.carousel = carousel;
        this.content = carousel.querySelector('.carousel__content');
        this.current_item = carousel.querySelector('.carousel__content__item');
        this.first_item = carousel.querySelector('.carousel__content__item'); 
        this.last_item = this.content.lastElementChild; 
        // controllers
        this.previous = carousel.querySelector('.carousel__controllers__previous');
        this.next = carousel.querySelector('.carousel__controllers__next');
        this.indexes = carousel.querySelectorAll('.carousel__controllers__index');
        // medidas de tela, carrossel e item
        this.content_dimension = this.content.getBoundingClientRect();
        this.SCREE_SIZE = Number(window.innerWidth); 
        this.translate = 0;
        this.initialize();
    }

    initialize() {
        if(this.last_item && !this.validate()) {
            this.ITEM_SIZE = Number(this.current_item.offsetWidth);
            // Realiza o bind dos eventos necessários para que o componente funcione
            this.bindAction();     
            this.hideOrActiveIndexes();
            this.disableRightButton();
            this.disableLeftButton();
            window.onresize = () => { this.updateSizes() };
        }else{
            this.carousel.querySelector('.carousel__controllers').remove();
        }
    }

    bindAction() {
        this.carousel.addEventListener('touchstart', (evt) => {  this.touchStart(evt) }); 
        this.carousel.addEventListener('touchmove', (evt) => {  this.touchMove(evt) }); 
        this.carousel.addEventListener('touchend', (evt) => {  this.touchEnd(evt) }); 

        this.next.addEventListener('click', (evt) => { this.slideTo('right') });
        this.previous.addEventListener('click', (evt) => { this.slideTo('left') });
    }

    validate() {
        var screen_width = Number(window.innerWidth); 
        var end_slider_content = Number(this.content.getBoundingClientRect().right);
        var end_last_item = this.content.lastElementChild.getBoundingClientRect().right;

        if(end_last_item > screen_width || end_last_item > end_slider_content) {
            return false;
        }

        return true;
    }

    slideTo(side) {
        // console.log('slide to', side);
        if(this.blocked){
            return;
        }

        if(side == 'left' && this.current_item != this.first_item){
            this.slideToLeft();
            return; 
        }
        if(side == 'right' && this.current_item != this.last_item){
            this.slideToRight();
            return; 
        }
        this.content.style.transform = 'translate('+ this.translate +'px)';
    }

    slideToRight() {
        this.block();

        // movimento lateralmente para a esquerda os itens do carrossel
        var items = this.content.querySelectorAll('.carousel__content__item');
        items.forEach((item) => {
            item.css({ 'transition' : '0.4s all ease-in-out', 'transform' : 'translateX(' +  (-this.ITEM_SIZE * this.qtd_items) + 'px)' });
        });
                
        // reorganiza a lista movimento os itens de posição igual a quantidade de vezes passa no options (default 1)
        setTimeout(() => {
            for(var i = 0; i < this.qtd_items; i++){
                if(this.current_item != this.last_item){
                    var temp = this.current_item;
                    this.current_item.remove();
                    this.current_item = this.content.querySelector('.carousel__content__item');
                    this.content.appendChild(temp);
                }
            }
            this.updateIndexes();
            this.free();
            this.disableRightButton();
            this.disableLeftButton();
            items.forEach((item) => {
                item.clearStyle();
            });
        }, 500);        
    }

    slideToLeft() {
        this.block();
        var items = this.content.querySelectorAll('.carousel__content__item');
        for(var i = 0; i < this.qtd_items; i++){
            if(this.current_item != this.first_item){
                var temp = this.content.lastElementChild;
                this.content.lastElementChild.remove();
                this.content.prepend(temp);
                this.current_item = this.content.querySelector('.carousel__content__item');
            }
        }
        
        items.forEach((item) => {
            item.css({ 'transform' : 'translateX(' +  (-this.ITEM_SIZE*this.qtd_items) + 'px)' });
        });
        setTimeout(() => {
            items.forEach((item) => {
                item.css({ 'transition' : '.4s all ease-in-out', 'transform' : 'translateX(0px)' });
            });
        }, 100);
                
        setTimeout(() => {
            this.updateIndexes();
            this.free();
            this.disableRightButton();
            this.disableLeftButton();
            items.forEach((item) => {
                item.clearStyle();
            });
        }, 500);
    }

    disableLeftButton() {
        if(this.current_item == this.first_item){
            this.previous.classList.add('disable');
        }else{
            this.previous.classList.remove('disable');
        }
    }

    disableRightButton() {
        if(this.current_item == this.last_item){
            this.next.classList.add('disable');
        }else{
            this.next.classList.remove('disable');
        }
    }

    touchStart(evt){
        if(evt.target.className.includes('carousel__controllers__previous') || evt.target.className.includes('carousel__controllers__next')){
            return;
        }
        this.initial =  Number(evt.touches[0].clientX);
        // console.log('Iniciando evento drag - ' + this.initial);
    }

    touchMove(evt){
        if(evt.target.className.includes('carousel__controllers__previous') || evt.target.className.includes('carousel__controllers__next')){
            return;
        }
        this.touch = Number(evt.touches[0].clientX) - this.initial;
        // console.log("Move : " + this.touch);
        var posX = this.translate + this.touch;
        //indica a inteção de scrollar o item do carrossel
        var iwanna = this.SCREE_SIZE / 8; 
        if(posX > iwanna || posX < -iwanna)
            $(evt.currentTarget).find('.slider').css('transform', 'translate('+ posX +'px)');
    }

    touchEnd(evt){
        if(evt.target.className.includes('carousel__controllers__previous') || evt.target.className.includes('carousel__controllers__next')){
            return;
        }
        // console.log(evt.target);
        // console.log('Fim do evento drag, decidir o que fazer.');
        var right = (this.SCREE_SIZE / 5);
        var left = -(this.SCREE_SIZE / 5);

        if(this.touch > right || evt.target.className == 'left-arrow'){
            this.slideTo('left');
            return;  
        }
        if(this.touch < left || evt.target.className == 'right-arrow'){
            this.slideTo('right');
            return;   
        }

        $(this.slider).css('transform', 'translate('+ this.translate +'px)');
    }

    updateSizes(){
        this.SLIDER_WIDTH = Number(this.content.offsetWidth);
        this.SCREE_SIZE = Number(window.innerWidth); 
        this.ITEM_SIZE = Number(this.current_item.offsetWidth);     
    }

    /**
     * Função interna da classe Carousel, atualiza os indexes do carrossel
     * após uma passagem de slide
     * 
     * @example
     *   var carousel = new Carousel(html); // instanciando objeto carrossel
     *   carousel.block(); // bloqueia controles
     * 
     */
    updateIndexes() {
        if(this.show_indexes) {
            var old_number_active = this.carousel.querySelector('.carousel__controllers__index.active');
            var indexes = this.carousel.querySelectorAll('.carousel__controllers__index');
            var idx = this.current_item.attr('carousel-index');
                
            if(old_number_active != undefined){
                old_number_active.deleteClass('active');
            }

            indexes[idx].addClass('active');
        }
    }


    /**
     * Função interna da classe Carousel, verifica a flag opcional show_indexes
     * caso seja verdadeira activa o primeiro item do carrossel, caso não seja 
     * busca elementos html index para remover.
     * 
     * @example 
     *   this.block(); // bloqueia controles
     * 
     */
    hideOrActiveIndexes() {
        if(this.show_indexes) {
            this.indexes[0].addClass('active');
        }else{
            this.indexes.forEach((number) => {
                number.remove();
            });   
        }
    }

    /**
     * Função interna da classe Carousel, bloqueia os controles do carrossel
     * impede novo slider seja para direita ou para esquerda disabilitando
     * as setas
     * 
     * @example 
     *   this.block(); // bloqueia controles
     * 
     */
    block() {
        this.blocked = true;
        this.previous.classList.add('disable');
        this.next.classList.add('disable');
    }

    /**
     * Função interna da classe Carousel, desbloqueia os controles do carrossel
     * utilizada no termino de um evento de slide para retornar o evento de clique
     * das setas
     * 
     * @example 
     *   this.block(); // bloqueia controles
     * 
     */
    free() {
        this.blocked = false;
        this.previous.classList.remove('disable');
        this.next.classList.remove('disable');
    }
}

class CycleCarousel extends Carousel {
    constructor(carousel, options={ show_indexes : true, qtd_items : 1, animation_left : null, animation_right : null }) {
        super(carousel, options);
    }

    initialize() {
        if(this.last_item && !this.validate()) {
            this.ITEM_SIZE = Number(this.current_item.offsetWidth);
            // Realiza o bind dos eventos necessários para que o componente funcione
            this.bindAction();     
            this.hideOrActiveIndexes();
            window.onresize = () => { this.updateSizes() };
        }else{
            carousel.querySelector('.carousel__controllers').remove();
        }
    }

    slideTo(side) {
        if(this.blocked){
            return;
        }

        if(side == 'left'){
            this.slideToLeft();
            return; 
        }
        if(side == 'right'){
            this.slideToRight();
            return; 
        }
    }

    slideToRight() {
        this.block();
        var items = this.content.querySelectorAll('.carousel__content__item');
        items.forEach((item) => {
            item.css({ 'transition' : '0.4s all ease-in-out', 'transform' : 'translateX(' +  (-this.ITEM_SIZE * this.qtd_items) + 'px)' });
        });
        
        var _var = setTimeout(() =>{   
            for(var i = 0; i < this.qtd_items; i++) {   
                var first = this.current_item;
                first.remove();
                this.content.appendChild(first);
                this.current_item = this.content.querySelector('.carousel__content__item');          
            }
            items.forEach((item) => {
                item.clearStyle();
            });
            this.updateIndexes();
            this.free();
            clearTimeout(_var);
        }, 500);
    }

    slideToLeft() {
        this.block();
        var items = this.content.querySelectorAll('.carousel__content__item');
        for(var i = 0; i < this.qtd_items; i++){
            var temp = this.content.lastElementChild;
            this.content.lastElementChild.remove();
            this.content.prepend(temp);
            this.current_item = this.content.querySelector('.carousel__content__item');
        }
        
        items.forEach((item) => {
            item.css({ 'transform' : 'translateX(' +  (-this.ITEM_SIZE*this.qtd_items) + 'px)' });
        });
        setTimeout(() => {
            items.forEach((item) => {
                item.css({ 'transition' : '.4s all ease-in-out', 'transform' : 'translateX(0px)' });
            });
        }, 100);
                
        setTimeout(() => {
            this.updateIndexes();
            this.free();
            items.forEach((item) => {
                item.clearStyle();
            });
        }, 500);
    }

    autoSlide(time){
        this.interval = setInterval(() => {
            this.slideTo('right');
        }, time);

        addEventOneTime(this.carousel, 'mouseenter', () => {
            this.stopAutoSlide(time);
        });
    }

    stopAutoSlide(time){
        addEventOneTime(this.carousel, 'mouseleave', () => {
            this.autoSlide(time);
        });
        clearInterval(this.interval);
    }
}
class Message {
    constructor() { }

    addMessageForFieldText(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.field-text__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForFieldText(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.field-text__label');
            label.deleteClass('label-error');
            mesage_error.remove();
        }
    }

    addMessageForFieldTextarea(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.field-textarea__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForFieldTextarea(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.field-textarea__label');
            label.deleteClass('label-error');
            mesage_error.remove();
        }
    }

    addMessageForFieldCheckbox(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.field-checkbox__label');
            var input = this.field.querySelector('.field-checkbox__box');
            var message_caption = document.createElement('caption');
            label.addClass('hide');
            input.addClass('error');
            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForFieldCheckbox(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.field-checkbox__label');
            var input = this.field.querySelector('.field-checkbox__box');

            mesage_error.remove();
            label.deleteClass('hide');
            input.deleteClass('error');
        }
    }

    addMessageForFieldSelect(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.field-select__base__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForFieldSelect(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.field-select__base__label');

            mesage_error.remove();
            label.deleteClass('label-error');
        }
    }
}

class Field extends Message {
    constructor(html) {
        super();
        this.field = html;
    }

    hasText() {
        var input = this.field.querySelector('.field-text__input');
        if(input.value != ''){
            return true;
        }else{
            return false;
        }   
    }
    
    focusIn() {
        var input = this.field.querySelector('.field-text__input');
        input.addEventListener('focusin', () => {
            this.field.addClass('focus-within');
        });
    }

    focusOut() {
        var input = this.field.querySelector('.field-text__input');
        input.addEventListener('focusout', () => {
            if(!this.hasText()) {
                this.field.deleteClass('focus-within');
            }
        });
    }
}

class FieldText extends Field {
    constructor(html) {
        super(html)
        this.focusIn();
        this.focusOut();
    }

    addErrorMessage(message, rule) {
        this.addMessageForFieldText(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForFieldText(rule);
    }

    clear() {
        var input = this.field.querySelector('.field-text__input');
        input.value = "";
        this.field.deleteClass('focus-within');
    }
}


class FieldSelect extends Field {
    constructor(html) {
        super(html);
        this.hideItems();
        this.clickInItem();
        this.bindEvent('click');
    }

    addErrorMessage(message, rule) {
        this.addMessageForFieldSelect(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForFieldSelect(rule);
    }
    
    bindEvent(type) {
        this.field.addEventListener(type, () => {
            this.toggle();
        });         
    }

    clickInItem() {
        var options = this.field.querySelectorAll('.field-select__options__item');
        var label = this.field.querySelector('.field-select__base__label');
        var input = this.field.querySelector('.field-select__base__input');

        options.forEach((item) => {
            item.addEventListener('click', (evt) => {
                label.innerText = item.innerText;
                input.value = item.attr('value');
            });
        });
    } 

    hideItems() {
        var items = this.field.querySelectorAll('.field-select__options__item');   
        var options = this.field.querySelector('.field-select__options');
        options.css({ 'height' : '0' });  
        var count = 1;   
        items.forEach((item) => {
            item.css({ 'transform' : 'translateY(-' + (100 * count + 1) + '%)', 'position' : 'relative', 'z-index' : '-' + count});
            count++;
        });
    }

    toggle() {
        this.field.toggleClass('open');

        if(this.field.hasClass('open')) {
            this.anime_options_in();
        }else{
            this.anime_options_out();
        }
    }

    clear() {
        var label = this.field.querySelector('.field-select__base__label');
        var value_default = this.field.querySelector('.field-select__options__item[value="default"], .field-select__options__item[value=""]').innerText;
        var select = this.field.querySelector('.field-select__base__input');
        select.value = "";
        label.innerText = value_default;
    }

    anime_options_in() {
        var items = this.field.querySelectorAll('.field-select__options__item');
        var options = this.field.querySelector('.field-select__options');
        options.clearStyle();
        var count = 0;
        var anime = setInterval(() => {
            if(count < items.length){
                items[count].clearStyle();
                items[count].css({ 'position' : 'relative', 'z-index' : '-' + (count + 1)});                
            }else {
                clearInterval(anime);
            }
            count++;
        }, 200);
    }

    anime_options_out() {
        var items = this.field.querySelectorAll('.field-select__options__item');
        var count = items.length - 1;
        var anime = setInterval(() => {
            if(count >= 0){
                items[count].css({ 'transform' : 'translateY(-' + (100 * (count+1) + 1) + '%)' });  
            }else {
                var options = this.field.querySelector('.field-select__options');
                options.css({ 'height' : '0' });
                clearInterval(anime);
            }
            count--;
        }, 200);
    }
}

class FieldTextarea extends Field { 
    constructor(html) {
        super(html);
        this.field.addEventListener('focusin', () => {
            this.hideLabel();
            this.field.addClass('focus-within');
        });

        this.field.addEventListener('focusout', () => {
            if(!this.hasText()){
                this.showLabel();
                this.field.deleteClass('focus-within');
            }
        });
    }  

    addErrorMessage(message, rule) {
        this.addMessageForFieldTextarea(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForFieldTextarea(rule);
    }
    
    hideLabel() {
        var label = this.field.querySelector('.field-textarea__label');
        label.addClass('f-hide');
    }

    showLabel() {
        var label = this.field.querySelector('.field-textarea__label');
        label.deleteClass('f-hide');
    }

    hasText() {
        var textarea = this.field.querySelector('.field-textarea__input');
        if(textarea.value != ''){
            return true;
        }else{
            return false;
        }
    }

    clear() {
        var textarea = this.field.querySelector('.field-textarea__input');
        textarea.value = "";
        this.field.deleteClass('focus-within');
    }
}

class FieldCheckbox extends Field { 
    constructor(html) {
        super(html);
        this.field.addEventListener('click', () => {
            this.toggle();
        });
    }

    addErrorMessage(message, rule) {
        this.addMessageForFieldCheckbox(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForFieldCheckbox(rule);
    }
    
    toggle() {
        var checkbox = this.field.querySelector('.field-checkbox__input');
        var box = this.field.querySelector('.field-checkbox__box');
        if(this.isChecked()) {
            box.addClass('checked');
            checkbox.value = 'True';
        }else{
            box.deleteClass('checked');
            checkbox.value = 'False';
        }
    }
    
    isChecked() {
        var checkbox = this.field.querySelector('.field-checkbox__input');
        return checkbox.checked;
    }

    clear() {
        var checkbox = this.field.querySelector('.field-checkbox__input');
        var box = this.field.querySelector('.field-checkbox__box');
        checkbox.value = "";
        box.deleteClass('checked');
    }
}

class RipleEffect {
    constructor(html, event) {
        this.button = html;
        this.ink = html.querySelector('.ink');

        html.addEventListener(event, (evt) => {
            this.run(evt);
        });
    }

    run(evt) {
        this.ink.deleteClass('anime');
        var x = evt.pageX - this.button.offsetLeft - this.ink.offsetWidth / 2;
        var y = evt.pageY - this.button.offsetTop - this.ink.offsetHeight / 2;
        this.ink.css({
            top: y + 'px',
            left: x + 'px'
        });
        this.ink.addClass('anime');
    }

    off(evt) {
        var x = evt.pageX - this.button.offsetLeft - this.ink.offsetWidth / 2;
        var y = evt.pageY - this.button.offsetTop - this.ink.offsetHeight / 2;
        this.ink.css({
            top: y + 'px',
            left: x + 'px'
        });
        this.ink.deleteClass('anime');
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi1jYXJkLmpzIiwiY2Fyb3VzZWwuanMiLCJmaWVsZC5qcyIsInJpcHBsZS1lZmZlY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQWNjb3JkaW9uQ2FyZCB7XHJcbiAgICBjb25zdHJ1Y3RvcihodG1sKSB7IFxyXG4gICAgICAgIHRoaXMuc2VsZiA9IGh0bWw7XHJcbiAgICAgICAgdGhpcy5jb250ZW50ID0gaHRtbC5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uLWNhcmRfX2NvbnRlbnQnKTtcclxuICAgICAgICB0aGlzLmJ0bl9vcGVuID0gaHRtbC5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uLWNhcmRfX29wZW4nKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgdGhpcy5idG5fb3Blbi50b2dnbGVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gXHJcblxyXG4gICAgZ2V0Q29udGVudEhlaWdodCgpIHtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5jb250ZW50Lm9mZnNldEhlaWdodDtcclxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbnRlbnRIZWlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jb250ZW50Lmhhc0NsYXNzKCdvcGVuJykpe1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5nZXRDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZi5jc3MoeyAnaGVpZ2h0JyA6ICdjYWxjKDMxLjI1dncgKyAnICsgaGVpZ2h0ICsgJ3B4KScgfSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZi5jbGVhclN0eWxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiY2xhc3MgQ2Fyb3VzZWxPcHRpb25zIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICBpZihvcHRpb25zLmFuaW1hdGlvbl9sZWZ0KSB7IHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlLnNsaWRlVG9MZWZ0ID0gb3B0aW9ucy5hbmltYXRpb25fbGVmdDsgfVxyXG4gICAgICAgIGlmKG9wdGlvbnMuYW5pbWF0aW9uX3JpZ2h0KSB7IHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlLnNsaWRlVG9SaWdodCA9IG9wdGlvbnMuYW5pbWF0aW9uX3JpZ2h0OyB9XHJcbiAgICAgICAgdGhpcy5zaG93X2luZGV4ZXMgPSBvcHRpb25zLnNob3dfaW5kZXhlcyA/IG9wdGlvbnMuc2hvd19pbmRleGVzIDogbnVsbDtcclxuICAgICAgICB0aGlzLnNob3dfdGltZXIgPSBvcHRpb25zLnNob3dfdGltZXIgPyBvcHRpb25zLnNob3dfdGltZXIgOiBudWxsO1xyXG4gICAgICAgIHRoaXMucXRkX2l0ZW1zID0gb3B0aW9ucy5xdGRfaXRlbXMgPyBvcHRpb25zLnF0ZF9pdGVtcyA6IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKiBDbGFzcyByZXByZXNlbnRhIHVtIGNhcnJvc3NlbCBodG1sLiAqL1xyXG5jbGFzcyBDYXJvdXNlbCBleHRlbmRzIENhcm91c2VsT3B0aW9ucyB7XHJcbiAgICAvKipcclxuICAgICAqIENyaWEgdW1hIGluc3RhbmNpYSBkZSBjYXJyb3NzZWwuXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYXJvdXNlbCAtIE8gZWxlbWVudG8gaHRtbCBiYXNlIGRvIGNhcnJvc3NlbC5cclxuICAgICAqIEBwYXJhbSB7SlNPTn0gb3B0aW9ucyAtIEpTT04gY29tIG9ww6fDtWVzIHBhcmEgbyBjYXJyb3NzZWwsIHsgc2hvd19pbmRleGVzIDogQm9vbGVhbiwgcXRkX2l0ZW1zIDogTnVtYmVyLCBhbmltYXRpb25fbGVmdCA6IGZ1bmN0aW9uLCBhbmltYXRpb25fcmlnaHQgOiBmdW5jdGlvbiB9LlxyXG4gICAgICovIFxyXG4gICAgY29uc3RydWN0b3IoY2Fyb3VzZWwsIG9wdGlvbnM9eyBzaG93X2luZGV4ZXMgOiB0cnVlLCBxdGRfaXRlbXMgOiAxLCBhbmltYXRpb25fbGVmdCA6IG51bGwsIGFuaW1hdGlvbl9yaWdodCA6IG51bGwgfSl7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIGZsYWcgY29udHJvbGEgYmxvcXVlaW8gZW0gbWVpbyBhIGFuaW1hw6fDo29cclxuICAgICAgICB0aGlzLmJsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICAvLyBjb250ZcO6ZG9zIGh0bWwgZG8gY2Fycm9zc2VsXHJcbiAgICAgICAgdGhpcy5jYXJvdXNlbCA9IGNhcm91c2VsO1xyXG4gICAgICAgIHRoaXMuY29udGVudCA9IGNhcm91c2VsLnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbF9fY29udGVudCcpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9pdGVtID0gY2Fyb3VzZWwucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250ZW50X19pdGVtJyk7XHJcbiAgICAgICAgdGhpcy5maXJzdF9pdGVtID0gY2Fyb3VzZWwucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250ZW50X19pdGVtJyk7IFxyXG4gICAgICAgIHRoaXMubGFzdF9pdGVtID0gdGhpcy5jb250ZW50Lmxhc3RFbGVtZW50Q2hpbGQ7IFxyXG4gICAgICAgIC8vIGNvbnRyb2xsZXJzXHJcbiAgICAgICAgdGhpcy5wcmV2aW91cyA9IGNhcm91c2VsLnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbF9fY29udHJvbGxlcnNfX3ByZXZpb3VzJyk7XHJcbiAgICAgICAgdGhpcy5uZXh0ID0gY2Fyb3VzZWwucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250cm9sbGVyc19fbmV4dCcpO1xyXG4gICAgICAgIHRoaXMuaW5kZXhlcyA9IGNhcm91c2VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJvdXNlbF9fY29udHJvbGxlcnNfX2luZGV4Jyk7XHJcbiAgICAgICAgLy8gbWVkaWRhcyBkZSB0ZWxhLCBjYXJyb3NzZWwgZSBpdGVtXHJcbiAgICAgICAgdGhpcy5jb250ZW50X2RpbWVuc2lvbiA9IHRoaXMuY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB0aGlzLlNDUkVFX1NJWkUgPSBOdW1iZXIod2luZG93LmlubmVyV2lkdGgpOyBcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBpZih0aGlzLmxhc3RfaXRlbSAmJiAhdGhpcy52YWxpZGF0ZSgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuSVRFTV9TSVpFID0gTnVtYmVyKHRoaXMuY3VycmVudF9pdGVtLm9mZnNldFdpZHRoKTtcclxuICAgICAgICAgICAgLy8gUmVhbGl6YSBvIGJpbmQgZG9zIGV2ZW50b3MgbmVjZXNzw6FyaW9zIHBhcmEgcXVlIG8gY29tcG9uZW50ZSBmdW5jaW9uZVxyXG4gICAgICAgICAgICB0aGlzLmJpbmRBY3Rpb24oKTsgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmhpZGVPckFjdGl2ZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmlnaHRCdXR0b24oKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlTGVmdEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB7IHRoaXMudXBkYXRlU2l6ZXMoKSB9O1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmNhcm91c2VsLnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbF9fY29udHJvbGxlcnMnKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYmluZEFjdGlvbigpIHtcclxuICAgICAgICB0aGlzLmNhcm91c2VsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZXZ0KSA9PiB7ICB0aGlzLnRvdWNoU3RhcnQoZXZ0KSB9KTsgXHJcbiAgICAgICAgdGhpcy5jYXJvdXNlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCAoZXZ0KSA9PiB7ICB0aGlzLnRvdWNoTW92ZShldnQpIH0pOyBcclxuICAgICAgICB0aGlzLmNhcm91c2VsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGV2dCkgPT4geyAgdGhpcy50b3VjaEVuZChldnQpIH0pOyBcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4geyB0aGlzLnNsaWRlVG8oJ3JpZ2h0JykgfSk7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91cy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHsgdGhpcy5zbGlkZVRvKCdsZWZ0JykgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGUoKSB7XHJcbiAgICAgICAgdmFyIHNjcmVlbl93aWR0aCA9IE51bWJlcih3aW5kb3cuaW5uZXJXaWR0aCk7IFxyXG4gICAgICAgIHZhciBlbmRfc2xpZGVyX2NvbnRlbnQgPSBOdW1iZXIodGhpcy5jb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0KTtcclxuICAgICAgICB2YXIgZW5kX2xhc3RfaXRlbSA9IHRoaXMuY29udGVudC5sYXN0RWxlbWVudENoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0O1xyXG5cclxuICAgICAgICBpZihlbmRfbGFzdF9pdGVtID4gc2NyZWVuX3dpZHRoIHx8IGVuZF9sYXN0X2l0ZW0gPiBlbmRfc2xpZGVyX2NvbnRlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2xpZGVUbyhzaWRlKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3NsaWRlIHRvJywgc2lkZSk7XHJcbiAgICAgICAgaWYodGhpcy5ibG9ja2VkKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoc2lkZSA9PSAnbGVmdCcgJiYgdGhpcy5jdXJyZW50X2l0ZW0gIT0gdGhpcy5maXJzdF9pdGVtKXtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZVRvTGVmdCgpO1xyXG4gICAgICAgICAgICByZXR1cm47IFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzaWRlID09ICdyaWdodCcgJiYgdGhpcy5jdXJyZW50X2l0ZW0gIT0gdGhpcy5sYXN0X2l0ZW0pe1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlVG9SaWdodCgpO1xyXG4gICAgICAgICAgICByZXR1cm47IFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnKyB0aGlzLnRyYW5zbGF0ZSArJ3B4KSc7XHJcbiAgICB9XHJcblxyXG4gICAgc2xpZGVUb1JpZ2h0KCkge1xyXG4gICAgICAgIHRoaXMuYmxvY2soKTtcclxuXHJcbiAgICAgICAgLy8gbW92aW1lbnRvIGxhdGVyYWxtZW50ZSBwYXJhIGEgZXNxdWVyZGEgb3MgaXRlbnMgZG8gY2Fycm9zc2VsXHJcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJvdXNlbF9fY29udGVudF9faXRlbScpO1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5jc3MoeyAndHJhbnNpdGlvbicgOiAnMC40cyBhbGwgZWFzZS1pbi1vdXQnLCAndHJhbnNmb3JtJyA6ICd0cmFuc2xhdGVYKCcgKyAgKC10aGlzLklURU1fU0laRSAqIHRoaXMucXRkX2l0ZW1zKSArICdweCknIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gcmVvcmdhbml6YSBhIGxpc3RhIG1vdmltZW50byBvcyBpdGVucyBkZSBwb3Npw6fDo28gaWd1YWwgYSBxdWFudGlkYWRlIGRlIHZlemVzIHBhc3NhIG5vIG9wdGlvbnMgKGRlZmF1bHQgMSlcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMucXRkX2l0ZW1zOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50X2l0ZW0gIT0gdGhpcy5sYXN0X2l0ZW0pe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gdGhpcy5jdXJyZW50X2l0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50X2l0ZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50X2l0ZW0gPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250ZW50X19pdGVtJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRlbXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmZyZWUoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmlnaHRCdXR0b24oKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlTGVmdEJ1dHRvbigpO1xyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNsZWFyU3R5bGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgNTAwKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHNsaWRlVG9MZWZ0KCkge1xyXG4gICAgICAgIHRoaXMuYmxvY2soKTtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcm91c2VsX19jb250ZW50X19pdGVtJyk7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMucXRkX2l0ZW1zOyBpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRfaXRlbSAhPSB0aGlzLmZpcnN0X2l0ZW0pe1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSB0aGlzLmNvbnRlbnQubGFzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnByZXBlbmQodGVtcCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRfaXRlbSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWxfX2NvbnRlbnRfX2l0ZW0nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uY3NzKHsgJ3RyYW5zZm9ybScgOiAndHJhbnNsYXRlWCgnICsgICgtdGhpcy5JVEVNX1NJWkUqdGhpcy5xdGRfaXRlbXMpICsgJ3B4KScgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY3NzKHsgJ3RyYW5zaXRpb24nIDogJy40cyBhbGwgZWFzZS1pbi1vdXQnLCAndHJhbnNmb3JtJyA6ICd0cmFuc2xhdGVYKDBweCknIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmZyZWUoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmlnaHRCdXR0b24oKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlTGVmdEJ1dHRvbigpO1xyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNsZWFyU3R5bGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNhYmxlTGVmdEJ1dHRvbigpIHtcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRfaXRlbSA9PSB0aGlzLmZpcnN0X2l0ZW0pe1xyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUnKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91cy5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRpc2FibGVSaWdodEJ1dHRvbigpIHtcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRfaXRlbSA9PSB0aGlzLmxhc3RfaXRlbSl7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvdWNoU3RhcnQoZXZ0KXtcclxuICAgICAgICBpZihldnQudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcygnY2Fyb3VzZWxfX2NvbnRyb2xsZXJzX19wcmV2aW91cycpIHx8IGV2dC50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKCdjYXJvdXNlbF9fY29udHJvbGxlcnNfX25leHQnKSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbml0aWFsID0gIE51bWJlcihldnQudG91Y2hlc1swXS5jbGllbnRYKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnSW5pY2lhbmRvIGV2ZW50byBkcmFnIC0gJyArIHRoaXMuaW5pdGlhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG91Y2hNb3ZlKGV2dCl7XHJcbiAgICAgICAgaWYoZXZ0LnRhcmdldC5jbGFzc05hbWUuaW5jbHVkZXMoJ2Nhcm91c2VsX19jb250cm9sbGVyc19fcHJldmlvdXMnKSB8fCBldnQudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcygnY2Fyb3VzZWxfX2NvbnRyb2xsZXJzX19uZXh0Jykpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudG91Y2ggPSBOdW1iZXIoZXZ0LnRvdWNoZXNbMF0uY2xpZW50WCkgLSB0aGlzLmluaXRpYWw7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJNb3ZlIDogXCIgKyB0aGlzLnRvdWNoKTtcclxuICAgICAgICB2YXIgcG9zWCA9IHRoaXMudHJhbnNsYXRlICsgdGhpcy50b3VjaDtcclxuICAgICAgICAvL2luZGljYSBhIGludGXDp8OjbyBkZSBzY3JvbGxhciBvIGl0ZW0gZG8gY2Fycm9zc2VsXHJcbiAgICAgICAgdmFyIGl3YW5uYSA9IHRoaXMuU0NSRUVfU0laRSAvIDg7IFxyXG4gICAgICAgIGlmKHBvc1ggPiBpd2FubmEgfHwgcG9zWCA8IC1pd2FubmEpXHJcbiAgICAgICAgICAgICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmZpbmQoJy5zbGlkZXInKS5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJysgcG9zWCArJ3B4KScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvdWNoRW5kKGV2dCl7XHJcbiAgICAgICAgaWYoZXZ0LnRhcmdldC5jbGFzc05hbWUuaW5jbHVkZXMoJ2Nhcm91c2VsX19jb250cm9sbGVyc19fcHJldmlvdXMnKSB8fCBldnQudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcygnY2Fyb3VzZWxfX2NvbnRyb2xsZXJzX19uZXh0Jykpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGV2dC50YXJnZXQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdGaW0gZG8gZXZlbnRvIGRyYWcsIGRlY2lkaXIgbyBxdWUgZmF6ZXIuJyk7XHJcbiAgICAgICAgdmFyIHJpZ2h0ID0gKHRoaXMuU0NSRUVfU0laRSAvIDUpO1xyXG4gICAgICAgIHZhciBsZWZ0ID0gLSh0aGlzLlNDUkVFX1NJWkUgLyA1KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy50b3VjaCA+IHJpZ2h0IHx8IGV2dC50YXJnZXQuY2xhc3NOYW1lID09ICdsZWZ0LWFycm93Jyl7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVUbygnbGVmdCcpO1xyXG4gICAgICAgICAgICByZXR1cm47ICBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy50b3VjaCA8IGxlZnQgfHwgZXZ0LnRhcmdldC5jbGFzc05hbWUgPT0gJ3JpZ2h0LWFycm93Jyl7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVUbygncmlnaHQnKTtcclxuICAgICAgICAgICAgcmV0dXJuOyAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh0aGlzLnNsaWRlcikuY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrIHRoaXMudHJhbnNsYXRlICsncHgpJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2l6ZXMoKXtcclxuICAgICAgICB0aGlzLlNMSURFUl9XSURUSCA9IE51bWJlcih0aGlzLmNvbnRlbnQub2Zmc2V0V2lkdGgpO1xyXG4gICAgICAgIHRoaXMuU0NSRUVfU0laRSA9IE51bWJlcih3aW5kb3cuaW5uZXJXaWR0aCk7IFxyXG4gICAgICAgIHRoaXMuSVRFTV9TSVpFID0gTnVtYmVyKHRoaXMuY3VycmVudF9pdGVtLm9mZnNldFdpZHRoKTsgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuw6fDo28gaW50ZXJuYSBkYSBjbGFzc2UgQ2Fyb3VzZWwsIGF0dWFsaXphIG9zIGluZGV4ZXMgZG8gY2Fycm9zc2VsXHJcbiAgICAgKiBhcMOzcyB1bWEgcGFzc2FnZW0gZGUgc2xpZGVcclxuICAgICAqIFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqICAgdmFyIGNhcm91c2VsID0gbmV3IENhcm91c2VsKGh0bWwpOyAvLyBpbnN0YW5jaWFuZG8gb2JqZXRvIGNhcnJvc3NlbFxyXG4gICAgICogICBjYXJvdXNlbC5ibG9jaygpOyAvLyBibG9xdWVpYSBjb250cm9sZXNcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVJbmRleGVzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuc2hvd19pbmRleGVzKSB7XHJcbiAgICAgICAgICAgIHZhciBvbGRfbnVtYmVyX2FjdGl2ZSA9IHRoaXMuY2Fyb3VzZWwucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250cm9sbGVyc19faW5kZXguYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleGVzID0gdGhpcy5jYXJvdXNlbC5xdWVyeVNlbGVjdG9yQWxsKCcuY2Fyb3VzZWxfX2NvbnRyb2xsZXJzX19pbmRleCcpO1xyXG4gICAgICAgICAgICB2YXIgaWR4ID0gdGhpcy5jdXJyZW50X2l0ZW0uYXR0cignY2Fyb3VzZWwtaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihvbGRfbnVtYmVyX2FjdGl2ZSAhPSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgb2xkX251bWJlcl9hY3RpdmUuZGVsZXRlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbmRleGVzW2lkeF0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW7Dp8OjbyBpbnRlcm5hIGRhIGNsYXNzZSBDYXJvdXNlbCwgdmVyaWZpY2EgYSBmbGFnIG9wY2lvbmFsIHNob3dfaW5kZXhlc1xyXG4gICAgICogY2FzbyBzZWphIHZlcmRhZGVpcmEgYWN0aXZhIG8gcHJpbWVpcm8gaXRlbSBkbyBjYXJyb3NzZWwsIGNhc28gbsOjbyBzZWphIFxyXG4gICAgICogYnVzY2EgZWxlbWVudG9zIGh0bWwgaW5kZXggcGFyYSByZW1vdmVyLlxyXG4gICAgICogXHJcbiAgICAgKiBAZXhhbXBsZSBcclxuICAgICAqICAgdGhpcy5ibG9jaygpOyAvLyBibG9xdWVpYSBjb250cm9sZXNcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBoaWRlT3JBY3RpdmVJbmRleGVzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuc2hvd19pbmRleGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhlc1swXS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhlcy5mb3JFYWNoKChudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIG51bWJlci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7ICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuw6fDo28gaW50ZXJuYSBkYSBjbGFzc2UgQ2Fyb3VzZWwsIGJsb3F1ZWlhIG9zIGNvbnRyb2xlcyBkbyBjYXJyb3NzZWxcclxuICAgICAqIGltcGVkZSBub3ZvIHNsaWRlciBzZWphIHBhcmEgZGlyZWl0YSBvdSBwYXJhIGVzcXVlcmRhIGRpc2FiaWxpdGFuZG9cclxuICAgICAqIGFzIHNldGFzXHJcbiAgICAgKiBcclxuICAgICAqIEBleGFtcGxlIFxyXG4gICAgICogICB0aGlzLmJsb2NrKCk7IC8vIGJsb3F1ZWlhIGNvbnRyb2xlc1xyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGJsb2NrKCkge1xyXG4gICAgICAgIHRoaXMuYmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91cy5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgdGhpcy5uZXh0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bsOnw6NvIGludGVybmEgZGEgY2xhc3NlIENhcm91c2VsLCBkZXNibG9xdWVpYSBvcyBjb250cm9sZXMgZG8gY2Fycm9zc2VsXHJcbiAgICAgKiB1dGlsaXphZGEgbm8gdGVybWlubyBkZSB1bSBldmVudG8gZGUgc2xpZGUgcGFyYSByZXRvcm5hciBvIGV2ZW50byBkZSBjbGlxdWVcclxuICAgICAqIGRhcyBzZXRhc1xyXG4gICAgICogXHJcbiAgICAgKiBAZXhhbXBsZSBcclxuICAgICAqICAgdGhpcy5ibG9jaygpOyAvLyBibG9xdWVpYSBjb250cm9sZXNcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBmcmVlKCkge1xyXG4gICAgICAgIHRoaXMuYmxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXMuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZScpO1xyXG4gICAgICAgIHRoaXMubmV4dC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEN5Y2xlQ2Fyb3VzZWwgZXh0ZW5kcyBDYXJvdXNlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYXJvdXNlbCwgb3B0aW9ucz17IHNob3dfaW5kZXhlcyA6IHRydWUsIHF0ZF9pdGVtcyA6IDEsIGFuaW1hdGlvbl9sZWZ0IDogbnVsbCwgYW5pbWF0aW9uX3JpZ2h0IDogbnVsbCB9KSB7XHJcbiAgICAgICAgc3VwZXIoY2Fyb3VzZWwsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5sYXN0X2l0ZW0gJiYgIXRoaXMudmFsaWRhdGUoKSkge1xyXG4gICAgICAgICAgICB0aGlzLklURU1fU0laRSA9IE51bWJlcih0aGlzLmN1cnJlbnRfaXRlbS5vZmZzZXRXaWR0aCk7XHJcbiAgICAgICAgICAgIC8vIFJlYWxpemEgbyBiaW5kIGRvcyBldmVudG9zIG5lY2Vzc8OhcmlvcyBwYXJhIHF1ZSBvIGNvbXBvbmVudGUgZnVuY2lvbmVcclxuICAgICAgICAgICAgdGhpcy5iaW5kQWN0aW9uKCk7ICAgICBcclxuICAgICAgICAgICAgdGhpcy5oaWRlT3JBY3RpdmVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHsgdGhpcy51cGRhdGVTaXplcygpIH07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNhcm91c2VsLnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbF9fY29udHJvbGxlcnMnKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2xpZGVUbyhzaWRlKSB7XHJcbiAgICAgICAgaWYodGhpcy5ibG9ja2VkKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoc2lkZSA9PSAnbGVmdCcpe1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlVG9MZWZ0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNpZGUgPT0gJ3JpZ2h0Jyl7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVUb1JpZ2h0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNsaWRlVG9SaWdodCgpIHtcclxuICAgICAgICB0aGlzLmJsb2NrKCk7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJvdXNlbF9fY29udGVudF9faXRlbScpO1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5jc3MoeyAndHJhbnNpdGlvbicgOiAnMC40cyBhbGwgZWFzZS1pbi1vdXQnLCAndHJhbnNmb3JtJyA6ICd0cmFuc2xhdGVYKCcgKyAgKC10aGlzLklURU1fU0laRSAqIHRoaXMucXRkX2l0ZW1zKSArICdweCknIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBfdmFyID0gc2V0VGltZW91dCgoKSA9PnsgICBcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMucXRkX2l0ZW1zOyBpKyspIHsgICBcclxuICAgICAgICAgICAgICAgIHZhciBmaXJzdCA9IHRoaXMuY3VycmVudF9pdGVtO1xyXG4gICAgICAgICAgICAgICAgZmlyc3QucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZmlyc3QpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50X2l0ZW0gPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250ZW50X19pdGVtJyk7ICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2xlYXJTdHlsZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZnJlZSgpO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoX3Zhcik7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBzbGlkZVRvTGVmdCgpIHtcclxuICAgICAgICB0aGlzLmJsb2NrKCk7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJvdXNlbF9fY29udGVudF9faXRlbScpO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnF0ZF9pdGVtczsgaSsrKXtcclxuICAgICAgICAgICAgdmFyIHRlbXAgPSB0aGlzLmNvbnRlbnQubGFzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50Lmxhc3RFbGVtZW50Q2hpbGQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5wcmVwZW5kKHRlbXApO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfaXRlbSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWxfX2NvbnRlbnRfX2l0ZW0nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmNzcyh7ICd0cmFuc2Zvcm0nIDogJ3RyYW5zbGF0ZVgoJyArICAoLXRoaXMuSVRFTV9TSVpFKnRoaXMucXRkX2l0ZW1zKSArICdweCknIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNzcyh7ICd0cmFuc2l0aW9uJyA6ICcuNHMgYWxsIGVhc2UtaW4tb3V0JywgJ3RyYW5zZm9ybScgOiAndHJhbnNsYXRlWCgwcHgpJyB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5mcmVlKCk7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2xlYXJTdHlsZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfVxyXG5cclxuICAgIGF1dG9TbGlkZSh0aW1lKXtcclxuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlVG8oJ3JpZ2h0Jyk7XHJcbiAgICAgICAgfSwgdGltZSk7XHJcblxyXG4gICAgICAgIGFkZEV2ZW50T25lVGltZSh0aGlzLmNhcm91c2VsLCAnbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wQXV0b1NsaWRlKHRpbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3BBdXRvU2xpZGUodGltZSl7XHJcbiAgICAgICAgYWRkRXZlbnRPbmVUaW1lKHRoaXMuY2Fyb3VzZWwsICdtb3VzZWxlYXZlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9TbGlkZSh0aW1lKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgfVxyXG59IiwiY2xhc3MgTWVzc2FnZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICAgIGFkZE1lc3NhZ2VGb3JGaWVsZFRleHQobWVzc2FnZSwgcnVsZSkge1xyXG4gICAgICAgIGlmKCF0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5tc2ctZXJyb3InKSl7XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmZpZWxkLXRleHRfX2xhYmVsJyk7XHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlX2NhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYXB0aW9uJyk7XHJcbiAgICAgICAgICAgIGxhYmVsLmFkZENsYXNzKCdsYWJlbC1lcnJvcicpO1xyXG5cclxuICAgICAgICAgICAgbWVzc2FnZV9jYXB0aW9uLmNsYXNzTmFtZSA9IFwibXNnLWVycm9yIFwiICsgcnVsZTtcclxuICAgICAgICAgICAgbWVzc2FnZV9jYXB0aW9uLmlubmVyVGV4dCA9IG1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFwcGVuZENoaWxkKG1lc3NhZ2VfY2FwdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU1lc3NhZ2VGb3JGaWVsZFRleHQocnVsZSkge1xyXG4gICAgICAgIHZhciBtZXNhZ2VfZXJyb3IgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5tc2ctZXJyb3InKTtcclxuICAgICAgICBpZihtZXNhZ2VfZXJyb3Ipe1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC10ZXh0X19sYWJlbCcpO1xyXG4gICAgICAgICAgICBsYWJlbC5kZWxldGVDbGFzcygnbGFiZWwtZXJyb3InKTtcclxuICAgICAgICAgICAgbWVzYWdlX2Vycm9yLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGRNZXNzYWdlRm9yRmllbGRUZXh0YXJlYShtZXNzYWdlLCBydWxlKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLm1zZy1lcnJvcicpKXtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtdGV4dGFyZWFfX2xhYmVsJyk7XHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlX2NhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYXB0aW9uJyk7XHJcbiAgICAgICAgICAgIGxhYmVsLmFkZENsYXNzKCdsYWJlbC1lcnJvcicpO1xyXG5cclxuICAgICAgICAgICAgbWVzc2FnZV9jYXB0aW9uLmNsYXNzTmFtZSA9IFwibXNnLWVycm9yIFwiICsgcnVsZTtcclxuICAgICAgICAgICAgbWVzc2FnZV9jYXB0aW9uLmlubmVyVGV4dCA9IG1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFwcGVuZENoaWxkKG1lc3NhZ2VfY2FwdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU1lc3NhZ2VGb3JGaWVsZFRleHRhcmVhKHJ1bGUpIHtcclxuICAgICAgICB2YXIgbWVzYWdlX2Vycm9yID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcubXNnLWVycm9yJyk7XHJcbiAgICAgICAgaWYobWVzYWdlX2Vycm9yKXtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtdGV4dGFyZWFfX2xhYmVsJyk7XHJcbiAgICAgICAgICAgIGxhYmVsLmRlbGV0ZUNsYXNzKCdsYWJlbC1lcnJvcicpO1xyXG4gICAgICAgICAgICBtZXNhZ2VfZXJyb3IucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZE1lc3NhZ2VGb3JGaWVsZENoZWNrYm94KG1lc3NhZ2UsIHJ1bGUpIHtcclxuICAgICAgICBpZighdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcubXNnLWVycm9yJykpe1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC1jaGVja2JveF9fbGFiZWwnKTtcclxuICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtY2hlY2tib3hfX2JveCcpO1xyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZV9jYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FwdGlvbicpO1xyXG4gICAgICAgICAgICBsYWJlbC5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICBpbnB1dC5hZGRDbGFzcygnZXJyb3InKTtcclxuICAgICAgICAgICAgbWVzc2FnZV9jYXB0aW9uLmNsYXNzTmFtZSA9IFwibXNnLWVycm9yIFwiICsgcnVsZTtcclxuICAgICAgICAgICAgbWVzc2FnZV9jYXB0aW9uLmlubmVyVGV4dCA9IG1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFwcGVuZENoaWxkKG1lc3NhZ2VfY2FwdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU1lc3NhZ2VGb3JGaWVsZENoZWNrYm94KHJ1bGUpIHtcclxuICAgICAgICB2YXIgbWVzYWdlX2Vycm9yID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcubXNnLWVycm9yJyk7XHJcbiAgICAgICAgaWYobWVzYWdlX2Vycm9yKXtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtY2hlY2tib3hfX2xhYmVsJyk7XHJcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmZpZWxkLWNoZWNrYm94X19ib3gnKTtcclxuXHJcbiAgICAgICAgICAgIG1lc2FnZV9lcnJvci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgbGFiZWwuZGVsZXRlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgaW5wdXQuZGVsZXRlQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZE1lc3NhZ2VGb3JGaWVsZFNlbGVjdChtZXNzYWdlLCBydWxlKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLm1zZy1lcnJvcicpKXtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtc2VsZWN0X19iYXNlX19sYWJlbCcpO1xyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZV9jYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FwdGlvbicpO1xyXG4gICAgICAgICAgICBsYWJlbC5hZGRDbGFzcygnbGFiZWwtZXJyb3InKTtcclxuXHJcbiAgICAgICAgICAgIG1lc3NhZ2VfY2FwdGlvbi5jbGFzc05hbWUgPSBcIm1zZy1lcnJvciBcIiArIHJ1bGU7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VfY2FwdGlvbi5pbm5lclRleHQgPSBtZXNzYWdlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5maWVsZC5hcHBlbmRDaGlsZChtZXNzYWdlX2NhcHRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVNZXNzYWdlRm9yRmllbGRTZWxlY3QocnVsZSkge1xyXG4gICAgICAgIHZhciBtZXNhZ2VfZXJyb3IgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5tc2ctZXJyb3InKTtcclxuICAgICAgICBpZihtZXNhZ2VfZXJyb3Ipe1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC1zZWxlY3RfX2Jhc2VfX2xhYmVsJyk7XHJcblxyXG4gICAgICAgICAgICBtZXNhZ2VfZXJyb3IucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGxhYmVsLmRlbGV0ZUNsYXNzKCdsYWJlbC1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRmllbGQgZXh0ZW5kcyBNZXNzYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKGh0bWwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc1RleHQoKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtdGV4dF9faW5wdXQnKTtcclxuICAgICAgICBpZihpbnB1dC52YWx1ZSAhPSAnJyl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmb2N1c0luKCkge1xyXG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmZpZWxkLXRleHRfX2lucHV0Jyk7XHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRDbGFzcygnZm9jdXMtd2l0aGluJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9jdXNPdXQoKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtdGV4dF9faW5wdXQnKTtcclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYoIXRoaXMuaGFzVGV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkLmRlbGV0ZUNsYXNzKCdmb2N1cy13aXRoaW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBGaWVsZFRleHQgZXh0ZW5kcyBGaWVsZCB7XHJcbiAgICBjb25zdHJ1Y3RvcihodG1sKSB7XHJcbiAgICAgICAgc3VwZXIoaHRtbClcclxuICAgICAgICB0aGlzLmZvY3VzSW4oKTtcclxuICAgICAgICB0aGlzLmZvY3VzT3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRXJyb3JNZXNzYWdlKG1lc3NhZ2UsIHJ1bGUpIHtcclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VGb3JGaWVsZFRleHQobWVzc2FnZSwgcnVsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRXJyb3JNZXNzYWdlKHJ1bGUpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZU1lc3NhZ2VGb3JGaWVsZFRleHQocnVsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtdGV4dF9faW5wdXQnKTtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5maWVsZC5kZWxldGVDbGFzcygnZm9jdXMtd2l0aGluJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jbGFzcyBGaWVsZFNlbGVjdCBleHRlbmRzIEZpZWxkIHtcclxuICAgIGNvbnN0cnVjdG9yKGh0bWwpIHtcclxuICAgICAgICBzdXBlcihodG1sKTtcclxuICAgICAgICB0aGlzLmhpZGVJdGVtcygpO1xyXG4gICAgICAgIHRoaXMuY2xpY2tJbkl0ZW0oKTtcclxuICAgICAgICB0aGlzLmJpbmRFdmVudCgnY2xpY2snKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UobWVzc2FnZSwgcnVsZSkge1xyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUZvckZpZWxkU2VsZWN0KG1lc3NhZ2UsIHJ1bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUVycm9yTWVzc2FnZShydWxlKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVNZXNzYWdlRm9yRmllbGRTZWxlY3QocnVsZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGJpbmRFdmVudCh0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5maWVsZC5hZGRFdmVudExpc3RlbmVyKHR5cGUsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgICAgICB9KTsgICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBjbGlja0luSXRlbSgpIHtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvckFsbCgnLmZpZWxkLXNlbGVjdF9fb3B0aW9uc19faXRlbScpO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmZpZWxkLXNlbGVjdF9fYmFzZV9fbGFiZWwnKTtcclxuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC1zZWxlY3RfX2Jhc2VfX2lucHV0Jyk7XHJcblxyXG4gICAgICAgIG9wdGlvbnMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gaXRlbS5pbm5lclRleHQ7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IGl0ZW0uYXR0cigndmFsdWUnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IFxyXG5cclxuICAgIGhpZGVJdGVtcygpIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWVsZC1zZWxlY3RfX29wdGlvbnNfX2l0ZW0nKTsgICBcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmZpZWxkLXNlbGVjdF9fb3B0aW9ucycpO1xyXG4gICAgICAgIG9wdGlvbnMuY3NzKHsgJ2hlaWdodCcgOiAnMCcgfSk7ICBcclxuICAgICAgICB2YXIgY291bnQgPSAxOyAgIFxyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5jc3MoeyAndHJhbnNmb3JtJyA6ICd0cmFuc2xhdGVZKC0nICsgKDEwMCAqIGNvdW50ICsgMSkgKyAnJSknLCAncG9zaXRpb24nIDogJ3JlbGF0aXZlJywgJ3otaW5kZXgnIDogJy0nICsgY291bnR9KTtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGUoKSB7XHJcbiAgICAgICAgdGhpcy5maWVsZC50b2dnbGVDbGFzcygnb3BlbicpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmZpZWxkLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltZV9vcHRpb25zX2luKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWVfb3B0aW9uc19vdXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtc2VsZWN0X19iYXNlX19sYWJlbCcpO1xyXG4gICAgICAgIHZhciB2YWx1ZV9kZWZhdWx0ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtc2VsZWN0X19vcHRpb25zX19pdGVtW3ZhbHVlPVwiZGVmYXVsdFwiXSwgLmZpZWxkLXNlbGVjdF9fb3B0aW9uc19faXRlbVt2YWx1ZT1cIlwiXScpLmlubmVyVGV4dDtcclxuICAgICAgICB2YXIgc2VsZWN0ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtc2VsZWN0X19iYXNlX19pbnB1dCcpO1xyXG4gICAgICAgIHNlbGVjdC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gdmFsdWVfZGVmYXVsdDtcclxuICAgIH1cclxuXHJcbiAgICBhbmltZV9vcHRpb25zX2luKCkge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvckFsbCgnLmZpZWxkLXNlbGVjdF9fb3B0aW9uc19faXRlbScpO1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtc2VsZWN0X19vcHRpb25zJyk7XHJcbiAgICAgICAgb3B0aW9ucy5jbGVhclN0eWxlKCk7XHJcbiAgICAgICAgdmFyIGNvdW50ID0gMDtcclxuICAgICAgICB2YXIgYW5pbWUgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGNvdW50IDwgaXRlbXMubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2NvdW50XS5jbGVhclN0eWxlKCk7XHJcbiAgICAgICAgICAgICAgICBpdGVtc1tjb3VudF0uY3NzKHsgJ3Bvc2l0aW9uJyA6ICdyZWxhdGl2ZScsICd6LWluZGV4JyA6ICctJyArIChjb3VudCArIDEpfSk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGFuaW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH0sIDIwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgYW5pbWVfb3B0aW9uc19vdXQoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yQWxsKCcuZmllbGQtc2VsZWN0X19vcHRpb25zX19pdGVtJyk7XHJcbiAgICAgICAgdmFyIGNvdW50ID0gaXRlbXMubGVuZ3RoIC0gMTtcclxuICAgICAgICB2YXIgYW5pbWUgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGNvdW50ID49IDApe1xyXG4gICAgICAgICAgICAgICAgaXRlbXNbY291bnRdLmNzcyh7ICd0cmFuc2Zvcm0nIDogJ3RyYW5zbGF0ZVkoLScgKyAoMTAwICogKGNvdW50KzEpICsgMSkgKyAnJSknIH0pOyAgXHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtc2VsZWN0X19vcHRpb25zJyk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNzcyh7ICdoZWlnaHQnIDogJzAnIH0pO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChhbmltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY291bnQtLTtcclxuICAgICAgICB9LCAyMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBGaWVsZFRleHRhcmVhIGV4dGVuZHMgRmllbGQgeyBcclxuICAgIGNvbnN0cnVjdG9yKGh0bWwpIHtcclxuICAgICAgICBzdXBlcihodG1sKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZUxhYmVsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYWRkQ2xhc3MoJ2ZvY3VzLXdpdGhpbicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5oYXNUZXh0KCkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TGFiZWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuZGVsZXRlQ2xhc3MoJ2ZvY3VzLXdpdGhpbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9ICBcclxuXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UobWVzc2FnZSwgcnVsZSkge1xyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUZvckZpZWxkVGV4dGFyZWEobWVzc2FnZSwgcnVsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRXJyb3JNZXNzYWdlKHJ1bGUpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZU1lc3NhZ2VGb3JGaWVsZFRleHRhcmVhKHJ1bGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBoaWRlTGFiZWwoKSB7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtdGV4dGFyZWFfX2xhYmVsJyk7XHJcbiAgICAgICAgbGFiZWwuYWRkQ2xhc3MoJ2YtaGlkZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dMYWJlbCgpIHtcclxuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC10ZXh0YXJlYV9fbGFiZWwnKTtcclxuICAgICAgICBsYWJlbC5kZWxldGVDbGFzcygnZi1oaWRlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzVGV4dCgpIHtcclxuICAgICAgICB2YXIgdGV4dGFyZWEgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC10ZXh0YXJlYV9faW5wdXQnKTtcclxuICAgICAgICBpZih0ZXh0YXJlYS52YWx1ZSAhPSAnJyl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHZhciB0ZXh0YXJlYSA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmZpZWxkLXRleHRhcmVhX19pbnB1dCcpO1xyXG4gICAgICAgIHRleHRhcmVhLnZhbHVlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmZpZWxkLmRlbGV0ZUNsYXNzKCdmb2N1cy13aXRoaW4nKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRmllbGRDaGVja2JveCBleHRlbmRzIEZpZWxkIHsgXHJcbiAgICBjb25zdHJ1Y3RvcihodG1sKSB7XHJcbiAgICAgICAgc3VwZXIoaHRtbCk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UobWVzc2FnZSwgcnVsZSkge1xyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUZvckZpZWxkQ2hlY2tib3gobWVzc2FnZSwgcnVsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRXJyb3JNZXNzYWdlKHJ1bGUpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZU1lc3NhZ2VGb3JGaWVsZENoZWNrYm94KHJ1bGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0b2dnbGUoKSB7XHJcbiAgICAgICAgdmFyIGNoZWNrYm94ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtY2hlY2tib3hfX2lucHV0Jyk7XHJcbiAgICAgICAgdmFyIGJveCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmZpZWxkLWNoZWNrYm94X19ib3gnKTtcclxuICAgICAgICBpZih0aGlzLmlzQ2hlY2tlZCgpKSB7XHJcbiAgICAgICAgICAgIGJveC5hZGRDbGFzcygnY2hlY2tlZCcpO1xyXG4gICAgICAgICAgICBjaGVja2JveC52YWx1ZSA9ICdUcnVlJztcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgYm94LmRlbGV0ZUNsYXNzKCdjaGVja2VkJyk7XHJcbiAgICAgICAgICAgIGNoZWNrYm94LnZhbHVlID0gJ0ZhbHNlJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlzQ2hlY2tlZCgpIHtcclxuICAgICAgICB2YXIgY2hlY2tib3ggPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC1jaGVja2JveF9faW5wdXQnKTtcclxuICAgICAgICByZXR1cm4gY2hlY2tib3guY2hlY2tlZDtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB2YXIgY2hlY2tib3ggPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC1jaGVja2JveF9faW5wdXQnKTtcclxuICAgICAgICB2YXIgYm94ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtY2hlY2tib3hfX2JveCcpO1xyXG4gICAgICAgIGNoZWNrYm94LnZhbHVlID0gXCJcIjtcclxuICAgICAgICBib3guZGVsZXRlQ2xhc3MoJ2NoZWNrZWQnKTtcclxuICAgIH1cclxufVxyXG4iLCJjbGFzcyBSaXBsZUVmZmVjdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihodG1sLCBldmVudCkge1xyXG4gICAgICAgIHRoaXMuYnV0dG9uID0gaHRtbDtcclxuICAgICAgICB0aGlzLmluayA9IGh0bWwucXVlcnlTZWxlY3RvcignLmluaycpO1xyXG5cclxuICAgICAgICBodG1sLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIChldnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ydW4oZXZ0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBydW4oZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5pbmsuZGVsZXRlQ2xhc3MoJ2FuaW1lJyk7XHJcbiAgICAgICAgdmFyIHggPSBldnQucGFnZVggLSB0aGlzLmJ1dHRvbi5vZmZzZXRMZWZ0IC0gdGhpcy5pbmsub2Zmc2V0V2lkdGggLyAyO1xyXG4gICAgICAgIHZhciB5ID0gZXZ0LnBhZ2VZIC0gdGhpcy5idXR0b24ub2Zmc2V0VG9wIC0gdGhpcy5pbmsub2Zmc2V0SGVpZ2h0IC8gMjtcclxuICAgICAgICB0aGlzLmluay5jc3Moe1xyXG4gICAgICAgICAgICB0b3A6IHkgKyAncHgnLFxyXG4gICAgICAgICAgICBsZWZ0OiB4ICsgJ3B4J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW5rLmFkZENsYXNzKCdhbmltZScpO1xyXG4gICAgfVxyXG5cclxuICAgIG9mZihldnQpIHtcclxuICAgICAgICB2YXIgeCA9IGV2dC5wYWdlWCAtIHRoaXMuYnV0dG9uLm9mZnNldExlZnQgLSB0aGlzLmluay5vZmZzZXRXaWR0aCAvIDI7XHJcbiAgICAgICAgdmFyIHkgPSBldnQucGFnZVkgLSB0aGlzLmJ1dHRvbi5vZmZzZXRUb3AgLSB0aGlzLmluay5vZmZzZXRIZWlnaHQgLyAyO1xyXG4gICAgICAgIHRoaXMuaW5rLmNzcyh7XHJcbiAgICAgICAgICAgIHRvcDogeSArICdweCcsXHJcbiAgICAgICAgICAgIGxlZnQ6IHggKyAncHgnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pbmsuZGVsZXRlQ2xhc3MoJ2FuaW1lJyk7XHJcbiAgICB9XHJcbn0iXX0=
