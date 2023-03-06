const html = document.documentElement;

if (localStorage.fontSize) {
	html.style.fontSize = localStorage.fontSize;
}

const multiplyButton = document.querySelector("#multiply"),
      divideButton = document.querySelector("#divide"),
      incrementButton = document.querySelector("#increment"),
      decrementButton = document.querySelector("#decrement"),
      equalsButton = document.querySelector("#equals"),
      cropButton = document.querySelector("#slice"),
      input = document.querySelector("input"),
	  settings = document.querySelector(".calc__controls"),
	  buttonOpenSettings = document.querySelector("#open-settings"),
	  buttonCloseSettings = document.querySelector(".calc__controls-close"),
	  selectForTheme = document.querySelector("#theme"),
	  scaleWrapper = document.querySelector(".scale-wrapper"),
	  defaultSettingsButton = document.querySelector("#default-settings"),
	  gradientButton = document.querySelector("#with-gradient");

multiplyButton.addEventListener("click", () => {
    input.value += " * ";
});

divideButton.addEventListener("click", () => {
    input.value += " / ";
});

incrementButton.addEventListener("click", () => {
    input.value += " + ";
});

decrementButton.addEventListener("click", () => {
    input.value += " - ";
});

cropButton.addEventListener("click", () => {
    input.value = input.value.slice(0, -1);
});

equalsButton.addEventListener("click", () => {
    let scriptText = `
        try {
            input.value = ${input.value};
        } catch (error) { input.value = "Err2" }
    `;

    try {
		let a = new Function(scriptText);
		a();
		input.selectionStart = input.value.length;
		input.selectionEnd = input.value.length;
	} catch (error) {
		console.warn(error);
		input.value = "FATAL";
	}
});

document.querySelectorAll(".calc button").forEach(button => {
    button.addEventListener("click", (event) => {
        if (!isNaN(event.target.innerHTML)) {
            input.value += event.target.innerHTML.trim();
        }
    });
});

input.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		equalsButton.click();
		translateTrueAndFalse(event.target);
	}
});

input.addEventListener("input", (event) => {
	translateTrueAndFalse(event.target);
});

function translateTrueAndFalse(element) {
}

// Dark / white theme (or with gradient)
selectForTheme.addEventListener("input", function() {
	html.dataset.theme = (selectForTheme.value);
	localStorage.theme = selectForTheme.value;
});

if (localStorage.theme) {
	html.dataset.theme = localStorage.theme;
	selectForTheme.value = localStorage.theme;
}

gradientButton.addEventListener("input", () => {
	if (gradientButton.querySelector("input").checked) {
		html.setAttribute("with-gradient", "");
		localStorage.setItem("withGradient", true);
	} else if (!gradientButton.querySelector("input").checked) {
		html.removeAttribute("with-gradient");
		localStorage.setItem("withGradient", false);
	}
});

if (localStorage.withGradient === "true") {
	html.setAttribute("with-gradient", "");
	gradientButton.querySelector("input").checked = "checked";
}

if (localStorage.withGradient === "false") {
	gradientButton.querySelector("input").removeAttribute("checked");
}

// General settings
buttonOpenSettings.addEventListener("click", () => {
	settings.classList.remove("hide");
	settings.classList.add("show");
	setTimeout(() => {
		settings.style.display = "block";
		buttonOpenSettings.style.display = "none";
	});
});

buttonCloseSettings.addEventListener("click", () => {
	settings.classList.add("hide");
	settings.classList.remove("show");
	setTimeout(() => {
		settings.style.display = "";
		buttonOpenSettings.style.display = "";
	}, 100);
});

defaultSettingsButton.addEventListener("click", () => {
	localStorage.fontSize = "";
	localStorage.theme = "white";
	localStorage.withGradient = false;
	document.location.reload();
});

// Scale UI
let rem = +window.getComputedStyle(html).fontSize.replace("px", "");
scaleWrapper.addEventListener("click", (event) => {
	if (event.target === scaleWrapper.querySelector("#decrement") ||
		event.target === scaleWrapper.querySelector("#increment")) {
			// event.target.id === "decrement" || "increment"
			if (event.target.id === "decrement") {
				rem++;
				html.style.fontSize = rem + "px";
			}

			if (event.target.id === "increment") {
				rem--;
				html.style.fontSize = rem + "px";
			}

			if (event.target.id === "decrement" || "increment") {
				localStorage.setItem("fontSize", `${rem}px`);
			}
		}
});
