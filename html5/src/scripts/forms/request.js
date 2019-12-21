class Request {
    constructor(route, method, header=new Headers()) {
        this.header = header;
        this.route = route;
        this.method = method;
    }

    // Realiza um GET a url que foi instanciada 
    // use setQueryParameters para enviar conteúdo no query uri
    // Retorna uma promise da requisição já tratando a primeira response e devolvendo um json
    get() {
        var init = { method : 'GET', headers : this.header };
        return fetch(this.route + '?' + this.query, init)
               .then(response => {
                    return response;
               });
    }

    // Realiza um post a url que foi instanciada 
    // use setBody para enviar conteúdo no body
    // Retorna uma promise da requisição já tratando a primeira response e devolvendo um json
    post() {
        var init = { method : 'POST', headers : this.header, body : this.body };
        return fetch(this.route, init)
                .then(response => {
                    return response.json();
                });
    }

    // executa o method corrento com base no method instanciado
    execute() {
        if(this.method === 'get'){
            this.get();
        }

        if(this.method === 'post') {
            return this.post();
        }
    }

    // seta o body 
    set setBody(values) {
        this.body = values;
    }

    // seta os parâmetros do query uri
    set setQueryParameters(values) {
        this.query = values;
    }
}