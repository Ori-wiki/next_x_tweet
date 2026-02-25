import type { Metadata } from 'next'

type Params = { username: string }

export async function generateMetadata({
	params
}: {
	params: Promise<Params>
}): Promise<Metadata> {
	return {
		title: '@' + (await params).username
	}
}

export default async function TestPage({
	params
}: {
	params: Promise<Params>
}) {
	const { username } = await params

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Profile @{username}</h1>
		</div>
	)
}
