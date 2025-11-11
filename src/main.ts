
import {colord, Colord} from "colord";
import {DEFAULT_SETTINGS, type Settings} from "./Settings.ts";
import {ICON_SIZE, type innerBox} from "./Utils.ts";
import {createIcon} from "./IconDrawing.ts";

class ColorPlayground {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private colorToggle: HTMLButtonElement | undefined;
    private colorButton: HTMLButtonElement | undefined;
    private structureToggle: HTMLButtonElement | undefined;
    private colorStringToggle: HTMLButtonElement | undefined;
    private terrain: number[] | undefined;
    private innerBoxes: innerBox[] | undefined;
    private settings: Settings;

    constructor(){
        this.settings = DEFAULT_SETTINGS;
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        if(!this.canvas) throw new Error("Cannot get Canvas Element");

        this.resize();

        const context = this.canvas.getContext("2d", {willReadFrequently: true});
        if(!context) throw new Error("Could not get context");
        this.ctx = context;

        const currentDate: Date = new Date();
        const formattedTimestamp: string = currentDate.toLocaleTimeString();
        console.log(`Last Reloaded: ${formattedTimestamp}`);

        this.colorButton = document.getElementById("cycle-colors") as HTMLButtonElement;
        this.structureToggle = document.getElementById("structure-toggle") as HTMLButtonElement;
        this.colorStringToggle = document.getElementById("color-string-toggle") as HTMLButtonElement;
        this.colorToggle = document.getElementById("color-toggle") as HTMLButtonElement;

        this.addEventListeners();
    }

    resize(){
        const div = document.getElementById("button-container") as HTMLElement;
        const height = div.offsetHeight;
        this.settings.canvasWidth = Math.floor(window.innerWidth*0.98);
        this.settings.canvasHeight = Math.floor((window.innerHeight - height) * 0.96);
        this.canvas.height = this.settings.canvasHeight;
        this.canvas.width = this.settings.canvasWidth;
    }

    addEventListeners() {

        window.addEventListener("resize", () => {
            this.resize();
            this.draw();
        });
        this.colorButton!.addEventListener("click", () => {
            this.cycleColors()
        });
        this.structureToggle!.addEventListener("click", () => {
            this.settings.showStructures = !this.settings.showStructures;
            this.redraw();
        });
        this.colorStringToggle!.addEventListener("click", () => {
            this.settings.showColorStrings = !this.settings.showColorStrings;
            this.redraw();
        });
        this.colorToggle!.addEventListener("click", () => {
            this.settings.showColors = !this.settings.showColors;
            this.redraw();
        })
    }

    draw() {
        this.innerBoxes = this.drawBackgroundBoxes(this.settings.boxFractions);
        this.settings.numColorRows = Math.min(Math.floor(this.innerBoxes[0].height / 40), 16);
        this.terrain = this.generateTerrain(this.innerBoxes[1]);
        this.drawPerlinTerrain(this.innerBoxes[1]);
        if(this.settings.showColors) {
            this.drawLeftColors(this.innerBoxes[0], this.settings.colors);
            this.drawRightColors(this.innerBoxes[1], this.settings.colors);
        }
        if(this.settings.showStructures){
            this.drawStructures(this.innerBoxes[1], this.settings.colors);
        }
    }

    generateTerrain(innerBox: innerBox): number[] {
        const width = innerBox.width;
        const height = innerBox.height;
        const size = width*height;
        let terrain: number[] = new Array<number>(size).fill(0);

        for(let x = 0; x < width; x++){
            for(let y = 0; y < height; y++){
                const index = y*width + x;
                terrain[index] = Math.floor(Math.abs(this.settings.perlin.perlin2(x / 50, y / 50)) * 50);
            }
        }
        return terrain;
    }

    redraw() {
        this.drawBackgroundBoxes(this.settings.boxFractions);
        this.drawPerlinTerrain(this.innerBoxes![1]);
        if(this.settings.showColors) {
            this.drawLeftColors(this.innerBoxes![0], this.settings.colors);
            this.drawRightColors(this.innerBoxes![1], this.settings.colors);
        }
        if(this.settings.showStructures){
            this.drawStructures(this.innerBoxes![1], this.settings.colors);
        }
    }

