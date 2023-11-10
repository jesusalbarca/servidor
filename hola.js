// Crear un array vacío
const miArray = [];

// Bucle for para agregar objetos al array
for (let i = 0; i < 10; i++) {
  // Crear un nuevo objeto
  const nuevoObjeto = {
    id: i,
    nombre: `Objeto ${i}`
  };

  // Agregar el objeto al array usando push()
  miArray.push(nuevoObjeto);
}

// Imprimir el array resultante
console.log(miArray);
