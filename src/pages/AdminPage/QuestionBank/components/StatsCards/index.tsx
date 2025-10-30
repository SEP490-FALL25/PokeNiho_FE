import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { BookOpen } from "lucide-react";
import { QuestionEntityType } from "@models/questionBank/entity";

const StatsCards: React.FC<COMPONENTS.IStatsCardsProps> = ({ questions, totalItems }) => {
  const countByLevel = (level: number) => questions.filter((q: QuestionEntityType) => q.levelN === level).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">Tổng câu hỏi</CardTitle>
          <BookOpen className="w-5 h-5 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{totalItems || 0}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">Câu hỏi N5</CardTitle>
          <Badge className="bg-green-200 text-green-800">N5</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{countByLevel(5)}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">Câu hỏi N4</CardTitle>
          <Badge className="bg-blue-200 text-blue-800">N4</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{countByLevel(4)}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">Câu hỏi N3</CardTitle>
          <Badge className="bg-yellow-200 text-yellow-800">N3</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{countByLevel(3)}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">Câu hỏi N2</CardTitle>
          <Badge className="bg-orange-200 text-orange-800">N2</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{countByLevel(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;


