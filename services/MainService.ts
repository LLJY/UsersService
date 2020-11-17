import { handleUnaryCall } from "grpc";
import { IUserServer } from "../protogen/protos/user_grpc_pb";
import { GetUserInfoRequest, GetUserInfoResponse, UpdateProfileRequest, UpdateProfileResponse } from "../protogen/protos/user_pb";
import * as grpc from "grpc";
import * as admin from "firebase-admin";
const app = admin.initializeApp();

export class MainService implements IUserServer{
    getUserInfo: handleUnaryCall<GetUserInfoRequest, GetUserInfoResponse> = async (call: grpc.ServerUnaryCall<GetUserInfoRequest>, callback: grpc.sendUnaryData<GetUserInfoResponse>)=> {
        callback(null, new GetUserInfoResponse());
     }
    updateProfile: handleUnaryCall<UpdateProfileRequest, UpdateProfileResponse> = async (call: grpc.ServerUnaryCall<UpdateProfileRequest>, callback: grpc.sendUnaryData<UpdateProfileResponse>)=>{
        callback(null, new UpdateProfileResponse)
    }
    // getUserInfo
    // updateProfile(call: grpc.ServerUnaryCall<UpdateProfileRequest>, callback: grpc.sendUnaryData<UpdateProfileResponse>): void{
    //     // TODO
    // }
}