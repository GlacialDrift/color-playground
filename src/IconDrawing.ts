import {type Colord, extend} from "colord";
import a11yPlugin from "colord/plugins/a11y";
import cityIcon from "../resources/CityIcon.png";
import factoryIcon from "../resources/FactoryUnit.png";
import portIcon from "../resources/AnchorIcon.png";
import siloIcon from "../resources/MissileSiloUnit.png";
import SAMIcon from "../resources/SamLauncherUnit.png";
import defenseIcon from "../resources/ShieldIcon.png";
import {ICON_SIZE, STRUCTURE_SHAPES, type StructureInfo, type UnitType} from "./Utils.ts";
import {StandardGraphic} from "./Graphic.ts";

extend([a11yPlugin]);

export class IconDraw {
    static makeImage(src: string): HTMLImageElement {
        const img = new Image();
        img.src = src;
        return img;
    }

    static structuresInfos: Map<UnitType, StructureInfo> = new Map([
        ["City",        { iconPath: cityIcon, image: IconDraw.makeImage(cityIcon) }],
        ["Factory",     { iconPath: factoryIcon, image: IconDraw.makeImage(factoryIcon) }],
        ["DefensePost", { iconPath: defenseIcon, image: IconDraw.makeImage(defenseIcon) }],
        ["Port",        { iconPath: portIcon, image: IconDraw.makeImage(portIcon) }],
        ["MissileSilo", { iconPath: siloIcon, image: IconDraw.makeImage(siloIcon) }],
        ["SAMLauncher", { iconPath: SAMIcon, image: IconDraw.makeImage(SAMIcon) }],
    ]);

    static createIcons(
        territoryColor: Colord,
        borderColor: Colord,
        structure: UnitType,
        graphics: string[],
        renderIcon: boolean = true
    ): HTMLCanvasElement[] {

        const iconList: HTMLCanvasElement[] = [];
        graphics.forEach((graphic) => {
            iconList.push(IconDraw.createIcon(territoryColor, borderColor, structure, renderIcon, graphic))
        });

        return iconList;
    }

    static createIcon(
        territoryColor: Colord,
        borderColor: Colord,
        structure: UnitType,
        renderIcon: boolean = true,
        graphic: string = "standard"
    ): HTMLCanvasElement {
        const structureCanvas = document.createElement("canvas");
        const shape = STRUCTURE_SHAPES[structure]!;
        let iconSize = ICON_SIZE[shape];
        if (!renderIcon) {
            iconSize /= 2.5;
        }
        structureCanvas.width = Math.ceil(iconSize);
        structureCanvas.height = Math.ceil(iconSize);
        const context = structureCanvas.getContext("2d")!;

        const tc = territoryColor;
        const bc = borderColor;

        // Potentially change logic here. Some TC/BC combinations do not provide good color contrast.
        const darker = bc.luminance() < tc.luminance() ? bc : tc;
        const lighter = bc.luminance() < tc.luminance() ? tc : bc;
        let border: string;

        console.log(graphic);

        switch(graphic){
            case "standard":
                context.fillStyle = StandardGraphic.fillStyle(lighter, darker)
                border = StandardGraphic.border(lighter, darker)
                context.strokeStyle = StandardGraphic.strokeStyle(lighter, darker);
                break;
            default:
                throw new Error(`Unsupported graphic type "${graphic}"`);
        }



        context.lineWidth = 1;
        const halfIconSize = iconSize / 2;

        switch (shape) {
            case "triangle":
                context.beginPath();
                context.moveTo(halfIconSize, 1); // Top
                context.lineTo(iconSize - 1, iconSize - 1); // Bottom right
                context.lineTo(0, iconSize - 1); // Bottom left
                context.closePath();
                context.fill();
                context.stroke();
                break;

            case "square":
                context.fillRect(1, 1, iconSize - 2, iconSize - 2);
                context.strokeRect(1, 1, iconSize - 3, iconSize - 3);
                break;

            case "octagon":
            {
                const cx = halfIconSize;
                const cy = halfIconSize;
                const r = halfIconSize - 1;
                const step = (Math.PI * 2) / 8;

                context.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = step * i - Math.PI / 8; // slight rotation for flat top
                    const x = cx + r * Math.cos(angle);
                    const y = cy + r * Math.sin(angle);
                    if (i === 0) {
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                    }
                }
                context.closePath();
                context.fill();
                context.stroke();
            }
                break;
            case "pentagon":
            {
                const cx = halfIconSize;
                const cy = halfIconSize;
                const r = halfIconSize - 1;
                const step = (Math.PI * 2) / 5;

                context.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = step * i - Math.PI / 2; // rotate to have flat base or point up
                    const x = cx + r * Math.cos(angle);
                    const y = cy + r * Math.sin(angle);
                    if (i === 0) {
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                    }
                }
                context.closePath();
                context.fill();
                context.stroke();
            }
                break;
            case "circle":
                context.beginPath();
                context.arc(
                    halfIconSize,
                    halfIconSize,
                    halfIconSize - 1,
                    0,
                    Math.PI * 2,
                );
                context.fill();
                context.stroke();
                break;

            default:
                throw new Error(`Unknown shape: ${shape}`);
        }

        const structureInfo = IconDraw.structuresInfos.get(structure);

        if (structureInfo?.image && renderIcon) {
            const SHAPE_OFFSETS = {
                triangle: [6, 11],
                square: [5, 5],
                octagon: [6, 6],
                pentagon: [7, 7],
                circle: [6, 6],
            };
            const [offsetX, offsetY] = SHAPE_OFFSETS[shape] || [0, 0];
            context.drawImage(
                IconDraw.getImageColored(structureInfo.image, border ?? "rgb(255,255,255)"),
                offsetX,
                offsetY,
            );
        }

        return structureCanvas;
    }

    static getImageColored(
        image: HTMLImageElement,
        color: string,
    ): HTMLCanvasElement {
        const imageCanvas = document.createElement("canvas");
        imageCanvas.width = image.width;
        imageCanvas.height = image.height;
        const ctx = imageCanvas.getContext("2d")!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(image, 0, 0);
        return imageCanvas;
    }
}


