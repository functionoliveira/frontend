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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhY2NvcmRpb24tY2FyZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBY2NvcmRpb25DYXJkIHtcclxuICAgIGNvbnN0cnVjdG9yKGh0bWwpIHtcclxuICAgICAgICB0aGlzLnNlbGYgPSBodG1sO1xyXG4gICAgICAgIHRoaXMuY29udGVudCA9IGh0bWwucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbi1jYXJkX19jb250ZW50Jyk7XHJcbiAgICAgICAgdGhpcy5idG5fb3BlbiA9IGh0bWwucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbi1jYXJkX19vcGVuJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIHRoaXMuYnRuX29wZW4udG9nZ2xlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29udGVudEhlaWdodCgpIHtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5jb250ZW50Lm9mZnNldEhlaWdodDtcclxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldENvbnRlbnRIZWlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jb250ZW50Lmhhc0NsYXNzKCdvcGVuJykpe1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5nZXRDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZi5jc3MoeyAnaGVpZ2h0JyA6ICdjYWxjKDMxLjI1dncgKyAnICsgaGVpZ2h0ICsgJ3B4KScgfSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZi5jbGVhclN0eWxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0sImZpbGUiOiJhY2NvcmRpb24tY2FyZC5qcyJ9
