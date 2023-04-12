import fetch from 'node-fetch'

async function checkRateLimit() {
  // https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#checking-your-rate-limit-status
  const response = await fetch(
    `https://api.github.com/users/${process.env.USER}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )

  const limit = response.headers.get('x-ratelimit-limit')
  const remaining = response.headers.get('x-ratelimit-remaining')
  const used = response.headers.get('x-ratelimit-used')
  const reset = response.headers.get('x-ratelimit-reset')
  console.log('limit:', limit)
  console.log('remaining:', remaining)
  console.log('used:', used)
  console.log(
    'reset:',
    new Date(parseInt(reset as string) * 1000).toLocaleString()
  )
}

checkRateLimit()
