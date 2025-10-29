
class ColorPlayground {
    private readonly canvas: HTMLCanvasElement | null;
    private readonly ctx: CanvasRenderingContext2D | null;

    constructor(){
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        if(!this.canvas) throw new Error("Cannot get Canvas Element");
        this.canvas.width = window.innerWidth*0.98;
        this.canvas.height = window.innerHeight*0.96;

        this.ctx = this.canvas.getContext("2d");
    }

    draw(){
        const ctx = this.ctx;
        if(!ctx) throw new Error("Can't get Canvas Context");

        ctx.fillStyle = 'black';
        ctx.fillRect(10,10, 150, 100);
    }
}

const c = new ColorPlayground();
c.draw();