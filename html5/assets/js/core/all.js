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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFV0aWxzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBcclxuICAgICAgICBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGFzQ2xhc3MgPSB0aGlzLmhhc0NsYXNzO1xyXG4gICAgICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGRDbGFzcyA9IHRoaXMuYWRkQ2xhc3M7XHJcbiAgICAgICAgSFRNTEVsZW1lbnQucHJvdG90eXBlLmRlbGV0ZUNsYXNzID0gdGhpcy5kZWxldGVDbGFzcztcclxuICAgICAgICBIVE1MRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQ2xhc3MgPSB0aGlzLnRvZ2dsZUNsYXNzO1xyXG4gICAgICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jc3MgPSB0aGlzLmNzcztcclxuICAgICAgICBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xlYXJTdHlsZSA9IHRoaXMuY2xlYXJTdHlsZTtcclxuICAgIH1cclxuIFxyXG4gICAgaGFzQ2xhc3MoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICAgIGlmKCFlbGVtZW50IHx8ICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQ2xhc3MoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICAgIGlmKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZENsYXNzKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuICAgICAgICBpZihlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVDbGFzcyhjbGFzc05hbWUpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgaWYoZWxlbWVudC5oYXNDbGFzcyhjbGFzc05hbWUpKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGVsZXRlQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhjbGFzc05hbWUpOyAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3NzKHN0eWxlcykge1xyXG4gICAgICAgIGZvcih2YXIgYXR0ciBpbiBzdHlsZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZVthdHRyXSA9IHN0eWxlc1thdHRyXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTdHlsZSgpIHtcclxuICAgICAgICB0aGlzLnN0eWxlID0gJyc7XHJcbiAgICB9XHJcbn0iXX0=
