// db/schema.ts

export interface IBlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    authorId: string;
    authorName: string;
    authorRole?: string;
    authorAvatar?: string;
    readTime: number;
    tags: string[];
    likes: number;
    comments: number;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface IBlogPostInsert {
    title: string;
    excerpt: string;
    content: string;
    authorId: string;
    authorName: string;
    authorRole?: string;
    authorAvatar?: string;
    readTime: number;
    tags: string[];
    slug: string;
}

export interface IBlogComment {
    id: number;
    postId: number;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    likes: number;
    createdAt: string;
    updatedAt: string;
}

export interface IBlogCommentInsert {
    postId: number;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
}
