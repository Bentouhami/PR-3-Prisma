import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { firstName, lastName, email, posts } = await req.json();

    try {
        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                posts: {
                    create: posts || [],
                }
            },
            include: { posts: true } // 👈 Inclure les posts dans la réponse
        });

        return NextResponse.json(user, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur du serveur, veuillez réessayer.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: { posts: true }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur du serveur' }, { status: 500 });
    }
}
