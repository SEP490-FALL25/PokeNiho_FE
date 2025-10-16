import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Skeleton } from "@ui/Skeleton";
import { Languages, BookText } from "lucide-react";
import HeaderAdmin from "@organisms/Header/Admin";
import { Switch } from "@ui/Switch";
import KanjiVocabulary from "./components/Kanji";
import ListVocabulary from "./components/ListVocabulary";
import { useVocabularyStatistics } from "@hooks/useVocabulary";

const VocabularyManagement = () => {
    const [isAddVocabularyDialogOpen, setIsAddVocabularyDialogOpen] = useState<boolean>(false);
    const [isAddKanjiDialogOpen, setIsAddKanjiDialogOpen] = useState<boolean>(false);
    const [showKanji, setShowKanji] = useState<boolean>(false);

    const { data: stats, isLoading, error } = useVocabularyStatistics();

    if (isLoading) {
        return (
            <>
                <HeaderAdmin title="Quản lý Kanji và Từ vựng" description="Quản lý tất cả kanji và từ vựng trong hệ thống" />
                <div className="p-8 mt-24">
                    {/* Stats section: show real titles/icons, skeleton only for numbers */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
                        <Card className="bg-white shadow-md">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Tổng từ vựng</CardTitle>
                                <Languages className="w-5 h-5 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                        <Card className="bg-white shadow-md">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Tổng Kanji</CardTitle>
                                <BookText className="w-5 h-5 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                        <Card className="bg-white shadow-md">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Từ vựng N5</CardTitle>
                                <Badge className="bg-green-200 text-green-800">N5</Badge>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                        <Card className="bg-white shadow-md">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Từ vựng N4</CardTitle>
                                <Badge className="bg-blue-200 text-blue-800">N4</Badge>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                        <Card className="bg-white shadow-md">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Từ vựng N3</CardTitle>
                                <Badge className="bg-yellow-200 text-yellow-800">N3</Badge>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toggle: show real icons and switch, no skeleton */}
                    <div className="flex items-center space-x-2 mb-6 p-2 bg-white rounded-full shadow-sm w-fit">
                        <Languages className={`w-6 h-6 transition-colors ${!showKanji ? 'text-primary' : 'text-gray-400'}`} />
                        <Switch checked={showKanji} onCheckedChange={setShowKanji} />
                        <BookText className={`w-6 h-6 transition-colors ${showKanji ? 'text-primary' : 'text-gray-400'}`} />
                    </div>

                    {/* Content: render actual components; they handle their own loading/skeletons */}
                    {showKanji ? (
                        <KanjiVocabulary
                            isAddKanjiDialogOpen={isAddKanjiDialogOpen}
                            setIsAddKanjiDialogOpen={setIsAddKanjiDialogOpen}
                        />
                    ) : (
                        <ListVocabulary
                            isAddVocabularyDialogOpen={isAddVocabularyDialogOpen}
                            setIsAddVocabularyDialogOpen={setIsAddVocabularyDialogOpen}
                        />
                    )}
                </div>
            </>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    return (
        <>
            <HeaderAdmin title="Quản lý Kanji và Từ vựng" description="Quản lý tất cả kanji và từ vựng trong hệ thống" />
            <div className="p-8 mt-24">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
                    <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Tổng từ vựng</CardTitle>
                            <Languages className="w-5 h-5 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{stats.totalVocabulary}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Tổng Kanji</CardTitle>
                            <BookText className="w-5 h-5 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{stats.totalKanji}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Từ vựng N5</CardTitle>
                            <Badge className="bg-green-200 text-green-800">N5</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{stats.vocabularyN5}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Từ vựng N4</CardTitle>
                            <Badge className="bg-blue-200 text-blue-800">N4</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{stats.vocabularyN4}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Từ vựng N3</CardTitle>
                            <Badge className="bg-yellow-200 text-yellow-800">N3</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{stats.vocabularyN3}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center space-x-2 mb-6 p-2 bg-white rounded-full shadow-sm w-fit">
                    <Languages className={`w-6 h-6 transition-colors ${!showKanji ? 'text-primary' : 'text-gray-400'}`} />
                    <Switch checked={showKanji} onCheckedChange={setShowKanji} />
                    <BookText className={`w-6 h-6 transition-colors ${showKanji ? 'text-primary' : 'text-gray-400'}`} />
                </div>
                {showKanji ? (
                    <KanjiVocabulary
                        isAddKanjiDialogOpen={isAddKanjiDialogOpen}
                        setIsAddKanjiDialogOpen={setIsAddKanjiDialogOpen}
                    />
                ) : (
                    <ListVocabulary
                        isAddVocabularyDialogOpen={isAddVocabularyDialogOpen}
                        setIsAddVocabularyDialogOpen={setIsAddVocabularyDialogOpen}
                    />
                )}
            </div>
        </>
    );
};

export default VocabularyManagement;