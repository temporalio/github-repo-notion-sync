import { Connection, Client } from '@temporalio/client'
import { syncGithubToNotion } from './sync'
import { getConnectionOptions, namespace, taskQueue } from './connection'

const scheduleId = 'gh-notion-sync'

// use any because ScheduleUpdateOptions doesn't have scheduleId and the action type is different
// https://github.com/temporalio/sdk-typescript/issues/1092
const scheduleOptions: any = {
  action: {
    type: 'startWorkflow',
    workflowType: syncGithubToNotion,
    taskQueue,
    workflowId: scheduleId,
  },
  scheduleId,
  spec: {
    // intervals: [{ every: '5m' }],
    calendars: [
      {
        comment: 'daily at 6am',
        hour: 6,
      },
    ],
  },
}

export async function createOrUpdateSchedule() {
  const client = new Client({
    connection: await Connection.connect(getConnectionOptions()),
    namespace,
  })

  try {
    // https://typescript.temporal.io/api/classes/client.ScheduleClient#create
    const schedule = await client.schedule.create(scheduleOptions)
  } catch (e) {
    if (
      typeof e === 'object' &&
      e !== null &&
      'name' in e &&
      e.name === 'ScheduleAlreadyRunning'
    ) {
      const handle = client.schedule.getHandle(scheduleId)
      await handle.update(() => scheduleOptions)
      await client.connection.close()
      return
    }

    throw e
  }
}
