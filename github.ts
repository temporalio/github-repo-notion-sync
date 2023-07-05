import { axios } from './axios'
import type {
  GithubRepo,
  GithubRepoWithContributors,
  GithubRepoWithContributorsAndAccessLists,
  IndividualAccess,
  TeamAccess,
  User,
} from './types'

const fetchGithubAPI = async (
  url: string,
  opts: Record<string, unknown> = {}
) => {
  const response = await axios
    .get(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      ...opts,
    })
    .catch((error: unknown) => {
      console.log('error fetching:', url, error)
    })
  // console.log('retry-after', response.headers.get('retry-after'))
  // console.log('x-ratelimit-reset', response.headers.get('x-ratelimit-reset'))

  if (!response || response.data === null) {
    return []
  }

  return response.data
}

async function fetchPaginatedGithubAPI(
  url: string,
  opts: Record<string, unknown> = {}
) {
  const results: any[] = []
  let page = 1
  while (true) {
    const batch = await fetchGithubAPI(`${url}per_page=100&page=${page}`, opts)

    if (!Array.isArray(batch)) {
      console.log('batch:', typeof batch)
      console.log('batch:', batch?.documentation_url)
      throw new Error('GH API returned non-array')
    }

    if (batch.length === 0) {
      return results
    }

    results.push(...batch)
    page++
  }
}

export async function getRepos(): Promise<GithubRepo[]> {
  // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28
  return (
    await fetchPaginatedGithubAPI(
      `https://api.github.com/orgs/temporalio/repos?type=all&`,
      { cache: false }
    )
  ).filter((repo) => !repo.archived)
}

export async function getTeammates(): Promise<string[]> {
  // https://docs.github.com/en/rest/orgs/members?apiVersion=2022-11-28#list-organization-members
  const users = await fetchPaginatedGithubAPI(
    `https://api.github.com/orgs/temporalio/members?`,
    { cache: false }
  )

  return users.map((user) => user.login)
}

export async function addContributors(
  repos: GithubRepo[]
): Promise<GithubRepoWithContributors[]> {
  // Don't do in parallel to avoid 403 errors (don't know why they were 403)
  // return await Promise.all(
  //   repos.map(async (repo) => {
  const reposWithContributors = []
  for (const repo of repos) {
    // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-contributors
    const response = await fetchGithubAPI(
      `https://api.github.com/repos/temporalio/${repo.name}/contributors?per_page=3`
    )
    if (!Array.isArray(response)) {
      reposWithContributors.push({ ...repo, contributors: [] })
      continue
    }

    const contributors = await fetchUsers(response)

    // return { ...repo, contributors }
    reposWithContributors.push({ ...repo, contributors })
  }
  return reposWithContributors
}

export async function addCollaboratorsAndTeams(
  repos: GithubRepoWithContributors[],
  teammates: string[]
): Promise<GithubRepoWithContributorsAndAccessLists[]> {
  const results = []
  // Don't do in parallel to avoid 403 errors (don't know why they were 403)
  for (const repoWithoutAccessList of repos) {
    const repo =
      repoWithoutAccessList as GithubRepoWithContributorsAndAccessLists

    // Will work until we have > 100 teams on a repo
    // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-teams
    const teams = await fetchGithubAPI(
      `https://api.github.com/repos/temporalio/${repo.name}/teams?per_page=100`
    )

    repo.teamAccess = {
      pull: [],
      triage: [],
      push: [],
      maintain: [],
      admin: [],
    }
    if (Array.isArray(teams)) {
      for (const team of teams) {
        repo.teamAccess[team.permission as keyof TeamAccess].push(team.name)
      }
    }

    // https://docs.github.com/en/rest/collaborators/collaborators?apiVersion=2022-11-28#list-repository-collaborators
    const collaborators = await fetchPaginatedGithubAPI(
      `https://api.github.com/repos/temporalio/${repo.name}/collaborators?`
    )
    const teammatesSet = new Set(teammates)
    const outsideCollaborators = collaborators.filter(
      (collaborator) => !teammatesSet.has(collaborator.login)
    )

    repo.individualAccess = {
      read: [],
      triage: [],
      write: [],
      maintain: [],
      admin: [],
    }

    await Promise.all(
      outsideCollaborators.map(
        async (collaborator: {
          url: string
          login: string
          role_name: keyof IndividualAccess
        }) => {
          const user = await fetchGithubAPI(collaborator.url)
          repo.individualAccess[collaborator.role_name].push({
            url: collaborator.url,
            name: user.name || collaborator.login,
          })
        }
      )
    )

    results.push(repo)
  }
  return results
}

async function fetchUsers(shallowUsers: any[]): Promise<User[]> {
  return await Promise.all(
    shallowUsers.map(
      async (shallowUser: { url: string; login: string }): Promise<User> => {
        const user = await fetchGithubAPI(shallowUser.url)
        return {
          url: shallowUser.url,
          name: user.name || shallowUser.login,
        }
      }
    )
  )
}
