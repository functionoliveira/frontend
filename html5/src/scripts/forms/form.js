class Form {
    constructor(form_html, request_params = { 'use_request' : true }, set_validator=true) {
        this.form = form_html;
        this.validator = new Validator(form_html);
        this.mask = new Mask(form_html);
        // Instância os campos internos do formulário
        this.instanceFields();

        // Valida se deve realizar a requisição atráves da classe Request ou deixar o padrão do form 
        if(request_params['use_request']) {
            this.send(request_params);
        }

        // Caso opte por usar o validador adiciona o evento para escutar o disparo do evento validator-error
        if(set_validator) {
            // Instância listeners nos campos fields para observar disparos de erros
            this.observableForErros();
            this.observableForSuccess();
        }
    }

    // listener escutando por eventos de erro
    observableForErros() {
        this.fields.forEach((field) => {
            field.field.addEventListener('validator-error', (evt) => {
                var data = evt.data;
                field.addErrorMessage(data['message'], data['rule']);
            });
        });
    }

    // listener escutando por eventos de sucesso nos campos fields
    observableForSuccess() {
        this.fields.forEach((field) => {
            field.field.addEventListener('validator-field-success', (evt) => {
                var data_rules = validator_field_success.data_rules;
                var data_data_type = validator_field_success.data_data_type;
                field.removeErrorMessage(data_rules['rule']);
                field.removeErrorMessage(data_data_type['rule']);
            });
        });
    }

    // instância um objeto campo field
    instanceFields() {
        this.fields = Array.prototype.map.call(this.form.children, (child) => { 
            if(!child.hasAttribute('ignore')){
                return this.identifyField(child);
            }
        });

        this.fields = Array.prototype.filter.call(this.fields, (child) => { 
            if(child){
                return child;
            }
        });
    }

    // identifica qual é a classe do campo field
    identifyField(field_html) {
        var field_type = field_html.className.split(' ')[0];
        if(field_type == 'field-text') {
            return new FieldText(field_html);
        }else if(field_type == 'field-textarea') {
            return new FieldTextarea(field_html);
        }else if(field_type == 'field-select') {
            return new FieldSelect(field_html);
        }else if(field_type == 'field-checkbox') {
            return new FieldCheckbox(field_html);
        }else{
            return null;
        }
    }

    bodyMount() {
        let body = {};
        let fields = this.form.querySelectorAll('[name]');

        fields.forEach((field) => {
            body[field.name] = field.value;
        });

        return JSON.stringify(body);
    }

    clearFields() {
        this.fields.forEach((field) => {
            field.clear();
        });
    }

    send(request_params) {
        this.request = new Request(this.form.action, this.form.method, request_params['headers']);

        this.form.addEventListener('submit', (evt) => {
            this.form.querySelector('.btn-cta').attr('disabled', 'true');
            // Evita o envio dos dados caso a validação retorne falso
            if(!this.validator.trigger()) {
                this.form.querySelector('.btn-cta').removeAttribute('disabled');
                evt.preventDefault(); 
                return false;         
            }
            this.request.setBody = this.bodyMount();
            this.request.execute()
            .then(body => {
                if(body.success) {
                    this.clearFields();
                    this.form.querySelector('.modal').deleteClass('hide');
                    this.form.querySelector('.btn-cta').removeAttribute('disabled');
                }else{
                    throw body.message;
                };   
            })
            .catch(error => {
                this.form.appendChild(createMessage(error, 'server-error'));
            });

            // Evita que o form reenvie os dados
            evt.preventDefault(); 
            return false;
        });
    }
}