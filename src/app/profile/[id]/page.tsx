import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/user-helpers";
import { getCurrentUser } from "@/lib/session";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileTabs } from "@/components/profile/profile-tabs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const session = await getCurrentUser();
  const profile = await getUserProfile(id);

  if (!profile) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === profile.id;

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
      />
      
      <ProfileStats stats={profile.stats} />
      
      <ProfileTabs
        locations={profile.locations}
        events={profile.events}
        locationReviews={profile.locationReviews}
        eventReviews={profile.eventReviews}
      />
    </div>
  );
}


