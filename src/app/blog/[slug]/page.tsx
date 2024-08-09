import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, incrementViewCount } from '@/lib/posts'
import TableOfContents from '@/components/TableOfContents'
import Breadcrumb from '@/components/Breadcrumb'
import CommentSection from '@/components/CommentSection'

const generateId = (children: any) => {
    if (Array.isArray(children)) {
        children = children.join('');
    }
    return typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : '';
};

const components = {
    h2: (props: any) => <h2 id={generateId(props.children)} {...props} />,
    h3: (props: any) => <h3 id={generateId(props.children)} {...props} />,
    h4: (props: any) => <h4 id={generateId(props.children)} {...props} />,
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug)
    await incrementViewCount(params.slug)

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: 'JavaScript', href: '#' },
    ]

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 relative">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-4xl font-bold mb-8 text-white">{post.title}</h1>
            <div className="flex flex-col">
                <div className="w-full">
                    <div className="prose prose-invert max-w-none font-sans">
                        <MDXRemote source={post.content} components={components} />
                    </div>
                    <CommentSection postSlug={params.slug} />
                </div>
                <aside className="fixed top-1/4 right-4 w-64">
                    <TableOfContents />
                </aside>
            </div>
        </div>
    )
}