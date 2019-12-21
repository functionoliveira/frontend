class Message {
    constructor() { }

    addMessageForFieldText(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.field-text__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForFieldText(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.field-text__label');
            label.deleteClass('label-error');
            mesage_error.remove();
        }
    }

    addMessageForFieldTextarea(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.field-textarea__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForFieldTextarea(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.field-textarea__label');
            label.deleteClass('label-error');
            mesage_error.remove();
        }
    }

    addMessageForFieldCheckbox(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.field-checkbox__label');
            var input = this.field.querySelector('.field-checkbox__box');
            var message_caption = document.createElement('caption');
            label.addClass('hide');
            input.addClass('error');
            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForFieldCheckbox(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.field-checkbox__label');
            var input = this.field.querySelector('.field-checkbox__box');

            mesage_error.remove();
            label.deleteClass('hide');
            input.deleteClass('error');
        }
    }

    addMessageForFieldSelect(message, rule) {
        if(!this.field.querySelector('.msg-error')){
            var label = this.field.querySelector('.field-select__base__label');
            var message_caption = document.createElement('caption');
            label.addClass('label-error');

            message_caption.className = "msg-error " + rule;
            message_caption.innerText = message;

            this.field.appendChild(message_caption);
        }
    }

    removeMessageForFieldSelect(rule) {
        var mesage_error = this.field.querySelector('.msg-error');
        if(mesage_error){
            var label = this.field.querySelector('.field-select__base__label');

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
        var input = this.field.querySelector('.field-text__input');
        if(input.value != ''){
            return true;
        }else{
            return false;
        }   
    }
    
    focusIn() {
        var input = this.field.querySelector('.field-text__input');
        input.addEventListener('focusin', () => {
            this.field.addClass('focus-within');
        });
    }

    focusOut() {
        var input = this.field.querySelector('.field-text__input');
        input.addEventListener('focusout', () => {
            if(!this.hasText()) {
                this.field.deleteClass('focus-within');
            }
        });
    }
}

class FieldText extends Field {
    constructor(html) {
        super(html)
        this.focusIn();
        this.focusOut();
    }

    addErrorMessage(message, rule) {
        this.addMessageForFieldText(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForFieldText(rule);
    }

    clear() {
        var input = this.field.querySelector('.field-text__input');
        input.value = "";
        this.field.deleteClass('focus-within');
    }
}


class FieldSelect extends Field {
    constructor(html) {
        super(html);
        this.hideItems();
        this.clickInItem();
        this.bindEvent('click');
    }

    addErrorMessage(message, rule) {
        this.addMessageForFieldSelect(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForFieldSelect(rule);
    }
    
    bindEvent(type) {
        this.field.addEventListener(type, () => {
            this.toggle();
        });         
    }

    clickInItem() {
        var options = this.field.querySelectorAll('.field-select__options__item');
        var label = this.field.querySelector('.field-select__base__label');
        var input = this.field.querySelector('.field-select__base__input');

        options.forEach((item) => {
            item.addEventListener('click', (evt) => {
                label.innerText = item.innerText;
                input.value = item.attr('value');
            });
        });
    } 

    hideItems() {
        var items = this.field.querySelectorAll('.field-select__options__item');   
        var options = this.field.querySelector('.field-select__options');
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
        var label = this.field.querySelector('.field-select__base__label');
        var value_default = this.field.querySelector('.field-select__options__item[value="default"], .field-select__options__item[value=""]').innerText;
        var select = this.field.querySelector('.field-select__base__input');
        select.value = "";
        label.innerText = value_default;
    }

    anime_options_in() {
        var items = this.field.querySelectorAll('.field-select__options__item');
        var options = this.field.querySelector('.field-select__options');
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
        var items = this.field.querySelectorAll('.field-select__options__item');
        var count = items.length - 1;
        var anime = setInterval(() => {
            if(count >= 0){
                items[count].css({ 'transform' : 'translateY(-' + (100 * (count+1) + 1) + '%)' });  
            }else {
                var options = this.field.querySelector('.field-select__options');
                options.css({ 'height' : '0' });
                clearInterval(anime);
            }
            count--;
        }, 200);
    }
}

class FieldTextarea extends Field { 
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
        this.addMessageForFieldTextarea(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForFieldTextarea(rule);
    }
    
    hideLabel() {
        var label = this.field.querySelector('.field-textarea__label');
        label.addClass('f-hide');
    }

    showLabel() {
        var label = this.field.querySelector('.field-textarea__label');
        label.deleteClass('f-hide');
    }

    hasText() {
        var textarea = this.field.querySelector('.field-textarea__input');
        if(textarea.value != ''){
            return true;
        }else{
            return false;
        }
    }

    clear() {
        var textarea = this.field.querySelector('.field-textarea__input');
        textarea.value = "";
        this.field.deleteClass('focus-within');
    }
}

class FieldCheckbox extends Field { 
    constructor(html) {
        super(html);
        this.field.addEventListener('click', () => {
            this.toggle();
        });
    }

    addErrorMessage(message, rule) {
        this.addMessageForFieldCheckbox(message, rule);
    }

    removeErrorMessage(rule) {
        this.removeMessageForFieldCheckbox(rule);
    }
    
    toggle() {
        var checkbox = this.field.querySelector('.field-checkbox__input');
        var box = this.field.querySelector('.field-checkbox__box');
        if(this.isChecked()) {
            box.addClass('checked');
            checkbox.value = 'True';
        }else{
            box.deleteClass('checked');
            checkbox.value = 'False';
        }
    }
    
    isChecked() {
        var checkbox = this.field.querySelector('.field-checkbox__input');
        return checkbox.checked;
    }

    clear() {
        var checkbox = this.field.querySelector('.field-checkbox__input');
        var box = this.field.querySelector('.field-checkbox__box');
        checkbox.value = "";
        box.deleteClass('checked');
    }
}
