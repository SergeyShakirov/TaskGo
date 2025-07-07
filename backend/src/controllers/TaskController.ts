import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Op } from 'sequelize';

export class TaskController {
  // Get all tasks with filters
  async getTasks(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        priority,
        categoryId,
        clientId,
        contractorId,
        search
      } = req.query;

      const where: any = {};

      // Apply filters
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (categoryId) where.categoryId = categoryId;
      if (clientId) where.clientId = clientId;
      if (contractorId) where.contractorId = contractorId;

      // Search in title and description
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { shortDescription: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { rows: tasks, count } = await Task.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'name', 'email', 'avatar']
          },
          {
            model: User,
            as: 'contractor',
            attributes: ['id', 'name', 'email', 'avatar', 'rating']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'icon']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          tasks,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(count / Number(limit)),
            totalItems: count,
            itemsPerPage: Number(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get tasks',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get single task by ID
  async getTask(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const task = await Task.findByPk(id, {
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'name', 'email', 'avatar', 'phone']
          },
          {
            model: User,
            as: 'contractor',
            attributes: ['id', 'name', 'email', 'avatar', 'rating', 'completedTasks']
          },
          {
            model: Category,
            as: 'category'
          }
        ]
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error getting task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get task',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Create new task
  async createTask(req: Request, res: Response) {
    try {
      const taskData = req.body;

      // Validate required fields
      const requiredFields = ['title', 'shortDescription', 'clientId', 'categoryId'];
      for (const field of requiredFields) {
        if (!taskData[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`
          });
        }
      }

      // Verify client exists
      const client = await User.findByPk(taskData.clientId);
      if (!client) {
        return res.status(400).json({
          success: false,
          message: 'Client not found'
        });
      }

      // Verify category exists
      const category = await Category.findByPk(taskData.categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }

      const task = await Task.create(taskData);

      // Get created task with associations
      const createdTask = await Task.findByPk(task.id, {
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Category,
            as: 'category'
          }
        ]
      });

      res.status(201).json({
        success: true,
        data: createdTask,
        message: 'Task created successfully'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Update task
  async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      await task.update(updateData);

      // Get updated task with associations
      const updatedTask = await Task.findByPk(id, {
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'name', 'email']
          },
          {
            model: User,
            as: 'contractor',
            attributes: ['id', 'name', 'email', 'rating']
          },
          {
            model: Category,
            as: 'category'
          }
        ]
      });

      res.json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update task',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Delete task
  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      await task.destroy();

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete task',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}
