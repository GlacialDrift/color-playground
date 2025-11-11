import {Colors, type UnitType} from "./Utils.ts";
import Perlin from "./perlin.ts";
import type {Colord} from "colord";

export interface Settings{
    spacer: number;
    colorIndex: number;
    innerSpacer: number;
    boxFractions: number[];
    colors: Colord[];
    perlin: Perlin;
    showColorStrings: boolean;
    showStructures: boolean;
    showColors: boolean;
    numColorRows: number;
    canvasHeight: number;
    canvasWidth: number;
    offset: number;
    units: UnitType[];
}

export const DEFAULT_SETTINGS: Settings = {
    spacer: 10,
    colorIndex: 0,
    innerSpacer: 5,
    boxFractions: [0.25, 0.75],
    colors: Colors,
    perlin: new Perlin(Math.random()),
    showColorStrings: false,
    showStructures: false,
    showColors: true,
    numColorRows: 16,
    canvasHeight: 0,
    canvasWidth: 0,
    offset: 0.5,
    units: ["City", "Factory", "Port", "DefensePost", "MissileSilo", "SAMLauncher"],
};



