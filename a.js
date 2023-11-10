function tieneElementosIguales(array) {
  const elementos = new Set();

  for (let i = 0; i < array.length; i++) {
    if (elementos.has(array[i])) {
      return true; // repetido
    }
    elementos.add(array[i]);
  }

  return false; //no repetido
}
//53 alfabeto ---> longitudIds = 6 --> 6^53
function generarArrayIds(longitudArray, longitudIds) {
//Un Set garantiza la unicidad de sus elementos, evitando duplicados.
  const alfabeto = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ids = new Set();

  while (ids.size < longitudArray) {
    let id = '';

    for (let j = 0; j < longitudIds; j++) {
      const indice = Math.floor(Math.random() * alfabeto.length);
      id += alfabeto[indice];
    }

    ids.add(id);
  }

  return Array.from(ids);
}

// Ejemplo de uso:
const longitudArray = 10000000
const longitudIds = 3;

const arrayIds = generarArrayIds(longitudArray, longitudIds);
console.log(arrayIds);
console.log(arrayIds.length)

console.log(tieneElementosIguales(arrayIds)); 
