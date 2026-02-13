class rules {
    constructor() {
        fromWhereUsers = 'all';
    }

    update() {
        
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fromWhereBtns = document.querySelectorAll('#fromWhereInfo button');
    fromWhereBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            fromWhereBtns.forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            window.rules.fromWhereUsers = btn.getAttribute('data-where');
            window.rules.update();
        });
    });
})