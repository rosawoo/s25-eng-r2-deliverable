/**
 * EditSpeciesDialog Component
 * --------------------------------
 * This component displays a pop-up dialog that allows users to edit an existing species.
 * Users can modify species details, and updates are saved in Supabase.
 *
 * Features:
 * - Pre-fills the form with existing species data.
 * - Uses React Hook Form and Zod for validation.
 * - Updates the database using Supabase's `update()` method.
 */

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define Species type based on the database schema
type Species = Database["public"]["Tables"]["species"]["Row"];

// Define possible values for Kingdom
const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

// Define validation schema using Zod
const speciesSchema = z.object({
  scientific_name: z.string().trim().min(1),
  common_name: z.string().nullable().transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  kingdom: kingdoms,
  total_population: z.number().int().positive().nullable(),
  image: z.string().url().nullable().transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  description: z.string().nullable().transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  endangered: z.boolean(),
});

type FormData = z.infer<typeof speciesSchema>;

// Component for editing a species
export default function EditSpeciesDialog({ species }: { species: Species }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const supabase = createBrowserSupabaseClient();

  // Pre-fill form with species' existing data
  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      scientific_name: species.scientific_name || "",
      common_name: species.common_name,
      kingdom: species.kingdom,
      total_population: species.total_population,
      image: species.image,
      description: species.description,
      endangered: species.endangered
    },
  });

  // Handle form submission
  const onSubmit = async (input: FormData): Promise<void> => {
    try {
      const { error } = await supabase
        .from("species")
        .update({
          scientific_name: input.scientific_name,
          common_name: input.common_name,
          kingdom: input.kingdom,
          total_population: input.total_population,
          image: input.image,
          description: input.description,
          endangered: input.endangered ?? false,
        })
        .eq("id", species.id);

      if (error) {
        toast({
          title: "Error updating species.",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      form.reset(input);
      setOpen(false);
      router.refresh(); // Refresh UI to reflect changes

      toast({
        title: "Species updated!",
        description: "Successfully updated " + input.scientific_name + ".",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e); }}>
            <div className="grid gap-4">
              <FormField control={form.control} name="scientific_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Scientific Name</FormLabel>
                  <FormControl><Input {...field} placeholder="Homo sapiens" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField
                control={form.control}
                name="common_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Common Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="Human" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="kingdom" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kingdom</FormLabel>
                  <Select onValueChange={(value) => field.onChange(kingdoms.parse(value))} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a kingdom" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {kingdoms.options.map((kingdom) => (
                        <SelectItem key={kingdom} value={kingdom}>{kingdom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="total_population" render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Population</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""} // Ensure the value is never null
                        placeholder="1000000"
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} // Convert to number, allow null
                      />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="endangered" render={({ field }) => {
                // useEffect(() => {
                //   form.setValue("endangered", field.value);
                // }, [field.value]);

                return (
                  <FormItem>
                    <FormLabel>Endangered Status</FormLabel>
                    <Select value={field.value ? "yes" : "no"} onValueChange={(value) => field.onChange(value === "yes")}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                );
              }} />

              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
