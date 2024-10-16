import { Request, Response } from "express";
import { prisma } from "../prisma";
import { compare, hash } from "bcrypt";
import { userRegistrationSchema } from "../schemas/userRegistrationSchema";
import { userUpdateSchema } from "../schemas/userUpdateSchema";
import { passwordUpdateSchema } from "../schemas/passwordUpdateSchema";


export class UsuarioController {


    async adicionarUsuario(req: Request, res: Response) {

        try {
            const usuario = userRegistrationSchema.parse(req.body);

            const hashSenha = await hash(usuario.senha, 10);

            await prisma.usuario.create({
                data: {
                    nome: usuario.nome,
                    email: usuario.email,
                    senha: hashSenha
                }
            });

            return res.status(200).json({
                message: "Usuário adicionado com sucesso!"
            });
        } catch (error) {
            
            return res.status(400).json({
                message: "Validation error",

            });
        }

    }

    async listarUsuario(_req: Request, res: Response) {
        try {
            const listarUsuarios = await prisma.usuario.findMany({
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            });
            return res.status(200).json(listarUsuarios);
        } catch (error) {
            return res.status(400).json();
        }
    }

    async selecionarUsuario(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const selecionarUsuario = await prisma.usuario.findUnique({
                where: {
                    id
                }
            });

            if(!selecionarUsuario) {
                return res.status(400).json();
            }

            return res.status(200).json(selecionarUsuario);
        } catch (error) {
            return res.status(400).json();
        }
    }

    async atualizarUsuario(req: Request, res: Response) {
        try {
            const usuario = userUpdateSchema.parse(req.body);
            const id = req.params.id;

            const atualizarUsuario = await prisma.usuario.update({
                data: {
                    nome: usuario.nome,
                    email: usuario.email
                },
                where: {
                    id
                }
            });

            return res.status(200).json(atualizarUsuario);
        } catch (error) {
            return res.status(400).json();
        }
    }
    
    async deletarUsuario(req: Request, res: Response) {
        try {
            const id = req.params.id;

            await prisma.usuario.delete({
                where: {
                    id
                }
            });

            return res.status(200).json({message: 'Usuário deletado com sucesso!'});
        } catch (error) {
            return res.status(400).json();
        }
    }

    async atualizarSenha(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const usuario = passwordUpdateSchema.parse(req.body);

            if(!usuario.senha) {
                return res.status(400).json({message: 'Senha inválida!'});
            }

            const buscarUsuario = await prisma.usuario.findUnique({
                select : {
                    senha: true
                },
                where: {
                    id
                }
            });

            if(!buscarUsuario) {
                return res.status(400).json({message: 'Usuário não encontrado!'});
            }

            if(!await compare(usuario.senhaAntiga, buscarUsuario.senha)) {
                return res.status(400).json({message: 'Erro! as senhas precisam ser iguais!'});
            }

            const senhaHash = await hash(usuario.senha, 10);

            await prisma.usuario.update({
                data: {
                    senha: senhaHash
                },
                where: {
                    id
                }
            });

            return res.status(200).json({message: 'Senha atualizada com sucesso!'});


        } catch (error) {
            return res.status(400).json();
        }
    }
}