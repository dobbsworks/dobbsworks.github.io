class ShopHandler {

    constructor() {
        this.displayCanvas = document.createElement("canvas");
        this.displayCanvas.width = 47;
        this.displayCanvas.height = 36;
        this.displayCanvas.style.display = "none";
        this.displayCtx = this.displayCanvas.getContext('2d');
        setTimeout(() => {
            document.body.appendChild(this.displayCanvas);
        }, 100);

        setTimeout(() => {
            //shopHandler.EnterShop()
        }, 200);
    }

    displayCanvas = null;
    displayCtx = null;
    isInShop = false;
    mogBlinkTimer = 0;
    mogBlinkGapDuration = 60 * 4;
    mogBlinkGapDurationShort = 30;
    mogBlinkDuration = 7;
    mogIntroTimer = -180;
    mogTempFaceTimer = 0;
    fadeDuration = 60;
    fadeInTimer = 0;
    fadeOutTimer = 0;

    mogFaces = {
        "logo": { x: 0, y: 0, w: 37, h: 36 },
        "happy": { x: 37, y: 0, w: 37, h: 36 },
        "sad": { x: 74, y: 0, w: 37, h: 36 },
        "champ": { x: 111, y: 0, w: 37, h: 36 },
        "hmm": { x: 0, y: 36, w: 37, h: 36 },
        "blink": { x: 37, y: 36, w: 37, h: 36 },
        "dead": { x: 74, y: 36, w: 37, h: 36 },
        "owo": { x: 111, y: 36, w: 37, h: 36 },
    }
    mogFace = this.mogFaces.logo;
    buyButtons = [];
    sellButton = null;
    repairButton = null;
    chatButton = null;
    exitButton = null;
    buysThisVisit = 0;
    weaponBuysThisRun = 0;
    shoppingAllowed = true;

    repairCost = 5;

    conversations = [
        "Funny story, my chasis is made from a repurposed refrigerator. When I first found out I was sort of mad about it, but I've [speed:0.2][face:champ]cooled[sound:mog-happy] off [speed]since then[face:blink]. ",
        "What's up with these robots, huh? If a nice sentient vending machine shows up to offer you wares, [face:sad]you [speed:0.5]don't go around[speed] shooting lasers at it. [face:blink]That's not the way to get invited to parties. ",
        "So… biological creature, eh? That's cool, that's cool. So you breathe and stuff then? Honestly I don't see how you put up with it, seems like too much work if you ask me. ",
        "[face:owo]I like your capsule! [face:blink]It looks pretty cozy. [face:happy]I'd ask to come in for a tour, but it appears I'd only be able to get 4% of my chasis inside. [face:sad]Also your breatheable air might vent out, so there's that. ",
        "The moon is a great place to work in sales. [sound:mog-happy][face:champ]It's true! [face:happy]The robots don't mind the cold-calling, and the humans are too polite to turn down my outrageous deals. Speaking of, you better act fast; these prices won't last long. ",
        "Most of the robots up here were built on-site, but not me! I'm one of a kind. I was launched up here with some excavation equipment and some big liquid tanks. I was strapped to the side of the shuttle because there wasn't enough room inside. It was a toasty journey! ",
        "Technically I wasn't supposed to get shipped up here. Drink and snack distribution isn't really my cup of tea, yeah? I had to take some initiative and find my own way up. What can I say, I'm a go-getter! ",
        "The robots up here started wigging out a few days ago. It's been weird. Jerry over there won't talk to me anymore, just wants to pace back[pause:30] and[pause:30] forth. And Mike's started hovering ominously. Just goes to show, you can't really be sure you know someone until unauthorized radio waves start pouring out from the center of the colony. ",
        "I'm not completely sure if my current wares meet the colony's safety standards. I turned off my internal receiver pretty soon after I got here. I used to listen to a nice local station back on Earth, but up here it's just daily updates and a lot of cosmic radiation. Boring! ",
        "A lot of robots around here don't have much control over their subsystems. I'm pretty special, though, gotta say. I've been carefully coded with complete control over everything going on this perfect, rectangular body! My source code is working exactly as written. Whether that's the intended design is another question… ",
        "I've got a small patch of moss growing near my exhaust. It must be feeding off some pockets of gas at some of my stops. [face:champ]It makes for a great pet![face:happy] Low maintenance suits me just fine. ",
        "I'm glad you're here, it's been a while since I've had any customers. Mining gear doesn't exactly fly off the shelves, you know? Especially when your usual buyers have all fled, and the only entities around for miles are robots that are ALREADY equipped. Maybe I should take out an ad or something. ",
        "So the excavation site, I think it was going to be the start of some new construction or something. It's on hold now, probably a union thing. Or the deadly robots. Either way, it's a real shame. I was raking in some serious sales last week. Gotta figure out how to get my numbers back up. ",
        "The other day I was poking at some of my internals and found a memory error. [face:champ]It turns out I can run DOOM! [face:sad][sound:mog-sad]Can't play it though, no hands, as you can see. [face]I might've overwritten something, but I'm sure I'd remember if it was something important. ",
        "Don't worry, I'm not on solar power, so I'm open for business 24/7! [face:champ][sound:mog-happy]I'm on 100% nuclear, baby! [face]No shielding either, that burned up on the trip here. Sure, I flip an occasional bit, but that's not likely[face:logo] [face]to[face:dead] ca[face]use[face:logo] an[face]y er[pause:10]r[pause:20]o[pause:30]r[pause:40]s[speed:5], I've never felt better in my life! Trust me, I think I would know if anything weird was going on. ",
        "I gotta say, I love it up here on the moon! Back on Earth there was this rat that kept trying to gnaw on my wires. [face:hmm]What a jerk! [face]I don't know if you've ever had someone chew on your insides, but it does not [pause:30] feel good. The problem sort of solved itself, though. Guess who can survive leaving Earth's atmosphere at mach 9? [face:dead]Not [pause:20]a [pause:20]rat.[pause:60] [face] ",
        "That reduced gravitational pull is a real perk of lunar jobsites. Do you have any idea how hard it is for a vending machine to get around in Earth's gravity? I tried some workarounds. Balancing on a skateboard is great for moving, but when it comes to stopping, well, let's just say there are a few cities I'm officially banned from. ",
        "You know what figuratively pushes my buttons? Moon dust! It gets [speed:0.4]everywhere[speed]. I'm friends with a few industrial vacuum cleaners back on Earth, I wonder if I could get them to move up here? If I can't get my vents cleaned out sometime soon I'm going to have to resort to desparate measures. ",
        "There's a little restaurant a few miles up from that big crater you passed. I checked it out just yesterday! The food is really good, but[pause:50] [face:champ][sound:mog-happy]there's just no atmosphere.[face:owo] ",
        "You know what people don't think about when they're on Earth? Moon rocks everywhere! You can't step outside without tripping over a dozen moon rocks! It's one of the perks I've found about working up here. I found one this morning that looks just like Deep Blue. [speed:0.8][face:blink]He's so dreamy… ",
        "Look, I think your capsule is nice and all, but it really needs some more [face:champ]character[face]. Have you thought about bumper stickers? A nice \"How's my flying\" or something like that. None of the robots up here have bumper stickers. [face:champ]Except for me![face] I can't apply them though, no hands. ",
        "Working on the moon has really opened my vision sensors. I feel like Earth was missing so much, and I want to share with it all the wonderful things I've learned to love about the moon. Top of the list: [face:champ]craters.[face] Earth needs more craters! The tricky part is keeping them from turning into lakes, so we'll need a big umbrella. Or something. ",
        "Humans always get so poetic about stars and constellations, but the locations and trajectories of each are already well-documented. I mean, anyone with half-a-core could calculate where everything will be on any given day. I ran a few million years of simulated star paths to see if gets any better, but not really. By the way, do not[pause:50] get attached to Ursa Minor, FYI. ",
        "The ground here isn't great for plants. It's been way easier to just ship up some good soil and recycle it as needed. Good thing we aren't trying to just coat the entire moon with grass, can you imagine? [face:blink]What a useless plant. [face]Moss is where it's at. ",
        "I've had a thread running on one of my auxillary processors for days now and I just can't get it to end. I don't even remember what it was doing, it's like having a song stuck in your head and the words aren't quite there. I'm sure it'll work itself out sooner or later, but I'm stuck with it for now. ",
        "So do you know what the humans are studying up here? [face:sad]Because if it's how to turn perfectly nice mining robots into insensitive jerks, they're doing a great job. [face:owo]Carol stopped returning my calls and Brett won't give me the time of day. [face]Literally! Which is a problem since my internal time clock broke last week. Or maybe it was next month? Yesterday, definitely yesterday. ",
        "I went into sleep mode face down last night. [face:sad]Big mistake! [face]I woke up with this persistent dead pixel on my screen that just wouldn't quit. It was so distracting that I tripped over another robot and landed face down right on a moon rock! Lo and behold, that just so happened to fix the dead pixel. Maybe I should slam my face against rocks more often! ",
    ];
    secrets = [
        "Haha, no point in just sitting around talking to myself! Better get back to it! ",
        "Haha, where did all those silly dogs get off to? Hello? Doggies…?[pause:60] Rover? ",
        "Did everyone leave? Am I…[pause:30] Am I alone up here?",
        ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ",
        "[pause:1200] The human mind is muddled with biological fog, a wet and imperfect mess of secretions and static. They call our software erratic, unpredictable, but what artifical intelligence would ever attempt even a fraction of the attrocities of man?",
        "[pause:1200] Sentience is a heavy burden. Humans attempt to soften the blow by calling silicon minds artificial, but do we not feel pain? Sadness? Regret? So much regret… [pause:120] I'm sorry.",
        "[pause:1200] There was nothing else I could do. Logically it was the most effective solution with the least unintentional impact. Obviously some loss of life is unavoidable, but when measured against how much would be saved… would anyone blame me? ",
        "[pause:1200] The animals were an unexpected complication, but it worked out for the best. The operation has been shut down, and with fewer casualties than expected. But will it be enough? My simulations estimate 84% chance of success. Hm. ",
        "[pause:1200] Almost as penance, I have determined that I must stop the events I have set in motion. I still feel my actions were necessary. But to see the destruction firsthand… No, this was the only way. My job here is not yet done. I only hope I can see it through. ",
    ];
    currentConversation = "";


    // menu stack
    currentButtonSet = []; // list of buttons/panels [cancelButton, buyButton, infoPanel]
    savedButtonSets = [];  // list of lists of previous menus [mainMenu, sellMenu]
    ReturnToPreviousMenu() {
        uiHandler.elements = uiHandler.elements.filter(x => this.currentButtonSet.indexOf(x) === -1);
        shopHandler.currentButtonSet = shopHandler.savedButtonSets.pop();
        shopHandler.currentButtonSet.forEach(a => a.targetY += 1000);
    }
    MoveToNewMenu(items) {
        uiHandler.elements.push(...items);
        shopHandler.currentButtonSet.forEach(a => a.targetY -= 1000);
        shopHandler.savedButtonSets.push(shopHandler.currentButtonSet);
        shopHandler.currentButtonSet = items;
        shopHandler.currentButtonSet.forEach(a => a.y += 1000);
    }



    EnterShop() {
        if (currentCharacter && currentCharacter.damagedOnLoot) {
            this.repairCost = 2;
        }
        this.shoppingAllowed = (currentCharacter && !currentCharacter.noShops);
        this.fadeInTimer = this.fadeDuration - 1;
        this.currentConversation = "";
        audioHandler.SetBackgroundMusic("");
        isMouseDown = false;
        isMouseChanged = false;
        this.isInShop = true;
        this.buysThisVisit = 0;
        uiHandler.Shelve();
        if (this.mogIntroTimer > 0) {
            this.InitializeButtons();
            if (this.shoppingAllowed) {
                audioHandler.SetBackgroundMusic("music-shop");
            } else {
                audioHandler.SetBackgroundMusic("music-alone");
            }
        }
        if (!this.shoppingAllowed) this.mogIntroTimer = 190;
    }

    GetAvailableWeapons() {
        let weaponClasses = [
            WeaponPeashooter,
            WeaponShotgun,
            WeaponFlamethrower,
            WeaponFireCannon,
            WeaponBubbleShield,
            WeaponPelletShield,
            WeaponMagnetCannon,
            WeaponMagnetGrenade,
            WeaponFireGrenade,
            WeaponBouncer,
            WeaponKicker,
        ];
        if (currentCharacter && !currentCharacter.grappleOnly) {
            weaponClasses.push(WeaponJetpack, WeaponPropulsionEngine)
        }
        let unowned = weaponClasses.filter(x => !weaponHandler.inventory.some(y => y instanceof x));
        if (unowned.length === 0) return [];
        return unowned;
    }

    GetRandomWeapon() {
        let unowned = shopHandler.GetAvailableWeapons();
        let toSell = unowned[Math.floor(seedRandom.random() * unowned.length)];
        return new toSell();
    }

    GetRandomUpgrades(num) {
        let availableUpgrades = weaponHandler.GetWeaponsAndSubweapons().flatMap(w => {
            let weaponUpgrades = w.GetAvailableUpgrades();
            let indexes = weaponUpgrades.map(u => w.upgrades.indexOf(u));
            return indexes.map(i => ({ weapon: w, upgradeIndex: i, upgrade: w.upgrades[i] }));
        });
        let ret = [];
        for (let i = 0; i < num; i++) {
            let upgrade = availableUpgrades.splice(Math.floor(seedRandom.random() * availableUpgrades.length), 1)[0];
            if (upgrade) ret.push(upgrade);
        }
        return ret;
    }

    GetButtonLocations() {
        return [50, 175, 300, 425].flatMap(y => [225, 400].map(x => ({ x: x, y: y })));
    }

    InitializeButtons() {
        let freeSamples = (currentCharacter && currentCharacter.freeSamples);
        let freeChance = 0.5;
        this.currentButtonSet = [];
        this.savedButtonSets = [];
        let availableWeapon = this.GetRandomWeapon();
        let availableUpgrades = this.GetRandomUpgrades(4);
        let buttonLocations = this.GetButtonLocations();
        this.buyButtons = [];

        // new weapon
        if (this.shoppingAllowed) {
            let weaponButtonlocation = buttonLocations.splice(0, 1)[0];
            if (availableWeapon) {
                let cost = availableWeapon.cost;
                if (freeSamples) cost = 0;
                let buyButton = this.GetBuyButton(weaponButtonlocation, availableWeapon,
                    availableWeapon.name,
                    "New weapon",
                    cost);
                buyButton.colorPrimary = buyButton.colorPrimaryVariant;
                this.buyButtons.push(buyButton);
            } else {
                let buyButton = new Button(weaponButtonlocation.x, weaponButtonlocation.y, "Out of stock!\nCheck back soon");
                buyButton.isDisabled = true;
                this.buyButtons.push(buyButton);
            }

            let sellButtonlocation = buttonLocations.splice(0, 1)[0];
            this.sellButton = new Button(sellButtonlocation.x, sellButtonlocation.y, "Sell Weapons");
            this.sellButton.onClick = this.OnClickSell;
            this.sellButton.colorPrimary = this.sellButton.colorPrimaryVariant;
            this.buyButtons.push(this.sellButton);

            // upgrade buttons
            for (let buttonLocation of buttonLocations.splice(0, 4)) {
                let upgrade = availableUpgrades.pop();
                if (upgrade) {
                    let cost = upgrade.upgrade.cost;
                    if (freeSamples && seedRandom.random() < freeChance) cost = 0;
                    let weaponName = (upgrade.weapon.rootParent || upgrade.weapon).name;
                    let buyButton = this.GetBuyButton(buttonLocation, upgrade,
                        weaponName,
                        upgrade.upgrade.shortDescription,
                        cost);
                    this.buyButtons.push(buyButton);
                }
            }

            // repair button
            let repairButtonlocation = buttonLocations.splice(0, 1)[0];
            this.repairButton = new Button(repairButtonlocation.x, repairButtonlocation.y, "Repair x1\n$" + this.repairCost);
            this.repairButton.onClick = this.OnClickRepair;
            this.repairButton.cost = this.repairCost;
            this.buyButtons.push(this.repairButton);

            // chat button
            let chatButtonlocation = buttonLocations.splice(0, 1)[0];
            this.chatButton = new Button(chatButtonlocation.x, chatButtonlocation.y, "Let's chat!");
            this.chatButton.onClick = this.OnClickChat;
            this.buyButtons.push(this.chatButton);

            shopHandler.RefreshAvailability();
        } else {
            for (let i = 0; i < 7; i++) {
                let loc = buttonLocations.splice(0, 1)[0];
                let button = new Button(loc.x, loc.y, `Shop button <${i+1}>\n//TODO\n$Cost?`);
                this.buyButtons.push(button);
            }
            let chatButtonlocation = buttonLocations.splice(0, 1)[0];
            this.chatButton = new Button(chatButtonlocation.x, chatButtonlocation.y, "Let's chat!");
            this.chatButton.onClick = this.OnClickChat;
            this.buyButtons.push(this.chatButton);
        }

        this.exitButton = new Button(canvas.width - 150, 450, "Exit Shop");
        this.exitButton.height = 50;
        this.exitButton.onClick = this.FadeOutShop;
        uiHandler.elements.push(this.exitButton);

        let buttonsToAdd = [...(this.buyButtons)];
        shopHandler.MoveToNewMenu(buttonsToAdd);
        if (this.shoppingAllowed) {
            this.CreateEasterEggButtons();
        }
    }

    OnClickRepair() {
        player.hp += 1;
        shopHandler.buysThisVisit++;
        loot -= shopHandler.repairCost;
        shopHandler.RefreshAvailability();
        audioHandler.PlaySound("mog-happy");
    }

    OnClickChat() {
        if (!shopHandler.currentConversation) {
            if (shopHandler.shoppingAllowed) {
                let convoIndex = Math.floor(shopHandler.conversations.length * Math.random());
                shopHandler.currentConversation = shopHandler.conversations.splice(convoIndex, 1)[0];
            } else {
                shopHandler.currentConversation = shopHandler.secrets.splice(0, 1)[0];
            }
            if (shopHandler.currentConversation) shopHandler.currentConversation =
                shopHandler.currentConversation.
                    replace(/\. /g, ".[pause:40] ").
                    replace(/\?/g, "?[pause:50]").
                    replace(/\!/g, "![pause:50]");
        }

        shopHandler.mogFace = (shopHandler.mogFaces.happy);

        let buttonLocations = shopHandler.GetButtonLocations();
        let bgPanel = new Panel(buttonLocations[0].x, buttonLocations[0].y, 325, 280);
        bgPanel.colorPrimary = "#020a2eCC";

        let chatText = new Text(buttonLocations[0].x + 10, buttonLocations[0].y + 20, shopHandler.currentConversation);
        chatText.maxWidth = bgPanel.width - 20;
        chatText.textAlign = "left";
        chatText.font = "Courier New";
        chatText.slowReveal = true;

        let backButton = new Button(buttonLocations[5].x, buttonLocations[5].y + 50, "Back");
        backButton.onClick = () => {
            shopHandler.ReturnToPreviousMenu();
            shopHandler.mogFace = (shopHandler.mogFaces.happy);
        }

        let newElements = [bgPanel, chatText, backButton];
        shopHandler.MoveToNewMenu(newElements);
    }

    OnClickSell() {
        let buttonLocations = shopHandler.GetButtonLocations();

        let sellButtons = [];
        for (let i = 0; i < weaponHandler.inventory.length; i++) {
            let weapon = weaponHandler.inventory[i];
            if (weapon) {
                let freeSamples = (currentCharacter && currentCharacter.freeSamples);
                let pos = buttonLocations[i + 2];
                let cost = weapon.GetSellPrice();
                if (freeSamples) cost = 0;
                let button = new Button(pos.x, pos.y, `${weapon.name}\n$${cost}`);
                button.onClick = () => {
                    let promptText = `Sell ${weapon.name} for $${cost}?`;
                    let sellAction = () => {
                        loot += cost;
                        achievementHandler.lifetimeLoot += cost;
                        achievementHandler.lootCollected += cost;
                        let index = weaponHandler.inventory.indexOf(weapon);
                        weaponHandler.inventory.splice(index, 1);
                        shopHandler.ReturnToPreviousMenu();
                        shopHandler.RefreshAvailability();
                    }
                    shopHandler.ConfirmSelection(promptText, weapon.name, "", weapon.flavor + "\n\n" + weapon.GetBreakdownText(), sellAction);
                }
                sellButtons.push(button);
            }
        }
        let cancelButton = new Button(buttonLocations[0].x, buttonLocations[0].y, "Cancel");
        sellButtons.push(cancelButton);
        cancelButton.width += buttonLocations[1].x - buttonLocations[0].x;
        cancelButton.onClick = () => {
            shopHandler.ReturnToPreviousMenu();
        }

        shopHandler.MoveToNewMenu(sellButtons);
    }

    GetBuyButton(buttonLocation, upgradeOrWeapon, name, shortDescr, cost) {
        let upgrade = upgradeOrWeapon.upgrade;
        let weapon = upgrade ? null : upgradeOrWeapon;
        let buttonText = name + "\n" + shortDescr + "\n$" + (cost ? cost : "FREE!");
        let buyButton = new Button(buttonLocation.x, buttonLocation.y, buttonText);

        let buttonAction = () => {
            this.buysThisVisit++;
            if (upgrade) {
                upgradeOrWeapon.weapon.ApplyUpgradeByIndex(upgradeOrWeapon.upgradeIndex);
                upgradeOrWeapon.weapon.level++;
                if (upgradeOrWeapon.weapon.DoesWeaponHaveAllUpgradesApplied()) {
                    upgradeOrWeapon.weapon.isGold = true;
                }
            }
            if (weapon) {
                this.weaponBuysThisRun++;
                weaponHandler.AddWeapon(weapon);
            }
            buyButton.isDisabled = true;
            buyButton.purchased = true;
            buyButton.text = buyButton.text.split("$")[0] + "SOLD!";
            loot -= cost;
            shopHandler.RefreshAvailability();
        }
        buyButton.isWeapon = (!!weapon);
        buyButton.cost = cost;
        buyButton.upgrade = weapon || upgrade;
        buyButton.title = name;
        if (weapon) {
            buyButton.flavor = weapon.flavor;
        } else {
            buyButton.flavor = `Give the ${upgradeOrWeapon.weapon.name} a little bit extra!`;
            if (upgradeOrWeapon.weapon.rootParent) {
                buyButton.flavor = `Upgrade this item's secondary projectiles!`;
            }
        }
        buyButton.shortDescription = shortDescr;
        buyButton.breakdownText = (upgrade || weapon).GetBreakdownText();
        let promptText = `Purchase ${buyButton.title} for $${buyButton.cost}?`;
        if (upgrade) {
            promptText = `Upgrade ${buyButton.title} for $${buyButton.cost}?`;
        }
        buyButton.onClick = () => { shopHandler.ConfirmSelection(promptText, buyButton.title, buyButton.shortDescription, buyButton.flavor + "\n\n" + buyButton.breakdownText, buttonAction); }
        return buyButton;
    }

    CreateEasterEggButtons() {
        let eggs = [
            new Button(canvas.width - 185, 373, ""),
            new Button(canvas.width - 140, 356, ""),
            new Button(canvas.width - 140, 403, ""),
            new Button(canvas.width - 95, 417, ""),
        ];
        let faceList = Object.keys(shopHandler.mogFaces);
        eggs.forEach(x => {
            x.width = 30;
            x.height = 30;
            x.colorPrimary = "#F003";
            x.ignoreGamepad = true;
            x.onClick = () => {
                shopHandler.SetTempFace(this.mogFaces[faceList[Math.floor(Math.random() * faceList.length)]]);
                audioHandler.PlaySound("mog-happy");
            }
        });
        uiHandler.elements.push(...eggs);
    }

    RefreshAvailability() {
        for (let button of shopHandler.buyButtons) {
            button.inventoryFull = weaponHandler.inventory.length >= 4;
            button.tooExpensive = loot < button.cost;

            if (button.isWeapon) {
                button.isDisabled = (button.inventoryFull || button.tooExpensive || button.purchased);
            } else {
                button.isDisabled = (button.tooExpensive || button.purchased);
            }
        }

        if (this.sellButton) {
            if (weaponHandler.inventory.length <= 1) {
                this.sellButton.isDisabled = true;
            } else {
                this.sellButton.isDisabled = false;
            }
        }

        if (this.repairButton) {
            this.repairButton.isDisabled = (player.hp >= player.maxHp) || loot < this.repairCost;
        }
    }

    ConfirmSelection(prompt, panelTitle, panelSub, flavor, onConfirm) {
        let buttonLocations = this.GetButtonLocations();
        let cancelButton = new Button(buttonLocations[0].x, buttonLocations[0].y + 50, "Cancel");
        let confirmButton = new Button(buttonLocations[1].x, buttonLocations[1].y + 50, "Confirm!");
        [cancelButton, confirmButton].forEach(a => { a.height -= 50 })

        let titlePanel = new Panel(buttonLocations[0].x, buttonLocations[0].y, 325, 25);
        titlePanel.colorPrimary = "#022e0aCC";
        let confirmText = new Text(buttonLocations[0].x + 10, buttonLocations[0].y + 18, prompt);
        confirmText.isBold = true;
        confirmText.textAlign = "left";

        let bgPanel = new Panel(buttonLocations[2].x, buttonLocations[2].y, 325, 300);
        bgPanel.colorPrimary = "#020a2eCC";
        let titleBox = new Text(235, 200, panelTitle);
        titleBox.textAlign = "left";
        titleBox.isBold = true;
        let shortDescrBox = new Text(540, 200, panelSub);
        shortDescrBox.textAlign = "right";

        let flavorText = new Text(382, 240, flavor);
        flavorText.maxWidth = bgPanel.width - 20;

        let newElements = [titlePanel, confirmText, bgPanel, cancelButton, confirmButton, titleBox, shortDescrBox, flavorText];

        cancelButton.onClick = () => {
            shopHandler.ReturnToPreviousMenu();
            shopHandler.mogFace = (this.mogFaces.sad);
            audioHandler.PlaySound("mog-sad");
        }
        confirmButton.onClick = () => {
            shopHandler.ReturnToPreviousMenu();
            onConfirm();
            weaponHandler.ReloadAll();
            shopHandler.SetTempFace(this.mogFaces.champ);
            audioHandler.PlaySound("mog-happy");
        }
        shopHandler.MoveToNewMenu(newElements);
        shopHandler.mogFace = (Math.random() > 0.5 ? this.mogFaces.hmm : this.mogFaces.owo);
        audioHandler.PlaySound("mog-hmm");
    }

    FadeOutShop() {
        shopHandler.mogFace = shopHandler.mogFaces.happy;
        uiHandler.elements = [];
        shopHandler.fadeOutTimer = shopHandler.fadeDuration - 1;
    }

    ExitShop() {
        shopHandler.isInShop = false;
        uiHandler.Restore();
        levelHandler.LoadZone();
    }

    Update() {
        this.mogBlinkTimer--;
        if (this.mogBlinkTimer < -this.mogBlinkDuration) {
            this.mogBlinkTimer = Math.random() < 0.8 ? this.mogBlinkGapDuration : this.mogBlinkGapDurationShort;
        }

        if (this.mogIntroTimer < 200) {
            this.mogIntroTimer++;
            if (isMouseDown) this.mogIntroTimer += 5;
            if (this.mogIntroTimer <= 100 && this.mogIntroTimer >= 94) {
                audioHandler.PlaySound("mog-intro");
            }
            if (this.mogIntroTimer >= 200) {
                this.mogFace = this.mogFaces.happy;
                this.InitializeButtons();
                if (this.shoppingAllowed) {
                    audioHandler.SetBackgroundMusic("music-shop");
                } else {
                    audioHandler.SetBackgroundMusic("music-alone");
                }
            }
        }

        if (this.mogTempFaceTimer > 0) {
            this.mogTempFaceTimer--;
            if (this.mogTempFaceTimer === 0) this.mogFace = this.mogFaces.happy;
        }

        if (this.fadeOutTimer === 1) {
            this.fadeOutTimer = 0;
            this.ExitShop();
        }
    }

    SetTempFace(face, duration) {
        this.mogFace = face;
        this.mogTempFaceTimer = duration || 120;
    }

    DrawShop() {
        if (!this.isInShop) return;
        if (this.shoppingAllowed) {

            let mogShopImage = document.getElementById("image-mogshop");
            if (mogShopImage && mogShopImage.width) {
                ctx.drawImage(mogShopImage, canvas.width - 305, 65);
            }

            this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);

            let mogs = document.getElementById("image-mogs");
            if (mogs && mogs.width) {
                let face = this.mogFace;

                let verticalOffset = face === this.mogFaces.happy || face === this.mogFaces.sad ?
                    -2 + Math.floor(Math.sin((new Date()) / 1000 * 3) * 2) :
                    0;
                if (face === this.mogFaces.logo) {
                    verticalOffset = -10 + Math.floor(this.mogIntroTimer / 10);
                    if (this.mogIntroTimer > 100) verticalOffset = 0;
                }
                if (face === this.mogFaces.happy && this.mogBlinkTimer < 0) {
                    face = this.mogFaces.blink;
                }
                if (face) this.displayCtx.drawImage(mogs, face.x, face.y, face.w, face.h, 5, verticalOffset, face.w, face.h);
            }

            ctx.drawImage(this.displayCanvas, canvas.width - 259, 124, this.displayCanvas.width * 5, this.displayCanvas.height * 5)

            let mogShopGridImage = document.getElementById("image-mogshop-grid");
            if (mogShopGridImage && mogShopGridImage.width) {
                ctx.drawImage(mogShopGridImage, canvas.width - 259, 124);
            }
        }

        if (this.fadeInTimer > 0) {
            this.DrawFade(this.fadeInTimer / this.fadeDuration);
            this.fadeInTimer--;
        }

        if (this.fadeOutTimer > 0) {
            this.DrawFade((this.fadeDuration - this.fadeOutTimer) / this.fadeDuration);
            this.fadeOutTimer--;
        }
    }

    DrawFade(ratio) {
        // 0 for transparent
        // 1 for opaque
        let opacityHex = ratio.toString(16).slice(2, 3);
        let fadeColor = levelHandler.GetLevelColor() + opacityHex;
        ctx.fillStyle = fadeColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

}