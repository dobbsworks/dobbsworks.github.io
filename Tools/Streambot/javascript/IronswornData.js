var ironswornData = {
    moves: {
        "Face Danger": {
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
        "Secure An Advantage": {
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
        "Gather Information": {
            type: "Adventure",
            text: `When you search an area, ask questions, conduct an investigation, or follow a track, roll +wits. If you act within a community or ask questions of a person with whom you share a bond, add +1. 
            On a strong hit, you discover something helpful and specific. The path you must follow or action you must take to make progress is made clear. Envision what you learn (Ask the Oracle if unsure), and take +2 momentum.
            On a weak hit, the information complicates your quest or introduces a new danger. Envision what you discover (Ask the Oracle if unsure), and take +1 momentum.
            On a miss, your investigation unearths a dire threat or reveals an unwelcome truth that undermines your quest. Pay the Price. `
        },
        "Heal": {
            type: "Adventure",
            text: `When you treat an injury or ailment, roll +wits. If you are mending your own wounds, roll +wits or +iron, whichever is lower.
            On a strong hit, your care is helpful. If you (or the ally under your care) have the wounded condition, you may clear it. Then, take or give up to +2 health.
            On a weak hit, as above, but you must suffer -1 supply or -1 momentum (your choice).
            On a miss, your aid is ineffective. Pay the Price. `
        },
        "Resupply": {
            type: "Adventure",
            text: `When you hunt, forage, or scavenge, roll +wits.
            On a strong hit, you bolster your resources. Take +2 supply.
            On a weak hit, take up to +2 supply, but suffer -1 momentum for each.
            On a miss, you find nothing helpful. Pay the Price. `
        },
        "Make Camp": {
            type: "Adventure",
            text: `When you rest and recover for several hours in the wild, roll +supply. On a strong hit, you and your allies may each choose two. On a weak hit, choose one.
            • Recuperate: Take +1 health for you and any companions.
            • Partake: Suffer -1 supply and take +1 health for you and any companions.
            • Relax: Take +1 spirit.
            • Focus: Take +1 momentum.
            • Prepare: When you break camp, add +1 if you Undertake a Journey.
            On a miss, you take no comfort. Pay the Price. `
        },
        "Undertake a Journey": {
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
        "Reach Your Destination": {
            type: "Adventure",
            text: `Progress Move
            When your journey comes to an end, roll the challenge dice and compare to your progress. Momentum is ignored on this roll.
            On a strong hit, the situation at your destination favors you. Choose one.
            • Make another move now (not a progress move), and add +1.
            • Take +1 momentum.
            On a weak hit, you arrive but face an unforeseen hazard or complication. Envision what you find (Ask the Oracle if unsure).
            On a miss, you have gone hopelessly astray, your objective is lost to you, or you were misled about your destination. If your journey continues, clear all but one filled progress, and raise the journey’s rank by one (if not already epic). `
        },
        "Compel": {
            type: "Relationship",
            text: `When you attempt to persuade someone to do something, envision your approach and roll. If you...
            • Charm, pacify, barter, or convince: Roll +heart (add +1 if you share a bond).
            • Threaten or incite: Roll +iron.
            • Lie or swindle: Roll +shadow.
            On a strong hit, they’ll do what you want or share what they know. Take +1 momentum. If you use this exchange to Gather Information, make that move now and add +1.
            On a weak hit, as above, but they ask something of you in return. Envision what they want (Ask the Oracle if unsure).
            On a miss, they refuse or make a demand which costs you greatly. Pay the Price. `
        },
        "Sojourn": {
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
        "Draw the Circle": {
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
        "Forge a Bond": {
            type: "Relationship",
            text: `When you spend significant time with a person or community, stand together to face hardships, or make sacrifices for their cause, you can attempt to create a bond. When you do, roll +heart. If you make this move after you successfully Fulfill Your Vow to their benefit, you may reroll any dice.
            On a strong hit, make note of the bond, mark a tick on your bond progress track, and choose one.
            • Take +1 spirit.
            • Take +2 momentum.
            On a weak hit, they ask something more of you first. Envision what it is (Ask the Oracle if unsure), do it (or Swear an Iron Vow), and mark the bond. If you refuse or fail, Pay the Price.
            On a miss, they reject you. Pay the Price. `
        },
        "Test Your Bond": {
            type: "Relationship",
            text: `When your bond is tested through conflict, betrayal, or circumstance, roll +heart.
            On a strong hit, this test has strengthened your bond. Choose one.
            • Take +1 spirit.
            • Take +2 momentum.
            On a weak hit, your bond is fragile and you must prove your loyalty. Envision what they ask of you (Ask the Oracle if unsure), and do it (or Swear an Iron Vow). If you refuse or fail, clear the bond and Pay the Price.
            On a miss, or if you have no interest in maintaining this relationship, clear the bond and Pay the Price. `
        },
        "Aid Your Ally": {
            type: "Relationship",
            text: `When you Secure an Advantage in direct support of an ally, and score a hit, they (instead of you) can take the benefits of the move. If you are in combat and score a strong hit, you and your ally have initiative. `
        },
        "Write Your Epilogue": {
            type: "Relationship",
            text: `Progress Move
            When you retire from your life as Ironsworn, envision two things: What you hope for, and what you fear. Then, roll the challenge dice and compare to your bonds. Momentum is ignored on this roll.
            On a strong hit, things come to pass as you hoped.
            On a weak hit, your life takes an unexpected turn, but not necessarily for the worse. You find yourself spending your days with someone or in a place you did not foresee. Envision it (Ask the Oracle if unsure).
            On a miss, your fears are realized. `
        },
        "Enter the Fray": {
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
        "Strike": {
            type: "Combat",
            text: `When you have initiative and attack in close quarters, roll +iron. When you have initiative and attack at range, roll +edge.
            On a strong hit, inflict +1 harm. You retain initiative.
            On a weak hit, inflict your harm and lose initiative.
            On a miss, your attack fails and you must Pay the Price. Your foe has initiative.`
        },
        "Clash": {
            type: "Combat",
            text: `When your foe has initiative and you fight with them in close quarters, roll +iron. When you exchange a volley at range, or shoot at an advancing foe, roll +edge.
            On a strong hit, inflict your harm and choose one. You have the initiative.
            • You bolster your position: Take +1 momentum.
            • You find an opening: Inflict +1 harm.
            On a weak hit, inflict your harm, but then Pay the Price. Your foe has initiative.
            On a miss, you are outmatched and must Pay the Price. Your foe has initiative`
        },
        "Turn the Tide": {
            type: "Combat",
            text: `Once per fight, when you risk it all, you may steal initiative from your foe to make a move (not a progress move). When you do, add +1 and take +1 momentum on a hit.
            If you fail to score a hit on that move, you must suffer a dire outcome. Pay the Price.`
        },
        "End the Fight": {
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
        "Battle": {
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
        "Endure Harm": {
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
        "Face Death": {
            type: "Suffer",
            text: `When you are brought to the brink of death, and glimpse the world beyond, roll +heart.
            On a strong hit, death rejects you. You are cast back into the mortal world.
            On a weak hit, choose one.
            • You die, but not before making a noble sacrifice. Envision your final moments.
            • Death desires something of you in exchange for your life. Envision what it wants (Ask the Oracle if unsure), and Swear an Iron Vow (formidable or extreme) to complete that quest. If you fail to score a hit when you Swear an Iron Vow, or refuse the quest, you are dead. Otherwise, you return to the mortal world and are now cursed. You may only clear the cursed debility by completing the quest.
            On a miss, you are dead.`
        },
        "Companion Endure Harm": {
            type: "Suffer",
            text: `When your companion faces physical damage, they suffer -health equal to the amount of harm inflicted. If your companion’s health is 0, exchange any leftover -health for -momentum.
            Then, roll +heart or +your companion’s health, whichever is higher.
            On a strong hit, your companion rallies. Give them +1 health.
            On a weak hit, your companion is battered. If their health is 0, they cannot assist you until they gain at least +1 health.
            On a miss, also suffer -1 momentum. If your companion’s health is 0, they are gravely wounded and out of action. Without aid, they die in an hour or two.
            If you roll a miss with a 1 on your action die, and your companion’s health is 0, they are now dead. Take 1 experience for each marked ability on your companion asset, and remove it.`
        },
        "Endure Stress": {
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
        "Face Desolation": {
            type: "Suffer",
            text: `When you are brought to the brink of desolation, roll +heart.
            On a strong hit, you resist and press on.
            On a weak hit, choose one.
            • Your spirit or sanity breaks, but not before you make a noble sacrifice. Envision your final moments.
            • You see a vision of a dreaded event coming to pass. Envision that dark future (Ask the Oracle if unsure), and Swear an Iron Vow (formidable or extreme) to prevent it. If you fail to score a hit when you Swear an Iron Vow, or refuse the quest, you are lost. Otherwise, you return to your senses and are now tormented. You may only clear the tormented debility by completing the quest.
            On a miss, you succumb to despair or horror and are lost.`
        },
        "Out of Supply": {
            type: "Suffer",
            text: `When your supply is exhausted (reduced to 0), mark unprepared. If you suffer additional -supply while unprepared, you must exchange each additional -supply for any combination of -health, -spirit or -momentum as appropriate to the circumstances.`
        },
        "Face a Setback": {
            type: "Suffer",
            text: `When your momentum is at its minimum (-6), and you suffer additional -momentum, choose one.
            • Exchange each additional -momentum for any combination of -health, -spirit, or -supply as appropriate to the circumstances.
            • Envision an event or discovery (Ask the Oracle if unsure) which undermines your progress in a current quest, journey or fight. Then, for each additional -momentum, clear 1 unit of progress on that track per its rank (troublesome=clear 3 progress; dangerous=clear 2 progress; formidable=clear 1 progress; extreme=clear 2 ticks; epic=clear 1 tick).`
        },
        "Swear an Iron Vow": {
            type: "Quest",
            text: `When you swear upon iron to complete a quest, write your vow and give the quest a rank. Then, roll +heart. If you make this vow to a person or community with whom you share a bond, add +1.
            On a strong hit, you are emboldened and it is clear what you must do next (Ask the Oracle if unsure). Take +2 momentum.
            On a weak hit, you are determined but begin your quest with more questions than answers. Take +1 momentum, and envision what you do to find a path forward.
            On a miss, you face a significant obstacle before you can begin your quest. Envision what stands in your way (Ask the Oracle if unsure), and choose one.
            • You press on: Suffer -2 momentum, and do what you must to overcome this obstacle.
            • You give up: Forsake Your Vow.`
        },
        "Reach a Milestone": {
            type: "Quest",
            text: `When you make significant progress in your quest by overcoming a critical obstacle, completing a perilous journey, solving a complex mystery, defeating a powerful threat, gaining vital support, or acquiring a crucial item, you may mark progress.
            • Troublesome quest: Mark 3 progress.
            • Dangerous quest: Mark 2 progress.
            • Formidable quest: Mark 1 progress.
            • Extreme quest: Mark 2 ticks.
            • Epic quest: Mark 1 tick.`
        },
        "Fulfill Your Vow": {
            type: "Quest",
            text: `Progress Move
            When you achieve what you believe to be the fulfillment of your vow, roll the challenge dice and compare to your progress. Momentum is ignored on this roll.
            On a strong hit, your quest is complete. Mark experience (troublesome=1; dangerous=2; formidable=3; extreme=4; epic=5).
            On a weak hit, there is more to be done or you realize the truth of your quest. Envision what you discover (Ask the Oracle if unsure). Then, mark experience (troublesome=0; dangerous=1; formidable=2; extreme=3; epic=4). You may Swear an Iron Vow to set things right. If you do, add +1. 
            On a miss, your quest is undone. Envision what happens (Ask the Oracle if unsure), and choose one.
            • You recommit: Clear all but one filled progress, and raise the quest’s rank by one (if not already epic).
            • You give up: Forsake Your Vow.`
        },
        "Forsake Your Vow": {
            type: "Quest",
            text: `When you renounce your quest, betray your promise, or the goal is lost to you, clear the vow and Endure Stress. You suffer -spirit equal to the rank of your quest (troublesome=1; dangerous=2; formidable=3; extreme=4; epic=5).
            If the vow was made to a person or community with whom you share a bond, Test Your Bond when you next meet.`
        },
        "Advance": {
            type: "Quest",
            text: `When you focus on your skills, receive training, find inspiration, earn
            a reward, or gain a companion, you may spend 3 experience to add a
            new asset, or 2 experience to upgrade an asset.`
        },
        "Pay the Price": {
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
        "Ask the Oracle": {
            type: "Fate",
            text: `When you seek to resolve questions, discover details in the world, determine how other characters respond, or trigger encounters or events, you may…
            • Draw a conclusion: Decide the answer based on the most interesting and obvious result.
            • Ask a yes/no question: Decide the odds of a ‘yes’, and roll on the table below to check the answer.
            • Pick two: Envision two options. Rate one as ‘likely’, and roll on the table to see if it is true. If not, it is the other.
            • Spark an idea: Brainstorm or use a random prompt.`
        },
    }
}
