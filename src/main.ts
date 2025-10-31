import type {innerBox} from "./interfaces.ts";
import {colord, Colord} from "colord";
import Perlin from "./perlin.ts";

class ColorPlayground {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly spacer: number;
    private readonly innerSpacer: number;
    private colorButton: HTMLButtonElement | undefined;
    private structureToggle: HTMLButtonElement | undefined;
    private colorToggle: HTMLButtonElement | undefined;
    private perlin: Perlin;
    private terrain: number[] | undefined;
    private readonly boxFractions: number[];
    private innerBoxes: innerBox[] | undefined;
    private colors: Colord[] | undefined;
    private colorIDX: number;
    private numColorRows: number | undefined;
    private showColorStrings: boolean;

    constructor(){

        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        if(!this.canvas) throw new Error("Cannot get Canvas Element");

        const div = document.getElementById("button-container") as HTMLElement;
        const height = div.offsetHeight;

        this.canvas.width = Math.floor(window.innerWidth*0.98);
        this.canvas.height = Math.floor((window.innerHeight - height) * 0.96);

        const context = this.canvas.getContext("2d");
        if(!context) throw new Error("Could not get context");
        this.ctx = context;

        this.spacer = 10;
        this.colorIDX = 0;
        this.innerSpacer = this.spacer/2;
        this.boxFractions = [0.33, 0.67];
        this.colors = this.pushColors();
        this.perlin = new Perlin(Math.random());
        this.showColorStrings = true;

        this.initialize();
    }

    initialize(){
        const currentDate: Date = new Date();
        const formattedTimestamp: string = currentDate.toLocaleTimeString();
        console.log(`Last Reloaded: ${formattedTimestamp}`);

        this.colorButton = document.getElementById("cycle-colors") as HTMLButtonElement;
        this.structureToggle = document.getElementById("structure-toggle") as HTMLButtonElement;
        this.colorToggle = document.getElementById("color-toggle") as HTMLButtonElement;

        this.addEventListeners();
        this.draw();
    }

    addEventListeners() {
        if(!this.colorButton || !this.structureToggle) return;

        this.colorButton.addEventListener("click", () => {
            this.cycleColors()
        });

        this.structureToggle.addEventListener("click", () => {
            this.toggleStructures();
        });

        this.colorToggle?.addEventListener("click", () => {
            this.showColorStrings = !this.showColorStrings;
            this.redraw();
        });
    }

