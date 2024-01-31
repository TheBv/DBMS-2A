import { scheduleJob, Job, scheduledJobs } from 'node-schedule';
import { db, sendPushNotification } from '.';

export const jobs = scheduledJobs

export function scheduleJobs() {
    db.query.questions.findMany().then((questions) => {
        for (const question of questions) {
            if (!question.timing_rule || scheduledJobs[question.id])
                continue
            const date = new Date(question.timing_rule)
            if (isValidDate(date)) {
                scheduleJob(question.id.toString(), date, () => {
                    sendPushNotification(question)
                    delete scheduledJobs[question.id]
                })
            } else {
                // For now we are only allowing dates and no cron expressions so this shouldn't get called
                scheduleJob(question.timing_rule, () => {
                    sendPushNotification(question)
                    delete scheduledJobs[question.id]
                })
            }
        }
        console.log("Scheduled jobs", scheduledJobs)
    }).catch((err) => {
        console.log(err)
    })
    
}

function isValidDate(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
}