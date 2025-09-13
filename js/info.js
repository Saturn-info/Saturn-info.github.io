function showTypesInfo() {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <div class="modalcontent">
            <div style="justify-self: right;">
                <button onclick="document.getElementById('modal').classList.remove('active')" class="modalClose">×</button>
            </div>
            <div class="stroke infoMedals">
                <b class="infoMedals" data-translate="medals_wintitle">${window.langMgr.trs('medals_wintitle')}</b><p>${window.langMgr.trs('medals_wininfo')}</p>
            </div>
            <div class="stroke infoMedals">
                <b class="infoMedals" data-translate="medals_conqtitle">${window.langMgr.trs('medals_conqtitle')}</b><p>${window.langMgr.trs('medals_conqinfo')}</p>
            </div>
            <div class="stroke infoMedals">
                <b class="infoMedals" data-translate="medals_greattitle">${window.langMgr.trs('medals_greattitle')}</b><p>${window.langMgr.trs('medals_greatinfo')}</p>
            </div>
            <div class="stroke infoMedals">
                <b class="infoMedals" data-translate="medals_sidetitle">${window.langMgr.trs('medals_sidetitle')}</b><p>${window.langMgr.trs('medals_sideinfo')}</p>
            </div>
            <div class="stroke infoMedals">
                <b class="infoMedals" data-translate="medals_deftitle">${window.langMgr.trs('medals_deftitle')}</b><p>${window.langMgr.trs('medals_definfo')}</p>
            </div>
        </div>
        `;
    modal.classList.add('active');
}