import { Router, Request, Response } from "express";
import { UsuarioController } from "./controllers/UsuarioController";

export const router = Router();

const usuarioController = new UsuarioController();

router.get('/', usuarioController.listarUsuario);
router.get('/:id', usuarioController.selecionarUsuario);
router.post('/', usuarioController.adicionarUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.deletarUsuario);