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
import { useState } from "react";

// Define the type for a Species object using the database schema
type Species = Database["public"]["Tables"]["species"]["Row"];

// Define the props that the SpeciesDetailsDialog component expects
interface SpeciesDetailsDialogProps {
  species: Species; // The species object containing details to be displayed
}

// SpeciesDetailsDialog Component - Displays detailed information about a species in a pop-up dialog
export default function SpeciesDetailsDialog({ species }: SpeciesDetailsDialogProps) {
  // State to control whether the dialog is open or closed
  const [open, setOpen] = useState(false);

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
          <p className="whitespace-pre-wrap">
            <strong>Description:</strong> {species.description ?? "No description available."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
