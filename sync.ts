import { proxyActivities } from '@temporalio/workflow'
import type * as activities from './activities'
import type { GithubRepoWithContributorsAndAccessLists, Repo } from './types'

const {
  updateNotion,
  getRepos,
  getTeammates,
  addContributors,
  addCollaboratorsAndTeams,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '10m',
})

export async function syncGithubToNotion() {
  const [repos, teammates] = await Promise.all([getRepos(), getTeammates()])
  const withContributors = await addContributors(repos)
  const completeRepos = await addCollaboratorsAndTeams(
    withContributors,
    teammates
  )
  const transformedRepos = transformRepos(completeRepos)
  console.log('Total repo count:', repos.length)
  await updateNotion(transformedRepos)
}

function transformRepos(
  repos: GithubRepoWithContributorsAndAccessLists[]
): Repo[] {
  return repos.map((repo) => ({
    name: repo.name,
    stars: repo.stargazers_count,
    about: repo.description,
    issues: repo.open_issues,
    language: repo.language || '',
    contributors: repo.contributors,
    teamAccess: repo.teamAccess,
    individualAccess: repo.individualAccess,
  }))
}
