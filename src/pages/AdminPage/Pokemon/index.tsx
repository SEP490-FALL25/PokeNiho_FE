import { useState } from "react";
import { Edit, Trash2, MoreVertical, Filter } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Badge } from "@ui/Badge";
import { Skeleton } from "@ui/Skeleton";
import HeaderAdmin from "@organisms/Header/Admin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/DropdownMenu";
import PaginationControls from "@ui/PaginationControls";
import { usePokemonList } from "@hooks/usePokemon";
import { useElementalTypeList } from "@hooks/useElemental";
import { RarityPokemon } from "@constants/pokemon";
import CreatePokemon from "./components/CreatePokemon";
import { useTranslation } from "react-i18next";


export default function PokemonManagement() {
    const { t } = useTranslation();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);


    /**
     * Handle Pokemon List Hook
     */
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRarity, setSelectedRarity] = useState<string>("all");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [itemsPerPage, setItemsPerPage] = useState<number>(15);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { data: pokemonData, isLoading: isPokemonLoading, error: pokemonError } = usePokemonList({
        page: currentPage,
        limit: itemsPerPage,
        type: selectedType === 'all' ? undefined : selectedType,
        search: searchQuery || undefined,
        rarity: selectedRarity === 'all' ? undefined : selectedRarity,
    });


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        setCurrentPage(1);
    };


    const handleRarityChange = (value: string) => {
        setSelectedRarity(value);
        setCurrentPage(1);
    };
    //--------------------------------End--------------------------------//

    /**
     * Handle Elemental Type List Hook
     */
    const { data: typesData, isLoading: isTypesLoading } = useElementalTypeList({ page: 1, limit: 100 });
    //--------------------------------End--------------------------------//

    const getRarityBadgeVariant = (rarity: string) => {
        switch (rarity) {
            case RarityPokemon.COMMON: return "secondary";
            case RarityPokemon.UNCOMMON: return "secondary";
            case RarityPokemon.RARE: return "secondary";
            case RarityPokemon.EPIC: return "secondary";
            case RarityPokemon.LEGENDARY: return "destructive";
            default: return "outline";
        }
    };

    /**
     * Skeleton component for loading state
     */
    const PokemonSkeleton = () => (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="bg-muted/50 border-border flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-20 h-20 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                    <div className="flex gap-2 mt-2">
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="space-y-2 pt-4 border-t border-border">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                            <Skeleton className="h-8 w-full mt-2" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );



    return (
        <>
            <HeaderAdmin title={t('pokemon.title')} description={t('pokemon.description')} />
            <div className="p-8 mt-24">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2 w-full md:w-auto">
                            <div className="flex-1">
                                <Input
                                    placeholder={t('pokemon.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    isSearch
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={selectedType} onValueChange={handleTypeChange}>
                                    <SelectTrigger className="bg-background border-border text-foreground w-full md:w-auto">
                                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <SelectValue placeholder={t('pokemon.filterByType')} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="all">{t('pokemon.allTypes')}</SelectItem>
                                        {isTypesLoading ? (
                                            <SelectItem value="loading" disabled>{t('common.loading')}</SelectItem>
                                        ) : (
                                            typesData?.results.map((type: any) => (
                                                <SelectItem key={type.id} value={type.type_name}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color_hex }} />
                                                        {type.display_name.vi}
                                                    </div>
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <Select value={selectedRarity} onValueChange={handleRarityChange}>
                                    <SelectTrigger className="bg-background border-border text-foreground w-full md:w-auto">
                                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <SelectValue placeholder={t('pokemon.filterByRarity')} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="all">{t('pokemon.allRarities')}</SelectItem>
                                        {Object.values(RarityPokemon).map((rarity: string) => (
                                            <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <CreatePokemon
                                    isAddDialogOpen={isAddDialogOpen}
                                    setIsAddDialogOpen={setIsAddDialogOpen}
                                    typesData={typesData}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Pokemon List */}
                        {isPokemonLoading ? (
                            <PokemonSkeleton />
                        ) : pokemonError ? (
                            <div className="text-red-500 text-center text-5xl h-96 flex items-center justify-center">
                                Đã có lỗi xảy ra khi tải dữ liệu Pokémon.
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pokemonData?.results.map((pokemon: any) => (
                                    <Card key={pokemon.id} className="bg-muted/50 border-border hover:border-primary/50 transition-colors flex flex-col">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <img src={pokemon.imageUrl} alt={pokemon.nameTranslations.en} className="w-20 h-20 rounded-lg bg-gray-200 object-contain" />
                                                    <div>
                                                        <CardTitle className="text-lg text-foreground mb-1">{pokemon.nameJp}</CardTitle>
                                                        <p className="text-sm text-muted-foreground">{pokemon.nameTranslations.vi}</p>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {pokemon.types.map((type: any) => (
                                                                <Badge key={type.id} style={{ backgroundColor: type.color_hex, color: 'white', border: 'none' }}>
                                                                    {type.display_name.vi}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card border-border">
                                                        <DropdownMenuItem className="text-foreground hover:bg-muted cursor-pointer"><Edit className="h-4 w-4 mr-2" /> {t('common.edit')}</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive hover:bg-destructive/10 cursor-pointer"><Trash2 className="h-4 w-4 mr-2" /> {t('common.delete')}</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col justify-end">
                                            <div className="space-y-2 text-sm text-muted-foreground pt-4 border-t border-border">
                                                <div className="flex justify-between items-center">
                                                    <span>Độ hiếm:</span>
                                                    <Badge variant={getRarityBadgeVariant(pokemon.rarity)}>{pokemon.rarity}</Badge>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>Cấp độ yêu cầu:</span>
                                                    <span className="text-foreground font-medium">{pokemon.conditionLevel}</span>
                                                </div>
                                                <p className="text-xs pt-2 text-foreground/80 line-clamp-2 h-8">{pokemon.description.replace(/\\n/g, ' ')}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    {/* Pagination */}
                    <CardFooter className="justify-between">
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={pokemonData?.pagination?.totalPage || 1}
                            totalItems={pokemonData?.pagination?.totalItem || 0}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                            isLoading={isPokemonLoading}
                        />
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}