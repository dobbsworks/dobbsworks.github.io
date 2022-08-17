abstract class Hazard extends Sprite { 
    Update(): void {
        let player = <Player>this.layer.sprites.find(a => a instanceof Player);
        if (player) {
            if (player.Overlaps(this) && this.IsHazardActive()) {
                player.OnPlayerHurt();
            }
        }
    }
    
    abstract IsHazardActive(): boolean;
}