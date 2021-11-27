var isEditMode = false;
var editorScenario = CreateDefaultScenario();
var selectedTileType = "";

function SwitchToEditor() {
    uiHandler.elements = [];
    isEditMode = true;
    editorScenario = CreateDefaultScenario();
    CreateHtmlFromScenario(editorScenario);
    let container = document.getElementById("editorContainer");
    container.style.display = "block";
    let tileButtonContainer = document.getElementById("tileButtons");
    for (let tileChar of Object.keys(tileDirectory)) {
        let tileName = tileDirectory[tileChar].name;
        let button = document.createElement("button");
        button.innerHTML = tileName;
        button.className = "tileButton";
        button.onclick = () => {
            Array.from(document.getElementsByClassName("selected")).
                forEach(a => a.classList.remove("selected"));
            button.classList.add("selected");
            SetSelectedTileType(tileChar);
        }
        tileButtonContainer.appendChild(button);
    }
    LoadScenarioTerrain(editorScenario.layout);
}

function DrawEditorGrid() {
    ctx.strokeStyle = "#0004";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 13; i++) {
        let x = 160 + (i - 6) * 40 - 20 + canvas.width / 2;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, 0);
        ctx.stroke();
    }
    for (let i = 0; i <= 13; i++) {
        let y = (i - 6) * 40 - 20 + canvas.height / 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width, y);
        ctx.lineTo(320, y);
        ctx.stroke();
    }
}

function EditorUpdate() {
    if (isMouseDown) {
        let tileX = Math.floor((mouseX + 10) / 40) - 9;
        let tileY = Math.floor(mouseY / 40) - 1;
        if (tileX < 13 && tileX >= 0 && tileY < 13 && tileY >= 0) {
            SetTile(tileX, tileY);
        }
    }
}

function SetSelectedTileType(char) {
    selectedTileType = char;
}

function SetTile(tileX, tileY) {
    if (!selectedTileType) return;

    let isUnique = tileDirectory[selectedTileType].isUnique;
    if (isUnique) {
        editorScenario.layout = editorScenario.layout.split(selectedTileType).join("-");
    }

    let rows = editorScenario.layout.split("\n");
    let cells = rows[tileY].split("");
    cells[tileX] = selectedTileType;
    rows[tileY] = cells.join("");
    editorScenario.layout = rows.join("\n");

    LoadScenarioTerrain(editorScenario.layout);
}

function TestScenario() {
    ReturnToMainMenu();
    uiHandler.elements = [];
    LoadScenario(editorScenario);
}

function ExportScenario() {
    let hasBase = editorScenario.layout.indexOf("@") > -1;
    let hasHat = editorScenario.layout.indexOf("H") > -1;
    if (!hasBase) {
        alert("Layout requires a South Pole.");
        return;
    }
    if (!hasHat) {
        alert("Layout requires a Player Start.");
        return;
    }

    editorScenario.layout = editorScenario.layout;
    let text = JSON.stringify(editorScenario);
    text = text.split("\n").join("");
    prompt("Here's your exported scenario:", text);
}

function ImportScenario() {
    let text = prompt("Enter scenario text:");
    let scenario = JSON.parse(text);
    editorScenario = scenario;
    
    CreateHtmlFromScenario(editorScenario);
    
    LoadScenarioTerrain(editorScenario.layout);
}

function CreateHtmlFromScenario(scenario) {
    let container = document.getElementById("editorPanels");
    container.innerHTML = "";

    for (let wave of scenario.waves) {
        container.appendChild(CreateHtmlFromWave(wave, scenario));
    }
}

function CreateHtmlFromWave(wave, scenario) {
    let container = document.createElement("div");
    container.className = "editorWave";

    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = wave.name;
    nameInput.className = "waveName";
    nameInput.placeholder = "Wave name";
    container.appendChild(nameInput);
    LinkInputToModel(nameInput, wave, "name");

    let announcementInput = document.createElement("input");
    announcementInput.type = "text";
    announcementInput.value = wave.announcement;
    announcementInput.className = "waveAnnouncement";
    announcementInput.placeholder = "Wave announcement";
    container.appendChild(announcementInput);
    LinkInputToModel(announcementInput, wave, "announcement");

    let delayInput = CreateNumInput({ value: wave.delay, min: 0, class: "waveDelay" });
    container.appendChild(SurroundWithLabel(delayInput, "Delay"));
    LinkInputToModel(delayInput, wave, "delay");


    let waveSpawnsContainer = document.createElement("div");
    waveSpawnsContainer.className = "waveSpawns";
    for (let waveSpawn of wave.spawns) {
        waveSpawnsContainer.appendChild(CreateHtmlFromWaveSpawn(waveSpawn, wave));
    }
    container.appendChild(waveSpawnsContainer);

    // add new wave Button
    let newWaveButton = document.createElement("button");
    newWaveButton.innerHTML = "Add new wave";
    newWaveButton.className = "newWaveButton";
    newWaveButton.onclick = () => {
        let newWave = CreateDefaultWave();
        let targetIndex = scenario.waves.indexOf(wave) + 1;
        scenario.waves.splice(targetIndex, 0, newWave);
        let newHtmlElement = CreateHtmlFromWave(newWave, scenario);
        container.insertAdjacentElement("afterend", newHtmlElement);
    }
    container.appendChild(newWaveButton);

    let deleteWaveButton = document.createElement("button");
    deleteWaveButton.innerHTML = "x";
    deleteWaveButton.className = "deleteWaveButton";
    deleteWaveButton.onclick = () => {
        if (scenario.waves.length <= 1) {
            return;
        }
        let confirmed = confirm("Are you sure you want to delete this element?");
        if (confirmed) {
            let targetIndex = scenario.waves.indexOf(wave);
            scenario.waves.splice(targetIndex, 1);
            container.remove();
        }
    }
    container.appendChild(deleteWaveButton);

    return container;
}

