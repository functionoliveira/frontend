class RipleEffect {
    constructor(html, event) {
        this.button = html;
        this.ink = html.querySelector('.ink');

        html.addEventListener(event, (evt) => {
            this.run(evt);
        });
    }

    run(evt) {
        this.ink.deleteClass('anime');
        var x = evt.pageX - this.button.offsetLeft - this.ink.offsetWidth / 2;
        var y = evt.pageY - this.button.offsetTop - this.ink.offsetHeight / 2;
        this.ink.css({
            top: y + 'px',
            left: x + 'px'
        });
        this.ink.addClass('anime');
    }

    off(evt) {
        var x = evt.pageX - this.button.offsetLeft - this.ink.offsetWidth / 2;
        var y = evt.pageY - this.button.offsetTop - this.ink.offsetHeight / 2;
        this.ink.css({
            top: y + 'px',
            left: x + 'px'
        });
        this.ink.deleteClass('anime');
    }
}