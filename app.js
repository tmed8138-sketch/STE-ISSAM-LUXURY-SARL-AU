document.addEventListener('DOMContentLoaded', () => {
    const fields = {
        name: document.getElementById('card-name'),
        title: document.getElementById('card-title'),
        phone: document.getElementById('card-phone'),
        email: document.getElementById('card-email'),
        address: document.getElementById('card-address'),
        qrData: document.getElementById('qr-data')
    };

    const displays = {
        name: document.getElementById('display-name'),
        title: document.getElementById('display-title'),
        phone: document.getElementById('display-phone'),
        email: document.getElementById('display-email'),
        address: document.getElementById('display-address')
    };

    const qrcodeContainer = document.getElementById('qrcode-container');
    const saveBtn = document.getElementById('save-btn');
    const printBtn = document.getElementById('print-btn');

    // Create QR Code with optimized size for vertical thermal layout
    let qrCode = new QRCode(qrcodeContainer, {
        text: "https://issam-luxury.ma",
        width: 150, // Slightly larger for thermal clarity
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Initialize with defaults or localStorage
    function loadData() {
        const savedData = localStorage.getItem('issam_card_data');
        const data = savedData ? JSON.parse(savedData) : null;

        Object.keys(fields).forEach(key => {
            const val = data ? data[key] : getDefault(key);
            if (fields[key]) fields[key].value = val;
            if (displays[key]) {
                const prefix = key === 'phone' ? 'Tél: ' : (key === 'email' ? 'Email: ' : (key === 'address' ? 'Adresse: ' : ''));
                displays[key].textContent = prefix + val;
            }
        });
        updateQRCode(fields.qrData.value || "https://issam-luxury.ma");
    }

    loadData();

    // Save Logic
    saveBtn.addEventListener('click', () => {
        const dataToSave = {};
        Object.keys(fields).forEach(key => {
            dataToSave[key] = fields[key].value;
        });
        localStorage.setItem('issam_card_data', JSON.stringify(dataToSave));

        // Visual Feedback
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = "ENREGISTRÉ ✅";
        saveBtn.style.color = "#22c55e";
        saveBtn.style.borderColor = "#22c55e";

        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.color = "";
            saveBtn.style.borderColor = "";
        }, 2000);
    });

    // Sync Fields with Live Preview
    Object.keys(fields).forEach(key => {
        fields[key].addEventListener('input', () => {
            if (displays[key]) {
                const prefix = key === 'phone' ? 'Tél: ' : (key === 'email' ? 'Email: ' : (key === 'address' ? 'Adresse: ' : ''));
                displays[key].textContent = prefix + (fields[key].value || getDefault(key));
            }
            if (key === 'qrData') {
                updateQRCode(fields[key].value || "https://issam-luxury.ma");
            }
        });
    });

    function updateQRCode(data) {
        qrCode.clear();
        qrCode.makeCode(data);
    }

    function getDefault(key) {
        const defaults = {
            name: "ISSAM ZAKI",
            title: "LOCATION DE VOITURES DE LUXE",
            phone: "+212 689-336665 / +212 668-687959",
            email: "contact@issam-luxury.ma",
            address: "ROUTE MARRAKECH AZILAL STATION ZIZ"
        };
        return defaults[key] || "";
    }

    printBtn.addEventListener('click', () => {
        window.print();
    });
});
