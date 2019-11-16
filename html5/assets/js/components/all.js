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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi1jYXJkLmpzIiwicmlwcGxlLWVmZmVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQWNjb3JkaW9uQ2FyZCB7XHJcbiAgICBjb25zdHJ1Y3RvcihodG1sKSB7IFxyXG4gICAgICAgIHRoaXMuc2VsZiA9IGh0bWw7XHJcbiAgICAgICAgdGhpcy5jb250ZW50ID0gaHRtbC5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uLWNhcmRfX2NvbnRlbnQnKTtcclxuICAgICAgICB0aGlzLmJ0bl9vcGVuID0gaHRtbC5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uLWNhcmRfX29wZW4nKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgdGhpcy5idG5fb3Blbi50b2dnbGVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gXHJcblxyXG4gICAgZ2V0Q29udGVudEhlaWdodCgpIHtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5jb250ZW50Lm9mZnNldEhlaWdodDtcclxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbnRlbnRIZWlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jb250ZW50Lmhhc0NsYXNzKCdvcGVuJykpe1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5nZXRDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZi5jc3MoeyAnaGVpZ2h0JyA6ICdjYWxjKDMxLjI1dncgKyAnICsgaGVpZ2h0ICsgJ3B4KScgfSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZi5jbGVhclN0eWxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiY2xhc3MgUmlwbGVFZmZlY3Qge1xyXG4gICAgY29uc3RydWN0b3IoaHRtbCwgZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvbiA9IGh0bWw7XHJcbiAgICAgICAgdGhpcy5pbmsgPSBodG1sLnF1ZXJ5U2VsZWN0b3IoJy5pbmsnKTtcclxuXHJcbiAgICAgICAgaHRtbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucnVuKGV2dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcnVuKGV2dCkge1xyXG4gICAgICAgIHRoaXMuaW5rLmRlbGV0ZUNsYXNzKCdhbmltZScpO1xyXG4gICAgICAgIHZhciB4ID0gZXZ0LnBhZ2VYIC0gdGhpcy5idXR0b24ub2Zmc2V0TGVmdCAtIHRoaXMuaW5rLm9mZnNldFdpZHRoIC8gMjtcclxuICAgICAgICB2YXIgeSA9IGV2dC5wYWdlWSAtIHRoaXMuYnV0dG9uLm9mZnNldFRvcCAtIHRoaXMuaW5rLm9mZnNldEhlaWdodCAvIDI7XHJcbiAgICAgICAgdGhpcy5pbmsuY3NzKHtcclxuICAgICAgICAgICAgdG9wOiB5ICsgJ3B4JyxcclxuICAgICAgICAgICAgbGVmdDogeCArICdweCdcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmluay5hZGRDbGFzcygnYW5pbWUnKTtcclxuICAgIH1cclxuXHJcbiAgICBvZmYoZXZ0KSB7XHJcbiAgICAgICAgdmFyIHggPSBldnQucGFnZVggLSB0aGlzLmJ1dHRvbi5vZmZzZXRMZWZ0IC0gdGhpcy5pbmsub2Zmc2V0V2lkdGggLyAyO1xyXG4gICAgICAgIHZhciB5ID0gZXZ0LnBhZ2VZIC0gdGhpcy5idXR0b24ub2Zmc2V0VG9wIC0gdGhpcy5pbmsub2Zmc2V0SGVpZ2h0IC8gMjtcclxuICAgICAgICB0aGlzLmluay5jc3Moe1xyXG4gICAgICAgICAgICB0b3A6IHkgKyAncHgnLFxyXG4gICAgICAgICAgICBsZWZ0OiB4ICsgJ3B4J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW5rLmRlbGV0ZUNsYXNzKCdhbmltZScpO1xyXG4gICAgfVxyXG59Il19
