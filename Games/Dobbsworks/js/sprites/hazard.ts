abstract class Hazard extends Sprite { 
    Update(): void {
        let player = <Player>this.layer.sprites.find(a => a instanceof Player);
        if (player) {
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