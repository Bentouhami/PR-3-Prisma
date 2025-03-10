'use client';

import React from "react";
import {z} from "zod";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "./ui/form";
import {Textarea} from "./ui/textarea";

const formSchema = z.object({
    lastName: z.string().min(1, "Le nom est requis."),
    firstName: z.string().min(1, "Le prénom est requis."),
    email: z.string().email("L'email est invalide."),
    posts: z.array(z.object({
        title: z.string().min(3, "Le titre doit contenir au moins 3 caractères."),
        content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères."),
    })).min(1, "Ajoutez au moins un post."),
});

export default function UserForm({refreshUsers}: { refreshUsers: () => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            lastName: "",
            firstName: "",
            email: "",
            posts: [{title: "", content: ""}],
        },
    });

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "posts",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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

    const isFormValid = form.formState.isValid;
    const isSubmitting = form.formState.isSubmitting;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
            <Form {...form}>
                {/* Nom */}
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input placeholder="Nom" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500"/>
                        </FormItem>
                    )}
                />

                {/* Prénom */}
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                                <Input placeholder="Prénom" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500"/>
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" type="email" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500"/>
                        </FormItem>
                    )}
                />

                {/* Posts */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Posts :</h3>
                    {fields.map((item, index) => (
                        <div key={item.id} className="space-y-2">
                            <FormField
                                control={form.control}
                                name={`posts.${index}.title`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Titre du post</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Titre" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500"/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`posts.${index}.content`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Contenu du post</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Contenu du post" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500"/>
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={isSubmitting}
                                type="button"
                                variant="destructive"
                                onClick={() => remove(index)}
                            >
                                Supprimer
                            </Button>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 mt-4">
                        <Button
                            disabled={!isFormValid || isSubmitting}
                            type="button"
                            variant="outline"
                            onClick={() => append({title: "", content: ""})}
                        >
                            Ajouter un post
                        </Button>

                        <Button
                            disabled={!isFormValid || isSubmitting}
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Ajouter l&#39;utilisateur
                        </Button>
                    </div>
                </div>
            </Form>
        </form>
    );
}
