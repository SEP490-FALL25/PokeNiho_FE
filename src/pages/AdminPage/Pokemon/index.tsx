import { useState } from "react";
import { Edit, Trash2, MoreVertical, Filter, LoaderCircle, Rows } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Badge } from "@ui/Badge";
import HeaderAdmin from "@organisms/Header/Admin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/DropdownMenu";
import { EnhancedPagination } from "@ui/Pagination";
import { usePokemonList } from "@hooks/usePokemon";
import { useElementalTypeList } from "@hooks/useElemental";
import { RarityPokemon } from "@constants/pokemon";
import CreatePokemon from "./components/CreatePokemon";


export default function PokemonManagement() {
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

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value));
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



    return (
        <>
            <HeaderAdmin title="Quản lý Pokémon" description="Quản lý tất cả Pokémon trong hệ thống" />
            <div className="p-8 mt-24">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2 w-full md:w-auto">
                            <div className="flex-1">
                                <Input
                                    placeholder="Tìm kiếm..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    isSearch
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={selectedType} onValueChange={handleTypeChange}>
                                    <SelectTrigger className="bg-background border-border text-foreground w-full md:w-auto">
                                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <SelectValue placeholder="Lọc theo hệ" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="all">Tất cả hệ</SelectItem>
                                        {isTypesLoading ? (
                                            <SelectItem value="loading" disabled>Đang tải...</SelectItem>
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
                                        <SelectValue placeholder="Lọc theo độ hiếm" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="all">Tất cả độ hiếm</SelectItem>
                                        {Object.values(RarityPokemon).map((rarity: string) => (
                                            <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <CreatePokemon
                                    isAddDialogOpen={isAddDialogOpen}
                                    setIsAddDialogOpen={setIsAddDialogOpen}
                                    dataTypes={typesData}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Pokemon List */}
                        {isPokemonLoading ? (
                            <div className="flex justify-center items-center h-96">
                                <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
                            </div>
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
                                                        <DropdownMenuItem className="text-foreground hover:bg-muted cursor-pointer"><Edit className="h-4 w-4 mr-2" /> Chỉnh sửa</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive hover:bg-destructive/10 cursor-pointer"><Trash2 className="h-4 w-4 mr-2" /> Xóa</DropdownMenuItem>
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
                    <CardFooter className="flex justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                                <SelectTrigger className="w-[100px] bg-background border-border text-foreground h-9">
                                    <Rows className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    {[15, 30, 45, 60].map(size => (
                                        <SelectItem key={size} value={String(size)}>{size} / trang</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {!isPokemonLoading && pokemonData && (
                            <EnhancedPagination
                                currentPage={currentPage}
                                totalPages={pokemonData.pagination?.totalPage || 1}
                                totalItems={pokemonData.pagination?.totalItem || 0}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}