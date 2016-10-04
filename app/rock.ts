export class Rock {
        id: number;
        set delta(delta:number){
                console.log("Delta updated to " + delta + " for rock: " + this.id);
                this.delta = delta;
        };
        timeSpan: number;
        baseHeight: number;
        date: Date;
}