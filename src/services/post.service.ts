import { prisma } from '../config/database.config';
import { CreatePostDto, UpdatePostDto, ListPostsQuery } from '../validators/post.validator';
import { PostStatus } from '@prisma/client';

export class PostService {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async createPost(authorId: string, data: CreatePostDto) {
    const slug = this.generateSlug(data.title);

    const { tagIds, ...postData } = data;

    const post = await prisma.post.create({
      data: {
        ...postData,
        slug,
        authorId,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        tags: tagIds && tagIds.length > 0 ? {
          connect: tagIds.map((id) => ({ id })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  }

  async getPostById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (post) {
      // Increment view count
      await prisma.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return post;
  }

  async getPostBySlug(slug: string) {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (post) {
      await prisma.post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return post;
  }

  async listPosts(query: ListPostsQuery) {
    const {page, limit, status, authorId, tagId, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (tagId) {
      where.tags = {
        some: {
          id: tagId,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updatePost(id: string, authorId: string, data: UpdatePostDto) {
    // Check if post exists and belongs to author
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return null;
    }

    if (existingPost.authorId !== authorId) {
      throw new Error('Unauthorized');
    }

    const { tagIds, ...updateData } = data;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        publishedAt:
          data.status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED'
            ? new Date()
            : existingPost.publishedAt,
        tags: tagIds ? {
          set: tagIds.map((tagId) => ({ id: tagId })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return updatedPost;
  }

  async deletePost(id: string, authorId: string) {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return null;
    }

    if (existingPost.authorId !== authorId) {
      throw new Error('Unauthorized');
    }

    await prisma.post.delete({
      where: { id },
    });

    return true;
  }

  async getPostsByAuthor(authorId: string) {
    return prisma.post.findMany({
      where: { authorId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }
}

export const postService = new PostService();
