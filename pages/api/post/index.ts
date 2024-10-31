import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import {getServerSession} from 'next-auth';
import { options as authOptions } from "../auth/[...nextauth]"

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content } = req.body;
  const session = await getServerSession(req, res, authOptions);
  // const session = await getSession({req});
  // 用getSession会报错是因为req有body字段，getSession方法调用了fetchData方法，fetchData方法中写到如果req.body存在就用post请求，但post方法请求auth/session会报错。

  console.log(session);
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email}}
    }
  });
  res.json(result);
}
