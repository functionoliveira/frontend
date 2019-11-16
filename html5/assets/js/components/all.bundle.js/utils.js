class Utils { 
    constructor() {
        HTMLElement.prototype.hasClass = this.hasClass;
        HTMLElement.prototype.addClass = this.addClass;
        HTMLElement.prototype.deleteClass = this.deleteClass;
        HTMLElement.prototype.toggleClass = this.toggleClass;
        HTMLElement.prototype.css = this.css;
        HTMLElement.prototype.clearStyle = this.clearStyle;
    }
 
    hasClass(className) {
        var element = this;
        if(!element || !element.classList.contains(className)){
            return false;
        }else{
            return true;
        }
    }

    deleteClass(className) {
        var element = this;
        if(element) {
            element.classList.remove(className);
        }
    }

    addClass(className) {
        var element = this;
        if(element) {
            element.classList.add(className);
        }
    }

    toggleClass(className) {
        var element = this;
        if(element.hasClass(className)) {
            element.deleteClass(className);
        }else{
            element.addClass(className);          
        }
    }

    css(styles) {
        for(var attr in styles) {
            this.style[attr] = styles[attr];
        }
    }

    clearStyle() {
        this.style = '';
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1dGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBVdGlscyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGFzQ2xhc3MgPSB0aGlzLmhhc0NsYXNzO1xyXG4gICAgICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGRDbGFzcyA9IHRoaXMuYWRkQ2xhc3M7XHJcbiAgICAgICAgSFRNTEVsZW1lbnQucHJvdG90eXBlLmRlbGV0ZUNsYXNzID0gdGhpcy5kZWxldGVDbGFzcztcclxuICAgICAgICBIVE1MRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQ2xhc3MgPSB0aGlzLnRvZ2dsZUNsYXNzO1xyXG4gICAgICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jc3MgPSB0aGlzLmNzcztcclxuICAgICAgICBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xlYXJTdHlsZSA9IHRoaXMuY2xlYXJTdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNDbGFzcyhjbGFzc05hbWUpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgaWYoIWVsZW1lbnQgfHwgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVDbGFzcyhjbGFzc05hbWUpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgaWYoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ2xhc3MoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICAgIGlmKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZUNsYXNzKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuICAgICAgICBpZihlbGVtZW50Lmhhc0NsYXNzKGNsYXNzTmFtZSkpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5kZWxldGVDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKGNsYXNzTmFtZSk7ICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjc3Moc3R5bGVzKSB7XHJcbiAgICAgICAgZm9yKHZhciBhdHRyIGluIHN0eWxlcykge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlW2F0dHJdID0gc3R5bGVzW2F0dHJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGVhclN0eWxlKCkge1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSAnJztcclxuICAgIH1cclxufSJdLCJmaWxlIjoidXRpbHMuanMifQ==
