class Message {
    constructor() { }

    addMessageForTextField(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.text-field__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForTextField(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.text-field__label');
            label.deleteClass('label-error');
            mesage_error.remove();
        }
    }

    addMessageForTextFieldarea(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.textarea-field__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForTextFieldarea(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.textarea-field__label');
            label.deleteClass('label-error');
            mesage_error.remove();
        }
    }

    addMessageForCheckboxField(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.checkbox-field__label');
            var input = this.field.querySelector('.checkbox-field__box');
            var message_caption = document.createElement('caption');
            label.addClass('hide');
            input.addClass('error');
            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForCheckboxField(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.checkbox-field__label');
            var input = this.field.querySelector('.checkbox-field__box');

            mesage_error.remove();
            label.deleteClass('hide');
            input.deleteClass('error');
        }
    }

    addMessageForSelectField(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.select-field__base__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForSelectField(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.select-field__base__label');

            mesage_error.remove();
            label.deleteClass('label-error');
        }
    }
}

class Field extends Message {
    constructor(html) {
        super();
        this.field = html;
    }

    hasText() {
        var input = this.field.querySelector('.text-field__input');
        if(input.value != ''){
            return true;
        }else{
            return false;
        }   
    }
    
    focusIn() {
        var input = this.field.querySelector('.text-field__input');
        input.addEventListener('focusin', () => {
            this.field.addClass('focus-within');
        });
    }

    focusOut() {
        var input = this.field.querySelector('.text-field__input');
        input.addEventListener('focusout', () => {
            if(!this.hasText()) {
                this.field.deleteClass('focus-within');
            }
        });
    }
}

class TextField extends Field {
    constructor(html) {
        super(html)
        this.focusIn();
        this.focusOut();
    }

    addErrorMessage(message, rule) {
        this.addMessageForTextField(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForTextField(rule);
    }

    clear() {
        var input = this.field.querySelector('.text-field__input');
        input.value = "";
        this.field.deleteClass('focus-within');
    }
}
 
class SelectField extends Field {
    constructor(html) {
        super(html);
        this.hideItems();
        this.clickInItem();
        this.bindEvent('click');
    }

    addErrorMessage(message, rule) {
        this.addMessageForSelectField(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForSelectField(rule);
    }
    
    bindEvent(type) {
        this.field.addEventListener(type, () => {
            this.toggle();
        });         
    }

    clickInItem() {
        var options = this.field.querySelectorAll('.select-field__options__item');
        var label = this.field.querySelector('.select-field__base__label');
        var input = this.field.querySelector('.select-field__base__input');

        options.forEach((item) => {
            item.addEventListener('click', (evt) => {
                label.innerText = item.innerText;
                input.value = item.attr('value');
            });
        });
    } 

    hideItems() {
        var items = this.field.querySelectorAll('.select-field__options__item');   
        var options = this.field.querySelector('.select-field__options');
        options.css({ 'height' : '0' });  
        var count = 1;   
        items.forEach((item) => {
            item.css({ 'transform' : 'translateY(-' + (100 * count + 1) + '%)', 'position' : 'relative', 'z-index' : '-' + count});
            count++;
        });
    }

    toggle() {
        this.field.toggleClass('open');

        if(this.field.hasClass('open')) {
            this.anime_options_in();
        }else{
            this.anime_options_out();
        }
    }

    clear() {
        var label = this.field.querySelector('.select-field__base__label');
        var value_default = this.field.querySelector('.select-field__options__item[value="default"], .select-field__options__item[value=""]').innerText;
        var select = this.field.querySelector('.select-field__base__input');
        select.value = "";
        label.innerText = value_default;
    }

    anime_options_in() {
        var items = this.field.querySelectorAll('.select-field__options__item');
        var options = this.field.querySelector('.select-field__options');
        options.clearStyle();
        var count = 0;
        var anime = setInterval(() => {
            if(count < items.length){
                items[count].clearStyle();
                items[count].css({ 'position' : 'relative', 'z-index' : '-' + (count + 1)});                
            }else {
                clearInterval(anime);
            }
            count++;
        }, 200);
    }

    anime_options_out() {
        var items = this.field.querySelectorAll('.select-field__options__item');
        var count = items.length - 1;
        var anime = setInterval(() => {
            if(count >= 0){
                items[count].css({ 'transform' : 'translateY(-' + (100 * (count+1) + 1) + '%)' });  
            }else {
                var options = this.field.querySelector('.select-field__options');
                options.css({ 'height' : '0' });
                clearInterval(anime);
            }
            count--;
        }, 200);
    }
}

class TextareaField extends Field { 
    constructor(html) {
        super(html);
        this.field.addEventListener('focusin', () => {
            this.hideLabel();
            this.field.addClass('focus-within');
        });

        this.field.addEventListener('focusout', () => {
            if(!this.hasText()){
                this.showLabel();
                this.field.deleteClass('focus-within');
            }
        });
    }  

    addErrorMessage(message, rule) {
        this.addMessageForTextFieldarea(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForTextFieldarea(rule);
    }
    
    hideLabel() {
        var label = this.field.querySelector('.textarea-field__label');
        label.addClass('f-hide');
    }

    showLabel() {
        var label = this.field.querySelector('.textarea-field__label');
        label.deleteClass('f-hide');
    }

    hasText() {
        var textarea = this.field.querySelector('.textarea-field__input');
        if(textarea.value != ''){
            return true;
        }else{
            return false;
        }
    }

    clear() {
        var textarea = this.field.querySelector('.textarea-field__input');
        textarea.value = "";
        this.field.deleteClass('focus-within');
    }
}

class CheckboxField extends Field { 
    constructor(html) {
        super(html);
        this.field.addEventListener('click', () => {
            this.toggle();
        });
    }

    addErrorMessage(message, rule) {
        this.addMessageForCheckboxField(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForCheckboxField(rule);
    }
    
    toggle() {
        var checkbox = this.field.querySelector('.checkbox-field__input');
        var box = this.field.querySelector('.checkbox-field__box');
        if(this.isChecked()) {
            box.addClass('checked');
            checkbox.value = 'True';
        }else{
            box.deleteClass('checked');
            checkbox.value = 'False';
        }
    }
    
    isChecked() {
        var checkbox = this.field.querySelector('.checkbox-field__input');
        return checkbox.checked;
    }

    clear() {
        var checkbox = this.field.querySelector('.checkbox-field__input');
        var box = this.field.querySelector('.checkbox-field__box');
        checkbox.value = "";
        box.deleteClass('checked');
    }
}