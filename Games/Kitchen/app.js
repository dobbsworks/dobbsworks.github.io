
// 🎵 come on down, to the hover cat kitchen
// we've got everything your mouth could be wishin'
// foooooor
// and so much moooore
//


var gameSpeed = 10.0;
var buttons = [];
var events = [];
var gameTime = 0.0;


//https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#examples
// TODO
// REDO for drag and drop interface???
// each inventory row includes a draggable
// buttons still exist for purchase/travel
// replace recipe buttons in kitchen with "appliances" object
// like cutting board/toaster/counter
// appliances can have input and output panels
// can't drag to input when output has items

// employees - allow drag and drop?
//      automatically press any button every x seconds


var locations = {
    transit: {
        name: "In transit",
        filter: "saturate(0)",
    },
    kitchen: {
        name: "The Kitchen",
        filter: "",
    },
    foh: {
        name: "Front of House",
        filter: "hue-rotate(-40deg)",
    },
    grocery: {
        name: "Grocery Store",
        filter: "saturate(1) hue-rotate(150deg)"
    },
    appliances: {
        name: "Appliance Store",
        filter: "saturate(0.5) hue-rotate(50deg)"
    },

}

var resources = {
    money: {
        name: "Money",
    },

    bread: {
        name: "Loaves of bread",
        buyLocation: locations.grocery,
        price: 5,
    },
    lettuce: {
        name: "Heads of lettuce",
        buyLocation: locations.grocery,
        price: 2,
    },
    tomato: {
        name: "Tomatoes",
        buyLocation: locations.grocery,
        price: 1,
    },
    tomato: {
        name: "Potatoes",
        buyLocation: locations.grocery,
        price: 1,
        buyQuantity: 10,
    },
    flour: {
        name: "Flour",
        buyLocation: locations.grocery,
        price: 15,
        buyQuantity: 20,
    },
    water: {
        name: "Cups of water",
    },

    slicedBread: {
        name: "Slices of bread",
    },
    breadDough: {
        name: "Bread dough",
    },
    choppedLettuce: {
        name: "Chopped lettuce",
    },
    slicedTomato: {
        name: "Tomato slices",
    },
    toast: {
        name: "Pieces of toast",
        sellPrice: 5,
    },
    cupOfWater: {
        name: "CupsOfWater",
    },

    cuttingBoard: {
        name: "Cutting boards",
        buyLocation: locations.appliances,
        price: 15,
    },
    mixingBowl: {
        name: "Mixing bowls",
        buyLocation: locations.appliances,
        price: 10,
    },
    oven: {
        name: "Ovens",
        buyLocation: locations.appliances,
        price: 300,
    },
    toaster: {
        name: "Toasters",
        buyLocation: locations.appliances,
        price: 20,
    },
    cup: {
        name: "Empty cups",
        buyLocation: locations.appliances,
        price: 2,
    },
    sink: {
        name: "Sinks",
        buyLocation: locations.appliances,
        price: 200,
    },
}

var recipes = [
    {
        display: "Cut lettuce",
        baseTime: 10,
        locations: [locations.kitchen],
        inputs: [{item: resources.lettuce, amount: 1}, ],
        catalysts: [{item: resources.cuttingBoard, amount: 1}],
        outputs: [{item: resources.choppedLettuce, amount: 5}]
    },
    {
        display: "Slice tomato",
        baseTime: 10,
        locations: [locations.kitchen],
        inputs: [{item: resources.tomato, amount: 1}, ],
        catalysts: [{item: resources.cuttingBoard, amount: 1}],
        outputs: [{item: resources.slicedTomato, amount: 10}]
    },
    {
        key: "slicebread",
        display: "Slice bread",
        baseTime: 10,
        locations: [locations.kitchen],
        inputs: [{item: resources.bread, amount: 1}, ],
        catalysts: [{item: resources.cuttingBoard, amount: 1}],
        outputs: [{item: resources.slicedBread, amount: 20}]
    },
    {
        key: "cupofwater",
        display: "Fill cup of water",
        baseTime: 3,
        locations: [locations.kitchen],
        inputs: [{item: resources.cup, amount: 1}, ],
        catalysts: [{item: resources.sink, amount: 1}],
        outputs: [{item: resources.cupOfWater, amount: 1}]
    },
    {
        key: "toastbread",
        display: "Toast bread",
        baseTime: 15,
        locations: [locations.kitchen],
        inputs: [{item: resources.slicedBread, amount: 1}, ],
        catalysts: [{item: resources.toaster, amount: 1}],
        outputs: [{item: resources.toast, amount: 1}]
    },
    {
        key: "mixdough",
        display: "Make bread dough",
        baseTime: 30,
        locations: [locations.kitchen],
        inputs: [{item: resources.flour, amount: 1}, {item: resources.cupOfWater, amount: 1}, ],
        catalysts: [{item: resources.mixingBowl, amount: 1}],
        outputs: [{item: resources.breadDough, amount: 1}, {item: resources.cup, amount: 1}]
    },
    {
        key: "bakebread",
        display: "Bake bread",
        baseTime: 60,
        locations: [locations.kitchen],
        inputs: [{item: resources.breadDough, amount: 1}, ],
        catalysts: [{item: resources.oven, amount: 1}],
        outputs: [{item: resources.bread, amount: 1}]
    },

    // {
    //     baseTime: 0.5,
    //     locations: [locations.grocery],
    //     inputs: [{item: resources.money, amount: 5}, ],
    //     outputs: [{item: resources.bread, amount: 1} ]
    // },
    // {
    //     baseTime: 0.5,
    //     locations: [locations.grocery],
    //     inputs: [{item: resources.money, amount: 1}, ],
    //     outputs: [{item: resources.tomato, amount: 1} ]
    // },
    // {
    //     baseTime: 0.5,
    //     locations: [locations.grocery],
    //     inputs: [{item: resources.money, amount: 2}, ],
    //     outputs: [{item: resources.lettuce, amount: 1} ]
    // },
    {
        key: "rummage",
        display: "Rummage for loose change",
        baseTime: 0.5,
        locations: [],
        inputs: [],
        outputs: [{item: resources.money, amount: 1} ]
    },
];

