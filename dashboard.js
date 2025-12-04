// --- dashboard.js ---

document.addEventListener('DOMContentLoaded', function() {
    // Force hide modals on load to prevent auto-popup
    document.getElementById('detailsModal').style.display = 'none';
    document.getElementById('cancelReasonModal').style.display = 'none';

    let supplier = JSON.parse(localStorage.getItem("supplierData")) || { name: "Volunteer", email: "user@flood.lk" };
    document.getElementById("supplierNameDisplay").innerText = supplier.name;
});

function toggleSidebar() {
    document.getElementById('supplierSidebar').classList.toggle('collapsed');
}

function showSection(section) {
    document.getElementById('view-form').style.display = (section === 'form') ? 'block' : 'none';
    document.getElementById('view-history').style.display = (section === 'history') ? 'block' : 'none';
    if (section === 'history') loadHistory();
}

function addMore(type) {
    const container = document.getElementById(type + "Container");
    const div = document.createElement("div");
    div.className = "item-row";
    div.innerHTML = `
        <input type="text" class="${type}Item" placeholder="Item Name">
        <input type="number" class="${type}Qty qty" placeholder="Qty">
        <button class="btn-remove" onclick="this.parentElement.remove()">X</button>
    `;
    container.appendChild(div);
}

function submitContribution() {
    let currentCount = parseInt(localStorage.getItem('contribCounter')) || 0;
    let newCount = currentCount + 1;

    let newEntry = {
        id: Date.now(),
        displayId: newCount,
        date: new Date().toLocaleString(),
        status: 'Pending',
        isVerified: false,
        items: []
    };

    ['dry', 'cooked', 'cloth'].forEach(type => {
        const names = document.querySelectorAll(`.${type}Item`);
        const qtys = document.querySelectorAll(`.${type}Qty`);
        names.forEach((input, index) => {
            if (input.value && qtys[index].value) {
                newEntry.items.push({ type: type, name: input.value, qty: qtys[index].value });
            }
        });
    });

    if (newEntry.items.length === 0) {
        alert("Please add at least one item.");
        return;
    }

    let history = JSON.parse(localStorage.getItem('supplyHistory')) || [];
    history.unshift(newEntry);
    localStorage.setItem('supplyHistory', JSON.stringify(history));
    localStorage.setItem('contribCounter', newCount);

    alert("Contribution #" + newCount + " Submitted!");
    location.reload(); 
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('supplyHistory')) || [];
    const container = document.getElementById('historyListContainer');
    container.innerHTML = "";

    if (history.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#777;'>No history found.</p>";
        return;
    }

    history.forEach(entry => {
        let statusClass = '';
        if(entry.status === 'Collected') statusClass = 'status-collected';
        if(entry.isVerified) statusClass = 'status-verified';
        if(entry.status.includes('Cancelled')) statusClass = 'status-cancelled';

        let div = document.createElement('div');
        div.className = `history-card ${statusClass}`;
        
        // --- THE FIX IS HERE ---
        // We attach the click to the MAIN DIV, not the inner HTML.
        // This makes the whole card clickable.
        div.onclick = function() { showDetails(entry.id); }; 

        // Logic for Action Button
        let actionButton = '';
        if(entry.status === 'Pending') {
            actionButton = `
                <button class="btn-collected" onclick="event.stopPropagation(); markAsCollected(${entry.id})">
                    <span class="lang-en"><i class="fas fa-truck"></i> Distributor Collected</span>
                    <span class="lang-si"><i class="fas fa-truck"></i> බෙදාහරින්නා ලබාගත්තා</span>
                    <span class="lang-ta"><i class="fas fa-truck"></i> விநியோகிப்பாளர் பெற்றார்</span>
                </button>
            `;
        } else {
            actionButton = `<span style="color:#555; font-size:0.8rem;">${entry.status}</span>`;
        }

        let countText = `
            <span class="lang-en">${entry.items.length} Items</span>
            <span class="lang-si">ද්‍රව්‍ය ${entry.items.length}</span>
            <span class="lang-ta">${entry.items.length} பொருட்கள்</span>
        `;

        // Notice: No 'onclick' inside the HTML string anymore
        div.innerHTML = `
            <div style="flex:1;">
                <strong>#${entry.displayId}</strong> - <small>${entry.date}</small><br>
                <small style="color:#666;">${countText}</small>
            </div>
            <div>${actionButton}</div>
        `;
        container.appendChild(div);
    });
}

