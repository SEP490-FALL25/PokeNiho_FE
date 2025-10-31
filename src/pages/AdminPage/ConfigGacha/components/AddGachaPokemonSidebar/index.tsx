import { useEffect, useState, useCallback, useRef } from 'react'
import { Button } from '@ui/Button'
import { Input } from '@ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select'
import { usePreparePokemonList } from '@hooks/useGacha'
import { RarityBadge } from '@atoms/BadgeRarity'
import { Loader2 } from 'lucide-react'
import { IPokemonLiteEntity } from '@models/pokemon/entity'

interface Props {
    isOpen: boolean
    onClose: () => void
    gachaBannerId: number
}

export default function AddGachaPokemonSidebar({ isOpen, onClose, gachaBannerId }: Props) {
    /**
     * UsePreparePokemonList Hook
     */
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [search, setSearch] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState<string>('')
    const [rarity, setRarity] = useState<'ALL' | 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'>('ALL')
    const { data: preparePokemonList, isLoading: isPreparePokemonListLoading } = usePreparePokemonList(
        gachaBannerId,
        {
            rarity: rarity === 'ALL' ? undefined : [rarity],
            nameEn: debouncedSearch || undefined,
            currentPage,
            pageSize: 15
        }
    )
    //------------------------End------------------------//


    /**
     * Handle Accumulated Results
     */
    const [accumulatedResults, setAccumulatedResults] = useState<IPokemonLiteEntity[]>([])
    useEffect(() => {
        const results = preparePokemonList?.data?.results as any[] | undefined
        if (results && Array.isArray(results) && results.length > 0) {
            if (currentPage === 1) {
                setAccumulatedResults(results as unknown as IPokemonLiteEntity[])
            } else {
                setAccumulatedResults(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const newResults = results.filter((p: any) => !existingIds.has(p.id))
                    return [...prev, ...newResults]
                })
            }
        } else if (!isPreparePokemonListLoading && currentPage === 1) {
            setAccumulatedResults([])
        }
    }, [preparePokemonList, currentPage, isPreparePokemonListLoading])
    //------------------------End------------------------//


    /**
     * Handle Intersection Observer
     */
    const observerRef = useRef<IntersectionObserver | null>(null)
    const lastPokemonElementRef = useCallback((node: HTMLDivElement | null) => {
        if (observerRef.current) observerRef.current.disconnect()
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting &&
                preparePokemonList?.data?.pagination?.current &&
                preparePokemonList?.data?.pagination?.totalPage &&
                preparePokemonList?.data?.pagination?.current < preparePokemonList?.data?.pagination?.totalPage &&
                !isPreparePokemonListLoading) {
                setCurrentPage(prev => prev + 1)
            }
        })
        if (node) observerRef.current.observe(node)
    }, [preparePokemonList?.data?.pagination, isPreparePokemonListLoading])
    //------------------------End------------------------//


    /**
     * Handle Reset Page and Accumulated Results
     */
    useEffect(() => {
        setCurrentPage(1)
        setAccumulatedResults([])
    }, [debouncedSearch, rarity])
    //------------------------End------------------------//


    /**
     * Handle Selected Pokemon
     */
    const [selected, setSelected] = useState<Record<number, boolean>>({})
    useEffect(() => {
        if (isOpen) {
            setSelected({})
        }
    }, [isOpen])
    //------------------------End------------------------//


    /**
     * Handle Debounce Search
     */
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300)
        return () => clearTimeout(t)
    }, [search])
    //------------------------End------------------------//


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
                        {isPreparePokemonListLoading && currentPage === 1 && accumulatedResults.length === 0 ? (
                            <div className="text-sm text-muted-foreground">Loading...</div>
                        ) : accumulatedResults.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {accumulatedResults.map((p, index) => {
                                    const isSelected = !!selected[p.id]
                                    return (
                                        <div
                                            key={p.id}
                                            ref={index === accumulatedResults.length - 1 ? lastPokemonElementRef : null}
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
                                                const payload = (selectedList.length > 0 ? accumulatedResults.filter((x) => selectedList.includes(x.id)) : [p])
                                                if (payload.length > 1) {
                                                    e.dataTransfer.setData('application/pokemon-list', JSON.stringify(payload))
                                                }
                                                // also set single for compatibility
                                                e.dataTransfer.setData('application/pokemon', JSON.stringify(p))
                                                e.dataTransfer.effectAllowed = 'move'
                                            }}
                                        >
                                            <img src={p.imageUrl} alt={p.nameTranslations.en} className="w-12 h-12 rounded-md shadow-sm" />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-medium truncate">{p.nameTranslations.en}</div>
                                                <div className="text-[11px] text-muted-foreground truncate mb-1">#{p.pokedex_number}</div>
                                                <RarityBadge level={p.rarity} />
                                            </div>
                                        </div>
                                    )
                                })}
                                {/* Loading indicator when loading more pages */}
                                {isPreparePokemonListLoading && currentPage > 1 && (
                                    <div className="col-span-2 flex items-center justify-center py-4">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                                        <span className="text-sm text-muted-foreground">Loading more...</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-8">No Pokémon found</div>
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


