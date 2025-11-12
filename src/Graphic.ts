import type {Colord} from "colord";
import {contrastRatio} from "./Utils.ts";




interface Graphic {
    fillStyleInst(light: Colord, dark: Colord): string;
    strokeStyleInst(light: Colord, dark: Colord): string;
    borderInst(light: Colord, dark: Colord): string;
}




export class StandardGraphic implements Graphic {
    static fillStyle(light: Colord, dark: Colord) {
        return light
            .lighten(0.13)
            .alpha(0.65)
            .toRgbString();
    }

    static strokeStyle(light: Colord, dark: Colord){
        const darken = dark.isLight() ? 0.17 : 0.15;
        return dark
            .darken(darken)
            .toRgbString();
    }

    static border(light: Colord, dark: Colord) {
        return StandardGraphic.strokeStyle(light, dark);
    }

    static buildColors(light: Colord, dark: Colord): [string, string] {
        const lighter = light.lighten(0.13).alpha(0.65).toRgbString();
        const darker = StandardGraphic.strokeStyle(light, dark);
        return [lighter, darker];
    }

    fillStyleInst(light: Colord, dark: Colord): string {
        return StandardGraphic.fillStyle(light, dark);
    }

    strokeStyleInst(light: Colord, dark: Colord): string {
        return StandardGraphic.strokeStyle(light,dark );
    }

    borderInst(light: Colord, dark: Colord): string {
        return StandardGraphic.border(light, dark);
    }
}





export class DarkGraphic implements Graphic {
    static fillStyle(light: Colord, dark: Colord) {
        return dark
            .darken(0.125)
            .alpha(0.65)
            .toRgbString();
    }

    static strokeStyle(light: Colord, dark: Colord){
        const darken = dark.isLight() ? 0.25 : 0.30;
        return dark
            .darken(darken)
            .toRgbString();
    }

    static border(light: Colord, dark: Colord) {
        return DarkGraphic.strokeStyle(light, dark);
    }

    static buildColors(light: Colord, dark: Colord): [string, string]{
        const lighter = dark.darken(0.125).alpha(0.65).toRgbString();
        const darker = dark.darken(dark.isLight() ? 0.25 : 0.30).toRgbString();
        return [lighter,darker];
    }

    fillStyleInst(light: Colord, dark: Colord): string {
        return DarkGraphic.fillStyle(light, dark);
    }

    strokeStyleInst(light: Colord, dark: Colord): string {
        return DarkGraphic.strokeStyle(light,dark );
    }

    borderInst(light: Colord, dark: Colord): string {
        return DarkGraphic.border(light, dark);
    }
}





export class ContrastGraphic implements Graphic {
    static fillStyle(light: Colord, dark: Colord) {
        return dark
            .darken(0.125)
            .alpha(0.65)
            .toRgbString();
    }

    static strokeStyle(light: Colord, dark: Colord){
        const darken = dark.isLight() ? 0.25 : 0.30;
        return dark
            .darken(darken)
            .toRgbString();
    }

    static border(light: Colord, dark: Colord) {
        return ContrastGraphic.strokeStyle(light, dark);
    }

    static buildColors(light: Colord, dark: Colord): [string, string] {
        const contrastLD = contrastRatio(light.alpha(1), dark.alpha(1));
        const lighter = light.alpha(1).lighten(0.25);
        const darker = dark.alpha(1).darken(0.25);

        const contrastLL = contrastRatio(lighter, light);
        const contrastDD = contrastRatio(darker, dark);

        const l1 = lighter.toRgbString();
        const l2 = light.toRgbString();
        const l3 = dark.toRgbString();
        const l4 = darker.toRgbString();

        console.log(`Contrast:\nl1: ${l1} \nl2: ${l2} \nl3: ${l3} \nl4: ${l4}`);

        if(contrastLD > 7.5) return [l2, l3];
        else if(contrastDD > 7.5) return [l3, l4];
        else if(contrastLL > 7.5) return [l1, l2];
        else return [l1, l4];
    }

    fillStyleInst(light: Colord, dark: Colord): string {
        return ContrastGraphic.fillStyle(light, dark);
    }

    strokeStyleInst(light: Colord, dark: Colord): string {
        return ContrastGraphic.strokeStyle(light,dark );
    }

    borderInst(light: Colord, dark: Colord): string {
        return ContrastGraphic.border(light, dark);
    }
}