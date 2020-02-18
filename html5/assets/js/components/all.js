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

    addMessageForTextField(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.text-field__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForTextField(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.text-field__label');
            label.deleteClass('label-error');
            mesage_error.remove();
        }
    }

    addMessageForTextFieldarea(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.textarea-field__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForTextFieldarea(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.textarea-field__label');
            label.deleteClass('label-error');
            mesage_error.remove();
        }
    }

    addMessageForCheckboxField(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.checkbox-field__label');
            var input = this.field.querySelector('.checkbox-field__box');
            var message_caption = document.createElement('caption');
            label.addClass('hide');
            input.addClass('error');
            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForCheckboxField(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.checkbox-field__label');
            var input = this.field.querySelector('.checkbox-field__box');

            mesage_error.remove();
            label.deleteClass('hide');
            input.deleteClass('error');
        }
    }

    addMessageForSelectField(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.select-field__base__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForSelectField(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.select-field__base__label');

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
        var input = this.field.querySelector('.text-field__input');
        if(input.value != ''){
            return true;
        }else{
            return false;
        }   
    }
    
    focusIn() {
        var input = this.field.querySelector('.text-field__input');
        input.addEventListener('focusin', () => {
            this.field.addClass('focus-within');
        });
    }

    focusOut() {
        var input = this.field.querySelector('.text-field__input');
        input.addEventListener('focusout', () => {
            if(!this.hasText()) {
                this.field.deleteClass('focus-within');
            }
        });
    }
}

class TextField extends Field {
    constructor(html) {
        super(html)
        this.focusIn();
        this.focusOut();
    }

    addErrorMessage(message, rule) {
        this.addMessageForTextField(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForTextField(rule);
    }

    clear() {
        var input = this.field.querySelector('.text-field__input');
        input.value = "";
        this.field.deleteClass('focus-within');
    }
}
 
class SelectField extends Field {
    constructor(html) {
        super(html);
        this.hideItems();
        this.clickInItem();
        this.bindEvent('click');
    }

    addErrorMessage(message, rule) {
        this.addMessageForSelectField(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForSelectField(rule);
    }
    
    bindEvent(type) {
        this.field.addEventListener(type, () => {
            this.toggle();
        });         
    }

    clickInItem() {
        var options = this.field.querySelectorAll('.select-field__options__item');
        var label = this.field.querySelector('.select-field__base__label');
        var input = this.field.querySelector('.select-field__base__input');

        options.forEach((item) => {
            item.addEventListener('click', (evt) => {
                label.innerText = item.innerText;
                input.value = item.attr('value');
            });
        });
    } 

    hideItems() {
        var items = this.field.querySelectorAll('.select-field__options__item');   
        var options = this.field.querySelector('.select-field__options');
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
        var label = this.field.querySelector('.select-field__base__label');
        var value_default = this.field.querySelector('.select-field__options__item[value="default"], .select-field__options__item[value=""]').innerText;
        var select = this.field.querySelector('.select-field__base__input');
        select.value = "";
        label.innerText = value_default;
    }

    anime_options_in() {
        var items = this.field.querySelectorAll('.select-field__options__item');
        var options = this.field.querySelector('.select-field__options');
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
        var items = this.field.querySelectorAll('.select-field__options__item');
        var count = items.length - 1;
        var anime = setInterval(() => {
            if(count >= 0){
                items[count].css({ 'transform' : 'translateY(-' + (100 * (count+1) + 1) + '%)' });  
            }else {
                var options = this.field.querySelector('.select-field__options');
                options.css({ 'height' : '0' });
                clearInterval(anime);
            }
            count--;
        }, 200);
    }
}

class TextareaField extends Field { 
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
        this.addMessageForTextFieldarea(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForTextFieldarea(rule);
    }
    
    hideLabel() {
        var label = this.field.querySelector('.textarea-field__label');
        label.addClass('f-hide');
    }

    showLabel() {
        var label = this.field.querySelector('.textarea-field__label');
        label.deleteClass('f-hide');
    }

    hasText() {
        var textarea = this.field.querySelector('.textarea-field__input');
        if(textarea.value != ''){
            return true;
        }else{
            return false;
        }
    }

    clear() {
        var textarea = this.field.querySelector('.textarea-field__input');
        textarea.value = "";
        this.field.deleteClass('focus-within');
    }
}

class CheckboxField extends Field { 
    constructor(html) {
        super(html);
        this.field.addEventListener('click', () => {
            this.toggle();
        });
    }

