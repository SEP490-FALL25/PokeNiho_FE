import React from "react";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Button } from "@ui/Button";

const FiltersBar: React.FC<COMPONENTS.IFiltersBarProps> = ({
  searchInput,
  setSearchInput,
  filters,
  handleFilterChange,
  language,
  QUESTION_TYPE_LABELS,
  JLPT_LEVEL_LABELS,
  openCreateDialog,
  t,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="mt-4 pb-4 flex-1 mr-4 focus:ring-primary focus:ring-2">
        <Input
          placeholder={t("questionBank.searchPlaceholder")}
          value={searchInput}
          isSearch
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={filters.levelN?.toString() || "all"}
          onValueChange={(value) =>
            handleFilterChange("levelN", value === "all" ? undefined : parseInt(value))
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder={String(t("questionBank.allLevels"))} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("questionBank.allLevels")}</SelectItem>
            {Object.entries(JLPT_LEVEL_LABELS[language as keyof typeof JLPT_LEVEL_LABELS] || {}).map(
              ([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select
          value={filters.questionType || "all"}
          onValueChange={(value) =>
            handleFilterChange("questionType", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder={String(t("questionBank.allQuestionTypes"))} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("questionBank.allQuestionTypes")}</SelectItem>
            {Object.entries(
              QUESTION_TYPE_LABELS[language as keyof typeof QUESTION_TYPE_LABELS] || {}
            ).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={openCreateDialog}
          className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          <span className="mr-2">+</span>
          {t("questionBank.addQuestion")}
        </Button>
      </div>
    </div>
  );
};

export default FiltersBar;