var currentLocation = locations.kitchen;


window.onload = Init;
function Init() {
    InitializeResources();
    InitializeLocations();
    InitializeRecipes();
    RegisterEvents();
    DoIntroCinematic();
    Loop();
    
}


function InitializeResources() {
    for (const [key, resource] of Object.entries(resources)) {
        resource.key = key;
        resource.displayed = false;
        resource.div = null;
        resource.displaySpan = null;
        resource.value = 0;

        if (resource.price !== undefined) {
            recipes.push({
                baseTime: 0.2,
                locations: [resource.buyLocation || locations.grocery],
                inputs: [{item: resources.money, amount: resource.price}, ],
                outputs: [{item: resource, amount: resource.buyQuantity || 1} ],
                display: "Buy " + resource.name,
                key: "buy_" + key,
            })
        }
        if (resource.sellPrice !== undefined) {
            recipes.push({
                baseTime: 20.0,
                locations: [locations.foh],
                inputs: [{item: resource, amount: 1} ],
                outputs: [{item: resources.money, amount: resource.sellPrice}, ],
                display: "Sell " + resource.name,
                key: "sell_" + key,
            })
        }

        AddResourceDOM(resource);
    }
}
function InitializeLocations() {
    for (const [key, location] of Object.entries(locations)) {
        location.key = key;
        location.display = location.name;
        location.unlocked = false;
        location.locations = [];
        //location.locations = Object.values(locations).filter(a => a != location && a != locations.transit);
    }
}
function InitializeRecipes() {
    for (const [key, recipe] of Object.entries(recipes)) {
        if (!recipe.key) recipe.key = key;
        recipe.unlocked = false;
        if (recipe.display == null) {
            recipe.display = "Make " + recipe.outputs[0].item.name;
        }
        if (recipe.catalysts == undefined) recipe.catalysts = [];
        recipe.counter = 0;
    }
}


let previousFrame = 0;
function Loop() {
    if (previousFrame != 0) {
        let delta = performance.now() - previousFrame;
        Tick(delta);
    }
    previousFrame = performance.now();
    requestAnimationFrame(Loop);
}


function Tick(delta) {
    delta *= gameSpeed;
    gameTime += delta;
    for (let resource of Object.values(resources)) {
        resource.displaySpan.innerText = resource.value;
    }
    CheckEvents(null);
    for (let button of buttons) {

        for (let instance of button.instances) {
            let actionPercent = Math.floor((button.totalActionTime - instance.remainingActionTime) / button.totalActionTime  * 100);
            instance.remainingActionTime -= delta;
            instance.htmlElement.style.backgroundSize = "100% " + actionPercent + "%";
            if (instance.remainingActionTime <= 0) {
                instance.remainingActionTime = 0.0;
                button.action();
                button.state = "ready";
                instance.htmlElement.remove();
            }
        }
        button.instances = button.instances.filter(a => a.remainingActionTime > 0);
    }
}



async function DoIntroCinematic() {
    await PrintToLog("You are a cat with the supernatural ability to float around and run a restaurant by yourself. But you're also a bit forgetful.");
    await PrintToLog("You see, your new restaurant opens today!");
    await PrintToLog("But you forgot to actually prepare any food.");
    AddResource(resources.bread, 3);
    AddResource(resources.cuttingBoard, 1);
    UnlockItem("slicebread");
    await PrintToLog("You grab what you can from the kitchen and prepare to get to work.");
}


