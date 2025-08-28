
var events = [];

// todo
// change trigger events to add to queue

var queuedEvents = [];
var completedEventIds = [];

var eventInProgress = false;
async function RunEvents() {
    if (!queuedEvents) return;
    if (!eventInProgress && queuedEvents.length > 0) {
        let ev = queuedEvents.splice(0,1)[0];
        switch(ev.type) {
            case "print":
                eventInProgress = true;
                await PrintToLog(ev.data);
                eventInProgress = false;
                break;
            case "add":
                AddResource(ev.key, ev.amount);
                break;
            case "unlock":
                UnlockItem(ev.key);
                break;
        }
    }
}



function CheckEvents(trigger) {
    events = events.filter(a => completedEventIds.indexOf(a.id) == -1);
    for (let event of events) {
        if (JSON.stringify(event.on) == JSON.stringify(trigger)) {
            if (event.isReady()) {
                event.action();
                if (event.onetime) {
                    completedEventIds.push(event.id);
                }
            }
        }
    }
    events = events.filter(a => completedEventIds.indexOf(a.id) == -1);
}


async function DoIntroCinematic() {
    queuedEvents.push({type: "print", data: `You are a cat with the supernatural ability to float around and run a restaurant by yourself. But you're also a bit forgetful.`});
    queuedEvents.push({type: "print", data: `You see, your new restaurant opens today!`});
    queuedEvents.push({type: "print", data: `But you forgot to actually prepare any food.`});
    queuedEvents.push({type: "add", key: resources.bread.key, amount: 3});
    queuedEvents.push({type: "add", key: resources.cuttingBoard.key, amount: 1});
    queuedEvents.push({type: "unlock", key: "slicebread"});
}



function RegisterEvents() {
    events.push({
        on: null, 
        isReady: () => resources.slicedBread.value > 0, 
        onetime: true,
        action: async () => {
            queuedEvents.push({type: "print", data: "It's the best thing since regular bread! Oh, and it looks like there's some supplies you forgot to unpack here!"});
            queuedEvents.push({type: "add", key: resources.toaster.key, amount: 2});
            queuedEvents.push({type: "unlock", key: "toastbread"});
        }
    });

    events.push({
        on: null, 
        isReady: () => resources.toast.value >= 1, 
        onetime: true,
        action: async () => {
            queuedEvents.push({type: "print", data: "Well, it isn't much, but at least you have some food to put out front for people to buy!"});
            queuedEvents.push({type: "unlock", key: "sell_toast"});
            queuedEvents.push({type: "unlock", key: locations.kitchen.key});
            queuedEvents.push({type: "unlock", key: locations.foh.key});
            queuedEvents.push({type: "add", key: resources.displayCounter.key, amount: 5});
        }
    });

    events.push({
        on: null, 
        isReady: () => resources.money.value >= resources.toaster.price, 
        onetime: true,
        action: async () => {
            queuedEvents.push({type: "print", data: "This might be a bit quicker with more toasters. A quick run to the store!"});
            queuedEvents.push({type: "unlock", key: "buy_toaster"});
            queuedEvents.push({type: "unlock", key: locations.appliances.key});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_toaster").counter >= 2 && resources.bread.value == 0, 
        onetime: true,
        action: async () => {
            queuedEvents.push({type: "print", data: "Going to need more bread at this rate..."});
            queuedEvents.push({type: "unlock", key: "buy_bread"});
            queuedEvents.push({type: "unlock", key: locations.grocery.key});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_toaster").counter >= 5, 
        onetime: true,
        action: async () => {
            queuedEvents.push({type: "print", data: "Oh good, your trusted employee Jimothy is here for his shift."});
            queuedEvents.push({type: "add", key: resources.employee.key, amount: 1});
            queuedEvents.push({type: "print", data: "Drag an employee to a button to have them click it every second for you. Click the tab above a button to remove an employee from it."});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_bread").counter >= 3, 
        onetime: true,
        action: async () => {
            LockItem("buy_bread");
            queuedEvents.push({type: "print", data: "Uh-oh, the bread aisle exploded. There's literally no bread left, just charred toast and panicked screams."});
            queuedEvents.push({type: "add", key: resources.toast.key, amount: 5});
            queuedEvents.push({type: "print", data: "You manage to grab a handful of toast from the wreckage. Oh, and flour is on sale! That's basically bread."});
            queuedEvents.push({type: "unlock", key: "buy_flour"});
            queuedEvents.push({type: "add", key: resources.mixingBowl.key, amount: 1});
            queuedEvents.push({type: "add", key: resources.sink.key, amount: 1});
            queuedEvents.push({type: "add", key: resources.oven.key, amount: 1});
            queuedEvents.push({type: "add", key: resources.cup.key, amount: 3});
            queuedEvents.push({type: "unlock", key: "cupofwater"});
            queuedEvents.push({type: "unlock", key: "mixdough"});
            queuedEvents.push({type: "unlock", key: "bakebread"});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_toaster").counter >= 4, 
        onetime: true,
        action: async () => {
            queuedEvents.push({type: "print", data: "The customers have more money than they'd willingly part with."});
            queuedEvents.push({type: "unlock", key: "rummage"});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_toaster").counter >= 2, 
        onetime: true,
        action: async () => {
            queuedEvents.push({type: "unlock", key: "buy_cuttingBoard"});
        }
    });

    for (let i = 0; i < events.length; i++) {
        events[i].id = i;
    }
}

