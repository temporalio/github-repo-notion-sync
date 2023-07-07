import { Connection, Client } from '@temporalio/client'
import { NativeConnection, Worker } from '@temporalio/worker'
import * as activities from './activities'
import { getConnectionOptions, namespace, taskQueue } from './connection'
import { syncGithubToNotion } from './sync'

async function run() {
  const connection = await NativeConnection.connect(getConnectionOptions())
  const worker = await Worker.create({
    workflowsPath: require.resolve('./sync'),
    activities,
    connection,
    namespace,
    taskQueue,
  })

  await Promise.race([worker.run(), runOnce().then(() => worker.shutdown())])
}

async function runOnce() {
  const client = new Client({
    connection: await Connection.connect(getConnectionOptions()),
    namespace,
  })
  await client.workflow.start(syncGithubToNotion, {
    workflowId: 'sync-once',
    taskQueue,
  })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
