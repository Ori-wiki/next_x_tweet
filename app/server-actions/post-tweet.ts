'use server';

export async function postTweet(formData: FormData) {
  const content = formData.get('content');
  console.log(content);
}
