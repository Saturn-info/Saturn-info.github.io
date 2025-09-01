class AdminPanel {
    constructor() {
        this.token = localStorage.getItem('githubToken');
        this.originalData = { users, awards, types };
        this.currentData = JSON.parse(JSON.stringify(this.originalData));
        this.setupEventListeners();
        this.checkAuth();
    }

    setupEventListeners() {
        // Auth listeners
        document.getElementById('saveToken').addEventListener('click', () => this.saveToken());
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Add buttons
        document.getElementById('addUser').addEventListener('click', () => this.addUser());
        document.getElementById('addAward').addEventListener('click', () => this.addAward());
        document.getElementById('addType').addEventListener('click', () => this.addType());

        // Save/Reset buttons
        document.getElementById('saveChanges').addEventListener('click', () => this.saveChanges());
        document.getElementById('resetChanges').addEventListener('click', () => this.resetChanges());
    }

    checkAuth() {
        if (this.token) {
            document.getElementById('authSection').classList.add('hidden');
            document.getElementById('editorSection').classList.remove('hidden');
            this.renderAll();
        } else {
            document.getElementById('authSection').classList.remove('hidden');
            document.getElementById('editorSection').classList.add('hidden');
        }
    }

    saveToken() {
        const token = document.getElementById('tokenInput').value;
        if (token) {
            localStorage.setItem('githubToken', token);
            this.token = token;
            this.checkAuth();
        }
    }

    switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabId + 'Tab');
        });
    }

    renderAll() {
        this.renderUsers();
        this.renderAwards();
        this.renderTypes();
    }

    renderUsers() {
        const container = document.getElementById('usersList');
        container.innerHTML = '';
        
        Object.entries(this.currentData.users).forEach(([id, user]) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div>
                    <input type="text" value="${user.id}" placeholder="ID" onchange="admin.updateUser('${id}', 'id', this.value)">
                    <input type="text" value="${user.discord}" placeholder="Discord" onchange="admin.updateUser('${id}', 'discord', this.value)">
                    <input type="text" value="${user.discordid}" placeholder="Discord ID" onchange="admin.updateUser('${id}', 'discordid', this.value)">
                    <input type="text" value="${user.gamename}" placeholder="Game Name" onchange="admin.updateUser('${id}', 'gamename', this.value)">
                    <input type="number" value="${user.events}" placeholder="Events" onchange="admin.updateUser('${id}', 'events', this.value)">
                    <select multiple onchange="admin.updateUserAwards('${id}', Array.from(this.selectedOptions).map(opt => opt.value))">
                        ${Object.keys(this.currentData.awards).map(award => 
                            `<option value="${award}" ${user.awards.includes(award) ? 'selected' : ''}>${this.currentData.awards[award].name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="item-controls">
                    <button class="delete-btn" onclick="admin.deleteUser('${id}')">Удалить</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderAwards() {
        const container = document.getElementById('awardsList');
        container.innerHTML = '';
        
        Object.entries(this.currentData.awards).forEach(([id, award]) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="award-preview">
                    <img src="img/${award.img}" alt="${award.name}">
                    <div>
                        <input type="text" value="${award.name}" placeholder="Name" onchange="admin.updateAward('${id}', 'name', this.value)">
                        <input type="text" value="${award.img}" placeholder="Image" onchange="admin.updateAward('${id}', 'img', this.value)">
                        <select onchange="admin.updateAward('${id}', 'type', this.value)">
                            ${Object.keys(this.currentData.types).map(type => 
                                `<option value="${type}" ${award.type === type ? 'selected' : ''}>${type}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div class="item-controls">
                    <button class="delete-btn" onclick="admin.deleteAward('${id}')">Удалить</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderTypes() {
        const container = document.getElementById('typesList');
        container.innerHTML = '';
        
        Object.entries(this.currentData.types).forEach(([type, score]) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div>
                    <input type="text" value="${type}" placeholder="Type" onchange="admin.updateType('${type}', 'name', this.value)">
                    <input type="number" value="${score}" placeholder="Score" onchange="admin.updateType('${type}', 'score', this.value)">
                </div>
                <div class="item-controls">
                    <button class="delete-btn" onclick="admin.deleteType('${type}')">Удалить</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    addUser() {
        const id = 'new_user_' + Date.now();
        this.currentData.users[id] = {
            id: id,
            discord: '',
            discordid: '',
            gamename: '',
            awards: [],
            events: 0
        };
        this.renderUsers();
    }

    addAward() {
        const id = 'new_award_' + Date.now();
        this.currentData.awards[id] = {
            name: '',
            img: '',
            type: Object.keys(this.currentData.types)[0]
        };
        this.renderAwards();
    }

    addType() {
        const id = 'new_type_' + Date.now();
        this.currentData.types[id] = 1;
        this.renderTypes();
    }

    updateUser(id, field, value) {
        if (!this.currentData.users[id]) return;
        this.currentData.users[id][field] = value;
    }

    updateUserAwards(id, awards) {
        if (!this.currentData.users[id]) return;
        this.currentData.users[id].awards = awards;
    }

    updateAward(id, field, value) {
        if (!this.currentData.awards[id]) return;
        this.currentData.awards[id][field] = value;
    }

    updateType(oldType, field, value) {
        if (field === 'name' && value !== oldType) {
            this.currentData.types[value] = this.currentData.types[oldType];
            delete this.currentData.types[oldType];
            // Update award references
            Object.values(this.currentData.awards).forEach(award => {
                if (award.type === oldType) {
                    award.type = value;
                }
            });
        } else if (field === 'score') {
            this.currentData.types[oldType] = parseInt(value) || 0;
        }
        this.renderAll();
    }

    deleteUser(id) {
        delete this.currentData.users[id];
        this.renderUsers();
    }

    deleteAward(id) {
        delete this.currentData.awards[id];
        // Remove award from users
        Object.values(this.currentData.users).forEach(user => {
            user.awards = user.awards.filter(a => a !== id);
        });
        this.renderAll();
    }

    deleteType(type) {
        delete this.currentData.types[type];
        // Remove type from awards
        Object.values(this.currentData.awards).forEach(award => {
            if (award.type === type) {
                award.type = Object.keys(this.currentData.types)[0] || '';
            }
        });
        this.renderAll();
    }

    async saveChanges() {
        try {
            const content = `const users = ${JSON.stringify(this.currentData.users, null, 4)};\n\n` +
                          `const awards = ${JSON.stringify(this.currentData.awards, null, 4)};\n\n` +
                          `const types = ${JSON.stringify(this.currentData.types, null, 4)};\n`;

            const response = await fetch('https://api.github.com/repos/Saturn-winner-s-table/Saturn-winner-s-table.github.io/contents/users.js', {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update users data via admin panel',
                    content: btoa(content),
                    sha: '' // Нужно будет получить текущий SHA файла
                })
            });

            if (response.ok) {
                this.originalData = JSON.parse(JSON.stringify(this.currentData));
                this.showMessage('Изменения успешно сохранены', 'success');
            } else {
                throw new Error('Failed to save changes');
            }
        } catch (error) {
            this.showMessage('Ошибка при сохранении изменений: ' + error.message, 'error');
        }
    }

    resetChanges() {
        this.currentData = JSON.parse(JSON.stringify(this.originalData));
        this.renderAll();
    }

    showMessage(text, type) {
        const container = document.querySelector('.admin-container');
        const existingMsg = container.querySelector('.message');
        if (existingMsg) existingMsg.remove();

        const msg = document.createElement('div');
        msg.className = `message ${type}-message`;
        msg.textContent = text;
        container.insertBefore(msg, container.firstChild);
        setTimeout(() => msg.remove(), 3000);
    }
}

// Initialize the admin panel
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new AdminPanel();
});