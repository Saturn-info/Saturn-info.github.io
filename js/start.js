const webcryptSaturn = 'U2FsdGVkX1+K6wRzUNLW+S15s3aOJzwcGmI71FLXvJM3fo93gRgbEg+MDHI/vr6C/cUtSWga3yXCPF6ZSLkvohqFALtJH4k4eekdJ2Ow5eFMASud9kRHMtMvWnmkg6wi5MbEllqX45d3BZGIzu+30RFKdzV0eoUG/y8+vMDdrs05Gb/uIWAtOS3x6vzzGsF7';
//const webcryptNwf = 'U2FsdGVkX1++72YxU/I6QCpgHsMHeMPvQ8XrY5jVSo3h6GZvaqd4a1PeOooPS4KHXd4awDQX906J1W/wjwTOjAVFpCNkiNREc7fB02VtMjWYeKn77owThGeLAvGl6M1qxOBhh0Pou4ZGKRYIOj17u7zJK3tk+p5kSVM54xwevf0YDWDtDu1e82Gs+xdHH3ym';
const webcryptNwf = 'U2FsdGVkX19miTxawSrcqhhqsENYiA/CsCx+IuHsIrKf4pckAZRKsvzzcI2im84lBSYI+C7pYL6DAE1KbpltQ1oyFKwjYGT4GgIU0//khpq/a7OoQlUEWJ1VIxbevXBtXn4MbvfvYXoAAkuU4ZZuxjKFNDluAKQeXh+vCdst0SlHab0Dz7WO7NH1mxxTAOKj';

const mentionSaturn = '<@&1257092656497033380>';
//const mentionSaturn = '<@794675642037567498>';
const mentionNwf = '@everyone';
//const mentionNwf = '<@794675642037567498>';

let textType = 'start';
let saturnText = '';
let nwfText = '';

// При загрузке страницы проверяем сохраненный ключ и подставляем его в поле ввода
window.onload = () => {
    const savedKey = localStorage.getItem('satNwfWebhookAccessKey');
    if (savedKey) {
        const keyInput = document.getElementById('accessKey');
        if (keyInput.tagName === 'INPUT') keyInput.value = savedKey;
        else keyInput.textContent = savedKey;
    }
};

window.onload = () => {
    document.getElementById('accessKey').addEventListener('change', () => {
        localStorage.setItem('satNwfWebhookAccessKey', document.getElementById('accessKey').value)
    })
}

async function writeMessageInDiscord(inputText) {
    const fileInput = document.getElementById('fileUpload');
    const urlInput = document.getElementById('fileUrl');
    const keyElement = document.getElementById('accessKey');
    
    // Получаем ключ из input или другого элемента
    const currentKey = keyElement.value || keyElement.textContent;

    if (!currentKey) {
        alert("Enter access key!");
        return;
    }

    // Сохраняем ключ для удобства
    localStorage.setItem('satNwfWebhookAccessKey', currentKey);

    let webhookSaturnURL, webhookNwfURL;

    try {
        // Дешифровка происходит ТОЛЬКО в момент вызова функции
        const bytesSaturn = CryptoJS.AES.decrypt(webcryptSaturn, currentKey);
        const bytesNwf = CryptoJS.AES.decrypt(webcryptNwf, currentKey);
        
        webhookSaturnURL = bytesSaturn.toString(CryptoJS.enc.Utf8);
        webhookNwfURL = bytesNwf.toString(CryptoJS.enc.Utf8);

        // Проверка корректности ключа
        if (!webhookSaturnURL.startsWith('http')) {
            throw new Error("Invalid Key");
        }
    } catch (e) {
        alert("Неверный ключ доступа!");
        return;
    }

    // --- Дальше ваш логический код ---
    const userMentions = inputText.match(/<@\d+>/g);
    const mentionsString = userMentions ? userMentions.join(' ') : '';

    // const saturnText = `<@794675642037567498>\n🇬🇧 Event Started\n<:flag_su:1417146725352865882> Ивент Начался`;
    switch (textType) {
        case 'start':
            saturnText = `${mentionSaturn}\n🇬🇧 Event Started\n<:flag_su:1417146725352865882> Ивент Начался`;
            nwfText = `# The event has started!\nJoin Saturn Universal Server\n\n${mentionsString}`;
        break;
        case 'reStart': 
            saturnText = `${mentionSaturn}\n🇬🇧 Event Restarted\n<:flag_su:1417146725352865882> Ивент Перезапущен`;
            nwfText = `# The event has re-started!\nJoin Saturn Universal Server\n\n${mentionsString}`;
        break;
        case 'new':
            saturnText = `${mentionSaturn}\n🇬🇧 New event ${document.getElementById('eventChannelSaturn').value}\n<:flag_su:1417146725352865882> Новый ивент ${document.getElementById('eventChannelSaturn').value}`;
            nwfText = `${mentionNwf} \n# ${document.getElementById('eventChannelNwf').value} is now open for signup! \n Make a ticket in the Signup channel to join2`;
        break;
        case 'end':
            saturnText = 'doNotSend';
            nwfText = `## The event has ended\nMedals will be handed out shortly\n\n${mentionsString}`
        break;
        case 'custom':
            saturnText = `${mentionSaturn}\n${document.getElementById('customText').value}`;
            nwfText = `${document.getElementById('customText').value}\n\n${mentionsString || mentionNwf}`;
        break;
        default: 
            saturnText = 'doNotSend';
            nwfText = 'doNotSend';
    }

    const webhooks = [
        {
            url: webhookSaturnURL,
            name: 'Saturn Events System',
            avatar: 'http://saturn-info.github.io/img/newicon.png',
            content: saturnText
        },
        {
            url: webhookNwfURL,
            name: 'Events System',
            avatar: 'http://nwf-info.github.io/img/ico2e.png',
            content: nwfText
        }
    ];

    for (const hook of webhooks) {
        if (hook.content == 'doNotSend' /*|| hook.name == 'Events System'*/) return;

        const formData = new FormData();
        const payload = {
            content: hook.content,
            username: hook.name,
            avatar_url: hook.avatar,
            embeds: []
        };

        if (urlInput && urlInput.value.trim() !== "") {
            payload.embeds.push({ image: { url: urlInput.value.trim() } });
        }

        formData.append('payload_json', JSON.stringify(payload));

        if (fileInput && fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }

        try {
            const response = await fetch(hook.url, {
                method: 'POST',
                body: formData
            });
            console.log(`${hook.name}: Статус ${response.status}`);
        } catch (error) {
            console.error(`${hook.name}: Ошибка:`, error);
        }
    }
}

function setMessage(type) {
    textType = type;

    document.querySelectorAll('.button-group.typeOfMessage button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${type}Event`).classList.add('active');

    if (type == 'custom') document.getElementById('customText').classList.add('active'); else document.getElementById('customText').classList.remove('active');
    if (type == 'new') {
        document.getElementById('eventChannelSaturn').classList.add('active');
        document.getElementById('eventChannelNwf').classList.add('active');
    } else {
        document.getElementById('eventChannelSaturn').classList.remove('active');
        document.getElementById('eventChannelNwf').classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startEvent').addEventListener('click', () => setMessage('start'));
    document.getElementById('reStartEvent').addEventListener('click', () => setMessage('reStart'));
    document.getElementById('newEvent').addEventListener('click', () => setMessage('new'));
    document.getElementById('endEvent').addEventListener('click', () => setMessage('end'));
    document.getElementById('customEvent').addEventListener('click', () => setMessage('custom'));
})