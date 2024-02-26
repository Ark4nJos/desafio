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
const database_1 = __importDefault(require("../config/database"));
class UserController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield database_1.default.db.user.findMany();
            res.json({ users });
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "id é obrigatório" });
            }
            const user = yield database_1.default.db.user.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!user) {
                return res.status(404).json({ message: "User não existe" });
            }
            res.json({ user });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email } = req.body;
            try {
                if (!name || !email) {
                    return res
                        .status(400)
                        .json({ message: "name e email são obrigatórios" });
                }
                const user = yield database_1.default.db.user.create({
                    data: {
                        name,
                        email,
                    },
                });
                return res.status(201).json({ user });
            }
            catch (_a) {
                return res.status(400).json({ message: "Usuário já existe" });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, email } = req.body;
            try {
                if (!name && !email) {
                    return res
                        .status(400)
                        .json({ message: "name ou email são obrigatórios" });
                }
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({ message: "id é obrigatório" });
                }
                const user = yield database_1.default.db.user.update({
                    where: { id: Number(id) },
                    data: {
                        name,
                        email,
                    },
                });
                return res.status(200).json({ user });
            }
            catch (_a) {
                return res.status(400).json({ message: "Usuário já existe" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({ message: "id é obrigatório" });
                }
                yield database_1.default.db.user.delete({
                    where: { id: Number(id) },
                });
                return res.status(200).json({ message: "User excluído" });
            }
            catch (_a) {
                return res.status(400).json({ message: "Usuário não existe" });
            }
        });
    }
}
exports.default = new UserController();
