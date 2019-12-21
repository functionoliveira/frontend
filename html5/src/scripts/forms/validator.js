class Validator {
    constructor(form){
        this.cpfs = form.querySelectorAll('[data-type="cpf"]');
        this.rangeDates = form.querySelectorAll('[data-type="range date"]');
        this.text = form.querySelectorAll('[data-type="text"]');
        this.number = form.querySelectorAll('[data-type="number"]');
        this.dates = form.querySelectorAll('[data-type="date"]');
        this.phones = form.querySelectorAll('[data-type="phone"]');
        this.emails = form.querySelectorAll('[data-type="email"]');
        this.checkbox = form.querySelectorAll('[data-type="checkbox"]');
        
        this.bindEvents();
    }

    static clearFields(form) {
        var fields = form.querySelectorAll('input');
        var textareas = form.querySelectorAll('textarea');

        fields.forEach(field => {
            field.value = '';
        });

        textareas.forEach(textarea => {
            textarea.value = '';
        });
    }

    trigger() {
        let flag = true;
        for(let attr in this){
            if(this[attr].toString().includes('NodeList')){
                this[attr].forEach(item => {
                    if(!(this.setRules(item)['ok'] && this.rulesForDataType(item)['ok'])){
                        flag = false;    
                    }
                });
            }
        }

        return flag;
    }

    bindEvents() {
        for(let attr in this){
            if(this[attr].toString().includes('NodeList')){
                this[attr].forEach(item => {
                    item.addEventListener('focusout', evt => { 
                        var valid_rules, valid_data_type;
                        valid_rules = this.setRules(item);
                        valid_data_type = this.rulesForDataType(item);

                        if((valid_rules['ok'] && valid_data_type['ok'])) {
                            validator_field_success.data_rules = valid_rules;
                            validator_field_success.data_data_type = valid_data_type;
                            item.dispatchEvent(validator_field_success);
                        }
                    });
                    item.addEventListener('change', evt => { 
                        var valid_rules, valid_data_type;
                        valid_rules = this.setRules(item);
                        valid_data_type = this.rulesForDataType(item);

                        if((valid_rules['ok'] && valid_data_type['ok'])) {
                            validator_field_success.data_rules = valid_rules;
                            validator_field_success.data_data_type = valid_data_type;
                            item.dispatchEvent(validator_field_success);
                        }
                    }); 
                });
            }
        }
    }

    setRules(input){
        var rules = input.hasAttribute('rules') ? input.getAttribute('rules').toLowerCase() : null;
        var type = input.getAttribute('data-type').toLowerCase().trim();
        var valid = { 'ok' : true }; 
        var temp_valid;

        if(rules != null){
            if(rules.includes('required')){
                temp_valid = Validator.required(input);
                valid = !temp_valid['ok'] ? temp_valid : valid; 
            }
        }

        temp_valid = Validator.maxSize(input);
        if(!temp_valid['ok']) {
            valid = temp_valid;
        }

        temp_valid = Validator.minSize(input);
        if(!temp_valid['ok']) {
            valid = temp_valid;
        }

        if(!valid['ok']) {
            validator_error.data = valid;
            input.dispatchEvent(validator_error);
        }

        return valid;
    }

    rulesForDataType(input) {
        var type = input.getAttribute('data-type').toLowerCase();
        var valid = { 'ok' : true };
        switch(type) {
            case 'cpf':
                valid = Validator.cpf(input);
                break;
            case 'number':
                valid = Validator.number(input);
                break;
            case 'date':
                valid = Validator.date(input);
                break;
            case 'range date':
                valid = Validator.dateRange(input);
                break;
            case 'phone':
                valid = Validator.phone(input);
                break;
            case 'email':
                valid = Validator.email(input);
                break;
            case 'checkbox':    
                valid = Validator.checkbox(input);
        }

        if(!valid['ok']) {
            validator_error.data = valid;
            input.dispatchEvent(validator_error);
        }

        return valid;
    }

    static required(input) {
        var valid;
        if(input.value.trim() === ''){
            valid = { 'ok' : false, 'element' : input, 'rule' : 'required', 'message' : 'Campo obrigatório em branco.' };
        }else{
            valid = { 'ok' : true, 'element' : input, 'rule' : 'required' };
        }

        return valid;
    }

    static maxSize(input) {
        var max = input.getAttribute('maxlength');
        var valid;

        if(max != null && input.value.trim().length > max){
            valid = { 'ok' : false, 'element' : input, 'rule' : 'maxsize', 'message' : 'O campo possui mais caracteres que o permitido.' };
        }else{
            valid = { 'ok' : true, 'element' : input, 'rule' : 'maxsize' };
        }

        return valid;
    }

    static minSize(input) {
        var min = input.getAttribute('minlength');
        var valid;

        if(min != null && input.value.trim().length < min){
            valid = { 'ok' : false, 'element' : input, 'rule' : 'minsize', 'message' : 'O campo possui menos caracteres que o permitido.' };
        }else{
            valid = { 'ok' : true, 'element' : input, 'rule' : 'minsize' };
        }

        return valid;
    }

    static cpf(input) {
        var cpf = input.value.trim();
        var pattern = /^\d{3}.\d{3}.\d{3}-\d{2}$/;
        var valid;

        if(cpf != "" && cpf.match(pattern) === null){
            valid = { 'ok' : false, 'element' : input, 'rule' : 'cpf', 'message' : 'Campo cpf inválido.' };
        }else{
            valid = { 'ok' : true, 'element' : input, 'rule' : 'cpf' };
        }

        return valid;
    }
    
    static phone(input) {
        var phone = input.value.trim();
        var pattern = /^\((\d){2}\)\s(\d){4,5}-(\d){4}$/;
        var valid;

        if(phone != "" && phone.match(pattern) === null){
            valid = { 'ok' : false, 'element' : input, 'rule' : 'phone', 'message' : 'Campo telefone inválido.' };
        }else{
            valid = { 'ok' : true, 'element' : input, 'rule' : 'phone' };
        }

        return valid;
    }

    static email(input) {
        var email = input.value.trim();
        var pattern = /^[\w\-\.]+@\w+(\.com)?(\.br)?$/;
        var email_list = [''];
        var valid;

        if(email != "" && email.match(pattern) === null){
            valid = { 'ok' : false, 'element' : input, 'rule' : 'email', 'message' : 'Campo e-mail inválido.' };
        }else{
            valid = { 'ok' : true, 'element' : input, 'rule' : 'email' };
        }

        return valid;
    }

    static number(input) {
        var number = input.value.trim();
        var pattern = /^[0-9]*$/;

        var valid;

        if(number.match(pattern) === null){
            valid = { 'ok' : false, 'element' : input, 'rule' : 'number', 'message' : 'Campo numérico inválido.' };
        }else{
            valid = { 'ok' : true, 'element' : input, 'rule' : 'number' };
        }

        return valid;
    }

    static checkbox(input) {
        var boolean = input.value.trim();
        var pattern = /^true|false|True|False$/;
        var valid;
        
        if(boolean.match(pattern) === null){
            valid = { 'ok' : false, 'element' : input, 'rule' : 'number', 'message' : 'Campo numérico inválido.' };
        }else{
            valid = { 'ok' : true, 'element' : input, 'rule' : 'number' };
        }

        return valid;
    }
}