    addErrorMessage(message, rule) {
        this.addMessageForCheckboxField(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForCheckboxField(rule);
    }
    
    toggle() {
        var checkbox = this.field.querySelector('.checkbox-field__input');
        var box = this.field.querySelector('.checkbox-field__box');
        if(this.isChecked()) {
            box.addClass('checked');
            checkbox.value = 'True';
        }else{
            box.deleteClass('checked');
            checkbox.value = 'False';
        }
    }
    
    isChecked() {
        var checkbox = this.field.querySelector('.checkbox-field__input');
        return checkbox.checked;
    }

    clear() {
        var checkbox = this.field.querySelector('.checkbox-field__input');
        var box = this.field.querySelector('.checkbox-field__box');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi1jYXJkLmpzIiwiY2Fyb3VzZWwuanMiLCJmaWVsZC5qcyIsInJpcHBsZS1lZmZlY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBY2NvcmRpb25DYXJkIHtcclxuICAgIGNvbnN0cnVjdG9yKGh0bWwpIHsgXHJcbiAgICAgICAgdGhpcy5zZWxmID0gaHRtbDtcclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSBodG1sLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb24tY2FyZF9fY29udGVudCcpO1xyXG4gICAgICAgIHRoaXMuYnRuX29wZW4gPSBodG1sLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb24tY2FyZF9fb3BlbicpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICB0aGlzLmJ0bl9vcGVuLnRvZ2dsZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudEhlaWdodCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBcclxuXHJcbiAgICBnZXRDb250ZW50SGVpZ2h0KCkge1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmNvbnRlbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIHJldHVybiBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29udGVudEhlaWdodCgpIHtcclxuICAgICAgICBpZih0aGlzLmNvbnRlbnQuaGFzQ2xhc3MoJ29wZW4nKSl7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmdldENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxmLmNzcyh7ICdoZWlnaHQnIDogJ2NhbGMoMzEuMjV2dyArICcgKyBoZWlnaHQgKyAncHgpJyB9KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5zZWxmLmNsZWFyU3R5bGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJjbGFzcyBDYXJvdXNlbE9wdGlvbnMge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIGlmKG9wdGlvbnMuYW5pbWF0aW9uX2xlZnQpIHsgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuc2xpZGVUb0xlZnQgPSBvcHRpb25zLmFuaW1hdGlvbl9sZWZ0OyB9XHJcbiAgICAgICAgaWYob3B0aW9ucy5hbmltYXRpb25fcmlnaHQpIHsgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuc2xpZGVUb1JpZ2h0ID0gb3B0aW9ucy5hbmltYXRpb25fcmlnaHQ7IH1cclxuICAgICAgICB0aGlzLnNob3dfaW5kZXhlcyA9IG9wdGlvbnMuc2hvd19pbmRleGVzID8gb3B0aW9ucy5zaG93X2luZGV4ZXMgOiBudWxsO1xyXG4gICAgICAgIHRoaXMuc2hvd190aW1lciA9IG9wdGlvbnMuc2hvd190aW1lciA/IG9wdGlvbnMuc2hvd190aW1lciA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5xdGRfaXRlbXMgPSBvcHRpb25zLnF0ZF9pdGVtcyA/IG9wdGlvbnMucXRkX2l0ZW1zIDogbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqIENsYXNzIHJlcHJlc2VudGEgdW0gY2Fycm9zc2VsIGh0bWwuICovXHJcbmNsYXNzIENhcm91c2VsIGV4dGVuZHMgQ2Fyb3VzZWxPcHRpb25zIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JpYSB1bWEgaW5zdGFuY2lhIGRlIGNhcnJvc3NlbC5cclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhcm91c2VsIC0gTyBlbGVtZW50byBodG1sIGJhc2UgZG8gY2Fycm9zc2VsLlxyXG4gICAgICogQHBhcmFtIHtKU09OfSBvcHRpb25zIC0gSlNPTiBjb20gb3DDp8O1ZXMgcGFyYSBvIGNhcnJvc3NlbCwgeyBzaG93X2luZGV4ZXMgOiBCb29sZWFuLCBxdGRfaXRlbXMgOiBOdW1iZXIsIGFuaW1hdGlvbl9sZWZ0IDogZnVuY3Rpb24sIGFuaW1hdGlvbl9yaWdodCA6IGZ1bmN0aW9uIH0uXHJcbiAgICAgKi8gXHJcbiAgICBjb25zdHJ1Y3RvcihjYXJvdXNlbCwgb3B0aW9ucz17IHNob3dfaW5kZXhlcyA6IHRydWUsIHF0ZF9pdGVtcyA6IDEsIGFuaW1hdGlvbl9sZWZ0IDogbnVsbCwgYW5pbWF0aW9uX3JpZ2h0IDogbnVsbCB9KXtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gZmxhZyBjb250cm9sYSBibG9xdWVpbyBlbSBtZWlvIGEgYW5pbWHDp8Ojb1xyXG4gICAgICAgIHRoaXMuYmxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIC8vIGNvbnRlw7pkb3MgaHRtbCBkbyBjYXJyb3NzZWxcclxuICAgICAgICB0aGlzLmNhcm91c2VsID0gY2Fyb3VzZWw7XHJcbiAgICAgICAgdGhpcy5jb250ZW50ID0gY2Fyb3VzZWwucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250ZW50Jyk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X2l0ZW0gPSBjYXJvdXNlbC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWxfX2NvbnRlbnRfX2l0ZW0nKTtcclxuICAgICAgICB0aGlzLmZpcnN0X2l0ZW0gPSBjYXJvdXNlbC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWxfX2NvbnRlbnRfX2l0ZW0nKTsgXHJcbiAgICAgICAgdGhpcy5sYXN0X2l0ZW0gPSB0aGlzLmNvbnRlbnQubGFzdEVsZW1lbnRDaGlsZDsgXHJcbiAgICAgICAgLy8gY29udHJvbGxlcnNcclxuICAgICAgICB0aGlzLnByZXZpb3VzID0gY2Fyb3VzZWwucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250cm9sbGVyc19fcHJldmlvdXMnKTtcclxuICAgICAgICB0aGlzLm5leHQgPSBjYXJvdXNlbC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWxfX2NvbnRyb2xsZXJzX19uZXh0Jyk7XHJcbiAgICAgICAgdGhpcy5pbmRleGVzID0gY2Fyb3VzZWwucXVlcnlTZWxlY3RvckFsbCgnLmNhcm91c2VsX19jb250cm9sbGVyc19faW5kZXgnKTtcclxuICAgICAgICAvLyBtZWRpZGFzIGRlIHRlbGEsIGNhcnJvc3NlbCBlIGl0ZW1cclxuICAgICAgICB0aGlzLmNvbnRlbnRfZGltZW5zaW9uID0gdGhpcy5jb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIHRoaXMuU0NSRUVfU0laRSA9IE51bWJlcih3aW5kb3cuaW5uZXJXaWR0aCk7IFxyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlID0gMDtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIGlmKHRoaXMubGFzdF9pdGVtICYmICF0aGlzLnZhbGlkYXRlKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5JVEVNX1NJWkUgPSBOdW1iZXIodGhpcy5jdXJyZW50X2l0ZW0ub2Zmc2V0V2lkdGgpO1xyXG4gICAgICAgICAgICAvLyBSZWFsaXphIG8gYmluZCBkb3MgZXZlbnRvcyBuZWNlc3PDoXJpb3MgcGFyYSBxdWUgbyBjb21wb25lbnRlIGZ1bmNpb25lXHJcbiAgICAgICAgICAgIHRoaXMuYmluZEFjdGlvbigpOyAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuaGlkZU9yQWN0aXZlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSaWdodEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVMZWZ0QnV0dG9uKCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHsgdGhpcy51cGRhdGVTaXplcygpIH07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWwucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250cm9sbGVycycpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiaW5kQWN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChldnQpID0+IHsgIHRoaXMudG91Y2hTdGFydChldnQpIH0pOyBcclxuICAgICAgICB0aGlzLmNhcm91c2VsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChldnQpID0+IHsgIHRoaXMudG91Y2hNb3ZlKGV2dCkgfSk7IFxyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCAoZXZ0KSA9PiB7ICB0aGlzLnRvdWNoRW5kKGV2dCkgfSk7IFxyXG5cclxuICAgICAgICB0aGlzLm5leHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7IHRoaXMuc2xpZGVUbygncmlnaHQnKSB9KTtcclxuICAgICAgICB0aGlzLnByZXZpb3VzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4geyB0aGlzLnNsaWRlVG8oJ2xlZnQnKSB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZSgpIHtcclxuICAgICAgICB2YXIgc2NyZWVuX3dpZHRoID0gTnVtYmVyKHdpbmRvdy5pbm5lcldpZHRoKTsgXHJcbiAgICAgICAgdmFyIGVuZF9zbGlkZXJfY29udGVudCA9IE51bWJlcih0aGlzLmNvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQpO1xyXG4gICAgICAgIHZhciBlbmRfbGFzdF9pdGVtID0gdGhpcy5jb250ZW50Lmxhc3RFbGVtZW50Q2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQ7XHJcblxyXG4gICAgICAgIGlmKGVuZF9sYXN0X2l0ZW0gPiBzY3JlZW5fd2lkdGggfHwgZW5kX2xhc3RfaXRlbSA+IGVuZF9zbGlkZXJfY29udGVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzbGlkZVRvKHNpZGUpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2xpZGUgdG8nLCBzaWRlKTtcclxuICAgICAgICBpZih0aGlzLmJsb2NrZWQpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzaWRlID09ICdsZWZ0JyAmJiB0aGlzLmN1cnJlbnRfaXRlbSAhPSB0aGlzLmZpcnN0X2l0ZW0pe1xyXG4gICAgICAgICAgICB0aGlzLnNsaWRlVG9MZWZ0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNpZGUgPT0gJ3JpZ2h0JyAmJiB0aGlzLmN1cnJlbnRfaXRlbSAhPSB0aGlzLmxhc3RfaXRlbSl7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVUb1JpZ2h0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCcrIHRoaXMudHJhbnNsYXRlICsncHgpJztcclxuICAgIH1cclxuXHJcbiAgICBzbGlkZVRvUmlnaHQoKSB7XHJcbiAgICAgICAgdGhpcy5ibG9jaygpO1xyXG5cclxuICAgICAgICAvLyBtb3ZpbWVudG8gbGF0ZXJhbG1lbnRlIHBhcmEgYSBlc3F1ZXJkYSBvcyBpdGVucyBkbyBjYXJyb3NzZWxcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcm91c2VsX19jb250ZW50X19pdGVtJyk7XHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmNzcyh7ICd0cmFuc2l0aW9uJyA6ICcwLjRzIGFsbCBlYXNlLWluLW91dCcsICd0cmFuc2Zvcm0nIDogJ3RyYW5zbGF0ZVgoJyArICAoLXRoaXMuSVRFTV9TSVpFICogdGhpcy5xdGRfaXRlbXMpICsgJ3B4KScgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAvLyByZW9yZ2FuaXphIGEgbGlzdGEgbW92aW1lbnRvIG9zIGl0ZW5zIGRlIHBvc2nDp8OjbyBpZ3VhbCBhIHF1YW50aWRhZGUgZGUgdmV6ZXMgcGFzc2Egbm8gb3B0aW9ucyAoZGVmYXVsdCAxKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5xdGRfaXRlbXM7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmN1cnJlbnRfaXRlbSAhPSB0aGlzLmxhc3RfaXRlbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSB0aGlzLmN1cnJlbnRfaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRfaXRlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRfaXRlbSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWxfX2NvbnRlbnRfX2l0ZW0nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGVtcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZnJlZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSaWdodEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVMZWZ0QnV0dG9uKCk7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2xlYXJTdHlsZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCA1MDApOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc2xpZGVUb0xlZnQoKSB7XHJcbiAgICAgICAgdGhpcy5ibG9jaygpO1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2Fyb3VzZWxfX2NvbnRlbnRfX2l0ZW0nKTtcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5xdGRfaXRlbXM7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY3VycmVudF9pdGVtICE9IHRoaXMuZmlyc3RfaXRlbSl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHRoaXMuY29udGVudC5sYXN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50Lmxhc3RFbGVtZW50Q2hpbGQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQucHJlcGVuZCh0ZW1wKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudF9pdGVtID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbF9fY29udGVudF9faXRlbScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5jc3MoeyAndHJhbnNmb3JtJyA6ICd0cmFuc2xhdGVYKCcgKyAgKC10aGlzLklURU1fU0laRSp0aGlzLnF0ZF9pdGVtcykgKyAncHgpJyB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jc3MoeyAndHJhbnNpdGlvbicgOiAnLjRzIGFsbCBlYXNlLWluLW91dCcsICd0cmFuc2Zvcm0nIDogJ3RyYW5zbGF0ZVgoMHB4KScgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZnJlZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSaWdodEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVMZWZ0QnV0dG9uKCk7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2xlYXJTdHlsZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc2FibGVMZWZ0QnV0dG9uKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudF9pdGVtID09IHRoaXMuZmlyc3RfaXRlbSl7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXMuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZScpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZVJpZ2h0QnV0dG9uKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudF9pdGVtID09IHRoaXMubGFzdF9pdGVtKXtcclxuICAgICAgICAgICAgdGhpcy5uZXh0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUnKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5uZXh0LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG91Y2hTdGFydChldnQpe1xyXG4gICAgICAgIGlmKGV2dC50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKCdjYXJvdXNlbF9fY29udHJvbGxlcnNfX3ByZXZpb3VzJykgfHwgZXZ0LnRhcmdldC5jbGFzc05hbWUuaW5jbHVkZXMoJ2Nhcm91c2VsX19jb250cm9sbGVyc19fbmV4dCcpKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluaXRpYWwgPSAgTnVtYmVyKGV2dC50b3VjaGVzWzBdLmNsaWVudFgpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdJbmljaWFuZG8gZXZlbnRvIGRyYWcgLSAnICsgdGhpcy5pbml0aWFsKTtcclxuICAgIH1cclxuXHJcbiAgICB0b3VjaE1vdmUoZXZ0KXtcclxuICAgICAgICBpZihldnQudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcygnY2Fyb3VzZWxfX2NvbnRyb2xsZXJzX19wcmV2aW91cycpIHx8IGV2dC50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKCdjYXJvdXNlbF9fY29udHJvbGxlcnNfX25leHQnKSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50b3VjaCA9IE51bWJlcihldnQudG91Y2hlc1swXS5jbGllbnRYKSAtIHRoaXMuaW5pdGlhbDtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk1vdmUgOiBcIiArIHRoaXMudG91Y2gpO1xyXG4gICAgICAgIHZhciBwb3NYID0gdGhpcy50cmFuc2xhdGUgKyB0aGlzLnRvdWNoO1xyXG4gICAgICAgIC8vaW5kaWNhIGEgaW50ZcOnw6NvIGRlIHNjcm9sbGFyIG8gaXRlbSBkbyBjYXJyb3NzZWxcclxuICAgICAgICB2YXIgaXdhbm5hID0gdGhpcy5TQ1JFRV9TSVpFIC8gODsgXHJcbiAgICAgICAgaWYocG9zWCA+IGl3YW5uYSB8fCBwb3NYIDwgLWl3YW5uYSlcclxuICAgICAgICAgICAgJChldnQuY3VycmVudFRhcmdldCkuZmluZCgnLnNsaWRlcicpLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnKyBwb3NYICsncHgpJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdG91Y2hFbmQoZXZ0KXtcclxuICAgICAgICBpZihldnQudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcygnY2Fyb3VzZWxfX2NvbnRyb2xsZXJzX19wcmV2aW91cycpIHx8IGV2dC50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKCdjYXJvdXNlbF9fY29udHJvbGxlcnNfX25leHQnKSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZXZ0LnRhcmdldCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0ZpbSBkbyBldmVudG8gZHJhZywgZGVjaWRpciBvIHF1ZSBmYXplci4nKTtcclxuICAgICAgICB2YXIgcmlnaHQgPSAodGhpcy5TQ1JFRV9TSVpFIC8gNSk7XHJcbiAgICAgICAgdmFyIGxlZnQgPSAtKHRoaXMuU0NSRUVfU0laRSAvIDUpO1xyXG5cclxuICAgICAgICBpZih0aGlzLnRvdWNoID4gcmlnaHQgfHwgZXZ0LnRhcmdldC5jbGFzc05hbWUgPT0gJ2xlZnQtYXJyb3cnKXtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZVRvKCdsZWZ0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjsgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnRvdWNoIDwgbGVmdCB8fCBldnQudGFyZ2V0LmNsYXNzTmFtZSA9PSAncmlnaHQtYXJyb3cnKXtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZVRvKCdyaWdodCcpO1xyXG4gICAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHRoaXMuc2xpZGVyKS5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJysgdGhpcy50cmFuc2xhdGUgKydweCknKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTaXplcygpe1xyXG4gICAgICAgIHRoaXMuU0xJREVSX1dJRFRIID0gTnVtYmVyKHRoaXMuY29udGVudC5vZmZzZXRXaWR0aCk7XHJcbiAgICAgICAgdGhpcy5TQ1JFRV9TSVpFID0gTnVtYmVyKHdpbmRvdy5pbm5lcldpZHRoKTsgXHJcbiAgICAgICAgdGhpcy5JVEVNX1NJWkUgPSBOdW1iZXIodGhpcy5jdXJyZW50X2l0ZW0ub2Zmc2V0V2lkdGgpOyAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW7Dp8OjbyBpbnRlcm5hIGRhIGNsYXNzZSBDYXJvdXNlbCwgYXR1YWxpemEgb3MgaW5kZXhlcyBkbyBjYXJyb3NzZWxcclxuICAgICAqIGFww7NzIHVtYSBwYXNzYWdlbSBkZSBzbGlkZVxyXG4gICAgICogXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogICB2YXIgY2Fyb3VzZWwgPSBuZXcgQ2Fyb3VzZWwoaHRtbCk7IC8vIGluc3RhbmNpYW5kbyBvYmpldG8gY2Fycm9zc2VsXHJcbiAgICAgKiAgIGNhcm91c2VsLmJsb2NrKCk7IC8vIGJsb3F1ZWlhIGNvbnRyb2xlc1xyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUluZGV4ZXMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5zaG93X2luZGV4ZXMpIHtcclxuICAgICAgICAgICAgdmFyIG9sZF9udW1iZXJfYWN0aXZlID0gdGhpcy5jYXJvdXNlbC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWxfX2NvbnRyb2xsZXJzX19pbmRleC5hY3RpdmUnKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ZXMgPSB0aGlzLmNhcm91c2VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJvdXNlbF9fY29udHJvbGxlcnNfX2luZGV4Jyk7XHJcbiAgICAgICAgICAgIHZhciBpZHggPSB0aGlzLmN1cnJlbnRfaXRlbS5hdHRyKCdjYXJvdXNlbC1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKG9sZF9udW1iZXJfYWN0aXZlICE9IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICBvbGRfbnVtYmVyX2FjdGl2ZS5kZWxldGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGluZGV4ZXNbaWR4XS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bsOnw6NvIGludGVybmEgZGEgY2xhc3NlIENhcm91c2VsLCB2ZXJpZmljYSBhIGZsYWcgb3BjaW9uYWwgc2hvd19pbmRleGVzXHJcbiAgICAgKiBjYXNvIHNlamEgdmVyZGFkZWlyYSBhY3RpdmEgbyBwcmltZWlybyBpdGVtIGRvIGNhcnJvc3NlbCwgY2FzbyBuw6NvIHNlamEgXHJcbiAgICAgKiBidXNjYSBlbGVtZW50b3MgaHRtbCBpbmRleCBwYXJhIHJlbW92ZXIuXHJcbiAgICAgKiBcclxuICAgICAqIEBleGFtcGxlIFxyXG4gICAgICogICB0aGlzLmJsb2NrKCk7IC8vIGJsb3F1ZWlhIGNvbnRyb2xlc1xyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGhpZGVPckFjdGl2ZUluZGV4ZXMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5zaG93X2luZGV4ZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5pbmRleGVzWzBdLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5pbmRleGVzLmZvckVhY2goKG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTsgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW7Dp8OjbyBpbnRlcm5hIGRhIGNsYXNzZSBDYXJvdXNlbCwgYmxvcXVlaWEgb3MgY29udHJvbGVzIGRvIGNhcnJvc3NlbFxyXG4gICAgICogaW1wZWRlIG5vdm8gc2xpZGVyIHNlamEgcGFyYSBkaXJlaXRhIG91IHBhcmEgZXNxdWVyZGEgZGlzYWJpbGl0YW5kb1xyXG4gICAgICogYXMgc2V0YXNcclxuICAgICAqIFxyXG4gICAgICogQGV4YW1wbGUgXHJcbiAgICAgKiAgIHRoaXMuYmxvY2soKTsgLy8gYmxvcXVlaWEgY29udHJvbGVzXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgYmxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnByZXZpb3VzLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUnKTtcclxuICAgICAgICB0aGlzLm5leHQuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuw6fDo28gaW50ZXJuYSBkYSBjbGFzc2UgQ2Fyb3VzZWwsIGRlc2Jsb3F1ZWlhIG9zIGNvbnRyb2xlcyBkbyBjYXJyb3NzZWxcclxuICAgICAqIHV0aWxpemFkYSBubyB0ZXJtaW5vIGRlIHVtIGV2ZW50byBkZSBzbGlkZSBwYXJhIHJldG9ybmFyIG8gZXZlbnRvIGRlIGNsaXF1ZVxyXG4gICAgICogZGFzIHNldGFzXHJcbiAgICAgKiBcclxuICAgICAqIEBleGFtcGxlIFxyXG4gICAgICogICB0aGlzLmJsb2NrKCk7IC8vIGJsb3F1ZWlhIGNvbnRyb2xlc1xyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGZyZWUoKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91cy5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgdGhpcy5uZXh0LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGUnKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ3ljbGVDYXJvdXNlbCBleHRlbmRzIENhcm91c2VsIHtcclxuICAgIGNvbnN0cnVjdG9yKGNhcm91c2VsLCBvcHRpb25zPXsgc2hvd19pbmRleGVzIDogdHJ1ZSwgcXRkX2l0ZW1zIDogMSwgYW5pbWF0aW9uX2xlZnQgOiBudWxsLCBhbmltYXRpb25fcmlnaHQgOiBudWxsIH0pIHtcclxuICAgICAgICBzdXBlcihjYXJvdXNlbCwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBpZih0aGlzLmxhc3RfaXRlbSAmJiAhdGhpcy52YWxpZGF0ZSgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuSVRFTV9TSVpFID0gTnVtYmVyKHRoaXMuY3VycmVudF9pdGVtLm9mZnNldFdpZHRoKTtcclxuICAgICAgICAgICAgLy8gUmVhbGl6YSBvIGJpbmQgZG9zIGV2ZW50b3MgbmVjZXNzw6FyaW9zIHBhcmEgcXVlIG8gY29tcG9uZW50ZSBmdW5jaW9uZVxyXG4gICAgICAgICAgICB0aGlzLmJpbmRBY3Rpb24oKTsgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmhpZGVPckFjdGl2ZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4geyB0aGlzLnVwZGF0ZVNpemVzKCkgfTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY2Fyb3VzZWwucXVlcnlTZWxlY3RvcignLmNhcm91c2VsX19jb250cm9sbGVycycpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzbGlkZVRvKHNpZGUpIHtcclxuICAgICAgICBpZih0aGlzLmJsb2NrZWQpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzaWRlID09ICdsZWZ0Jyl7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVUb0xlZnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc2lkZSA9PSAncmlnaHQnKXtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZVRvUmlnaHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuOyBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2xpZGVUb1JpZ2h0KCkge1xyXG4gICAgICAgIHRoaXMuYmxvY2soKTtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcm91c2VsX19jb250ZW50X19pdGVtJyk7XHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmNzcyh7ICd0cmFuc2l0aW9uJyA6ICcwLjRzIGFsbCBlYXNlLWluLW91dCcsICd0cmFuc2Zvcm0nIDogJ3RyYW5zbGF0ZVgoJyArICAoLXRoaXMuSVRFTV9TSVpFICogdGhpcy5xdGRfaXRlbXMpICsgJ3B4KScgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIF92YXIgPSBzZXRUaW1lb3V0KCgpID0+eyAgIFxyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5xdGRfaXRlbXM7IGkrKykgeyAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0ID0gdGhpcy5jdXJyZW50X2l0ZW07XHJcbiAgICAgICAgICAgICAgICBmaXJzdC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChmaXJzdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRfaXRlbSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWxfX2NvbnRlbnRfX2l0ZW0nKTsgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jbGVhclN0eWxlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5mcmVlKCk7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChfdmFyKTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfVxyXG5cclxuICAgIHNsaWRlVG9MZWZ0KCkge1xyXG4gICAgICAgIHRoaXMuYmxvY2soKTtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcm91c2VsX19jb250ZW50X19pdGVtJyk7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMucXRkX2l0ZW1zOyBpKyspe1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IHRoaXMuY29udGVudC5sYXN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LnByZXBlbmQodGVtcCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9pdGVtID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbF9fY29udGVudF9faXRlbScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uY3NzKHsgJ3RyYW5zZm9ybScgOiAndHJhbnNsYXRlWCgnICsgICgtdGhpcy5JVEVNX1NJWkUqdGhpcy5xdGRfaXRlbXMpICsgJ3B4KScgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY3NzKHsgJ3RyYW5zaXRpb24nIDogJy40cyBhbGwgZWFzZS1pbi1vdXQnLCAndHJhbnNmb3JtJyA6ICd0cmFuc2xhdGVYKDBweCknIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmZyZWUoKTtcclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jbGVhclN0eWxlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXV0b1NsaWRlKHRpbWUpe1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVUbygncmlnaHQnKTtcclxuICAgICAgICB9LCB0aW1lKTtcclxuXHJcbiAgICAgICAgYWRkRXZlbnRPbmVUaW1lKHRoaXMuY2Fyb3VzZWwsICdtb3VzZWVudGVyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BBdXRvU2xpZGUodGltZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcEF1dG9TbGlkZSh0aW1lKXtcclxuICAgICAgICBhZGRFdmVudE9uZVRpbWUodGhpcy5jYXJvdXNlbCwgJ21vdXNlbGVhdmUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0b1NsaWRlKHRpbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XHJcbiAgICB9XHJcbn0iLCJjbGFzcyBNZXNzYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgYWRkTWVzc2FnZUZvclRleHRGaWVsZChtZXNzYWdlLCBydWxlKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLm1zZy1lcnJvcicpKXtcclxuICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcudGV4dC1maWVsZF9fbGFiZWwnKTtcclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2VfY2FwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhcHRpb24nKTtcclxuICAgICAgICAgICAgbGFiZWwuYWRkQ2xhc3MoJ2xhYmVsLWVycm9yJyk7XHJcblxyXG4gICAgICAgICAgICBtZXNzYWdlX2NhcHRpb24uY2xhc3NOYW1lID0gXCJtc2ctZXJyb3IgXCIgKyBydWxlO1xyXG4gICAgICAgICAgICBtZXNzYWdlX2NhcHRpb24uaW5uZXJUZXh0ID0gbWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYXBwZW5kQ2hpbGQobWVzc2FnZV9jYXB0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlTWVzc2FnZUZvclRleHRGaWVsZChydWxlKSB7XHJcbiAgICAgICAgdmFyIG1lc2FnZV9lcnJvciA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLm1zZy1lcnJvcicpO1xyXG4gICAgICAgIGlmKG1lc2FnZV9lcnJvcil7XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLnRleHQtZmllbGRfX2xhYmVsJyk7XHJcbiAgICAgICAgICAgIGxhYmVsLmRlbGV0ZUNsYXNzKCdsYWJlbC1lcnJvcicpO1xyXG4gICAgICAgICAgICBtZXNhZ2VfZXJyb3IucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZE1lc3NhZ2VGb3JUZXh0RmllbGRhcmVhKG1lc3NhZ2UsIHJ1bGUpIHtcclxuICAgICAgICBpZighdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcubXNnLWVycm9yJykpe1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYS1maWVsZF9fbGFiZWwnKTtcclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2VfY2FwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhcHRpb24nKTtcclxuICAgICAgICAgICAgbGFiZWwuYWRkQ2xhc3MoJ2xhYmVsLWVycm9yJyk7XHJcblxyXG4gICAgICAgICAgICBtZXNzYWdlX2NhcHRpb24uY2xhc3NOYW1lID0gXCJtc2ctZXJyb3IgXCIgKyBydWxlO1xyXG4gICAgICAgICAgICBtZXNzYWdlX2NhcHRpb24uaW5uZXJUZXh0ID0gbWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYXBwZW5kQ2hpbGQobWVzc2FnZV9jYXB0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlTWVzc2FnZUZvclRleHRGaWVsZGFyZWEocnVsZSkge1xyXG4gICAgICAgIHZhciBtZXNhZ2VfZXJyb3IgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5tc2ctZXJyb3InKTtcclxuICAgICAgICBpZihtZXNhZ2VfZXJyb3Ipe1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYS1maWVsZF9fbGFiZWwnKTtcclxuICAgICAgICAgICAgbGFiZWwuZGVsZXRlQ2xhc3MoJ2xhYmVsLWVycm9yJyk7XHJcbiAgICAgICAgICAgIG1lc2FnZV9lcnJvci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTWVzc2FnZUZvckNoZWNrYm94RmllbGQobWVzc2FnZSwgcnVsZSkge1xyXG4gICAgICAgIGlmKCF0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5tc2ctZXJyb3InKSl7XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmNoZWNrYm94LWZpZWxkX19sYWJlbCcpO1xyXG4gICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2JveC1maWVsZF9fYm94Jyk7XHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlX2NhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYXB0aW9uJyk7XHJcbiAgICAgICAgICAgIGxhYmVsLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIGlucHV0LmFkZENsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgICAgICBtZXNzYWdlX2NhcHRpb24uY2xhc3NOYW1lID0gXCJtc2ctZXJyb3IgXCIgKyBydWxlO1xyXG4gICAgICAgICAgICBtZXNzYWdlX2NhcHRpb24uaW5uZXJUZXh0ID0gbWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmllbGQuYXBwZW5kQ2hpbGQobWVzc2FnZV9jYXB0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlTWVzc2FnZUZvckNoZWNrYm94RmllbGQocnVsZSkge1xyXG4gICAgICAgIHZhciBtZXNhZ2VfZXJyb3IgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5tc2ctZXJyb3InKTtcclxuICAgICAgICBpZihtZXNhZ2VfZXJyb3Ipe1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2JveC1maWVsZF9fbGFiZWwnKTtcclxuICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuY2hlY2tib3gtZmllbGRfX2JveCcpO1xyXG5cclxuICAgICAgICAgICAgbWVzYWdlX2Vycm9yLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBsYWJlbC5kZWxldGVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICBpbnB1dC5kZWxldGVDbGFzcygnZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTWVzc2FnZUZvclNlbGVjdEZpZWxkKG1lc3NhZ2UsIHJ1bGUpIHtcclxuICAgICAgICBpZighdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcubXNnLWVycm9yJykpe1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtZmllbGRfX2Jhc2VfX2xhYmVsJyk7XHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlX2NhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYXB0aW9uJyk7XHJcbiAgICAgICAgICAgIGxhYmVsLmFkZENsYXNzKCdsYWJlbC1lcnJvcicpO1xyXG5cclxuICAgICAgICAgICAgbWVzc2FnZV9jYXB0aW9uLmNsYXNzTmFtZSA9IFwibXNnLWVycm9yIFwiICsgcnVsZTtcclxuICAgICAgICAgICAgbWVzc2FnZV9jYXB0aW9uLmlubmVyVGV4dCA9IG1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFwcGVuZENoaWxkKG1lc3NhZ2VfY2FwdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU1lc3NhZ2VGb3JTZWxlY3RGaWVsZChydWxlKSB7XHJcbiAgICAgICAgdmFyIG1lc2FnZV9lcnJvciA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLm1zZy1lcnJvcicpO1xyXG4gICAgICAgIGlmKG1lc2FnZV9lcnJvcil7XHJcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1maWVsZF9fYmFzZV9fbGFiZWwnKTtcclxuXHJcbiAgICAgICAgICAgIG1lc2FnZV9lcnJvci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgbGFiZWwuZGVsZXRlQ2xhc3MoJ2xhYmVsLWVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBGaWVsZCBleHRlbmRzIE1lc3NhZ2Uge1xyXG4gICAgY29uc3RydWN0b3IoaHRtbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzVGV4dCgpIHtcclxuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LWZpZWxkX19pbnB1dCcpO1xyXG4gICAgICAgIGlmKGlucHV0LnZhbHVlICE9ICcnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9ICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZvY3VzSW4oKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcudGV4dC1maWVsZF9faW5wdXQnKTtcclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkLmFkZENsYXNzKCdmb2N1cy13aXRoaW4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb2N1c091dCgpIHtcclxuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LWZpZWxkX19pbnB1dCcpO1xyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3Vzb3V0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5oYXNUZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuZGVsZXRlQ2xhc3MoJ2ZvY3VzLXdpdGhpbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFRleHRGaWVsZCBleHRlbmRzIEZpZWxkIHtcclxuICAgIGNvbnN0cnVjdG9yKGh0bWwpIHtcclxuICAgICAgICBzdXBlcihodG1sKVxyXG4gICAgICAgIHRoaXMuZm9jdXNJbigpO1xyXG4gICAgICAgIHRoaXMuZm9jdXNPdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRFcnJvck1lc3NhZ2UobWVzc2FnZSwgcnVsZSkge1xyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZUZvclRleHRGaWVsZChtZXNzYWdlLCBydWxlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVFcnJvck1lc3NhZ2UocnVsZSkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlTWVzc2FnZUZvclRleHRGaWVsZChydWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LWZpZWxkX19pbnB1dCcpO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmZpZWxkLmRlbGV0ZUNsYXNzKCdmb2N1cy13aXRoaW4nKTtcclxuICAgIH1cclxufVxyXG4gXHJcbmNsYXNzIFNlbGVjdEZpZWxkIGV4dGVuZHMgRmllbGQge1xyXG4gICAgY29uc3RydWN0b3IoaHRtbCkge1xyXG4gICAgICAgIHN1cGVyKGh0bWwpO1xyXG4gICAgICAgIHRoaXMuaGlkZUl0ZW1zKCk7XHJcbiAgICAgICAgdGhpcy5jbGlja0luSXRlbSgpO1xyXG4gICAgICAgIHRoaXMuYmluZEV2ZW50KCdjbGljaycpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEVycm9yTWVzc2FnZShtZXNzYWdlLCBydWxlKSB7XHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRm9yU2VsZWN0RmllbGQobWVzc2FnZSwgcnVsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRXJyb3JNZXNzYWdlKHJ1bGUpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZU1lc3NhZ2VGb3JTZWxlY3RGaWVsZChydWxlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYmluZEV2ZW50KHR5cGUpIHtcclxuICAgICAgICB0aGlzLmZpZWxkLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgICAgIH0pOyAgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrSW5JdGVtKCkge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0LWZpZWxkX19vcHRpb25zX19pdGVtJyk7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWZpZWxkX19iYXNlX19sYWJlbCcpO1xyXG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1maWVsZF9fYmFzZV9faW5wdXQnKTtcclxuXHJcbiAgICAgICAgb3B0aW9ucy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbC5pbm5lclRleHQgPSBpdGVtLmlubmVyVGV4dDtcclxuICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gaXRlbS5hdHRyKCd2YWx1ZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0gXHJcblxyXG4gICAgaGlkZUl0ZW1zKCkge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvckFsbCgnLnNlbGVjdC1maWVsZF9fb3B0aW9uc19faXRlbScpOyAgIFxyXG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWZpZWxkX19vcHRpb25zJyk7XHJcbiAgICAgICAgb3B0aW9ucy5jc3MoeyAnaGVpZ2h0JyA6ICcwJyB9KTsgIFxyXG4gICAgICAgIHZhciBjb3VudCA9IDE7ICAgXHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmNzcyh7ICd0cmFuc2Zvcm0nIDogJ3RyYW5zbGF0ZVkoLScgKyAoMTAwICogY291bnQgKyAxKSArICclKScsICdwb3NpdGlvbicgOiAncmVsYXRpdmUnLCAnei1pbmRleCcgOiAnLScgKyBjb3VudH0pO1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZSgpIHtcclxuICAgICAgICB0aGlzLmZpZWxkLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZmllbGQuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1lX29wdGlvbnNfaW4oKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5hbmltZV9vcHRpb25zX291dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtZmllbGRfX2Jhc2VfX2xhYmVsJyk7XHJcbiAgICAgICAgdmFyIHZhbHVlX2RlZmF1bHQgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtZmllbGRfX29wdGlvbnNfX2l0ZW1bdmFsdWU9XCJkZWZhdWx0XCJdLCAuc2VsZWN0LWZpZWxkX19vcHRpb25zX19pdGVtW3ZhbHVlPVwiXCJdJykuaW5uZXJUZXh0O1xyXG4gICAgICAgIHZhciBzZWxlY3QgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtZmllbGRfX2Jhc2VfX2lucHV0Jyk7XHJcbiAgICAgICAgc2VsZWN0LnZhbHVlID0gXCJcIjtcclxuICAgICAgICBsYWJlbC5pbm5lclRleHQgPSB2YWx1ZV9kZWZhdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGFuaW1lX29wdGlvbnNfaW4oKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0LWZpZWxkX19vcHRpb25zX19pdGVtJyk7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtZmllbGRfX29wdGlvbnMnKTtcclxuICAgICAgICBvcHRpb25zLmNsZWFyU3R5bGUoKTtcclxuICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgIHZhciBhbmltZSA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgaWYoY291bnQgPCBpdGVtcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgaXRlbXNbY291bnRdLmNsZWFyU3R5bGUoKTtcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2NvdW50XS5jc3MoeyAncG9zaXRpb24nIDogJ3JlbGF0aXZlJywgJ3otaW5kZXgnIDogJy0nICsgKGNvdW50ICsgMSl9KTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYW5pbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfSwgMjAwKTtcclxuICAgIH1cclxuXHJcbiAgICBhbmltZV9vcHRpb25zX291dCgpIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3QtZmllbGRfX29wdGlvbnNfX2l0ZW0nKTtcclxuICAgICAgICB2YXIgY291bnQgPSBpdGVtcy5sZW5ndGggLSAxO1xyXG4gICAgICAgIHZhciBhbmltZSA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgaWYoY291bnQgPj0gMCl7XHJcbiAgICAgICAgICAgICAgICBpdGVtc1tjb3VudF0uY3NzKHsgJ3RyYW5zZm9ybScgOiAndHJhbnNsYXRlWSgtJyArICgxMDAgKiAoY291bnQrMSkgKyAxKSArICclKScgfSk7ICBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtZmllbGRfX29wdGlvbnMnKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuY3NzKHsgJ2hlaWdodCcgOiAnMCcgfSk7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGFuaW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb3VudC0tO1xyXG4gICAgICAgIH0sIDIwMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFRleHRhcmVhRmllbGQgZXh0ZW5kcyBGaWVsZCB7IFxyXG4gICAgY29uc3RydWN0b3IoaHRtbCkge1xyXG4gICAgICAgIHN1cGVyKGh0bWwpO1xyXG4gICAgICAgIHRoaXMuZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlTGFiZWwoKTtcclxuICAgICAgICAgICAgdGhpcy5maWVsZC5hZGRDbGFzcygnZm9jdXMtd2l0aGluJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmhhc1RleHQoKSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dMYWJlbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZC5kZWxldGVDbGFzcygnZm9jdXMtd2l0aGluJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gIFxyXG5cclxuICAgIGFkZEVycm9yTWVzc2FnZShtZXNzYWdlLCBydWxlKSB7XHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRm9yVGV4dEZpZWxkYXJlYShtZXNzYWdlLCBydWxlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVFcnJvck1lc3NhZ2UocnVsZSkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlTWVzc2FnZUZvclRleHRGaWVsZGFyZWEocnVsZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGhpZGVMYWJlbCgpIHtcclxuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYS1maWVsZF9fbGFiZWwnKTtcclxuICAgICAgICBsYWJlbC5hZGRDbGFzcygnZi1oaWRlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0xhYmVsKCkge1xyXG4gICAgICAgIHZhciBsYWJlbCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLnRleHRhcmVhLWZpZWxkX19sYWJlbCcpO1xyXG4gICAgICAgIGxhYmVsLmRlbGV0ZUNsYXNzKCdmLWhpZGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNUZXh0KCkge1xyXG4gICAgICAgIHZhciB0ZXh0YXJlYSA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLnRleHRhcmVhLWZpZWxkX19pbnB1dCcpO1xyXG4gICAgICAgIGlmKHRleHRhcmVhLnZhbHVlICE9ICcnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdmFyIHRleHRhcmVhID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcudGV4dGFyZWEtZmllbGRfX2lucHV0Jyk7XHJcbiAgICAgICAgdGV4dGFyZWEudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuZmllbGQuZGVsZXRlQ2xhc3MoJ2ZvY3VzLXdpdGhpbicpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBDaGVja2JveEZpZWxkIGV4dGVuZHMgRmllbGQgeyBcclxuICAgIGNvbnN0cnVjdG9yKGh0bWwpIHtcclxuICAgICAgICBzdXBlcihodG1sKTtcclxuICAgICAgICB0aGlzLmZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEVycm9yTWVzc2FnZShtZXNzYWdlLCBydWxlKSB7XHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlRm9yQ2hlY2tib3hGaWVsZChtZXNzYWdlLCBydWxlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVFcnJvck1lc3NhZ2UocnVsZSkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlTWVzc2FnZUZvckNoZWNrYm94RmllbGQocnVsZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRvZ2dsZSgpIHtcclxuICAgICAgICB2YXIgY2hlY2tib3ggPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2JveC1maWVsZF9faW5wdXQnKTtcclxuICAgICAgICB2YXIgYm94ID0gdGhpcy5maWVsZC5xdWVyeVNlbGVjdG9yKCcuY2hlY2tib3gtZmllbGRfX2JveCcpO1xyXG4gICAgICAgIGlmKHRoaXMuaXNDaGVja2VkKCkpIHtcclxuICAgICAgICAgICAgYm94LmFkZENsYXNzKCdjaGVja2VkJyk7XHJcbiAgICAgICAgICAgIGNoZWNrYm94LnZhbHVlID0gJ1RydWUnO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBib3guZGVsZXRlQ2xhc3MoJ2NoZWNrZWQnKTtcclxuICAgICAgICAgICAgY2hlY2tib3gudmFsdWUgPSAnRmFsc2UnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaXNDaGVja2VkKCkge1xyXG4gICAgICAgIHZhciBjaGVja2JveCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmNoZWNrYm94LWZpZWxkX19pbnB1dCcpO1xyXG4gICAgICAgIHJldHVybiBjaGVja2JveC5jaGVja2VkO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHZhciBjaGVja2JveCA9IHRoaXMuZmllbGQucXVlcnlTZWxlY3RvcignLmNoZWNrYm94LWZpZWxkX19pbnB1dCcpO1xyXG4gICAgICAgIHZhciBib3ggPSB0aGlzLmZpZWxkLnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2JveC1maWVsZF9fYm94Jyk7XHJcbiAgICAgICAgY2hlY2tib3gudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIGJveC5kZWxldGVDbGFzcygnY2hlY2tlZCcpO1xyXG4gICAgfVxyXG59IiwiY2xhc3MgUmlwbGVFZmZlY3Qge1xyXG4gICAgY29uc3RydWN0b3IoaHRtbCwgZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvbiA9IGh0bWw7XHJcbiAgICAgICAgdGhpcy5pbmsgPSBodG1sLnF1ZXJ5U2VsZWN0b3IoJy5pbmsnKTtcclxuXHJcbiAgICAgICAgaHRtbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucnVuKGV2dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcnVuKGV2dCkge1xyXG4gICAgICAgIHRoaXMuaW5rLmRlbGV0ZUNsYXNzKCdhbmltZScpO1xyXG4gICAgICAgIHZhciB4ID0gZXZ0LnBhZ2VYIC0gdGhpcy5idXR0b24ub2Zmc2V0TGVmdCAtIHRoaXMuaW5rLm9mZnNldFdpZHRoIC8gMjtcclxuICAgICAgICB2YXIgeSA9IGV2dC5wYWdlWSAtIHRoaXMuYnV0dG9uLm9mZnNldFRvcCAtIHRoaXMuaW5rLm9mZnNldEhlaWdodCAvIDI7XHJcbiAgICAgICAgdGhpcy5pbmsuY3NzKHtcclxuICAgICAgICAgICAgdG9wOiB5ICsgJ3B4JyxcclxuICAgICAgICAgICAgbGVmdDogeCArICdweCdcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmluay5hZGRDbGFzcygnYW5pbWUnKTtcclxuICAgIH1cclxuXHJcbiAgICBvZmYoZXZ0KSB7XHJcbiAgICAgICAgdmFyIHggPSBldnQucGFnZVggLSB0aGlzLmJ1dHRvbi5vZmZzZXRMZWZ0IC0gdGhpcy5pbmsub2Zmc2V0V2lkdGggLyAyO1xyXG4gICAgICAgIHZhciB5ID0gZXZ0LnBhZ2VZIC0gdGhpcy5idXR0b24ub2Zmc2V0VG9wIC0gdGhpcy5pbmsub2Zmc2V0SGVpZ2h0IC8gMjtcclxuICAgICAgICB0aGlzLmluay5jc3Moe1xyXG4gICAgICAgICAgICB0b3A6IHkgKyAncHgnLFxyXG4gICAgICAgICAgICBsZWZ0OiB4ICsgJ3B4J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW5rLmRlbGV0ZUNsYXNzKCdhbmltZScpO1xyXG4gICAgfVxyXG59Il19
