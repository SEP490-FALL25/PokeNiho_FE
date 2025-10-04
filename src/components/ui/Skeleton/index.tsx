import { cn } from "@utils/CN"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton } 