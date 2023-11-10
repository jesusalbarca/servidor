import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from 'http'
import cors from 'cors'

import {PORT} from './config.js'
import axios from 'axios';

// Función para obtener información del token
const obtenerInfoToken = async (idToken) => {
  try {
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener información del token');
  }
}



const app = express();
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors:{
        origin: 'http://localhost:3000'
    }
})

app.get('/', (req, res) => {
    res.send("Hola")
})  

app.use(cors())
app.use(morgan('dev'))

var users = new Map ();
var usuario;
io.on('connection' , (socket) =>{
    console.log("nuevo cliente socket")


    //Recibir mensajes de los usuarios
    socket.on('mensaje', (mensaje) => {
      console.log(users)
      usuario =  users.get(socket.id).name
      console.log(socket.id)
      console.log(usuario)
      console.log(mensaje)
        //Enviar mensaje a todos los usuarios conectados menos a al usuario
        socket.broadcast.emit('mensaje',{
            body: mensaje, 
			      mio:false,
            user: usuario  //user[socket.id].name//socket.id
        } );
    });

    //Registrar usuario
    socket.on('nuevo_usuario', (data) => {
     //   console.log(data)
    //    console.log(data.credential == null);
        //Si usuario registrado por google
        if(data.credential != null){
          var data_decode = obtenerInfoToken(data.credential)
          data_decode.then(resultado => {
          //  console.log(resultado); // Imprime el valor resuelto de la promesa
            resultado.isGoogle = true;
            users.set(socket.id, resultado);
            //enviamos al usuario  sus datos
            socket.emit('usuario_info', resultado)
            //enviamos la info a los demás usuarios para que vean que ha entrado al chat
            socket.broadcast.emit('BienvenidoUser', resultado)

          }).catch(error => {
              console.error(error); // Imprime el error en caso de que la promesa sea rechazada
          });
        }else{
          data.isGoogle = false;
          users.set(socket.id, data);
          //enviamos al usuario  sus datos
          socket.emit('usuario_info', data)
          //enviamos la info a los demás usuarios para que vean que ha entrado al chat
          socket.broadcast.emit('BienvenidoUser', data)

        }
        //a veces cuando se loguea un usuario con google la promesa que desencripta el token tarda un poco
        setTimeout(function() {
          console.log(users)
          //socket no envia objetos MAP, sino JSON
          var usersJSON = JSON.stringify(Array.from(users.entries()));
          console.log(usersJSON)
          io.emit('usuariosJSON', usersJSON);
        }, 700);
        
    });
    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
      }
      console.log("desconectado: " + socket.id)
	  //lo guardo antes de eliminarlo para informar el nombre
		let usuarioEliminado = users.get(socket.id);

	  if (users.has(socket.id)) {
			users.delete(socket.id);
			  console.log(users)
			  //socket no envia objetos MAP, sino JSON
			  var usersJSON = JSON.stringify(Array.from(users.entries()));
			  console.log(usersJSON)
			  io.emit('usuariosJSON', usersJSON);
			  io.emit('AdiosUser',usuarioEliminado)
	  } 
    
	
	
	});

})


server.listen(PORT)
console.log('Server iniciado en puerto: ', PORT)