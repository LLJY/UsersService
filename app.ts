import * as grpc from "grpc";
import { IUserServer, UserService } from "./protogen/protos/user_grpc_pb";
import {MainService} from "./services/MainService";
import * as path from "path";
const server = new grpc.Server;
// add services here
server.addService<IUserServer>(UserService, new MainService());
// set the port to env if defined, else 8001
let port = process.env.PORT??8001;
let projectName = path.basename(__dirname)
server.bind("localhost:8001", grpc.ServerCredentials.createInsecure());
server.start();
console.log(`${projectName} gRPC server started on localhost:${port} !`)