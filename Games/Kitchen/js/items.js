
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
    appliances: {
        name: "Hardware Store",
        filter: "saturate(0.5) hue-rotate(50deg)"
    },
    grocery: {
        name: "Grocery Store",
        filter: "saturate(1) hue-rotate(150deg)"
    },
    downtown: {
        name: "Downtown Catsburg",
        filter: "saturate(3) brightness(0.7) contrast(1.5) hue-rotate(-160deg)",
    },
    farm: {
        name: "Hover Acres",
        filter: "saturate(1) brightness(0.7) contrast(1.5) hue-rotate(-10deg)",
    },

    // digital: invert() saturate(1) brightness(1.1) contrast(2) hue-rotate(220deg)

}

var resources = {
    money: {
        name: "Money",
    },

    self: {
        name: "Broom",
        value: 1
    },

    employee: {
        name: "Employees",
        draggable: true,
        buyLocation: locations.downtown,
        price: 120,
    },

    sisterLocation: {
        name: "Sister locations",
    },

    bread: {
        name: "Loaves of bread",
        buyLocation: locations.grocery,
        price: 5,
    },
    lettuceSeeds: {
        name: "Letuce seeds",
        price: 4,
        buyQuantity: 20,
    },
    tomatoSeeds: {
        name: "Tomato seeds",
        price: 3,
        buyQuantity: 20,
    },
    harvestableLettuce: {
        name: "Lettuce crops",
    },
    harvestableTomato: {
        name: "Tomato crops",
    },
    lettuce: {
        name: "Heads of lettuce",
    },
    tomato: {
        name: "Tomatoes",
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
    sugar: {
        name: "Sugar",
        buyLocation: locations.grocery,
        price: 10,
        buyQuantity: 10,
    },
    chocolateChips: {
        name: "Chocolate Chips",
        buyLocation: locations.grocery,
        price: 10,
        buyQuantity: 200,
    },
    eggs: {
        name: "Eggs",
        buyLocation: locations.grocery,
        price: 10,
        buyQuantity: 12,
    },
    rawBacon: {
        name: "Raw Bacon",
        buyLocation: locations.grocery,
        price: 10,
        buyQuantity: 4,
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
    scrambledEggs: {
        name: "Scrambled eggs",
        sellPrice: 5,
    },
    cookedBacon: {
        name: "Cooked bacon",
        sellPrice: 6,
    },
    breakfastPlatter: {
        name: "Breakfast platter",
        sellPrice: 20,
    },
    cakeBatter: {
        name: "Cake batter",
    },
    cookieDough: {
        name: "Cookie dough",
    },
    plaincupcake: {
        name: "Plain cupcakes",
    },
    cakeIcing: {
        name: "Icing",
    },
    cupcake: {
        name: "Cupcakes",
        sellPrice: 5,
    },
    cookie: {
        name: "Chocolate chip cookies",
        sellPrice: 3,
    },

    salad: {
        name: "Salads",
        sellPrice: 8,
    },

    blt: {
        name: "BLTs",
        sellPrice: 15,
    },

    cupOfWater: {
        name: "Cups of water",
    },

    displayCounter: {
        name: "Display counter",
        buyLocation: locations.appliances,
        price: 40,
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
        //buyLocation: locations.appliances,
        //price: 300,
    },
    // stovetop: {
    //     name: "Stovetop",
    //     //buyLocation: locations.appliances,
    //     //price: 300,
    // },
    toaster: {
        name: "Toasters",
        buyLocation: locations.appliances,
        price: 20,
    },
    skillet: {
        name: "Skillets",
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

    farmPlot: {
        name: "Farm plots",
        price: 150,
        buyQuantity: 10,
    },

    joke: {
        name: "Your credit card number",
    },
}

var recipes = [
    {
        key: "buy_oven",
        display: "Buy Ovens",
        baseTime: 0.2,
        locations: [locations.appliances],
        inputs: [{item: resources.money, amount: 300}, ],
        catalysts: [],
        outputs: [{item: resources.oven, amount: 1} /*, {item: resources.stovetop, amount: 4}*/]
    },
    {
        key: "cutlettuce",
        display: "Cut lettuce",
        baseTime: 10,
        locations: [locations.kitchen],
        inputs: [{item: resources.lettuce, amount: 1}, ],
        catalysts: [{item: resources.cuttingBoard, amount: 1}],
        outputs: [{item: resources.choppedLettuce, amount: 5}]
    },
    {
        key: "cuttomato",
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
    {
        key: "scrambleeggs",
        display: "Scramble eggs",
        baseTime: 10,
        locations: [locations.kitchen],
        inputs: [{item: resources.eggs, amount: 1}, ],
        catalysts: [{item: resources.skillet, amount: 1}],
        outputs: [{item: resources.scrambledEggs, amount: 1}]
    },
    {
        key: "cookbacon",
        display: "Cook bacon",
        baseTime: 15,
        locations: [locations.kitchen],
        inputs: [{item: resources.rawBacon, amount: 1}, ],
        catalysts: [{item: resources.skillet, amount: 1}],
        outputs: [{item: resources.cookedBacon, amount: 1}]
    },
    {
        key: "makebreakfastplatter",
        display: "Make breakfast platter",
        baseTime: 5,
        locations: [locations.kitchen],
        inputs: [{item: resources.cookedBacon, amount: 2}, {item: resources.scrambledEggs, amount: 1}, {item: resources.toast, amount: 1}],
        catalysts: [],
        outputs: [{item: resources.breakfastPlatter, amount: 1}]
    },
    {
        key: "makecakebatter",
        display: "Make cake batter",
        baseTime: 15,
        locations: [locations.kitchen],
        inputs: [{item: resources.eggs, amount: 1}, {item: resources.flour, amount: 2}, {item: resources.cupOfWater, amount: 2}, {item: resources.sugar, amount: 2}],
        catalysts: [{item: resources.mixingBowl, amount: 1}],
        outputs: [{item: resources.cakeBatter, amount: 1}, {item: resources.cup, amount: 2}]
    },
    {
        key: "bakecupcake",
        display: "Bake cupcakes",
        baseTime: 15,
        locations: [locations.kitchen],
        inputs: [{item: resources.cakeBatter, amount: 1}],
        catalysts: [{item: resources.oven, amount: 1}],
        outputs: [{item: resources.plaincupcake, amount: 6}]
    },
    {
        key: "makecakeicing",
        display: "Make icing",
        baseTime: 10,
        locations: [locations.kitchen],
        inputs: [{item: resources.sugar, amount: 1}, {item: resources.cupOfWater, amount: 1}],
        catalysts: [{item: resources.mixingBowl, amount: 1}],
        outputs: [{item: resources.cakeIcing, amount: 10}, {item: resources.cup, amount: 1}]
    },
    {
        key: "decoratecupcake",
        display: "Decorate cupcake",
        baseTime: 12,
        locations: [locations.kitchen],
        inputs: [{item: resources.plaincupcake, amount: 1}, {item: resources.cakeIcing, amount: 1}],
        catalysts: [],
        outputs: [{item: resources.cupcake, amount: 1}]
    },
    {
        key: "makecookiedough",
        display: "Make cookie dough",
        baseTime: 15,
        locations: [locations.kitchen],
        inputs: [{item: resources.eggs, amount: 1}, {item: resources.flour, amount: 2}, {item: resources.chocolateChips, amount: 12}, {item: resources.sugar, amount: 2}],
        catalysts: [{item: resources.mixingBowl, amount: 1}],
        outputs: [{item: resources.cookieDough, amount: 1}]
    },
    {
        key: "bakecookies",
        display: "Bake cookies",
        baseTime: 30,
        locations: [locations.kitchen],
        inputs: [{item: resources.cookieDough, amount: 1}],
        catalysts: [{item: resources.oven, amount: 1}],
        outputs: [{item: resources.cookie, amount: 12}]
    },



    {
        key: "plantlettuce",
        display: "Plant lettuce",
        baseTime: 60,
        locations: [locations.farm],
        inputs: [{item: resources.lettuceSeeds, amount: 1}],
        catalysts: [{item: resources.farmPlot, amount: 1}],
        outputs: [{item: resources.harvestableLettuce, amount: 1}]
    },
    {
        key: "planttomato",
        display: "Plant tomato",
        baseTime: 60,
        locations: [locations.farm],
        inputs: [{item: resources.tomatoSeeds, amount: 1}],
        catalysts: [{item: resources.farmPlot, amount: 1}],
        outputs: [{item: resources.harvestableTomato, amount: 1}]
    },
    {
        key: "harvestlettuce",
        display: "Harvest lettuce",
        baseTime: 10,
        locations: [locations.farm],
        inputs: [{item: resources.harvestableLettuce, amount: 1}],
        catalysts: [],
        outputs: [{item: resources.lettuce, amount: 1}]
    },
    {
        key: "harvesttomato",
        display: "Harvest tomato",
        baseTime: 10,
        locations: [locations.farm],
        inputs: [{item: resources.harvestableTomato, amount: 1}],
        catalysts: [],
        outputs: [{item: resources.tomato, amount: 1}]
    },
    {
        key: "makesalad",
        display: "Make salad",
        baseTime: 10,
        locations: [locations.kitchen],
        inputs: [{item: resources.slicedTomato, amount: 1}, {item: resources.choppedLettuce, amount: 2}],
        catalysts: [],
        outputs: [{item: resources.salad, amount: 1}]
    },
    {
        key: "makeblt",
        display: "Make BLT",
        baseTime: 20,
        locations: [locations.kitchen],
        inputs: [{item: resources.slicedTomato, amount: 1}, {item: resources.choppedLettuce, amount: 1}, {item: resources.cookedBacon, amount: 1}, {item: resources.toast, amount: 2}],
        catalysts: [],
        outputs: [{item: resources.blt, amount: 1}]
    },


    {
        key: "buy_sisterLocation",
        display: "Open sister location",
        baseTime: 0.2,
        locations: [locations.downtown],
        inputs: [
            {item: resources.money, amount: 10000}, 
            {item: resources.oven, amount: 5}, 
            {item: resources.mixingBowl, amount: 5},
            {item: resources.cuttingBoard, amount: 5},
            {item: resources.displayCounter, amount: 5},
            {item: resources.toaster, amount: 5},
            {item: resources.skillet, amount: 3},
            {item: resources.sink, amount: 2},
        ],
        catalysts: [],
        outputs: [{item: resources.sisterLocation, amount: 1}]
    },

    {
        key: "managelocation",
        display: "Run restaurant",
        baseTime: 1,
        locations: [locations.downtown],
        inputs: [],
        catalysts: [{item: resources.sisterLocation, amount: 1}, {item: resources.employee, amount: 10}],
        outputs: [{item: resources.money, amount: 20}]
    },


    {
        key: "rummage",
        display: "Sweep up loose change",
        baseTime: 4,
        locations: [locations.foh],
        inputs: [],
        catalysts: [{item: resources.self, amount: 1}],
        outputs: [{item: resources.money, amount: 1} ]
    },
    {
        key: "quest1",
        display: "The Chamber of Commerce is hosting a breakfast meeting. If you can supply some quality toast, it would reflect well on your business!",
        baseTime: 1,
        locations: [locations.downtown],
        inputs: [ {item: resources.toast, amount: 100} ],
        outputs: [ {text: "Unlocks more items and a new quest!"}],
        onetime: true
    },
    {
        key: "quest2",
        display: "The Catsburg Festival is starting soon! The city is asking for 100 breakfast samplers for the opening ceremoines where they light the big torch. It's not like the Olympics, Catsburg did it first.",
        baseTime: 1,
        locations: [locations.downtown],
        inputs: [ {item: resources.breakfastPlatter, amount: 50} ],
        outputs: [ {text: "Unlocks more items and a new quest!"}],
        onetime: true
    },
    {
        key: "quest3",
        display: "Oh my, the mayor herself has requested something to satisfy her sweet tooth! This is your chance to get in with the bigwigs downtown. I can't stress how big these wigs are.",
        baseTime: 1,
        locations: [locations.downtown],
        inputs: [ {item: resources.cookie, amount: 100}, {item: resources.cupcake, amount: 150} ],
        outputs: [ {text: "Unlocks more items and a new quest!"}],
        onetime: true
    },
    {
        key: "quest4",
        display: "The Vegetarian Conference has been scheduled. Only the freshest ingredients will do, so you'll need to expand your farm quite a bit.",
        baseTime: 1,
        locations: [locations.downtown],
        inputs: [ {item: resources.salad, amount: 500} ],
        outputs: [ {text: "Unlocks more items and a new quest!"}],
        onetime: true
    },
    {
        key: "quest5",
        display: "Sandwichfest is coming up. I hope you know what this means.",
        baseTime: 1,
        locations: [locations.downtown],
        inputs: [ {item: resources.blt, amount: 1000} ],
        outputs: [ {text: "Unlocks more items and a new quest!"}],
        onetime: true
    },
    {
        key: "quest6",
        display: "It's time to retire. You'll need this place running itself.",
        baseTime: 1,
        locations: [locations.downtown],
        inputs: [ {item: resources.money, amount: 1000000} ],
        outputs: [ {text: "Win the game!"}],
        onetime: true
    },
    {
        key: "questdumb",
        display: "This is a joke.",
        baseTime: 1,
        locations: [locations.downtown],
        inputs: [ {item: resources.toast, amount: 1000000}, {item: resources.cookie, amount: 1000000}, {item: resources.cupcake, amount: 1000000}, {item: resources.breakfastPlatter, amount: 1000000}, {item: resources.joke, amount: 1} ],
        outputs: [ {text: "Nothing, this is the post-credits gag."}],
        onetime: true
    },
];


