interface AvatarProps {
  name: string
}

export default function Avatar({ name }: AvatarProps) {
  const initials = name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-dim text-xs font-semibold text-accent-soft">
      {initials || '?'}
    </div>
  )
}