import { getRepos } from './github.ts'
import { updateNotion } from './notion.ts'

export async function syncGithubToNotion() {
  const repos = await getRepos()
  console.log('repos:', repos)
  console.log('repos:', repos.length)
  // await updateNotion(repos)
  // await updateNotion([
  //   { name: 'sdk-typescript', stars: 10, issues: 1, prs: 2 },
  //   {
  //     name: 'samples-typescript',
  //     stars: 20,
  //     about: 'best samples',
  //     issues: 5,
  //     prs: 6,
  //   },
  // ])
}
