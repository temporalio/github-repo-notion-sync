import { getRepos, addContributors } from './github.ts'
import { updateNotion } from './notion.ts'
import type { GithubRepoWithContributors, Repo } from './types.ts'

export async function syncGithubToNotion() {
  let repos = await getRepos()
  repos = await addContributors(repos)
  // repos = await addTeams(repos)
  console.log('repos:', transformRepos(repos))
  console.log('repos:', repos.length)
  await updateNotion(transformRepos(repos))
}

function transformRepos(repos: GithubRepoWithContributors[]): Repo[] {
  return repos.map((repo: GithubRepoWithContributors) => ({
    name: repo.name,
    stars: repo.stargazers_count,
    about: repo.description,
    issues: repo.open_issues,
    language: repo.language || '',
    contributors: repo.contributors,
  }))
}
