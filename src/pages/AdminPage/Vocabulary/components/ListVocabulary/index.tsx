
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import { Edit, Trash2, Volume2, ImageIcon } from "lucide-react";
import { Badge } from "@ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table";
import { Dialog, DialogTrigger } from "@ui/Dialog";
import { Plus } from "lucide-react";
import CreateVocabulary from "../CreateVocabulary";

interface Vocabulary {
    isAddVocabularyDialogOpen: boolean;
    setIsAddVocabularyDialogOpen: (value: boolean) => void;
    onyomiReadings: string[];
    setOnyomiReadings: (value: string[]) => void;
    kunyomiReadings: string[];
    setKunyomiReadings: (value: string[]) => void;
    meanings: { vi: string; en: string }[];
    setMeanings: (value: { vi: string; en: string }[]) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    activeTab: string;
    setActiveTab: (value: string) => void;
    filteredVocabularies: any[];
}

const ListVocabulary = ({ isAddVocabularyDialogOpen, setIsAddVocabularyDialogOpen, onyomiReadings, setOnyomiReadings, kunyomiReadings, setKunyomiReadings, meanings, setMeanings, searchQuery, setSearchQuery, activeTab, setActiveTab, filteredVocabularies }: Vocabulary) => {

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

    const getLevelBadgeColor = (level: string) => {
        switch (level) {
            case "N5":
                return "bg-green-200 text-green-800";
            case "N4":
                return "bg-blue-200 text-blue-800";
            case "N3":
                return "bg-yellow-200 text-yellow-800";
            case "N2":
                return "bg-purple-200 text-purple-800";
            case "N1":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    return (
        <Card className="bg-white shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-800">Danh sách từ vựng</CardTitle>
                </div>
                <div className="mt-4 pb-4 focus:ring-primary focus:ring-2">
                    <Input
                        placeholder="Tìm kiếm từ vựng..."
                        value={searchQuery}
                        isSearch
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Dialog open={isAddVocabularyDialogOpen} onOpenChange={setIsAddVocabularyDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" /> Thêm
                        </Button>
                    </DialogTrigger>
                    <CreateVocabulary setIsAddDialogOpen={setIsAddVocabularyDialogOpen} />
                </Dialog>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-100 p-1 rounded-full">
                        <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-1.5 text-sm font-semibold transition-colors">
                            Tất cả
                        </TabsTrigger>
                        <TabsTrigger value="N5" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-1.5 text-sm font-semibold transition-colors">
                            N5
                        </TabsTrigger>
                        <TabsTrigger value="N4" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-1.5 text-sm font-semibold transition-colors">
                            N4
                        </TabsTrigger>
                        <TabsTrigger value="N3" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-1.5 text-sm font-semibold transition-colors">
                            N3
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab} className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-200 hover:bg-gray-50">
                                    <TableHead className="text-gray-600 font-semibold">Tiếng Nhật</TableHead>
                                    <TableHead className="text-gray-600 font-semibold">Hiragana</TableHead>
                                    <TableHead className="text-gray-600 font-semibold">Tiếng Việt</TableHead>
                                    <TableHead className="text-gray-600 font-semibold">Loại từ</TableHead>
                                    <TableHead className="text-gray-600 font-semibold">Cấp độ</TableHead>
                                    <TableHead className="text-gray-600 font-semibold">Kanji</TableHead>
                                    <TableHead className="text-gray-600 font-semibold">Media</TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVocabularies.map((vocab: any) => (
                                    <TableRow key={vocab.id} className="border-gray-200 hover:bg-gray-50">
                                        <TableCell className="font-semibold text-lg text-gray-800">{vocab.japanese}</TableCell>
                                        <TableCell className="text-gray-500">{vocab.hiragana}</TableCell>
                                        <TableCell className="text-gray-700">{vocab.vietnamese}</TableCell>
                                        <TableCell>
                                            <Badge className={getTypeBadgeColor(vocab.type) + " font-semibold"}>
                                                {vocab.type.charAt(0).toUpperCase() + vocab.type.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getLevelBadgeColor(vocab.level) + " font-semibold"}>{vocab.level}</Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-500">{vocab.kanji}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {vocab.hasAudio && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-100 rounded-full">
                                                        <Volume2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {vocab.hasImage && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:bg-green-100 rounded-full">
                                                        <ImageIcon className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-full">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-100 rounded-full">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default ListVocabulary