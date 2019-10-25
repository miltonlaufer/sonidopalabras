class sonidoSimilar {
    anagrama = false;
    incluida = false;
    identica = false;
    similar = 0;
    similarSonido = 0;
    settings = {
        argentino: true,
        latino: true,
        similares: true
    };

    constructor() {

    }
    comparar(palabra1, palabra2, soloSonido = false) {
        palabra1 = palabra1.toLowerCase();
        palabra2 = palabra2.toLowerCase();
        if (palabra1 === palabra2) {
            this.identica = true;
        } else {
            this.identica = false;
        }
        if (palabra1.length > palabra2.length) {
            this.incluida = palabra1.indexOf(palabra2) !== -1;
        } else {
            this.incluida = palabra2.indexOf(palabra1) !== -1;
        }

        if (!soloSonido) {
            this.similar = this.checkLetras(palabra1, palabra2);
            if (this.similar === 1) {
                this.anagrama = true;
            } else {
                this.anagrama = false;
            }
        }
        let palabra1sonido = this.convertirSonido(palabra1);
        let palabra2sonido = this.convertirSonido(palabra2);
        this.similarSonido = this.checkSonido(palabra1sonido, palabra2sonido);

        return this;
    }

    convertirSonido(palabra) {
        let palabraSonido = palabra;
        palabraSonido = this.replaceBulk(palabraSonido, "áéíóú".split(''), "AEIOU".split(''));
        palabraSonido = palabraSonido.replace(/ch/g, 'Y');
        palabraSonido = palabraSonido.replace(/(g)([eiéí])/gi, 'j$2');
        palabraSonido = palabraSonido.replace(/(^r|rr)/g, 'R');
        palabraSonido = palabraSonido.replace(/([lnsz])(r)/g, '$1R');
        palabraSonido = palabraSonido.replace(/([aeiou])(y)/gi, '$1i');
        palabraSonido = palabraSonido.replace(/([bcdfgjklmnpqrstvwz])(y)/g, '$1i');
        if (this.settings.argentino) {
            palabraSonido = palabraSonido.replace(/ll/g, 'y');
        }
        palabraSonido = palabraSonido.replace(/h/g, '');

        palabraSonido = palabraSonido.replace(/(cs|cc)/g, 'x');


        if (this.settings.latino) {
            palabraSonido = palabraSonido.replace(/(c)([eiéí])/gi, 's$2');
            palabraSonido = palabraSonido.replace(/z/g, 's');
            palabraSonido = palabraSonido.replace(/v/g, 'b');
        } else {
            palabraSonido = palabraSonido.replace(/(c)([eiéí])/gi, 'z$2');
            palabraSonido = palabraSonido.replace(/v/g, 'B');
        }
        palabraSonido = palabraSonido.replace(/(qu|c)/g, 'k');
        palabraSonido = palabraSonido.replace(/gü/g, 'G');
        palabraSonido = palabraSonido.replace(/(ss)/g, 's');

        if (this.settings.similares) {
            palabraSonido = palabraSonido.replace(/w/g, 'u');
            palabraSonido = palabraSonido.replace(/ñ/g, 'ni');
        }
        return palabraSonido;
    }

    contarLetras(palabra, normalizar = false) {
        let letrasPalabra = [];
        palabra = normalizar ? this.replaceBulk(palabra, "áéíóú".split(''), "AEIOU".split('')) : palabra;

        for (let z = 0; z < palabra.length; z++) {
            let char = palabra[z];
            letrasPalabra[char] = typeof letrasPalabra[char] === 'undefined' ? 1 : letrasPalabra[char] + 1;
        }

        return letrasPalabra;
    }

    replaceBulk(str, findArray, replaceArray) {
        var i, regex = [],
            map = {};
        for (i = 0; i < findArray.length; i++) {
            regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'));
            map[findArray[i]] = replaceArray[i];
        }
        regex = regex.join('|');
        str = str.replace(new RegExp(regex, 'g'), function(matched) {
            return map[matched];
        });
        return str;
    }

    checkLetras(palabra1, palabra2) {
        let letrasPalabra1 = this.contarLetras(palabra1);
        let letrasPalabra2 = this.contarLetras(palabra2);
        let masCorta = Object.keys(letrasPalabra1).length > Object.keys(letrasPalabra2).length ? letrasPalabra1 : letrasPalabra2;
        let lengthPalabra = Math.max(Object.keys(letrasPalabra1).length, Object.keys(letrasPalabra2).length);
        let similar = 0;
        for (let letra in masCorta) {
            if (letrasPalabra1[letra] && letrasPalabra2[letra]) {
                similar += Math.min(letrasPalabra1[letra], letrasPalabra2[letra]) / Math.max(letrasPalabra1[letra], letrasPalabra2[letra]);
            }
        }

        return similar / lengthPalabra;
    }

    checkSonido(palabra1, palabra2) {
        let similar = 0;
        let oSeparador = new Separador();
        let palabraCorta, palabraLarga;
        let silabas1 = oSeparador.separar(palabra1);
        let silabas2 = oSeparador.separar(palabra2);
        let silabasCorta, silabasLarga;
        [silabasCorta, silabasLarga] = silabas1.length > silabas2.length ? [silabas2, silabas1] : [silabas1, silabas2];

        for (let indexCorta in silabasCorta) {
            let similitudes = [];
            let silabaCorta = silabasCorta[indexCorta];
            for (let indexLarga in silabasLarga) {
                let simil = 0;
                let silabaLarga = silabasLarga[indexLarga];

                if (silabaCorta === silabaLarga) {
                    simil += 1;
                } else if (silabaCorta.toLowerCase() === silabaLarga.toLowerCase()) {
                    simil += 2 / 3;
                } else {
                    let subSimilar = 0;
                    let largoSilaba = Math.max(silabaCorta.length, silabaLarga.length);
                    let masCorta, masLarga = "";
                    [masCorta, masLarga] = silabaCorta.length > silabaLarga.length ? [silabaLarga, silabaCorta] : [silabaCorta, silabaLarga];
                    let pedazo = masCorta.length;
                    let cont = 0;
                    while (pedazo) {
                        subSimilar = 0;
                        cont++;
                        for (let z = 0; z <= masCorta.length - pedazo; z++) {
                            let car = masCorta.substr(z, pedazo);
                            let parecida = 1;
                            let index = masLarga.indexOf(car);
                            if (index === -1) {
                                index = masLarga.toLowerCase().indexOf(car.toLowerCase());
                                parecida = 0.5;
                                if (index === -1) {
                                    continue;
                                }
                            }
                            let diferencia;
                            console.log(masCorta, masLarga, car, masCorta.length - pedazo - z, masLarga.length - index - pedazo)
                            if (z === index || masCorta.length - pedazo - z === masLarga.length - index - pedazo) {
                                diferencia = 1 / (largoSilaba - pedazo + 1);
                            } else {
                                diferencia = (1 / ((largoSilaba - pedazo + 1) * cont));
                            }
                            subSimilar += 1 * parecida * diferencia;
                        }
                        console.log(subSimilar);
                        pedazo--;
                        if (subSimilar === 1) {
                            break;
                        }
                    }
                    simil += subSimilar;
                }
                console.log(silabaCorta, silabaLarga, simil);
                similitudes.push(simil);
                if (simil === 1) {
                    // Si ya hay una con el máximo, detener el loop
                    break;
                }
            }
            similar += Math.max(...similitudes);

        }
        console.log(similar / (silabasCorta.length));
        return similar / (silabasCorta.length);
    }
}

