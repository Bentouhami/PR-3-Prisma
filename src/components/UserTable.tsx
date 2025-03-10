'use client';

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function UserTable({ users, onDelete }) {
    if (users.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                Aucun utilisateur trouvé.
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.posts.length}</TableCell>
                        <TableCell>{format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell>
                            <Button size="icon" variant="outline" onClick={() => onDelete(user)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
