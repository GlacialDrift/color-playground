import {type Colord, extend} from "colord";
import a11yPlugin from "colord/plugins/a11y";
import cityIcon from "../resources/CityIcon.png";
import factoryIcon from "../resources/FactoryUnit.png";
import portIcon from "../resources/AnchorIcon.png";
import siloIcon from "../resources/MissileSiloUnit.png";
import SAMIcon from "../resources/SamLauncherUnit.png";
import defenseIcon from "../resources/ShieldIcon.png";
import {ICON_SIZE, STRUCTURE_SHAPES, type StructureInfo, type UnitType} from "./Utils.ts";

extend([a11yPlugin]);

function makeImage(src: string): HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
}

const structuresInfos: Map<UnitType, StructureInfo> = new Map([
    ["City",        { iconPath: cityIcon, image: makeImage(cityIcon) }],
    ["Factory",     { iconPath: factoryIcon, image: makeImage(factoryIcon) }],
    ["DefensePost", { iconPath: defenseIcon, image: makeImage(defenseIcon) }],
    ["Port",        { iconPath: portIcon, image: makeImage(portIcon) }],
    ["MissileSilo", { iconPath: siloIcon, image: makeImage(siloIcon) }],
    ["SAMLauncher", { iconPath: SAMIcon, image: makeImage(SAMIcon) }],
]);

export function createIcon(
    territoryColor: Colord,
    borderColor: Colord,
    structureType: UnitType,
    renderIcon: boolean = true,
): HTMLCanvasElement[] {
    const structureCanvas = document.createElement("canvas");
    const shape = STRUCTURE_SHAPES[structureType]!;
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
    context.fillStyle = lighter
        .lighten(0.13)
        .alpha(renderIcon ? 0.65 : 1)
        .toRgbString();
    const darken = darker.isLight() ? 0.17 : 0.15;
    border = darker.darken(darken).toRgbString();

    context.strokeStyle = border;
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

    const structureInfo = structuresInfos.get(structureType);

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
            getImageColored(structureInfo.image, border),
            offsetX,
            offsetY,
        );
    }

    return [structureCanvas, structureCanvas, structureCanvas, structureCanvas, structureCanvas];
}

function getImageColored(
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
