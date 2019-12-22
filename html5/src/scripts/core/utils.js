
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
var validator_error = document.createEvent('Event');
validator_error.initEvent('validator-error', true, true);
var validator_field_success = document.createEvent('Event');
validator_field_success.initEvent('validator-field-success', true, true);
var post_animation_end = document.createEvent('Event');
post_animation_end.initEvent('post-animation-end', true, true);