function UnlockItem(item) {
    if (typeof(item) == "string") {
        item = recipes.find(a => a.key == item);
    }
    item.unlocked = true;
    RefreshButtons();
}

function LockItem(item) {
    if (typeof(item) == "string") {
        item = recipes.find(a => a.key == item);
    }
    item.unlocked = false;
    RefreshButtons();
}


function RefreshButtons() {
    // first check existing buttons, make sure they are supposed to be displayed
    for (let button of buttons) {
        if (button.item.locations) {
            let canDisplay = (button.item.locations.indexOf(currentLocation) != -1);
            if (!canDisplay) {
                button.htmlButton.style.display = "none";
            }
        }
        if (button.item.unlocked === false) {
            button.htmlButton.style.display = "none";
        }
    }

    // then iterate through existing recipes to find ones that SHOULD be displayed
    for (let item of [...recipes, ...Object.values(locations)]) {
        let isLocationGood = item.locations.indexOf(currentLocation) > -1 || item.locations.length == 0;
        if (isLocationGood && item.unlocked) {
            // this one should be visible
            if (item.button == null) {
                let buttonObj = CreateButton(item)
                item.button = buttonObj;
            } else {
                item.button.htmlButton.style.display = "";
            }
        }
    }

    // finally, iterate through all buttons and see if cost met
    for (let button of buttons) {
        let affordable = IsButtonAffordable(button);
        button.htmlButton.disabled = !affordable;

        if (button.type == "travel") {
            button.htmlButton.disabled = button.item == currentLocation;
        }
    }
}


function CheckEvents(trigger) {
    let toRemove = [];
    for (let event of events) {
        if (JSON.stringify(event.on) == JSON.stringify(trigger)) {
            if (event.isReady()) {
                event.action();
                if (event.onetime) {
                    toRemove.push(event);
                }
            }
        }
    }
    events = events.filter(a => toRemove.indexOf(a) == -1);
}


function RegisterEvents() {
    events.push({
        on: null, 
        isReady: () => resources.slicedBread.value > 0, 
        onetime: true,
        action: async () => {
            await PrintToLog("It's the best thing since regular bread! Oh, and it looks like there's some supplies you forgot to unpack here!");
            AddResource(resources.toaster, 2);
            UnlockItem("toastbread");
        }
    });

    events.push({
        on: null, 
        isReady: () => resources.toast.value >= 1, 
        onetime: true,
        action: async () => {
            await PrintToLog("Well, it isn't much, but at least you have some food to put out front for people to buy!");
            UnlockItem("sell_toast");
            UnlockItem(locations.kitchen);
            UnlockItem(locations.foh);
        }
    });

    events.push({
        on: null, 
        isReady: () => resources.money.value >= resources.toaster.price, 
        onetime: true,
        action: async () => {
            await PrintToLog("This might be a bit quicker with more toasters. A quick run to the store!");
            UnlockItem("buy_toaster");
            UnlockItem(locations.appliances);
        }
    });

    events.push({
        on: null, 
        isReady: () => resources.toaster.value >= 3 && resources.bread.value == 0, 
        onetime: true,
        action: async () => {
            await PrintToLog("Going to need more bread at this rate...");
            UnlockItem("buy_bread");
            UnlockItem(locations.grocery);
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_bread").counter >= 3, 
        onetime: true,
        action: async () => {
            LockItem("buy_bread");
            await PrintToLog("Uh-oh, the bread aisle exploded. There's literally no bread left, just charred toast and panicked screams.");
            AddResource(resources.toast, 5);
            await PrintToLog("You manage to grab a handful of toast from the wreckage. Oh, and flour is on sale! That's basically bread.");
            UnlockItem("buy_flour");
            AddResource(resources.mixingBowl, 1);
            AddResource(resources.sink, 1);
            AddResource(resources.oven, 1);
            AddResource(resources.cup, 3);
            UnlockItem("cupofwater");
            UnlockItem("mixdough");
            UnlockItem("bakebread");
        }
    });
}




let baseLetterTime = 30;
let letterPauses = {
    ".": 1000,
    ";": 1000,
    ",": 400,
    ":": 600,
};


function PrintToLog(message) {
    return new Promise((resolve) => {
        let logPanel = document.getElementById("logPanel");
        let el = document.createElement("p");

        var letters = message.split('');
        var timer = 0;
        let prevLetter = "";
        for (let letter of letters) {
            timer += baseLetterTime / gameSpeed;
            if (letterPauses[prevLetter]) {
                timer += letterPauses[prevLetter] / gameSpeed;
            }
            prevLetter = letter;
            setTimeout(() => {
                let letterSpan = document.createElement("span");
                letterSpan.className = "letter";
                letterSpan.innerText = letter;
                el.appendChild(letterSpan);
                if (logPanel.scrollTop < logPanel.scrollTopMax - 30) {
                    logPanel.scrollTo(0, logPanel.scrollHeight - 30);
                }
            }, timer );
        }
        setTimeout(resolve, timer + 1000 / gameSpeed);

        logPanel.appendChild(el)
    });
}

function Wait(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000 / gameSpeed);
    });
}