function markAsCollected(id) {
    if(confirm("Has the distributor physically collected these items?\n\nThis cannot be undone.")) {
        let history = JSON.parse(localStorage.getItem('supplyHistory')) || [];
        let index = history.findIndex(x => x.id === id);
        if(index !== -1) {
            history[index].status = "Collected";
            localStorage.setItem('supplyHistory', JSON.stringify(history));
            loadHistory();
            showDetails(id); 
        }
    }
}

let currentId = null;

function showDetails(id) {
    currentId = id;
    let history = JSON.parse(localStorage.getItem('supplyHistory')) || [];
    let supplier = JSON.parse(localStorage.getItem("supplierData")) || { email: "user@flood.lk" };
    let entry = history.find(x => x.id === id);
    if (!entry) return;

    // Item List
    let content = ``;
    entry.items.forEach(i => {
        content += `<div style="border-bottom:1px solid #eee; padding:5px 0;"><b>${i.name}</b> <span style="float:right;">x${i.qty}</span></div>`;
    });
    document.getElementById('popupDetails').innerHTML = content;

    const qrSection = document.getElementById('qrSection');
    const cancelBtn = document.getElementById('btnCancelOrder');
    const badge = document.getElementById('verificationBadge');
    document.getElementById('qrcode').innerHTML = "";

    // Status Logic
    if (entry.status === 'Collected' || entry.status === 'Verified') {
        qrSection.style.display = 'block';
        cancelBtn.style.display = 'none'; 
        
        new QRCode(document.getElementById('qrcode'), {
            text: `${supplier.email}|${entry.id}`, width: 128, height: 128
        });

        if(entry.isVerified){
             badge.className = 'verification-box is-verified';
             badge.innerHTML = `<span class="lang-en"><i class="fas fa-check"></i> VERIFIED</span><span class="lang-si">තහවුරු කර ඇත</span><span class="lang-ta">சரிபார்க்கப்பட்டது</span>`;
        } else {
             badge.className = 'verification-box not-verified';
             badge.innerHTML = `<span class="lang-en"><i class="fas fa-times"></i> NOT VERIFIED</span><span class="lang-si">තහවුරු කර නැත</span><span class="lang-ta">சரிபார்க்கப்படவில்லை</span>`;
        }
        badge.style.display = 'block';

    } else if (entry.status === 'Pending') {
        qrSection.style.display = 'none';
        cancelBtn.style.display = 'block';
        badge.className = 'verification-box is-pending';
        badge.innerHTML = `<span class="lang-en">PENDING</span><span class="lang-si">පොරොත්තුවෙන්</span><span class="lang-ta">நிலுவையில்</span>`;
        badge.style.display = 'block';

    } else {
        qrSection.style.display = 'none';
        cancelBtn.style.display = 'none';
        badge.className = 'verification-box';
        badge.style.background = '#eee';
        badge.innerHTML = `<span style="color:red">CANCELLED</span>`;
        badge.style.display = 'block';
    }

    document.getElementById('detailsModal').style.display = "flex";
}

function closePopup(id) { document.getElementById(id).style.display = "none"; }

function openCancelModal() {
    closePopup('detailsModal');
    document.getElementById('cancelReasonModal').style.display = "flex";
}

function confirmCancel(type) {
    let reason = type === 'Custom' ? document.getElementById('customCancelReason').value : type;
    let history = JSON.parse(localStorage.getItem('supplyHistory')) || [];
    let index = history.findIndex(x => x.id === currentId);

    if (index !== -1) {
        history[index].status = `Cancelled (${reason})`;
        localStorage.setItem('supplyHistory', JSON.stringify(history));
        alert("Order Cancelled");
        closePopup('cancelReasonModal');
        loadHistory();
    }
}

function processUpdate() {
    let history = JSON.parse(localStorage.getItem('supplyHistory')) || [];
    let entry = history.find(x => x.id === currentId);

    if (entry) {
        let newHistory = history.filter(x => x.id !== currentId);
        localStorage.setItem('supplyHistory', JSON.stringify(newHistory));
        closePopup('cancelReasonModal');
        showSection('form');
        
        entry.items.forEach(item => {
            addMore(item.type);
            const container = document.getElementById(item.type + "Container");
            const inputs = container.querySelectorAll("input");
            inputs[inputs.length - 2].value = item.name;
            inputs[inputs.length - 1].value = item.qty;
        });
    }
}