type PostLike = {
	id: string;
};

export function getPostRouteId(post: PostLike): string {
	return post.id;
}

export function getPostUrl(post: PostLike): string {
	return `/blog/${getPostRouteId(post)}`;
}

export function getPostOgImagePath(post: PostLike): string {
	return `/og/${getPostRouteId(post)}.png`;
}
