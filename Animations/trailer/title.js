function CreateTitle() {
    let char1 = Rand([
        "Dobbs",
        Rand([
            "Hover Cat",
            "Gracie",
            //"Lil' Toadette",
            "Rover",
            // ]),
            // Rand([
            "Turtle",
            "GQ",
            "Dove",

            "Kirbs",
            "Tank",
            //"Shiner",
            "Dae",
            "Hudson",
            "Al",
            "Pixel",
            "Mantis",
            Rand([
                "Gorj",
                "MoS",
                "The Molsc",
            ])
        ])
    ]);

    let animals = [
        "Snail",
        "Horse",
        "Turtle",
        "Muncher",
    ];
    let animal1 = Rand(animals)
    let animal2 = Rand(animals.filter(a => a !== animal1));

    let platform = Rand([
        "Twitch",
        "Twitter",
        "YouTube",
        "TikTok",
        "Instagram",
    ]);
    return Rand([
        `${char1} Finally Snaps`,
        `${char1} Gets Arrested for Tax Evasion`,
        `${char1} Goes to the Moon`,
        `${char1} Gets Cancelled`,
        `${char1} In Space`,
        `${char1} Gets Banned from ${platform}`,
        `${char1} Violates the ${platform} TOS`,
        `${char1} Joins ${platform}`,
        `${char1} Quits ${platform}`,
        `${char1} vs. ${platform}`,
        `${char1} To the Rescue`,
        `${char1} Gets a Job`,
        `${char1}'s Triple Bypass`,
        `${char1} vs. The Monorail`,
        `${char1} vs. The Tornado`,
        `${char1} vs. The Volcano`,
        `${char1} vs. The ${animal1}`,
        `${char1} Gets Famous`,
       // `${char1} vs. Malibu Stacy`,
        `${char1}'s Rival`,
        `Who Shot ${char1}? (Part One)`,
        `In ${char1} We Trust`,
        `Where No ${Rand(["Dobbs", "Dog"])} Has Gone Before`,
       // `The Wheel Within`,
        `We'll Always Have ${platform}`,
        `I, ${char1}`,
        `${char1} Forgets The Oxygen`,
        `${char1} Is Practically Invincible`,
        `${char1} Rolls a Strong Hit`,
        `${char1} Learns The Power of Friendship`,
        `${char1} Forgets The Password`,
        `${char1} Wastes The Master Ball`,
        `${char1} Lets a Creeper In`,
        `${char1} Parties Too Hard`,
        `${char1} Takes a Nap`,
        `${char1} Finds a Pizza`,
        `${char1} Finds a Dev Exit`,
        `${char1} Finds Inner Peace`,
        `${char1} Says "Poggers" IRL`,
        `${char1} Saves Christmas`,
        `${char1} Reinvents the Wheel`,
        `${char1} Finally Goes to Bed`,
        `${char1} Ruins Christmas`,
        `${char1} Ruins ${Rand(["Arbor Day", "Colombus Day", "Labor Day", "the Ole Labor Dabor", "Halloween"])}`,
        `${char1} Launches the Rocket`,
        `It's the Great Pumpkin, ${char1}`,
        `Dobbs Makes Yet Another Intro`,
        `Too Many Intros`,
        `Unedited Footage of a ${animal1}`,
        `So Long, and Thanks for all the ${animal1}s`,
        `Gugyugubah!`,
        `Crouching ${animal1}, Hidden ${animal2}`,
    ]);
}

function Rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}