function CreateHtmlFromWaveSpawn(waveSpawn, wave) {
    let container = document.createElement("div");
    container.className = "waveSpawn";

    let enemySelect = document.createElement("select");
    for (let enemyName in enemyClasses) {
        let option = document.createElement("option");
        option.value = enemyName;
        option.innerHTML = enemyName;
        if (waveSpawn.enemy === enemyName) {
            option.selected = "selected";
        }
        enemySelect.appendChild(option);
    }
    LinkInputToModel(enemySelect, waveSpawn, "enemy");

    let numInput = CreateNumInput({ value: waveSpawn.count, min: 0, class: "spawnNum" });
    LinkInputToModel(numInput, waveSpawn, "count");
    let xSpawnInput = CreateNumInput({ value: waveSpawn.spawnPoint.x, min: -13, max: 13, class: "spawnX" });
    LinkInputToModel(xSpawnInput, waveSpawn, "spawnPoint.x");
    let ySpawnInput = CreateNumInput({ value: waveSpawn.spawnPoint.y, min: -13, max: 13, class: "spawnY" });
    LinkInputToModel(ySpawnInput, waveSpawn, "spawnPoint.y");
    let speedInput = CreateNumInput({ value: waveSpawn.spawnSpeedRatio, min: -13, max: 13, class: "speedRatio", step: "" });
    LinkInputToModel(speedInput, waveSpawn, "spawnSpeedRatio");

    [
        SurroundWithLabel(enemySelect, "Enemy Type"),
        SurroundWithLabel(numInput, "Number to spawn"),
        SurroundWithLabel(xSpawnInput, "x Spawn"),
        SurroundWithLabel(ySpawnInput, "y Spawn"),
        SurroundWithLabel(speedInput, "Spawn Speed")
    ].forEach(a => container.appendChild(a));


    // add new spawn Button
    let newSpawnButton = document.createElement("button");
    newSpawnButton.innerHTML = "Add new spawn";
    newSpawnButton.className = "newSpawnButton";
    newSpawnButton.onclick = () => {
        let newSpawn = CreateDefaultWaveSpawn();
        let targetIndex = wave.spawns.indexOf(waveSpawn) + 1;
        wave.spawns.splice(targetIndex, 0, newSpawn);
        let newHtmlElement = CreateHtmlFromWaveSpawn(newSpawn, wave);
        container.insertAdjacentElement("afterend", newHtmlElement);
    }
    container.appendChild(newSpawnButton);

    let deleteSpawnButton = document.createElement("button");
    deleteSpawnButton.innerHTML = "x";
    deleteSpawnButton.className = "deleteSpawnButton";
    deleteSpawnButton.onclick = () => {
        let confirmed = confirm("Are you sure you want to delete this element?");
        if (confirmed) {
            let targetIndex = wave.spawns.indexOf(waveSpawn);
            wave.spawns.splice(targetIndex, 1);
            container.remove();
        }
    }
    container.appendChild(deleteSpawnButton);

    return container;
}

function CreateNumInput(attrs) {
    let input = document.createElement("input");
    input.type = "number";
    input.step = "1";
    input.value = "0";
    for (let attrName in attrs) {
        input[attrName] = attrs[attrName];
    }
    return input;
}

function SurroundWithLabel(element, label) {
    let labelObj = document.createElement("label");
    labelObj.appendChild(element);

    let labelText = document.createElement("span");
    labelText.innerHTML = label;
    labelObj.appendChild(labelText);

    return labelObj;
}

function CreateDefaultScenario() {
    return {
        waves: [CreateDefaultWave()],
        layout: CreateDefaultLayout()
    }
}

function CreateDefaultLayout() {
    let lines = [];
    for (let i = 0; i < 13; i++) {
        if (i === 7) {
            lines.push("     -@-     ");
        } else if (i === 6) {
            lines.push("     -H-     ");
        } else lines.push("             ");
    }
    return lines.join("\n");
}

function CreateDefaultWave() {
    return {
        name: "New Wave",
        announcement: "",
        delay: 0,
        spawns: [
            CreateDefaultWaveSpawn()
        ]
    }
}

function CreateDefaultWaveSpawn() {
    return {
        enemy: "Penguin",
        count: 16,
        spawnPoint: { x: -10, y: 0 },
        spawnSpeedRatio: 1
    };
}

function LinkInputToModel(input, model, prop) {
    input.onchange = () => {
        let isNumeric = input.type === "number";
        let value = isNumeric ? +(input.value) : input.value;

        // wtf am I doing this for
        let propChain = prop.split(".");

        let targetModel = model;
        let finalProp = propChain.pop();
        for (let propName of propChain) {
            targetModel = model[propName];
        }
        targetModel[finalProp] = value;
    }
}

function ReturnToMainMenu() {
    isEditMode = false;
    sprites = [];
    
    let container = document.getElementById("editorContainer");
    container.style.display = "none";
    let tileButtonContainer = document.getElementById("tileButtons");
    tileButtonContainer.innerHTML = "";

    new MainMenu().LoadMainMenu();
}