/**
 * Users Page
 *
 * This page displays a list of all user profiles, including their email, display name, and biography.
 * It requires authentication and redirects unauthenticated users to the homepage.
 *
 * Data is fetched from the Supabase `profiles` table using a server-side request.
 */

import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  // Made this a server component
  const supabase = createServerSupabaseClient();

  // Fetch the logged-in user's session
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  // If the user is not logged in, redirect them to the homepage
  if (!session) {
    redirect("/");
  }

  // Get all the user profiles
  const { data: users, error } = await supabase.from("profiles").select("email, display_name, biography");

  if (error) {
    return <p className="text-red-500">Failed to load users.</p>;
  }

  return (
    <div className="text-green-600">
      <TypographyH2>Users</TypographyH2>
      <Separator className="my-4" />
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.email} className="p-4 border rounded-md shadow-sm">
            <h2 className="text-xl font-semibold">{user.display_name || "Unknown User"}</h2>
            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-600"><strong>Bio:</strong> {user.biography ?? "No biography provided for this user."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
