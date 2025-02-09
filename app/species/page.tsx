import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import AddSpeciesDialog from "./add-species-dialog";
import SpeciesCard from "./species-card";

export default async function SpeciesList() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  // Fetch the logged-in user's session
  const { data } = await supabase.auth.getSession();
  const session = data?.session;
  // Obtain the ID of the currently signed-in user
  const sessionId: string = session?.user?.id ?? "";

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  const { data: species } = await supabase.from("species").select("*").order("id", { ascending: false });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog userId={sessionId} />
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {species?.map((species) => (
          // Pass `sessionId` to `SpeciesCard`
          <SpeciesCard key={species.id} species={species} sessionId={sessionId} />
        ))}
      </div>
    </>
  );
}
