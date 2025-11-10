import {Colors} from "./Colors.ts";
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
    numColorRows: number;
}

export const DEFAULT_SETTINGS: Settings = {
    spacer: 10,
    colorIndex: 0,
    innerSpacer: 5,
    boxFractions: [0.33, 0.67],
    colors: Colors,
    perlin: new Perlin(Math.random()),
    showColorStrings: true,
    showStructures: false,
    numColorRows: 16,
};



