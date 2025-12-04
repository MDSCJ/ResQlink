/* --- contributor.js (FINAL COMPLETE VERSION) --- */

document.addEventListener('DOMContentLoaded', function() {

    // =========================================================
    // 0. GLOBAL NAVIGATION LOGIC (HAMBURGER, LANG, DROPDOWN)
    // =========================================================
    
    // --- A. Language Logic ---
    const currentLang = localStorage.getItem('siteLang');
    const body = document.body;

    if (currentLang === 'si') {
        body.classList.add('sinhala-mode');
        body.classList.remove('tamil-mode');
    } else if (currentLang === 'ta') {
        body.classList.add('tamil-mode');
        body.classList.remove('sinhala-mode');
    } else if (currentLang === 'en') {
        body.classList.remove('sinhala-mode');
        body.classList.remove('tamil-mode');
    } else {
        createPopup(); // Show popup if new user
    }

    // --- B. Hamburger Menu Logic ---
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-links');

    if (toggle && menu) {
        // Toggle Open/Close
        toggle.onclick = function(e) {
            e.stopPropagation(); 
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        };

        // Close when clicking any link
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = menu.contains(event.target) || toggle.contains(event.target);
            if (!isClickInside) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }

    // --- C. Essential Links Dropdown (Mobile Fix) ---
    const dropbtn = document.querySelector('.dropbtn');
    const dropdown = document.querySelector('.dropdown');
    
    if (dropbtn && window.innerWidth <= 900) {
        dropbtn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        };
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
    }
    
    // --- D. Inject Footer (Specific for Contributor Page) ---
    injectFooter();


    // =========================================
    // 1. SIDEBAR TAB SWITCHING LOGIC
    // =========================================
    const sideLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.content-section');

    sideLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            // Update Sidebar UI
            sideLinks.forEach(l => l.classList.remove('active-side'));
            this.classList.add('active-side');
            
            // Switch Content Section
            const targetId = this.getAttribute('data-target');
            sections.forEach(section => {
                section.classList.remove('active-section');
            });
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            }
            
            // Mobile: Close menu if open
            if(menu) menu.classList.remove('active');
            if(toggle) toggle.classList.remove('active');
        });
    });

    // =========================================
    // 2. SUPPLIER DETAILS (PROFILE & GALLERY)
    // =========================================

    const viewMode = document.getElementById('supplier-view-mode');
    const editMode = document.getElementById('supplier-edit-mode');
    const btnEnableEdit = document.getElementById('btn-enable-edit');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const supplierForm = document.getElementById('supplier-form');

    const displayName = document.getElementById('display-name');
    const displayDesc = document.getElementById('display-desc');
    const displayProfile = document.getElementById('display-profile-pic');
    const displayGallery = document.getElementById('display-gallery');

    const editName = document.getElementById('edit-name');
    const editDesc = document.getElementById('edit-desc');
    const editProfileUpload = document.getElementById('edit-profile-upload');
    const editGalleryUpload = document.getElementById('edit-gallery-upload');

    // Load saved data from localStorage on page load
    function loadSupplierData() {
        const saved = JSON.parse(localStorage.getItem('floodSupplierProfile')) || {};
        
        if (saved.name && displayName) displayName.textContent = saved.name;
        if (saved.desc && displayDesc) displayDesc.textContent = saved.desc;
        if (saved.profilePic && displayProfile) displayProfile.src = saved.profilePic;
        if (saved.gallery && Array.isArray(saved.gallery) && displayGallery) {
            displayGallery.innerHTML = '';
            saved.gallery.forEach(src => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <img src="${src}" alt="Work">
                    <button class="delete-btn" title="Remove Photo">&times;</button>
                `;
                displayGallery.appendChild(item);
            });
        }
    }

    // Save supplier profile to localStorage
    function saveSupplierData() {
        if (!displayGallery) return;
        const profileData = {
            name: displayName.textContent,
            desc: displayDesc.textContent,
            profilePic: displayProfile.src,
            gallery: Array.from(displayGallery.querySelectorAll('img')).map(img => img.src)
        };
        localStorage.setItem('floodSupplierProfile', JSON.stringify(profileData));
    }

    // Initialize on load
    loadSupplierData();

    // Toggle to Edit Mode
    if (btnEnableEdit) {
        btnEnableEdit.addEventListener('click', function() {
            viewMode.classList.add('hidden-mode');
            editMode.classList.remove('hidden-mode');

            // Pre-fill form
            editName.value = displayName.textContent;
            editDesc.value = displayDesc.textContent;
        });
    }

    // Cancel Edit
    if (btnCancelEdit) {
        btnCancelEdit.addEventListener('click', function() {
            editMode.classList.add('hidden-mode');
            viewMode.classList.remove('hidden-mode');
        });
    }

    // Delete Gallery Image
    if (displayGallery) {
        displayGallery.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-btn')) {
                if (confirm("Remove this photo from gallery?")) {
                    e.target.closest('.gallery-item').remove();
                }
            }
        });
    }

    // SAVE CHANGES
    if (supplierForm) {
        supplierForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Update Name & Description
            const newName = editName.value.trim() || "Organization Name";
            const newDesc = editDesc.value.trim() || "No description provided.";

            displayName.textContent = newName;
            displayDesc.textContent = newDesc;

            // 2. Update Profile Picture
            if (editProfileUpload.files && editProfileUpload.files[0]) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    displayProfile.src = ev.target.result;
                    // After all updates, save
                    saveAfterUpdates();
                };
                reader.readAsDataURL(editProfileUpload.files[0]);
            } else {
                saveAfterUpdates();
            }

            // Helper to finalize save
            function saveAfterUpdates() {
                // 3. Add New Gallery Images
                if (editGalleryUpload.files && editGalleryUpload.files.length > 0) {
                    let pending = editGalleryUpload.files.length;
                    Array.from(editGalleryUpload.files).forEach(file => {
                        const reader = new FileReader();
                        reader.onload = function(ev) {
                            const newItem = document.createElement('div');
                            newItem.className = 'gallery-item';
                            newItem.innerHTML = `
                                <img src="${ev.target.result}" alt="Work">
                                <button class="delete-btn" title="Remove Photo">&times;</button>
                            `;
                            displayGallery.prepend(newItem); // Newest on top
                            pending--;
                            if (pending === 0) finalizeSave();
                        };
                        reader.readAsDataURL(file);
                    });
                } else {
                    finalizeSave();
                }
            }

            function finalizeSave() {
                saveSupplierData(); // Save everything to localStorage
                editMode.classList.add('hidden-mode');
                viewMode.classList.remove('hidden-mode');

                // Reset file inputs
                editProfileUpload.value = '';
                editGalleryUpload.value = '';

                alert("✅ Profile updated successfully!");
            }
        });
    }

    // =========================================
    // 3. SUPPLY BATCH & HISTORY
    // =========================================

    const batchForm = document.getElementById('supply-batch-form');
    const itemsContainer = document.getElementById('items-list-container');
    const btnAddRow = document.getElementById('btn-add-row');
    const historyContainer = document.getElementById('history-container');
    const emptyMsg = document.getElementById('empty-history-msg');
    
    // QR Elements
    const qrOverlay = document.getElementById('qr-modal-overlay');
    const qrImage = document.getElementById('generated-qr-code');
    const btnCloseQr = document.getElementById('btn-close-qr');

    // Action Modal Elements
    const actionModal = document.getElementById('action-modal-overlay');
    const btnActionUpdate = document.getElementById('btn-action-update');
    const btnActionDelete = document.getElementById('btn-action-delete');
    const btnCloseAction = document.getElementById('btn-close-action');

    // Data State
    let supplyData = JSON.parse(localStorage.getItem('floodSupplyBatches')) || [];
    let selectedBatchId = null; 
    let editingBatchId = null;

    // --- A. Initial Setup ---
    renderSupplyHistory();
    // If items container is empty on load, add one row
    if (itemsContainer && itemsContainer.children.length === 0) {
        addFormRow();
    }

    // --- B. Add Row Function ---
    if (btnAddRow) {
        btnAddRow.addEventListener('click', function() { addFormRow(); });
    }

    function addFormRow(nameVal = '', qtyVal = '', catVal = 'Cooked Food') {
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `
            <div class="input-group">
                <label><span class="lang-en">Category</span><span class="lang-si">වර්ගය</span><span class="lang-ta">வகை</span></label>
                <select class="form-input item-cat">
                    <option value="Cooked Food">Cooked Food / පිසූ ආහාර / சமைத்த உணவு</option>
                    <option value="Dry Rations">Dry Rations / වියළි ආහාර / உலர் உணவு</option>
                    <option value="Sanitary">Sanitary / සනීපාරක්ෂක / சுகாதாரம்</option>
                    <option value="Clothes">Clothes / ඇඳුම් / ஆடைகள்</option>
                    <option value="Medicine">Medicine / ඖෂධ / மருத்துவம்</option>
                    <option value="Tools">Tools / උපකරණ / கருவிகள்</option>
                </select>
            </div>
            <div class="input-group">
                <label><span class="lang-en">Item Name</span><span class="lang-si">නම</span><span class="lang-ta">பெயர்</span></label>
                <input type="text" class="form-input item-name" placeholder="Name" value="${nameVal}" required>
            </div>
            <div class="input-group">
                <label><span class="lang-en">Qty</span><span class="lang-si">ප්‍රමාණය</span><span class="lang-ta">அளவு</span></label>
                <input type="text" class="form-input item-qty" placeholder="Qty" value="${qtyVal}" required>
            </div>
            <button type="button" class="btn-remove-item">&times;</button>
        `;
        // Set category programmatically
        div.querySelector('.item-cat').value = catVal;
        itemsContainer.appendChild(div);
    }

    // Remove Row
    if (itemsContainer) {
        itemsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-remove-item')) {
                if (itemsContainer.children.length > 1) {
                    e.target.closest('.item-row').remove();
                } else {
                    alert("Must have at least one item.");
                }
            }
        });
    }

    // --- C. Submit Logic ---
    if (batchForm) {
        batchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const rows = document.querySelectorAll('.item-row');
            const items = [];
            
            // Collect items from rows
            rows.forEach(row => {
                items.push({
                    category: row.querySelector('.item-cat').value,
                    name: row.querySelector('.item-name').value,
                    qty: row.querySelector('.item-qty').value
                });
            });

            if (editingBatchId) {
                // UPDATE EXISTING
                const index = supplyData.findIndex(b => b.id === editingBatchId);
                if (index !== -1) {
                    supplyData[index].items = items;
                }
                editingBatchId = null;
            } else {
                // CREATE NEW
                const newBatch = {
                    id: Date.now(),
                    supplyNumber: supplyData.length + 1,
                    date: new Date().toLocaleDateString(),
                    items: items,
                    isConfirmed: false
                };
                supplyData.push(newBatch);
            }

            // Save & Reset
            localStorage.setItem('floodSupplyBatches', JSON.stringify(supplyData));
            batchForm.reset();
            itemsContainer.innerHTML = ''; 
            addFormRow(); // Add fresh row
            
            // Switch Tab
            document.querySelector('[data-target="supply-history"]').click();
            renderSupplyHistory();
        });
    }

    // --- D. Render History ---
    function renderSupplyHistory() {
        if (!historyContainer) return;
        historyContainer.innerHTML = '';

        if (supplyData.length === 0) {
            emptyMsg.style.display = 'block';
        } else {
            emptyMsg.style.display = 'none';
            
            supplyData.slice().reverse().forEach(batch => {
                const itemCount = batch.items.length;
                const summary = `${itemCount} <span class="lang-en">Items</span><span class="lang-si">අයිතම</span>`;

                let btnClass = batch.isConfirmed ? "unverified-btn" : "";
                let statusClass = batch.isConfirmed ? "verified" : "";
                let btnText = batch.isConfirmed ? "UNVERIFIED" : "Confirm Transportation";
                let statusText = batch.isConfirmed ? "Ready for Distributor" : "Waiting for Transportation";

                // Group items by Category
                const groups = {};
                batch.items.forEach(item => {
                    if (!groups[item.category]) groups[item.category] = [];
                    groups[item.category].push(item);
                });

                // Build Details HTML
                let detailsHtml = '';
                for (const [catName, catItems] of Object.entries(groups)) {
                    const listItems = catItems.map(i => `<li>${i.name} <span>(Qty: ${i.qty})</span></li>`).join('');
                    detailsHtml += `
                        <div class="detail-group">
                            <div class="detail-header"><i class="fas fa-layer-group"></i> ${catName}</div>
                            <ul class="detail-list">${listItems}</ul>
                        </div>
                    `;
                }

                // Create Card
                const card = document.createElement('div');
                card.className = 'supply-card';
                card.onclick = function(e) {
                    if(e.target.tagName !== 'BUTTON') {
                        const details = this.querySelector('.batch-details');
                        if(details) details.classList.toggle('open');
                    }
                };

                card.innerHTML = `
                    <button class="btn-close-card" onclick="openActionModal(${batch.id})">&times;</button>
                    <div class="card-main-row">
                        <div class="card-left">
                            <div class="supply-number">#${batch.supplyNumber}</div>
                            <div class="supply-details">
                                <h4>Mixed Batch</h4>
                                <p>${batch.date} • ${summary}</p>
                                <p style="font-size:0.7rem; color:#00d2ff; margin-top:5px;">(Click to view items)</p>
                            </div>
                        </div>
                        <div class="card-right">
                            <span class="status-text ${statusClass}">${statusText}</span>
                            <button class="btn-confirm-transport ${btnClass}" onclick="handleTransportClick(${batch.id})">
                                ${btnText}
                            </button>
                        </div>
                    </div>
                    <div class="batch-details">
                        ${detailsHtml}
                    </div>
                `;
                historyContainer.appendChild(card);
            });
        }
    }

    // --- E. Action Modal ---
    window.openActionModal = function(id) {
        selectedBatchId = id;
        actionModal.classList.remove('hidden-mode');
    };

    if(btnActionDelete) {
        btnActionDelete.addEventListener('click', function() {
            if (selectedBatchId) {
                supplyData = supplyData.filter(b => b.id !== selectedBatchId);
                localStorage.setItem('floodSupplyBatches', JSON.stringify(supplyData));
                renderSupplyHistory();
                actionModal.classList.add('hidden-mode');
                selectedBatchId = null;
            }
        });
    }

    if(btnActionUpdate) {
        btnActionUpdate.addEventListener('click', function() {
            if (selectedBatchId) {
                const batch = supplyData.find(b => b.id == selectedBatchId);
                if (batch) {
                    // Switch to "Make Contribution" Tab
                    const tab = document.querySelector('[data-target="make-contribution"]');
                    if(tab) tab.click();

                    editingBatchId = batch.id;
                    if(itemsContainer) itemsContainer.innerHTML = '';

                    // Fill Rows
                    batch.items.forEach(item => {
                        addFormRow(item.name, item.qty, item.category);
                    });

                    actionModal.classList.add('hidden-mode');
                    selectedBatchId = null;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    alert("Record loaded for editing. Make your changes and click 'Submit Supply List'.");
                }
            }
        });
    }

    if(btnCloseAction) {
        btnCloseAction.addEventListener('click', function() {
            actionModal.classList.add('hidden-mode');
        });
    }

    // --- F. Transport & QR ---
    window.handleTransportClick = function(id) {
        const batch = supplyData.find(item => item.id === id);
        if (!batch.isConfirmed) {
            batch.isConfirmed = true;
            localStorage.setItem('floodSupplyBatches', JSON.stringify(supplyData));
            renderSupplyHistory();
            showQrPopup(batch);
        } else {
            showQrPopup(batch);
        }
    };

    function showQrPopup(batch) {
        const qrData = `SUPPLIER_EMAIL:user@example.com|SUPPLY_ID:${batch.id}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&color=00d2ff&bgcolor=002633`;
        qrImage.src = qrUrl;
        qrOverlay.classList.remove('hidden-mode');
    }

    if (btnCloseQr) {
        btnCloseQr.addEventListener('click', function() {
            qrOverlay.classList.add('hidden-mode');
        });
    }
});

// =========================================
// 4. HELPER FUNCTIONS (Must be outside DOMContentLoaded)
// =========================================

function createPopup() {
    const modal = document.createElement('div');
    modal.id = 'languageModal';
    modal.className = 'lang-modal';
    modal.innerHTML = `
        <div class="lang-content">
            <h2 style="margin-bottom:20px;">
                Select Language<br>
                <span style="font-family: 'Noto Sans Sinhala', sans-serif; font-size:0.8em; color:#ccc;">භාෂාව තෝරන්න </span><br>
                <span style="font-size:0.8em; color:#ccc;">மொழியைத் தேர்ந்தெடுக்கவும்</span>
            </h2>
            <button class="lang-btn btn-en" onclick="setLanguage('en')">English</button>
            <button class="lang-btn btn-si" onclick="setLanguage('si')"><span style="font-family: 'Yaldevi', 'Noto Sans Sinhala', sans-serif;">සිංහල</span></button>
            <button class="lang-btn btn-ta" onclick="setLanguage('ta')">தமிழ்</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function setLanguage(lang) {
    const body = document.body;
    body.classList.remove('sinhala-mode');
    body.classList.remove('tamil-mode');

    if (lang === 'si') {
        body.classList.add('sinhala-mode');
        localStorage.setItem('siteLang', 'si');
    } else if (lang === 'ta') {
        body.classList.add('tamil-mode');
        localStorage.setItem('siteLang', 'ta');
    } else {
        localStorage.setItem('siteLang', 'en');
    }
    const modal = document.getElementById('languageModal');
    if (modal) modal.remove();
}

function injectFooter() {
    const footerContainer = document.getElementById('dynamic-footer');
    if (footerContainer) {
        footerContainer.innerHTML = `
        <footer>
            <div class="footer-container">
                <div class="footer-section">
                    <h3>
                        <span class="lang-en">Contact Us</span>
                        <span class="lang-si">අප අමතන්න</span>
                        <span class="lang-ta">தொடர்பு கொள்ள</span>
                    </h3>
                    <p>
                        <span class="lang-en">System Headquarters</span>
                        <span class="lang-si">පද්ධති මූලස්ථානය</span>
                        <span class="lang-ta">தலைமையகம்</span>
                    </p>
                    <p>chamath.24@cse.mrt.ac.lk</p>
                    <p class="emergency-number">+94 78 5200024</p>
                </div>
            </div>
            <div class="copyright">
                &copy; 2025 Flood Management System. All Rights Reserved.
            </div>
        </footer>`;
    }
}
