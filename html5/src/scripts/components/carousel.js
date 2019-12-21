class Carousel {
    constructor(carousel, cicle, showCounters, animation=null){
        this.animation = animation;
        // console.log(carousel);
        this.show_counters = showCounters == undefined ? false : showCounters;
        // conteúdos html do carrossel
        this.carousel = carousel;
        this.content = this.carousel.querySelector('.carousel__content');
        this.current_item = this.carousel.querySelector('.carousel__content__item');
        this.is_cicle = cicle == undefined ? false : cicle;
        this.last_child = this.content.lastElementChild;
        // medidas de tela, carrossel e item
        this.rect = this.content.getBoundingClientRect();
        this.SLIDER_WIDTH = Number(this.content.offsetWidth);
        this.SCREE_SIZE = Number(window.innerWidth); 
        this.translate = 0;

        // var last_child_rect = this.last_child.getBoundingClientRect();
        if(this.last_child && !this.validate()) {
            this.ITEM_SIZE = Number(this.current_item.offsetWidth);
            // controllers
            this.previous = carousel.querySelector('.carousel__controllers__previous');
            this.next = carousel.querySelector('.carousel__controllers__previous');

            // Realiza o bind dos eventos necessários para que o componente funcione
            this.carousel.addEventListener('touchstart', (evt) => {  this.touchStart(evt) }); 
            this.carousel.addEventListener('touchmove', (evt) => {  this.touchMove(evt) }); 
            this.carousel.addEventListener('touchend', (evt) => {  this.touchEnd(evt) }); 
            this.carousel.addEventListener('click', (evt) => {
                var clicked = evt.target;
                if(clicked.classList.contains('carousel__controllers__previous')){
                    this.slideTo('left');
                }
                if(clicked.classList.contains('carousel__controllers__next')){
                    this.slideTo('right');
                }  
            });     
            window.onresize = () => { this.updateSizes() };

            this.hideCounters();    
            if(this.show_counters) {
                carousel.querySelector('.carousel__controllers__number').classList.add('active');
            }
        }else{
            carousel.querySelector('.carousel__controllers').addClass('hide');
        }
    }

    validate() {
        var screen_width = Number(window.innerWidth); 
        var end_slider_content = Number(this.content.getBoundingClientRect().right);
        var end_last_item =  this.content.lastElementChild.getBoundingClientRect().right;

        if(end_last_item > screen_width || end_last_item > end_slider_content) {
            return false;
        }

        return true;
    }

    slideTo(side) {
        // console.log('slide to', side);
        if(this.is_cicle){
            if(side == 'left'){
                this.slideToLeft();
            }
            if(side == 'right'){
                this.slideToRight();    
            }
        }else{
            var max = -(this.rect.width - this.SCREE_SIZE -this.ITEM_SIZE + this.rect.left);
            if(side == 'left' && this.translate < 0){
                this.slideToLeft();
                return; 
            }
            if(side == 'right' && this.translate > max){
                this.slideToRight();
                return; 
            }
            this.content.style.transform = 'translate('+ this.translate +'px)';
        }

        this.counterUpdate();
    }

    slideToRight() {
        if(this.is_cicle){
            if(this.animation) {
                this.animation('right', this);
                return;
            }
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
            
        }else{
            if(this.animation) {
                this.animation('right', this);
                return;
            }
            this.translate -= this.ITEM_SIZE;
            this.content.style.transform = 'translateX(' +  this.translate + 'px)';
        }

        // console.log("Distance : " + this.translate);
    }

    slideToLeft() {
        if(this.is_cicle){
            if(this.animation) {
                this.animation('left', this);
                return;
            }
            this.content.style.transition = 'none';
            this.content.style.transform = 'translateX(-' +  this.ITEM_SIZE + 'px)';
            var last = this.content.querySelector('.carousel__content__item:last-child');
            this.content.removeChild(last);
            this.content.prepend(last);
            this.current_item = this.content.querySelector('.carousel__content__item');
            var _var = setTimeout(() =>{
                this.content.style = ''; 
                this.content.style.transform = 'translateX(0)';
                clearTimeout(_var);
            }, 10);

        }else{
            this.translate += this.ITEM_SIZE;
            this.content.style.transform = 'translateX(' +  this.translate + 'px)';
        }
        // console.log("Distance : " + this.translate);
    }

    hideLeftButton() {
        if (this.translate < 0) {
            this.previous.classList.add('hide');
        } else {
            this.previous.classList.remove('hide');
        }
    }

    hideRightButton(max) {
        if (this.translate < -max) {
            this.next.classList.remove('hide');
        } else {
            this.next.classList.add('hide');
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

    autoSlide(time){
        this.interval = setInterval(() => {
            // this.carousel.querySelector('.carousel__controllers__next').click();
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

    counterUpdate() {
        if(this.show_counters) {
            var old_number_active = this.carousel.querySelector('.carousel__controllers__number.active');
            var numbers = this.carousel.querySelectorAll('.carousel__controllers__number');
            var idx = this.current_item.getAttribute('id') == numbers.length ? 0 : Number(this.current_item.getAttribute('id'));
              
            if(old_number_active != undefined){
                old_number_active.classList.remove('active');
            }

            numbers[idx].classList.add('active');
        }
    }

    hideCounters() {
        if(!this.show_counters) {
            this.carousel.querySelectorAll('.carousel__controllers__number').forEach((number) => {
                number.remove();
            });
        }
    }
}
