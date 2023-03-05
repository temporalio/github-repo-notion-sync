import type { GithubRepo, GithubRepoWithContributors, User } from './types.ts'

const fetchGithubAPI = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${Deno.env.get('GITHUB_TOKEN')}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (response.body === null) {
    return []
  }

  return await response.json().catch((e) => console.log(response, e))
}

export async function getRepos() {
  const repos = []
  let page = 1
  while (true) {
    // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28
    const batch = await fetchGithubAPI(
      `https://api.github.com/orgs/temporalio/repos?type=all&per_page=100&page=${page}`
    )

    if (!Array.isArray(batch)) {
      console.log('batch:', typeof batch)
      console.log('batch:', batch)
      throw new Error('GH API returned non-array')
    }

    if (batch.length === 0) {
      return repos
    }

    repos.push(...batch)
    page++
  }
}

export async function addContributors(
  repos: GithubRepo[]
): Promise<GithubRepoWithContributors[]> {
  return await Promise.all(
    repos.map(async (repo) => {
      // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-contributors
      const response = await fetchGithubAPI(
        `https://api.github.com/repos/temporalio/${repo.name}/contributors?per_page=3`
      )

      const contributors: User[] = await Promise.all(
        response.map(
          async (contributor: {
            url: string
            login: string
          }): Promise<User> => {
            const user = await fetchGithubAPI(contributor.url)
            return {
              url: contributor.url,
              name: user.name || contributor.login,
            }
          }
        )
      )

      return { ...repo, contributors }
    })
  )
}

// export async function addTeams(
//   repos: GithubRepo[]
// ): Promise<GithubRepoWithContributors[]> {
//   return await Promise.all(
//     repos.map(async (repo) => {
//       // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-contributors
//       const response = await fetchGithubAPI(
//         `https://api.github.com/repos/temporalio/${repo.name}/contributors?per_page=3`
//       )

//       const contributors: User[] = await Promise.all(
//         response.map(
//           async (contributor: {
//             url: string
//             login: string
//           }): Promise<User> => {
//             const user = await fetchGithubAPI(contributor.url)
//             return {
//               url: contributor.url,
//               name: user.name || contributor.login,
//             }
//           }
//         )
//       )

//       return { ...repo, contributors }
//     })
//   )
// }
