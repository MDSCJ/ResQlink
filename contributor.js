/* --- contributor.js (FINAL FIXED VERSION) --- */

document.addEventListener('DOMContentLoaded', function() {
    
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
        });
    });

    // =========================================
// 2. SUPPLIER DETAILS (PROFILE & GALLERY) - FULLY FIXED
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
    
    if (saved.name) displayName.textContent = saved.name;
    if (saved.desc) displayDesc.textContent = saved.desc;
    if (saved.profilePic) displayProfile.src = saved.profilePic;
    if (saved.gallery && Array.isArray(saved.gallery)) {
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
displayGallery.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        if (confirm("Remove this photo from gallery?")) {
            e.target.closest('.gallery-item').remove();
        }
    }
});

// SAVE CHANGES - FULLY FIXED
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
    // 3. SUPPLY BATCH & HISTORY (FIXED)
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

    // --- C. Submit Logic (Fixed for new Structure) ---
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
                    // Note: We don't change ID or Date on update
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

    // --- D. Render History (Categorized View) ---
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
                // Add click event for expansion (ignoring buttons)
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

    // --- E. Action Modal (Update/Delete) ---
    window.openActionModal = function(id) {
        selectedBatchId = id;
        actionModal.classList.remove('hidden-mode');
    };

    btnActionDelete.addEventListener('click', function() {
        if (selectedBatchId) {
            supplyData = supplyData.filter(b => b.id !== selectedBatchId);
            localStorage.setItem('floodSupplyBatches', JSON.stringify(supplyData));
            renderSupplyHistory();
            actionModal.classList.add('hidden-mode');
            selectedBatchId = null;
        }
    });

// --- FIXED UPDATE BUTTON LOGIC ---
    btnActionUpdate.addEventListener('click', function() {
        if (selectedBatchId) {
            // Fix: Ensure we compare IDs loosely (==) just in case one is a string
            const batch = supplyData.find(b => b.id == selectedBatchId);
            
            if (batch) {
                // 1. Switch to "Make Contribution" Tab manually
                const tab = document.querySelector('[data-target="make-contribution"]');
                if(tab) tab.click();

                // 2. Set the Editing ID so the form knows we are updating
                editingBatchId = batch.id;
                
                // 3. Clear existing form rows
                if(itemsContainer) itemsContainer.innerHTML = '';

                // 4. Fill the Form with the Batch Data
                // Fill Category
                const catInput = document.getElementById('batch-category');
                // Note: Since we moved category to rows, we just ignore the main dropdown 
                // or let the first row set the precedent.
                
                // Fill Rows
                batch.items.forEach(item => {
                    // Use the helper to add rows with data
                    addFormRow(item.name, item.qty, item.category);
                });

                // 5. Close the Modal
                actionModal.classList.add('hidden-mode');
                selectedBatchId = null;
                
                // 6. Scroll to top so user sees the form
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // 7. Visual Feedback
                alert("Record loaded for editing. Make your changes and click 'Submit Supply List'.");
            } else {
                console.error("Batch not found for ID:", selectedBatchId);
            }
        }
    });

    btnCloseAction.addEventListener('click', function() {
        actionModal.classList.add('hidden-mode');
    });

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