    pushColors(): Colord[] {
        const color: Colord[] = [];
        color.push(colord("rgb(163,230,53)")); // Yellow Green
        color.push(colord("rgb(132,204,22)")); // Lime
        color.push(colord("rgb(16,185,129)")); // Sea Green
        color.push(colord("rgb(52,211,153)")); // Spearmint
        color.push(colord("rgb(45,212,191)")); // Turquoise
        color.push(colord("rgb(74,222,128)")); // Mint
        color.push(colord("rgb(110,231,183)")); // Seafoam
        color.push(colord("rgb(134,239,172)")); // Light Green
        color.push(colord("rgb(151,255,187)")); // Fresh Mint
        color.push(colord("rgb(186,255,201)")); // Pale Emerald
        color.push(colord("rgb(34,197,94)")); // Emerald
        color.push(colord("rgb(67,190,84)")); // Fresh Green
        color.push(colord("rgb(82,183,136)")); // Jade
        color.push(colord("rgb(48,178,180)")); // Teal
        color.push(colord("rgb(202,225,255)")); // Baby Blue
        color.push(colord("rgb(147,197,253)")); // Powder Blue
        color.push(colord("rgb(125,211,252)")); // Crystal Blue
        color.push(colord("rgb(99,202,253)")); // Azure
        color.push(colord("rgb(56,189,248)")); // Light Blue
        color.push(colord("rgb(96,165,250)")); // Sky Blue
        color.push(colord("rgb(59,130,246)")); // Royal Blue
        color.push(colord("rgb(79,70,229)")); // Indigo
        color.push(colord("rgb(124,58,237)")); // Royal Purple
        color.push(colord("rgb(147,51,234)")); // Bright Purple
        color.push(colord("rgb(179,136,255)")); // Light Purple
        color.push(colord("rgb(167,139,250)")); // Periwinkle
        color.push(colord("rgb(168,85,247)")); // Vibrant Purple
        color.push(colord("rgb(190,92,251)")); // Amethyst
        color.push(colord("rgb(217,70,239)")); // Fuchsia
        color.push(colord("rgb(192,132,252)")); // Lavender
        color.push(colord("rgb(240,171,252)")); // Orchid
        color.push(colord("rgb(233,213,255)")); // Light Lilac
        color.push(colord("rgb(204,204,255)")); // Soft Lavender Blue
        color.push(colord("rgb(220,220,255)")); // Meringue Blue
        color.push(colord("rgb(220,240,250)")); // Ice Blue
        color.push(colord("rgb(230,255,250)")); // Mint Whisper
        color.push(colord("rgb(230,250,210)")); // Pastel Lime
        color.push(colord("rgb(240,240,200)")); // Light Khaki
        color.push(colord("rgb(250,250,210)")); // Pastel Lemon
        color.push(colord("rgb(255,240,200)")); // Vanilla
        color.push(colord("rgb(255,223,186)")); // Apricot Cream
        color.push(colord("rgb(252,211,77)")); // Golden
        color.push(colord("rgb(251,191,36)")); // Marigold
        color.push(colord("rgb(234,179,8)")); // Sunflower
        color.push(colord("rgb(202,138,4)")); // Rich Gold
        color.push(colord("rgb(245,158,11)")); // Amber
        color.push(colord("rgb(251,146,60)")); // Light Orange
        color.push(colord("rgb(249,115,22)")); // Tangerine
        color.push(colord("rgb(234,88,12)")); // Burnt Orange
        color.push(colord("rgb(133,77,14)")); // Chocolate
        color.push(colord("rgb(251,235,245)")); // Rose Powder
        color.push(colord("rgb(250,215,225)")); // Cotton Candy
        color.push(colord("rgb(255,204,229)")); // Blush Pink
        color.push(colord("rgb(252,165,165)")); // Peach
        color.push(colord("rgb(253,164,175)")); // Salmon Pink
        color.push(colord("rgb(251,113,133)")); // Watermelon
        color.push(colord("rgb(248,113,113)")); // Warm Red
        color.push(colord("rgb(245,101,101)")); // Coral
        color.push(colord("rgb(235,75,75)")); // Bright Red
        color.push(colord("rgb(239,68,68)")); // Crimson
        color.push(colord("rgb(220,38,38)")); // Ruby
        color.push(colord("rgb(236,72,153)")); // Deep Pink
        color.push(colord("rgb(244,114,182)")); // Rose
        return color;
    }

    draw() {
        this.innerBoxes = this.drawBackgroundBoxes(this.boxFractions);
        this.numColorRows = Math.min(Math.floor(this.innerBoxes[0].height / 40), 16);
        this.terrain = this.generateTerrain(this.innerBoxes[1]);
        this.drawPerlinTerrain(this.innerBoxes[1]);
        this.drawLeftColors(this.innerBoxes[0], this.colors!);
        this.drawRightColors(this.innerBoxes[1], this.colors!);
    }

