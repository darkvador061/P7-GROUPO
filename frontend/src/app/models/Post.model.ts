export class Post {
    public id: number;
    public userId: number;
    public author: string;
    public title: string;
    public content: string;
    public Comments: Comment[];
    public imageUrl: string;
    public Posts_Likes: PostLikes[];
    public User: User;
    public createdAt: string;
  }
  
  export class PostLikes {
    public id: number;
    public userId: number;
    public likes: number;
    public dislikes: number;
    public postId: number;
  }
  
  export class User {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public imageUrl: string;
  }