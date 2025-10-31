import { useEffect, useState } from 'react'
import { Button } from '@ui/Button'
import { Input } from '@ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select'

interface PokemonLite {
    id: number
    imageUrl: string
    nameTranslations: { en: string }
    pokedex_number: number
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
}

interface Props {
    isOpen: boolean
    onClose: () => void
}

export default function AddGachaPokemonSidebar({ isOpen, onClose }: Props) {
    const [list, setList] = useState<PokemonLite[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [selected, setSelected] = useState<Record<number, boolean>>({})
    const [search, setSearch] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState<string>('')
    const [rarity, setRarity] = useState<'ALL' | 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'>('ALL')

    useEffect(() => {
        if (!isOpen) return
        setLoading(true)
        // Mock API fetch
        const timer = setTimeout(() => {
            setList([
                { id: 25, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', nameTranslations: { en: 'Pikachu' }, pokedex_number: 25, rarity: 'COMMON' },
                { id: 1, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', nameTranslations: { en: 'Bulbasaur' }, pokedex_number: 1, rarity: 'UNCOMMON' },
                { id: 4, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', nameTranslations: { en: 'Charmander' }, pokedex_number: 4, rarity: 'RARE' },
                { id: 7, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', nameTranslations: { en: 'Squirtle' }, pokedex_number: 7, rarity: 'EPIC' },
                { id: 150, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', nameTranslations: { en: 'Mewtwo' }, pokedex_number: 150, rarity: 'LEGENDARY' },
            ])
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [isOpen])

    // debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300)
        return () => clearTimeout(t)
    }, [search])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
                onClick={onClose}
                onDragEnter={onClose}
            />
            <div className="absolute right-0 top-0 h-full w-full sm:w-[460px] bg-white shadow-2xl border-l border-border overflow-hidden">
                <div className="h-full grid grid-rows-[auto_1fr_auto]">
                    <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold tracking-tight">Add Pokémon to Gacha</h3>
                            <Button variant="outline" onClick={onClose}>Close</Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Drag a Pokémon and drop into a rarity column.</p>
                    </div>
                    <div className="p-4 overflow-y-auto">
                        <div className="mb-3 grid grid-cols-1 gap-2">
                            <Input
                                placeholder="Search by name or Dex #"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                isSearch
                            />
                            <Select value={rarity} onValueChange={(v) => setRarity(v as any)}>
                                <SelectTrigger className="bg-background border-input">
                                    <SelectValue placeholder="Rarity" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="ALL">All Rarities</SelectItem>
                                    <SelectItem value="COMMON">COMMON</SelectItem>
                                    <SelectItem value="UNCOMMON">UNCOMMON</SelectItem>
                                    <SelectItem value="RARE">RARE</SelectItem>
                                    <SelectItem value="EPIC">EPIC</SelectItem>
                                    <SelectItem value="LEGENDARY">LEGENDARY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {loading ? (
                            <div className="text-sm text-muted-foreground">Loading...</div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {list
                                    .filter((p) => rarity === 'ALL' ? true : p.rarity === rarity)
                                    .filter((p) => {
                                        const q = debouncedSearch
                                        if (!q) return true
                                        return p.nameTranslations.en.toLowerCase().includes(q) || String(p.pokedex_number).includes(q)
                                    })
                                    .map((p) => {
                                        const isSelected = !!selected[p.id]
                                        return (
                                            <div
                                                key={p.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-grab select-none ${isSelected ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:bg-muted/40'}`}
                                                draggable
                                                onClick={(e) => {
                                                    // toggle selection (avoid starting drag on click)
                                                    e.stopPropagation()
                                                    setSelected((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                                                }}
                                                onDragStart={(e) => {
                                                    // Build payload: if multiple selected, send all selected; else single
                                                    const selectedList = Object.keys(selected).filter((id) => selected[Number(id)]).map((id) => Number(id))
                                                    const payload = (selectedList.length > 0 ? list.filter((x) => selectedList.includes(x.id)) : [p])
                                                    if (payload.length > 1) {
                                                        e.dataTransfer.setData('application/pokemon-list', JSON.stringify(payload))
                                                    }
                                                    // also set single for compatibility
                                                    e.dataTransfer.setData('application/pokemon', JSON.stringify(p))
                                                    e.dataTransfer.effectAllowed = 'move'
                                                    setIsDragging(true)
                                                }}
                                                onDragEnd={() => {
                                                    setIsDragging(false)
                                                }}
                                            >
                                                <img src={p.imageUrl} alt={p.nameTranslations.en} className="w-12 h-12 rounded-md shadow-sm" />
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium truncate">{p.nameTranslations.en}</div>
                                                    <div className="text-[11px] text-muted-foreground truncate">Dex #{p.pokedex_number} • {p.rarity}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        )}
                    </div>
                    <div className="px-5 py-3 border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
                        Tip: Hold and drag a Pokémon; columns will highlight when you can drop.
                    </div>
                </div>
            </div>
        </div>
    )
}


