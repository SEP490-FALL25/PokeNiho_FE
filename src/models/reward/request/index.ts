export interface ICreateRewardRequest {
    name: string;
    rewardType: string;
    rewardItem: number;
    rewardTarget: string;
}

export interface IQueryRewardRequest {
    page?: number;
    limit?: number;
    sortBy?: string;
    sort?: 'asc' | 'desc';
    name?: string;
    rewardType?: string;
    rewardTarget?: string;
}
