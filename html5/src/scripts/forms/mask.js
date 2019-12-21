class Mask {
    constructor(form) {
        this.cpfs = form.querySelectorAll('[data-type="cpf"]');
        this.phones = form.querySelectorAll('[data-type="phone"]');
        
        this.loadMaskInFields();
    }

    loadMaskInFields() {
        this.cpfs.forEach((input) => {
            Mask.cpf(input);
        });

        this.phones.forEach((input) => {
            Mask.phone(input);
        });
    }

    static cpf(input) {
        var mask = ['.', '.', '-'];
        //retorna os caracteres de volta a máscara quando removidos pelo backspace
        input.addEventListener('keydown', function(evt){
            if(evt.key == 'Backspace' && (this.value.length == 4 || this.value.length == 8)){
                mask.unshift('.');
            }
            if(evt.key == 'Backspace' && this.value.length == 12){
                mask.push('-');
            }
        }); 
        //adiciona a máscara, valida se os valores digitados são apenas números e insere a máscara de cpf
        input.addEventListener('keypress', function(evt){
            if(!(evt.charCode > 47 && evt.charCode < 58) || this.value.length == 14){
                evt.preventDefault();
                return false;
            }
            if((this.value.length + 1) % 4 == 0){
                var insert = mask.shift();
                this.value += insert === undefined ? '' : insert;
            }
        }); 
    }

    static phone(input) {
        var mask = ['(', ')', ' ', '-'];
        //adiciona a máscara, valida se os valores digitados são apenas números e insere a máscara de cpf
        input.addEventListener('keypress', function(evt){
            if(!(evt.charCode > 47 && evt.charCode < 58) || this.value.length >= 15){
                evt.preventDefault();
                return false;
            }
            var value = this.value.split('');
            
            if(value[0] != '('){
                value.splice(0, 0, '('); 
            }
            if(value.length >= 3 && value[3] != ')'){
                value.splice(3, 0, ')'); 
            }
            if(value.length >= 4 && value[4] != ' '){
                value.splice(4, 0, ' '); 
            }
            if(value.length >= 10 && value[10] != '-'){
                value.splice(10, 0, '-'); 
            }
            this.value = value.join(''); 
        }); 
    }
} 