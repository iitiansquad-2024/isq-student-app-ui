import { cn } from "@/lib/utils"

interface PageHeadingProps {
  title: string
  description?: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

function PageHeading({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: PageHeadingProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h1 className={cn("text-2xl font-semibold", titleClassName)}>{title}</h1>
      {description ? (
        <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>{description}</p>
      ) : null}
    </div>
  )
}

export const DesignSystem = {
  PageHeading,
}
