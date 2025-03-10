'use client';

import React, {useEffect, useState} from "react";
import {toast} from "sonner";
import UserForm from "@/components/UserForm";
import UserTable from "@/components/UserTable";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    posts: {
        id: number;
        title: string;
        content: string;
    }[];
    createdAt: string;
}

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Erreur lors du fetch", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;

        try {
            const res = await fetch(`/api/users/${selectedUser.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error("Erreur de suppression");
            }

            toast.success("Utilisateur supprimé !");
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression.");
        } finally {
            setOpen(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Form on the Left (lg: 1/3 width) */}
                <div className="lg:w-1/3 w-full">
                    <UserForm refreshUsers={fetchUsers}/>
                </div>

                {/* Table on the Right (lg: 2/3 width) */}
                <div className="lg:w-2/3 w-full">
                    <UserTable users={users} onDelete={handleDeleteClick}/>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmation de suppression</DialogTitle>
                    </DialogHeader>
                    <div>
                        Voulez-vous vraiment supprimer l&#39;utilisateur{" "}
                        <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> ?
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>Confirmer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/*<UserTable*/}
            {/*    users={users}*/}
            {/*    onDelete={handleDeleteClick}*/}
            {/*/>*/}
        </div>
    );
}
