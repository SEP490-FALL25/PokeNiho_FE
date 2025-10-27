import { axiosPrivate } from "@configs/axios";

const exerciseService = {
  getExercisesByLessonId: async (lessonId: number) => {
    return axiosPrivate.get(`/exercises/lesson/${lessonId}`);
  },
};

export default exerciseService;
