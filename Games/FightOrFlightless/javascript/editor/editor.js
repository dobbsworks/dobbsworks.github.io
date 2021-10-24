var isEditMode = false;
var editorScenario = CreateDefaultScenario();

function SwitchToEditor() {
    isEditMode = true;
    editorScenario = CreateDefaultScenario();
    CreateHtmlFromScenario(editorScenario);
    let container = document.getElementById("editorContainer");
    container.style.display = "block";
    let button = document.getElementById("editButton");
    button.style.display = "none";
}

function ExportScenario() {
    let text = JSON.stringify(editorScenario);
    text = text.split("\n").join("");
    prompt("Here's your exported scenario:", text);
}

function ImportScenario() {
    let text = prompt("Enter scenario text:");
    let scenario = JSON.parse(text);
    editorScenario = scenario;
    CreateHtmlFromScenario(editorScenario);
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
    nameInput.placeholder = "Wave announcement";
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
    newWaveButton.innerHTML = "+";
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
    newSpawnButton.innerHTML = "+";
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
        layout: ""
    }
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