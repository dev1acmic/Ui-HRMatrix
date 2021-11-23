/*
Initialize feathers client
 */
import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import authentication from "@feathersjs/authentication-client";
import AuthManagement from "feathers-authentication-management/lib/client";

const client = feathers();
//this is the server url
const socket = io(process.env.REACT_APP_API_BASE_URL);

client.configure(socketio(socket, { timeout: 15000 }));
client.configure(
  authentication({
    storage: window.localStorage,
  })
);

const authManagement = new AuthManagement(client);
client.authManagement = authManagement;

export default client;
