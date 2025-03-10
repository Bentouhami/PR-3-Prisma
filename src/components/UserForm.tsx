'use client';

import React from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormField } from "./ui/form";
import {Textarea} from "./ui/textarea";

const formSchema = z.object({
    lastName: z.string().min(1, "Le nom est requis."),
    firstName: z.string().min(1, "Le prénom est requis."),
    email: z.string().email("L'email est invalide."),
    posts: z.array(z.object({
        title: z.string().min(1, "Le titre est requis."),
        content: z.string().min(1, "Le contenu est requis."),
    })).min(1, "Au moins un post est requis."),
});

export default function UserForm({ refreshUsers }: { refreshUsers: () => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lastName: "",
            firstName: "",
            email: "",
            posts: [{ title: "", content: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "posts",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Erreur, réessayez.");
                return;
            }

            toast.success("Utilisateur ajouté !");
            form.reset();
            refreshUsers();

        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Erreur du serveur.");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
            <Form {...form}>
                <FormField control={form.control} name="lastName" render={({ field }) => (
                    <Input placeholder="Nom" {...field} />
                )} />
                <FormField control={form.control} name="firstName" render={({ field }) => (
                    <Input placeholder="Prénom" {...field} />
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <Input placeholder="Email" {...field} />
                )} />

                <div className="space-y-2">
                    <h3 className="font-semibold">Posts :</h3>
                    {fields.map((item, index) => (
                        <div key={item.id} className="flex gap-2">
                            <Input
                                placeholder="Titre du post"
                                {...form.register(`posts.${index}.title`)}
                            />
                            <Textarea
                                placeholder="Contenu du post"
                                {...form.register(`posts.${index}.content`)}
                            />
                            <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                Supprimer
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => append({ title: "", content: "" })}>
                        Ajouter un post
                    </Button>
                </div>

                <Button type="submit">Ajouter l&#39;utilisateur</Button>
            </Form>
        </form>
    );
}