class Separador {
    abiertas = ['a', 'e', 'A', 'E', 'I', 'O', 'o', 'U'];
    cerradas = ['i', 'u', 'ü'];
    diptongos = [];
    triptongos = [];

    constructor() {
        for (let keyAbierta in this.abiertas) {
            for (let keyCerrada in this.cerradas) {
                let abierta = this.abiertas[keyAbierta];
                let cerrada = this.cerradas[keyCerrada];

                this.diptongos.push(`${abierta}${cerrada}`);
                this.diptongos.push(`${cerrada}${abierta}`);
                this.diptongos.push(`${abierta}h${cerrada}`);
                this.diptongos.push(`${cerrada}h${abierta}`);
            }
        }
        for (let keyCerrada1 in this.cerradas) {
            for (let keyCerrada2 in this.cerradas) {
                let cerrada1 = this.cerradas[keyCerrada1];
                let cerrada2 = this.cerradas[keyCerrada2];
                this.diptongos.push(`${cerrada1}${cerrada2}`);
                this.diptongos.push(`${cerrada1}h${cerrada2}`);
            }
        }

        for (let keyCerrada1 in this.cerradas) {
            for (let keyAbierta in this.abiertas) {
                for (let keyCerrada2 in this.cerradas) {
                    let cerrada1 = this.cerradas[keyCerrada1];
                    let cerrada2 = this.cerradas[keyCerrada2];
                    let abierta = this.abiertas[keyAbierta];
                    this.triptongos.push(`${cerrada1}${abierta}${cerrada2}`);
                    this.triptongos.push(`${cerrada1}${abierta}h${cerrada2}`);
                    this.triptongos.push(`${cerrada1}h${abierta}${cerrada2}`);
                }
            }
        }
    }



