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
			<h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">Profile @{username}</h1>
		</div>
	)
}
