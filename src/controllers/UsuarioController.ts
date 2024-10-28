import { Request, Response } from "express";
import { prisma } from "../prisma";
import { compare, hash } from "bcrypt";
import { userRegistrationSchema } from "../schemas/userRegistrationSchema";
import { userUpdateSchema } from "../schemas/userUpdateSchema";
import { passwordUpdateSchema } from "../schemas/passwordUpdateSchema";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


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

            return res.status(201).json({
                message: "Usuário adicionado com sucesso!"
            });
        } catch (error) {
            
            if(error instanceof ZodError) {
                return res.status(400).json({message: 'Erro de validação!'});
            } else if(error instanceof PrismaClientKnownRequestError) {
                return res.status(400).json({message: 'Erro ao criar usuário!'});
            } else {
                return res.status(500).json({message: 'Erro interno do servidor.'});
            }
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
            return res.status(500).json();
        }
    }

    async selecionarUsuario(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const selecionarUsuario = await prisma.usuario.findUnique({
                select: {
                    id: true,
                    nome: true,
                    email: true
                },
                where: {
                    id
                }
            });

            if(!selecionarUsuario) {
                return res.status(400).json({message: 'Erro! Usuário não encontrado!'});
            }

            return res.status(200).json(selecionarUsuario);
        } catch (error) {
            return res.status(500).json();
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
            if(error instanceof ZodError) {
                return res.status(400).json({message: 'Erro de validação!'});
            } else if(error instanceof PrismaClientKnownRequestError) {
                return res.status(400).json({message: 'Erro ao atualizar o usuário!'});
            } else {
                return res.status(500).json();
            }
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
            if(error instanceof PrismaClientKnownRequestError) {
                return res.status(400).json({message: 'Erro ao encontrar o usuário!'});
            } else {
                return res.status(500).json();
            }
        }
    }

    async atualizarSenha(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const usuario = passwordUpdateSchema.parse(req.body);

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
            if(error instanceof ZodError) {
                return res.status(400).json({message: 'Erro de validação!'});
            } else if(error instanceof PrismaClientKnownRequestError) {
                return res.status(400).json({message: 'Erro ao alterar senha!'});
            } else {
                return res.status(500).json();
            }
        }
    }
}