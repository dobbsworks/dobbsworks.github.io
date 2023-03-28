abstract class Hazard extends Sprite { 
    Update(): void {
        let players = <Player[]>this.layer.sprites.filter(a => a instanceof Player);
        for (let player of players) {
            if (this.DoesPlayerOverlap(player) && this.IsHazardActive()) {
                player.OnPlayerHurt();
            }
        }
    }

    protected DoesPlayerOverlap(player: Player): boolean {
        return player.Overlaps(this);
    }
    
    abstract IsHazardActive(): boolean;
}