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