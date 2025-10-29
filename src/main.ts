import type {innerBox} from "./interfaces.ts";
import {colord, Colord} from "colord";

class ColorPlayground {
    private readonly canvas: HTMLCanvasElement | null;
    private readonly ctx: CanvasRenderingContext2D | null;
    private readonly spacer: number;
    private readonly innerSpacer: number;

    constructor(){
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        if(!this.canvas) throw new Error("Cannot get Canvas Element");
        this.canvas.width = window.innerWidth*0.98;
        this.canvas.height = window.innerHeight*0.96;

        this.ctx = this.canvas.getContext("2d");
        this.spacer = 10;
        this.innerSpacer = 2/3*this.spacer;

        this.initialize();
    }

    initialize(){
        const currentDate: Date = new Date();
        const formattedTimestamp: string = currentDate.toLocaleTimeString();
        console.log(`Last Reloaded: ${formattedTimestamp}`);
    }

    pushColors(): Colord[] {
        const color: Colord[] = [];
        color.push(colord("rgb(180,170,255)"));
        color.push(colord("rgb(250, 255, 200)"));
        color.push(colord("rgb(255,0,0)"));
        return color;
    }

    draw() {
        const boxFractions: number[] = [0.33, 0.67];
        const innerBoxes: innerBox[] = this.backgroundBoxes(boxFractions);
        const colors: Colord[] = this.pushColors();

        this.drawColors(innerBoxes[0], colors);
    }

    backgroundBoxes(boxFractions: number[]): innerBox[] {
        const ctx = this.ctx;
        if(!ctx) throw new Error("Can't get Canvas Context");

        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const spacer = this.spacer;
        const rectRadius = 5;
        const boxHeight = (height - 2*spacer);

        let x = 0;
        const size = boxFractions.length;
        let innerBoxes: innerBox[] = [];

        boxFractions.forEach((boxFraction: number, index: number) => {
            const xOffset = x + spacer;
            const yOffset = spacer;
            const boxWidth = (width - (size+1) * spacer) * boxFraction;

            if(index !== 2){
                ctx.beginPath();
                ctx.roundRect(xOffset, yOffset, boxWidth, boxHeight, rectRadius);
                ctx.stroke();
                ctx.fill();
            }

            const innerBox = {
                x : xOffset + this.innerSpacer,
                y : yOffset + this.innerSpacer,
                width : boxWidth - 2*this.innerSpacer,
                height : boxHeight - 2*this.innerSpacer,
            };

            innerBoxes.push(innerBox);

            // console.log(`Drew box #: ${index+1}`)
            x = xOffset + boxWidth;
        });

        return innerBoxes;
    }

    drawColors(innerBox: innerBox, colors: Colord[]) {
        const heights = innerBox.height / colors.length;
        const widths = innerBox.width / 3;
        const yOffset = innerBox.y;
        const xOffset = innerBox.x;

        colors.forEach((color: Colord, index: number) =>{
            const light = this.lighten(color, 0.10);
            const dark = this.darken(color, 0.10);

            this.drawRect(xOffset, yOffset + index*heights, widths, heights, color);
            this.drawRect(xOffset+widths, yOffset + index*heights, widths, heights, light);
            this.drawRect(xOffset+2*widths, yOffset + index*heights, widths, heights, dark);
        });
    }

    drawRect(x: number,
             y: number,
             width: number,
             height: number,
             fill?: Colord | string | CanvasGradient | CanvasPattern,
             stroke?: Colord | string | CanvasGradient | CanvasPattern
    ){
        if(!this.ctx) throw new Error("Can't get Canvas Context");
        const ctx = this.ctx;
        ctx.fillStyle = (fill instanceof Colord) ? fill.toRgbString() : (fill ?? "#000000");
        ctx.strokeStyle = (stroke instanceof Colord) ? stroke.toRgbString() : (stroke ?? "#000000");

        ctx.fillRect(x,y,width,height);
    }

    drawRoundedRect(ctx: CanvasRenderingContext2D,
                    x: number,
                    y: number,
                    width: number,
                    height: number,
                    radius: number,
                    fill?: Colord | string | CanvasGradient | CanvasPattern,
                    stroke?: Colord | string | CanvasGradient | CanvasPattern
    ) {
        ctx.fillStyle = (fill instanceof Colord) ? fill.toRgbString() : (fill ?? "#00000000");
        ctx.strokeStyle = (stroke instanceof Colord) ? stroke.toRgbString() : (stroke ?? "#00000000");
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.stroke();
    }

    lighten(base: Colord | string, amt: number): Colord {
        if(typeof base === "string") base = colord(base);
        return base.lighten(amt);
    }

    darken(base: Colord | string, amt: number): Colord {
        if(typeof base === "string") base = colord(base);
        return base.darken(amt);
    }
}

const c = new ColorPlayground();
c.draw();