    hayDiptongo(chr) {
        return this.diptongos.includes(chr);
    }
    hayTriptongo() {
        return this.triptongos.includes(chr);
    }
    esVocal(chr) {
        if (this.abiertas.includes(chr)) {
            return 1;
        }
        if (this.cerradas.includes(chr)) {
            return 2;
        }
        return false;
    }
    gruposConsonanticos(chr) {
        let grupos = 'pr, pl, fr, tr, dr, cr, cl, kr, kl, gr, gl, rr, ll, qu, ch, br, bl, qu'.split(', ');
        return grupos.includes(chr);
    }

    separar(k) {
        let buffer = '';
        let palabra = [];
        for (let z = 0; z < k.length; z++) {
            let chr = k[z];
            let chra = z > 0 ? k[z - 1] : null;
            let chraa = z > 1 ? k[z - 2] : null;
            let chrs = z < (k.length - 1) ? k[z + 1] : null;
            let chrss = z < (k.length - 2) ? k[z + 2] : null;
            if (!this.esVocal(chr) && !this.esVocal(chra) && chra) {
                if (!this.gruposConsonanticos(chra + chr) && this.esVocal(chrs) && chrs) {
                    palabra.push(buffer);
                    buffer = '';
                } else if (this.gruposConsonanticos(chr + chrs) && !this.esVocal(chrs) && (chrs)) {
                    palabra.push(buffer);
                    buffer = '';
                }
            } else if (this.esVocal(chr) && this.esVocal(chra) && chra && !this.hayDiptongo(chra + chr)) {
                palabra.push(buffer);
                buffer = '';
            } else if (chr === 'h' && this.esVocal(chra) && chra && this.esVocal(chrs) && chrs) {
                if (!this.hayDiptongo(chra + chrs)) {
                    palabra.push(buffer);
                    buffer = '';
                }
            } else if (this.esVocal(chra) && this.esVocal(chraa) && this.esVocal(chrs) && chr === 'h' && chra && chraa && chrs) {
                if (!this.hayTriptongo(chraa + chra + chrs)) {
                    palabra.push(buffer);
                    buffer = '';
                }
            } else if (this.esVocal(chra) && this.esVocal(chrss) && this.esVocal(chrs) && chr === 'h' && chra && chrss && chrs) {
                if (!this.hayTriptongo(chra + chrs + chrss)) {
                    palabra.push(buffer);
                    buffer = '';
                }
            } else if (this.esVocal(chr) && this.esVocal(chra) && chra && !this.hayDiptongo(chra + chr)) {
                palabra.push(buffer);
                buffer = '';
            } else if (this.esVocal(chra) && !this.esVocal(chr) && chra && chrs && this.esVocal(chrs)) {
                palabra.push(buffer);
                buffer = '';
            } else if (!this.esVocal(chr) && !this.esVocal(chrs) && chrs && this.gruposConsonanticos(chr + chrs) && chra) {
                palabra.push(buffer);
                buffer = '';
            }
            buffer += chr;
        }
        if (buffer.length) {
            palabra.push(buffer);
        }
        return palabra;
    }
}
