// get the data from the information.json file
let data;
async function fetchJSONData() {
    try {
        const response = await fetch('information.json');
        if (!response.ok) {
            throw new Error();
        }

        data = await response.json();
    } catch (error) {
        console.error("unable to fetch data")
    }
}
fetchJSONData();

// make sure the input box is always focused on
let inputSpace = document.getElementById("input");
inputSpace.addEventListener('blur', () => {
    inputSpace.focus();
});

// create scanlines for CRT effect
let scanlinesDiv = document.getElementById("scanlines");
let height = window.innerHeight;
let scanLineSpace = 15; 
for (let i = 0; i < height-scanLineSpace; i += scanLineSpace) {
    let el = document.createElement("div");
    el.className = "scanline";
    el.style.top = `${i}px`;
    scanlinesDiv.appendChild(el);
}

// add text to the terminal output part by part
let targetDiv = document.getElementById("output");
let text = data["introtext"];
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
new Promise((resolve, reject) => startTypeWriter(text));

let input = document.getElementById("input");

