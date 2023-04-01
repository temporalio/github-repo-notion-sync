import { Client, collectPaginatedAPI } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Repo } from './types'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id =
  process.env.NOTION_DATABASE_ID || '3aa5a298de95439799316fca0d8a765c'

// example page:
// {
//   object: "page",
//   id: "999a8de3-947c-4f0a-a613-c8d1554d2d7a",
//   created_time: "2023-01-30T23:56:00.000Z",
//   last_edited_time: "2023-01-31T00:01:00.000Z",
//   created_by: { object: "user", id: "870957ba-663e-4592-b234-a09d88d7561e" },
//   last_edited_by: { object: "user", id: "870957ba-663e-4592-b234-a09d88d7561e" },
//   cover: null,
//   icon: null,
//   parent: { type: "database_id", database_id: "3aa5a298-de95-4397-9931-6fca0d8a765c" },
//   archived: false,
//   properties: {
//     Owner: { id: "%3BmIF", type: "multi_select", multi_select: [ [Object] ] },
//     PRs: { id: "HuG%5E", type: "number", number: null },
//     Admins: { id: "hzq%5C", type: "multi_select", multi_select: [ [Object], [Object] ] },
//     About: { id: "ltIU", type: "rich_text", rich_text: [ [Object] ] },
//     Issues: { id: "tzaR", type: "number", number: null },
//     Stars: { id: "%7Cd%3AE", type: "number", number: null },
//     Name: { id: "title", type: "title", title: [ [Object] ] }
//   },
//   url: "https://www.notion.so/sdk-typescript-999a8de3947c4f0aa613c8d1554d2d7a"
// }
export async function updateNotion(repos: Repo[]) {
  const pages = (await collectPaginatedAPI(notion.databases.query, {
    database_id,
  })) as PageObjectResponse[]

  const pagesByName: Record<string, PageObjectResponse> = {}
  for (const page of pages) {
    const name = (page.properties.Name as any).title[0]?.plain_text
    pagesByName[name] = page
  }

  // update or create pages
  for (const repo of repos) {
    const page = pagesByName[repo.name]
    const isNewRepo = !page
    try {
      if (isNewRepo) {
        console.log(`creating repo: ${repo.name}`)
        await notion.pages.create({
          parent: {
            type: 'database_id',
            database_id,
          },
          properties: getProperties(repo),
        })
      } else {
        console.log(`updating repo: ${repo.name}`)
        await notion.pages.update({
          page_id: page.id,
          properties: getProperties(repo),
        })
      }
    } catch (e) {
      console.error('Error talking to Notion API:', e)
    }
  }

  // remove repos that no longer exist
  // const repoNames = new Set(repos.map((repo) => repo.name))
  // for (const page of pages) {
  //   const name = page.properties.Name.title[0]?.plain_text
  //   if (!repoNames.has(name)) {
  //     console.log(`archiving repo: ${name}`)
  //     await notion.pages.update({
  //       page_id: page.id,
  //       archived: true,
  //     })
  //   }
  // }
}

function getProperties(repo: Repo) {
  return {
    Name: {
      title: [
        {
          text: {
            content: repo.name,
            link: { url: `https://github.com/temporalio/${repo.name}` },
          },
        },
      ],
    },
    About: {
      rich_text: [
        {
          text: {
            content: repo.about || '',
          },
        },
      ],
    },
    'Issues & PRs': {
      number: repo.issues,
    },
    Stars: {
      number: repo.stars,
    },
    'Top contributors': {
      multi_select: repo.contributors.map((contributor) => ({
        name: contributor.name,
      })),
    },
    ...(repo.language && {
      Lang: {
        select: {
          name: repo.language,
        },
      },
    }),
    'Team admins': {
      multi_select: repo.teamAccess.admin.map((team) => ({
        name: team,
      })),
    },
    'Individual admins': {
      multi_select: repo.individualAccess.admin.map((user) => ({
        name: user.name,
      })),
    },
    'Teams with role: maintain': {
      multi_select: repo.teamAccess.maintain.map((team) => ({
        name: team,
      })),
    },
    'Individuals with role: maintain': {
      multi_select: repo.individualAccess.maintain.map((user) => ({
        name: user.name,
      })),
    },
    'Teams with role: triage': {
      multi_select: repo.teamAccess.triage.map((team) => ({
        name: team,
      })),
    },
    'Individuals with role: triage': {
      multi_select: repo.individualAccess.triage.map((user) => ({
        name: user.name,
      })),
    },
    'Teams with role: write': {
      multi_select: repo.teamAccess.push.map((team) => ({
        name: team,
      })),
    },
    'Individuals with role: write': {
      multi_select: repo.individualAccess.write.map((user) => ({
        name: user.name,
      })),
    },
    'Teams with role: read': {
      multi_select: repo.teamAccess.pull.map((team) => ({
        name: team,
      })),
    },
    'Individuals with role: read': {
      multi_select: repo.individualAccess.read.map((user) => ({
        name: user.name,
      })),
    },
  }
}
