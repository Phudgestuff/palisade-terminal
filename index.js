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
const output = document.getElementById("output");
function startTypeWriter(textToType) {
    let index = 0;
    const typingSpeed = 5; // Delay between characters in milliseconds

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
            output.innerHTML += currentOutput;
            output.scrollIntoView({ behavior: 'auto', block: 'end' })
            // Wait and call the function again for the next character
            setTimeout(typeWriter, typingSpeed);
        }
    }

    typeWriter();
}

// get the data from the information.yaml file
async function fetchYAMLData() {
    try {
        const response = await fetch('information.yaml');
        if (!response.ok) {
            throw new Error();
        }

        // 1. Get the raw YAML text from the response
        const yamlText = await response.text();
        
        // 2. Parse the YAML text into a native JavaScript object
        return jsyaml.load(yamlText);
    } catch {
        console.error("unable to fetch data");
        return null; // Returning null keeps the data structure predictable if it fails
    }
}

const data = await fetchYAMLData();

startTypeWriter(data["introtext"])

const input = document.getElementById("input");
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (output.innerHTML === "") {
            output.innerHTML += `<b>> ${input.value}</b><br>`;
        } else {
            output.innerHTML += `<br><br><b>> ${input.value}</b><br>`;
        }
        
        const value = input.value.toLowerCase()
        // check that the prompt value exists
        if (data[value]) {
            startTypeWriter(data[value]);
        } else if (value === "clear" || value === "cls") {
            output.innerHTML = ""
        } else {
            startTypeWriter(`Error: No entry found for \`${input.value}\``)
        }
        output.scrollIntoView({ behavior: 'auto', block: 'end' })
        input.value = "";
    }
});
