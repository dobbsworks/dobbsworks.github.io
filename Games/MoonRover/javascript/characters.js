var characters = [
    {
        name: "Rover", 
        imageId: "dog-rover", 
        unlocked: true, 
        bio: "Rover is as loyal as they come. Likes playing fetch, long naps in sunbeams, and walks in the park. \n\n[good]All-around average dog\n[good]Great at accessorizing\n[bad]Goggles do nothing",
        initialWeapons: [WeaponPeashooter],
    },
    {
        name: "Hopper", 
        imageId: "dog-hopper", 
        unlocked: false, 
        bio: "Hopper is an unharvested force of pure energy. Honestly the rocket probably wasn't needed to get him up here. \n\n[good]Reloads full-speed mid-air\n[good]Starts with a sweet jetpack\n[bad]Takes damage from landing",
        achievementGate: ["beatGame"],
        midAirReload: true,
        damagedOnSolid: true,
        initialWeapons: [WeaponPeashooter, WeaponJetpack],
    },
    {
        name: "Beans", 
        imageId: "dog-beans", 
        unlocked: false, 
        achievementGate: ["beatGameMulticharacter"],
        bio: "Beans is a retired pageant dog who spent years competing to be the best. Old, but still ready for more adventures. \n\n[good]Heals when dealing damage\n[bad]Takes damage over time",
        mustKeepAttacking: true,
        initialWeapons: [WeaponShotgun],
    },
]