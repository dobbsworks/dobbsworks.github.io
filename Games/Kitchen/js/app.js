
// 🎵 come on down, to the hover cat kitchen
// we've got everything your mouth could be wishin'
// foooooor
// and so much moooore
//



// todo features
// eventually have to mill your own flour, grow your own produce

// lettuce and tomato for salads
// add bacon for blt


var gameSpeed = 1.0;
var buttons = [];
var gameTime = 0.0;



var currentLocation = locations.kitchen;


window.onload = Init;
function Init() {
    InitializeResources();
    InitializeLocations();
    InitializeRecipes();
    RegisterEvents();
    InitSave();
    Loop();
    
}


function InitializeResources() {
    for (const [key, resource] of Object.entries(resources)) {
        resource.key = key;
        resource.displayed = false;
        resource.div = null;
        resource.displaySpan = null;
        resource.value = 0;
        resource.counter = 0;

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
                catalysts: [{item: resources.displayCounter, amount: 1}],
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
    RunEvents();

    let maxInstancesDisplayed = 5;
    for (let button of buttons) {
        let instanceCount = 0;
        for (let instance of button.instances) {
            let actionPercent = Math.floor((button.totalActionTime - instance.remainingActionTime) / button.totalActionTime  * 100);
            instance.remainingActionTime -= delta;
            instance.htmlElement.style.backgroundSize = "100% " + actionPercent + "%";
            if (instance.remainingActionTime <= 0) {
                instance.remainingActionTime = 0.0;
                button.action();
                button.state = "ready";
                instance.htmlElement.remove();
            } else {
                instanceCount += 1;
                instance.htmlElement.style.display = (instanceCount > maxInstancesDisplayed) ? "none" : "";
            }
        }
        button.htmlInstanceOverflow.style.display = (instanceCount > maxInstancesDisplayed) ? "" : "none";
        button.htmlInstanceOverflow.innerText = "+" + (instanceCount - maxInstancesDisplayed);
        button.instances = button.instances.filter(a => a.remainingActionTime > 0);
    }


    if (lastEmployeeTick <= gameTime - 1000.0) {
        lastEmployeeTick = gameTime;
        TickEmployees();
    }
}


var lastEmployeeTick = 0;
function TickEmployees() {
    for (let button of buttons) {
        for (let i = 0; i < button.employees; i++) {
            OnButton({target: button.htmlButton});
        }
    }

}


function UnlockItem(item) {
    if (typeof(item) == "string") {
        var recipe = recipes.find(a => a.key == item);
        if (recipe) {
            item = recipe;
        } else {
            item = Object.values(locations).filter(a => a.key == item)[0];
        }
    }
    if (item) {
        item.unlocked = true;
    }
    RefreshButtons();
}

function LockItem(item) {
    if (typeof(item) == "string") {
        item = recipes.find(a => a.key == item);
        if (!item) item = Object.values(locations).filter(a => a.key == item)[0];
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
        if (item.unlocked) {
            if (item.button == null) {
                let buttonObj = CreateButton(item)
                item.button = buttonObj;
            }
            let isLocationGood = item.locations.indexOf(currentLocation) > -1 || item.locations.length == 0;
            
            if (isLocationGood) {
                item.button.htmlButton.style.display = "";
            } else {
                item.button.htmlButton.style.display = "none";
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

    // handle employees
    for (let button of buttons) {
        let container = button.htmlEmployees;
        container.style.display = (button.employees == 0) ? "none" : "";
        container.innerText = button.employees;
    }

    // handle tooltips
    for (let button of buttons) {
        if (button.recipe) {
            let html = ``;

            if (button.recipe.stock === 0) {
                html += `<span class="cantAfford">OUT OF STOCK</span><hr/>`;
            }

            html += `Costs<br/>`;
            for (let cost of button.recipe.inputs) {
                var line = cost.item.name + ": " + cost.amount
                if (cost.item.value < cost.amount) {
                    line = `<span class="cantAfford">${line}</span>`
                }
                html += line + "<br/>";
            }
            html += button.recipe.baseTime + " seconds" + "<br/>";

            if (button.recipe.catalysts && button.recipe.catalysts.length > 0) {
                html += "<hr/>Tools<br/>";
                for (let output of button.recipe.catalysts) {
                    var line = output.item.name + ": " + output.amount
                    if (output.item.value < output.amount) {
                        line = `<span class="cantAfford">${line}</span>`
                    }
                    html += line + "<br/>";
                }
            }
            html += "<hr/>Produces<br/>";
            for (let output of button.recipe.outputs) {
                var line = "";
                if (output.item) {
                    line = output.item.name + ": " + output.amount
                }
                if (output.text) {
                    line = output.text;
                }
                
                html += line + "<br/>";
            }
            button.tooltip.innerHTML = html;
        }
    }
}







function CreateButton(item) {
    let isTravel = Object.values(locations).indexOf(item) > -1;
    let element = CreateHtmlButton(item, isTravel);
    if (!item.baseTime) item.baseTime = 0;
    
    let buttonObj = {
        employees: 0,
        item: item,
        key: item.display,
        htmlButton: element,
        htmlInstances: element.getElementsByClassName("instances")[0],
        htmlInstanceOverflow: element.getElementsByClassName("instancesOverflow")[0],
        htmlEmployees: element.getElementsByClassName("employeeContainer")[0],
        tooltip: element.getElementsByClassName("tooltip")[0],
        costs: [],
        totalActionTime: item.baseTime * 1000,
        // totalCooldown: 0.0 * 1000,
        // remainingCooldown: 0.0,
        instances: [],
        state: "ready",
    };

    buttonObj.htmlEmployees.onclick = () => {OnRemoveEmployee(buttonObj);}

    if (recipes.indexOf(item) > -1) {
        buttonObj.recipe = item;
        buttonObj.type = "build";

        buttonObj.costs = [...item.inputs, ...item.catalysts];
        buttonObj.action = () => {
            item.counter += 1;
            for (let output of item.outputs) {
                if (output.item) {
                    AddResource(output.item, output.amount);
                }
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

    newButton.classList.add("newButton");
    setTimeout(() => {
        newButton.classList.remove("newButton");
    }, 1000)



    newButton.onclick = OnButton;
    container.appendChild(newButton);
    let instancesContainer = document.createElement("div");
    instancesContainer.className = "instances";
    newButton.appendChild(instancesContainer);

    // "+4 more" eg
    let instancesOverflow = document.createElement("div");
    instancesOverflow.className = "instancesOverflow";
    instancesOverflow.style.display = "none";
    instancesContainer.appendChild(instancesOverflow);

    
    let employeeContainer = document.createElement("div");
    employeeContainer.className = "employeeContainer";
    newButton.appendChild(employeeContainer);
    
    if (!isTravel) {
        let tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        newButton.appendChild(tooltip);
    }

    newButton.addEventListener("drop", OnDropResourceToButton);
    newButton.addEventListener("dragover", (ev) => { 
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    });

    return newButton;
}

function OnButton(event) {
    let htmlButton = event.target;
    let buttonObj = buttons.filter( a => a.htmlButton == htmlButton)[0];
    if (buttonObj) {
        if (!IsButtonAffordable(buttonObj)) return;
        CheckEvents({click: buttonObj.key});

        // deduct costs
        for (let cost of buttonObj.costs) {
            AddResource(cost.item, -cost.amount);
        }
        
        if (buttonObj.recipe) {
            if (buttonObj.recipe.stock !== undefined) {
                buttonObj.recipe.stock -= 1;
            }
        }

        let htmlElement = document.createElement("div");
        htmlElement.style.display = "none";
        buttonObj.htmlInstances.appendChild(htmlElement);
        buttonObj.instances.push({
            remainingActionTime: buttonObj.totalActionTime,
            htmlElement: htmlElement,
        })

        if (buttonObj.recipe && buttonObj.recipe.onetime) {
            buttonObj.recipe.unlocked = false;
        }
        
        RefreshButtons();
    }
}

function IsButtonAffordable(buttonObj) {
    if (buttonObj.recipe) {
        if (buttonObj.recipe.stock === 0) {
            return false;
        }
    }

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
    var secondsToDestination = 1.0;
    var gameContainer = document.getElementById("gameContainer");
    gameContainer.style.transition = "filter " + secondsToDestination + "s";
    gameContainer.style.filter = location.filter;
    //await Wait(secondsToDestination);
    currentLocation = location;
    RefreshButtons();
}

function AddResource(resource, amount = 1) {
    if (typeof(resource) == "string") {
        resource = Object.values(resources).filter(a => a.key == resource)[0];
    }
    resource.value += amount;
    if (amount > 0) resource.counter += amount;
    if (!resource.displayed) {
        resource.displayed = true;
        resource.div.style.display = "";
    }
}




var _dragResource = null;

function AddResourceDOM(resource) {
    let container = document.getElementById("inventory");
    let newDiv = document.createElement("div");

    if (resource.draggable) {
        let dragDiv = document.createElement("div");
        dragDiv.className = "resourceDrag";
        dragDiv.draggable = true;
        dragDiv.innerText = resource.key[0];
        newDiv.appendChild(dragDiv);

        dragDiv.addEventListener("dragstart", (ev) => {
            // Add the target element's id to the data transfer object
            _dragResource = resource;
        });
    }

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


function OnDropResourceToButton(ev) {
    ev.preventDefault();
    if (_dragResource.value > 0) {
        _dragResource.value -= 1
        let buttonObj = buttons.filter( a => a.htmlButton == ev.target)[0];
        if (buttonObj) {
            buttonObj.employees += 1;
        }
        RefreshButtons();
    }
    _dragResource = null;
}

function OnRemoveEmployee(buttonObj) {
    buttonObj.employees -= 1;
    resources.employee.value += 1;
    RefreshButtons();
}