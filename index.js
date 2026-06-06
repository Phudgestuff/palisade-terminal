// make sure the input box is always focused on
const inputSpace = document.getElementById("input");
inputSpace.addEventListener('blur', () => {
    inputSpace.focus();
});

// create scanlines for CRT effect
const scanlinesDiv = document.getElementById("scanlines");
const height = globalThis.innerHeight;
const scanLineSpace = 15; 
for (let i = 0; i < height-scanLineSpace; i += scanLineSpace) {
    const el = document.createElement("div");
    el.className = "scanline";
    el.style.top = `${i}px`;
    scanlinesDiv.appendChild(el);
}

// add text to the terminal output part by part
const targetDiv = document.getElementById("output");
function startTypeWriter(textToType) {
    let index = 0;
    const typingSpeed = 20; // Delay between characters in milliseconds

    function typeWriter() {
        if (index < textToType.length) {
            // Append the current character to the div
            let currentOutput;
            if (textToType.charAt(index) === "\n") {
                currentOutput = "<br>";
            }
            else {
                currentOutput = textToType.charAt(index);
            }
            index++;
            targetDiv.innerHTML += currentOutput;
            // Wait and call the function again for the next character
            setTimeout(typeWriter, typingSpeed);
        }
    }

    typeWriter();
}

// get the data from the information.json file
async function fetchJSONData() {
    try {
        const response = await fetch('information.json');
        if (!response.ok) {
            throw new Error();
        }

        let data = await response.json();

        startTypeWriter(data["introtext"]);
    } catch (error) {
        console.error("unable to fetch data")
    }
}
fetchJSONData();
new Promise((resolve, reject) => startTypeWriter(text));

const input = document.getElementById("input");

