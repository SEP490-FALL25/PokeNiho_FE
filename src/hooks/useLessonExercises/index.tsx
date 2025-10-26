import { useState, useEffect } from 'react'

interface ExerciseItem {
    id: number;
    title: string;
    lessonId: number;
    lessonTitle: string;
    lessonSlug: string;
    lessonLevel: number;
    type: 'multiple_choice' | 'fill_blank' | 'listening' | 'speaking';
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
    estimatedTime: number;
    isActive: boolean;
    createdAt: string;
    description?: string;
}

export const useLessonExercises = (lessonId: number | null) => {
    const [exercises, setExercises] = useState<ExerciseItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!lessonId) {
            setExercises([])
            return
        }

        const fetchExercises = async () => {
            setIsLoading(true)
            setError(null)
            
            try {
                // TODO: Replace with actual API call
                // const response = await lessonExercisesApi.getByLessonId(lessonId)
                
                // Mock data for now
                const mockExercises: ExerciseItem[] = [
                    {
                        id: 1,
                        title: "Hiragana Recognition Quiz",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonSlug: "basic-hiragana",
                        lessonLevel: 5,
                        type: 'multiple_choice',
                        difficulty: 'easy',
                        questionCount: 10,
                        estimatedTime: 15,
                        isActive: true,
                        createdAt: '2024-01-15',
                        description: 'Test your knowledge of basic Hiragana characters'
                    },
                    {
                        id: 2,
                        title: "Hiragana Writing Practice",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonSlug: "basic-hiragana",
                        lessonLevel: 5,
                        type: 'fill_blank',
                        difficulty: 'medium',
                        questionCount: 20,
                        estimatedTime: 25,
                        isActive: true,
                        createdAt: '2024-01-16',
                        description: 'Practice writing Hiragana characters'
                    },
                    {
                        id: 3,
                        title: "Hiragana Listening Test",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonSlug: "basic-hiragana",
                        lessonLevel: 5,
                        type: 'listening',
                        difficulty: 'hard',
                        questionCount: 15,
                        estimatedTime: 20,
                        isActive: false,
                        createdAt: '2024-01-17',
                        description: 'Listen and identify Hiragana characters'
                    }
                ]
                
                setExercises(mockExercises)
            } catch (err) {
                setError('Failed to fetch lesson exercises')
                console.error('Error fetching lesson exercises:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchExercises()
    }, [lessonId])

    const createExercise = async (exerciseData: Omit<ExerciseItem, 'id' | 'createdAt'>) => {
        try {
            // TODO: Implement API call
            const newExercise: ExerciseItem = {
                ...exerciseData,
                id: Date.now(), // Temporary ID
                createdAt: new Date().toISOString().split('T')[0]
            }
            setExercises(prev => [...prev, newExercise])
            return newExercise
        } catch (error) {
            throw new Error('Failed to create exercise')
        }
    }

    const updateExercise = async (id: number, exerciseData: Partial<ExerciseItem>) => {
        try {
            // TODO: Implement API call
            setExercises(prev => prev.map(exercise => 
                exercise.id === id ? { ...exercise, ...exerciseData } : exercise
            ))
        } catch (error) {
            throw new Error('Failed to update exercise')
        }
    }

    const deleteExercise = async (id: number) => {
        try {
            // TODO: Implement API call
            setExercises(prev => prev.filter(exercise => exercise.id !== id))
        } catch (error) {
            throw new Error('Failed to delete exercise')
        }
    }

    return {
        exercises,
        isLoading,
        error,
        createExercise,
        updateExercise,
        deleteExercise
    }
}
