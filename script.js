const apiKey = 'ea4ef61228194972a082def58aca7873'; // Your API key

// Function to fetch Bible chapter content
async function fetchChapter() {
    const book = document.getElementById('book').value;
    const chapter = document.getElementById('chapter').value;
    const bibleVersion = document.getElementById('bible-version').value;
    const url = `https://api.scripture.api.bible/v1/bibles/${bibleVersion}/chapters?book=${book}&chapter=${chapter}`;

    try {
        const response = await fetch(url, {
            headers: { 'api-key': apiKey },
        });

        if (!response.ok) throw new Error('Chapter not found');
        const data = await response.json();
        displayChapterContent(data.data.content);
    } catch (error) {
        console.error('Error fetching chapter:', error);
        document.getElementById('chapter-content').innerHTML = 'Error fetching chapter.';
    }
}

// Function to display chapter content
function displayChapterContent(content) {
    const chapterContent = document.getElementById('chapter-content');
    chapterContent.innerHTML = content || "No content available.";
    applyFontCustomization();
}

// Font customization handler
function applyFontCustomization() {
    const fontStyle = document.getElementById('font-style').value;
    const fontSize = document.getElementById('font-size').value;
    const fontColor = document.getElementById('font-color').value;

    const chapterContent = document.getElementById('chapter-content');
    chapterContent.style.fontFamily = fontStyle;
    chapterContent.style.fontSize = fontSize + "px";
    chapterContent.style.color = fontColor;
}

// Export functions
function exportToImage() {
    const verseText = document.getElementById('chapter-content');
    html2canvas(verseText).then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageData;
        link.download = "verse.png";
        link.click();
    });
}

function exportToPDF() {
    const verseText = document.getElementById('chapter-content');
    const doc = new jsPDF();
    doc.text(verseText.innerText, 10, 10);
    doc.save("verse.pdf");
}

function exportToDoc() {
    const verseText = document.getElementById('chapter-content');
    const docContent = `<html><body><p>${verseText.innerText}</p></body></html>`;
    const converted = htmlDocx.asBlob(docContent);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(converted);
    link.download = "verse.docx";
    link.click();
}

// Theme toggle
const themeToggleButton = document.getElementById('theme-toggle');
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});
