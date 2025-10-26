import { useState, useEffect } from 'react'

interface ContentItem {
    id: number;
    title: string;
    lessonId: number;
    lessonTitle: string;
    lessonSlug: string;
    lessonLevel: number;
    type: 'text' | 'video' | 'image' | 'audio' | 'document';
    size: string;
    duration?: number;
    isPublished: boolean;
    createdAt: string;
    description?: string;
    fileUrl?: string;
}

export const useLessonContent = (lessonId: number | null) => {
    const [contents, setContents] = useState<ContentItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!lessonId) {
            setContents([])
            return
        }

        const fetchContents = async () => {
            setIsLoading(true)
            setError(null)
            
            try {
                // TODO: Replace with actual API call
                // const response = await lessonContentApi.getByLessonId(lessonId)
                
                // Mock data for now
                const mockContents: ContentItem[] = [
                    {
                        id: 1,
                        title: "Introduction to Hiragana",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonSlug: "basic-hiragana",
                        lessonLevel: 5,
                        type: 'text',
                        size: '2.5 KB',
                        isPublished: true,
                        createdAt: '2024-01-15',
                        description: 'Basic introduction to Hiragana characters'
                    },
                    {
                        id: 2,
                        title: "Hiragana Pronunciation Video",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonSlug: "basic-hiragana",
                        lessonLevel: 5,
                        type: 'video',
                        size: '15.2 MB',
                        duration: 180,
                        isPublished: true,
                        createdAt: '2024-01-16',
                        description: 'Video guide for Hiragana pronunciation'
                    },
                    {
                        id: 3,
                        title: "Hiragana Chart Image",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonSlug: "basic-hiragana",
                        lessonLevel: 5,
                        type: 'image',
                        size: '1.8 MB',
                        isPublished: false,
                        createdAt: '2024-01-17',
                        description: 'Complete Hiragana character chart'
                    }
                ]
                
                setContents(mockContents)
            } catch (err) {
                setError('Failed to fetch lesson content')
                console.error('Error fetching lesson content:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchContents()
    }, [lessonId])

    const createContent = async (contentData: Omit<ContentItem, 'id' | 'createdAt'>) => {
        try {
            // TODO: Implement API call
            const newContent: ContentItem = {
                ...contentData,
                id: Date.now(), // Temporary ID
                createdAt: new Date().toISOString().split('T')[0]
            }
            setContents(prev => [...prev, newContent])
            return newContent
        } catch (error) {
            throw new Error('Failed to create content')
        }
    }

    const updateContent = async (id: number, contentData: Partial<ContentItem>) => {
        try {
            // TODO: Implement API call
            setContents(prev => prev.map(content => 
                content.id === id ? { ...content, ...contentData } : content
            ))
        } catch (error) {
            throw new Error('Failed to update content')
        }
    }

    const deleteContent = async (id: number) => {
        try {
            // TODO: Implement API call
            setContents(prev => prev.filter(content => content.id !== id))
        } catch (error) {
            throw new Error('Failed to delete content')
        }
    }

    return {
        contents,
        isLoading,
        error,
        createContent,
        updateContent,
        deleteContent
    }
}
