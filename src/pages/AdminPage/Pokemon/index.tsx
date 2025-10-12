import { useState } from "react";
import { Search, Plus, Edit, Trash2, MoreVertical, Filter, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Badge } from "@ui/Badge";
import HeaderAdmin from "@organisms/Header/Admin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/DropdownMenu";
import { EnhancedPagination } from "@ui/Pagination";
import { usePokemonList } from "@hooks/usePokemon";
import { useElementalTypeList } from "@hooks/useElemental";

const ITEMS_PER_PAGE = 9;

export default function PokemonManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // 1. Truyền các state filter vào custom hook
    const { data: pokemonData, isLoading: isPokemonLoading, error: pokemonError } = usePokemonList({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        type: selectedType === 'all' ? undefined : selectedType, // Gửi 'undefined' nếu là 'all'
        search: searchQuery || undefined, // Gửi 'undefined' nếu chuỗi rỗng
    });

    // 2. Fetch danh sách các hệ một lần duy nhất
    const { data: typesData, isLoading: isTypesLoading } = useElementalTypeList({ page: 1, limit: 100 });

    const getRarityBadgeVariant = (rarity: string) => {
        switch (rarity) {
            case "RARE": return "secondary";
            case "LEGENDARY": return "destructive";
            default: return "outline";
        }
    };

    // 3. Tách hàm xử lý sự kiện để reset page khi filter
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        setCurrentPage(1);
    };

    return (
        <div className="p-8">
            <HeaderAdmin title="Quản lý Pokémon" description="Quản lý tất cả Pokémon trong hệ thống" />

            <Card className="bg-card border-border mt-8">
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <CardTitle className="text-foreground">Danh sách Pokémon</CardTitle>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="pl-10 bg-background border-border text-foreground w-full"
                                />
                            </div>
                            <Select value={selectedType} onValueChange={handleTypeChange}>
                                <SelectTrigger className="w-[180px] bg-background border-border text-foreground">
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
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Plus className="h-4 w-4 mr-2" /> Thêm
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-card border-border max-w-2xl">
                                    <DialogHeader><DialogTitle className="text-foreground">Thêm Pokémon mới</DialogTitle></DialogHeader>
                                    {/* Form fields here */}
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* 4. Thêm trạng thái loading và xử lý lỗi */}
                    {isPokemonLoading ? (
                        <div className="flex justify-center items-center h-96">
                            <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : pokemonError ? (
                        <div className="text-red-500 text-center h-96 flex items-center justify-center">
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
                {/* 5. Chỉ hiển thị pagination khi có dữ liệu */}
                <CardFooter className="flex justify-end">
                    {!isPokemonLoading && pokemonData && (
                        <EnhancedPagination
                            currentPage={currentPage}
                            totalPages={pokemonData.pagination?.totalPage || 1}
                            totalItems={pokemonData.pagination?.totalItem || 0}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}