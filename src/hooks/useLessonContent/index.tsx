import { useState, useEffect } from "react";
import lessonService from "@services/lesson";
import {
  LessonContent,
  ICreateLessonContentRequest,
} from "@models/lessonContent/entity";

export const useLessonContent = (lessonId: number | null) => {
  const [contents, setContents] = useState<LessonContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) {
      setContents([]);
      return;
    }

    const fetchContents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await lessonService.getLessonContentList({
          lessonId: lessonId!,
          page: 1,
          limit: 100, // Get all contents for now
          sortBy: "contentOrder",
          sort: "asc",
        });
        console.log(response);
        // Use API response directly
        const apiContents: LessonContent[] = response.data?.data || [];
        setContents(apiContents);
      } catch (err) {
        setError("Failed to fetch lesson content");
        console.error("Error fetching lesson content:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [lessonId]);

  const updateContent = async (
    id: number,
    contentData: Partial<LessonContent>
  ) => {
    try {
      // TODO: Implement API call
      setContents((prev) =>
        prev.map((content) =>
          content.id === id ? { ...content, ...contentData } : content
        )
      );
    } catch (err) {
      console.error("Error updating content:", err);
      throw new Error("Failed to update content");
    }
  };

  const deleteContent = async (id: number) => {
    try {
      // TODO: Implement API call
      setContents((prev) => prev.filter((content) => content.id !== id));
    } catch (err) {
      console.error("Error deleting content:", err);
      throw new Error("Failed to delete content");
    }
  };

  const refreshContents = async () => {
    if (!lessonId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await lessonService.getLessonContentList({
        lessonId: lessonId,
        page: 1,
        limit: 100,
        sortBy: "contentOrder",
        sort: "asc",
      });

      const apiContents: LessonContent[] = response.data.data;
      setContents(apiContents);
    } catch (err) {
      setError("Failed to fetch lesson content");
      console.error("Error fetching lesson content:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createMultipleContents = async (
    contentType: string,
    contentIds: number[]
  ) => {
    if (!lessonId) {
      throw new Error("Lesson ID is required");
    }

    try {
      const data: ICreateLessonContentRequest = {
        lessonId,
        contentId: contentIds,
        contentType,
      };

      const response = await lessonService.createLessonContent(data);

      // Refresh contents after successful creation
      await refreshContents();

      return response.data;
    } catch (err) {
      console.error("Error creating multiple contents:", err);
      throw new Error("Failed to create multiple contents");
    }
  };

  return {
    contents,
    isLoading,
    error,

    updateContent,
    deleteContent,
    refreshContents,
    createMultipleContents,
  };
};
