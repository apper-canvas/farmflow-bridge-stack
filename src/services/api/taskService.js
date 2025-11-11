import { getApperClient } from "@/services/apperClient";

const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.dueDate_c,
        priority: task.priority_c,
        completed: task.completed_c,
        recurring: task.recurring_c,
        farmId: task.farmId_c?.Id?.toString() || "",
        createdAt: task.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.getRecordById('tasks_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success || !response.data) {
        console.error("Error fetching task:", response.message);
        return null;
      }

      // Transform database fields to match UI expectations
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.dueDate_c,
        priority: task.priority_c,
        completed: task.completed_c,
        recurring: task.recurring_c,
        farmId: task.farmId_c?.Id?.toString() || "",
        createdAt: task.CreatedOn
      };
    } catch (error) {
      console.error("Error fetching task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "farmId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId)]
        }]
      });

      if (!response.success) {
        console.error("Error fetching tasks by farm:", response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.dueDate_c,
        priority: task.priority_c,
        completed: task.completed_c,
        recurring: task.recurring_c,
        farmId: task.farmId_c?.Id?.toString() || "",
        createdAt: task.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching tasks by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getUpcoming() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {
            "FieldName": "completed_c",
            "Operator": "EqualTo",
            "Values": [false]
          },
          {
            "FieldName": "dueDate_c",
            "Operator": "LessThanOrEqualTo",
            "Values": [nextWeek.toISOString()]
          }
        ]
      });

      if (!response.success) {
        console.error("Error fetching upcoming tasks:", response.message);
        return [];
      }

      // Transform and filter
      const tasks = response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.dueDate_c,
        priority: task.priority_c,
        completed: task.completed_c,
        recurring: task.recurring_c,
        farmId: task.farmId_c?.Id?.toString() || "",
        createdAt: task.CreatedOn
      }));

      // Filter and sort by due date
      return tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= now;
      }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.createRecord('tasks_c', {
        records: [{
          Name: taskData.title || "",
          title_c: taskData.title || "",
          description_c: taskData.description || "",
          dueDate_c: taskData.dueDate || "",
          priority_c: taskData.priority || "medium",
          completed_c: false,
          recurring_c: taskData.recurring || false,
          farmId_c: parseInt(taskData.farmId) || null
        }]
      });

      if (!response.success) {
        console.error("Error creating task:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
        }
        
        if (successful.length > 0) {
          const task = successful[0].data;
          return {
            Id: task.Id,
            title: task.title_c,
            description: task.description_c,
            dueDate: task.dueDate_c,
            priority: task.priority_c,
            completed: task.completed_c,
            recurring: task.recurring_c,
            farmId: task.farmId_c?.Id?.toString() || "",
            createdAt: task.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.updateRecord('tasks_c', {
        records: [{
          Id: parseInt(id),
          Name: taskData.title || "",
          title_c: taskData.title || "",
          description_c: taskData.description || "",
          dueDate_c: taskData.dueDate || "",
          priority_c: taskData.priority || "medium",
          completed_c: taskData.completed !== undefined ? taskData.completed : false,
          recurring_c: taskData.recurring !== undefined ? taskData.recurring : false,
          farmId_c: parseInt(taskData.farmId) || null
        }]
      });

      if (!response.success) {
        console.error("Error updating task:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
        }
        
        if (successful.length > 0) {
          const task = successful[0].data;
          return {
            Id: task.Id,
            title: task.title_c,
            description: task.description_c,
            dueDate: task.dueDate_c,
            priority: task.priority_c,
            completed: task.completed_c,
            recurring: task.recurring_c,
            farmId: task.farmId_c?.Id?.toString() || "",
            createdAt: task.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current task
      const currentTask = await this.getById(id);
      if (!currentTask) {
        console.error("Task not found");
        return null;
      }

      // Update with toggled completed status
      return await this.update(id, {
        ...currentTask,
        completed: !currentTask.completed
      });
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return false;
      }

      const response = await apperClient.deleteRecord('tasks_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting task:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default taskService;