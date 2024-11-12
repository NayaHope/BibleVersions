const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
let currentTheme = localStorage.getItem('theme') || 'light-mode'; // Default theme is light

document.addEventListener("DOMContentLoaded", () => {
    // Set the initial theme
    document.body.classList.add(currentTheme);
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.innerText = currentTheme === 'light-mode' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    
    // Handle theme switching
    themeToggle.addEventListener('click', toggleTheme);

    // Set the initial font style, size, and color
    updateFontStyles();
});

async function fetchVerse() {
    const book = document.getElementById('book').value.trim();
    const chapter = document.getElementById('chapter').value.trim();
    const verse = document.getElementById('verse').value.trim();
    const version = document.getElementById('version').value;

    if (!book || !chapter || !verse) {
        alert("Please fill in all fields.");
        return;
    }

    const url = `https://api.scripture.api.bible/v1/bibles/${version}/passages/${book}.${chapter}.${verse}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'api-key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error("Verse not found or invalid API request.");
        }

        const data = await response.json();
        document.getElementById('verse-text').innerText = `${book} ${chapter}:${verse} - ${data.data.content}`;

        // Update the font styles after fetching the verse
        updateFontStyles();
    } catch (error) {
        console.error("Error fetching verse:", error);
        document.getElementById('verse-text').innerText = "Sorry, something went wrong.";
    }
}

function toggleTheme() {
    if (currentTheme === 'light-mode') {
        currentTheme = 'dark-mode';
        document.body.classList.replace('light-mode', 'dark-mode');
    } else {
        currentTheme = 'light-mode';
        document.body.classList.replace('dark-mode', 'light-mode');
    }
    localStorage.setItem('theme', currentTheme); // Store the theme preference
    document.getElementById('theme-toggle').innerText = currentTheme === 'light-mode' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
}

// Update font styles based on the user's preferences
function updateFontStyles() {
    const fontStyle = document.getElementById('font-style').value;
    const fontSize = document.getElementById('font-size').value;
    const fontColor = document.getElementById('font-color').value;

    const verseText = document.getElementById('verse-text');
    verseText.style.fontFamily = fontStyle;
    verseText.style.fontSize = fontSize + "px";
    verseText.style.color = fontColor;
}

// Export functions
function exportToImage() {
    const verseText = document.getElementById('verse-text');
    html2canvas(verseText).then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageData;
        link.download = "verse.png";
        link.click();
    });
}

function exportToPDF() {
    const verseText = document.getElementById('verse-text');
    const doc = new jsPDF();

    doc.text(verseText.innerText, 10, 10);
    doc.save("verse.pdf");
}

function exportToDoc() {
    const verseText = document.getElementById('verse-text');
    const docContent = `<html><body><p>${verseText.innerText}</p></body></html>`;

    const converted = htmlDocx.asBlob(docContent);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(converted);
    link.download = "verse.docx";
    link.click();
}