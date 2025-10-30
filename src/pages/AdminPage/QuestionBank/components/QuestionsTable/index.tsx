import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@ui/Table";
import SortableTableHeader from "@ui/SortableTableHeader";
import { Button } from "@ui/Button";
import { Badge } from "@ui/Badge";
import { Edit, Trash2 } from "lucide-react";
import { QuestionEntityType } from "@models/questionBank/entity";

const QuestionsTable: React.FC<COMPONENTS.IQuestionsTableProps> = ({
  isLoading,
  questions,
  filters,
  handleSort,
  getQuestionTypeLabel,
  openEditDialog,
  setDeleteQuestionId,
  t,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="border-gray-200 hover:bg-gray-50">
            <SortableTableHeader
              title={t("questionBank.questionId")}
              sortKey="id"
              currentSortBy={filters.sortBy}
              currentSort={filters.sortOrder as "asc" | "desc"}
              onSort={handleSort}
              className="text-gray-600 font-semibold w-12"
            />
            <SortableTableHeader
              title={t("questionBank.question")}
              sortKey="questionJp"
              currentSortBy={filters.sortBy}
              currentSort={filters.sortOrder as "asc" | "desc"}
              onSort={handleSort}
              className="text-gray-600 font-semibold w-64"
            />
            <SortableTableHeader
              title={t("questionBank.questionType")}
              sortKey="questionType"
              currentSortBy={filters.sortBy}
              currentSort={filters.sortOrder as "asc" | "desc"}
              onSort={handleSort}
              className="text-gray-600 font-semibold w-20"
            />
            <SortableTableHeader
              title={t("questionBank.level")}
              sortKey="levelN"
              currentSortBy={filters.sortBy}
              currentSort={filters.sortOrder as "asc" | "desc"}
              onSort={handleSort}
              className="text-gray-600 font-semibold w-16"
            />
            <SortableTableHeader
              title={t("questionBank.meaning")}
              sortKey="meaning"
              currentSortBy={filters.sortBy}
              currentSort={filters.sortOrder as "asc" | "desc"}
              onSort={handleSort}
              className="text-gray-600 font-semibold w-32"
            />
            <SortableTableHeader
              title={t("questionBank.actions")}
              sortable={false}
              className="text-right w-20"
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {t("common.loading")}
              </TableCell>
            </TableRow>
          ) : questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {t("questionBank.noQuestions")}
              </TableCell>
            </TableRow>
          ) : (
            questions.map((question: QuestionEntityType) => (
              <TableRow key={question.id} className="border-gray-200 hover:bg-gray-50 h-12">
                <TableCell className="font-medium w-12 whitespace-nowrap text-sm py-2">
                  {question.id}
                </TableCell>
                <TableCell className="truncate py-2 w-64">
                  <div className="max-w-60">
                    <div className="font-medium text-sm truncate leading-tight">
                      {question.questionJp}
                    </div>
                    <div className="text-xs text-gray-500 truncate leading-tight">
                      {question.pronunciation || "No pronunciation"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="w-20 whitespace-nowrap py-2">
                  <Badge variant="secondary" className="text-xs">
                    {getQuestionTypeLabel(question.questionType)}
                  </Badge>
                </TableCell>
                <TableCell className="w-16 whitespace-nowrap py-2">
                  <Badge variant="outline" className="text-xs">N{question.levelN}</Badge>
                </TableCell>
                <TableCell className="w-32 py-2">
                  {question.meanings && question.meanings.length > 0 ? (
                    <div className="text-gray-500 text-xs space-y-1">
                      {question.meanings.map((meaning: COMPONENTS.IQuestionMeaningLike, index: number) => (
                        <div key={index} className="truncate">
                          {"language" in meaning && "value" in meaning ? (
                            <>
                              <span className="font-medium">{meaning.language}:</span> {meaning.value}
                            </>
                          ) : (
                            <>
                              {"translations" in meaning && meaning.translations?.vi && (
                                <div>vi: {meaning.translations.vi}</div>
                              )}
                              {"translations" in meaning && meaning.translations?.en && (
                                <div>en: {meaning.translations.en}</div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : question.meaning ? (
                    <div className="text-gray-500 text-xs">{question.meaning}</div>
                  ) : (
                    <span className="text-gray-400 text-xs">No translation</span>
                  )}
                </TableCell>
                <TableCell className="text-right w-20 py-2">
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEditDialog(question)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:bg-red-100"
                      onClick={() => setDeleteQuestionId(question.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionsTable;


