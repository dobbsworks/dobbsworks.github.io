
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
                completedEventIds.push(event.id);
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
        action: async () => {
            queuedEvents.push({type: "print", data: "It's the best thing since regular bread! Oh, and it looks like there's some supplies you forgot to unpack here!"});
            queuedEvents.push({type: "add", key: resources.toaster.key, amount: 2});
            queuedEvents.push({type: "unlock", key: "toastbread"});
        }
    });

    events.push({
        on: null, 
        isReady: () => resources.toast.value >= 1, 
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
        action: async () => {
            queuedEvents.push({type: "print", data: "This might be a bit quicker with more toasters. A quick run to the store!"});
            queuedEvents.push({type: "unlock", key: "buy_toaster"});
            queuedEvents.push({type: "unlock", key: locations.appliances.key});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_toaster").counter >= 2 && resources.bread.value == 0, 
        action: async () => {
            queuedEvents.push({type: "print", data: "Going to need more bread at this rate."});
            queuedEvents.push({type: "unlock", key: "buy_bread"});
            queuedEvents.push({type: "unlock", key: locations.grocery.key});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_toaster").counter >= 5, 
        action: async () => {
            queuedEvents.push({type: "print", data: "Oh good, your trusted employee Jimothy is here for his shift."});
            queuedEvents.push({type: "add", key: resources.employee.key, amount: 1});
            queuedEvents.push({type: "print", data: "Drag an employee to a button to have them click it every second for you. Click the tab above a button to remove an employee from it."});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_bread").counter >= 3, 
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
        action: async () => {
            queuedEvents.push({type: "unlock", key: "rummage"});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_toaster").counter >= 2, 
        action: async () => {
            queuedEvents.push({type: "unlock", key: "buy_displayCounter"});
        }
    });


    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_flour").counter >= 3, 
        action: async () => {
            queuedEvents.push({type: "unlock", key: "buy_cup"});
            queuedEvents.push({type: "unlock", key: "buy_sink"});
            queuedEvents.push({type: "unlock", key: "buy_mixingBowl"});
            queuedEvents.push({type: "unlock", key: "buy_oven"});
        }
    });

    events.push({
        on: null, 
        isReady: () => resources.employee.value == 0 && resources.employee.counter > 0, 
        action: async () => {
            queuedEvents.push({type: "unlock", key: locations.downtown.key});
            queuedEvents.push({type: "unlock", key: "quest1"});
            queuedEvents.push({type: "print", data: "Now the real game starts."});
        }
    });

    events.push({
        on: null, 
        isReady: () => resources.toast.value == 1, 
        action: async () => {
            queuedEvents.push({type: "print", data: "Yeah, more toast! People need their breakfast. And who better to provide it than the smiling faces at Hover Cat Kitchen!"});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "buy_toaster").counter == 1, 
        action: async () => {
            queuedEvents.push({type: "print", data: "They've got allen wrenches, gerbil feeders, toilet seats, electric heaters; pretty much everything you could need."});
        }
    });

    events.push({
        on: null, 
        isReady: () => resources.displayCounter.value == 0 && recipes.find(a => a.key == "buy_toaster").counter >= 1,
        action: async () => {
            queuedEvents.push({type: "print", data: "Oh man, already running out of places to store toast. "});
        }
    });



    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "quest1").counter == 1, 
        action: async () => {
            LockItem("quest1");
            queuedEvents.push({type: "print", data: "The breakfast is a huge success! The plain, dry toast was a big hit with the very few members of the Chamber of Commerce, who averaged about 16 and a half pieces of toast each."});
            queuedEvents.push({type: "print", data: "You'll have no trouble finding new hires now, and not a moment too soon. Jimothy was going crazy with no one to talk to back in the kitchen."});
            queuedEvents.push({type: "unlock", key: "buy_eggs"});
            queuedEvents.push({type: "unlock", key: "buy_skillet"});
            queuedEvents.push({type: "unlock", key: "scrambleeggs"});
            queuedEvents.push({type: "unlock", key: "sell_scrambledEggs"});
            queuedEvents.push({type: "unlock", key: "buy_rawBacon"});
            queuedEvents.push({type: "unlock", key: "sell_cookedBacon"});
            queuedEvents.push({type: "unlock", key: "cookbacon"});
            queuedEvents.push({type: "unlock", key: "makebreakfastplatter"});
            queuedEvents.push({type: "unlock", key: "sell_breakfastPlatter"});
            
            queuedEvents.push({type: "unlock", key: "quest2"});
        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "quest2").counter == 1, 
        action: async () => {
            LockItem("quest2");

            queuedEvents.push({type: "print", data: "The festival is really such a beautiful time of year. Shame about the torch thing, but the library was due a remodel anyway!"});
            queuedEvents.push({type: "print", data: "You decide that it's time to branch out. People want something a bit sweeter."});
            queuedEvents.push({type: "unlock", key: "buy_sugar"});
            queuedEvents.push({type: "unlock", key: "makecakebatter"});
            queuedEvents.push({type: "unlock", key: "bakecupcake"});
            queuedEvents.push({type: "unlock", key: "makecakeicing"});
            queuedEvents.push({type: "unlock", key: "decoratecupcake"});
            queuedEvents.push({type: "unlock", key: "sell_cupcake"});
            queuedEvents.push({type: "unlock", key: "buy_chocolateChips"});
            queuedEvents.push({type: "unlock", key: "makecookiedough"});
            queuedEvents.push({type: "unlock", key: "bakecookies"});

            queuedEvents.push({type: "unlock", key: "quest3"});


        }
    });

    events.push({
        on: null, 
        isReady: () => recipes.find(a => a.key == "quest3").counter == 1, 
        action: async () => {
            LockItem("quest3");

            queuedEvents.push({type: "print", data: "Anyway, that's the story of how I got elected ruler of the entire world. They made that position especially for me."});
            queuedEvents.push({type: "print", data: "I skipped a few details, admittedly, but I think you can fill in the blanks, you're a smart kid."});
            queuedEvents.push({type: "print", data: "How, uh, how's school going. Are you, are you guys learning cursive? Do they still do that? Man, I hope not."});
            queuedEvents.push({type: "print", data: "What on EARTH was up with lowercase b, am I right? I am. Trust me, you don't want to know."});
            queuedEvents.push({type: "print", data: "Where was I?"});
            queuedEvents.push({type: "print", data: "Right, the restaurant. Yeah, Jimothy and the others are still making cookies to this day, I imagine. Should probably swing by and check in on them."});
            queuedEvents.push({type: "print", data: "Jimothy, Philliam, Pamantha, uh..."});
            queuedEvents.push({type: "print", data: "That's all I got."});
            queuedEvents.push({type: "print", data: "Look, I'm not gonna kick you out or anything, you're welcome to hang out, but I don't really have anything else for you to do."});
            queuedEvents.push({type: "print", data: "Unless...?"});

            queuedEvents.push({type: "unlock", key: "questdumb"});


        }
    });


    



    for (let i = 0; i < events.length; i++) {
        events[i].id = i;
    }
}

