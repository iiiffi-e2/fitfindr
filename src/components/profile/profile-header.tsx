import { Calendar, Mail, User as UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { UserProfile } from "@/lib/user-helpers";

type Props = {
  profile: UserProfile;
  isOwnProfile: boolean;
};

export function ProfileHeader({ profile, isOwnProfile }: Props) {
  const memberSince = formatDistanceToNow(profile.createdAt, {
    addSuffix: true,
  });

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          <UserIcon className="h-8 w-8" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              {profile.name || "Anonymous User"}
            </h1>
            {isOwnProfile && (
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4" />
                {profile.email}
              </p>
            )}
          </div>

          {profile.bio && (
            <p className="text-slate-600">{profile.bio}</p>
          )}

          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            Joined {memberSince}
          </p>
        </div>
      </div>
    </section>
  );
}


