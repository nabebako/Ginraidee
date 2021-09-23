function fade_in(element, max_op) {
    element.classList.remove('hidden');
    var op = 0.1;
    var timer = setInterval(() => {
        if (op >= max_op) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function fade_out(element) {
    var op = element.style.opacity;
    var timer = setInterval(() => {
        if (op <= 0.1) {
            clearInterval(timer);
            element.classList.add('hidden');
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}