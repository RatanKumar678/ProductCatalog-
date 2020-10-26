export interface Product {
    id: string;
    name: string;
    price: number;
    category_id: number;
    upvote_count: number;
    downvote_count: number;
    trend_score: number;
    tags: any;
}

export interface Category {
    id: number;
    name: string;
}
