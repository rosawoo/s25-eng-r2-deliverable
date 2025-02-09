"use client"; // Ensures this component runs on the client side, enabling state and event handling.

import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import EditSpeciesDialog from "./edit-species-dialog";
import SpeciesDetailsDialog from "./species-details-dialog";
import { toast } from "@/components/ui/use-toast";

// Define the type for the Species data retrieved from the database
type Species = Database["public"]["Tables"]["species"]["Row"];

interface SpeciesCardProps {
  species: Species;
  sessionId: string; // The ID of the currently logged-in user
}

export default function SpeciesCard({ species, sessionId }: SpeciesCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createBrowserSupabaseClient();

  // Handles the deletion of a species, prompting for confirmation first
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${species.common_name}?`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    const { error } = await supabase.from("species").delete().eq("id", species.id);

    if (error) {
      toast({
        title: "Error deleting species",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Species deleted",
        description: `${species.common_name} was successfully deleted.`,
      });
    }

    setIsDeleting(false);
    window.location.reload(); // Refresh the page to reflect the deletion
  };

  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {/* Display the species image if available */}
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}

      {/* Display species information */}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      <p className="mt-2 font-semibold">Endangered: {species.endangered ? "Yes" : "No"}</p>

      {/* Button to open the species details dialog */}
      <div className="mt-3 w-full">
        <SpeciesDetailsDialog species={species} />
      </div>

      {/* Show Edit & Delete buttons only if the logged-in user is the author of the species */}
      {species.author === sessionId ? (
        <div className="mt-3 flex justify-between gap-2">
          <EditSpeciesDialog species={species} />
          <Button onClick={() => { void handleDelete(); }} variant="destructive" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic text-center mt-2">You cannot edit this species</p>
      )}
    </div>
  );
}
