import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepo: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postsRepo.find();
  }

  async getPostById(id: number): Promise<Post | null> {
    const post = await this.postsRepo.findOne({ where: { id } });
    if (post) {
      return post;
    }

    throw new NotFoundException('Not found');
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    const newPost = this.postsRepo.create(data);
    await this.postsRepo.save(newPost);

    return newPost;
  }

  async replacePost(id: number, post: UpdatePostDto): Promise<Post> {
    await this.postsRepo.update(id, post);

    const updatedPost = await this.postsRepo.findOne({ where: { id } });
    if (updatedPost) {
      return updatedPost;
    }

    throw new NotFoundException('Not found');
  }

  async deletePost(id: number): Promise<string> {
    const deletedResponse = await this.postsRepo.delete(id);
    if (deletedResponse.affected) {
      return `Post with ID: ${id} was removed`;
    }

    throw new NotFoundException('Not found');
  }
}
