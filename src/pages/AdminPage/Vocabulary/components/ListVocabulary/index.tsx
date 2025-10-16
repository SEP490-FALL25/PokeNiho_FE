
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import { Edit, Rows, Trash2, Volume2 } from "lucide-react";
import { Badge } from "@ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table";
import { Dialog, DialogTrigger } from "@ui/Dialog";
import { Plus } from "lucide-react";
import CreateVocabulary from "../CreateVocabulary";
import { useVocabularyList } from "@hooks/useVocabulary";
import { EnhancedPagination } from "@ui/Pagination";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Skeleton } from "@ui/Skeleton";

interface Vocabulary {
    isAddVocabularyDialogOpen: boolean;
    setIsAddVocabularyDialogOpen: (value: boolean) => void;
}

const ListVocabulary = ({ isAddVocabularyDialogOpen, setIsAddVocabularyDialogOpen }: Vocabulary) => {

    /**
     * Handle Vocabulary List Hook
     */
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("all");
    const [page, setPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(15);
    const { data: vocabularies, isLoading } = useVocabularyList({
        page: page,
        limit: itemsPerPage,
        search: searchQuery,
        levelN: activeTab === "all" ? undefined : activeTab,
    });
    //--------------------------------End--------------------------------//


    /**
     * handle play audio
     * @param audioUrl 
     */
    const handlePlayAudio = (audioUrl: string) => {
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    };
    //--------------------------------End--------------------------------//

    /**
     * get type badge color
     * @param type 
     * @returns 
     */
    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case "noun":
                return "bg-blue-500 text-white";
            case "verb":
                return "bg-green-500 text-white";
            case "adjective":
                return "bg-yellow-500 text-white";
            case "adverb":
                return "bg-indigo-500 text-white";
            case "particle":
                return "bg-pink-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };
    //--------------------------------End--------------------------------//


    /**
     * get level badge color
     * @param level 
     * @returns 
     */

    //--------------------------------End--------------------------------//

    /**
     * Handle items per page change
     */
    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value));
        setPage(1);
    };
    //--------------------------------End--------------------------------//

    /**
     * Skeleton component for loading state
     */
    const VocabularySkeleton = () => (
        <Table>
            <TableHeader>
                <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-600 font-semibold">Tiếng Nhật</TableHead>
                    <TableHead className="text-gray-600 font-semibold">Cách đọc</TableHead>
                    <TableHead className="text-gray-600 font-semibold">Loại từ</TableHead>
                    <TableHead className="text-gray-600 font-semibold">Cấp độ</TableHead>
                    <TableHead className="text-gray-600 font-semibold">Media</TableHead>
                    <TableHead>
                        <div className="text-center font-semibold text-gray-600">Hành động</div>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                    <TableRow key={index} className="border-gray-200 hover:bg-gray-50">
                        <TableCell>
                            <Skeleton className="h-6 w-24" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-20" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-6 w-12 rounded-full" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <Card className="bg-white shadow-lg">
            <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-800">Danh sách từ vựng</CardTitle>
                </div>

                <div className="flex items-center justify-between">
                    <div className="mt-4 pb-4 flex-1 mr-4 focus:ring-primary focus:ring-2">
                        <Input
                            placeholder="Tìm kiếm từ vựng..."
                            value={searchQuery}
                            isSearch
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Dialog open={isAddVocabularyDialogOpen} onOpenChange={setIsAddVocabularyDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-white hover:bg-primary/90">
                                <Plus className="h-4 w-4" /> Thêm
                            </Button>
                        </DialogTrigger>
                        <CreateVocabulary setIsAddDialogOpen={setIsAddVocabularyDialogOpen} />
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-100 p-1 rounded-full">
                        <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-1.5 text-sm font-semibold transition-colors">
                            Tất cả
                        </TabsTrigger>
                        <TabsTrigger value="5" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-1.5 text-sm font-semibold transition-colors">
                            N5
                        </TabsTrigger>
                        <TabsTrigger value="4" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-1.5 text-sm font-semibold transition-colors">
                            N4
                        </TabsTrigger>
                        <TabsTrigger value="3" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-1.5 text-sm font-semibold transition-colors">
                            N3
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab} className="mt-6">
                        {isLoading ? (
                            <VocabularySkeleton />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-200 hover:bg-gray-50">
                                        <TableHead className="text-gray-600 font-semibold">Tiếng Nhật</TableHead>
                                        <TableHead className="text-gray-600 font-semibold">Cách đọc</TableHead>
                                        <TableHead className="text-gray-600 font-semibold">Loại từ</TableHead>
                                        <TableHead className="text-gray-600 font-semibold">Cấp độ</TableHead>
                                        <TableHead className="text-gray-600 font-semibold">Media</TableHead>
                                        <TableHead>
                                            <div className="text-center font-semibold text-gray-600">Hành động</div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vocabularies?.results?.map((vocab: any) => (
                                        <TableRow key={vocab.id} className="border-gray-200 hover:bg-gray-50">
                                            <TableCell className="font-semibold text-lg text-gray-800">{vocab.wordJp}</TableCell>
                                            <TableCell className="text-gray-500">{vocab.reading}</TableCell>
                                            <TableCell>
                                                <Badge className={getTypeBadgeColor(vocab.wordType.name) + " font-semibold"}>
                                                    {vocab.wordType.name.charAt(0).toUpperCase() + vocab.wordType.name.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={"text-white font-semibold"}>N{vocab.levelN}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {vocab.audioUrl && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-blue-500 hover:bg-blue-100 rounded-full"
                                                            onClick={() => handlePlayAudio(vocab.audioUrl)}
                                                        >
                                                            <Volume2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="flex justify-center items-center">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-full">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-100 rounded-full">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>

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
                {!isLoading && vocabularies?.pagination && (
                    <EnhancedPagination
                        currentPage={vocabularies.pagination.current || 1}
                        totalPages={vocabularies.pagination.totalPage || 0}
                        totalItems={vocabularies.pagination.totalItem || 0}
                        itemsPerPage={vocabularies.pagination.pageSize || 0}
                        onPageChange={(nextPage: number) => { setPage(nextPage); }}
                    />
                )}
            </CardFooter>
        </Card>
    )
}

export default ListVocabulary