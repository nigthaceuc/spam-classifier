interface Props { variant?: 'light' | 'dark'; className?: string }
export default function Logo({ variant = 'dark', className = '' }: Props) {
const color = variant === 'light' ? 'text-white' : 'text-brand-700'
return (
<div className={`flex items-center gap-2 ${color} ${className}`} aria-label="Brand">
<div className="h-8 w-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
<span className="font-black">A</span>
</div>
<span className="text-xl font-extrabold tracking-tight">AuthKit</span>
</div>
)
}