    generateTerrain(innerBox: innerBox): number[] {
        const width = innerBox.width;
        const height = innerBox.height;
        const size = width*height;
        let terrain: number[] = new Array<number>(size).fill(0);

        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                const index = y*width + x;
                terrain[index] = Math.floor(Math.abs(this.perlin.perlin2(x / 50, y / 50)) * 50);
            }
        }
        return terrain;
    }

    redraw() {
        this.drawBackgroundBoxes(this.boxFractions);
        this.drawPerlinTerrain(this.innerBoxes![1]);
        this.drawLeftColors(this.innerBoxes![0], this.colors!);
        this.drawRightColors(this.innerBoxes![1], this.colors!);
    }

    drawBackgroundBoxes(boxFractions: number[]): innerBox[] {
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

        boxFractions.forEach((boxFraction: number) => {
            const xOffset = x + spacer;
            const yOffset = spacer;
            const boxWidth = (width - (size+1) * spacer) * boxFraction;

            const fill = colord("#ffffff");
            const stroke = colord("#000000");

            this.drawRoundedRect(xOffset, yOffset, boxWidth, boxHeight, rectRadius, fill, stroke);


            const innerBox = {
                x : xOffset + this.innerSpacer,
                y : yOffset + this.innerSpacer,
                width : Math.floor(boxWidth - 2*this.innerSpacer),
                height : Math.floor(boxHeight - 2*this.innerSpacer),
            };

            innerBoxes.push(innerBox);

            // console.log(`Drew box #: ${index+1}`)
            x = xOffset + boxWidth;
        });

        return innerBoxes;
    }

    drawPerlinTerrain(innerBox: innerBox){
        if(!this.ctx) throw new Error("Can't get Canvas Context");
        if(!this.terrain) throw new Error("No Terrain has been generated");
        const width = innerBox.width;
        const height = innerBox.height;

        const imageData = this.ctx?.getImageData(innerBox.x,innerBox.y, width, height);
        let data = imageData.data;

        for(let x=0; x<width; x++){
            for(let y=0; y<height; y++){
                const index = (y*width + x)
                const terrainVal = this.terrain[index]
                const terrainColor = this.getTerrainColor(terrainVal).toRgb();
                const offset = index*4;
                data[offset] = terrainColor.r;
                data[offset + 1] = terrainColor.g;
                data[offset + 2] = terrainColor.b;
                data[offset + 3] = 150;
            }
        }
        this.ctx.putImageData(imageData, innerBox.x, innerBox.y);
    }

    toggleStructures() {

    }

    cycleColors(): void {
        this.colorIDX += this.numColorRows!;
        this.colorIDX %= this.colors!.length;
        this.redraw();
    }

    getTerrainColor(mag: number): Colord {
        if(mag<10) {
            return colord({
                r: 190,
                g: 220 - 2 * mag,
                b: 138,
            });
        } else if(mag <20) {
            return colord({
                r: 200 + 2 * mag,
                g: 183 + 2 * mag,
                b: 138 + 2 * mag,
            });
        }else{
            return colord({
                r: 230 + mag / 2,
                g: 230 + mag / 2,
                b: 230 + mag / 2,
            });
        }
    }

    drawLeftColors(innerBox: innerBox, colors: Colord[]) {
        const heights = innerBox.height / this.numColorRows!;
        const widths = innerBox.width / 4;
        const yOffset = innerBox.y;
        const xOffset = innerBox.x;

        let count = 0;
        for(let i=this.colorIDX; i<this.colorIDX+this.numColorRows!; i++) {

            const color = colors[i % this.colors!.length];
            const light = this.darken(color, 0.125);
            const medium = this.darken(color, 0.2);
            const dark = this.darken(color, 0.4);

            this.drawRect(xOffset, yOffset + count * heights, widths, heights, color);
            this.drawRect(xOffset + widths, yOffset + count * heights, widths, heights, light);
            this.drawRect(xOffset + 2 * widths, yOffset + count * heights, widths, heights, medium);
            this.drawRect(xOffset + 3 * widths, yOffset + count * heights, widths, heights, dark);
            if(this.showColorStrings) {
                this.writeColor(xOffset + widths / 2, yOffset + count * heights + heights / 2, color);
                this.writeColor(xOffset + widths / 2 + widths, yOffset + count * heights + heights / 2, light);
                this.writeColor(xOffset + widths / 2 + 2 * widths, yOffset + count * heights + heights / 2, medium);
                this.writeColor(xOffset + widths / 2 + 3 * widths, yOffset + count * heights + heights / 2, dark);
            }
            count++;
        }
    }

    drawRightColors(innerBox: innerBox, colors: Colord[]){
        const heights = innerBox.height / this.numColorRows!;
        const widths = innerBox.width;
        const yOffset = innerBox.y;
        const xOffset = innerBox.x;

        let count = 0;
        for(let i= this.colorIDX; i<this.colorIDX+this.numColorRows!; i++) {
            let color = colors[i % this.colors!.length];
            color = color.alpha(150/255);
            this.drawRect(xOffset, yOffset + count * heights, widths, heights, color);
            if(this.showColorStrings) {
                this.writeColor(xOffset+10, yOffset+count*heights + heights/2, color, "start");
            }
            count++;
        }
    }

    writeColor(x:number, y:number, color: Colord | string, alignment?: CanvasTextAlign){
        let text = (color instanceof Colord) ? color.toRgbString() : color;
        text = text.replaceAll(" ", "");
        const ctx = this.ctx;
        if(!ctx) throw new Error("Can't write color");

        ctx.font = "12px Arial";
        ctx.fillStyle ="black";
        ctx.textAlign = alignment ?? "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
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

    drawRoundedRect(x: number,
                    y: number,
                    width: number,
                    height: number,
                    radius: number,
                    fill?: Colord | string | CanvasGradient | CanvasPattern,
                    stroke?: Colord | string | CanvasGradient | CanvasPattern
    ) {
        const ctx = this.ctx;
        if(!ctx) throw new Error("Can't get Canvas Context");

        ctx.fillStyle = (fill instanceof Colord) ? fill.toRgbString() : (fill ?? "#00000000");
        ctx.strokeStyle = (stroke instanceof Colord) ? stroke.toRgbString() : (stroke ?? "#00000000");
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.fill();
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