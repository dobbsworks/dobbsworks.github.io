function HandleError(e) {
    let container = document.getElementById("errorContainer");
    let textArea = document.getElementById("errorReport");
    if (container && textArea) {
        if (!container.classList.contains("active")) {
            container.classList.add("active");
        }
        if (textArea.value.length < 5000) {
            if (textArea.value.length === 0) {
                textArea.value = "Error report " + (new Date()).toString();
            }
            textArea.value = textArea.value + "\n" + e.stack;
        }
    } else {
        console.error(e);
    }
}

