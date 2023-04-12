Sync an organization's GitHub repo list and permissions to a Notion DB

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Development](#development)
  - [Setup](#setup)
  - [Running](#running)
- [Deployment](#deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Development

### Setup

```sh
git clone https://github.com/temporalio/github-repo-notion-sync.git
cd github-repo-notion-sync
npm i
```

### Running

```
temporal server start-dev
```

```
NOTION_TOKEN="foo" GITHUB_TOKEN="bar" npm start
```

If you need to check how many calls to the GitHub API you have left, run:

```sh
GITHUB_TOKEN="bar" USER="github_username" npm run check-rate-limit
```

## Deployment

- Get a [Cloud account](https://temporal.io/cloud) 
- Deploy this repo somewhere that supports long-running Node processes
- Set these env vars:

```
NOTION_TOKEN="<notion integration token>"
GITHUB_TOKEN="<personal access token with org read permissions>"
NODE_ENV="production"
TEMPORAL_CLOUD_CERT="-----BEGIN CERTIFICATE----- EUsd..."
TEMPORAL_CLOUD_KEY="-----BEGIN PRIVATE KEY----- LQaz..."
```