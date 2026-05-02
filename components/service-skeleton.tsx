// components/service-skeleton.tsx
"use client";

import { 
  Card, 
  CardContent, 
  CardImageContainer,
  CardTitleDescription,
  CardFooter,
  CardCategory,
  CardProfileIndicator
} from "./ui/card";
import ContactIcons from "./contact-icons";

export default function ServiceSkeleton() {
  return (
    <Card skeleton>
      <CardContent>
        <CardImageContainer skeleton>
          <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/60 to-muted" />
        </CardImageContainer>

        <CardTitleDescription skeleton>
          <div className="h-4 md:h-5 bg-muted rounded animate-pulse mb-2">
            <div className="h-full w-4/5 bg-muted-foreground/30 rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 md:h-3 bg-muted rounded animate-pulse">
              <div className="h-full w-full bg-muted-foreground/20 rounded" />
            </div>
            <div className="h-2.5 md:h-3 bg-muted rounded animate-pulse">
              <div className="h-full w-2/3 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        </CardTitleDescription>

        <CardFooter skeleton>
          <div className="flex items-center justify-between">
            <CardCategory skeleton />
            <CardProfileIndicator skeleton />
          </div>

          <div className="flex items-center pt-1">
            <ContactIcons skeleton />
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}