var ironswornData = {
    moves: [
        {
            name: "Face Danger",
            type: "Adventure",
            text: `When you attempt something risky or react to an imminent threat, envision your action and roll. If you act...
            • With speed, agility, or precision: Roll +edge.
            • With charm, loyalty, or courage: Roll +heart.
            • With aggressive action, forceful defense, strength, or endurance: Roll +iron.
            • With deception, stealth, or trickery: Roll +shadow.
            • With expertise, insight, or observation: Roll +wits.
            On a strong hit, you are successful. Take +1 momentum.
            On a weak hit, you succeed, but face a troublesome cost. Choose one.
            • You are delayed, lose advantage, or face a new danger: Suffer -1 momentum.
            • You are tired or hurt: Endure Harm (1 harm).
            • You are dispirited or afraid: Endure Stress (1 stress).
            • You sacrifice resources: Suffer -1 supply.
            On a miss, you fail, or your progress is undermined by a dramatic and costly turn of events. Pay the Price. `
        },
        {
            name: "Secure An Advantage",
            type: "Adventure",
            text: `When you assess a situation, make preparations, or attempt to gain leverage, envision your action and roll. If you act...
            • With speed, agility, or precision: Roll +edge.
            • With charm, loyalty, or courage: Roll +heart.
            • With aggressive action, forceful defense, strength, or endurance: Roll +iron.
            • With deception, stealth, or trickery: Roll +shadow.
            • With expertise, insight, or observation: Roll +wits.
            On a strong hit, you gain advantage. Choose one.
            • Take control: Make another move now (not a progress move), and add +1.
            • Prepare to act: Take +2 momentum.
            On a weak hit, your advantage is short-lived. Take +1 momentum.
            On a miss, you fail or your assumptions betray you. Pay the Price. `
        },
        {
            name: "Gather Information",
            type: "Adventure",
            text: `When you search an area, ask questions, conduct an investigation, or follow a track, roll +wits. If you act within a community or ask questions of a person with whom you share a bond, add +1. 
            On a strong hit, you discover something helpful and specific. The path you must follow or action you must take to make progress is made clear. Envision what you learn (Ask the Oracle if unsure), and take +2 momentum.
            On a weak hit, the information complicates your quest or introduces a new danger. Envision what you discover (Ask the Oracle if unsure), and take +1 momentum.
            On a miss, your investigation unearths a dire threat or reveals an unwelcome truth that undermines your quest. Pay the Price. `
        },
        {
            name: "Heal",
            type: "Adventure",
            text: `When you treat an injury or ailment, roll +wits. If you are mending your own wounds, roll +wits or +iron, whichever is lower.
            On a strong hit, your care is helpful. If you (or the ally under your care) have the wounded condition, you may clear it. Then, take or give up to +2 health.
            On a weak hit, as above, but you must suffer -1 supply or -1 momentum (your choice).
            On a miss, your aid is ineffective. Pay the Price. `
        },
        {
            name: "Resupply",
            type: "Adventure",
            text: `When you hunt, forage, or scavenge, roll +wits.
            On a strong hit, you bolster your resources. Take +2 supply.
            On a weak hit, take up to +2 supply, but suffer -1 momentum for each.
            On a miss, you find nothing helpful. Pay the Price. `
        },
        {
            name: "Make Camp",
            type: "Adventure",
            text: `When you rest and recover for several hours in the wild, roll +supply. On a strong hit, you and your allies may each choose two. On a weak hit, choose one.
            • Recuperate: Take +1 health for you and any companions.
            • Partake: Suffer -1 supply and take +1 health for you and any companions.
            • Relax: Take +1 spirit.
            • Focus: Take +1 momentum.
            • Prepare: When you break camp, add +1 if you Undertake a Journey.
            On a miss, you take no comfort. Pay the Price. `
        },
        {
            name: "Undertake a Journey",
            type: "Adventure",
            text: `When you travel across hazardous or unfamiliar lands, set the rank of your journey.
            • Troublesome journey: 3 progress per waypoint.
            • Dangerous journey: 2 progress per waypoint.
            • Formidable journey: 1 progress per waypoint.
            • Extreme journey: 2 ticks per waypoint.
            • Epic journey: 1 tick per waypoint.
            Then, for each segment of your journey, roll +wits. If you are setting off from a community with which you share a bond, add +1 to your initial roll.
            On a strong hit, you reach a waypoint. If the waypoint is unknown to you, envision it (Ask the Oracle if unsure). Then, choose one.
            • You make good use of your resources: Mark progress.
            • You move at speed: Mark progress and take +1 momentum, but suffer -1 supply.
            On a weak hit, you reach a waypoint and mark progress, but suffer -1 supply.
            On a miss, you are waylaid by a perilous event. Pay the Price. `
        },
        {
            name: "Reach Your Destination",
            type: "Adventure",
            text: `Progress Move
            When your journey comes to an end, roll the challenge dice and compare to your progress. Momentum is ignored on this roll.
            On a strong hit, the situation at your destination favors you. Choose one.
            • Make another move now (not a progress move), and add +1.
            • Take +1 momentum.
            On a weak hit, you arrive but face an unforeseen hazard or complication. Envision what you find (Ask the Oracle if unsure).
            On a miss, you have gone hopelessly astray, your objective is lost to you, or you were misled about your destination. If your journey continues, clear all but one filled progress, and raise the journey’s rank by one (if not already epic). `
        },
        {
            name: "Compel",
            type: "Relationship",
            text: `When you attempt to persuade someone to do something, envision your approach and roll. If you...
            • Charm, pacify, barter, or convince: Roll +heart (add +1 if you share a bond).
            • Threaten or incite: Roll +iron.
            • Lie or swindle: Roll +shadow.
            On a strong hit, they’ll do what you want or share what they know. Take +1 momentum. If you use this exchange to Gather Information, make that move now and add +1.
            On a weak hit, as above, but they ask something of you in return. Envision what they want (Ask the Oracle if unsure).
            On a miss, they refuse or make a demand which costs you greatly. Pay the Price. `
        },
        {
            name: "Sojourn",
            type: "Relationship",
            text: `When you spend time in a community seeking assistance, roll +heart. If you share a bond, add +1.
            On strong hit, you and your allies may each choose two from within the categories below. On a weak hit, choose one. If you share a bond, choose one more.
            On a hit, you and your allies may each focus on one of your chosen recover actions and roll +heart again. If you share a bond, add +1. On a strong hit, take +2 more for that action. On a weak hit, take +1 more. On a miss, it goes badly and you lose all benefits for that action.
            Clear a Condition
            • Mend: Clear a wounded debility and take +1 health.
            • Hearten: Clear a shaken debility and take +1 spirit.
            • Equip: Clear an unprepared debility and take +1 supply.
            Recover
            • Recuperate: Take +2 health for yourself and any companions.
            • Consort: Take +2 spirit.
            • Provision: Take +2 supply.
            • Plan: Take +2 momentum. 
            Provide Aid
            • Take a quest: Envision what this community needs, or what trouble it is facing (Ask the Oracle if unsure). If you chose to help, Swear an Iron Vow and add +1.
            On a miss, you find no help here. Pay the Price. `
        },
        {
            name: "Draw the Circle",
            type: "Relationship",
            text: `When you challenge someone to a formal duel, or accept a challenge, roll +heart. If you share a bond with this community, add +1.
            On a strong hit, take +1 momentum. You may also choose up to two boasts and take +1 momentum for each.
            On a weak hit, you may choose one boast in exchange for +1 momentum.
            • Grant first strike: Your foe has initiative.
            • Bare yourself: Take no benefit of armor or shield; your foe’s harm is +1.
            • Hold no iron: Take no benefit of weapons; your harm is 1.
            • Bloody yourself: Endure Harm (1 harm).
            • To the death: One way or another, this fight must end with death.
            On a miss, you begin the duel at a disadvantage. Your foe has initiative. Pay the Price.
            Then, make moves to resolve the fight. If you are the victor, you may make a lawful demand, and your opponent must comply or forfeit their honor and standing. If you refuse the challenge, surrender, or are defeated, they make a demand of you. `
        },
        {
            name: "Forge a Bond",
            type: "Relationship",
            text: `When you spend significant time with a person or community, stand together to face hardships, or make sacrifices for their cause, you can attempt to create a bond. When you do, roll +heart. If you make this move after you successfully Fulfill Your Vow to their benefit, you may reroll any dice.
            On a strong hit, make note of the bond, mark a tick on your bond progress track, and choose one.
            • Take +1 spirit.
            • Take +2 momentum.
            On a weak hit, they ask something more of you first. Envision what it is (Ask the Oracle if unsure), do it (or Swear an Iron Vow), and mark the bond. If you refuse or fail, Pay the Price.
            On a miss, they reject you. Pay the Price. `
        },
        {
            name: "Test Your Bond",
            type: "Relationship",
            text: `When your bond is tested through conflict, betrayal, or circumstance, roll +heart.
            On a strong hit, this test has strengthened your bond. Choose one.
            • Take +1 spirit.
            • Take +2 momentum.
            On a weak hit, your bond is fragile and you must prove your loyalty. Envision what they ask of you (Ask the Oracle if unsure), and do it (or Swear an Iron Vow). If you refuse or fail, clear the bond and Pay the Price.
            On a miss, or if you have no interest in maintaining this relationship, clear the bond and Pay the Price. `
        },
        {
            name: "Aid Your Ally",
            type: "Relationship",
            text: `When you Secure an Advantage in direct support of an ally, and score a hit, they (instead of you) can take the benefits of the move. If you are in combat and score a strong hit, you and your ally have initiative. `
        },
        {
            name: "Write Your Epilogue",
            type: "Relationship",
            text: `Progress Move
            When you retire from your life as Ironsworn, envision two things: What you hope for, and what you fear. Then, roll the challenge dice and compare to your bonds. Momentum is ignored on this roll.
            On a strong hit, things come to pass as you hoped.
            On a weak hit, your life takes an unexpected turn, but not necessarily for the worse. You find yourself spending your days with someone or in a place you did not foresee. Envision it (Ask the Oracle if unsure).
            On a miss, your fears are realized. `
        },
        {
            name: "Enter the Fray",
            type: "Combat",
            text: `When you enter into combat, set the rank of each of your foes.
            • Troublesome foe: 3 progress per harm; inflicts 1 harm.
            • Dangerous foe: 2 progress per harm; inflicts 2 harm.
            • Formidable foe: 1 progress per harm; inflicts 3 harm.
            • Extreme foe: 2 ticks per harm; inflicts 4 harm.
            • Epic foe: 1 tick per harm; inflicts 5 harm.
            Then, roll to determine who is in control. If you are...
            • Facing off against your foe: Roll +heart.
            • Moving into position against an unaware foe, or striking without warning: Roll +shadow.
            • Ambushed: Roll +wits.
            On a strong hit, take +2 momentum. You have initiative.
            On a weak hit, choose one.
            • Bolster your position: Take +2 momentum.
            • Prepare to act: Take initiative.
            On a miss, combat begins with you at a disadvantage. Pay the Price. Your foe has initiative.`
        },
        {
            name: "Strike",
            type: "Combat",
            text: `When you have initiative and attack in close quarters, roll +iron. When you have initiative and attack at range, roll +edge.
            On a strong hit, inflict +1 harm. You retain initiative.
            On a weak hit, inflict your harm and lose initiative.
            On a miss, your attack fails and you must Pay the Price. Your foe has initiative.`
        },
        {
            name: "Clash",
            type: "Combat",
            text: `When your foe has initiative and you fight with them in close quarters, roll +iron. When you exchange a volley at range, or shoot at an advancing foe, roll +edge.
            On a strong hit, inflict your harm and choose one. You have the initiative.
            • You bolster your position: Take +1 momentum.
            • You find an opening: Inflict +1 harm.
            On a weak hit, inflict your harm, but then Pay the Price. Your foe has initiative.
            On a miss, you are outmatched and must Pay the Price. Your foe has initiative`
        },
        {
            name: "Turn the Tide",
            type: "Combat",
            text: `Once per fight, when you risk it all, you may steal initiative from your foe to make a move (not a progress move). When you do, add +1 and take +1 momentum on a hit.
            If you fail to score a hit on that move, you must suffer a dire outcome. Pay the Price.`
        },
        {
            name: "End the Fight",
            type: "Combat",
            text: `Progress Move
            When you make a move to take decisive action, and score a strong hit, you may resolve the outcome of this fight. If you do, roll the challenge dice and compare to your progress. Momentum is ignored on this roll.
            On a strong hit, this foe is no longer in the fight. They are killed, out of action, flee, or surrender as appropriate to the situation and your intent (Ask the Oracle if unsure).
            On a weak hit, as above, but you must also choose one.
            • It’s worse than you thought: Endure Harm.
            • You are overcome: Endure Stress.
            • Your victory is short-lived: A new danger or foe appears, or an existing danger worsens.
            • You suffer collateral damage: Something of value is lost or broken, or someone important must pay the cost.
            • You’ll pay for it: An objective falls out of reach.
            • Others won’t forget: You are marked for vengeance.
            On a miss, you have lost this fight. Pay the Price.`
        },
        {
            name: "Battle",
            type: "Combat",
            text: `When you fight a battle, and it happens in a blur, envision your objective and roll. If you primarily…
            • Fight at range, or using your speed and the terrain to your advantage: Roll +edge.
            • Fight depending on your courage, allies, or companions: Roll +heart.
            • Fight in close to overpower your opponents: Roll +iron.
            • Fight using trickery to befuddle your opponents: Roll +shadow.
            • Fight using careful tactics to outsmart your opponents: Roll +wits.
            On a strong hit, you achieve your objective unconditionally. Take +2 momentum.
            On a weak hit, you achieve your objective, but not without cost. Pay the Price.
            On a miss, you are defeated and the objective is lost to you. Pay the Price.`
        },
        {
            name: "Endure Harm",
            type: "Suffer",
            text: `When you face physical damage, suffer -health equal to your foe’s rank or as appropriate to the situation. If your health is 0, suffer -momentum equal to any remaining -health.
            Then, roll +health or +iron, whichever is higher.
            On a strong hit, choose one.
            • Shake it off: If your health is greater than 0, suffer -1 momentum in exchange for +1 health.
            • Embrace the pain: Take +1 momentum.
            On a weak hit, you press on.
            On a miss, also suffer -1 momentum. If you are at 0 health, you must mark wounded or maimed (if currently unmarked) or roll on the following table.
            • 1-10 The harm is mortal. Face Death.
            • 11-20 You are dying. You need to Heal within an hour or two, or Face Death.
            • 21-35 You are unconscious and out of action. If left alone, you come back to your senses in an hour or two. If you are vulnerable to a foe not inclined to show mercy, Face Death.
            • 36-50 You are reeling and fighting to stay conscious. If you engage in any vigorous activity (such as running or fighting) before taking a breather for a few minutes, roll on this table again (before resolving the other move).
            • 51-00 You are battered but still standing.`
        },
        {
            name: "Face Death",
            type: "Suffer",
            text: `When you are brought to the brink of death, and glimpse the world beyond, roll +heart.
            On a strong hit, death rejects you. You are cast back into the mortal world.
            On a weak hit, choose one.
            • You die, but not before making a noble sacrifice. Envision your final moments.
            • Death desires something of you in exchange for your life. Envision what it wants (Ask the Oracle if unsure), and Swear an Iron Vow (formidable or extreme) to complete that quest. If you fail to score a hit when you Swear an Iron Vow, or refuse the quest, you are dead. Otherwise, you return to the mortal world and are now cursed. You may only clear the cursed debility by completing the quest.
            On a miss, you are dead.`
        },
        {
            name: "Companion Endure Harm",
            type: "Suffer",
            text: `When your companion faces physical damage, they suffer -health equal to the amount of harm inflicted. If your companion’s health is 0, exchange any leftover -health for -momentum.
            Then, roll +heart or +your companion’s health, whichever is higher.
            On a strong hit, your companion rallies. Give them +1 health.
            On a weak hit, your companion is battered. If their health is 0, they cannot assist you until they gain at least +1 health.
            On a miss, also suffer -1 momentum. If your companion’s health is 0, they are gravely wounded and out of action. Without aid, they die in an hour or two.
            If you roll a miss with a 1 on your action die, and your companion’s health is 0, they are now dead. Take 1 experience for each marked ability on your companion asset, and remove it.`
        },
        {
            name: "Endure Stress",
            type: "Suffer",
            text: `When you face mental shock or despair, suffer -spirit equal to your foe’s rank or as appropriate to the situation. If your spirit is 0, suffer -momentum equal to any remaining -spirit.
            Then, roll +spirit or +heart, whichever is higher.
            On a strong hit, choose one.
            • Shake it off: If your spirit is greater than 0, suffer -1 momentum in exchange for +1 spirit
            • Embrace the darkness: Take +1 momentum
            On a weak hit, you press on.
            On a miss, also suffer -1 momentum. If you are at 0 spirit, you must mark shaken or corrupted (if currently unmarked) or roll on the following table.
            • 1-10 You are overwhelmed. Face Desolation.
            • 11-25 You give up. Forsake Your Vow (if possible, one relevant to your current crisis).
            • 26-50 You give in to a fear or compulsion, and act against your better instincts.
            • 51-00 You persevere.`
        },
        {
            name: "Face Desolation",
            type: "Suffer",
            text: `When you are brought to the brink of desolation, roll +heart.
            On a strong hit, you resist and press on.
            On a weak hit, choose one.
            • Your spirit or sanity breaks, but not before you make a noble sacrifice. Envision your final moments.
            • You see a vision of a dreaded event coming to pass. Envision that dark future (Ask the Oracle if unsure), and Swear an Iron Vow (formidable or extreme) to prevent it. If you fail to score a hit when you Swear an Iron Vow, or refuse the quest, you are lost. Otherwise, you return to your senses and are now tormented. You may only clear the tormented debility by completing the quest.
            On a miss, you succumb to despair or horror and are lost.`
        },
        {
            name: "Out of Supply",
            type: "Suffer",
            text: `When your supply is exhausted (reduced to 0), mark unprepared. If you suffer additional -supply while unprepared, you must exchange each additional -supply for any combination of -health, -spirit or -momentum as appropriate to the circumstances.`
        },
        {
            name: "Face a Setback",
            type: "Suffer",
            text: `When your momentum is at its minimum (-6), and you suffer additional -momentum, choose one.
            • Exchange each additional -momentum for any combination of -health, -spirit, or -supply as appropriate to the circumstances.
            • Envision an event or discovery (Ask the Oracle if unsure) which undermines your progress in a current quest, journey or fight. Then, for each additional -momentum, clear 1 unit of progress on that track per its rank (troublesome=clear 3 progress; dangerous=clear 2 progress; formidable=clear 1 progress; extreme=clear 2 ticks; epic=clear 1 tick).`
        },
        {
            name: "Swear an Iron Vow",
            type: "Quest",
            text: `When you swear upon iron to complete a quest, write your vow and give the quest a rank. Then, roll +heart. If you make this vow to a person or community with whom you share a bond, add +1.
            On a strong hit, you are emboldened and it is clear what you must do next (Ask the Oracle if unsure). Take +2 momentum.
            On a weak hit, you are determined but begin your quest with more questions than answers. Take +1 momentum, and envision what you do to find a path forward.
            On a miss, you face a significant obstacle before you can begin your quest. Envision what stands in your way (Ask the Oracle if unsure), and choose one.
            • You press on: Suffer -2 momentum, and do what you must to overcome this obstacle.
            • You give up: Forsake Your Vow.`
        },
        {
            name: "Reach a Milestone",
            type: "Quest",
            text: `When you make significant progress in your quest by overcoming a critical obstacle, completing a perilous journey, solving a complex mystery, defeating a powerful threat, gaining vital support, or acquiring a crucial item, you may mark progress.
            • Troublesome quest: Mark 3 progress.
            • Dangerous quest: Mark 2 progress.
            • Formidable quest: Mark 1 progress.
            • Extreme quest: Mark 2 ticks.
            • Epic quest: Mark 1 tick.`
        },
        {
            name: "Fulfill Your Vow",
            type: "Quest",
            text: `Progress Move
            When you achieve what you believe to be the fulfillment of your vow, roll the challenge dice and compare to your progress. Momentum is ignored on this roll.
            On a strong hit, your quest is complete. Mark experience (troublesome=1; dangerous=2; formidable=3; extreme=4; epic=5).
            On a weak hit, there is more to be done or you realize the truth of your quest. Envision what you discover (Ask the Oracle if unsure). Then, mark experience (troublesome=0; dangerous=1; formidable=2; extreme=3; epic=4). You may Swear an Iron Vow to set things right. If you do, add +1. 
            On a miss, your quest is undone. Envision what happens (Ask the Oracle if unsure), and choose one.
            • You recommit: Clear all but one filled progress, and raise the quest’s rank by one (if not already epic).
            • You give up: Forsake Your Vow.`
        },
        {
            name: "Forsake Your Vow",
            type: "Quest",
            text: `When you renounce your quest, betray your promise, or the goal is lost to you, clear the vow and Endure Stress. You suffer -spirit equal to the rank of your quest (troublesome=1; dangerous=2; formidable=3; extreme=4; epic=5).
            If the vow was made to a person or community with whom you share a bond, Test Your Bond when you next meet.`
        },
        {
            name: "Advance",
            type: "Quest",
            text: `When you focus on your skills, receive training, find inspiration, earn
            a reward, or gain a companion, you may spend 3 experience to add a
            new asset, or 2 experience to upgrade an asset.`
        },
        {
            name: "Pay the Price",
            type: "Fate",
            text: `When you suffer the outcome of a move, choose one.
            • Make the most obvious negative outcome happen.
            • Envision two negative outcomes. Rate one as ‘likely’, and Ask the Oracle using the yes/no table. On a ‘yes’, make that outcome happen. Otherwise, make it the other.
            • Roll on the following table. If you have difficulty interpreting the result to fit the current situation, roll again.
            Roll Result
            • 1-2 Roll again and apply that result but make it worse. If you roll this result yet again, think of something dreadful that changes the course of your quest (Ask the Oracle if unsure) and make it happen.
            • 3-5 A person or community you trusted loses faith in you, or acts against you.
            • 6-9 A person or community you care about is exposed to danger.
            • 10-16 You are separated from something or someone.
            • 17-23 Your action has an unintended effect.
            • 24-32 Something of value is lost or destroyed.
            • 33-41 The current situation worsens.
            • 42-50 A new danger or foe is revealed.
            • 51-59 It causes a delay or puts you at a disadvantage.
            • 60-68 It is harmful.
            • 69-76 It is stressful.
            • 77-85 A surprising development complicates your quest.
            • 86-90 It wastes resources.
            • 91-94 It forces you to act against your best intentions.
            • 95-98 A friend, companion, or ally is put in harm’s way (or you are, if alone).
            • 99-00 Roll twice more on this table. Both results occur. If they are the same result, make it worse.`
        },
        {
            name: "Ask the Oracle",
            type: "Fate",
            text: `When you seek to resolve questions, discover details in the world, determine how other characters respond, or trigger encounters or events, you may…
            • Draw a conclusion: Decide the answer based on the most interesting and obvious result.
            • Ask a yes/no question: Decide the odds of a ‘yes’, and roll on the table below to check the answer.
            • Pick two: Envision two options. Rate one as ‘likely’, and roll on the table to see if it is true. If not, it is the other.
            • Spark an idea: Brainstorm or use a random prompt.`
        },
    ],
    assets: [
        {
            name: "Cave Lion",
            type: "Companion",
            text: `Your cat takes down its prey.
            ⚪ Eager: When your cat chases down big game, you may Resupply with +edge (instead of +wits). If you do, take +1 supply or +1 momentum on a strong hit.
            ⚪ Inescapable: When you Enter the Fray or Strike by sending your cat to attack, roll +edge. On a hit, take +2 momentum.
            ⚪ Protective: When you Make Camp, your cat is alert to trouble. If you or an ally choose to relax, take +1 spirit. If you focus, take +1 momentum.`,
            track: {
                numeric: 4
            }
        },
        {
            name: "Giant Spider",
            type: "Companion",
            text: `Your spider uncovers secrets.
            ⚪ Discreet: When you Secure an Advantage by sending your spider to scout a place, add +1 and take +1 momentum on a hit.
            ⚪ Soul-Piercing: You may Face Danger +shadow by sending your spider to secretly study someone. On a hit, the spider returns to reveal the target’s deepest fears through a reflection in its glassy eyes. Use this to Gather Information and reroll any dice.
            ⚪ Ensnaring: When your spider sets a trap, add +1 as you Enter the Fray +shadow. On a strong hit, also inflict 2 harm.`,
            track: {
                numeric: 4
            }
        },
        {
            name: "Hawk",
            type: "Companion",
            text: `Your hawk can aid you while it is aloft.
            ⚪ Far-seeing: When you Undertake a Journey, or when you Resupply by hunting for small game, add +1.
            ⚪ Fierce: When you Secure an Advantage +edge using your hawk to harass and distract your foes, add +1 and take +1 momentum on a hit.
            ⚪ Vigilant: When you Face Danger +wits to detect an approaching threat, or when you Enter the Fray +wits against an ambush, add +2.`,
            track: {
                numeric: 3
            }
        },
        {
            name: "Horse",
            type: "Companion",
            text: `You and your horse ride as one.
            ⚪ Swift: When you Face Danger +edge using your horse’s speed and grace, or when you Undertake a Journey, add +1. 
            ⚪ Fearless: When you Enter the Fray or Secure an Advantage +heart by charging into combat, add +1 and take +1 momentum on a hit.
            ⚪ Mighty: When you Strike or Clash at close range while mounted, add +1 and inflict +1 harm on a hit.`,
            track: {
                numeric: 5
            }
        },
        {
            name: "Hound",
            type: "Companion",
            text: `Your hound is your steadfast companion.
            ⚪ Sharp: When you Gather Information using your hound’s keen senses to track your quarry or investigate a scene, add +1 and take +1 momentum on a hit.
            ⚪ Ferocious: When you Strike or Clash alongside your hound and score a hit, inflict +1 harm or take +1 momentum.
            ⚪ Loyal: When you Endure Stress in the company of your hound, add +1.`,
            track: {
                numeric: 4
            }
        },
        {
            name: "Kindred",
            type: "Companion",
            text: `Your friend stands by you.
            ⚪ Skilled: When you make a move outside of combat aided by your companion’s expertise, add +1.
            ⚪ Shield-Kin (expertise): When you Clash or Battle alongside your companion, or when you Face Danger against an attack by standing together, add +1.
            ⚪ Bonded (expertise): Once you mark a bond with your companion, add +1 when you Face Desolation in their presence.`,
            track: {
                numeric: 4
            }
        },
        {
            name: "Mammoth",
            type: "Companion",
            text: `Your mammoth walks a resolute path.
            ⚪ Lumbering: When your mammoth travels with you as you Undertake a Journey, you may add +2 but suffer -1 momentum (decide before rolling).
            ⚪ Beast of burden: When you make a move which requires you to roll +supply, you may instead roll +your mammoth’s health.
            ⚪ Overpowering: When you Strike or Clash by riding your mammoth against a pack of foes, add +1 and inflict +1 harm on a hit.`,
            track: {
                numeric: 5
            }
        },
        {
            name: "Owl",
            type: "Companion",
            text: `Your owl soars through the darkness.
            ⚪ Nocturnal: If you Resupply at night by sending your owl to hunt, take +2 momentum on a hit. When you Enter the Fray +wits against an ambush in darkness, add +1 and take +1 momentum on a hit.
            ⚪ Sage: When you leverage your owl’s secret knowledge to perform a ritual, add +1 or take +1 momentum on a hit (decide before rolling).
            ⚪ Embodying: When you Face Death, take your owl’s health as +momentum before you roll.`,
            track: {
                numeric: 3
            }
        },
        {
            name: "Raven",
            type: "Companion",
            text: `Your raven heeds your call.
            ⚪ Sly: When you Secure an Advantage or Face Danger +shadow using your raven to perform trickery (such as creating a distraction or stealing a small object) add +1 and take +1 momentum on a hit.
            ⚪ Knowing: When you Face Death, add +2 and take +1 momentum on a hit.
            ⚪ Diligent: When your raven carries messages for you, you may Secure an Advantage, Gather Information, or Compel from a distance.`,
            track: {
                numeric: 2
            }
        },
        {
            name: "Young Wyvern",
            type: "Companion",
            text: `Your wyvern won’t devour you. For now.
            ⚪ Insatiable: When you Undertake a Journey and score a hit, you may suffer -1 supply in exchange for +2 momentum.
            ⚪ Indomitable: When you make the Companion Endure Harm move for your wyvern, add +2 and take +1 momentum on a hit.
            ⚪ Savage: When you Strike by commanding your wyvern to attack, roll +heart. Your wyvern inflicts 3 harm on a hit.`,
            track: {
                numeric: 5
            }
        },
        {
            name: "Alchemist",
            type: "Path",
            text: `⚫ When you create an elixir, choose an effect: Deftness (edge), audacity (heart), vigor (iron), slyness (shadow), or clarity (wits). Then, suffer -1 supply and roll +wits. On a strong hit, you create a single dose. The character who consumes the elixir must Face Danger +iron and score a hit, after which they add +1 when making moves with the related stat until their health, spirit, or momentum fall below +1. On a weak hit, as above, but suffer an additional -1 supply to create it.
            ⚪ As above, and you may choose two effects for a single dose, or create two doses of the same effect.
            ⚪ When you prepare an elixir, add +1 and take +1 momentum on a hit.`
        },
        {
            name: "Animal Kin",
            type: "Path",
            text: `⚫ When you make a move to pacify, calm, control, aid, or fend off an animal (or an animal or beast companion), add +1 and take +1 momentum on a hit.
            ⚪ You may add or upgrade an animal or beast companion asset for 1 fewer experience. Once you mark all their abilities, you may Forge a Bond with them and take an automatic strong hit. When you do, mark a bond twice and take 1 experience.
            ⚪ Once per fight, when you leverage your animal or beast companion to make a move, reroll any dice. On a hit, take +1 momentum.`
        },
        {
            name: "Banner-Sworn",
            type: "Path",
            text: `Once you mark a bond with a leader or faction...
            ⚫ When you Swear an Iron Vow to serve your leader or faction on a mission, you may reroll any dice. When you Fulfill Your Vow and mark experience, take +1 experience.
            ⚪ When you Sojourn or Make Camp in the company of your banner-kin, add +1 and take +1 momentum on a hit.
            ⚪ When you Enter the Fray bearing your banner, add +1 and take +1 momentum on a hit. When you burn momentum while carrying your banner in combat, take +1 momentum after you reset.`
        },
        {
            name: "Battle-Scarred",
            type: "Path",
            text: `Once you become maimed...
            ⚪ You focus your energies: Reduce your edge or iron by 1 and add +2 to wits or heart, or +1 to each (to a maximum of +4).
            ⚪ You overcome your limitations: Reduce your maximum health by 1. Maimed no longer counts as a debility, and does not reduce your maximum momentum or reset value. When you Endure Stress +heart, take +1 momentum on a strong hit.
            ⚪ You have stared down death before: When you are at 0 health and Endure Harm, you may roll +wits or +heart (instead of +health or +iron). If you do, take +1 momentum on a hit.`
        },
        {
            name: "Blade-Bound",
            type: "Path",
            text: `Once you mark a bond with a kin-blade, a sentient weapon imbued with the spirit of your ancestor...
            ⚪ When you Enter the Fray or Draw the Circle while wielding your kin-blade, add +1 and take +1 momentum on a hit.
            ⚪ When you Gather Information by listening to the whispers of your kinblade, add +1 and take +2 momentum on a hit. Then, Endure Stress (2 stress).
            ⚪ When you Strike with your kin-blade to inflict savage harm (decide before rolling), add +1 and inflict +2 harm on a hit. Then, Endure Stress (2 stress).`
        },
        {
            name: "Bonded",
            type: "Path",
            text: `⚫ When you make a move which gives you an add for sharing a bond, add +1 more.
            ⚪ When you completely fill a box on your bonds progress track, envision what your relationships have taught you. Then, take 1 experience and +2 momentum.
            ⚪ When you make a move in a crucial moment and score a miss, you may cling to thoughts of your bond-kin for courage or encouragement. If you do, reroll any dice. On another miss, in addition to the outcome of the move, you must mark shaken or corrupted. If both debilities are already marked, Face Desolation. `
        },
        {
            name: "Dancer",
            type: "Path",
            text: `⚫ When you Secure an Advantage +edge by dancing for an audience, add +1 and take +2 momentum on a hit. On a strong hit, also add +2 (one time only) if you make a move to interact with someone in the audience.
            ⚪ When you Face Danger +edge in a fight by nimbly avoiding your foe’s attacks, add +1 and take +1 momentum on a hit.
            ⚪ When you or an ally make a progress move and score a hit, you may perform a dance to commemorate the event. If you do, roll +edge. On a strong hit, you and each of your allies take +2 momentum and +1 spirit. On a weak hit, you take +1 momentum or +1 spirit, but your allies are unmoved.`
        },
        {
            name: "Devotant",
            type: "Path",
            text: `⚫ When you say your daily prayers, you may Secure an Advantage by asking your god to grant a blessing. If you do, roll +your god’s stat. On a hit, take +2 momentum.
            ⚪ When you Swear an Iron Vow to serve your god on a divine quest, you may roll +your god’s stat and reroll any dice. When you Fulfill Your Vow and mark experience, take +1 experience.
            ⚪ When you Sojourn by sharing the word of your god, you may roll +your god’s stat. If you do, take +1 momentum on a hit.`
        }, {
            name: "Honorbound",
            type: "Path",
            text: `⚫ When you Turn the Tide, envision how your vows give you strength in this moment. Then, when you make your move, add +2 (instead of +1) and take +1 momentum on a hit.
                ⚪ When you Secure an Advantage or Compel by telling a hard truth, add +1 and take +1 momentum on a hit. On a weak hit or miss, envision how this truth complicates your current situation.
                ⚪ When you Fulfill Your Vow and score a miss, you may reroll one challenge die. If you score a miss again, reduce your maximum spirit by 1. You may recover this lost spirit when you next Fulfill Your Vow and score a strong hit. `
        }, {
            name: "Improviser",
            type: "Path",
            text: `⚫ When you Check your Gear, you may roll +wits (instead of +supply). If you do, envision how you make do with a clever solution, and take +1 momentum on a hit.
                ⚪ When you Secure an Advantage or Face Danger by cobbling together an ad hoc tool or apparatus, add +1 and take +1 momentum on a hit. After rolling, you may also suffer -1 supply and add +1 more.
                ⚪ When you throw caution to the wind and make an impulsive move in a risky situation, you may add +2. If you do, take +1 momentum on a strong hit, but count a weak hit as a miss. `
        }, {
            name: "Infiltrator",
            type: "Path",
            text: `⚫ When you make a move to breach, traverse, or hide within an area held by an enemy, add +1 and take +1 momentum on a hit.
                ⚪ When you Gather Information within an enemy area to discover their positions, plans, or methods, or when you Secure an Advantage within that area through observation, you may roll +shadow (instead of +wits). If you do, take +1 momentum on a hit.
                ⚪ When you Resupply within an enemy area by scavenging or looting, you may roll +shadow (instead of +wits). If you do, take +1 momentum or +1 supply on a hit. `
        }, {
            name: "Loyalist",
            type: "Path",
            text: `⚫ When you Aid Your Ally, add +1 and take +1 momentum on a hit. This is in addition to the benefits taken by your ally.
                ⚪ When an ally makes the Endure Stress move in your company, they add +1 and you take +1 momentum on a hit.
                ⚪ When you stand with your ally as they make a progress move, envision how you support them. Then, roll one challenge die. On a 1-9, your ally may replace one of their challenge dice with yours. On a 10, envision how you inadvertently undermine their action; your ally must replace their lowest challenge die with yours. `
        }, {
            name: "Masked",
            type: "Path",
            text: `Once you mark a bond with elves, and are gifted a mask of precious elderwood...
                ⚫ Choose your mask’s material.
                ⚪ Thunderwood: Edge / Health
                ⚪ Bloodwood: Iron / Health
                ⚪ Ghostwood: Shadow / Spirit
                ⚪ Whisperwood: Wits / Spirit When you wear the mask and make a move which uses its stat, add +1. If you roll a 1 on your action die, suffer -1 to the associated track (in addition to any other outcome of the move).
                ⚪ As above, and you may instead add +2 and suffer -2 (decide before rolling).
                ⚪ When you Face Death or Face Desolation while wearing the mask, you may roll +its stat (instead of +heart). `
        }, {
            name: "Oathbreaker",
            type: "Path",
            text: `Once you Forsake Your Vow...
                ⚫ This asset counts as a debility. One time only, when you Swear an Iron Vow to redeem yourself (extreme or greater), give that vow a special mark. When you Reach a Milestone on the marked vow, take +2 momentum.
                ⚪ When you Secure an Advantage or Compel by reaffirming your commitment to your marked vow, add +1 and take +1 momentum on a hit.
                ⚪ When you Fulfill Your Vow on your marked quest and score a hit, you find redemption and automatically activate this ability at no cost. You may then improve one of your stats by +1 and discard this asset. `
        }, {
            name: "Outcast",
            type: "Path",
            text: `⚫ When your supply is reduced to 0, suffer any remaining -supply as -momentum. Then, roll +wits. On a strong hit, you manage to scrape by and take +1 supply. On a weak hit, you may suffer -2 momentum in exchange for +1 supply. On a miss, you are Out of Supply.
                ⚪ When you Sojourn, you may reroll any dice. If you do (decide before your first roll), your needs are few, but your isolation sets you apart from others. A strong hit counts as a weak hit.
                ⚪ When you Reach Your Destination and score a strong hit, you recall or recognize something helpful about this place. Envision what it is, and take +2 momentum.  `
        }, {
            name: "Pretender",
            type: "Path",
            text: `⚫ When you establish a false identity, roll +shadow. On a strong hit, you may add +2 when you make moves using this identity to deceive or influence others. If you roll a 1 on your action die when using your false identity, someone doubts you. Make appropriate moves to reassure them or prevent them from revealing the truth. On a weak hit, as above, but add +1 (instead of +2).
                ⚪ As above, and you may roll +shadow (instead of +heart) when you Sojourn under your false identity. If you do, take +1 momentum on a hit.
                ⚪ When you Secure an Advantage by revealing your true identity in a dramatic moment, reroll any dice. `
        }, {
            name: "Revenant",
            type: "Path",
            text: `Once you Face Death and return to the world of the living...
                ⚫ When you are at 0 health, and Endure Harm or Face Death, add +1. If you then burn momentum to improve your result, envision what bond or vow binds you to this world, and take +2 momentum after you reset.
                ⚪ When you make a move to investigate, oppose, or interact with a horror, spirit, or other undead being, add +1.
                ⚪ When you bring death to your foe to End the Fight, you may burn momentum to cancel one (not both) of the challenge dice if your momentum is greater than the value of that die. If you do, Endure Stress (2 stress). `
        }, {
            name: "Rider",
            type: "Path",
            text: `If you are with your horse companion...
                ⚫ When you Heal your horse, or when you Face Danger to calm or encourage it, add +1 and take +1 momentum on a hit.
                ⚪ When you Undertake a Journey, you may push your horse harder and add +1 (after rolling). If you do, make the Companion Endure Harm move (1 harm).
                ⚪ When you Secure an Advantage +wits by sizing up a perilous situation from the saddle, you are one with your horse’s instincts. Add +1 and take +1 momentum on a hit. `
        }, {
            name: "Ritualist",
            type: "Path",
            text: `Once you Fulfill Your Vow (formidable or greater) in service to an elder mystic, and Forge a Bond to train with them...
                ⚫ When you Secure an Advantage to ready yourself for a ritual, envision how you prepare. Then, add +1 and take +1 momentum on a hit.
                ⚪ When you perform a ritual, you may suffer -1 supply and add +1 (decide before rolling).
                ⚪ When you tattoo the essence of a new ritual onto your skin, envision the mark you create. You may then purchase and upgrade that ritual asset for 1 fewer experience. `
        }, {
            name: "Shadow-Kin",
            type: "Path",
            text: `Once you become corrupted...
                ⚪ You harden your heart: Reduce your heart stat by 1 and add up to +2 to shadow (to a maximum of +4).
                ⚪ You are attuned to the realms of shadow: When you perform a ritual, add +1.
                ⚪ You know the sly ways of death: When you Face Death, you may roll +shadow (instead of +heart). On a weak hit, if you choose to undertake a deathbound quest, you may roll +shadow (instead of +heart) and reroll any dice as you Swear an Iron Vow. When you Fulfill Your Vow on that quest and and mark experience, take +2 experience. `
        }, {
            name: "Sighted",
            type: "Path",
            text: `⚫ When you Face Danger or Gather Information to identify or detect mystic forces, add +1 and take +1 momentum on a hit.
                ⚪ When you Compel, Forge a Bond, or Test Your Bond with a fellow mystic or mystical being, add +1 and take +1 momentum on a hit.
                ⚪ When you Secure an Advantage by studying someone or something in a charged situation, add +1 and take +1 momentum on a hit. When you also pierce the veil to explore deeper truths (decide before rolling), you may reroll any dice. If you do, count a weak hit as a miss. `
        }, {
            name: "Slayer",
            type: "Path",
            text: `⚫ When you Gather Information by tracking a beast or horror, or when you Secure an Advantage by readying yourself for a fight against them, add +1 and take +1 momentum on a hit.
                ⚪ When you Swear an Iron Vow to slay a beast or horror, you may reroll any dice. When you Fulfill Your Vow and mark experience, take +1 experience.
                ⚪ When you slay a beast or horror (at least formidable), you may take a trophy and choose one.
                • Power a ritual: When you or an ally make a ritual move, reroll any dice (one time only).
                • Prove your worth: When you Sojourn, reroll any dice (one time only). `
        }, {
            name: "Spirit-Bound",
            type: "Path",
            text: `⚫ You are haunted by someone whose death you caused through your actions or failures. When you consult with their spirit to Secure an Advantage or Gather Information, add +1 and take +2 momentum on a hit. On a weak hit, also Endure Stress (1 stress).
                ⚪ When you Face Death guided by the spirit, add +1. On a strong hit, envision what you learn and take 1 experience.
                ⚪ One time only, when you successfully Fulfill Your Vow (formidable or greater) in service to the spirit, choose one.
                • Let them go: Take 2 experience for each marked ability and discard this asset.
                • Deepen your connection: Add +1 more when you leverage this asset. `
        }, {
            name: "Storyweaver",
            type: "Path",
            text: `⚫ When you Secure an Advantage, Compel, or Forge a Bond by sharing an inspiring or enlightening song, poem, or tale, envision the story you tell. Then, add +1 and take +1 momentum on a hit.
                ⚪ When you Make Camp and choose the option to relax, you may share a story with your allies or compose a new story if alone. If you do, envision the story you tell and take +1 spirit or +1 momentum. Any allies who choose to relax in your company may also take +1 spirit or +1 momentum.
                ⚪ When you Sojourn within a community with which you share a bond, add +2 (instead of +1). `
        }, {
            name: "Trickster",
            type: "Path",
            text: `⚫ When you Face Danger, Secure an Advantage, or Compel by lying, bluffing, stealing, or cheating, add +1.
                ⚪ When you Gather Information by investigating a devious scheme, you may roll +shadow (instead of +wits). If you do, take +2 momentum on a hit.
                ⚪ When you Forge a Bond for a relationship founded on a lie, choose one.
                • Keep your secret: Roll +shadow (instead of +heart).
                • Reveal the truth: Roll +heart. On a strong hit, mark a bond twice and take 1 experience. A weak hit counts as a miss. `
        }, {
            name: "Storyweaver",
            type: "Path",
            text: `⚫ When you Secure an Advantage, Compel, or Forge a Bond by sharing an inspiring or enlightening song, poem, or tale, envision the story you tell. Then, add +1 and take +1 momentum on a hit.
                ⚪ When you Make Camp and choose the option to relax, you may share a story with your allies or compose a new story if alone. If you do, envision the story you tell and take +1 spirit or +1 momentum. Any allies who choose to relax in your company may also take +1 spirit or +1 momentum.
                ⚪ When you Sojourn within a community with which you share a bond, add +2 (instead of +1). `
        }, {
            name: "Veteran",
            type: "Path",
            text: `⚫ When you burn momentum to improve your result in combat, envision how your hard-won fighting experience gives you the upper hand. Then, take +1 momentum after you reset, and add +1 when you make your next move. Once per fight, you also take initaitive when burning momentum to improve a miss to a weak hit.
                ⚪ When you Swear an Iron Vow to someone who fought beside you, or Forge a Bond with them, add +2 and take +2 momentum on a hit.
                ⚪ When you Resupply by looting the dead on a field of battle, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Waterborn",
            type: "Path",
            text: `⚫ When you Face Danger, Gather Information, or Secure an Advantage related to your knowledge of watercraft, water travel, or aquatic environments or creatures, add +1 and take +1 momentum on a hit.
                ⚪ When you Undertake a Journey by boat or ship, add +1. On a strong hit, also choose one.
                • The wind is at your back: Mark progress twice.
                • Find safe anchor: Make Camp now and reroll any dice.
                • Reap the bounty: Resupply now and reroll any dice.
                ⚪ When you Enter the Fray aboard a boat or ship, reroll any dice. `
        }, {
            name: "Wayfinder",
            type: "Path",
            text: `⚫ When you Undertake a Journey, take +1 momentum on a strong hit. If you burn momentum to improve your result, also take +1 momentum after you reset.
                ⚪ When you Secure an Advantage or Gather Information by carefully surveying the landscape or scouting ahead, add +1 and take +1 momentum on a hit.
                ⚪ When you Swear an Iron Vow to safely guide someone on a perilous journey, you may reroll any dice. When you Fulfill Your Vow and mark experience, take +1 experience. `
        }, {
            name: "Wildblood",
            type: "Path",
            text: `⚫ When you Face Danger, Secure an Advantage, or Gather Information using your knowledge of tracking, woodcraft, or woodland creatures, add +1.
                ⚪ When you Face Danger or Secure an Advantage by hiding or sneaking in the woodlands, add +1 and take +1 momentum on a hit.
                ⚪ When you Make Camp in the woodlands, you may roll +wits (instead of +supply). If you do, you and your allies each choose 1 more option on a hit. `
        }, {
            name: "Weaponmaster",
            type: "Path",
            text: `Once you Fulfill Your Vow (formidable or greater) in service to a seasoned warrior, and Forge a Bond to train with them...
                ⚫ When you Secure an Advantage by sizing up your foe in a fight, or in a charged situation which may lead to a fight, add +1 and take +1 momentum on a hit.
                ⚪ When you study or train in a new weapon or technique, you may obtain and upgrade that combat talent for 1 fewer experience.
                ⚪ When you Turn the Tide with a sudden change of weapon or technique, and your next move is a Strike, add +1 and inflict +2 harm on a strong hit. `
        }, {
            name: "Wright",
            type: "Path",
            text: `Specialty:
                ⚫ When you Secure an Advantage by crafting a useful item using your specialty, or when you Face Danger to create or repair an item in a perilous situation, add +1 and take +1 momentum on a hit.
                ⚪ As above, and you may suffer -1 supply (after rolling) to add an additional +1.
                ⚪ When you give the item you create as a gift to commemorate an important event or relationship, you may (one time only) reroll any dice when you Compel, Forge a Bond, or Test Your Bond. `
        }, {
            name: "Archer",
            type: "Combat Talent",
            text: `If you wield a bow....
                ⚫ When you Secure an Advantage by taking a moment to aim, choose your approach and add +1.
                • Trust your instincts: Roll +wits, and take +2 momentum on a strong hit.
                • Line up your shot: Roll +edge, and take +1 momentum on a hit.
                ⚪ Once per fight, when you Strike or Clash, you may take extra shots and suffer -1 supply (decide before rolling). When you do, reroll any dice. On a hit, inflict +2 harm and take +1 momentum.
                ⚪ When you Resupply by hunting, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Berserker",
            type: "Combat Talent",
            text: `If you are clad only in animal pelts…
                ⚫ When you Secure an Advantage or Compel by embodying your wild nature, add +1 and take +1 momentum on a hit.
                ⚪ When you Strike or Clash by unleashing your rage (decide before rolling), inflict +1 harm on a hit. Then, choose one.
                • Push yourself: Endure Harm (1 harm).
                • Lose yourself: Endure Stress (1 stress).
                ⚪ When you Endure Harm in a fight, and your health is above 0, you may let the pain inflame your wildness (decide before rolling). If you then score a strong hit and choose to embrace the pain, take +momentum equal to your remaining health. A weak hit counts as a miss. `
        }, {
            name: "Brawler",
            type: "Combat Talent",
            text: `If you are unarmed or fighting with a non-deadly weapon...
                ⚫ When you Secure an Advantage +iron by engaging in close-quarters brawling (such as punching, tripping, or grappling), add +1. If you score a hit, you may also inflict 1 harm.
                ⚪ When you use an unarmed attack or simple weapon to Strike with deadly intent, add +2 and inflict 2 harm on a hit (instead of 1). On a weak hit or miss, suffer -1 momentum (in addition to any other outcome of the move).
                ⚪ When you Face Danger or Clash against a brawling attack, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Cutthroat",
            type: "Combat Talent",
            text: `If you wield a dagger or knife...
                ⚫ When you are in position to Strike at an unsuspecting foe, choose one (before rolling).
                • Add +2 and take +1 momentum on a hit.
                • Inflict +2 harm on a hit.
                ⚪ When you Compel someone at the point of your blade, or when you rely on your blade to Face Danger, add +1.
                ⚪ Once per fight, when you Secure an Advantage +shadow by performing a feint or misdirection, reroll any dice and take +1 momentum on a hit. `
        }, {
            name: "Duelist",
            type: "Combat Talent",
            text: `If you wield a bladed weapon in each hand...
                ⚫ When you Strike or Clash, you may add +2. If you do (decide before rolling), inflict +1 harm on a strong hit and count a weak hit as a miss.
                ⚪ Once per fight, when you Secure an Advantage +edge by making a bold display of your combat prowess, you may reroll any dice.
                ⚪ When you Draw the Circle, choose one (before rolling).
                • Add +2.
                • Take +2 momentum on a hit. `
        }, {
            name: "Fletcher",
            type: "Combat Talent",
            text: `⚫ When you Secure an Advantage by crafting arrows of fine quality, add +1. Then, take +1 supply or +1 momentum on a hit.
                ⚪ When you Resupply by recovering or gathering arrows after a battle, add +2.
                ⚪ When you craft a single arrow designated for a specific foe, envision the process and materials, and roll +wits. On a strong hit, take both. On a weak hit, choose one.
                • Seeker: When a shooter uses the arrow to Strike or Clash against this foe, reroll any dice (one time only).
                • Ravager: When a shooter uses the arrow to inflict harm against this foe, inflict +1d6 harm (one time only). `
        }, {
            name: "Ironclad",
            type: "Combat Talent",
            text: `If you wear armor...
                ⚫ When you equip or adjust your armor, choose one.
                • Lightly armored: When you Endure Harm in a fight, add +1 and take +1 momentum on a hit.
                • Geared for war: Mark encumbered. When you Endure Harm in a fight, add +2 and take +1 momentum on a hit.
                ⚪ When you Clash while you are geared for war, add +1.
                ⚪ When you Compel in a situation where strength of arms is a factor, add +2. `,
                track: {
                    options: ["Lightly Armored", "Geared For War"]
                }
        }, {
            name: "Long-Arm",
            type: "Combat Talent",
            text: `If you wield a staff...
                ⚫ In your hands, a humble staff is a deadly weapon (2 harm). When you instead use it as a simple weapon (1 harm), you may Strike or Clash +edge (instead of iron). If you do, add +1 and take +1 momentum on a hit.
                ⚪ When you Secure an Advantage +edge using your staff to disarm, trip, shove, or stun your foe, add +1 and take +1 momentum on a hit.
                ⚪ When you Undertake a Journey and score a strong hit, or if you accompany an ally who scores a strong hit on that move, your staff provides support and comfort in your travels; take +1 momentum. `
        }, {
            name: "Shield-Bearer",
            type: "Combat Talent",
            text: `If you wield a shield...
                ⚫ When you Face Danger using your shield as cover, add +1. When you Clash in close quarters, take +1 momentum on a strong hit.
                ⚪ When you paint your shield with a meaningful symbol, envision what you create. Then, if you Endure Stress as you face off against a fearsome foe, add +1 and take +1 momentum on a hit.
                ⚪ When forced to Endure Harm in a fight, you may instead sacrifice your shield and ignore all harm. If you do, the shield is destroyed. Once per fight, you also take initiative when you sacrifice your shield to avoid harm. `
        }, {
            name: "Skirmisher",
            type: "Combat Talent",
            text: `If you wield a spear...
                ⚫ When you Face Danger by holding a foe at bay using your spear’s reach, roll +iron or +edge. If you score a hit, you may...
                • Iron: Strike (if you have initiative) or Clash now, and add +1.
                • Edge: Take +1 momentum.
                ⚪ When you Strike in close combat, you may attempt to drive your spear home (decide before rolling). If you do, add +1 and inflict +2 harm on a hit. If you score a hit and the fight continues, Face Danger +iron to recover your spear.
                ⚪ When you Secure an Advantage by bracing your spear against a charging foe, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Sunderer",
            type: "Combat Talent",
            text: `If you wield an axe...
                ⚫ When you Strike or Clash in close quarters, you may suffer -1 momentum and inflict +1 harm on a hit (decide before rolling).
                ⚪ When you have your axe in hand, and use the promise of violence to Compel or Secure an Advantage, add +1 and take +1 momentum on a hit.
                ⚪ When you make a tribute to a fallen foe (formidable or greater) by carving a rune in the haft of your axe, roll +heart. On a strong hit, inflict +1d6 harm (one time only) when you Strike or Clash. On a weak hit, as above, but this death weighs on you; Endure Stress (2 stress). `
        }, {
            name: "Slinger",
            type: "Combat Talent",
            text: `If you wield a sling...
                ⚫ When launched from a sling, a simple stone inflicts deadly harm (2 harm). When you Enter the Fray by barraging your foe with sling-bullets, inflict harm on a strong hit.
                ⚪ When you Strike by launching stones at an advancing foe, you may choose one (before rolling).
                • Hold them back: Retain initiative on a weak hit, but inflict only 1 harm.
                • Hit them hard: Inflict +1 harm on a hit, but suffer -1 momentum.
                ⚪ When you Secure an Advantage by preparing stones of a special quality or material, add +1. Then, take +1 momentum or +1 supply on a hit. `
        }, {
            name: "Swordmaster",
            type: "Combat Talent",
            text: `If you wield a sword...
                ⚫ When you Strike or Clash and burn momentum to improve your result, inflict +2 harm. If the fight continues, add +1 on your next move.
                ⚪ When you Clash and score a strong hit, add +1 if you immediately follow with a Strike.
                ⚪ When you Swear an Iron Vow by kneeling and grasping your sword’s blade, add +1 and take +1 momentum on a hit. If you let the edge draw blood from your hands, Endure Harm (1 harm) in exchange for an additional +1 momentum on a hit. `
        }, {
            name: "Thunder-Bringer",
            type: "Combat Talent",
            text: `If you wield a mighty hammer...
                ⚫ When you Face Danger, Secure an Advantage, or Compel by hitting or breaking an inanimate object, add +1 and take +1 momentum on a hit.
                ⚪ When you Strike a foe to knock them back, stun them, or put them off balance, inflict 1 harm (instead of 2) and take +2 momentum on a hit. On a strong hit, you also create an opening and add +1 on your next move.
                ⚪ When you Turn the Tide, you may Strike with all the fury and power you can muster. If you do (decide before rolling), you may reroll any dice and inflict +2 harm on a strong hit, but count a weak hit as a miss. `
        }, {
            name: "Communion",
            type: "Ritual",
            text: `⚫ When you surround the remains of a recently deceased intelligent creature with lit candles, and summon its spirit, roll +heart. Add +1 if you share a bond. On a strong hit, the spirit appears and you may converse for a few minutes. Make moves as appropriate (add +1). On a weak hit, as above, but the spirit also delivers troubling news unrelated to your purpose. Envision what it tells you (Ask the Oracle if unsure) and Endure Stress (1 stress).
                ⚪ As above, and you may also commune with the long-dead.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Divination",
            type: "Ritual",
            text: `⚫ When you take a drop of blood from a willing subject (not yourself) and cast the rune-carved stones, roll +heart. On a strong hit, you may read the runes to gain insight about the subject and people close to them, including information you and the subject have no knowledge of. If you use the reading to Gather Information, Compel, or Forge a Bond, add +1. On a weak hit, as above, but the runes reveal their secrets only with extra time and focus; suffer -2 momentum.
                ⚪ As above, and your divination can also reveal information about the subject’s future.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Awakening",
            type: "Ritual",
            text: `⚫ When you create a simulacrum, roll +heart. On a strong hit, your creation is given unnatural life. If it aids you as you make a move to assault or overcome an obstacle through strength, add +2. It has 3 health and suffers harm as appropriate, but is not a companion and may not be healed. At 0 health, it is dead. On a weak hit, as above, but if you roll a 1 on your action die when aided by your creation, you must Face Danger +heart to keep it from turning on you (as a formidable foe).
                ⚪ Your simulacrum has 6 health.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit.`,
                track: {
                    numeric: 6
                }
        }, {
            name: "Bind",
            type: "Ritual",
            text: `⚫ When you wear an animal pelt and dance in moonlight, roll +wits. On a strong hit, you or an ally may wear the pelt and add +1 when making moves with the related stat (wolf-edge; beariron; deer-heart; fox-shadow; boarwits). If the wearer rolls a 1 on their action die while making a move using the pelt, the magic is spent. On a weak hit, as above, but the wilds call as you dance; Endure Stress (2 stress).
                ⚪ As above, and you may instead perform this ritual wearing the pelt of a beast. If you do, name the related stat and add +2 (instead of +1).
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Augur",
            type: "Ritual",
            text: `⚫ When you summon a flock of crows and ask a single question, roll +wits. On a strong hit, you interpret their calls as a helpful omen. Envision the response (Ask the Oracle if unsure) and take +2 momentum. On a weak hit, the crows ignore your question and offer a clue to an unrelated problem or opportunity in this area. Envision what you learn (Ask the Oracle if unsure), and take +1 momentum.
                ⚪ As above, and the crows will also help guide you on the proper path. On a hit, add +1 on the next segment when you Undertake a Journey.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Keen",
            type: "Ritual",
            text: `⚫ When you hold a weapon and sing a keen for those it has killed, roll +heart. On a strong hit, the wielder inflicts +1 harm when they Strike or Clash. If they roll a 1 on their action die when making a move to inflict harm, the magic is spent. On a weak hit, as above, but the voices of those who were slain join in your song; Endure Stress (2 stress).
                ⚪ As above, and the wielder may also (one time only) add +1 and take +2 momentum on a hit when they Draw the Circle, Enter the Fray, or Battle.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Invoke",
            type: "Ritual",
            text: `⚫ When you consume the mystical essence of your surroundings, roll +wits. On a strong hit, add the value of your action die to your essence track (max 6). You may then Secure an Advantage or Face Danger +essence to create minor mystical effects or illusions. If you do, suffer -1 essence and take +1 momentum on a hit. On a weak hit, as above, but capturing these energies is harrowing; Endure Stress (2 stress).
                ⚪ You may Compel +essence (and suffer -1 essence) through a show of power.
                ⚪ When you perform this ritual, add +1 and take +1 essence on a hit.`,
                track: {
                    numeric: 5
                }
        }, {
            name: "Leech",
            type: "Ritual",
            text: `⚫ When you mark your hands or weapon with an intricate blood rune, roll +iron. On a strong hit, the rune thirsts for fresh blood. One time only, when you make a move to inflict harm, reroll any dice and inflict +2 harm on a hit. Then, for each point of harm inflicted, take +1 and allocate it as +health or +momentum. On a weak hit, as above, but this asset counts as a debility until the rune’s thirst is quenched.
                ⚪ As above, and you may also touch an ally or companion and let them take any remaining points as +health or +momentum.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Lightbearer",
            type: "Ritual",
            text: `⚫ When you focus on a source of light and capture its essence, roll +wits. On a strong hit, set your light track to +6. On a weak hit, make it +3. Then, when you make a move to overcome or navigate darkness, you may add +2 and suffer -1 light.
                ⚪ You may use your light to Strike or Clash against a dark-dwelling foe. Choose the amount of light to unleash, and roll +light (instead of +iron or +edge). Suffer -light equal to that amount. On a hit, your harm is 1+your unleashed light.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit.`,
                track: {
                    numeric: 6
                }
        }, {
            name: "Talisman",
            type: "Ritual",
            text: `⚫ When you fashion a charm, envision it and name the specific person or creature it protects against. Then roll +wits. On a strong hit, when the wearer opposes the target through a move, add +2. If a 1 is rolled on the action die while making a move using the charm, the magic is spent. On a weak hit, as above, but the wearer adds +1 when making a move (instead of +2).
                ⚪ As above, and you may instead fashion a charm which aids the wearer against all supernatural threats, such as mystic rituals or horrors.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Tether",
            type: "Ritual",
            text: `⚫ When you commune with the spirits of a place, roll +heart. If you share a bond with someone there, add +1. On a strong hit, you are tethered. When you Undertake a Journey to return, you may roll +spirit or +heart (instead of +wits), and take +1 momentum on a hit. When you Reach Your Destination, take +2 momentum on a strong hit. The tether is lost if you perform this ritual elsewhere, or when you Face Desolation. On a weak hit, as above, but the spirits reveal a disturbing aspect of the place; Endure Stress (2 stress).
                ⚪ As above, and you may also reroll any dice when you Sojourn in the tethered place.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Shadow-Walk",
            type: "Ritual",
            text: `⚫ When you cloak yourself with the gossamer veil of the shadow realms, roll +shadow. On a strong hit, take +1 momentum. Then, reroll any dice (one time only) when you make a move by ambushing, hiding, or sneaking. On a weak hit, as above, but the shadows try to lead you astray. You must first Face Danger to find your way.
                ⚪ As above, and you may also travel along the hidden paths of the shadow realms to Undertake a Journey using +shadow (instead of +wits). If you do, Endure Stress (1 stress) and mark progress twice on a strong hit.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Sway",
            type: "Ritual",
            text: `⚫ When you speak a person’s name three times to the wind, roll +wits. On a strong hit, the wind whispers of this person’s need. Envision what you hear (Ask the Oracle if unsure). If you use this information or fulfill this need when you Compel them, you may reroll any dice (one time only). On a weak hit, as above, but this person’s need creates a troubling dilemma or complication; Endure Stress (1 stress).
                ⚪ As above, and if you score a strong hit when you Compel, you may also reroll any dice (one time only) when you Gather Information from this person.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Scry",
            type: "Ritual",
            text: `⚫ When you look into flames to study a remote person or location, roll +shadow. You or someone with you must have knowledge of the target. On a strong hit, you may Gather Information through observation using +shadow or +wits. On a weak hit, as above, but the flames are hungry; choose one to sacrifice.
                • Your blood: Endure Harm (2 harm).
                • Something precious: Endure Stress (2 stress).
                • Provisions: Suffer -2 supply.
                ⚪ As above, and you may instead study a past event.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Totem",
            type: "Ritual",
            text: `⚫ When you hold a totem of your animal or beast companion and focus on it, roll +heart. On a strong hit, you are bound together. Add +1 and take +1 momentum on a hit when you use a companion ability. If you roll a 1 on your action die when using a companion ability, the magic is spent. On a weak hit, as above, but creating this connection is unsettling; Endure Stress (1 stress).
                ⚪ As above, and you may also perceive the world through your companion’s senses while you make moves aided by them (even when you are apart).
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Ward",
            type: "Ritual",
            text: `⚫ When you walk a wide circle, sprinkling the ground with salt, roll +wits. On a strong hit, choose two. On a weak hit, chose one.
                • When a foe first crosses the boundary, take +1 momentum.
                • When you first inflict harm against a foe within the boundary, inflict +1 harm.
                • Your ward is ‘likely’ (Ask the Oracle) to trap a foe within the boundary.
                ⚪ As above, and improve the effect of your ward (+2 momentum, +2 harm, and ‘almost certain’).
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit. `
        }, {
            name: "Visage",
            type: "Ritual",
            text: `⚫ When you paint yourself in blood and ash, roll +wits. On a strong hit, you may add +2 and take +1 momentum on a hit when you Secure an Advantage or Compel using fear or intimidation. If you roll a 1 on your action die when making a move aided by your visage, the magic is spent. On a weak hit, as above, but the blood must be your own; Endure Harm (2 harm).
                ⚪ As above, and you may also add +1 when you Strike, Clash, or Battle.
                ⚪ When you perform this ritual, add +1 and take +1 momentum on a hit.`
        },
    ]
}
