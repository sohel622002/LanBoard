import { getApi } from "./axiosInstance";

class UserAPI {
    public async getUsers() {
        return getApi().get("/api/user").then(res => res.data.body)
    }
    public async createUser(userPaylod: any) {
        return getApi().post("/api/user", userPaylod).then(res => res.data.body);
    }
}

export const userApi = new UserAPI();