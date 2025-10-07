import { Badge } from "@ui/Badge";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table";
import { Input } from "@ui/Input";
import { Edit, Plus, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import useKanjiList from "@hooks/useKanji";
import { useState } from "react";
import { Kanji } from "@models/kanji/entity";
import { EnhancedPagination as Pagination } from "@ui/Pagination";

interface KanjiVocabulary {
    isAddKanjiDialogOpen: boolean;
    setIsAddKanjiDialogOpen: (value: boolean) => void;
    onyomiReadings: string[];
    setOnyomiReadings: (value: string[]) => void;
    kunyomiReadings: string[];
    setKunyomiReadings: (value: string[]) => void;
    meanings: { vi: string; en: string }[];
    setMeanings: (value: { vi: string; en: string }[]) => void;
}

const KanjiVocabulary = ({ isAddKanjiDialogOpen, setIsAddKanjiDialogOpen, onyomiReadings, setOnyomiReadings, kunyomiReadings, setKunyomiReadings, meanings, setMeanings }: KanjiVocabulary) => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const { data, isLoading, error } = useKanjiList({
        page,
        limit,
        search: "",
        sortOrder: "asc",
        sortBy: "id",
        jlptLevel: "",
        strokeCount: "",
    });

    const kanjiList = data?.data;

    return (
        <Card className="shadow-lg bg-white">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-800">Quản lý Kanji</CardTitle>
                    <Dialog open={isAddKanjiDialogOpen} onOpenChange={setIsAddKanjiDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md transition-transform transform hover:scale-105">
                                <Plus className="h-5 w-5 mr-2" />
                                Thêm mới
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-gray-200 shadow-xl max-w-3xl rounded-xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-gray-800">Thêm Kanji mới</DialogTitle>
                            </DialogHeader>
                            <Tabs defaultValue="info" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
                                    <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-md">Thông tin</TabsTrigger>
                                    <TabsTrigger value="readings" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-md">Cách đọc</TabsTrigger>
                                    <TabsTrigger value="meanings" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-md">Ý nghĩa</TabsTrigger>
                                </TabsList>
                                <div className="max-h-[60vh] overflow-y-auto p-1 mt-2">

                                    <TabsContent value="info">
                                        <Card className="border-none shadow-none">
                                            <CardContent className="space-y-6 pt-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Ký tự Kanji</label>
                                                    <Input placeholder="日" className="bg-gray-50 border-gray-300 text-gray-800 rounded-lg" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-700">Số nét</label>
                                                        <Input type="number" placeholder="4" className="bg-gray-50 border-gray-300 text-gray-800 rounded-lg" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-700">Cấp độ JLPT</label>
                                                        <Select>
                                                            <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-800 rounded-lg">
                                                                <SelectValue placeholder="Chọn cấp độ" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="5">N5</SelectItem>
                                                                <SelectItem value="4">N4</SelectItem>
                                                                <SelectItem value="3">N3</SelectItem>
                                                                <SelectItem value="2">N2</SelectItem>
                                                                <SelectItem value="1">N1</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="readings">
                                        <Card className="border-none shadow-none">
                                            <CardContent className="space-y-6 pt-6">
                                                {/* Onyomi Readings */}
                                                {onyomiReadings.map((reading: string, index: number) => (
                                                    <div key={`onyomi-${index}`} className="flex items-center gap-2">
                                                        <Input placeholder={`Onyomi ${index + 1}`} className="bg-gray-50 border-gray-300" />
                                                        {index === onyomiReadings.length - 1 && <Button variant="ghost" size="icon" onClick={() => setOnyomiReadings([...onyomiReadings, ""])}><Plus className="w-5 h-5 text-green-500" /></Button>}
                                                        {onyomiReadings.length > 1 && <Button variant="ghost" size="icon" onClick={() => setOnyomiReadings(onyomiReadings.filter((_, i) => i !== index))}><Trash2 className="w-5 h-5 text-red-500" /></Button>}
                                                    </div>
                                                ))}
                                                <div className="border-t border-gray-200 my-4"></div>
                                                {/* Kunyomi Readings */}
                                                {kunyomiReadings.map((reading, index) => (
                                                    <div key={`kunyomi-${index}`} className="flex items-center gap-2">
                                                        <Input placeholder={`Kunyomi ${index + 1}`} className="bg-gray-50 border-gray-300" />
                                                        {index === kunyomiReadings.length - 1 && <Button variant="ghost" size="icon" onClick={() => setKunyomiReadings([...kunyomiReadings, ""])}><Plus className="w-5 h-5 text-green-500" /></Button>}
                                                        {kunyomiReadings.length > 1 && <Button variant="ghost" size="icon" onClick={() => setKunyomiReadings(kunyomiReadings.filter((_, i) => i !== index))}><Trash2 className="w-5 h-5 text-red-500" /></Button>}
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="meanings">
                                        <Card className="border-none shadow-none">
                                            <CardContent className="space-y-4 pt-6">
                                                {meanings.map((meaning, index) => (
                                                    <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-4 relative">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700">Tiếng Việt</label>
                                                            <Input placeholder="VD: mặt trời" className="bg-white border-gray-300" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700">Tiếng Anh</label>
                                                            <Input placeholder="VD: sun" className="bg-white border-gray-300" />
                                                        </div>
                                                        {meanings.length > 1 && <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => setMeanings(meanings.filter((_, i) => i !== index))}><Trash2 className="w-4 h-4 text-red-500" /></Button>}
                                                    </div>
                                                ))}
                                                <Button variant="outline" className="w-full mt-4 border-dashed" onClick={() => setMeanings([...meanings, { vi: "", en: "" }])}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Thêm ý nghĩa
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </div>

                            </Tabs>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddKanjiDialogOpen(false)}
                                    className="rounded-full"
                                >
                                    Hủy
                                </Button>
                                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md">Thêm</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kanji</TableHead>
                            <TableHead>Nghĩa</TableHead>
                            <TableHead>Số nét</TableHead>
                            <TableHead>JLPT</TableHead>
                            <TableHead>On'yomi</TableHead>
                            <TableHead>Kun'yomi</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {kanjiList?.results?.map((k: Kanji) => (
                            console.log('k', k),
                            <TableRow key={k.id}>
                                <TableCell className="text-2xl font-bold">{k.character}</TableCell>
                                {/* <TableCell>{k.meaning || ''}</TableCell> */}<TableCell>{''}</TableCell>
                                <TableCell>{k.strokeCount}</TableCell>
                                <TableCell><Badge>N{k.jlptLevel}</Badge></TableCell>
                                {/* <TableCell>{k.onyomi.join(', ')}</TableCell>*/}<TableCell>{''}</TableCell>
                                {/* <TableCell>{k.kunyomi.join(', ')}</TableCell>*/}<TableCell>{''}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination
                    className="mt-4"
                    currentPage={kanjiList?.pagination?.current || 0}
                    totalPages={kanjiList?.pagination?.totalPage || 0}
                    totalItems={kanjiList?.pagination?.totalItem || 0}
                    itemsPerPage={kanjiList?.pagination?.pageSize || 0}
                    onPageChange={(nextPage: number) => { setPage(nextPage); }}
                />
            </CardContent>
        </Card>
    )
}

export default KanjiVocabulary