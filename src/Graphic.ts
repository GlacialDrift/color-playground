import type {Colord} from "colord";

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
        return StandardGraphic.strokeStyle(light, dark);
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