import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './post.interface';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostsService {
  private nextId = 4;
  private posts: Post[] = [
    {
      id: 1,
      title: 'First post',
      content: 'First post content',
    },
    {
      id: 2,
      title: 'Second post',
      content: 'Second post content',
    },
    {
      id: 3,
      title: 'Third post',
      content: 'Third post content',
    },
  ];

  async getAllPosts(): Promise<Post[]> {
    return this.posts;
  }

  async getPostById(id: number): Promise<Post | null> {
    const post = this.posts.find((post) => post.id === id);
    if (post) {
      return post;
    }

    throw new NotFoundException('Not found');
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    const newPost = {
      id: this.nextId++,
      ...data,
    };

    this.posts.push(newPost);

    return newPost;
  }

  async replacePost(id: number, post: UpdatePostDto): Promise<Post> {
    const targetPostIdx = this.posts.findIndex((post) => post.id === id);
    if (targetPostIdx > -1) {
      this.posts[targetPostIdx] = post;
      return post;
    }

    throw new NotFoundException('Not found');
  }

  async deletePost(id: number): Promise<string> {
    const targetPostIdx = this.posts.findIndex((post) => post.id === id);
    if (targetPostIdx > -1) {
      this.posts.splice(targetPostIdx, 1);
      return `Post with ID: ${id} was removed`;
    }

    throw new NotFoundException('Not found');
  }
}
