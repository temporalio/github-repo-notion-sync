export interface Repo {
  name: string
  about?: string
  language: string
  stars: number
  issues: number
  contributors: User[]
  teamAccess: TeamAccess
  individualAccess: IndividualAccess
}

// example GitHub repo:
// {
//   id: 595346044,
//   node_id: "R_kgDOI3xCfA",
//   name: "github-repo-notion-sync",
//   full_name: "temporalio/github-repo-notion-sync",
//   private: false,
//   owner: {
//     login: "temporalio",
//     id: 56493103,
//     node_id: "MDEyOk9yZ2FuaXphdGlvbjU2NDkzMTAz",
//     avatar_url: "https://avatars.githubusercontent.com/u/56493103?v=4",
//     gravatar_id: "",
//     url: "https://api.github.com/users/temporalio",
//     html_url: "https://github.com/temporalio",
//     followers_url: "https://api.github.com/users/temporalio/followers",
//     following_url: "https://api.github.com/users/temporalio/following{/other_user}",
//     gists_url: "https://api.github.com/users/temporalio/gists{/gist_id}",
//     starred_url: "https://api.github.com/users/temporalio/starred{/owner}{/repo}",
//     subscriptions_url: "https://api.github.com/users/temporalio/subscriptions",
//     organizations_url: "https://api.github.com/users/temporalio/orgs",
//     repos_url: "https://api.github.com/users/temporalio/repos",
//     events_url: "https://api.github.com/users/temporalio/events{/privacy}",
//     received_events_url: "https://api.github.com/users/temporalio/received_events",
//     type: "Organization",
//     site_admin: false
//   },
//   html_url: "https://github.com/temporalio/github-repo-notion-sync",
//   description: "Sync an organization's GitHub repo list to a Notion DB",
//   fork: false,
//   url: "https://api.github.com/repos/temporalio/github-repo-notion-sync",
//   forks_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/forks",
//   keys_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/keys{/key_id}",
//   collaborators_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/collaborators{/collaborator}",
//   teams_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/teams",
//   hooks_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/hooks",
//   issue_events_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/issues/events{/number}",
//   events_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/events",
//   assignees_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/assignees{/user}",
//   branches_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/branches{/branch}",
//   tags_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/tags",
//   blobs_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/git/blobs{/sha}",
//   git_tags_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/git/tags{/sha}",
//   git_refs_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/git/refs{/sha}",
//   trees_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/git/trees{/sha}",
//   statuses_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/statuses/{sha}",
//   languages_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/languages",
//   stargazers_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/stargazers",
//   contributors_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/contributors",
//   subscribers_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/subscribers",
//   subscription_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/subscription",
//   commits_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/commits{/sha}",
//   git_commits_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/git/commits{/sha}",
//   comments_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/comments{/number}",
//   issue_comment_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/issues/comments{/number}",
//   contents_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/contents/{+path}",
//   compare_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/compare/{base}...{head}",
//   merges_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/merges",
//   archive_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/{archive_format}{/ref}",
//   downloads_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/downloads",
//   issues_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/issues{/number}",
//   pulls_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/pulls{/number}",
//   milestones_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/milestones{/number}",
//   notifications_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/notifications{?since,all,participati...",
//   labels_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/labels{/name}",
//   releases_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/releases{/id}",
//   deployments_url: "https://api.github.com/repos/temporalio/github-repo-notion-sync/deployments",
//   created_at: "2023-01-30T22:22:24Z",
//   updated_at: "2023-01-30T22:22:24Z",
//   pushed_at: "2023-01-30T22:22:25Z",
//   git_url: "git://github.com/temporalio/github-repo-notion-sync.git",
//   ssh_url: "git@github.com:temporalio/github-repo-notion-sync.git",
//   clone_url: "https://github.com/temporalio/github-repo-notion-sync.git",
//   svn_url: "https://github.com/temporalio/github-repo-notion-sync",
//   homepage: null,
//   size: 1,
//   stargazers_count: 0,
//   watchers_count: 0,
//   language: null,
//   has_issues: true,
//   has_projects: true,
//   has_downloads: true,
//   has_wiki: true,
//   has_pages: false,
//   has_discussions: false,
//   forks_count: 0,
//   mirror_url: null,
//   archived: false,
//   disabled: false,
//   open_issues_count: 0,
//   license: {
//     key: "mit",
//     name: "MIT License",
//     spdx_id: "MIT",
//     url: "https://api.github.com/licenses/mit",
//     node_id: "MDc6TGljZW5zZTEz"
//   },
//   allow_forking: true,
//   is_template: false,
//   web_commit_signoff_required: false,
//   topics: [],
//   visibility: "public",
//   forks: 0,
//   open_issues: 0,
//   watchers: 0,
//   default_branch: "main",
//   permissions: { admin: true, maintain: true, push: true, triage: true, pull: true }
// }
export interface GithubRepo {
  id: number
  name: string
  description: string
  stargazers_count: number
  open_issues: number
  language: string | null
}

export interface GithubRepoWithContributors extends GithubRepo {
  contributors: User[]
}

export interface GithubRepoWithContributorsAndAccessLists
  extends GithubRepoWithContributors {
  teamAccess: TeamAccess
  individualAccess: IndividualAccess
}

export interface IndividualAccess {
  read: User[]
  triage: User[]
  write: User[]
  maintain: User[]
  admin: User[]
}

export interface TeamAccess {
  pull: string[]
  triage: string[]
  push: string[]
  maintain: string[]
  admin: string[]
}

export interface User {
  name: string
  url: string
}

// export interface CollaboratorPermissions {
//   pull: boolean
//   triage: boolean
//   push: boolean
//   maintain: boolean
//   admin: boolean
// }