function CreateButton(item) {
    let isTravel = Object.values(locations).indexOf(item) > -1;
    let element = CreateHtmlButton(item, isTravel);
    if (!item.baseTime) item.baseTime = 0;
    
    let buttonObj = {
        item: item,
        key: item.display,
        htmlButton: element,
        htmlInstances: element.getElementsByClassName("instances")[0],
        costs: [],
        totalActionTime: item.baseTime * 1000,
        // totalCooldown: 0.0 * 1000,
        // remainingCooldown: 0.0,
        instances: [],
        state: "ready",
    };

    if (recipes.indexOf(item) > -1) {
        buttonObj.recipe = item;
        buttonObj.type = "build";

        buttonObj.costs = [...item.inputs, ...item.catalysts];
        buttonObj.action = () => {
            item.counter += 1;
            for (let output of item.outputs) {
                AddResource(output.item, output.amount);
            }
            for (let output of item.catalysts) {
                AddResource(output.item, output.amount);
            }
            RefreshButtons();
        }
    }
    if (isTravel) {
        buttonObj.type = "travel";
        buttonObj.action = () => { TravelTo(item); }
    }
    buttons.push(buttonObj);
    element.onclick = OnButton;
    return buttonObj;
}

function CreateHtmlButton(item, isTravel) {
    let text = item.display;
    let container = document.getElementById(isTravel ? "locations" : "gameButtons");
    let newButton = document.createElement("button");
    newButton.innerText = text;
    newButton.className = "gameButton";
    newButton.onclick = OnButton;
    container.appendChild(newButton);
    let instancesContainer = document.createElement("div");
    instancesContainer.className = "instances";
    newButton.appendChild(instancesContainer);
    return newButton;
}

function OnButton(event) {
    let htmlButton = event.target;
    let buttonObj = buttons.filter( a => a.htmlButton == htmlButton)[0];
    if (buttonObj) {
        //if (buttonObj.remainingCooldown > 0) return;
        //if (buttonObj.remainingActionTime > 0) return;
        if (!IsButtonAffordable(buttonObj)) return;

        //if (buttonObj.state == "ready") {

        CheckEvents({click: buttonObj.key});

        // deduct costs
        for (let cost of buttonObj.costs) {
            AddResource(cost.item, -cost.amount);
        }

        // trigger action/cooldown
        //buttonObj.remainingCooldown = buttonObj.totalCooldown;

        let htmlElement = document.createElement("div");
        buttonObj.htmlInstances.appendChild(htmlElement);
        buttonObj.instances.push({
            remainingActionTime: buttonObj.totalActionTime,
            htmlElement: htmlElement,
        })

        //buttonObj.remainingActionTime = buttonObj.totalActionTime;
        //buttonObj.state = "loading";
        
        RefreshButtons();
        //}

    }
}

function IsButtonAffordable(buttonObj) {
    for (let cost of buttonObj.costs) {
        let current = cost.item.value;
        if (current < cost.amount) {
            //can't afford
            return false;
        }
    }
    return true;
}

async function TravelTo(location) {
    currentLocation = locations.transit;
    RefreshButtons();
    var secondsToDestination = 0.1;
    document.body.style.transition = "filter " + secondsToDestination + "s";
    document.body.style.filter = location.filter;
    await Wait(secondsToDestination);
    currentLocation = location;
    RefreshButtons();
}

function AddResource(resource, amount = 1) {
    resource.value += amount;
    if (!resource.displayed) {
        resource.displayed = true;
        resource.div.style.display = "";
    }
}




function AddResourceDOM(resource) {
    let container = document.getElementById("inventory");
    let newDiv = document.createElement("div");

    let labelSpan = document.createElement("span");
    labelSpan.innerText = resource.name + ": ";
    labelSpan.className = "labelSpan";
    newDiv.appendChild(labelSpan);

    let valueSpan = document.createElement("span");
    valueSpan.innerText = 0;
    valueSpan.className = "valueSpan";
    newDiv.appendChild(valueSpan);

    container.appendChild(newDiv);

    newDiv.style.display = "none";

    resource.div = newDiv;
    resource.displaySpan = valueSpan;

    return valueSpan;
}