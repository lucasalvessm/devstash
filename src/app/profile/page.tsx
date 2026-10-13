import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { DeleteAccountSection } from "@/components/profile/DeleteAccountSection";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCollectionStats } from "@/lib/db/collections";
import { getItemStats, getSystemItemTypesWithCounts } from "@/lib/db/items";
import { getProfileUser } from "@/lib/db/user";

export default async function ProfilePage() {
  const [user, itemStats, collectionStats, itemTypes] = await Promise.all([
    getProfileUser(),
    getItemStats(),
    getCollectionStats(),
    getSystemItemTypesWithCounts(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account</p>
      </div>

      <ProfileHeader user={user} />
      <ProfileStats
        totalItems={itemStats.total}
        totalCollections={collectionStats.total}
        itemTypes={itemTypes}
      />

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Account</h2>
        {user.hasPassword ? (
          <ChangePasswordForm />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>
                You signed in with GitHub, so there&apos;s no password to change.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        <DeleteAccountSection />
      </div>
    </div>
  );
}
