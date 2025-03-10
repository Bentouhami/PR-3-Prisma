// path: /api/users/[id]/route.ts

import {NextRequest, NextResponse} from "next/server";
import {prisma} from "../../../../lib/prisma";

export async function DELETE(req: NextRequest, {params}: { params: { id: string } }) {
    if (req.method !== 'DELETE') {
        return NextResponse.json({error: 'Erreur, seul DELETE accepté.'}, {status: 405});
    }

    // Fix: await params before accessing its properties
    const { id } = await params;

    try {
        // Vérifier que l'utilisateur existe
        const userExists = await prisma.user.findUnique({where: {id: parseInt(id, 10)}});

        if (!userExists) {
            return NextResponse.json({error: 'Utilisateur non trouvé.'}, {status: 404});
        }

        // Supprimer l'utilisateur
        await prisma.user.delete({
            where: {id: parseInt(id)},
        });

        return NextResponse.json({message: "Utilisateur supprimé"});

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: 'Erreur du serveur, veuillez réessayer.'}, {status: 500});
    }
}