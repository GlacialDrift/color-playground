import {clamp, contrastRatio} from "./Utils.ts";
import {colord, type Colord, extend} from "colord";
import labPlugin from "colord/plugins/lab";

extend([labPlugin]);


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





export class LABGraphic implements Graphic {
    static fillStyle(light: Colord, dark: Colord) {
        let delta = light.delta(dark.toHex());
        let lightLAB = light.toLab();
        let darkLAB = dark.toLab();

        while(delta < 0.5){
            lightLAB.l = clamp(lightLAB.l + 0.5, 0 ,100);
            darkLAB.l = clamp(darkLAB.l - 0.5, 0, 100);
            delta = colord(lightLAB).delta(colord(darkLAB).toHex());
        }

        return colord(lightLAB).toRgbString();
    }

    static strokeStyle(light: Colord, dark: Colord){
        let delta = light.delta(dark.toHex());
        let lightLAB = light.toLab();
        let darkLAB = dark.toLab();

        while(delta < 0.5){
            lightLAB.l = clamp(lightLAB.l + 0.5, 0 ,100);
            darkLAB.l = clamp(darkLAB.l - 0.5, 0, 100);
            delta = colord(lightLAB).delta(colord(darkLAB).toHex());
        }

        return colord(darkLAB).toRgbString();
    }

    static border(light: Colord, dark: Colord) {
        let delta = colord(light.toHex()).delta(dark.toHex());
        while(delta < 0.5){
            light.lighten(0.1);
            dark.darken(0.1);
            delta = colord(light.toHex()).delta(dark.toHex());
        }

        return dark.toRgbString();
    }

    static buildColors(light: Colord, dark: Colord): [string, string] {
        let delta = light.delta(dark.toHex());
        let lightLAB = colord(light.alpha(150/255).toHex()).toLab();
        let darkLAB = dark.toLab();
        let darker: Colord | null = null;
        let l: Colord = colord(lightLAB);
        const limit = 10;
        const target = 0.5;

        let count = 0;
        while(delta < target){
            if (count <= limit) {
                darkLAB.l = clamp(darkLAB.l - 5, 0, 100);
            } else if(count > limit && count <= limit*2){
                if(count === limit+1) darker = colord(darkLAB);
                darker = darker!.darken(0.05);
            } else {
                lightLAB.l = clamp(lightLAB.l + 5, 0, 100);
            }
            l = colord(lightLAB);
            darker = (darker) ? darker : colord(darkLAB);
            delta = l.delta(darker.toHex());
            if(delta >= target) break;
            count++;
            if (count > 500){
                throw new Error("infinite loop.");
            }
            if(count <= limit) darker = null;
        }
        return [l!.toRgbString(), (darker) ? darker.toRgbString() : colord(darkLAB).toRgbString()];
    }

    fillStyleInst(light: Colord, dark: Colord): string {
        return LABGraphic.fillStyle(light, dark);
    }

    strokeStyleInst(light: Colord, dark: Colord): string {
        return LABGraphic.strokeStyle(light,dark );
    }

    borderInst(light: Colord, dark: Colord): string {
        return LABGraphic.border(light, dark);
    }
}