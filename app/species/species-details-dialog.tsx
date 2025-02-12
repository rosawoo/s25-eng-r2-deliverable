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

// // Define the inferface for comments on species cards
// interface Comment {
//   id: number;
//   comment_text: string;
//   created_at: string;
//   user_id: string;
//   user: { display_name: string | null };
// }

// Define TypeScript interface for the Supabase response
interface SupabaseComment {
  id: number;
  comment_text: string;
  created_at: string;
  user_id: string;
  profiles: { display_name: string | null }[]; // Supabase returns an array
}

// Define Comment type using Supabase schema
interface Comment {
  id: number;
  comment_text: string;
  created_at: string;
  user_id: string;
  user: { display_name: string | null };
};

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
  // State to add comments details functionality
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch comments when dialog opens
  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase
        .from("comments")
        .select(`id, comment_text, created_at, user_id, profiles!inner(display_name)`) // Ensure profile relation is included
        .eq("species_id", species.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error.message);
        return;
      }

      if (data) {
        setComments(data as unknown as Comment[]);
      }
    }

    async function getUserSession() {
      const { data } = await supabase.auth.getSession();
      setUserId(data?.session?.user.id ?? null);
    }

    if (open) {
      void fetchComments();
      void getUserSession();
    }
  }, [open, species.id]);

  // Handle Adding a Comment
  async function handleAddComment(): Promise<void> {
    if (!newComment.trim() || !userId) return;

    const { data, error } = await supabase
      .from("comments")
      .insert([{ species_id: species.id, user_id: userId, comment_text: newComment }])
      .select(`id, comment_text, created_at, user_id, profiles!inner(display_name)`) 
      .single();

    if (!error && data) {
      // ✅ Explicitly cast `data` to SupabaseComment
      const typedData = data as unknown as SupabaseComment;

      const newCommentObject: Comment = {
        id: typedData.id,
        comment_text: typedData.comment_text,
        created_at: typedData.created_at,
        user_id: typedData.user_id,
        user: { display_name: typedData.profiles?.[0]?.display_name ?? "Unknown" },
      };

      setComments((prev) => [newCommentObject, ...prev]); // Prepend new comment to list
      setNewComment("");
    }
  }

  // Handle Deleting a Comment
  async function handleDeleteComment(commentId: number): Promise<void> {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (!error) {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    }
  }

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

        {/* Comment Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Comments</h3>
          <div className="space-y-3 mt-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-3 border rounded-md bg-gray-100">
                  <p className="text-gray-700">{comment.user.display_name ?? "Anonymous"}:</p>
                  <p className="text-gray-600">{comment.comment_text}</p>
                  <p className="text-gray-400 text-xs">{new Date(comment.created_at).toLocaleString()}</p>
                  {userId === comment.user_id && (
                    <button
                      onClick={() => { void handleDeleteComment(comment.id); }}
                      className="text-red-500 text-sm mt-1"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Add Comment Input */}
          {userId && (
            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Leave a comment..."
              />
              <button
                onClick={() => { void handleAddComment(); }}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
