import { revalidateTag } from 'next/cache';

export async function POST() {
  revalidateTag('site-settings');
  return Response.json({ revalidated: true });
}
