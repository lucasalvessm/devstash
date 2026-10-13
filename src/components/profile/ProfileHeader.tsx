import { UserAvatar } from "@/components/auth/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileUser } from "@/lib/db/user";

function formatMemberSince(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

interface ProfileHeaderProps {
  user: ProfileUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <UserAvatar name={user.name} image={user.image} size="lg" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{user.name}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <span className="text-xs text-muted-foreground">
            Member since {formatMemberSince(user.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
