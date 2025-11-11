import { getApperClient } from "@/services/apperClient";

const financialService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('financialEntries_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching financial entries:", response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(entry => ({
        Id: entry.Id,
        type: entry.type_c,
        amount: entry.amount_c,
        category: entry.category_c,
        description: entry.description_c,
        date: entry.date_c,
        farmId: entry.farmId_c?.Id?.toString() || "",
        createdAt: entry.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching financial entries:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById('financialEntries_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success || !response.data) {
        console.error("Error fetching financial entry:", response.message);
        return null;
      }

      // Transform database fields to match UI expectations
      const entry = response.data;
      return {
        Id: entry.Id,
        type: entry.type_c,
        amount: entry.amount_c,
        category: entry.category_c,
        description: entry.description_c,
        date: entry.date_c,
        farmId: entry.farmId_c?.Id?.toString() || "",
        createdAt: entry.CreatedOn
      };
    } catch (error) {
      console.error("Error fetching financial entry:", error?.response?.data?.message || error);
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

      const response = await apperClient.fetchRecords('financialEntries_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
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
        console.error("Error fetching financial entries by farm:", response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(entry => ({
        Id: entry.Id,
        type: entry.type_c,
        amount: entry.amount_c,
        category: entry.category_c,
        description: entry.description_c,
        date: entry.date_c,
        farmId: entry.farmId_c?.Id?.toString() || "",
        createdAt: entry.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching financial entries by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getSummary() {
    try {
      const entries = await this.getAll();
      
      const summary = entries.reduce((acc, entry) => {
        if (entry.type === "income") {
          acc.totalIncome += entry.amount;
        } else {
          acc.totalExpenses += entry.amount;
        }
        return acc;
      }, { totalIncome: 0, totalExpenses: 0 });

      summary.netBalance = summary.totalIncome - summary.totalExpenses;
      return summary;
    } catch (error) {
      console.error("Error calculating financial summary:", error);
      return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    }
  },

  async create(entryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.createRecord('financialEntries_c', {
        records: [{
          Name: entryData.description || "",
          type_c: entryData.type || "expense",
          amount_c: parseFloat(entryData.amount) || 0,
          category_c: entryData.category || "",
          description_c: entryData.description || "",
          date_c: entryData.date || new Date().toISOString(),
          farmId_c: parseInt(entryData.farmId) || null
        }]
      });

      if (!response.success) {
        console.error("Error creating financial entry:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} financial entries:`, failed);
        }
        
        if (successful.length > 0) {
          const entry = successful[0].data;
          return {
            Id: entry.Id,
            type: entry.type_c,
            amount: entry.amount_c,
            category: entry.category_c,
            description: entry.description_c,
            date: entry.date_c,
            farmId: entry.farmId_c?.Id?.toString() || "",
            createdAt: entry.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating financial entry:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, entryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.updateRecord('financialEntries_c', {
        records: [{
          Id: parseInt(id),
          Name: entryData.description || "",
          type_c: entryData.type || "expense",
          amount_c: parseFloat(entryData.amount) || 0,
          category_c: entryData.category || "",
          description_c: entryData.description || "",
          date_c: entryData.date || new Date().toISOString(),
          farmId_c: parseInt(entryData.farmId) || null
        }]
      });

      if (!response.success) {
        console.error("Error updating financial entry:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} financial entries:`, failed);
        }
        
        if (successful.length > 0) {
          const entry = successful[0].data;
          return {
            Id: entry.Id,
            type: entry.type_c,
            amount: entry.amount_c,
            category: entry.category_c,
            description: entry.description_c,
            date: entry.date_c,
            farmId: entry.farmId_c?.Id?.toString() || "",
            createdAt: entry.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating financial entry:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('financialEntries_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting financial entry:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} financial entries:`, failed);
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting financial entry:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default financialService;