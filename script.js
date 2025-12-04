document.addEventListener('DOMContentLoaded', function() {
    
    // 1. CHECK SAVED LANGUAGE
    const currentLang = localStorage.getItem('siteLang');
    const body = document.body;

    // 2. APPLY LANGUAGE MODE
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
        // 3. IF NEW USER: Show Popup
        createPopup();
    }

    // 4. INJECT FOOTER
    injectFooter();
});

// --- CREATE POPUP ---
function createPopup() {
    const modal = document.createElement('div');
    modal.id = 'languageModal';
    modal.className = 'lang-modal';

    modal.innerHTML = `
        <div class="lang-content">
            <h2 style="margin-bottom:20px;">
                Select Language<br>
                <span style="font-family:  'Noto Sans Sinhala', sans-serif; font-size:0.8em; color:#ccc;">භාෂාව තෝරන්න </span><br>
                <span style="font-size:0.8em; color:#ccc;">மொழியைத் தேர்ந்தெடுக்கவும்</span>
            </h2>
            <button class="lang-btn btn-en" onclick="setLanguage('en')">English</button>
            <button class="lang-btn btn-si" onclick="setLanguage('si')"><span style="font-family: 'Yaldevi', 'Noto Sans Sinhala', sans-serif;">සිංහල</span></button>
            <button class="lang-btn btn-ta" onclick="setLanguage('ta')">தமிழ்</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// --- SET LANGUAGE FUNCTION ---
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

// --- INJECT FOOTER (English, Sinhala, Tamil) ---
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
                    <p>
                        <span class="lang-en">Email:</span>
                        <span class="lang-si">විද්‍යුත් තැපෑල:</span>
                        <span class="lang-ta">மின்னஞ்சல்:</span>
                        chamath.24@cse.mrt.ac.lk
                    </p>
                    <p>
                        <span class="lang-en">Hotline:</span>
                        <span class="lang-si">ක්ෂණික ඇමතුම්:</span>
                        <span class="lang-ta">அவசர அழைப்பு:</span>
                        +94 78 5200024
                    </p>
                </div>

                <div class="footer-section">
                    <h3>
                        <span class="lang-en">Emergency Contacts</span>
                        <span class="lang-si">හදිසි ඇමතුම් අංක</span>
                        <span class="lang-ta">அவசரத் தொடர்பு எண்கள்</span>
                    </h3>

                    <p>
                        <span class="lang-en">Disaster Management Centre:</span>
                        <span class="lang-si">ආපදා කළමනාකරණ මධ්‍යස්ථානය:</span>
                        <span class="lang-ta">அனர்த்த முகாமைத்துவ நிலையம்:</span>
                        <span class="emergency-number">117</span>
                    </p>
                    <p>
                        <span class="lang-en">Police Emergency:</span>
                        <span class="lang-si">පොලිස් හදිසි ඇමතුම්:</span>
                        <span class="lang-ta">காவல்துறை அவசர சேவை:</span>
                        <span class="emergency-number">119</span>
                    </p>
                    <p>
                        <span class="lang-en">Suwa Seriya Ambulance:</span>
                        <span class="lang-si">සුව සැරිය ගිලන් රථ සේවාව:</span>
                        <span class="lang-ta">சுவ செரிய அம்புலன்ஸ்:</span>
                        <span class="emergency-number">1990</span>
                    </p>
                    <p>
                        <span class="lang-en">Fire Brigade:</span>
                        <span class="lang-si">ගිනි නිවන හමුදාව:</span>
                        <span class="lang-ta">தீயணைப்பு படை:</span>
                        <span class="emergency-number">110</span>
                    </p>
                    <p>
                        <span class="lang-en">NBRO (Landslides):</span>
                        <span class="lang-si">ජාතික ගොඩනැගිලි පර්යේෂණ:</span>
                        <span class="lang-ta">தேசிய கட்டிட ஆராய்ச்சி நிறுவனம்:</span>
                        <span class="emergency-number">011-2588946</span>
                    </p>
                    <p>
                        <span class="lang-en">Dept of Meteorology:</span>
                        <span class="lang-si">කාලගුණ විද්‍යා දෙපාර්තමේන්තුව:</span>
                        <span class="lang-ta">வளிமண்டலவியல் திணைக்களம்:</span>
                        <span class="emergency-number">011-2686686</span>
                    </p>
                    <p>
                        <span class="lang-en">Navy HQ (Boat Rescue):</span>
                        <span class="lang-si">නාවික හමුදා මූලස්ථානය:</span>
                        <span class="lang-ta">கடற்படை தலைமையகம்:</span>
                        <span class="emergency-number">011-2445368</span>
                    </p>
                    <p>
                        <span class="lang-en">Air Force (Helicopter):</span>
                        <span class="lang-si">ගුවන් හමුදා මූලස්ථානය:</span>
                        <span class="lang-ta">விமானப்படை தலைமையகம்:</span>
                        <span class="emergency-number">116</span>
                    </p>
                    <p>
                        <span class="lang-en">Army Headquarters:</span>
                        <span class="lang-si">යුධ හමුදා මූලස්ථානය:</span>
                        <span class="lang-ta">இராணுவத் தலைமையகம்:</span>
                        <span class="emergency-number">113</span>
                    </p>
                </div>

                <div class="footer-section">
                    <h3>
                        <span class="lang-en">About System</span>
                        <span class="lang-si">පද්ධතිය පිළිබඳව</span>
                        <span class="lang-ta">அமைப்பைப் பற்றி</span>
                    </h3>
                    <p>
                        <span class="lang-en">
                            This comprehensive platform unifies flood management by connecting victims, travelers, contributors, NGOs, and Grama Niladharis into a single network. We aim to coordinate civilians and officials for rapid disaster response. Currently, we are planning to expand these services further with the support of the government.
                        </span>
                        <span class="lang-si">
                            මෙය ගංවතුර කළමනාකරණය සඳහා වූ පුළුල් වේදිකාවකි. අපි විපතට පත් වූවන්, සංචාරකයින්, ආධාරකරුවන්, රාජ්‍ය නොවන සංවිධාන සහ ග්‍රාම නිලධාරීන් එකම ජාලයකට සම්බන්ධ කරමු. රජයේ සහාය ඇතිව මෙම පද්ධතිය ජාතික මට්ටම දක්වා පුළුල් කිරීමට අපි දැනට සැලසුම් කරමින් සිටිමු.
                        </span>
                        <span class="lang-ta">
                            இது வெள்ள முகாமைத்துவத்திற்கான ஒரு விரிவான தளமாகும். பாதிக்கப்பட்டவர்கள், பயணிகள், பங்களிப்பாளர்கள், அரச சார்பற்ற நிறுவனங்கள் மற்றும் கிராம உத்தியோகத்தர்களை ஒரே அமைப்பில் இணைக்கிறோம். அரசாங்கத்தின் ஆதரவுடன் இச்சேவைகளை தேசிய அளவில் விரிவுபடுத்த திட்டமிட்டுள்ளோம்.
                        </span>
                    </p>
                </div>
            </div>

            <div class="copyright">
                &copy; 2025 Flood Management System. All Rights Reserved.
            </div>
        </footer>
        `;
    }
}
// Simple & Bulletproof Mobile Menu
