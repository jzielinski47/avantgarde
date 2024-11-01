"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../utils/middlewares");
const user_1 = require("../mongodb/schemas/user");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
router.get("/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.User.find();
    res.send(users);
}));
router.get("/api/users/count"),
    //@ts-ignore
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const client = mongoose_1.default.connection.getClient();
            const activeUsersCount = yield client
                .db()
                .collection("sessions")
                .countDocuments();
            res.json({ activeUsersCount });
        }
        catch (error) {
            console.error("Error fetching active users count:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
//@ts-ignore
router.post("/api/users/delete/:username", middlewares_1.authorizeAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const deletedUser = yield user_1.User.findOneAndDelete({
            username,
        });
        if (!deletedUser) {
            return res
                .status(404)
                .send({ msg: `User ${req.params.username} not found` });
        }
        res
            .status(200)
            .send({ msg: `User ${req.params.username} has been deleted` });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ msg: "An error occurred while deleting the user" });
    }
}));
// grant role "user"/"administrator"
//@ts-ignore
router.patch("/api/users/grant/:username", middlewares_1.authorizeAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield user_1.User.findOneAndUpdate({ username: req.params.username }, { role: "administrator" }, { new: true });
        if (!updatedUser) {
            return res
                .status(404)
                .send({ msg: `User ${req.params.username} not found` });
        }
        res.status(200).send({
            msg: `User ${req.params.username} has been granted administrator rights`,
            user: updatedUser,
        });
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .send({ msg: "An error occurred while updating the user role" });
    }
}));
//@ts-ignore
router.get("/api/admin", middlewares_1.authorizeAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.User.find();
    res.send(users);
}));
exports.default = router;
