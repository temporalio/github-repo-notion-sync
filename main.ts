import { NativeConnection, Worker } from '@temporalio/worker'
import * as activities from './activities'
import { getConnectionOptions, namespace, taskQueue } from './connection'
import { createOrUpdateSchedule } from './create-or-update-schedule'

async function run() {
  const connection = await NativeConnection.connect(getConnectionOptions())
  const worker = await Worker.create({
    workflowsPath: require.resolve('./sync'),
    activities,
    connection,
    namespace,
    taskQueue,
  })

  await Promise.all([worker.run(), createOrUpdateSchedule()])
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
