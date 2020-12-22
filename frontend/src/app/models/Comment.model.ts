export class Comment {
    public id: number;
    public userId: number;
    public postId: number;
    public author: string;
    public comments: string;
    public Comments_Likes: CommentLikes[];
    public createdAt: string;
  }
  
  export class CommentLikes {
    public id: number;
    public userId: number;
    public likes: number;
    public dislikes: number;
    public commentId: number;
  }