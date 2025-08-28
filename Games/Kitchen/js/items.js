
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

    employee: {
        name: "Employees",
        draggable: true,
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
        name: "Cups of water",
    },

    displayCounter: {
        name: "Display counter",
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
        display: "Give incorrect change",
        baseTime: 4,
        locations: [location.foh],
        inputs: [],
        outputs: [{item: resources.money, amount: 1} ]
    },
];


