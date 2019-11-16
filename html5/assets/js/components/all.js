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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi1jYXJkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBY2NvcmRpb25DYXJkIHtcclxuICAgIGNvbnN0cnVjdG9yKGh0bWwpIHsgXHJcbiAgICAgICAgdGhpcy5zZWxmID0gaHRtbDtcclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSBodG1sLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb24tY2FyZF9fY29udGVudCcpO1xyXG4gICAgICAgIHRoaXMuYnRuX29wZW4gPSBodG1sLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb24tY2FyZF9fb3BlbicpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICB0aGlzLmJ0bl9vcGVuLnRvZ2dsZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudEhlaWdodCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBcclxuXHJcbiAgICBnZXRDb250ZW50SGVpZ2h0KCkge1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmNvbnRlbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIHJldHVybiBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29udGVudEhlaWdodCgpIHtcclxuICAgICAgICBpZih0aGlzLmNvbnRlbnQuaGFzQ2xhc3MoJ29wZW4nKSl7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmdldENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxmLmNzcyh7ICdoZWlnaHQnIDogJ2NhbGMoMzEuMjV2dyArICcgKyBoZWlnaHQgKyAncHgpJyB9KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5zZWxmLmNsZWFyU3R5bGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=
