import { handleUnaryCall } from "grpc";
import { IUserServer } from "../protogen/protos/user_grpc_pb";
import { GetUserInfoRequest, GetUserInfoResponse, UpdateProfileRequest, UpdateProfileResponse } from "../protogen/protos/user_pb";
import { collection, add, set, update, get } from 'typesaurus'
import {User} from "../models/User";
import * as grpc from "grpc";
import * as admin from "firebase-admin";
const app = admin.initializeApp();

const users = collection<User>('users')
export class MainService implements IUserServer{
    getUserInfo: handleUnaryCall<GetUserInfoRequest, GetUserInfoResponse> = async (call: grpc.ServerUnaryCall<GetUserInfoRequest>, callback: grpc.sendUnaryData<GetUserInfoResponse>)=> {
        // get the user from firestore
        const user = await get(users, call.request.getUserid());
        const response = new GetUserInfoResponse();
        if(user != null){
            response.setBio(user.data.Bio);
            response.setPhonenumber(user.data.PhoneNumber);
            response.setUserid(call.request.getUserid());
            response.setUsername(user.data.Username);
            response.setIsexists(true);
        }else{
            // if the user does not exist, set it to false so the frontend knows
            response.setIsexists(false);
        }
        callback(null, response);
     }
    updateProfile: handleUnaryCall<UpdateProfileRequest, UpdateProfileResponse> = async (call: grpc.ServerUnaryCall<UpdateProfileRequest>, callback: grpc.sendUnaryData<UpdateProfileResponse>)=>{
        const user = await app.auth().getUser(call.request.getUserid());
        // set a new record with the user's uid as the document id for easy reference later.
        await set(users, user.uid, {ProfilePictureUri: call.request.getProfilepictureuri(), Bio: call.request.getBio(), Username: call.request.getUsername(), PhoneNumber: call.request.getPhonenumber()});
        // set the response fields
        const response = new UpdateProfileResponse();
        response.setErrormessage("");
        response.setIssuccessful(true);
        callback(null, response);
    }
}