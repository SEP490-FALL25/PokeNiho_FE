import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Languages, BookText } from "lucide-react";
import HeaderAdmin from "@organisms/Header/Admin";
import { Switch } from "@ui/Switch";
import KanjiVocabulary from "./components/Kanji";
import ListVocabulary from "./components/ListVocabulary";

interface Vocabulary {
    id: string;
    japanese: string;
    hiragana: string;
    vietnamese: string;
    type: "noun" | "verb" | "adjective" | "adverb" | "particle";
    level: "N5" | "N4" | "N3" | "N2" | "N1";
    kanji: string;
    example: string;
    hasAudio: boolean;
    hasImage: boolean;
}

const VocabularyManagement = () => {
    const [isAddVocabularyDialogOpen, setIsAddVocabularyDialogOpen] = useState<boolean>(false);
    const [isAddKanjiDialogOpen, setIsAddKanjiDialogOpen] = useState<boolean>(false);
    const [showKanji, setShowKanji] = useState<boolean>(false);


    // Mock data
    const vocabularies: Vocabulary[] = [
        {
            id: "1",
            japanese: "こんにちは",
            hiragana: "こんにちは",
            vietnamese: "Xin chào",
            type: "noun",
            level: "N5",
            kanji: "N/A",
            example: "こんにちは、田中さん。",
            hasAudio: true,
            hasImage: true,
        },
        {
            id: "2",
            japanese: "食べる",
            hiragana: "たべる",
            vietnamese: "Ăn",
            type: "verb",
            level: "N5",
            kanji: "食",
            example: "ご飯を食べる。",
            hasAudio: true,
            hasImage: false,
        },
        {
            id: "3",
            japanese: "美しい",
            hiragana: "うつくしい",
            vietnamese: "Đẹp",
            type: "adjective",
            level: "N4",
            kanji: "美",
            example: "美しい花。",
            hasAudio: true,
            hasImage: true,
        },
        {
            id: "4",
            japanese: "学校",
            hiragana: "がっこう",
            vietnamese: "Trường học",
            type: "noun",
            level: "N5",
            kanji: "学校",
            example: "学校に行く。",
            hasAudio: true,
            hasImage: true,
        },
        {
            id: "5",
            japanese: "速い",
            hiragana: "はやい",
            vietnamese: "Nhanh",
            type: "adjective",
            level: "N5",
            kanji: "速",
            example: "速い車。",
            hasAudio: true,
            hasImage: false,
        },
    ];

    const stats = {
        total: vocabularies.length,
        kanji: new Set(vocabularies.flatMap(v => v.kanji.split('').filter(c => c !== 'N' && c !== '/' && c !== 'A'))).size,
        n5: vocabularies.filter(v => v.level === 'N5').length,
        n4: vocabularies.filter(v => v.level === 'N4').length,
        n3: vocabularies.filter(v => v.level === 'N3').length,
    };


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
                            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Tổng Kanji</CardTitle>
                            <BookText className="w-5 h-5 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{stats.kanji}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Từ vựng N5</CardTitle>
                            <Badge className="bg-green-200 text-green-800">N5</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{stats.n5}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Từ vựng N4</CardTitle>
                            <Badge className="bg-blue-200 text-blue-800">N4</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{stats.n4}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Từ vựng N3</CardTitle>
                            <Badge className="bg-yellow-200 text-yellow-800">N3</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-800">{stats.n3}</div>
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