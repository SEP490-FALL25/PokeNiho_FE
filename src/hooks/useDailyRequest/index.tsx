import { ICreateDailyRequestRequest } from "@models/dailyRequest/request";
import dailyRequestService from "@services/dailyRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Handle Create Daily Request
 * @returns { createDailyRequestMutation }
 */
export const useCreateDailyRequest = () => {
    const queryClient = useQueryClient();
    const createDailyRequestMutation = useMutation({
        mutationFn: (data: ICreateDailyRequestRequest) => dailyRequestService.createDailyRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daily-request-list'] });
        },
    });
    return createDailyRequestMutation;
};