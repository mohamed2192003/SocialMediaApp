import { compareHash, generateHash } from "../utils/security/hash.security.js";
export class SecurityService{
    constructor(){}
    generateHash = generateHash
    compareHash = compareHash
}