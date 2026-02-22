class Rules {
    constructor() {
        this.fromWhereUsers = 'all';
        this.indentStep = 2;

        this.fields = [
            { type: 'Base',         key: 'rules_base',  id: 'rulesTextBase',  filter: 'base' },
            { type: 'WarGame',      key: 'rules_wg',    id: 'rulesTextWg',    filter: 'wg' },
            { type: 'RolePlay',     key: 'rules_rp',    id: 'rulesTextRp',    filter: 'rp' },
            { type: 'EconomicGame', key: 'rules_eg',    id: 'rulesTextEg',    filter: 'eg' },
            { type: 'Admin',        key: 'rules_admin', id: 'rulesTextAdmin', filter: 'base' },
        ];
    }

    update(where) {
        const filter = where || this.fromWhereUsers || 'all';

        this.fields.forEach(field => {
            const el = document.getElementById(field.id);
            if (!el) return;

            if (filter !== 'all' && field.filter !== filter && field.filter !== 'base') {
                el.classList.remove('active');
                return;
            }

            const text = window.langMgr.trs(field.key);

            if (text && text.trim()) {
                el.classList.add('active');
                this.renderRulesToElement(field.type, text, field.id);
            }
        });
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    getIndentLevel(line) {
        const match = line.match(/^(\s*)-/);
        if (!match) return 0;
        return Math.floor(match[1].length / this.indentStep / 2);
    }

    renderRulesToElement(type, text, elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        const lines = text.split('\n').filter(line => line.trim());
        let html = `<h2 class="rules-title">${this.escapeHtml(type)}</h2><ul class="rules-list">`;
        let indentStack = [0];

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            const currentLevel = this.getIndentLevel(line);
            const isMainItem = /^- \d+\.\d+[:\s]/.test(trimmedLine);

            let content = trimmedLine.replace(/^-\s*/, '');
            content = this.escapeHtml(content);

            if (currentLevel > indentStack[indentStack.length - 1]) {
                for (let i = indentStack.length; i <= currentLevel; i++) {
                    html += '<ul class="rules-sublist">';
                    indentStack.push(i);
                }
            } else if (currentLevel < indentStack[indentStack.length - 1]) {
                while (indentStack[indentStack.length - 1] > currentLevel) {
                    html += '</ul>';
                    indentStack.pop();
                }
            }

            if (isMainItem) {
                content = content.replace(/^(\d+\.\d+[:]?)/, '<strong>$1</strong>');
            }

            html += `<li>${content}</li>`;
        });

        while (indentStack.length > 1) {
            html += '</ul>';
            indentStack.pop();
        }
        html += '</ul>';

        container.innerHTML = html;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.rules = new Rules();
    const fromWhereBtns = document.querySelectorAll('#fromWhereInfo button');
    
    // Первичный рендер
    window.rules.update();
    
    fromWhereBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            fromWhereBtns.forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            
            const where = btn.getAttribute('data-where');
            if (where) {
                window.rules.fromWhereUsers = where;
                window.rules.update(where);
            }
        });
    });
});