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
        var old_number_active = this.carousel.querySelector('.carousel__controllers__index.active');
        var indexes = this.carousel.querySelectorAll('.carousel__controllers__index');
        var idx = this.current_item.attr('carousel-index');
            
        if(old_number_active != undefined){
            old_number_active.deleteClass('active');
        }

        indexes[idx].addClass('active');
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
        this.content.style = '';    
        this.content.style.transform = 'translateX(-' +  this.ITEM_SIZE + 'px)';
        
        var _var = setTimeout(() =>{      
            var first = this.current_item;
            this.content.removeChild(first);
            this.content.appendChild(first);
            this.current_item = this.content.querySelector('.carousel__content__item');          
            this.content.style.transition = 'none';
            this.content.style.transform = 'translateX(0)';
            clearTimeout(_var);
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
            items.forEach((item) => {
                item.clearStyle();
            });
        }, 500);
    }

    autoSlide(time){
        this.interval = setInterval(() => {
            this.slideTo('right');
        }, time);

        addEventOneTime(this.carousel, 'mouseover', () => {
            this.stopAutoSlide(time);
        });
    }

    stopAutoSlide(time){
        addEventOneTime(this.carousel, 'mouseout', () => {
            this.autoSlide(time);
        });
        clearInterval(this.interval);
    }
}