import {colord, Colord, type RgbaColor} from "colord";

export function lum(r: number, g: number, b: number): number{
    let a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

export function contrastRatio(color1: Colord | RgbaColor, color2: Colord | RgbaColor): number {
    if(color1 instanceof Colord) color1 = color1.toRgb();
    if(color2 instanceof Colord) color2 = color2.toRgb();

    let lum1 = lum(color1.r, color1.g, color1.b);
    let lum2 = lum(color2.r, color2.g, color2.b);
    let bright = Math.max(lum1, lum2);
    let dark = Math.min(lum1, lum2);
    return (bright + 0.05) / (dark + 0.05);
}

export function clamp(num: number, low:number = 0, high:number = 1): number {
    return Math.min(Math.max(num, low), high);
}

export function rescale(num: number, low: number = 0, high: number = 1): number {
    return (num - low)/ (high - low);
}

export type ShapeType =
    | "triangle"
    | "square"
    | "pentagon"
    | "octagon"
    | "circle";

// @ts-ignore
export type UnitType =
    | "City"
    | "Factory"
    | "DefensePost"
    | "Port"
    | "MissileSilo"
    | "SAMLauncher";

export interface innerBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface StructureInfo {
    iconPath: string;
    image: HTMLImageElement | null;
}

export const STRUCTURE_SHAPES: Partial<Record<UnitType, ShapeType>> = {
    City: "circle",
    Port: "pentagon",
    Factory: "circle",
    DefensePost: "octagon",
    SAMLauncher: "square",
    MissileSilo: "triangle",
};

export const ICON_SIZE = {
    circle: 28,
    octagon: 28,
    pentagon: 30,
    square: 28,
    triangle: 28,
};

export const RED = 0.2126;
export const GREEN = 0.7152;
export const BLUE = 0.0722;
export const GAMMA = 2.4;

export const Colors: Colord[] = [
    colord("rgb(163,230,53)"), // Yellow Green
    colord("rgb(132,204,22)"), // Lime
    colord("rgb(16,185,129)"), // Sea Green
    colord("rgb(52,211,153)"), // Spearmint
    colord("rgb(45,212,191)"), // Turquoise
    colord("rgb(74,222,128)"), // Mint
    colord("rgb(110,231,183)"), // Seafoam
    colord("rgb(134,239,172)"), // Light Green
    colord("rgb(151,255,187)"), // Fresh Mint
    colord("rgb(186,255,201)"), // Pale Emerald
    colord("rgb(230,250,210)"), // Pastel Lime
    colord("rgb(34,197,94)"), // Emerald
    colord("rgb(67,190,84)"), // Fresh Green
    colord("rgb(82,183,136)"), // Jade
    colord("rgb(48,178,180)"), // Teal
    colord("rgb(230,255,250)"), // Mint Whisper
    colord("rgb(220,240,250)"), // Ice Blue
    colord("rgb(233,213,255)"), // Light Lilac
    colord("rgb(204,204,255)"), // Soft Lavender Blue
    colord("rgb(220,220,255)"), // Meringue Blue
    colord("rgb(202,225,255)"), // Baby Blue
    colord("rgb(147,197,253)"), // Powder Blue
    colord("rgb(125,211,252)"), // Crystal Blue
    colord("rgb(99,202,253)"), // Azure
    colord("rgb(56,189,248)"), // Light Blue
    colord("rgb(96,165,250)"), // Sky Blue
    colord("rgb(59,130,246)"), // Royal Blue
    colord("rgb(79,70,229)"), // Indigo
    colord("rgb(124,58,237)"), // Royal Purple
    colord("rgb(147,51,234)"), // Bright Purple
    colord("rgb(179,136,255)"), // Light Purple
    colord("rgb(167,139,250)"), // Periwinkle
    colord("rgb(217,70,239)"), // Fuchsia
    colord("rgb(168,85,247)"), // Vibrant Purple
    colord("rgb(190,92,251)"), // Amethyst
    colord("rgb(192,132,252)"), // Lavender
    colord("rgb(240,171,252)"), // Orchid
    colord("rgb(244,114,182)"),
    colord("rgb(236,72,153)"), // Deep Pink
    colord("rgb(220,38,38)"), // Ruby
    colord("rgb(239,68,68)"), // Crimson
    colord("rgb(235,75,75)"), // Bright Red
    colord("rgb(245,101,101)"), // Coral
    colord("rgb(248,113,113)"), // Warm Red
    colord("rgb(251,113,133)"), // Watermelon
    colord("rgb(253,164,175)"), // Salmon Pink
    colord("rgb(252,165,165)"), // Peach
    colord("rgb(255,204,229)"), // Blush Pink
    colord("rgb(250,215,225)"), // Cotton Candy
    colord("rgb(251,235,245)"), // Rose Powder
    colord("rgb(240,240,200)"), // Light Khaki
    colord("rgb(250,250,210)"), // Pastel Lemon
    colord("rgb(255,240,200)"), // Vanilla
    colord("rgb(255,223,186)"), // Apricot Cream
    colord("rgb(252,211,77)"), // Golden
    colord("rgb(251,191,36)"), // Marigold
    colord("rgb(234,179,8)"), // Sunflower
    colord("rgb(202,138,4)"), // Rich Gold
    colord("rgb(245,158,11)"), // Amber
    colord("rgb(251,146,60)"), // Light Orange
    colord("rgb(249,115,22)"), // Tangerine
    colord("rgb(234,88,12)"), // Burnt Orange
    colord("rgb(133,77,14)"), // Chocolate

    colord("rgb(210,210,100)"), // Lime Yellow
    colord("rgb(180,210,120)"), // Light Green
    colord("rgb(170,190,100)"), // Yellow Green
    colord("rgb(80,200,120)"), // Emerald Green
    colord("rgb(130,200,130)"), // Light Sea Green
    colord("rgb(140,180,140)"), // Dark Sea Green
    colord("rgb(160,190,160)"), // Pale Green
    colord("rgb(160,180,140)"), // Dark Olive Green
    colord("rgb(100,160,80)"), // Olive Green
    colord("rgb(100,140,110)"), // Sea Green
    colord("rgb(100,180,160)"), // Aquamarine
    colord("rgb(130,180,170)"), // Medium Aquamarine
    colord("rgb(170,190,180)"), // Pale Blue Green
    colord("rgb(100,130,150)"), // Steel Blue
    colord("rgb(120,160,200)"), // Cornflower Blue
    colord("rgb(140,150,180)"), // Light Slate Gray
    colord("rgb(100,210,210)"), // Turquoise
    colord("rgb(140,180,220)"), // Light Blue
    colord("rgb(130,170,190)"), // Cadet Blue
    colord("rgb(100,180,230)"), // Sky Blue
    colord("rgb(80,130,190)"), // Navy Blue
    colord("rgb(120,120,190)"), // Periwinkle
    colord("rgb(150,110,190)"), // Lavender
    colord("rgb(160,120,160)"), // Purple Gray
    colord("rgb(170,140,190)"), // Medium Purple
    colord("rgb(180,130,180)"), // Plum
    colord("rgb(190,140,150)"), // Puce
    colord("rgb(180,100,230)"), // Purple
    colord("rgb(180,160,180)"), // Mauve
    colord("rgb(170,150,170)"), // Dusty Rose
    colord("rgb(150,130,150)"), // Thistle
    colord("rgb(230,180,180)"), // Light Pink
    colord("rgb(210,160,200)"), // Orchid
    colord("rgb(230,130,180)"), // Pink
    colord("rgb(210,100,160)"), // Hot Pink
    colord("rgb(190,100,130)"), // Maroon
    colord("rgb(220,120,120)"), // Coral
    colord("rgb(200,130,110)"), // Dark Salmon
    colord("rgb(230,140,140)"), // Salmon
    colord("rgb(230,100,100)"), // Bright Red
    colord("rgb(230,150,100)"), // Peach
    colord("rgb(210,140,80)"), // Light Orange
    colord("rgb(230,180,80)"), // Golden Yellow
    colord("rgb(200,160,110)"), // Tan
    colord("rgb(190,150,130)"), // Rosy Brown
    colord("rgb(190,180,160)"), // Tan Gray
    colord("rgb(180,170,140)"), // Dark Khaki
    colord("rgb(200,200,140)"), // Khaki
    colord("rgb(190,170,100)"), // Sand


    colord("rgb(150,160,140)"), // Muted Dark Olive Green
    colord("rgb(160,160,150)"), // Muted Tan Gray
    colord("rgb(170,170,140)"), // Muted Khaki
    colord("rgb(170,170,120)"), // Muted Lime Yellow
    colord("rgb(150,160,120)"), // Muted Yellow Green
    colord("rgb(150,170,130)"), // Muted Light Green
    colord("rgb(150,170,150)"), // Muted Pale Green
    colord("rgb(130,170,130)"), // Muted Light Sea Green
    colord("rgb(140,160,140)"), // Muted Dark Sea Green
    colord("rgb(120,150,100)"), // Muted Olive Green
    colord("rgb(120,140,120)"), // Muted Sea Green
    colord("rgb(100,170,130)"), // Muted Emerald Green
    colord("rgb(120,160,150)"), // Muted Aquamarine
    colord("rgb(130,160,150)"), // Muted Medium Aquamarine
    colord("rgb(120,170,170)"), // Muted Turquoise
    colord("rgb(120,160,190)"), // Muted Sky Blue
    colord("rgb(130,150,170)"), // Muted Cornflower Blue
    colord("rgb(130,150,160)"), // Muted Cadet Blue
    colord("rgb(140,150,160)"), // Muted Light Slate Gray
    colord("rgb(140,160,170)"), // Muted Light Blue
    colord("rgb(150,160,160)"), // Muted Pale Blue Green
    colord("rgb(100,120,160)"), // Muted Navy Blue
    colord("rgb(120,130,140)"), // Muted Steel Blue
    colord("rgb(130,130,160)"), // Muted Periwinkle
    colord("rgb(140,130,140)"), // Muted Thistle
    colord("rgb(140,120,160)"), // Muted Lavender
    colord("rgb(150,130,150)"), // Muted Purple Gray
    colord("rgb(150,140,160)"), // Muted Medium Purple
    colord("rgb(160,130,160)"), // Muted Plum
    colord("rgb(170,150,170)"), // Muted Orchid
    colord("rgb(160,120,190)"), // Muted Purple
    colord("rgb(160,120,130)"), // Muted Maroon
    colord("rgb(170,120,140)"), // Muted Hot Pink
    colord("rgb(170,130,120)"), // Muted Dark Salmon
    colord("rgb(170,130,130)"), // Muted Coral
    colord("rgb(180,140,140)"), // Muted Salmon
    colord("rgb(190,130,160)"), // Muted Pink
    colord("rgb(190,120,120)"), // Muted Red
    colord("rgb(190,140,120)"), // Muted Peach
    colord("rgb(190,160,100)"), // Muted Golden Yellow
    colord("rgb(170,140,100)"), // Muted Light Orange
    colord("rgb(160,140,130)"), // Muted Rosy Brown
    colord("rgb(170,150,130)"), // Muted Tan
    colord("rgb(160,150,120)"), // Muted Sand
    colord("rgb(160,150,140)"), // Muted Dark Khaki
    colord("rgb(160,140,150)"), // Muted Puce
    colord("rgb(160,150,160)"), // Muted Mauve
    colord("rgb(150,140,150)"), // Muted Dusty Rose
    colord("rgb(180,160,160)"), // Muted Light Pink
];