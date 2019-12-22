
class Utils {
    constructor() { 
        HTMLElement.prototype.hasClass = this.hasClass;
        HTMLElement.prototype.addClass = this.addClass;
        HTMLElement.prototype.deleteClass = this.deleteClass;
        HTMLElement.prototype.toggleClass = this.toggleClass;
        HTMLElement.prototype.css = this.css;
        HTMLElement.prototype.clearStyle = this.clearStyle;
        HTMLElement.prototype.attr = this.attr;
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
    attr(name, set) {
        if(!set) {
            return this.getAttribute(name);
        }else{
            this.setAttribute(name, set);
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
new Utils();

function addEventOneTime(el, type, fn) {
    function handler(event) {
        el.removeEventListener(type, handler);
        fn(event);
    }
    el.addEventListener(type, handler);
}

var validator_error = document.createEvent('Event');
validator_error.initEvent('validator-error', true, true);
var validator_field_success = document.createEvent('Event');
validator_field_success.initEvent('validator-field-success', true, true);
var post_animation_end = document.createEvent('Event');
post_animation_end.initEvent('post-animation-end', true, true);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY2xhc3MgVXRpbHMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IFxyXG4gICAgICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZS5oYXNDbGFzcyA9IHRoaXMuaGFzQ2xhc3M7XHJcbiAgICAgICAgSFRNTEVsZW1lbnQucHJvdG90eXBlLmFkZENsYXNzID0gdGhpcy5hZGRDbGFzcztcclxuICAgICAgICBIVE1MRWxlbWVudC5wcm90b3R5cGUuZGVsZXRlQ2xhc3MgPSB0aGlzLmRlbGV0ZUNsYXNzO1xyXG4gICAgICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZS50b2dnbGVDbGFzcyA9IHRoaXMudG9nZ2xlQ2xhc3M7XHJcbiAgICAgICAgSFRNTEVsZW1lbnQucHJvdG90eXBlLmNzcyA9IHRoaXMuY3NzO1xyXG4gICAgICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGVhclN0eWxlID0gdGhpcy5jbGVhclN0eWxlO1xyXG4gICAgICAgIEhUTUxFbGVtZW50LnByb3RvdHlwZS5hdHRyID0gdGhpcy5hdHRyO1xyXG4gICAgfVxyXG4gXHJcbiAgICBoYXNDbGFzcyhjbGFzc05hbWUpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgaWYoIWVsZW1lbnQgfHwgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRlbGV0ZUNsYXNzKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuICAgICAgICBpZihlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZENsYXNzKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuICAgICAgICBpZihlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG4gICAgICAgIH0gXHJcbiAgICB9XHJcbiAgICB0b2dnbGVDbGFzcyhjbGFzc05hbWUpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgaWYoZWxlbWVudC5oYXNDbGFzcyhjbGFzc05hbWUpKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZGVsZXRlQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhjbGFzc05hbWUpOyAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhdHRyKG5hbWUsIHNldCkge1xyXG4gICAgICAgIGlmKCFzZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBzZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNzcyhzdHlsZXMpIHtcclxuICAgICAgICBmb3IodmFyIGF0dHIgaW4gc3R5bGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGVbYXR0cl0gPSBzdHlsZXNbYXR0cl07XHJcbiAgICAgICAgfVxyXG4gICAgfSBcclxuICAgIGNsZWFyU3R5bGUoKSB7XHJcbiAgICAgICAgdGhpcy5zdHlsZSA9ICcnO1xyXG4gICAgfVxyXG59XHJcbm5ldyBVdGlscygpO1xyXG5cclxuZnVuY3Rpb24gYWRkRXZlbnRPbmVUaW1lKGVsLCB0eXBlLCBmbikge1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xyXG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlcik7XHJcbiAgICAgICAgZm4oZXZlbnQpO1xyXG4gICAgfVxyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyKTtcclxufVxyXG5cclxudmFyIHZhbGlkYXRvcl9lcnJvciA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG52YWxpZGF0b3JfZXJyb3IuaW5pdEV2ZW50KCd2YWxpZGF0b3ItZXJyb3InLCB0cnVlLCB0cnVlKTtcclxudmFyIHZhbGlkYXRvcl9maWVsZF9zdWNjZXNzID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbnZhbGlkYXRvcl9maWVsZF9zdWNjZXNzLmluaXRFdmVudCgndmFsaWRhdG9yLWZpZWxkLXN1Y2Nlc3MnLCB0cnVlLCB0cnVlKTtcclxudmFyIHBvc3RfYW5pbWF0aW9uX2VuZCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG5wb3N0X2FuaW1hdGlvbl9lbmQuaW5pdEV2ZW50KCdwb3N0LWFuaW1hdGlvbi1lbmQnLCB0cnVlLCB0cnVlKTsiXX0=
