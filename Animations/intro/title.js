function CreateTitle() {
    let char1 = Rand([
        "Dobbs", 
        Rand([
            "Hover Cat", 
            "Gracie", 
            //"Lil' Toadette",
            "Rover",
        ])
    ]);
    
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
        `${char1} Gets Famous`,
        `${char1} vs. Malibu Stacy`,
        `${char1}'s Rival`,
        `Who Shot ${char1}? (Part One)`,
        `In ${char1} We Trust`,
        `Where No ${Rand(["Dobbs", "Dog"])} Has Gone Before`,
        `The Wheel Within`,
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
    ]);
}

function Rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}