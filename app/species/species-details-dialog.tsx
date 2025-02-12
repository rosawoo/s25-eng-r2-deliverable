/**
 * SpeciesDetailsDialog Component
 * --------------------------------
 * This component is a pop-up dialog that displays detailed information about a species.
 * It is triggered when the user clicks the "Learn More" button on a species card.
 *
 * Features:
 * - Uses a modal (dialog) to show species details.
 * - Displays scientific name, common name, kingdom, total population, and description.
 * - Uses Next.js client-side rendering with React state for controlling the dialog.
 *
 * References:
 * - shadcn/ui Dialog component: https://ui.shadcn.com/docs/components/dialog
 * - React useState Hook: https://react.dev/reference/react/useState
 */

"use client"; // Ensures this component is rendered on the client-side since it
              // uses state and event handlers

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client (client-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the type for a Species object using the database schema
type Species = Database["public"]["Tables"]["species"]["Row"];

// Define the props that the SpeciesDetailsDialog component expects
interface SpeciesDetailsDialogProps {
  species: Species; // The species object containing details to be displayed
}

// Define the interface for an Author (User Profile)
interface Author {
  display_name: string | null;
  email: string;
}

// SpeciesDetailsDialog Component - Displays detailed information about a species in a pop-up dialog
export default function SpeciesDetailsDialog({ species }: SpeciesDetailsDialogProps) {
  // State to control whether the dialog is opened or not
  const [open, setOpen] = useState(false);
  // State to add author details functionality
  const [author, setAuthor] = useState<Author | null>(null);

  // When the dialog opens, get the author details
  useEffect(() => {
    async function fetchAuthor() {
      if (!species.author) return; // No author so skip fetching

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("display_name, email")
          .eq("id", species.author)
          .single();

        if (error) throw error; // Throw error so it's caught below
        setAuthor(data);
      } catch (err) {
        console.error("Error fetching author:", err);
      }
    }

    if (open) {
      fetchAuthor().catch((err) => console.error("Unhandled fetchAuthor error:", err));
    }
  }, [open, species.author]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* DialogTrigger - This button opens the dialog when clicked */}
      <DialogTrigger asChild>
        <button className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md">
          Learn More
        </button>
      </DialogTrigger>

      {/* DialogContent - The content displayed inside the pop-up */}
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        {/* DialogHeader - Displays the title of the dialog */}
        <DialogHeader>
          <DialogTitle>
            {species.common_name} ({species.scientific_name}) {/* Display species names */}
          </DialogTitle>
        </DialogHeader>

        {/* Species Details Section */}
        <div className="space-y-3 p-4">
          <p><strong>Kingdom:</strong> {species.kingdom}</p>
          <p><strong>Total Population:</strong> {species.total_population?.toLocaleString() ?? "Unknown"}</p>
          <p><strong>Endangered:</strong> {species.endangered ? "Yes" : "No"}</p>
          <p className="whitespace-pre-wrap">
            <strong>Description:</strong> {species.description ?? "No description available."}
          </p>

        {/* Author Information Section */}
        {author ? (
            <div className="mt-4 p-3 border rounded-md bg-green-500">
              <p className="font-medium">Species added by:</p>
              <p className="text-gray-700">{author.display_name ?? "Unknown Author"}</p>
              <p className="text-gray-500 text-sm">{author.email}</p>
            </div>
          ) : (
            <p className="text-gray-500">Author information not available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
