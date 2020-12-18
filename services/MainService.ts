import { handleUnaryCall } from "grpc";
import { IUserServer } from "../protogen/user_grpc_pb";
import { GetAllUsersRequest, GetAllUsersResponse, GetUserInfoRequest, GetUserInfoResponse, UpdateProfileRequest, UpdateProfileResponse } from "../protogen/user_pb";
import { collection, add, set, update, get, all } from 'typesaurus'
import * as fs from "fs";
import { User } from "../models/User";
import * as grpc from "grpc";
import * as admin from "firebase-admin";
const app = admin.initializeApp();
const users = collection<User>('users');
export class MainService implements IUserServer {
    getUserInfo: handleUnaryCall<GetUserInfoRequest, GetUserInfoResponse> = async (call: grpc.ServerUnaryCall<GetUserInfoRequest>, callback: grpc.sendUnaryData<GetUserInfoResponse>) => {
        try {
            // get the user from firestore
            const user = await get(users, call.request.getUserid());
            const response = new GetUserInfoResponse();
            if (user != null) {
                response.setBio(user.data.Bio);
                response.setPhonenumber(user.data.PhoneNumber);
                response.setUserid(call.request.getUserid());
                response.setUsername(user.data.Username);
                response.setIsexists(true);
                response.setProfilepictureuri(user.data.ProfilePictureUri);
            } else {
                // if the user does not exist, set it to false so the frontend knows
                response.setIsexists(false);
            }
            callback(null, response);
        } catch (ex) {
            console.error(ex.toString());
        }
    }
    updateProfile: handleUnaryCall<UpdateProfileRequest, UpdateProfileResponse> = async (call: grpc.ServerUnaryCall<UpdateProfileRequest>, callback: grpc.sendUnaryData<UpdateProfileResponse>) => {
        const user = await app.auth().getUser(call.request.getUserid());
        const response = new UpdateProfileResponse();
        try{
        // set a new record with the user's uid as the document id for easy reference later.
        await set(users, user.uid, { ProfilePictureUri: call.request.getProfilepictureuri(), Bio: call.request.getBio(), Username: call.request.getUsername(), PhoneNumber: call.request.getPhonenumber() });
        // set the response fields
        response.setErrormessage("");
        response.setIssuccessful(true);
        callback(null, response);
        }catch(ex){
             // log the error and return unsuccessful
            console.error(ex.toString())
            response.setErrormessage(ex.toString());
            response.setIssuccessful(true);
            callback(null, response);
        }
    }

    getAllUsers: handleUnaryCall<GetAllUsersRequest, GetAllUsersResponse> = async (call: grpc.ServerUnaryCall<GetAllUsersRequest>, callback: grpc.sendUnaryData<GetAllUsersResponse>)=>{
        const allUsers = await all(users);
        const response = new GetAllUsersResponse();
        allUsers.forEach(x=>{
            response.addUserid(x.ref.id);
        })
        callback(null, response);
    }
}