export async function getRepos() {
  const repos = []
  let page = 1
  while (true) {
    // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28
    const batch = await (
      await fetch(
        `https://api.github.com/orgs/temporalio/repos?type=all&per_page=100&page=${page}`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${Deno.env.get('GITHUB_TOKEN')}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      )
    ).json()
    if (batch.length === 0) {
      return repos
    }

    repos.push(...batch)
    page++
  }
}