    drawBackgroundBoxes(boxFractions: number[]): innerBox[] {
        const ctx = this.ctx!;

        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        const offset = 0.5;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const spacer = this.settings.spacer;
        const boxHeight = Math.floor(height - 2*spacer);

        let x = 0;
        const size = boxFractions.length;
        let innerBoxes: innerBox[] = [];

        boxFractions.forEach((boxFraction: number) => {
            const xOffset = x + spacer;
            const yOffset = spacer;
            const boxWidth = Math.floor((width - (size+1) * spacer) * boxFraction);

            const fill = colord("#ffffff");
            const stroke = colord("#000000");
            ctx.fillStyle = fill.toString();
            ctx.strokeStyle = stroke.toString();

            ctx.fillRect(xOffset-offset, yOffset-offset, boxWidth, boxHeight);
            ctx.strokeRect(xOffset-offset, yOffset-offset, boxWidth, boxHeight);


            const innerBox = {
                x : xOffset + this.settings.innerSpacer,
                y : yOffset + this.settings.innerSpacer,
                width : Math.floor(boxWidth - 2*this.settings.innerSpacer),
                height : Math.floor(boxHeight - 2*this.settings.innerSpacer),
            };

            innerBoxes.push(innerBox);
            x = xOffset + boxWidth;
        });

        return innerBoxes;
    }

    drawPerlinTerrain(innerBox: innerBox){
        if(!this.ctx) throw new Error("Can't get Canvas Context");
        if(!this.terrain) throw new Error("No Terrain has been generated");
        const width = innerBox.width;
        const height = Math.floor(innerBox.height / this.settings.numColorRows)*this.settings.numColorRows;

        const imageData = this.ctx.getImageData(innerBox.x,innerBox.y, width, height);
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

    cycleColors(): void {
        this.settings.colorIndex += this.settings.numColorRows!;
        this.settings.colorIndex %= this.settings.colors.length;
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
        const heights = Math.floor(innerBox.height / this.settings.numColorRows);
        const widths = Math.floor(innerBox.width / 3);
        const yOffset = innerBox.y - this.settings.offset;
        const xOffset = innerBox.x - this.settings.offset;

        let count = 0;
        for(let i=this.settings.colorIndex; i<this.settings.colorIndex+this.settings.numColorRows; i++) {

            const color = colors[i % this.settings.colors.length];
            const light = this.lighten(color, 0.13).alpha(0.65);
            const medium = this.darken(color, 0.15);

            this.drawRect(xOffset, yOffset + count * heights, widths, heights, color);
            this.drawRect(xOffset + widths, yOffset + count * heights, widths, heights, light);
            this.drawRect(xOffset + 2 * widths, yOffset + count * heights, widths, heights, medium);
            if(this.settings.showColorStrings) {
                this.writeColor(xOffset + widths / 2, yOffset + count * heights + heights / 2, color);
                this.writeColor(xOffset + widths / 2 + widths, yOffset + count * heights + heights / 2, light);
                this.writeColor(xOffset + widths / 2 + 2 * widths, yOffset + count * heights + heights / 2, medium);
            }
            count++;
        }
    }

    drawRightColors(innerBox: innerBox, colors: Colord[]){
        const heights = Math.floor(innerBox.height / this.settings.numColorRows);
        const widths = innerBox.width;
        const yOffset = innerBox.y - this.settings.offset;
        const xOffset = innerBox.x - this.settings.offset;

        let count = 0;
        for(let i= this.settings.colorIndex; i<this.settings.colorIndex+this.settings.numColorRows; i++) {
            const color = colors[i % this.settings.colors.length].alpha(150/255);
            const border = colors[i % this.settings.colors.length].darken(0.125);
            this.drawRect(xOffset, yOffset + count * heights, widths, heights, color, border);
            if(this.settings.showColorStrings) {
                this.writeColor(xOffset+10, yOffset+count*heights + heights/2, color, "start");
            }
            count++;
        }
    }

    drawStructures(innerBox: innerBox, colors: Colord[]){
        const heights = Math.floor(innerBox.height / this.settings.numColorRows);
        const widths = innerBox.width;
        const yOffset = innerBox.y + Math.floor(heights/2);
        const deltaX = Math.floor(widths/this.settings.units.length);
        const xOffset = innerBox.x + Math.floor(deltaX/2);

        let count = 0;
        for(let i= this.settings.colorIndex; i<this.settings.colorIndex+this.settings.numColorRows; i++) {
            const color = colors[i % this.settings.colors.length].alpha(150/255);
            const border = colors[i % this.settings.colors.length].darken(0.125);

            this.settings.units.forEach((unit, j) => {
                const icon = createIcon(color, border, unit);
                const shift = unit==="Port" ?  ICON_SIZE.pentagon/2 : ICON_SIZE.circle/2;
                this.ctx.drawImage(icon, xOffset+deltaX*j-shift, yOffset + heights*count-shift);
            })
            count++;
        }
    }

    writeColor(x:number, y:number, color: Colord | string, alignment: CanvasTextAlign = "center"){
        let text = (color instanceof Colord) ? color.toRgbString() : color;
        text = text.replaceAll(" ", "");
        const ctx = this.ctx;
        if(!ctx) throw new Error("Can't write color");

        let fontsize = 20;

        ctx.font = `${fontsize}px Arial`;
        ctx.fillStyle ="black";
        ctx.textAlign = alignment;
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
        ctx.strokeRect(x, y, width, height);
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