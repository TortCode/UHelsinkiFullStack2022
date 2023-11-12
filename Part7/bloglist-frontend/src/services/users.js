import { makeService } from "./utils";

const usersUrl = "/api/users";

const service = makeService(usersUrl);

export default service;
