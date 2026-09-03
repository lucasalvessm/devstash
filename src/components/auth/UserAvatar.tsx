import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

interface UserAvatarProps {
  name: string;
  image?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function UserAvatar({ name, image, size = "default", className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={cn(className)}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
