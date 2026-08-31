import { ProjectStageTaskCreateRequest, ProjectStageTaskReorderRequest, ProjectStageTaskUpdateRequest } from '../../types/local/project-stage-task';
import { db } from '../../database';
import { ProjectStageCreateRequest, ProjectStageUpdateRequest } from '../../types/local/project-stage';

export class ProjectStageTaskService {
    // async getStageById(stageId: string) {
    //     try {
    //         return await db.local.stage.findFirst({
    //             where: { id: stageId }
    //         })
    //     } catch (error) {
    //         console.error('Error creating project stage:', error);
    //         throw new Error('Failed to create project stage');
    //     }
    // }
    async normalizeStageTaskIndexes(stageId: string) {
        // Get all tasks in order
        const tasks = await db.local.task.findMany({
            where: { stageId },
            orderBy: { index: "asc" },
            select: { id: true },
        });

        if (tasks.length === 0) return;

        // Build all update operations
        const updates = tasks.map((task, i) =>
            db.local.task.update({
                where: { id: task.id },
                data: { index: (i + 1) * 100 },
            })
        );

        // Run them in one atomic transaction
        await db.local.$transaction(updates);

        console.log(`Normalized ${tasks.length} tasks successfully`);
    }

    async lastTask(stageId: string) {
        try {
            return await db.local.task.findFirst({
                where: { stageId },
                orderBy: { index: "desc" },
                select: { index: true }
            })
        } catch (error) {
            console.error("Error finding last created task for stage.");
            throw new Error("Failed to find last created task!")
        }
    }
    async createTask(taskData: Partial<ProjectStageTaskCreateRequest>) {
        try {
            const { stageId, assignees, title, ...rest } = taskData;
            return await db.local.task.create({
                data: {
                    title,
                    ...rest,
                    stage: {
                        connect: { id: stageId }
                    },
                    ...(assignees && assignees.length > 0 && {
                        assignees: {
                            connect: assignees.map((a) => ({ id: a.id }))
                        }
                    })
                }
            })
        } catch (error) {
            console.error('Error creating project task:', error);
            throw new Error('Failed to create project task');
        }
    }
    async updateTask(taskData: ProjectStageTaskUpdateRequest, taskId: string) {
        try {
            const { stageId, assignees, ...rest } = taskData;

            return await db.local.task.update({
                where: { id: taskId },
                data: {
                    ...rest,
                    ...(stageId && {
                        stage: {
                            connect: { id: stageId }
                        }
                    }),
                    ...(assignees && assignees.length > 0 && {
                        assignees: {
                            set: assignees
                        }
                    })
                }
            });
        } catch (error) {
            console.error('Error updating project stage:', error);
            throw new Error('Failed to update project stage');
        }
    }
    async reorderTask(taskData: ProjectStageTaskReorderRequest, taskId: string) {
        try {
            const { stageId, prevTaskId, nextTaskId } = taskData;

            // find prev and next indexes
            const [prevTask, nextTask] = await Promise.all([
                prevTaskId ? db.local.task.findUnique({ where: { id: prevTaskId }, select: { index: true } }) : null,
                nextTaskId ? db.local.task.findUnique({ where: { id: nextTaskId }, select: { index: true } }) : null,
            ]);

            let newIndex: number;

            if (prevTask && nextTask) newIndex = (prevTask.index + nextTask.index) / 2;
            else if (prevTask && !nextTask) newIndex = prevTask.index + 100;
            else if (!prevTask && nextTask) newIndex = nextTask.index / 2;
            else newIndex = 100;

            if (newIndex < 2) {
                console.log("Index too small, normalizing...");
                await this.normalizeStageTaskIndexes(stageId);

                // after normalization, recalc new index again
                const lastTask = await db.local.task.findFirst({
                    where: { stageId },
                    orderBy: { index: "desc" },
                    select: { index: true },
                });
                newIndex = lastTask ? lastTask.index + 100 : 100;
            }

            return await db.local.task.update({
                where: { id: taskId },
                data: {
                    index: newIndex,
                    stage: {
                        connect: { id: stageId }
                    }
                }
            });
        } catch (error) {
            console.error('Error reordering stage task:', error);
            throw new Error('Failed to reorder stage task');
        }
    }
    async deleteProjectStageTask(taskId: string) {
        try {
            return await db.local.task.delete({
                where: { id: taskId }
            })
        } catch (error) {
            console.error('Error deleting project stage task:', error);
            throw new Error('Failed to delete project stage task');
        }
    }
}

export const projectStageTaskService = new ProjectStageTaskService();