
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

    // digital: invert() saturate(1) brightness(1.1) contrast(2) hue-rotate(220deg)

}

var resources = {
    money: {
        name: "Money",
    },

    employee: {
        name: "Employees",
        draggable: true,
        buyLocation: locations.downtown,
        price: 120,
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
    sugar: {
        name: "Sugar",
        buyLocation: locations.grocery,
        price: 10,
        buyQuantity: 10,
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
        price: 20,
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
    stovetop: {
        name: "Stovetop",
        //buyLocation: locations.appliances,
        //price: 300,
    },
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
}

var recipes = [
    {
        key: "buy_oven",
        display: "Buy Ovens",
        baseTime: 0.2,
        locations: [locations.appliances],
        inputs: [{item: resources.money, amount: 300}, ],
        catalysts: [],
        outputs: [{item: resources.oven, amount: 1}, {item: resources.stovetop, amount: 4}]
    },
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
        key: "breakfastplatter",
        display: "Make breakfast platter",
        baseTime: 5,
        locations: [locations.kitchen],
        inputs: [{item: resources.cookedBacon, amount: 2}, {item: resources.scrambledEggs, amount: 1}, {item: resources.toast, amount: 1}],
        catalysts: [],
        outputs: [{item: resources.breakfastPlatter, amount: 1}]
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
        display: "Sweep up loose change",
        baseTime: 4,
        locations: [locations.foh],
        inputs: [],
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
        inputs: [ {item: resources.breakfastPlatter, amount: 100} ],
        outputs: [ {text: "Unlocks more items and a new quest!"}],
        onetime: true
    },
];


